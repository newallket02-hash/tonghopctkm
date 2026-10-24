/* ==========================================================================
   API chatbot "Hỏi nhanh" — POST /api/chat
   --------------------------------------------------------------------------
   1. Đọc dữ liệu của trang (kich-ban.js, offers.js, branches.js, concepts.js,
      data.js) → chia thành từng đoạn nhỏ.
   2. Tìm các đoạn liên quan nhất tới câu hỏi (không dấu vẫn ra).
   3. Gửi các đoạn đó + câu hỏi cho Groq → trả lời đúng theo kịch bản.
   Biến môi trường trên Vercel:
     GROQ_API_KEY   (bắt buộc)
     GROQ_MODEL     (mặc định openai/gpt-oss-120b)
     GROQ_FALLBACK  (mặc định openai/gpt-oss-20b — dùng khi model chính quá tải)
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const FALLBACK = process.env.GROQ_FALLBACK || 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const ROOT = path.join(__dirname, '..');
const MAX_CTX_CHARS = 9000;
/* Giới hạn token/phút của gói Groq (gói miễn phí: 8000). Groq tính cả prompt + max_completion_tokens vào 1 lần gọi.
   Nâng lên Dev tier thì đặt biến GROQ_TPM trên Vercel (vd 250000) để bot đọc nhiều dữ liệu hơn & suy luận kỹ hơn. */
const TPM = Number(process.env.GROQ_TPM) || 8000;
const BIG = TPM >= 20000;
const OUT_TOKENS = BIG ? 3000 : 1600;
const EFFORT = BIG ? 'medium' : 'low';
const estTok = s => Math.ceil(String(s).length / 2.7);   // ước lượng an toàn cho tiếng Việt/Hàn

/* ---------------- tải dữ liệu (1 lần mỗi instance) ---------------- */
let DB = null;
function read(f) { return fs.readFileSync(path.join(ROOT, f), 'utf8'); }
function loadData() {
  if (DB) return DB;
  const ctx = {};
  vm.createContext(ctx);
  for (const f of ['kich-ban.js', 'offers.js', 'branches.js', 'concepts.js', 'data.js']) {
    vm.runInContext(read(f), ctx, { filename: f });
  }
  const d = vm.runInContext('({KICHBAN, OFFERS, HOLIDAYS, BRANCHES, CONCEPTS, TOPICS})', ctx);
  // danh sách tài khoản lấy thẳng từ index.html → chỉ một nơi quản lý
  const m = read('index.html').match(/const USERS = (\{.*?\});/);
  d.USERS = m ? JSON.parse(m[1]) : {};
  DB = d;
  return d;
}

/* ---------------- tiện ích chữ ---------------- */
const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase().replace(/[^a-z0-9\uac00-\ud7a3]+/g, ' ').trim();
const STOP = new Set('a ah ak ạ da vay the nao gi khong ko k co cho minh ben em anh chi la va voi thi duoc dc nhe nha oi o cua mot nhung cac ban hoi ve bao nhieu hom nay'.split(' '));
const toks = s => norm(s).split(' ').filter(t => t && (t.length > 1 || /\d/.test(t)) && !STOP.has(t));
const clean = s => String(s || '').replace(/\*\*/g, '');

function flatten(x, out = []) {
  if (x == null) return out;
  if (typeof x === 'string' || typeof x === 'number') { out.push(clean(x)); return out; }
  if (Array.isArray(x)) { x.forEach(v => flatten(v, out)); return out; }
  if (typeof x === 'object') {
    if (x.head && x.rows) {               // bảng
      out.push(x.head.map(clean).join(' | '));
      x.rows.forEach(r => out.push(r.map(clean).join(' | ')));
      return out;
    }
    for (const [k, v] of Object.entries(x)) {
      if (['id', 'icon', 'tone', 'tag', 'questions'].includes(k)) continue;
      flatten(v, out);
    }
  }
  return out;
}

/* ---------------- ngày giờ VN ---------------- */
function todayVN() {
  const s = new Date().toLocaleString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
  return s.slice(0, 10);
}
const WD = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
const addDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
const fmt = d => d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : '';

