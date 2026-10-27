/* ==========================================================================
   KỊCH BẢN TƯ VẤN — dữ liệu cho chatbot "Hỏi nhanh" (api/chat.js)
   --------------------------------------------------------------------------
   Nguồn: sheet "Câu hỏi khách thường hỏi" + kịch bản gói VIP 5 tháng (24/10/2026) + mẫu VIP tiếng Hàn (27/10/2026).
   Mỗi mục: { br, nhom, hoi: [các cách khách hay hỏi], tl: 'câu trả lời mẫu' }
     br  : 'Q2' | 'Q1' | 'Q7' | 'Chung'
     hoi : càng nhiều cách hỏi, chatbot càng dễ tìm đúng mục
     tl  : nói đúng như lễ tân sẽ trả lời khách
   Giá / ưu đãi theo ngày KHÔNG ghi ở đây — chatbot lấy từ offers.js để luôn đúng kỳ.
   Câu chưa có câu trả lời: để tl = '' → chatbot sẽ báo "chưa có, hỏi quản lý".
   ========================================================================== */
const KICHBAN = [

/* ---------- THÔNG TIN CHUNG ---------- */
{ br:'Q2', nhom:'Thông tin chung', hoi:['Nhà hàng nằm đâu', 'Nhà hàng ở tầng mấy', 'Golden Kitchen ở đâu', 'Chỗ ăn uống ở đâu', 'Restaurant where', '식당 어디', '레스토랑 몇 층'],
  tl:'Dạ nhà hàng Á–Âu Golden Kitchen nằm tại tầng G của khu nghỉ dưỡng Golden Lotus Healing World (16A Đường Số 10, An Khánh, Hồ Chí Minh) ạ. Tầng G còn có Nail, Hair, Massage cá và Cafe cá.' },
{ br:'Q2', nhom:'Thông tin chung', hoi:['Giờ hoạt động', 'Mấy giờ mở cửa, mấy giờ đóng cửa', 'Địa chỉ ở đâu', 'Hotline số điện thoại', 'Xin map, website'],
  tl:'Dạ Golden Lotus Healing World mở cửa 09:00 – 24:00 ạ.\n📍 Địa chỉ: 16A Đường Số 10, An Khánh, Hồ Chí Minh\n📞 Hotline: (028) 3622 9870 – (028) 3622 9871 – (028) 38 239 000\n🗺 Map: maps.app.goo.gl/DSKWVtexRyMkj2hc8\n🌐 Website: goldenlotusspa.vn' },
{ br:'Q2', nhom:'Thông tin chung', hoi:['Đi nghỉ dưỡng có cần đặt trước không', 'Có cần book trước không', 'Đặt chỗ'],
  tl:'Dạ dịch vụ nghỉ dưỡng không cần đặt trước ạ. Anh/chị đến check-in trực tiếp tại quầy bất kỳ khung giờ nào trong giờ hoạt động.' },
{ br:'Q2', nhom:'Thông tin chung', hoi:['Dịch vụ nghỉ dưỡng có giới hạn thời gian không', 'Được ở bao lâu', 'Vé dùng mấy tiếng'],
  tl:'Dạ dịch vụ nghỉ dưỡng không giới hạn thời gian ạ, anh/chị dùng đến khi đóng cửa lúc 24:00.' },
{ br:'Q2', nhom:'Thông tin chung', hoi:['Bên mình có những dịch vụ gì', 'Có dịch vụ nào'],
  tl:'Dạ khu phức hợp Golden Lotus Healing World gồm: vé nghỉ dưỡng Healing World, vé Bathhouse, Care, Peeling Skin – Body Scrub, Nail salon, Hair salon và nhà hàng Á–Âu Golden Kitchen. Anh/chị quan tâm dịch vụ nào để em tư vấn ạ?' },
{ br:'Q2', nhom:'Thông tin chung', hoi:['Dịch vụ nghỉ dưỡng bao gồm những gì', 'Vé nghỉ dưỡng gồm gì', 'Gói nghỉ dưỡng có gì', 'Có những phòng xông nào'],
  tl:'Dạ vé nghỉ dưỡng Healing World không giới hạn thời gian, dùng đến khi đóng cửa lúc 24:00. Vé ở mọi mức giá đều đầy đủ dịch vụ, giá khác nhau do đối tượng và khung giờ mua vé:\n- Khu tắm bathhouse: phòng tắm đứng có rèm, phòng nhiệt ướt – khô, bồn sục Jacuzzi, bồn ngâm toàn thân nóng – lạnh. Tuyệt đối không dùng điện thoại/thiết bị quay chụp tại bathhouse.\n- Phòng nhiệt chuyên đề: Bùn khoáng thuốc Bắc, Đá núi lửa, Đá muối Himalaya, Thuốc Bắc hồng ngoại, Tuyết igloo, Gỗ thông Hinoki; ngoài ra còn phòng sắc màu, hang hồng ngoại, sàn nóng thư giãn lưng, phòng thiền…\n- Hồ ngâm chân nóng – lạnh ngoài trời.\n- Phòng Gym có PT; lớp Dance – Yoga – Game có giáo viên.\n- Music Box, phòng chiếu phim, khu board game, motion game, coworking cafe có ổ sạc, massage cá ngoài trời.\nVé chưa bao gồm chi phí phát sinh như ăn uống, massage, tẩy tế bào chết, chà da, mua xu chơi game, nail và hair ạ.' },
{ br:'Chung', nhom:'Thông tin chung', hoi:['Ưu đãi Q7 và Q2 có giống nhau không', 'Ưu đãi các chi nhánh giống nhau không'],
  tl:'Dạ dịch vụ và ưu đãi ở mỗi chi nhánh khác nhau ạ.' },
{ br:'Q2', nhom:'Thông tin chung', hoi:['Những game nào miễn phí', 'Game free', 'Chơi game có mất tiền không'],
  tl:'Dạ game motion tương tác (bowling, chém trái cây, dance theo máy…), máy rung massage và khu board game là miễn phí ạ.' },
{ br:'Q2', nhom:'Thông tin chung', hoi:['Xin hình khu bathhouse', 'Xin hình khu vui chơi cho bé', 'Có video không gian không'],
  tl:'Dạ anh/chị tham khảo không gian khu nghỉ dưỡng Golden Lotus Healing World tại đây ạ: https://www.youtube.com/watch?v=ryfAd39k0vU' },
{ br:'Q2', nhom:'Thông tin chung', hoi:['Có phòng tắm riêng không', 'Tắm riêng được không'],
  tl:'Dạ khu bathhouse có phòng tắm đứng có rèm ạ.' },
{ br:'Q2', nhom:'Thông tin chung', hoi:['Các phòng dùng chung hay chia nam nữ', 'Bể ngâm có chia nam nữ không'],
  tl:'Dạ khu bể ngâm khép kín được chia riêng nam/nữ ạ. (Các khu khác chưa có trong kịch bản — hỏi quản lý.)' },

/* ---------- GIÁ & THANH TOÁN ---------- */
{ br:'Q2', nhom:'Giá & thanh toán', hoi:['Giá vé người lớn bao nhiêu', 'Giá vé gốc', 'Vé nghỉ dưỡng bao nhiêu tiền'],
  tl:'Dạ giá thường vé nghỉ dưỡng người lớn là 270k đến hết 31/10/2026, từ 01/11/2026 là 290k, chưa bao gồm VAT ạ. (Ưu đãi theo khung giờ / đối tượng: xem CTKM của ngày khách đến.)' },
{ br:'Q2', nhom:'Giá & thanh toán', hoi:['Trẻ em giá vé như thế nào', 'Bé bao nhiêu tiền', 'Em bé có mất tiền không', 'Trẻ em cao 1m'],
  tl:'Dạ giá vé trẻ em (chưa VAT): trẻ cao trên 1,2m tính giá người lớn; trẻ cao 0,8–1,2m giá 170k; trẻ dưới 0,8m miễn phí (phải có người lớn đi kèm). Happy Hour trẻ em 0,8–1,2m giá 140k: sáng thứ 2–thứ 6 9:00–11:00 và tối thứ 2–CN 20:00–24:00; Happy Hour sáng không áp dụng T7, CN và Lễ Tết ạ.' },
{ br:'Q2', nhom:'Giá & thanh toán', hoi:['Học sinh không mặc đồng phục được không', 'HSSV cần mang gì', 'Điều kiện học sinh sinh viên'],
  tl:'Dạ học sinh cần mang thẻ học sinh, hoặc mặc đồng phục kèm CCCD; sinh viên mang thẻ sinh viên vật lý hoặc online có đủ thông tin và ảnh ạ. (Giá và khung giờ HSSV: xem CTKM của ngày khách đến.)' },
{ br:'Q2', nhom:'Giá & thanh toán', hoi:['T7 CN có ưu đãi HSSV không', 'Cuối tuần học sinh có giảm không'],
  tl:'Dạ ưu đãi HSSV không áp dụng vào T7, CN ạ.' },
{ br:'Q2', nhom:'Giá & thanh toán', hoi:['Ưu đãi U60 có áp dụng T7 CN không', 'Người lớn tuổi cuối tuần'],
  tl:'Dạ ưu đãi U60 không áp dụng vào T7, CN ạ. (Nếu CTKM kỳ hiện tại có giá U60 cuối tuần riêng thì báo theo CTKM.)' },
{ br:'Chung', nhom:'Giá & thanh toán', hoi:['Giá đã gồm VAT chưa', 'Giá có VAT chưa'],
  tl:'Dạ giá vé chưa bao gồm VAT ạ. VAT tùy dịch vụ từ 8–10%.' },
{ br:'Chung', nhom:'Giá & thanh toán', hoi:['Có xuất VAT không', 'Xuất hóa đơn đỏ'],
  tl:'Dạ bên em có xuất VAT ạ.' },
{ br:'Chung', nhom:'Giá & thanh toán', hoi:['Qua ngày xuất VAT được không', 'Hôm sau xuất hóa đơn được không'],
  tl:'Dạ hóa đơn VAT cần xuất trong ngày ạ, anh/chị vui lòng báo lễ tân khi thanh toán.' },
{ br:'Chung', nhom:'Giá & thanh toán', hoi:['Phương thức thanh toán', 'Thanh toán bằng gì', 'Có quẹt thẻ không', 'Apple Pay', 'Thẻ tín dụng ATM'],
  tl:'Dạ bên em nhận tiền mặt, quẹt thẻ, chuyển khoản và Apple Pay ạ.' },
{ br:'Chung', nhom:'Giá & thanh toán', hoi:['Có thanh toán Alipay không', 'WeChat pay'],
  tl:'Dạ bên em chưa nhận thanh toán Alipay và WeChat ạ. Anh/chị dùng tiền mặt, thẻ, chuyển khoản hoặc Apple Pay giúp em nhé.' },

/* ---------- QUY ĐỊNH & KHÁCH ĐẶC BIỆT ---------- */
{ br:'Q2', nhom:'Quy định', hoi:['Mang đồ ăn nước uống vào được không', 'Mang đồ ăn ngoài vào'],
  tl:'Dạ anh/chị vui lòng không mang đồ ăn, nước uống bên ngoài vào không gian nghỉ dưỡng Golden Lotus Healing World ạ.' },
{ br:'Q2', nhom:'Quy định', hoi:['Mang bình giữ nhiệt có nước vào được không', 'Mang bình nước'],
  tl:'Dạ anh/chị có thể để bình giữ nhiệt trong tủ locker ạ.' },
{ br:'Q2', nhom:'Quy định', hoi:['Mang bánh sinh nhật vào được không', 'Tổ chức sinh nhật'],
  tl:'Dạ anh/chị được mang bánh sinh nhật vào và dùng tại nhà hàng ạ. Mình vui lòng không mang đồ ăn vào khu nghỉ dưỡng nhé.' },
{ br:'Q2', nhom:'Quy định', hoi:['Mặc bikini vào sauna được không', 'Mặc đồ lót đồ bơi xuống hồ', 'Tắm có phải cởi đồ không', 'Tắm nude'],
  tl:'Dạ khu ngâm bồn vận hành theo mô hình ngâm bồn truyền thống Hàn Quốc. Do yêu cầu khắt khe về vệ sinh và an toàn nguồn nước, khu bể ngâm khép kín (chia riêng nam/nữ) bắt buộc tắm gội sạch trước khi xuống hồ và không mặc trang phục ạ.' },
{ br:'Q2', nhom:'Khách đặc biệt', hoi:['Có đồ cho em bé không', 'Quần áo trẻ em'],
  tl:'Dạ bên em có đồ cho bé ạ.' },
{ br:'Q2', nhom:'Khách đặc biệt', hoi:['Em bé bao nhiêu tháng tuổi đến được', 'Bé nhỏ có vào được không', 'Trẻ sơ sinh'],
  tl:'Dạ bé vào được ạ. Bên em có khu vui chơi nhỏ cho bé và các phòng nhiệt có nhiệt độ vừa phải, phù hợp cho bé. Một số phòng nhiệt độ cao, mình hạn chế cho bé vào để tránh sốc nhiệt ạ.' },
{ br:'Chung', nhom:'Khách đặc biệt', hoi:['Bà bầu có sử dụng dịch vụ được không', 'Mẹ bầu xông hơi', 'Đang mang thai'],
  tl:'Dạ Golden Lotus có nhiều phòng xông với mức nhiệt và công dụng khác nhau, mẹ bầu có thể chọn không gian nhẹ nhàng để thư giãn. Tuy nhiên thể trạng mỗi người khác nhau, Golden Lotus khuyến khích chị hỏi ý kiến bác sĩ trước khi xông hơi để đảm bảo an toàn ạ.' },
{ br:'Chung', nhom:'Khách đặc biệt', hoi:['Tới tháng có sử dụng dịch vụ được không', 'Đang có kinh nguyệt'],
  tl:'Dạ trong kỳ kinh nguyệt mình nên cân nhắc việc xông hơi ạ: xông phòng nóng làm giãn mạch, có thể gây chóng mặt, mệt hoặc ra máu nhiều hơn; khu tắm chung cũng dễ gây viêm nhiễm. Sau kỳ 3–5 ngày là thời điểm lý tưởng để xông hơi ạ.' },
{ br:'Q2', nhom:'Khách đặc biệt', hoi:['Có đồ cho người trên 100kg không', 'Đồ bigsize', 'Người mập'],
  tl:'Dạ bên em có đồ bigsize đến 150kg ạ.' },

/* ---------- DỊCH VỤ CHĂM SÓC ---------- */
{ br:'Q2', nhom:'Dịch vụ chăm sóc', hoi:['Chà da có chà mặt không'],
  tl:'Dạ dịch vụ chà da chỉ chà body ạ, phần mặt sẽ được đắp mặt nạ dưa leo.' },
{ br:'Q2', nhom:'Dịch vụ chăm sóc', hoi:['Peeling Skin và Body Scrub khác nhau thế nào', 'Quy trình chà da', 'Quy trình body scrub', 'Chà da mất bao lâu'],
  tl:'Dạ em gửi mình thông tin để phân biệt hai dịch vụ ạ:\n🌿 Skin Peeling: ngâm hồ 20–30 phút cho mềm da, nhân viên dùng găng tay chuyên dụng Hàn Quốc chà sạch tế bào chết, sau đó thoa kem dưỡng ẩm. Khoảng 45 phút với khách nữ, 30 phút với khách nam. Phù hợp khách cần làm sạch sâu, loại bỏ tế bào chết.\n🌿 Body Scrub: ngâm hồ 20–30 phút, nhân viên chà nhẹ 5 phút rồi ủ dưỡng bằng thành phần thiên nhiên như cà phê, mật ong, nghệ. Chỉ dành cho khách nữ. Phù hợp khách cần nuôi dưỡng, cấp ẩm, da mịn sáng.' },
{ br:'Q2', nhom:'Dịch vụ chăm sóc', hoi:['Quy trình chăm sóc da mụn', 'Facial gồm những bước nào', 'Chăm sóc da mặt'],
  tl:'Dạ liệu trình Facial 60 phút gồm 15 bước: đi tinh dầu, tẩy trang, rửa mặt, tẩy da chết, xông hơi – hút mụn, nước hoa hồng, đắp rong biển và nằm đèn Omega light 7 màu, kem dưỡng, massage vai cổ, massage mặt, đắp mặt nạ, lau nước hoa hồng, thoa serum và chạy búa lạnh, thoa kem dưỡng, thoa kem chống nắng ạ.' },
{ br:'Q2', nhom:'Dịch vụ chăm sóc', hoi:['Music Box lấy số điện thoại để làm gì', 'Sao phải để lại SĐT khi đặt music box'],
  tl:'Dạ nếu thiết bị hoặc phòng hát có trục trặc, bên em sẽ gọi báo anh/chị dời giờ hoặc đổi phòng ạ.' },

/* ---------- XỬ LÝ TÌNH HUỐNG (nội bộ) ---------- */
{ br:'Chung', nhom:'Xử lý tình huống', hoi:['Khách để quên đồ', 'Thất lạc đồ đạc', 'Mất điện thoại ví tiền'],
  tl:'Quy trình nội bộ:\n1. Đồ dùng thông thường: nói rõ Golden Lotus chỉ hỗ trợ tìm trong khả năng vì khách chủ động để quên; báo sẽ tìm và chủ động liên hệ lại nếu thấy. Cuối ca bắt buộc rà lại toàn bộ khách đã nhận thông tin trong ca và báo lại ngay nếu không tìm thấy.\n2. Tiền hoặc đồ giá trị cao (điện thoại, đồng hồ thông minh, trang sức, ví…): không xử lý qua fanpage/kênh chat; hướng dẫn khách gọi hotline hoặc đến quầy lễ tân ngay để kiểm tra trực tiếp.' },

/* ---------- CHƯA CÓ CÂU TRẢ LỜI (hỏi quản lý) ---------- */
{ br:'Q2', nhom:'Chưa có câu trả lời', hoi:['Tiền dư trong voucher TikTok có dùng mua nước được không'], tl:'' },
{ br:'Q2', nhom:'Dịch vụ & ăn uống', hoi:['Có bán nước gạo mang về không'],
  tl:'Dạ, bên em có phục vụ nước gạo mang về ạ. Anh/chị muốn mua ly để em báo quầy chuẩn bị cho mình nhé?' },
{ br:'Chung', nhom:'Giá & thanh toán', hoi:['Không lấy hóa đơn thì có phải xuất VAT không'],
  tl:'Dạ, VAT là thuế theo quy định của Nhà nước nên không phụ thuộc vào việc khách có lấy hóa đơn hay không ạ. Việc tính và kê khai VAT là nghĩa vụ thuế của doanh nghiệp đối với dịch vụ thuộc diện chịu thuế. Vì vậy, giá chưa bao gồm VAT thì VAT vẫn được tính theo quy định ạ.' },
{ br:'Q2', nhom:'Quy định', hoi:['Mua vé rồi ra ngoài rồi vào lại được không', 'Ra ngoài vào lại'],
  tl:'Dạ vé vào cổng của bên em chỉ áp dụng cho một lần ra vào thôi ạ. Nếu anh/chị ra ngoài có việc thì cần check-out, và khi quay lại mình sẽ cần mua vé mới ạ.' },
{ br:'Q2', nhom:'Khách đặc biệt', hoi:['Khách LGBT vào phòng thay đồ nào', 'Người chuyển giới phòng thay đồ'],
  tl:'Dạ tại Golden Lotus, khu vực phòng thay đồ được phân chia theo giới tính nam và nữ. Quý khách có thể lựa chọn không gian thay đồ nào mà mình cảm thấy thoải mái và phù hợp nhất ạ.' },
{ br:'Q2', nhom:'Dịch vụ chăm sóc', hoi:['Khách cần menu Care bằng tiếng Việt'],
  tl:'Hướng xử lý (nội bộ): menu massage KHÔNG có bản tiếng Việt. Hỏi khách đang quan tâm massage body hay massage chân rồi tư vấn tiếp. Nếu khách muốn làm body thì liệt kê ví dụ: "Dạ bên em có các gói body có dầu / không dầu, massage Thái, body đá nóng, thảo dược… Anh/chị quan tâm gói nào để em tư vấn chi tiết ạ?"' },
{ br:'Q2', nhom:'Xử lý tình huống', hoi:['Phòng xông hơi ồn, khách nói chuyện to tiếng', 'Khách phàn nàn ồn ào'],
  tl:'Dạ em xin lỗi anh/chị vì trải nghiệm chưa được thoải mái này ạ. Em sẽ báo cho bộ phận nhân viên để nhắc nhở các khách hàng giữ gìn không gian yên tĩnh chung, nhằm đảm bảo trải nghiệm thư giãn tốt nhất cho anh/chị cũng như tất cả mọi người ạ. Cảm ơn anh/chị đã phản hồi ạ.' },
{ br:'Q2', nhom:'Dịch vụ chăm sóc', hoi:['Đặt dịch vụ nail hair như thế nào', 'Book nail tóc', 'Số điện thoại nail', 'Hotline hair', 'Zalo nail hair', 'Đặt lịch làm tóc'],
  tl:'Dạ, để đặt lịch làm nail hoặc tóc, anh/chị vui lòng liên hệ Zalo Golden Nail/Hair hoặc gọi hotline để được tư vấn và đặt lịch nhanh chóng ạ:\n💬 Zalo Golden Nail/Hair: https://zalo.me/2216222540401952152\n💅 Hotline Nail: 028 3622 9863\n💇 Hotline Hair: 028 3622 9864' },

/* ---------- GÓI VIP 5 THÁNG (Q2) ---------- */
{ br:'Q2', nhom:'Gói VIP', hoi:['Gói VIP gồm những gì', 'Thẻ VIP có quyền lợi gì', 'Gói VIP 5 tháng', 'Membership VIP'],
  tl:'Dạ GÓI VIP 5 THÁNG – NGHỈ DƯỠNG KHÔNG GIỚI HẠN tại Golden Lotus Healing World Thảo Điền gồm:\n🌿 Đặc quyền nghỉ dưỡng & tập luyện\n- Phòng nhiệt nóng/lạnh và khu nghỉ dưỡng MỖI NGÀY, miễn phí, không giới hạn\n- Sử dụng phòng Gym\n- Mỗi lần đến được dẫn theo 1 người đi cùng MIỄN PHÍ, hưởng quyền lợi tương đương\n- Locker VIP riêng tư\n💆 Ưu đãi dịch vụ\n- Giảm 15% Massage – Nail – Hair\n- Giảm 10% Ẩm thực & khu Giải trí (game)\n🕒 Thời gian: 5 tháng kể từ ngày kích hoạt thẻ VIP' },
{ br:'Q2', nhom:'Gói VIP', hoi:['Tư vấn khách VIP tiếng Hàn', 'Gửi khách Hàn gói VIP', 'VIP 멤버십 안내', 'VIP 5개월 멤버십 가격', '무제한 힐링 회원권', '찜질방 회원권 얼마'],
  tl:'Mẫu tin nhắn tiếng Hàn đã duyệt — khách Hàn hỏi gói VIP thì gửi đúng mẫu này (trong tiếng Hàn, dịch vụ nghỉ dưỡng / Healing gọi là 찜질방 서비스):\n\n안녕하세요, 고객님.\n\n골든로터스 힐링월드 타오디엔점 「VIP 5개월 멤버십 – 무제한 힐링」 안내드립니다.\n\n🌿 힐링 & 운동 특전\n• 온열/냉방 테마룸 및 휴식 공간 매일 무료 이용\n• 헬스장(Gym) 이용\n• 방문 시마다 동반 1인 무료 (동일 혜택 적용)\n• VIP 전용 개인 락커 제공\n\n💆 서비스 할인\n• 마사지 · 네일 · 헤어 15% 할인\n• 식음료 및 게임존 10% 할인\n\n🕒 이용 기간\n✅ VIP 카드 활성화일로부터 5개월\n✅ 기간 동안 힐링 시설 무제한 이용\n\n💰 금액\n• 30,000,000동 / 5개월 (VAT 8% 별도)\n• 현금 결제 시 1,000,000동 즉시 할인 → 29,000,000동\n\n월 약 600만 동으로 두 분이 매일 이용하실 수 있고, 다양한 서비스 할인 혜택도 함께 누리실 수 있습니다.\n\n계약 희망하시는 날짜를 알려주시면 서류를 미리 준비해 두겠습니다. VAT 계산서 발행이 필요하신 경우 별도로 상세 견적 안내드리겠습니다.\n\n감사합니다.' },
{ br:'Q2', nhom:'Gói VIP', hoi:['Gói VIP giá bao nhiêu', 'Thẻ VIP bao nhiêu tiền', 'VIP trả tiền mặt có giảm không'],
  tl:'Dạ gói VIP 5 tháng là 30.000.000đ, chưa bao gồm VAT 8%. Nếu anh/chị thanh toán tiền mặt thì được giảm ngay 1.000.000đ, còn 29.000.000đ ạ. Tính ra khoảng 6 triệu/tháng (chừng 200 nghìn/ngày) cho 2 người dùng mỗi ngày. Nếu cần xuất hóa đơn VAT, em sẽ báo giá chi tiết riêng ạ.' },
{ br:'Q2', nhom:'Gói VIP', hoi:['Kịch bản tư vấn gói VIP', 'Cách chào bán gói VIP', 'Tư vấn khách VIP thế nào'],
  tl:'Kịch bản 6 bước (nội bộ):\n1. Mở đầu: "Dạ em chào anh/chị, em là … bên Golden Lotus Healing World Thảo Điền. Em xin vài phút giới thiệu gói VIP dành cho khách hay ghé nghỉ dưỡng ạ."\n2. Khai thác nhu cầu: hỏi khách ghé mấy lần/tuần, đi một mình hay cùng người nhà, có hay dùng massage/nail/tóc/ăn uống không. Khách đến từ 2 lần/tuần hoặc hay đi 2 người là phù hợp nhất.\n3. Giới thiệu quyền lợi khớp với nhu cầu trước (người đi kèm miễn phí / không giới hạn / giảm 15%–10%), Gym và locker VIP nói cuối.\n4. Báo giá: 30 triệu chưa VAT 8%, tiền mặt giảm 1 triệu còn 29 triệu; quy đổi ~6 triệu/tháng cho 2 người.\n5. Chốt bằng câu hỏi lựa chọn: "Anh/chị muốn thanh toán tiền mặt để được giảm 1 triệu, hay chuyển khoản ạ?" rồi hẹn ngày ký.\n6. Sau chốt: ghi danh sách VIP (mã HĐ, tên, ngày sinh, ngày ký, ngày nộp tiền, VAT), kích hoạt thẻ, hướng dẫn locker và quy định người đi kèm, nhắc gia hạn ~1 tháng trước hạn.' },
{ br:'Q2', nhom:'Gói VIP', hoi:['Khách chê gói VIP giá cao', 'VIP đắt quá'],
  tl:'Dạ em hiểu ạ. Tính ra khoảng 6 triệu/tháng, tức chừng 200 nghìn/ngày cho 2 người, chưa kể giảm 15% massage, nail, tóc và 10% ăn uống mỗi lần anh/chị dùng.' },
{ br:'Q2', nhom:'Gói VIP', hoi:['Khách nói không đi thường xuyên', 'Ít khi đi có nên mua VIP'],
  tl:'Hỏi lại: "Dạ, anh/chị thường đi mấy lần một tháng ạ?" Nếu dưới 1 lần/tuần: không ép, giới thiệu hạng thành viên trên app và giữ liên lạc.' },
{ br:'Q2', nhom:'Gói VIP', hoi:['Khách nói để suy nghĩ thêm', 'Hỏi ý người nhà đã'],
  tl:'"Dạ vâng ạ. Anh/chị đang cân nhắc giá hay cách sử dụng để em gửi thêm thông tin cho đúng ạ?" Nếu cần hỏi người nhà: "Gói được dẫn theo 1 người miễn phí mỗi lần nên người nhà mình cũng dùng được luôn ạ." Gửi brochure, hẹn ngày gọi lại cụ thể.' },
{ br:'Q2', nhom:'Gói VIP', hoi:['Gói VIP có giảm thêm không', 'VIP có xuất VAT không'],
  tl:'"Dạ thanh toán tiền mặt được giảm ngay 1 triệu, còn 29 triệu ạ." Không hứa thêm ưu đãi khi chưa được quản lý duyệt. Khách cần VAT: "Dạ có ạ, giá chưa gồm VAT 8%. Em ghi nhận thông tin công ty và gửi báo giá chi tiết cho anh/chị."' },
{ br:'Q2', nhom:'Gói VIP', hoi:['VIP tạm dừng chuyển nhượng hoàn tiền được không', 'Người đi kèm VIP có được giảm 15% không', 'VIP trả tiền mặt có xuất VAT được không'],
  tl:'' }
];
