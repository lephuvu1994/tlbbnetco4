# FAMILY - liên kết nhiều tài khoản game dùng chung ví web (thiết kế 20/10)

Bot repo `bialk/BotDoMin`. Chủ server chốt 20/10. Chưa code (trừ ghi chú cuối).

## Chủ server chốt
1. Link: nhập **tài khoản + mật khẩu** acc muốn thêm (kiểm qua GM panel `kiem_mk` như đăng nhập). Nút **🔗 Liên kết** cạnh **🔑 Mật khẩu** (thanh trên, `#mkBtn` webplay.js), dùng chung popup.
2. Ví dụ hoang01 link 02-05; đăng nhập **acc nào cũng vào chung family**.
3. Khi vào family: **gộp hết** KNB + Rương Ích Kỷ + Thương Phố của acc đó vào chung (acc nào cũng tự chuyển cho nhau được nên không chặn).
4. Điểm danh: nhận **đủ cho mọi acc** trong family (mỗi acc 1 lần / ngày), vào ví chung.
5. Túi boss: vẫn theo **ai có mặt** lúc giết (02-05 đi → chỉ 02-05 có túi, 01 không) - đúng như `tuiboss.log` hiện tại; family **nhận hết** túi của mọi nhân vật trong family vào ví / rương chung.
6. Rút đồ / KNB vào game: **popup chọn nhân vật** (chỉ nhân vật thuộc family).
7. Đồ **khóa** (Thương Phố `k=1`): **"Rương đồ khóa"** riêng - popup chọn nhân vật → thấy đồ khóa của nhân vật đó, chỉ rút về đúng nhân vật đó. Đồ không khóa thì gộp chung, rút cho nhân vật nào cũng được.
8. **Chỉ trưởng family** (acc tạo) đuổi được người khác; thành viên tự rời được.
9. Acc **rời / bị đuổi**: mất hết Rương Ích Kỷ + Thương Phố + KNB (tài sản ở lại family), acc ra về 0.
10. Không đặt trần điểm danh / số acc (chủ server chấp nhận cày nhiều acc; đã cảnh báo 1 lần: 60.000 KNB/acc/ngày × số acc, nếu người chơi tự tạo được acc).

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
