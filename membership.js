/* ==========================================================================
   APP MEMBERSHIP — kiến thức cho nhân viên tư vấn / lễ tân
   --------------------------------------------------------------------------
   Cùng cấu trúc với CONCEPTS (concepts.js), thêm 2 trường tuỳ chọn:
     item.lb   : nhãn cho danh sách steps (mặc định "Quy trình")
     item.list : true = danh sách chấm (không đánh số)
     item.kv   : [['Nhãn','Nội dung'], ...] thay cho time/who/fit
     notes     : [ '...', ... ] lưu ý chung của mục (hiện cuối mục)
   Nguồn chính sách: Google Sheet "Golden Membership - Feedback".
   ========================================================================== */
const MEMBERSHIP_GUIDE = 'https://h-ng-d-n-s-d-ng-app-membership-gold.vercel.app';
const MEMBERSHIP = [
{
  id:'app',
  icon:'📱',
  title:'App Membership là gì',
  sub:'App thành viên Golden Lotus: khách **tích Point, lên hạng, đặt lịch, nhận voucher**. Giai đoạn 1, chính sách tích điểm & hạng **chỉ áp dụng tại chi nhánh Quận 2**.',
  items:[
    {
      name:'Khách dùng app để', en:'Customer', alias:'trên điện thoại', list:true, lb:'Chức năng chính',
      steps:[
        '**Đăng ký** bằng SĐT / email → nhập **OTP** → điền thông tin → đặt **mã PIN**. Có thể đăng nhập bằng **Google / Apple / sinh trắc học**.',
        'Xem **hạng thành viên**, số **Point**, các lô điểm sắp hết hạn và **lịch sử dùng điểm**.',
        '**Đặt lịch** dịch vụ: chọn thành phố → chi nhánh, danh mục → dịch vụ, ngày giờ.',
        '**Ví voucher**: bấm dùng voucher để hiện **mã QR** cho lễ tân quét.',
        '**Vòng quay may mắn** mỗi ngày (cần **hoàn tất hồ sơ**, có ngày sinh).',
        '**Mời bạn bè** bằng link giới thiệu; **chuyển Point** cho thành viên khác (theo hạng được cài đặt, hiện từ **Gold** trở lên).'
      ],
      kv:[['💸 Phí','**Không** phí đăng ký, **không** phí thường niên']]
    },
    {
      name:'Lễ tân cần làm', en:'Reception', alias:'tại quầy / POS', tone:'honey', list:true, lb:'Việc tại quầy',
      steps:[
        'Khách đưa **QR membership** trong app → quét trên **POS** để nhận diện và tích Point.',
        'Mỗi hóa đơn chỉ áp **1 thẻ membership**.',
        'Khách chưa có app: nhập **SĐT** tại POS / Kiosk → hệ thống tự tạo thành viên và cộng dồn chi tiêu.',
        'Voucher trong app: khách bấm dùng → hiện **QR** → lễ tân quét. Voucher chỉ hợp lệ cho đúng **dịch vụ / chi nhánh** ghi trên voucher.',
        'Booking chỉ chuyển **Hoàn thành** khi lễ tân **checkout trên POS** — app không tự hoàn thành.',
        'Quản lý booking trên **CMS**: [app-adminapp.glcenter.top](https://app-adminapp.glcenter.top/dashboard/lotus/bookings) (Danh sách booking, Lịch hẹn, Voucher redemptions).'
      ]
    }
  ]
},
{
  id:'hang',
  icon:'🏅',
  title:'Hạng thành viên',
  sub:'Hạng xét theo **tổng chi tiêu thực** (tiền mặt / thẻ / chuyển khoản) — **không** tính phần trả bằng Point.',
  items:[
    { name:'Silver', en:'0 – dưới 5 triệu', kv:[['📈 Hoàn Point','**3%**']] },
    { name:'Gold', en:'5 – dưới 40 triệu', tone:'honey',
      kv:[['📈 Hoàn Point','**5%**'],['🎂 Sinh nhật','**1** voucher nghỉ dưỡng · HSD 30 ngày']] },
    { name:'Platinum', en:'40 – dưới 80 triệu',
      kv:[['📈 Hoàn Point','**7%**'],['🎂 Sinh nhật','**2** voucher nghỉ dưỡng · HSD 30 ngày']] },
    { name:'Diamond', en:'từ 80 triệu', tone:'honey',
      kv:[['📈 Hoàn Point','**9%**'],['🎂 Sinh nhật','**3** voucher nghỉ dưỡng · HSD 30 ngày']] }
  ],
  notes:[
    'Lên hạng có hiệu lực từ **giao dịch tiếp theo**, không tính lại hóa đơn vừa đạt mốc.',
    'Hạng có hiệu lực **365 ngày** kể từ ngày lên hạng; hết hạn, hệ thống xét lại chi tiêu **365 ngày gần nhất**.',
    'Không đạt mức chi tiêu: chỉ **hạ 1 bậc** (vd. Diamond → Platinum), không về thẳng Silver.',
    'Hóa đơn thanh toán bằng **voucher quà tặng** không được tích Point.'
  ]
},
{
  id:'point',
  icon:'💰',
  title:'Point — tích & dùng',
  sub:'**1 Point = 1 VNĐ.** Point là ví tiêu dùng, tách riêng với chi tiêu dùng để xét hạng.',
  items:[
    {
      name:'Tích Point', en:'Earn', alias:'nhận điểm', tone:'peel', list:true, lb:'Nguồn Point',
      steps:[
        '**Hoàn Point** trên hóa đơn theo % của hạng — hạn **365 ngày** từ ngày thanh toán.',
        '**Mua / nạp Point** — hạn **365 ngày** từ ngày giao dịch.',
        '**Vòng quay, chương trình MKT** — hạn **ngắn, theo từng đợt** (vd. 7–30 ngày).',
        '**Mời bạn bè**: Point ở trạng thái **chờ (pending)** cho đến khi người được mời có giao dịch thật.'
      ]
    },
    {
      name:'Dùng Point', en:'Redeem', alias:'trừ điểm', tone:'honey', list:true, lb:'Quy tắc',
      steps:[
        'Số dư phải đạt **tối thiểu 10.000 Point** mới dùng được.',
        'Tự trừ **lô sắp hết hạn trước**.',
        'Trừ **voucher / giảm giá %** trước, rồi mới trừ Point; Point **không vượt** số tiền còn lại.',
        'Point là **một hình thức thanh toán** — kết hợp được **Point + tiền mặt / thẻ** trên cùng 1 bill.',
        'Phần trả bằng Point **không tính** vào chi tiêu xét hạng.'
      ]
    }
  ]
},
{
  id:'qua',
  icon:'🎁',
  title:'Quà tặng & Booking trên app',
  sub:'Ưu đãi khách nhận tự động và cách đọc trạng thái lịch hẹn.',
  items:[
    {
      name:'Quà tặng', en:'Rewards', list:true, lb:'Khách nhận',
      steps:[
        '**Thành viên mới**: voucher **100.000đ**, HSD **30 ngày**.',
        '**Sinh nhật**: voucher theo hạng (xem mục Hạng thành viên).',
        '**Vòng quay**: Point hoặc voucher; mỗi tài khoản / thiết bị quay theo lượt trong ngày.',
        'Quà đăng ký chỉ nhận **1 lần** cho mỗi tài khoản và mỗi thiết bị — đổi máy **không** cấp lại.'
      ]
    },
    {
      name:'Trạng thái booking', en:'Booking', tone:'peel',
      steps:[
        '**Chờ xác nhận** — khách vừa đặt trên app.',
        '**Đã xác nhận** — chi nhánh nhận lịch. Quá giờ hẹn mà không check-in → hệ thống **tự hủy / quá hạn**.',
        '**Đã check-in** — khách đến quầy.',
        '**Hoàn thành** — chỉ khi lễ tân **checkout trên POS**. Khách hoặc chi nhánh có thể **hủy** trước đó.'
      ]
    }
  ]
}
];
