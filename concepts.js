/* ==========================================================================
   KHÁI NIỆM DỊCH VỤ — giải thích / phân biệt các dịch vụ dễ nhầm
   --------------------------------------------------------------------------
   Thêm khái niệm mới: thêm 1 object vào CONCEPTS.
   { id, icon, title, sub, items: [ { name, en, alias, tone, steps:[...], time, who, fit } ],
     compare: { head:[...], rows:[[...]] } }   ← compare không bắt buộc
   tone: 'peel' (xanh lá) | 'honey' (vàng mật ong) | để trống = màu navy
   Chữ **in đậm** dùng được trong mọi ô.
   ========================================================================== */
const CONCEPTS = [
{
  id:'skincare',
  icon:'🌿',
  title:'Skin Care vs Honey Skin Care',
  sub:'Phân biệt 2 dịch vụ chăm sóc da: chà da (Skin Peeling) và ủ dưỡng (Body Scrub).',
  items:[
    {
      name:'Skin Care', en:'Skin Peeling', alias:'chà da', tone:'peel',
      steps:[
        'Quý khách **ngâm mình trong hồ khoảng 20–30 phút** trước khi thực hiện để làm mềm da.',
        'Nhân viên dùng **găng tay chuyên dụng của Hàn Quốc** để chà sạch tế bào chết.',
        'Cuối cùng, nhân viên **thoa kem dưỡng ẩm** giúp da mềm mại, mịn màng.'
      ],
      time:'Khoảng **45 phút** (khách nữ) · khoảng **30 phút** (khách nam)',
      who:'Khách **nữ** và khách **nam**',
      fit:'Khách có nhu cầu **làm sạch sâu** và **loại bỏ tế bào chết** hiệu quả.'
    },
    {
      name:'Honey Skin Care', en:'Body Scrub', alias:'ủ da', tone:'honey',
      steps:[
        'Quý khách **ngâm hồ 20–30 phút** để thư giãn cơ thể.',
        'Nhân viên **chà nhẹ nhàng trong 5 phút**.',
        'Tiến hành **ủ dưỡng da** bằng thành phần thiên nhiên lành tính: **cà phê, mật ong, nghệ…**'
      ],
      time:'',
      who:'**Chỉ dành riêng cho khách nữ**',
      fit:'Khách có nhu cầu **nuôi dưỡng, cấp ẩm** và chăm sóc bề mặt da **mịn màng, sáng khỏe**.'
    }
  ],
  compare:{
    head:['', 'Skin Care (chà da)', 'Honey Skin Care (ủ da)'],
    rows:[
      ['Tên gọi khác', 'Skin Peeling', 'Body Scrub'],
      ['Ngâm hồ trước', '20–30 phút — làm mềm da', '20–30 phút — thư giãn cơ thể'],
      ['Chà', 'Chà sạch tế bào chết bằng găng tay Hàn Quốc', 'Chà nhẹ nhàng 5 phút'],
      ['Bước cuối', 'Thoa kem dưỡng ẩm', 'Ủ dưỡng da: cà phê, mật ong, nghệ…'],
      ['Thời gian', '~45 phút (nữ) · ~30 phút (nam)', '—'],
      ['Đối tượng', 'Nữ & Nam', 'Chỉ khách nữ'],
      ['Mục đích', 'Làm sạch sâu, loại bỏ tế bào chết', 'Nuôi dưỡng, cấp ẩm, da mịn & sáng']
    ]
  }
}
];
