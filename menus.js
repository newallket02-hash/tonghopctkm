/* ==========================================================================
   MENU TỪNG CHI NHÁNH — hiện ở tab "Hôm nay" khi bấm lọc Q1 / Q2 / Q7
   --------------------------------------------------------------------------
   Ảnh nằm trong thư mục /menu:  <chi-nhanh>-<so>.jpg  (ảnh lớn, rộng 1240px)
                                 <chi-nhanh>-<so>-t.jpg (ảnh nhỏ, rộng 240px)
   Thay menu mới: ghi đè ảnh cùng tên rồi TĂNG MENU_VER để máy nhân viên tải lại.
   ========================================================================== */
const MENU_VER = '20260929';
const MENUS = {
  Q1: [
    { f:'q1-1', cap:'Bathhouse · Skin Care · Facial' },
    { f:'q1-2', cap:'Relaxing · Healing · Herbal · VN · Zen' },
    { f:'q1-3', cap:'Soul Relax · Balance · Energizing · VIP' },
    { f:'q1-4', cap:'Kids · Gội đầu · Phí dịch vụ' }
  ],
  Q2: [
    { f:'q2-4', cap:'Nghỉ dưỡng · Bathhouse' },
    { f:'q2-5', cap:'Skin Care · Honey Skin Care · Phụ thu' },
    { f:'q2-1', cap:'Healing · Herbal · Zen · Kids · Bầu' },
    { f:'q2-2', cap:'Facial · Combo lấy ráy tai · Phụ thu' },
    { f:'q2-3', cap:'Combo VIP · Soul Relax · Balance · Energizing' }
  ],
  Q7: [
    { f:'q7-2', cap:'Nghỉ dưỡng · Bathhouse' },
    { f:'q7-3', cap:'Skin Care · Honey Skin Care · Phụ thu' },
    { f:'q7-1', cap:'Healing · Herbal · Kids' },
    { f:'q7-4', cap:'Combo VIP · Soul Relax · Balance · Energizing' },
    { f:'q7-5', cap:'Balance · Zen · Kids · Facial · Bầu' }
  ]
};
