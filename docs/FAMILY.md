# FAMILY - liên kết nhiều tài khoản game dùng chung ví web (thiết kế 20/10)

Bot repo `bialk/BotDoMin`. Code: `family.js`, `fam.client.js` (/fam.js), sửa webplay.js / index.js / thuongpho.js / *.client.js - commit bialk 92e3ade..(20/10), CHƯA deploy prod. Thử ở web local (D:	lbb-localweb-local.sh).

## Chủ server chốt (20/10, bản cuối - thay bản đầu)
1. Link: nút **🔗 Liên kết** cạnh **🔑 Mật khẩu**, nhập **tài khoản + mật khẩu** acc muốn thêm (kiểm qua GM panel `kiem_mk`, chung giới hạn sai 10 lần / 10 phút theo IP).
2. Acc đã liên kết **KHÔNG đăng nhập web riêng nữa** (phiên cũ bị đá) - **chỉ trưởng** đăng nhập, quản lý ví + kho cho cả family. Discord: thành viên chỉ còn /diemdanh, /nghien.
3. **KNB + Rương Ích Kỷ dùng chung** (ví gốc = ví trưởng). Vào family: gộp KNB + rương + lượt Vòng quay. Đồ túi boss của mọi nhân vật vào rương chung.
4. **Thương Phố KHÔNG gộp**: mỗi tài khoản 1 kho (theo GUID như cũ); trưởng chọn tài khoản bằng **ô bấm** (không dropdown) để xem / rút đúng kho tài khoản đó; đồ 🔒 cố định dính nhân vật đã gửi. Vào / rời family không đụng Thương Phố.
5. Rút vào game (Rương Ích Kỷ, KNB, vàng): **popup chọn tài khoản nhận**; hạn rút / ngày tính theo nhân vật nhận.
6. Điểm danh / Nghiện / thưởng chuỗi: 1 lần bấm làm hộ mọi tài khoản (mỗi tài khoản 1 lần / ngày, sổ riêng), tiền vào ví chung.
7. Túi boss: vẫn theo **ai có mặt** lúc giết; hiện túi mọi nhân vật (ghi 👤 chủ túi), nhận vào ví / rương chung.
8. Tặng / chuyển KNB: danh sách người nhận **ẩn thành viên family** (chỉ hiện ví trưởng); gửi cho thành viên -> vào ví trưởng; trong cùng family bị chặn.
9. **Chỉ trưởng đuổi** được; bị đuổi: mất KNB + Rương Ích Kỷ (ở lại family), về ví riêng 0. Trưởng không rời khi còn thành viên.
10. Nạp NPC Ví Web / Long Văn / hoàn Thương Phố về rương / admin phát KNB toàn server / admin tặng rương: tiền / đồ của thành viên -> ví gốc.
11. Nhân × số tài khoản: điểm danh, chuỗi (1 lần bấm = 1 gói mỗi tài khoản có gói), Nghiện, hạn rút KNB / vàng (chung ở ví gốc, chỉ đếm tài khoản đã gắn nhân vật), túi boss (theo ai có mặt).
12. KHÔNG nhân: **quà admin hằng ngày** (family nhận 1 lần / ngày - chống farm), **admin tặng / phát KNB** (tặng 1 tài khoản bất kỳ = family nhận đúng số đó; phát toàn server / đặt tất cả = 1 phần mỗi family). Chưa chốt: Pet Boss, món ⭐ mua 1 lần, Ghép Ngọc, shop 🔥; taxi + vay nợ đề nghị không nhân.
13. Bị đuổi / rời: **khoá tới 00:00 giờ VN** (không đăng nhập web, không Discord, không liên kết lại), ví đã về trắng; qua ngày mới dùng lại.
14. Admin KHÔNG cần công cụ family. Khoá (khoa_tk) tài khoản trưởng = cả family không vào web được tới khi mở khoá (giữ nguyên). Tài khoản / nhân vật bị khoá trong family: không được làm hộ điểm danh / nghiện, không nhận / rút.
15. Chặn ở gốc: updatePoints / logDog / ichKyAdd / ichKyTake + module Vòng quay / Ghép Ngọc / Pet Boss tự đổi ví thành viên -> ví gốc (mọi đường admin / game / chuyển tiền).