/* ---------------- chia đoạn ---------------- */
function buildChunks(d, today) {
  const chunks = [];
  const add = (src, br, title, text, boost = 1) => {
    if (!text || !text.trim()) return;
    chunks.push({ src, br: br || 'Chung', title, text, boost, tk: toks(title + ' ' + text), tt: new Set(toks(title)) });
  };

  // 1. Kịch bản tư vấn
  for (const k of d.KICHBAN) {
    const ans = k.tl ? k.tl : '(CHƯA CÓ CÂU TRẢ LỜI — cần hỏi quản lý)';
    add('Kịch bản', k.br, `${k.nhom}: ${k.hoi[0]}`,
      `Khách hỏi: ${k.hoi.join(' / ')}\nTrả lời mẫu: ${ans}`, 1.15);
  }

  // 2. CTKM có mốc thời gian — chỉ lấy đang áp dụng hoặc sắp áp dụng (60 ngày)
  const horizon = addDays(today, 60);
  const topicLive = {};
  for (const o of d.OFFERS) {
    const ended = o.to && o.to < today;
    const live = !ended && (!o.from || o.from <= today);
    if (!topicLive[o.topic]) topicLive[o.topic] = false;
    if (!ended) topicLive[o.topic] = true;
    if (ended || (o.from && o.from > horizon)) continue;
    const st = live ? 'ĐANG ÁP DỤNG' : `SẮP ÁP DỤNG từ ${fmt(o.from)}`;
    const hol = o.only === 'holiday' ? 'chỉ áp dụng dịp lễ' : o.holiday === true ? 'có áp dụng ngày lễ'
      : o.holiday === false ? 'KHÔNG áp dụng ngày lễ' : 'chưa rõ có áp dụng lễ không (hỏi quản lý)';
    const range = `${o.from ? fmt(o.from) : 'không giới hạn đầu'} → ${o.to ? fmt(o.to) : 'không giới hạn cuối'}`;
    add('CTKM theo ngày', o.br, `${o.br} · ${o.name}`,
      `[${st}] ${o.br} · ${o.sec}\n${o.name}: ${o.price}${o.base ? ' (giá gốc ' + o.base + ')' : ''} · giờ ${o.time || '—'} · ${o.days || ''} · ${range} · ${hol}`
      + (o.ok === false ? ' · THỜI HẠN CHƯA XÁC NHẬN' : '') + (o.cond ? `\nĐiều kiện: ${clean(o.cond)}` : '') + (o.period ? ` · ${o.period}` : ''), 1.15);
  }

  // 3. Tổng quan chi nhánh
  for (const b of d.BRANCHES) {
    add('Tổng quan', b.br, b.name, clean(b.sub));
    for (const g of b.groups || []) {
      const parts = [];
      if (g.lead) parts.push(clean(g.lead));
      if (g.table) parts.push(flatten(g.table).join('\n'));
      if (g.yes) parts.push('Bao gồm: ' + g.yes.map(clean).join(', '));
      if (g.no) parts.push('Không bao gồm: ' + g.no.map(clean).join(', '));
      const rest = { ...g }; ['h', 'lead', 'table', 'yes', 'no'].forEach(k => delete rest[k]);
      const extra = flatten(rest).join('\n');
      if (extra) parts.push(extra);
      add('Tổng quan', b.br, `${b.br} · ${clean(g.h)}`, parts.join('\n'));
    }
  }

  // 4. Khái niệm dịch vụ
  for (const c of d.CONCEPTS) {
    for (const it of c.items || []) {
      add('Khái niệm', 'Chung', `${c.title}: ${it.name}${it.en ? ' (' + it.en + ')' : ''}`, flatten(it).join('\n'));
    }
    if (c.compare) add('Khái niệm', 'Chung', `${c.title} — so sánh`, flatten(c.compare).join('\n'));
  }

  // 5. Tài liệu ôn tập (bỏ các kỳ đã kết thúc hẳn)
  for (const t of d.TOPICS) {
    if (t.id in topicLive && !topicLive[t.id]) continue;
    const br = t.tag && /^Q\d$/.test(t.tag) ? t.tag : 'Chung';
    for (const r of t.review || []) {
      const rest = { ...r }; delete rest.h;
      add('Thông tin chương trình', br, `${t.name} · ${clean(r.h)}`, flatten(rest).join('\n'));
    }
  }
  return chunks;
}

