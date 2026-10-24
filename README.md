# Ôn tập & Kiểm tra CTKM — Golden Lotus Healing World

Trang ôn tập nội bộ + ngân hàng câu hỏi trắc nghiệm cho nhân viên GLH.

- **Phạm vi:** Quận 1 · Quận 2 · Quận 7
- **Kỳ:** T7,T8/2026 · Lễ 2/9 · T9,T10/2026 · T11,T12/2026
- **Nội dung:** 13 chủ đề / **184 câu hỏi**
- **Nguồn:** `Tổng Hợp CTKM Q2 Q1 Q7.xlsx` (12 sheet) + các đính chính của phòng vận hành (28/08/2026) + file chính thức Q2-M10-3 "Q2-JJB Ưu đãi T11-T12" (phòng MKT, 19/10/2026) cho kỳ T11,T12 Quận 2
- **Link:** https://tonghopctkmt9.vercel.app

## Cấu trúc

| File | Vai trò |
|---|---|
| `index.html` | Toàn bộ giao diện + logic bài kiểm tra (không cần build) |
| `data.js` | Dữ liệu: tài liệu ôn tập và câu hỏi của 11 chủ đề |
| `menus.js` + thư mục `menu/` | Ảnh menu từng chi nhánh (Q1 · Q2 · Q7) — hiện ở tab Hôm nay khi bấm lọc chi nhánh. Thay menu: ghi đè ảnh cùng tên + tăng `MENU_VER` |
| `kich-ban.js` | Kịch bản tư vấn (câu khách hay hỏi + gói VIP) — dữ liệu cho chatbot **Hỏi nhanh** |
| `api/chat.js` + `vercel.json` | Chatbot **Hỏi nhanh** (Groq): tìm đoạn liên quan trong kịch bản + CTKM theo ngày rồi trả lời |
| `ngan-hang-cau-hoi.csv` | Ngân hàng câu hỏi dạng bảng — Google Sheet dùng `=IMPORTDATA` trỏ vào file này |

Sửa nội dung → chỉ cần sửa `data.js` (và `ngan-hang-cau-hoi.csv` nếu muốn Google Sheet cập nhật theo). Mỗi chủ đề có dạng:

```
{ id, name, icon, tag, summary,
  review:    [ { h, bullets: [...] } | { h, table: { head, rows } } ],
  questions: [ { q, o: [4 đáp án], a: chỉ_số_đáp_án_đúng, e: giải thích } ] }
```

Thứ tự câu hỏi và thứ tự đáp án được đảo ngẫu nhiên ở trình duyệt mỗi lần làm bài.

## Tính năng trang

- 3 tab: Tổng quan · Tài liệu ôn tập · Làm bài kiểm tra
- Thanh tìm kiếm toàn trang (tìm cả tài liệu lẫn câu hỏi, không dấu vẫn ra kết quả, phím tắt `/`)
- Tab Hôm nay: bấm Q1/Q2/Q7 → hiện menu chi nhánh đó (ảnh nhỏ, bấm để phóng to, vuốt/◀▶ chuyển trang)
- Màu riêng theo chi nhánh (Q1 xanh lá · Q2 xanh dương · Q7 cam · Chung xám · Tổng hợp tím) + bộ lọc theo chi nhánh

## Deploy

Static site, không cần build. Repo nối với Vercel → Framework Preset: **Other**, Build Command: bỏ trống, Output Directory: `.`

## Còn cần xác nhận

- **Giá Combo HSSV Golden Kitchen** — 190k/290k (T7,T8) vs 130k/230k (T9,T10) vs 115k/190k (sheet đang diễn ra). Chưa đưa vào đề.
- ~~Bill tối thiểu Game vòng quay may mắn~~ → **đã chốt 200k**.

## Chatbot Hỏi nhanh

- Nút **💬 Hỏi nhanh** góc phải dưới (chỉ hiện sau khi đăng nhập). Lễ tân gõ câu khách hỏi → nhận câu trả lời mẫu + nút **Copy gửi khách** + lưu ý nội bộ + nguồn.
- Dữ liệu: `kich-ban.js` + `offers.js` (chỉ ưu đãi đang/sắp áp dụng theo ngày VN) + `branches.js` + `concepts.js` + `data.js`. Sửa kịch bản → sửa `kich-ban.js`, deploy là chatbot dùng ngay.
- Câu chưa có câu trả lời: để `tl: ''` → chatbot báo "Chưa có trong kịch bản — hỏi quản lý".
- Biến môi trường trên Vercel: `GROQ_API_KEY` (bắt buộc), `GROQ_MODEL` (mặc định `openai/gpt-oss-120b`), `GROQ_FALLBACK` (mặc định `openai/gpt-oss-20b`), `GROQ_TPM` (mặc định 8000 = gói miễn phí; lên Dev tier thì đặt theo giới hạn mới, vd 250000, để bot đọc nhiều dữ liệu và suy luận kỹ hơn).
- Gói Groq miễn phí: 8.000 token/phút/model → mỗi câu hỏi dùng ~7.500 token, nên chỉ ~1 câu/phút/model (bot tự chuyển sang model dự phòng khi quá tải).
- Chỉ tài khoản có trong `USERS` (index.html) mới gọi được API; giới hạn ~15 câu/phút/người.
