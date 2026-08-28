# Ôn tập & Kiểm tra CTKM — Golden Lotus Healing World

Trang ôn tập nội bộ + ngân hàng câu hỏi trắc nghiệm cho nhân viên GLH.

- **Phạm vi:** Quận 1 · Quận 2 · Quận 7
- **Kỳ:** T7,T8/2026 · Lễ 2/9 · T9,T10/2026
- **Nội dung:** 11 chủ đề / **136 câu hỏi**
- **Nguồn:** `Tổng Hợp CTKM Q2 Q1 Q7.xlsx` (12 sheet) + các đính chính của phòng vận hành (28/08/2026)
- **Link:** https://tonghopctkmt9.vercel.app

## Cấu trúc

| File | Vai trò |
|---|---|
| `index.html` | Toàn bộ giao diện + logic bài kiểm tra (không cần build) |
| `data.js` | Dữ liệu: tài liệu ôn tập và câu hỏi của 11 chủ đề |
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
- Màu riêng theo chi nhánh (Q1 xanh lá · Q2 xanh dương · Q7 cam · Chung xám · Tổng hợp tím) + bộ lọc theo chi nhánh

## Deploy

Static site, không cần build. Repo nối với Vercel → Framework Preset: **Other**, Build Command: bỏ trống, Output Directory: `.`

## Còn cần xác nhận

- **Giá Combo HSSV Golden Kitchen** — 190k/290k (T7,T8) vs 130k/230k (T9,T10) vs 115k/190k (sheet đang diễn ra). Chưa đưa vào đề.
- ~~Bill tối thiểu Game vòng quay may mắn~~ → **đã chốt 200k**.
