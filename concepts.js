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
},
{
  id:'kiosk',
  icon:'🖥️',
  title:'Kiosk tự order vé',
  sub:'Khách tự mua vé tại Kiosk rồi mang hóa đơn đến quầy **“Check-in Kiosk Here”** để check-in và nhận đồng phục.',
  items:[
    {
      name:'Mua vé tại Kiosk', en:'Self-order Kiosk', alias:'khách tự thao tác',
      steps:[
        'Chạm **BUY TICKET** ở màn hình chờ.',
        'Chọn **ngôn ngữ** và loại khách: khách lẻ → **Non-Membership**; thành viên → **Membership** (quét QR trong app).',
        'Khách lẻ nhập **tên** và **số điện thoại** → **Xác nhận** → **Tiếp tục**.',
        'Chọn số khách **Nam / Nữ** (cao từ 1,2m) và **Trẻ em** (cao 0,8m – 1,2m), chọn **1 size áo cho mỗi người** (người lớn S–XXXL, trẻ em S hoặc M).',
        'Chạm **+** chọn vé cho từng khách đến khi báo **“Đã chọn đủ”**. Vé ưu đãi phải tick **xác nhận đủ điều kiện**.',
        'Kiểm tra **Tạm tính, VAT 8%, Tổng cộng** → chọn **Thẻ tín dụng** hoặc **Trả tiền mặt**.',
        'Bảng **Xác nhận order** hiện lên → kiểm tra lần cuối → **Xác nhận** (cần sửa thì **Quay lại**).',
        'Thẻ: chạm / quẹt vào **máy POS bên phải**. Hóa đơn in ra ở khe bên trái — **giữ lại hóa đơn**.'
      ],
      who:'Khách lẻ (**Non-Membership**) và thành viên (**Membership**)',
      fit:'Khách muốn **tự mua vé nhanh**, không cần chờ ở quầy lễ tân.'
    },
    {
      name:'Check-in tại quầy', en:'Check-in Kiosk Here', alias:'lễ tân xử lý', tone:'honey',
      steps:[
        'Khách mang **hóa đơn Kiosk** đến quầy có bảng **“Check-in Kiosk Here”**.',
        'Khách chọn **Trả tiền mặt** → thanh toán **tại quầy** trước khi check-in.',
        'Kiểm tra **giấy tờ / điều kiện** nếu khách dùng vé ưu đãi (Nữ, U60+, HSSV…).',
        'Check-in và **giao đồng phục theo size** in trên hóa đơn.'
      ],
      who:'**Lễ tân** tiếp nhận khách đã order trên Kiosk',
      fit:'Hóa đơn ghi **số phiếu, số khách và size áo** của cả nhóm — dùng hóa đơn này để check-in.',
      link:{label:'📘 Hướng dẫn lễ tân thao tác (PDF)', url:'https://drive.google.com/file/d/1_IpUqRi_riDnTaoTgEedm7fkhTphD7W5/view?usp=sharing'}
    }
  ],
  compare:{
    head:['', 'Trên Kiosk', 'Tại quầy lễ tân'],
    rows:[
      ['Thanh toán', 'Thẻ tín dụng (Visa / Master) qua máy POS bên phải', 'Tiền mặt (khách chọn “Trả tiền mặt” trên Kiosk)'],
      ['Giá hiển thị', 'Giá vé niêm yết **chưa gồm VAT** — số cần trả là dòng **Tổng cộng** (đã gồm VAT 8%)', '—'],
      ['Loại vé', 'Chỉ hiện vé áp dụng cho **ngày và giờ hiện tại**', '—'],
      ['Vé ưu đãi', 'Khách tick xác nhận đủ điều kiện khi chọn vé', 'Lễ tân kiểm tra giấy tờ / điều kiện khi check-in'],
      ['Đồng phục', 'Khách chọn size cho từng người', 'Giao đồng phục theo size trên hóa đơn']
    ]
  }
}
];