/* ---------------- tìm đoạn liên quan ---------------- */
const SYN = {
  be: 'tre em', tre: 'tre em be', con: 'tre em be', hs: 'hssv hoc sinh', sv: 'hssv sinh vien', hssv: 'hoc sinh sinh vien',
  tien: 'gia', bao: 'gia', nhieu: 'gia', gia: 've', mat: 'gia', free: 'mien phi', vat: 'hoa don', hoadon: 'vat',
  vip: 'goi vip the', nude: 'trang phuc bikini', bikini: 'trang phuc do lot', bau: 'mang thai', u60: 'nguoi lon tuoi',
  toi: 'buoi toi', sang: 'buoi sang', gym: 'tap luyen', an: 'do an am thuc', uong: 'nuoc', nail: 'nail hair', toc: 'hair',
  'cha': 'cha da peeling', scrub: 'body scrub', facial: 'da mat', mo: 'gio hoat dong', dong: 'gio hoat dong'
};
function retrieve(chunks, query, branch) {
  const q = toks(query);
  const exp = new Set(q);
  q.forEach(t => (SYN[t] || '').split(' ').forEach(x => x && exp.add(x)));
  if (!exp.size) return [];
  const N = chunks.length, df = {};
  for (const c of chunks) new Set(c.tk).forEach(t => { df[t] = (df[t] || 0) + 1; });
  const qn = norm(query);
  // câu hỏi về giá / ưu đãi / hôm nay → ưu tiên CTKM theo ngày
  const priceIntent = /\b(gia|bao nhieu|uu dai|giam|khuyen mai|ctkm|hom nay|ngay mai|tien|combo|happy hour)\b/.test(qn);
  const scored = chunks.map(c => {
    const set = new Set(c.tk);
    let s = 0;
    exp.forEach(t => {
      if (!set.has(t)) return;
      const idf = Math.log(1 + N / (df[t] || 1));
      s += idf * (q.includes(t) ? 1 : 0.5) * (c.tt.has(t) ? 1.6 : 1);
    });
    // thưởng khi trùng cụm 2 từ liên tiếp
    for (let i = 0; i < q.length - 1; i++) if (norm(c.title + ' ' + c.text).includes(q[i] + ' ' + q[i + 1])) s += 2;
    if (branch && branch !== 'all' && c.br !== 'Chung' && c.br !== branch) s *= 0.35;
    if (c.br !== 'Chung' && qn.includes(norm(c.br))) s *= 1.3;
    if (priceIntent && c.src === 'CTKM theo ngày') s *= 1.5;
    if (c.text.startsWith('[SẮP ÁP DỤNG')) s *= 0.85;
    return { c, s: s * c.boost };
  }).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  const out = []; let len = 0;
  for (const { c } of scored) {
    if (out.length >= 20 || len + c.text.length > MAX_CTX_CHARS) continue;
    out.push(c); len += c.text.length;
  }
  return out;
}