## Hiện trạng phải phá (agent 20/10)
- 1 tài khoản = 1 ví = 1 GUID: chặn ở `/api/tlbb/lienket`, `/api/tlbb/taoclone` (panel.js ~1454-1507), test `thu/taikhoan-test.js`.
- Đăng nhập (webplay.js ~226-285) lấy ví **đầu tiên** khớp `gameAcc` rồi **ghi đè** `gameAcc/gamePass`; phiên `_webSessions[token]={u}` chỉ nhớ ví, không nhớ acc nào đăng nhập.
- Khóa theo: ví `db[id]` (points, ichKy, daily, giới hạn shop) · GUID `_tp[guid]` (Thương Phố), `_tuiBoss[guid]` (túi boss), file `.tpin/.in/NetCo4Qua` theo GUID.
- Tra GUID → ví: `tlbbUserByGuid` (lấy cái đầu, kể cả clone, index.js ~672) vs `userCuaGuid` (thuongpho.js ~232, null nếu ≥2 ví) - lệch nhau.
- Ví clone (`u.clone`) bị cắt: chỉ Thương Phố, không túi boss.

## Mô hình đề xuất
- `db._fam[famId] = { truong: walletId, tv: [walletId...], t }`; mỗi ví thành viên `u.famOf = walletId của trưởng` (ví gốc = ví trưởng giữ points + ichKy chung).
- Mọi API web: `userId` → `goc(userId)` (ví trưởng). Phiên thêm `acc` (acc đang đăng nhập) → đổi mật khẩu đúng acc; **không ghi đè** gameAcc của ví khác.
- GUID của family = `tlbbGuid` của mọi ví thành viên. Hàm `famGuids(goc)`; mọi chỗ nhận `guid` từ client phải kiểm thuộc `famGuids`.
- Gộp khi vào: points + ichKy.items cộng sang ví gốc (ledger ghi `fam_gop`); Thương Phố vẫn theo GUID nhưng giao diện gộp (đồ không khóa: rút từ kho GUID bất kỳ → `.tpin` GUID được chọn; đồ khóa: chỉ GUID gốc).
- Nạp KNB từ NPC Ví Web (`tlbbPollReceipts`), Long Văn (`tlbbPollLvReceipts`), HOAN Thương Phố: ví tìm được → `goc()`.
- Rời / bị đuổi: xóa `famOf`, ví thành viên giữ nguyên 0 (đã gộp từ lúc vào); GUID của nó ra khỏi `famGuids`, kho `_tp[guid]` của nó: **đồ không khóa đã tính là của family** → chuyển sang kho GUID của trưởng trước khi rời (đồ khóa giữ lại nhân vật - không chuyển được nhân vật khác).
- Trưởng không rời được khi còn thành viên (phải đuổi hết hoặc giải tán).
- Endpoint link dùng chung giới hạn sai mật khẩu theo IP (`loginFails`) + giới hạn theo acc đích.
- Admin tab Tài khoản (`taikhoan.panel.js ghep()`): hiện family.

## Giai đoạn
1. Dữ liệu + API link / rời / đuổi + đăng nhập vào ví gốc + phiên nhớ acc + UI popup cạnh Mật khẩu.
2. Ví chung dùng được: điểm danh nhận hết, túi boss mọi GUID, popup chọn nhân vật khi rút rương / KNB, Thương Phố gộp + Rương đồ khóa.
3. Đường từ game vào (NPC Ví Web, Long Văn, HOAN) → ví gốc; admin xem family; khóa tài khoản (`viBiKhoa`) với family.
Thử bằng `thu/bot-gia` trên bản sao (không chạy thẳng trong repo).

## Đã làm kèm (20/10)
- Rương Ích Kỷ - Tặng: bỏ giới hạn 100 / món / lần + nút "🎁 Chọn hết" (bialk `5652394`).
