/* ==========================================================================
   TỔNG QUAN 3 CHI NHÁNH — giới thiệu dịch vụ & chi tiết từng dịch vụ
   --------------------------------------------------------------------------
   Nguồn: menu chính thức từng chi nhánh + sheet CTKM.
   Giá ghi ở đây là GIÁ THƯỜNG (niêm yết), CHƯA gồm VAT.
   Chỗ nào nguồn không có thì ghi rõ "chưa có trong tài liệu" — không suy đoán.
   ========================================================================== */
const BRANCHES = [
{
  br:'Q2', tag:'Q2', icon:'🪷',
  name:'Golden Lotus Healing World — Quận 2',
  sub:'Cơ sở lớn nhất: nghỉ dưỡng Hàn Quốc trọn ngày, nhà hàng, cafe, nail & hair, lớp học miễn phí.',
  groups:[
    { h:'🛁 Nghỉ dưỡng (Healing World / Jjimjilbang)',
      lead:'Vé vào trọn khu nghỉ dưỡng — dùng cả ngày.',
      table:{head:['Loại vé','Giá thường'],rows:[
        ['Người lớn','**270k**'],['Trẻ em 0,8 – 1,2m','170k'],['Baby dưới 0,8m','Miễn phí (phải có người lớn đi kèm)']]},
      yes:['Tắm & xông hơi','Các phòng nhiệt nóng / lạnh chuyên đề','Gym · Yoga · Dance (lớp miễn phí)','Khu game · Mini game tương tác','Xem phim / TV giải trí','Hồ ngâm chân','Board game','Relax zone'],
      no:['Ăn uống tại Golden Kitchen & Aqua Garden Cafe','Body / Foot / Facial care','Nail · Hair','Peeling skin (Skin Care)','Honey Skin Care','Mua xu chơi game'] },

    { h:'🏊 Bathhouse (chỉ khu tắm)',
      lead:'Vé riêng cho khu tắm, không bao gồm khu nghỉ dưỡng.',
      table:{head:['Loại vé','Giá thường'],rows:[['Người lớn','**240k**'],['Trẻ em 0,8 – 1,2m','120k']]} },

    { h:'✨ Skin Care (Peeling — chà da Hàn Quốc)',
      table:{head:['Dịch vụ','Thời lượng','Giá thường'],rows:[
        ["Skin Care Nữ (Peeling Skin)",'45 phút','**350k**'],
        ["Skin Care Nam (Peeling Skin)",'30 phút','290k'],
        ['Skin Care Trẻ em (dưới 1,2m)','—','195k'],
        ['Honey Skin Care (Nữ)','50 phút','**450k**']]},
      note:'Honey Skin Care = Body Scrub (bắp / hạt sen / sữa muối) + Wrap (chọn 1: cà phê / nghệ / dừa mật ong) + xông nhiệt 20 phút miễn phí.',
      warn:'Chà da bắt buộc phải ngâm cho da mềm ra trước. Khách ĐÃ có vé Nghỉ dưỡng thì ngâm luôn ở khu tắm trong vé — KHÔNG cần mua thêm vé Bathhouse. Khách CHỈ dùng chà da, không mua vé nghỉ dưỡng thì BẮT BUỘC mua vé Bathhouse riêng.' },

    { h:'💆 Body & Foot care',
      table:{head:['Dịch vụ','Thời lượng','Giá thường'],rows:[
        ['Soul Relax — Head, Neck & Shoulder','30 phút','320k'],
        ['Balance Support — Foot Care','30 phút','290k'],
        ['Balance Support — Golden Lotus Foot Care','60 phút','390k'],
        ['Golden Lotus Balance Support — Foot 60’ + Neck & Shoulder 30’','90 phút','490k'],
        ['Balance Support & Facial — Foot 60’ + Mini Facial 30’','90 phút','550k'],
        ['Golden Lotus Energizing — Body Care KHÔNG dầu','60 phút','430k'],
        ['Golden Lotus Energizing — Body Care KHÔNG dầu','90 phút','550k'],
        ['Golden Lotus Relaxing — Aromatherapy Oil','60 phút','460k'],
        ['Golden Lotus Relaxing — Aromatherapy Oil','90 phút','590k'],
        ['Golden Lotus Healing — Hot Stone Relief','60 phút','500k'],
        ['Golden Lotus Healing — Hot Stone Relief','90 phút','630k'],
        ['Organic Herbal Heat Compress — túi thảo dược handmade','60 phút','560k'],
        ['Organic Herbal Heat Compress','90 phút','690k'],
        ['Zen Balance — Thai Traditional','90 phút','650k']]} },

    { h:'👶 Care cho trẻ em & mẹ bầu',
      table:{head:['Dịch vụ','Thời lượng','Giá thường'],rows:[
        ['Kid Golden Lotus Energizing (Body no oil)','60 / 90 phút','350k / 450k'],
        ['Kid Balance Support (Foot care trẻ em)','60 / 90 phút','330k / 430k'],
        ['Kid Golden Lotus Relaxing (Aroma oil)','60 / 90 phút','350k / 490k'],
        ['Relaxing Pregnancy Recharge','60 phút','550k'],
        ['Intensive Pregnancy Recharge','90 phút','750k']]} },

    { h:'💎 Combo VIP',
      table:{head:['Combo','Thời lượng','Giá thường'],rows:[
        ['VIP Relaxing Facial — Aroma Oil 60’ + Facial 60’','120 phút','790k'],
        ['VIP Healing Facial — Hot Stone 60’ + Facial 60’','120 phút','790k'],
        ['VIP Energizing Facial — Body no oil 60’ + Facial 60’','120 phút','790k'],
        ['VIP Golfer Boost','90 phút','**890k**'],
        ['VIP Detox Boost','90 phút','790k'],
        ['VIP Soul Boost — Text Neck Care','90 phút','790k']]} },

    { h:'🧖 Facial (chăm sóc da mặt)',
      table:{head:['Dịch vụ','Thời lượng','Giá thường'],rows:[
        ['Mini Facial — clean, steam, facial care','30 phút','245k'],
        ['Acne Solution Facial — da mụn chuyên sâu','60 phút','420k'],
        ['Radiance Brightening Facial — LED / PDT whitening','90 phút','550k'],
        ['Korean V-Shaped Facial — xung điện tần số cao','90 phút','590k']]} },

    { h:'👂 Combo Ear Cleaning (ráy tai & gội đầu)',
      lead:'Menu in sẵn giá gốc và giá đã giảm 40%.',
      table:{head:['Combo','Thời lượng','Giá thường','Sau giảm 40%'],rows:[
        ['Ráy tai & chăm sóc vùng tai','30 phút','250k','**170k**'],
        ['Cạo râu (nam) · xông mặt / hút mụn · chăm sóc da mặt · mặt nạ collagen · cổ vai · ráy tai · gội xả Moroccanoil · sấy tóc','60 phút','450k','**298k**'],
        ['Như gói 60’ + làm móng tay/chân · chăm sóc toàn thân không dầu · chăm sóc đầu','90 phút','550k','**370k**']]} },

    { h:'🍜 Golden Kitchen & Aqua Garden Cafe',
      bullets:['**Golden Kitchen** — nhà hàng trong khu nghỉ dưỡng: mì Ý, pad Thái, pizza, gà rán Hàn Quốc, mì đen, cơm cuộn, bánh gạo cay, lasagna, bắp phủ phô mai…',
        '**Combo HSSV** — Combo 1 & 2 (01 người) 130k · Combo 3 & 4 (02 người) 230k, phải mua vé nghỉ dưỡng cùng ngày.',
        '**Aqua Garden Cafe** — nước & kem tuyết, khu sân vườn.',
        '**Đãi tiệc sinh nhật** — bàn từ 5 người, đặt trước 1 ngày, tặng bánh pizza.',
        '**Game vòng quay may mắn** — bill từ 200k được quay; voucher dùng ở lần sau khi bill từ 300k.'] },

    { h:'💅 Golden Nail & Hair',
      bullets:['**Nail** — sơn gel, art design tay/chân, cắt da.',
        '**Hair** — color, style, treatment, Keratin / Collagen Treatment 3 step, cắt tóc nam/nữ + gội đầu 10 phút.',
        '**Beauty Passport** — thẻ tích luỹ 10% cho bill Nail & Hair từ 200k, dùng ở lần thứ 4, hiệu lực 06 tháng.',
        '**Review Google Maps** — mỗi ngày 5 review, tặng 1 voucher nghỉ dưỡng (check-in sau 19:00).'] },

    { h:'🏋️ Lớp học & hoạt động MIỄN PHÍ (đã gồm trong vé nghỉ dưỡng)',
      table:{head:['Hoạt động','T2–T6','T7–CN','Khung giờ'],rows:[
        ['Gym','9 ca (nghỉ thứ 3)','9 ca','10:00 → 20:30 · mỗi ca 1 tiếng'],
        ['Yoga','6 ca','4 ca','T2–T6 từ 11:00 · T7–CN từ 12:00'],
        ['Dance','4 ca','4 ca','T2–T6 từ 15:10 · T7–CN từ 12:40'],
        ['Game','3 ca','3 ca','T2–T6 từ 10:30 · T7–CN từ 13:20']]} },

    { h:'🏢 Bố trí các lầu',
      table:{head:['Tầng','Khu vực'],rows:[
        ['Lầu 1','Public Bathhouse · Snack bar'],
        ['Lầu 2','Các phòng nhiệt nóng/lạnh chuyên đề · Board Game · Relax zone · Kid zone'],
        ['Lầu 3','Carnival Game · Music Box (karaoke) · Dance · Yoga · Gym · Mini game tương tác · Phòng thuốc bắc · Chiếu phim · Cafe cá · Khu check-in chụp hình · Sự kiện theo chủ đề']]} },

    { h:'➕ Phụ thu',
      table:{head:['Khoản','Giá'],rows:[['Đồng phục','20k'],['Khăn','5k'],['Phòng VIP','100k / người']]} }
  ]
},

{
  br:'Q7', tag:'Q7', icon:'7️⃣',
  name:'Golden Lotus Retreat World & Jjimjilbang — Quận 7',
  sub:'Nghỉ dưỡng + bathhouse + skin care + nhóm care. Happy Hour mở sớm hơn Quận 2.',
  groups:[
    { h:'🛁 Nghỉ dưỡng (Golden Lotus Relaxation)',
      table:{head:['Loại vé','Giá thường'],rows:[
        ['Người lớn','**250k**'],['Trẻ em 0,8 – 1,2m','150k'],['Baby dưới 0,8m','Miễn phí']]} },

    { h:'🏊 Bathhouse',
      table:{head:['Loại vé','Giá thường'],rows:[['Người lớn','**220k**'],['Trẻ em','110k']]},
      note:'Bathhouse chỉ có Happy Hour buổi sáng (07:00–11:00), không có ca tối.' },

    { h:'✨ Skin Care (Peeling — chà da Hàn Quốc)',
      table:{head:['Dịch vụ','Thời lượng','Giá thường'],rows:[
        ['Skin Care Nữ (Peeling Skin)','45 phút','**350k**'],
        ['Skin Care Nam (Peeling Skin)','30 phút','290k'],
        ['Skin Care Trẻ em','—','195k'],
        ['Honey Skin Care (Nữ)','50 phút','**450k**']]},
      note:'Honey Skin Care = scrub (bắp / hạt sen / sữa muối) + wrap (cà phê / nghệ / dừa mật ong) + xông nhiệt 20 phút miễn phí.',
      warn:'Chà da bắt buộc phải ngâm cho da mềm ra trước. Khách ĐÃ có vé Nghỉ dưỡng thì ngâm luôn ở khu tắm trong vé — KHÔNG cần mua thêm vé Bathhouse. Khách CHỈ dùng chà da, không mua vé nghỉ dưỡng thì BẮT BUỘC mua vé Bathhouse riêng.' },

    { h:'💆 Body · Foot · Facial care',
      table:{head:['Dịch vụ','Kỳ T7,T8','Kỳ T9,T10','Giờ'],rows:[
        ["Facial Care 60'",'230k','263k','10:00–22:00, T2–T6'],
        ["Foot Care 60' (giảm 20%)",'252k','266k','Sau 19:00, T2–T6'],
        ['Body Care no oil (giảm 20%)','316k','330k','Sau 19:00, T2–T6']]},
      note:'Facial Care booking trước ít nhất 1 tiếng. Foot / Body care booking qua hotline, KHÔNG áp dụng lễ tết.' },

    { h:'⏰ Happy Hour — mở sớm hơn Quận 2',
      table:{head:['Hạng mục','Ca sáng T2–T6','Ca tối T2–CN'],rows:[
        ['Nghỉ dưỡng — Người lớn','**190k** (08:00–11:00)','**150k** (19:00–24:00)'],
        ['Nghỉ dưỡng — Trẻ em','115k','115k'],
        ['Bathhouse — Người lớn','**175k** (07:00–11:00)','— không có'],
        ['Bathhouse — Trẻ em','85k','—'],
        ['Skin Care — Nữ','**280k** (07:00–11:00)','**280k** (18:00–24:00)'],
        ['Skin Care — Nam','235k','235k'],
        ['Skin Care — Trẻ em','155k','155k']]},
      note:'Ca sáng KHÔNG áp dụng ngày lễ · ca tối CÓ áp dụng ngày lễ.' },

    { h:'➕ Phụ thu',
      table:{head:['Khoản','Giá'],rows:[['Đồng phục','20k'],['Khăn','5k']]} },

    { h:'❌ Quận 7 KHÔNG có',
      bullets:['Golden Kitchen / Aqua Garden Cafe','Nail & Hair','Combo nghỉ dưỡng + Skin care','Beauty Passport'] }
  ]
},

{
  br:'Q1', tag:'Q1', icon:'1️⃣',
  name:'Golden Lotus — Quận 1',
  sub:'Thiên về spa & care: bathhouse, skin care, body/foot care, facial, VIP và nail.',
  groups:[
    { h:'🏊 Bathhouse & ✨ Skin Care',
      bullets:['**Happy Hour Bathhouse Nam — 176k**, 09:00–12:00, T2–T6, khách trên 1,2m, KHÔNG áp dụng lễ tết.',
        '**Happy Hour Skin Care Nam — 232k**, 09:00–12:00, T2–T6, khách trên 1,2m, KHÔNG áp dụng lễ tết.'],
      note:'Chà da bắt buộc phải ngâm cho da mềm ra trước. Khách ĐÃ có vé Nghỉ dưỡng thì ngâm luôn ở khu tắm trong vé — KHÔNG cần mua thêm vé Bathhouse. Khách CHỈ dùng chà da, không mua vé nghỉ dưỡng thì BẮT BUỘC mua vé Bathhouse riêng.',
      warn:'Giá NIÊM YẾT (giá thường) của Bathhouse và Skin Care Quận 1 chưa có trong tài liệu — cần bảng giá menu Quận 1 để bổ sung.' },

    { h:'💆 Body & Foot care',
      table:{head:['Dịch vụ','Thời lượng','Giá thường'],rows:[
        ['Foot on an armchair','30 phút','210k'],
        ['Foot on an armchair','60 phút','**315k**'],
        ['Golden Lotus Foot 60’ + Mini Facial 30’','90 phút','495k'],
        ['Head, Neck & Shoulder','30 phút','210k'],
        ['4 Hands — Foot','60 phút','500k'],
        ['Golden Lotus Body (No Oil)','60 phút','**395k**'],
        ['Golden Lotus Body (No Oil)','90 phút','495k'],
        ['Golden Lotus Foot 90’ — Foot 60’ + Hot stone back 30’','90 phút','395k'],
        ['Golden Lotus Foot 120’ — Foot 60’ + 60’','120 phút','495k'],
        ['Golden Lotus Body 60’ + Mini Facial 30’','90 phút','575k'],
        ['4 Hands Golden Lotus Body','60 phút','600k'],
        ['Aromatherapy Oil (lavender, rosemary, peppermint, ylang ylang)','60 / 90 phút','450k / 550k'],
        ['Hot Stone Relief Therapy','60 / 90 phút','450k / 550k'],
        ['Vietnamese Hot Stone Back','90 / 120 phút','550k / 650k'],
        ['Organic Herbal Ball (handmade)','60 / 90 phút','550k / 650k'],
        ['Thai Traditional','90 phút','550k'],
        ['Pregnancy','60 phút','470k'],
        ['Shiatsu Therapy','70 phút','430k']]} },

    { h:'👶 Care cho trẻ em',
      table:{head:['Dịch vụ','Thời lượng','Giá thường'],rows:[
        ['Child Foot (dưới 1,2m)','60 phút','220k'],
        ['Child Foot & Body (dưới 1,2m)','90 phút','280k']]} },

    { h:'🧖 Facial',
      table:{head:['Dịch vụ','Thời lượng','Giá thường'],rows:[
        ['Mini Facial — clean, steam, facial','30 phút','245k'],
        ['Acne Treatment','60 phút','420k'],
        ['Radiance Brightening — LED / PDT whitening + hand','90 phút','550k'],
        ['Korean V-shaped — xung điện tần số cao + hand','90 phút','590k']]} },

    { h:'💎 VIP Golden Lotus',
      table:{head:['Gói','Thời lượng','Giá thường'],rows:[
        ['VIP Golden Lotus','60 phút','770k'],
        ['VIP Golden Lotus','90 phút','880k'],
        ['VIP Golden Lotus','120 phút','**990k**']]} },

    { h:'💅 Nail Quận 1',
      bullets:['Sơn gel tay hoặc chân (cắt da + sơn) và Design tay/chân: **giảm 20%**, 10:00–16:00, T2–T6, đến 31/12/2026 — KHÔNG áp dụng lễ tết.',
        'Review Google Maps: **miễn phí tháo gel** hoặc tặng **thêm 1 màu sơn (1 ngón)** — T2–CN, ÁP DỤNG cả lễ tết.'] },

    { h:'❌ Quận 1 KHÔNG có',
      bullets:['Ưu đãi HSSV','Ưu đãi khách U60+','Ưu đãi tối','Ưu đãi Lễ 2/9','Golden Kitchen / Aqua Garden Cafe','Hair'] }
  ]
}
];