/* bảng giá gọn: giá thường + CTKM đang/sắp áp dụng 8 ngày tới — luôn gửi khi khách hỏi về tiền */
function priceSheet(d, chunks, today, branch) {
  const brs = branch === 'all' ? ['Q2', 'Q1', 'Q7'] : [branch];
  const end = addDays(today, 8);
  const base = chunks.filter(c => c.src === 'Tổng quan' && brs.includes(c.br) && /Nghỉ dưỡng|Bathhouse|Skin Care \(/i.test(c.title));
  const lines = d.OFFERS.filter(o => brs.includes(o.br) && !(o.to && o.to < today) && !(o.from && o.from > end)).map(o => {
    const when = `${o.from && o.from > today ? 'từ ' + fmt(o.from).slice(0, 5) + ' ' : ''}${o.to ? 'đến ' + fmt(o.to).slice(0, 5) : 'không thời hạn'}`;
    const hol = o.only === 'holiday' ? 'chỉ dịp lễ' : o.holiday === false ? 'không áp dụng lễ' : o.holiday ? 'có áp dụng lễ' : 'lễ: chưa rõ';
    return `${o.br} | ${o.name} | ${o.price} | ${o.time || '—'} | ${o.days || '—'} | ${when} | ${hol}`;
  });
  return { base, text: `BẢNG GIÁ THƯỜNG (chưa VAT):\n${base.map(c => c.title + '\n' + c.text).join('\n\n')}\n\nCTKM ĐANG / SẮP ÁP DỤNG TRONG 8 NGÀY TỚI (chi nhánh | ưu đãi | giá | giờ | ngày trong tuần | thời hạn | ngày lễ) — điều kiện chi tiết xem các mục bên dưới:\n${lines.join('\n')}` };
}

/* tra từng ý riêng rồi trộn → câu hỏi nhiều ý không bị một chủ đề chiếm hết chỗ */
function retrieveMulti(chunks, question, kwText, extra, branch, budget = MAX_CTX_CHARS) {
  const lines = String(kwText || '').split('\n').map(x => x.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean).slice(0, 6);
  const lists = lines.map(l => retrieve(chunks, l + ' ' + l, branch).slice(0, 5));
  lists.push(retrieve(chunks, `${question} ${lines.join(' ')} ${extra}`, branch));
  const out = [], seen = new Set(); let len = 0;
  const take = c => { if (seen.has(c) || out.length >= 20 || len + c.text.length > budget) return; seen.add(c); out.push(c); len += c.text.length; };
  for (let i = 0; i < 5; i++) lists.forEach(l => l[i] && take(l[i]));
  lists.at(-1).forEach(take);
  return out;
}

/* ---------------- Groq ---------------- */
async function groq(model, messages, opts = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), opts.timeout || 25000);
  try {
    const r = await fetch(GROQ_URL, {
      method: 'POST', signal: ctl.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model, messages, temperature: opts.temperature ?? 0.2,
        max_completion_tokens: opts.max || 1200, reasoning_effort: opts.effort || 'low' })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(j.error?.message || `Groq ${r.status}`); e.status = r.status; throw e; }
    return (j.choices?.[0]?.message?.content || '').trim();
  } finally { clearTimeout(timer); }
}
async function groqWithFallback(messages, opts) {
  try { return { text: await groq(MODEL, messages, opts), model: MODEL }; }
  catch (e) {
    if (FALLBACK && FALLBACK !== MODEL) return { text: await groq(FALLBACK, messages, opts), model: FALLBACK };
    throw e;
  }
}

/* viết lại câu hỏi (sai chính tả, không dấu, tiếng Hàn…) thành từ khóa tiếng Việt để tìm đúng đoạn */
async function rewrite(question, history) {
  const last = history.slice(-2).map(m => `${m.role === 'user' ? 'Hỏi' : 'Đáp'}: ${m.content.slice(0, 300)}`).join('\n');
  try {
    return await groq(FALLBACK, [
      { role: 'system', content: 'Bạn tách tin nhắn của khách spa/jjimjilbang Golden Lotus thành các Ý CẦN TRA CỨU, mỗi ý một dòng, tối đa 6 dòng. Mỗi dòng 3–8 từ khóa TIẾNG VIỆT CÓ DẤU (dịch nếu là tiếng Hàn/Anh, sửa chính tả, dùng từ như trong bảng giá). Câu hỏi tính tiền thì tách riêng từng thứ cần giá: vd "giá vé nghỉ dưỡng HSSV", "giá vé nghỉ dưỡng người lớn", "giá chà da nữ skin care", "quy định chà da mua kèm vé". Nếu nối tiếp hội thoại trước thì gộp ngữ cảnh. Chỉ in các dòng từ khóa, không đánh số, không giải thích.' },
      { role: 'user', content: (last ? `Hội thoại trước:\n${last}\n\n` : '') + `Câu hỏi: ${question}` }
    ], { temperature: 0, max: 400, timeout: 8000 });
  } catch (e) { return ''; }
}

/* ---------------- giới hạn tần suất (theo instance) ---------------- */
const hits = new Map();
function limited(uid) {
  const now = Date.now(), arr = (hits.get(uid) || []).filter(t => now - t < 60000);
  arr.push(now); hits.set(uid, arr);
  return arr.length > 15;
}

