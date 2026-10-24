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
const MAX_CTX_CHARS = 7000;

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
    return { c, s: s * c.boost };
  }).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  const out = []; let len = 0;
  for (const { c } of scored) {
    if (out.length >= 12 || len + c.text.length > MAX_CTX_CHARS) continue;
    out.push(c); len += c.text.length;
  }
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
        max_completion_tokens: opts.max || 1200, reasoning_effort: 'low' })
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
      { role: 'system', content: 'Bạn chuyển câu hỏi của khách spa/jjimjilbang Golden Lotus thành 5–12 từ khóa tìm kiếm TIẾNG VIỆT CÓ DẤU (dịch nếu là tiếng Hàn/Anh, sửa chính tả, thêm từ đồng nghĩa như "giá vé trẻ em", "ưu đãi HSSV", "gói VIP"). Nếu câu hỏi nối tiếp hội thoại trước thì gộp ngữ cảnh. Chỉ in một dòng từ khóa, không giải thích.' },
      { role: 'user', content: (last ? `Hội thoại trước:\n${last}\n\n` : '') + `Câu hỏi: ${question}` }
    ], { temperature: 0, max: 300, timeout: 8000 });
  } catch (e) { return ''; }
}

/* ---------------- giới hạn tần suất (theo instance) ---------------- */
const hits = new Map();
function limited(uid) {
  const now = Date.now(), arr = (hits.get(uid) || []).filter(t => now - t < 60000);
  arr.push(now); hits.set(uid, arr);
  return arr.length > 15;
}

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

  const question = String(body.question || '').trim().slice(0, 600);
  if (!question) return res.status(400).json({ error: 'Chưa có câu hỏi.' });
  const branch = ['Q1', 'Q2', 'Q7'].includes(body.branch) ? body.branch : 'all';
  const history = (Array.isArray(body.history) ? body.history : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-6).map(m => ({ role: m.role, content: m.content.slice(0, 1500) }));

  try {
    const today = todayVN();
    const dow = WD[new Date(today + 'T00:00:00Z').getUTCDay()];
    const hol = (d.HOLIDAYS || []).find(h => h.from <= today && today <= h.to);
    const chunks = buildChunks(d, today);

    const kw = await rewrite(question, history);
    const lastUser = history.filter(m => m.role === 'user').slice(-1).map(m => m.content).join(' ');
    const found = retrieve(chunks, `${question} ${kw} ${kw} ${lastUser}`, branch);

    const context = found.map((c, i) => `#${i + 1} [${c.src} · ${c.br}] ${c.title}\n${c.text}`).join('\n\n---\n\n');
    const system = `Bạn là trợ lý tra cứu nội bộ của lễ tân Golden Lotus Healing World. Lễ tân nhập câu khách hỏi, bạn trả về câu trả lời để lễ tân gửi khách.
Hôm nay: ${dow}, ${fmt(today)}${hol ? ` — NGÀY LỄ: ${hol.name}` : ''}. Chi nhánh đang chọn: ${branch === 'all' ? 'chưa chọn (tất cả)' : branch}.

QUY TẮC
1. CHỈ dùng thông tin trong DỮ LIỆU bên dưới. Không tự bịa giá, giờ, quy định, quyền lợi.
2. Nếu DỮ LIỆU không có câu trả lời, hoặc mục ghi "CHƯA CÓ CÂU TRẢ LỜI": nói rõ "Chưa có trong kịch bản — hỏi quản lý", và đưa câu tạm cho khách: "Dạ em xin phép kiểm tra lại và báo anh/chị ngay ạ."
3. Giá/ưu đãi phụ thuộc ngày: ưu tiên mục [CTKM theo ngày] ĐANG ÁP DỤNG hôm nay (đối chiếu thứ trong tuần, khung giờ, ngày lễ). Khách hỏi ngày khác thì lọc theo ngày đó. Kịch bản và CTKM khác nhau → theo CTKM. Mục SẮP ÁP DỤNG thì nói rõ từ ngày nào.
4. Câu hỏi phụ thuộc chi nhánh mà chưa rõ chi nhánh → trả lời theo chi nhánh đang chọn; nếu "tất cả" thì tách theo từng chi nhánh có dữ liệu.
5. Định dạng (không dùng bảng, không dùng tiêu đề #):
Trả lời khách:
<câu trả lời sẵn để copy gửi khách, bắt đầu bằng "Dạ", xưng "em", gọi "anh/chị", lịch sự, ngắn gọn, có thể gạch đầu dòng>
Lưu ý nội bộ:
- <1–3 ý: điều kiện, ngoại lệ, điều cần hỏi lại; bỏ phần này nếu không cần>
6. Khách hỏi bằng tiếng Hàn → phần "Trả lời khách" viết tiếng Hàn kính ngữ (존댓말); tiếng Anh → tiếng Anh. "Lưu ý nội bộ" luôn bằng tiếng Việt.
7. Nếu lễ tân hỏi nghiệp vụ nội bộ (quy trình, kịch bản bán hàng) thì trả lời thẳng, không cần phần "Trả lời khách".

DỮ LIỆU
${context || '(không tìm thấy đoạn nào liên quan)'}`;

    const { text, model } = await groqWithFallback(
      [{ role: 'system', content: system }, ...history, { role: 'user', content: question }],
      { temperature: 0.2, max: 1400 });

    return res.status(200).json({
      answer: text || 'Chưa có câu trả lời — thử hỏi cách khác hoặc hỏi quản lý nhé.',
      sources: [...new Set(found.slice(0, 5).map(c => `${c.src} · ${c.title}`))],
      model
    });
  } catch (e) {
    const busy = e.status === 429;
    return res.status(busy ? 429 : 502).json({
      error: busy ? 'Chatbot đang quá tải (giới hạn gói miễn phí Groq) — thử lại sau ít phút.' : 'Không kết nối được AI: ' + e.message
    });
  }
};

/* cho phép test cục bộ: node api/chat.js "câu hỏi" */
module.exports._test = { loadData, buildChunks, retrieve, todayVN };
