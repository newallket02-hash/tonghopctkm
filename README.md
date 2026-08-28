# Ôn tập & Kiểm tra CTKM — Golden Lotus Healing World

Trang ôn tập nội bộ + ngân hàng câu hỏi trắc nghiệm cho nhân viên GLH.

- **Phạm vi:** Quận 1 · Quận 2 · Quận 7
- **Kỳ:** T7,T8/2026 · Lễ 2/9 · T9,T10/2026
- **Nội dung:** 11 chủ đề / 121 câu hỏi
- **Nguồn:** `Tổng Hợp CTKM Q2 Q1 Q7.xlsx` (12 sheet)

## Cấu trúc

| File | Vai trò |
|---|---|
| `index.html` | Toàn bộ giao diện + logic bài kiểm tra (không cần build) |
| `data.js` | Dữ liệu: tài liệu ôn tập và câu hỏi của 11 chủ đề |

Sửa nội dung → chỉ cần sửa `data.js`. Mỗi chủ đề có dạng:

```js
{ id, name, icon, tag, summary,
  review:    [ { h, bullets: [...] } | { h, table: { head, rows } } ],
  questions: [ { q, o: [4 đáp án], a: chỉ_số_đáp_án_đúng, e: giải thích } ] }
```

Thứ tự câu hỏi và thứ tự đáp án được đảo ngẫu nhiên ở trình duyệt mỗi lần làm bài.

## Deploy

Static site, không cần build. Nối repo với Vercel → Framework Preset: **Other**, Build Command: bỏ trống, Output Directory: `.`

## Cần xác nhận

Hai con số đang lệch giữa các sheet nguồn, đã loại khỏi đề:

1. Giá Combo HSSV Golden Kitchen — 190k/290k (T7,T8) vs 130k/230k (T9,T10) vs 115k/190k (sheet đang diễn ra)
2. Bill tối thiểu Game vòng quay may mắn — 300k vs 200k