/* ---------------- nhận diện ngôn ngữ tin nhắn khách ---------------- */
function detectLang(q) {
  const t = String(q || '');
  const hangul = (t.match(/[\uac00-\ud7a3\u3131-\u318e]/g) || []).length;
  const letters = (t.match(/\p{L}/gu) || []).length || 1;
  if (hangul / letters > 0.15) return 'ko';
  if (/[ăâđêôơưàáạảãèéẹẻẽìíịỉĩòóọỏõùúụủũỳýỵỷỹ]/i.test(t)) return 'vi';
  const w = norm(t).split(' ');
  const VI = ['khong', 'ko', 'gia', 've', 'bao', 'nhieu', 'minh', 'dc', 'duoc', 'em', 'chi', 'oi', 'nhe', 'nha', 'co', 'cho', 'ben', 'hom', 'nay', 'mai', 'tre', 'be', 'uu', 'dai'];
  const EN = ['the', 'is', 'are', 'how', 'what', 'much', 'price', 'do', 'does', 'you', 'can', 'i', 'we', 'my', 'open', 'ticket', 'kids', 'child', 'hello', 'hi', 'please', 'have', 'there', 'any', 'for', 'and', 'to', 'of'];
  const vi = w.filter(x => VI.includes(x)).length, en = w.filter(x => EN.includes(x)).length;
  return en > vi ? 'en' : 'vi';
}
const LANG = {
  vi: { name: 'tiếng Việt', rule: 'Viết bằng tiếng Việt, bắt đầu bằng "Dạ", xưng "em", gọi "anh/chị". Tiền viết dạng 170.000đ.' },
  ko: { name: 'tiếng Hàn', rule: 'Viết bằng tiếng Hàn kính ngữ tự nhiên như nhân viên CSKH Hàn Quốc (존댓말, gọi 고객님, chào "안녕하세요, 골든로터스 힐링월드입니다."). Tiền viết dạng 170,000동. Tên phòng/dịch vụ dịch sang tiếng Hàn tự nhiên (찜질방, 사우나, 바디 스크럽…).' },
  en: { name: 'tiếng Anh', rule: 'Write in friendly, professional English customer-service tone ("Hello, this is Golden Lotus Healing World."). Prices as 170,000 VND.' }
};

