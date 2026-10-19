# Tính năng bị GM cũ tắt (quét 19/10)

Tool `tools/quet-tinhnang-tat.js` (chỉ đọc, giải VISCII): mục menu NPC bị comment (`--AddNumText`), câu báo "chưa mở / tạm đóng / bảo trì…", hàm sự kiện `return` ngay. Đối chiếu commit gốc `651afc2` (bản leak lúc nhập): **125 mục đã tắt sẵn từ bản leak (GM cũ)**, 5 mục do NetCo4 tắt có chủ ý (Thương Phố tạm khóa, Thiên Long Ảo Cảnh tạm đóng, Kim Cửu Linh). Toàn repo 239 file có dấu hiệu, 41 file gắn NPC / quái thật trên bản đồ (bên dưới). Tên menu chữ rác = chuỗi Trung chưa Việt hóa (tính năng gốc bị bỏ dở).

## NPC người chơi gặp - đáng cân nhắc bật lại
| Chỗ | Bị tắt | Ghi chú |
|---|---|---|
| Võ Hồn `odali_wuyazi.lua` 892101 | Tăng Cấp Võ Hồn Nhanh [50], Thay đổi Cầm tinh [21], Hợp thành Nhuận Hồn Thạch [15] | Hợp Hồn Băng Châu đã có đường khác (mở cấp 6 ngày 19/10) |
| Sào Nguyên `jingtongnpc.lua` 890088 | Phân Giải Trang Bị [6] | Hàm `x890087_fenjie` còn: trả Li Hỏa + Kim Tinh Thạch (khóa) |
| Thần khí `shenqichongxi.lua` 900033 | Thay Đổi Ngoại Hình Thái Cổ Thần Khí [7] + câu "chức năng này chưa ra" | client có thể thiếu ngoại hình |
| Tu Luyện `XiuLian.lua` 390101 | Đổi Công Lực Đan [5000], "Tạm thời chưa mở" | |
| Tiền Trang KNB `oqianzhuang_yuanbao.lua` 181000 | "Shop tạm khóa", 2 chỗ "Chức năng tạm chưa mở", Đổi thẻ cào [19] | thẻ cào = nạp → để tắt |
| Đổi Trùng Lâu `doitrunglau2.lua` 111998 | Đổi Trùng Lâu Ma Giới, Cá Tính Thần Khí, Yếu Quyết | ảnh hưởng kinh tế, xem kỹ trước khi bật |
| `duihuanxitong.lua` 112000 | Đổi Cá Tính Vũ Khí; huyễn sức vũ khí đoán tạo / trọng tẩy | huyễn sức: server chỉ 19 ô trang bị → KHÔNG bật |
| Hư Không `xukonghuanjing.lua` 900048 | Xem đội tốt nhất tuần, Nhận thưởng vinh dự tuần trước | |
| Lệnh Bài `LingPaiui.lua` 880001 | Kỹ năng thiết đổi, Kích hoạt Hào Hiệp Ấn | |
| Phượng Hoàng `oluoyang_zhouran.lua` 900014 (Thúc Hà) | "phượng hoàng cổ thành chiến trường đã tắt", 2 nút đi chiến trường | chiến trường bang |
| Đoạt bảo truyền tống `duobaochuansong.lua` 891003 | 7 điểm dịch chuyển (Thủy Nguyệt Động Thiên, Phượng Hoàng Lăng Mộ, Mạc Nam, Vong Xuyên, Thiên Kỳ Nam Hoài, Tần Hoàng Địa Cung 4, Thúc Hà) | map client không có = kẹt nhân vật (bài học Vương Lăng) |
| Đào Hoa Đảo `ogusu_dengwanren.lua` 002118 | Thúc Hà Cổ Trấn, Khảo nghiệm Quỷ Cốc | |
| Lâu Lan `bingshen.lua` 894062 | Đổi đồ tình nhân Mân Côi, Quái Vật Tương Sách, Cổ Thư Tàn Hiệt, đổi cấp 70/80/90… | nhiều dòng chữ Trung |
| Lâu Lan `oloulan_shisao.lua` | Mua Chiến Thần Phối Phương, Hợp thành Hàn Ngọc | |
| Diêu Văn `aHaDiaoWenSys.lua`, Hào Hiệp Ấn, Dệt nữ, Nhuộm thời trang Con / nhận Kim Toa | menu lẻ | |
| Thành bang `PCity` (pc_guilddirector, city0_building*, pc_techofficer) | ~15 mục nâng cấp công trình (chữ Trung), sửa danh xưng bang | hệ thành bang chưa Việt hóa |
| Hiệp hội khác | Gia nhập Đường Môn (tangmen), Tu Luyện Vũ Ý (xiezi 000203), chéo Tài Xỉu ↔ Tôm Cua | |

## KHÔNG bật (menu GM / test / gian lận)
`doidanhhieu.lua` 111997: Chuyển sinh, "Alpha test thăng cấp vô hạn", Buff Thiên Long, Biến thân, Siêu cấp biến thân -- Test, Nhận danh hiệu TOP. `jiarumenpai.lua` 990010: "add diem GM", Nhận danh hiệu TESTTTTT. `zhinv_NPC.lua`: "han hahahah", phát cá thông báo. Kim Ngũ Gia `odali_jinwuye.lua`: đổi điểm bang / Điểm Tặng / KNB lấy Điểm Môn Phái (đã từng có handler ẩn in KNB - KIEM-TOAN.md).

## Hàm khóa cứng thật (3)
`GodOfFire_Item.lua` 808084 `OnActivateOnce` return 0 (vật phẩm Hỏa Bả 40004444, sự kiện Hỏa Thần); `pc_xunluoling.lua` 300024 `OnEventRequest` return (Tuần La Lệnh); `event_shimen_visitnpcofothermenpai.lua` 229010 `OnEnumerate` return (sư môn thăm NPC phái khác). 13 vật phẩm nhiệm vụ môn phái `return CallScriptFunction(...)` là chuyển tiếp bình thường, không phải tắt.