/* ---------------- handler ---------------- */
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ nhận POST' });
  if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: 'Chưa cài GROQ_API_KEY trên Vercel.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  const d = loadData();
  const uid = String(body.uid || '').toLowerCase();
  if (!d.USERS[uid]) return res.status(401).json({ error: 'Vui lòng đăng nhập lại.' });
  if (limited(uid)) return res.status(429).json({ error: 'Hỏi nhanh quá — đợi 1 phút rồi thử lại nhé.' });

  const question = String(body.question || '').trim().slice(0, 2000);
  if (!question) return res.status(400).json({ error: 'Chưa có câu hỏi.' });
  const branch = ['Q1', 'Q2', 'Q7'].includes(body.branch) ? body.branch : 'all';
  const lang = ['vi', 'ko', 'en'].includes(body.lang) ? body.lang : detectLang(question);
  const L = LANG[lang];
  const history = (Array.isArray(body.history) ? body.history : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-6).map(m => ({ role: m.role, content: m.content.slice(0, 1500) }));

  try {
    const today = todayVN();
    const dow = WD[new Date(today + 'T00:00:00Z').getUTCDay()];
    const hol = (d.HOLIDAYS || []).find(h => h.from <= today && today <= h.to);
    const chunks = buildChunks(d, today);
    const week = Array.from({ length: 8 }, (_, i) => { const x = addDays(today, i); const h = (d.HOLIDAYS || []).find(h => h.from <= x && x <= h.to);
      return `${WD[new Date(x + 'T00:00:00Z').getUTCDay()]} ${fmt(x).slice(0, 5)}${h ? ' (LỄ)' : ''}`; }).join(' · ');

    const kw = await rewrite(question, history);
    const lastUser = history.filter(m => m.role === 'user').slice(-1).map(m => m.content).join(' ');
    const money = /\b(gia|bao nhieu|tien|tra|tinh|uu dai|giam|khuyen mai|combo|happy hour|phi|tong|price|cost|how much|won|dong)\b|얼마|요금|가격|비용|할인/.test(norm(question + ' ' + kw) + ' ' + question);
    const sheet = money ? priceSheet(d, chunks, today, branch) : null;
    const found = retrieveMulti(chunks, question, kw, lastUser, branch, sheet ? 6000 : MAX_CTX_CHARS).filter(c => !(sheet && sheet.base.includes(c)));

    const makeSystem = list => {
      const context = (sheet ? sheet.text + '\n\n===\n\n' : '') + list.map((c, i) => `#${i + 1} [${c.src} · ${c.br}] ${c.title}\n${c.text}`).join('\n\n---\n\n');
      return `Bạn là trợ lý tra cứu nội bộ của lễ tân Golden Lotus Healing World. Lễ tân dán nguyên tin nhắn khách gửi (có thể là tiếng Việt, tiếng Hàn hoặc tiếng Anh; có thể dài, có lời chào, nhiều câu hỏi một lúc), bạn soạn tin trả lời để lễ tân copy gửi khách.
Hôm nay: ${dow}, ${fmt(today)}${hol ? ` — NGÀY LỄ: ${hol.name}` : ''}. Chi nhánh đang chọn: ${branch === 'all' ? 'chưa chọn (tất cả)' : branch}.
Lịch 8 ngày tới: ${week}. Khách nói "thứ 2", "mai", "cuối tuần"… thì hiểu là ngày gần nhất sắp tới trong lịch này.
NGÔN NGỮ TRẢ LỜI KHÁCH: ${L.name}.

QUY TẮC
1. Mọi giá, giờ, quy định, quyền lợi phải lấy từ DỮ LIỆU — không bịa con số. Nhưng bạn là tư vấn viên giỏi: được SUY LUẬN và GHÉP nhiều mục dữ liệu lại (vé + dịch vụ + ưu đãi + quy định bắt buộc) để ra câu trả lời hoàn chỉnh.
2. Câu hỏi về tiền: tính cụ thể TỪNG NGƯỜI và TỔNG, chọn đúng mức giá theo ngày/thứ/khung giờ/đối tượng khách đến. Luôn nhắc quy định bắt buộc liên quan (vd chà da phải mua kèm vé Bathhouse hoặc Nghỉ dưỡng) và ghi giá chưa gồm VAT. Nếu có phương án rẻ hơn hợp lý (combo, khung giờ Happy Hour, đổi sang dịch vụ tương tự) thì gợi ý thêm 1 câu.
3. Phân loại khách theo quy định trong dữ liệu (giá trẻ em tính theo CHIỀU CAO, trên 1,2m tính như người lớn; ưu đãi HSSV cần thẻ HS hoặc đồng phục + CCCD / thẻ SV). Học sinh cấp 2–3 (lớp 6–12) thường cao trên 1,2m → tính như người lớn với dịch vụ chăm sóc, và được giá HSSV cho vé nghỉ dưỡng nếu CTKM có và đủ giấy tờ.
4. HỎI LẠI TRƯỚC KHI BÁO GIÁ khi tin nhắn chưa rõ AI dùng DỊCH VỤ GÌ: nhiều người mà không nói rõ từng người dùng dịch vụ nào (vd "đi 2 người, dùng chà da nữ" → chưa biết cả 2 cùng chà da hay chỉ 1 người), chưa rõ số người, chưa rõ dịch vụ, chưa rõ giới tính khi giá khác theo giới. Khi đó KHÔNG tự giả định, KHÔNG tính tiền: "Trả lời khách" chỉ gồm lời chào ngắn + 1–2 câu hỏi lại cụ thể để chốt (vd: "Dạ để em báo giá chính xác, chị cho em hỏi: bạn học sinh lớp 10 và người lớn đều dùng dịch vụ chà da, hay chỉ một người chà da ạ? Người lớn đi cùng là nam hay nữ ạ?"); "Lưu ý nội bộ" ghi các mức giá liên quan để lễ tân sẵn sàng báo khi khách trả lời. Khách trả lời ở tin sau (hội thoại tiếp) thì mới tính tiền.
   Thông tin nhỏ không đổi phạm vi dịch vụ (khách có mang thẻ HS không, chiều cao của học sinh cấp 2–3) thì không cần hỏi: báo giá theo trường hợp thường gặp và ghi điều kiện cần kiểm tra. Ngày/giờ đã rõ thì không hỏi lại. Trong tin nhắn, trả lời ĐỦ mọi câu khách hỏi, gộp thành MỘT tin liền mạch, tự nhiên như chat.
Chỉ khi dữ liệu HOÀN TOÀN không có quy định nào liên quan (hoặc mục ghi "CHƯA CÓ CÂU TRẢ LỜI") mới nói sẽ kiểm tra lại và phản hồi khách; khi đó ghi trong "Lưu ý nội bộ": "Chưa có trong kịch bản — hỏi quản lý: <câu đó>".
5. Câu hỏi phụ thuộc chi nhánh mà chưa rõ → theo chi nhánh đang chọn; nếu "tất cả" thì tách theo từng chi nhánh có dữ liệu.
6. Phần trả lời khách: ${L.rule}
7. ĐỊNH DẠNG BẮT BUỘC — giữ nguyên các nhãn tiếng Việt dưới đây, không dùng bảng, không dùng tiêu đề #:
Trả lời khách:
<tin nhắn hoàn chỉnh bằng ${L.name}, sẵn để copy gửi khách, có thể gạch đầu dòng>${lang === 'vi' ? '' : `
Dịch cho lễ tân:
<bản dịch tiếng Việt của tin nhắn trên, để lễ tân hiểu mình đang gửi gì>`}
Lưu ý nội bộ:
- <bằng tiếng Việt: cách tính tiền từng dòng (nếu có), giả định đã dùng, điều kiện/giấy tờ cần kiểm tra khi khách đến; tối đa 5 gạch>
8. Nếu lễ tân hỏi nghiệp vụ nội bộ (quy trình, kịch bản bán hàng, không phải tin nhắn khách) thì trả lời thẳng bằng tiếng Việt, không cần các nhãn trên.

DỮ LIỆU
${context || '(không tìm thấy đoạn nào liên quan)'}`;
    };

    // giữ tổng (prompt + câu trả lời) dưới giới hạn TPM: bớt đoạn ít liên quan nhất, rồi bớt lịch sử cũ
    const budget = TPM - OUT_TOKENS - 400;
    let list = found.slice(), system = makeSystem(list);
    // lịch sử: giữ 4 tin gần nhất, mỗi tin tối đa 700 ký tự (đủ để hiểu khách đang trả lời câu hỏi lại)
    let hist = history.slice(-4).map(m => ({ role: m.role, content: m.content.length > 700 ? m.content.slice(0, 700) + '…' : m.content }));
    const size = () => estTok(system) + estTok(question) + hist.reduce((n, m) => n + estTok(m.content) + 8, 0);
    while (size() > budget && list.length > 4) { list.pop(); system = makeSystem(list); }
    while (size() > budget && hist.length) hist.shift();
    while (size() > budget && list.length) { list.pop(); system = makeSystem(list); }

    const { text, model } = await groqWithFallback(
      [{ role: 'system', content: system }, ...hist, { role: 'user', content: question }],
      { temperature: 0.2, max: OUT_TOKENS, effort: EFFORT });

    return res.status(200).json({
      answer: text || 'Bot chưa soạn xong câu trả lời (câu hỏi quá dài/phức tạp so với gói miễn phí) — thử tách thành câu ngắn hơn nhé.',
      sources: [...new Set(list.slice(0, 5).map(c => `${c.src} · ${c.title}`))],
      lang, model
    });
  } catch (e) {
    const m = String(e.message || '');
    const tooBig = /too large|reduce your message/i.test(m);
    const busy = e.status === 429 || /rate limit|tokens per minute|requests per/i.test(m);
    return res.status(busy || tooBig ? 429 : 502).json({
      error: tooBig ? 'Tin nhắn quá dài so với giới hạn gói Groq miễn phí — rút gọn tin hoặc bấm ↺ để bắt đầu cuộc trò chuyện mới rồi hỏi lại.'
        : busy ? 'Đang nhiều người hỏi cùng lúc (gói Groq miễn phí giới hạn số chữ mỗi phút) — đợi khoảng 1 phút rồi bấm gửi lại nhé.'
        : 'Không kết nối được AI: ' + m
    });
  }
};

/* cho phép test cục bộ: node api/chat.js "câu hỏi" */
module.exports._test = { priceSheet, loadData, buildChunks, retrieve, retrieveMulti, todayVN, detectLang };
