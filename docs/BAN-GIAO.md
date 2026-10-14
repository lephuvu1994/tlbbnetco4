# Bàn giao cho phiên Claude tiếp theo (viết lại 12/10/2026)

File này là **điểm bắt đầu** cho mọi phiên Claude mới, kể cả Claude ở máy hoặc tài khoản khác không có "ghi nhớ" của phiên trước. Mọi kinh nghiệm quan trọng của phiên trước đã chép vào đây hoặc vào các file `docs/` được nêu tên.

**Đọc theo thứ tự:**
1. `CLAUDE.md`: quy tắc bắt buộc của repo game (bảng mã, DB, bí mật, script trên VPS).
2. File này.
3. `docs/TRANG-THAI.md`: nhật ký chi tiết từng việc. Đọc **từ cuối lên**, mỗi mục ghi tag rollback.
4. Khi đụng tới chủ đề nào thì đọc file tương ứng ở **mục 9**.
5. Bot web: repo `bialk`, `BotDoMin/README.md`.

---

> **14/10/2026: SẮP TẠM ĐÓNG SERVER.** Khoảng **21–24/10** chủ server tạm đóng TLBB, sao lưu toàn bộ để mở lại sau khi đông người. Muốn người chơi lên endgame trong ~10 ngày → tỉ lệ rơi / EXP cao là **cố ý**. Nói rõ khối lượng 1 lần rồi làm, không cản vì cân bằng lâu dài. Ưu tiên việc nhanh, ít rủi ro. Việc đóng / sao lưu chỉ làm khi chủ server bảo.

## 1. Chủ server và cách làm việc

- Chủ server (tài khoản game **bialk**, GUID **1010100017**) nói tiếng Việt. **Luôn trả lời bằng tiếng Việt**, gọn, rõ.
- Khi chủ server chỉ **hỏi / nhờ check** thì trả lời rồi dừng, không tự sửa. Khi họ nói "làm đi / deploy" mới làm.
- Server riêng cho khoảng 10 người bạn chơi, không kinh doanh. Không tối ưu theo kiểu nạp tiền.
- Trước mỗi thay đổi game: **tạo tag rollback** (`truoc-<viec>-<ngay>`), viết **tool tái chạy được** trong `tools/` (có chú thích đầu file), ghi vào `docs/TRANG-THAI.md` (và `docs/CAN-BANG.md` nếu đổi sức mạnh). Commit message theo kiểu cũ (tiếng Việt không dấu, ghi "can cap-nhat" / "can restart" / tag).
- Web người chơi và admin **không dùng `confirm()` / `alert()` / `prompt()` của trình duyệt**. Dùng hộp riêng `gConfirm` (trang người chơi, `BotDoMin/webplay.js`) hoặc kiểu "bấm 2 lần để xác nhận" (trang admin).
- **Mọi file làm việc để ở ổ D, không để ở ổ C** (chủ server yêu cầu 12/10, ổ C nhỏ và từng đầy làm máy lag). Đặt file tạm, file giải nén, file trích từ client, kết quả test vào `D:\Thiên Long Bát Bộ NetCo4\scratchpad-claude\<việc>`. Không dùng `$TEMP` hay `/tmp` (nằm trên C). Tải nặng (máy ảo, bộ client, npm) cũng để D. Xong việc thì xóa phần sót lại trên C. Ngoại lệ: `~/.ssh/tlbb_vps` ở lại C. Dữ liệu Claude Code (`~/.claude`) chuyển bằng `D:\Thiên Long Bát Bộ NetCo4\chuyen-claude-sang-D.ps1` (chạy khi đã tắt VS Code).
- **Không in bí mật** ra màn hình: `PANEL_SUPER_PASSWORD` (`/opt/minigame/BotDoMin/.env`), mật khẩu MySQL, `deploy/secrets.env`. Script cần mật khẩu thì tự đọc file, không in. **Không commit bí mật.**

## 2. Quyền của Claude và cách deploy

| Việc | Claude được làm? | Cách |
|---|---|---|
| Sửa repo game, commit, push | ✅ | Push lên GitHub = có thể lên VPS bất cứ lúc nào (có người deploy qua OneDash) |
| Chạy `cap-nhat.sh` trên VPS | ❌ **KHÔNG** | Bộ phân loại an toàn đã chặn nhiều lần, đừng lách. Đưa chủ server lệnh: `cd /opt/tlbb-deploy && ./cap-nhat.sh` |
| Restart game `systemctl restart tlbb` | Chỉ khi chủ server bảo | Đếm người online trước: `ss -tn state established '( sport = :3731 )'` (3731 = đang TRONG GAME; 7384 = đang đăng nhập; báo tổng, nói 3731 trước) |
| Restart panel GM | Khi cần | `systemctl restart tlbb-panel` (sau cap-nhat nếu đổi `panel/*.py`) |
| Deploy bot | ✅ khi chủ server OK | 1) `git show HEAD:BotDoMin/<file>` lấy bản LF; 2) so md5 file trên VPS với commit trước (có thể người khác sửa); 3) `systemctl list-jobs \| grep -c tlbb` = 0; 4) sao lưu vào `/opt/tlbb-backup/bot-truoc-<hash>-<giờ>`; 5) scp vào `/tmp`, `node --check`, chép, `systemctl restart minigame`; 6) xem `journalctl -u minigame`, curl cổng 3002 / 1234 / 1508 |
| Đổi cấu hình bot (túi boss, Ghép Ngọc, vòng quay...) | ✅ | Script chạy trên VPS, đăng nhập `POST /api/login` cổng SUPER 1508 bằng mật khẩu đọc từ `.env`, gọi API. **Không sửa `database.json` tay.** Mẫu: các script `gn-*.js`, `tuiboss-*.js` trong mục 2 của TRANG-THAI |
| Ghi file trực tiếp vào VPS bằng shell (vá binary, sửa file game tay) | ❌ thường bị chặn | Viết tool trong repo, đưa chủ server lệnh tự chạy (mẫu: `tools/tat-giup-thetaiphu.py`) |
| Đọc DB | ✅ chỉ đọc | `python3 -c "import panel; panel.sql(...)"` trong `/opt/tlbb-repo/panel` (không in mật khẩu). DB trễ khoảng 15 phút so với game (ShareMemory lưu theo chu kỳ) |

- SSH: `ssh -i ~/.ssh/tlbb_vps -p 24700 root@103.216.118.123`.
- Hiệu lực sau khi sửa:
  - **Lua (NPC / script)** chỉ cần `cap-nhat.sh`, không restart: server nạp lại file script mỗi lần gọi.
  - **Bảng `.txt` / `.ini`** (`Public/Config`, `Server/Config`, `Public/Scene`) cần `cap-nhat.sh` + **restart game**.
  - **Panel GM** (`panel/*.py`) cần `cap-nhat.sh` + `systemctl restart tlbb-panel`.
- Đổi **tỉ lệ rơi** (MonsterDropBoxs / DropBoxContent / `NetCo4/roimap.lua` / roithem): **bắt buộc dựng lại https://netco4.click** bằng `node tools/bang-roi/lam.js`. Sao lưu `/var/www/netco4/index.html` vào `/opt/tlbb-backup/` rồi scp `tools/bang-roi/web/index.html` lên.
- **`minigame.service` chạy sau `tlbb.service`.** Restart bot đúng lúc game đang restart thì mọi web chết cho tới khi game lên lại.
- Trước khi tắt VPS: `./tlbb.sh stop`. ShareMemory còn giữ dữ liệu nhân vật chưa lưu.

## 3. Trạng thái lúc bàn giao (12/10/2026 ~14:30)

| Thành phần | Trạng thái |
|---|---|
| Game | Restart lúc **12/10 09:40**. VPS repo = **`2821243`**. Commit sau đó `f07a7d2` chỉ thêm tool + docs, không có file game. |
| Bot | VPS = HEAD **`4f3037f`** (tab 📅 Lịch Boss & Hoạt động), `panel.js` md5 `dbabfff0`. Kèm `lichboss.json` và `lichhoatdong.json` trong `/opt/minigame/BotDoMin`. |
| `Server/Server` (binary) | Bản giải nén UPX đã vá tự đi theo (03/10, xem CLAUDE.md), **cộng thêm** vá tắt dòng [Giúp] Thẻ Tài Phú (12/10, `tools/tat-giup-thetaiphu.py`, chủ server tự chạy). Trả về `Server.upx-goc` sẽ **mất cả 2 bản vá**. Thay binary khác thì chạy lại tool. |
| **Chờ restart game** | Cấu hình Custom Trùng Lâu vừa khôi phục 12/10 (xem mục 4). File đã ghi lúc 12/10 sau 09:40 nên **chưa có hiệu lực** tới lần restart tới. |

### Việc chủ server còn phải làm

1. **Restart game** để áp lại Custom Trùng Lâu (Giới / Ngọc / 2 bản Chân + hiệu ứng 2% / 5s). Đếm 3731 trước.
2. **Bảo mật (quan trọng):** ngày 12/10 máy Windows chứa khóa VPS đã chạy launcher bị Defender báo **Trojan** (thử bộ 14 phái, mục 7). Nên:
   - đổi khóa SSH `~/.ssh/tlbb_vps` và xóa khóa cũ trong `/root/.ssh/authorized_keys`;
   - đổi `PANEL_SUPER_PASSWORD`;
   - đổi token / mật khẩu GitHub.

   Chưa làm tính tới lúc viết file này.
3. Mở lại Real-time protection của Windows Defender (đã tắt 12/10).

## 4. Việc đã làm 08/10 → 12/10 (tóm tắt; chi tiết + tag ở TRANG-THAI)

| Ngày | Việc | Ghi chú |
|---|---|---|
| 08/10 | Custom Trùng Lâu (trang admin bot, `panel/trunglau.py`, đoạn riêng ItemSegValue 4501+); nút 📋 chép dòng Thường → Chân | `docs/TRUNG-LAU-CUSTOM.md` |
| 08/10 | Đục lỗ 4 Free (Long Văn, Võ Hồn, Lệnh Bài, Tọa Kỵ); Bộ Bộ Sinh Hoa ×4; NPC chế đồ Mục Thanh Danh (VL8) | `docs/CAN-BANG.md` |
| 08/10 | Giải mã client: dump RAM, bảng `Config.axp` ẩn trong OgreMain, pet 3D "Xem biến dị" ở Ghép Ngọc | `docs/CLIENT-GIAI-MA.md`, `tools/pet3d/README.md` |
| 09/10 | Custom Võ Hồn (tỉ lệ chiêu từng ô) + Long Văn số dòng ra | `panel/vohon.py`, `docs/TRUNG-LAU-CUSTOM.md` |
| 09/10 | Trùng Lâu Khôi 7580 (+10% sát thương, buff icon 755); 20 thời trang 9 sao chỉ GM | |
| 10/10 | Tinh Thông admin chọn 3 dòng (`panel/tinhthong.py`); custom % tẩy tư chất; pet đầy máu khi đổi map; nâng nhanh kỹ năng trân thú; fix giám định xóa thăng linh / điêu văn (`judge_aptitude.lua` chỉ ghi tên khi creator rỗng) | |
| 11/10 | Event Đổi Đồ VIP (NPC Lưu Thi Thi 111998); **đồ VIP đổi sang 26 mã client cho Tinh Thông** + tắt mọi nguồn ra mã đó + tắt thăng cấp trang bị (`x809263_EquipLevelUp`) | `tools/dovip-11-10.js`, `tools/dovip-doima-11-10.js` |
| 11/10 | Chuyển giới trân thú (NPC 111998 + Vân Phi Phi) | |
| 11/10 | Tháp Khắc Lạp Mã Can (scene 427): Võ Ý ×48, chỉ rơi Kim Tàm Ti 25%, hồi sinh 5s | |
| 11/10 | Cộng Sinh 200 / 400; máu boss toàn game = **120% gốc**, Sát Tinh về gốc | `tools/mau-boss-goc-120-11-10.js` |
| 11/10 | NPC Mục Thanh Danh: **Chuyển đồ** (cường hóa + lỗ + ngọc + creator) 10.000 KNB, món cũ bị xóa | `tools/chuyendo-11-10.js` |
| 11/10 | NPC Hoàng Cẩn: **Thăng Linh nhanh** (chọn món 1 lần, bấm liên tục); cửa sổ client tự mở lại sau mỗi lần thăng linh | `tools/thanglinh-nhanh-11-10.js` |
| 11/10 | Custom Trùng Lâu: nút chép giống hệt Chân Giới ↔ Chân Ngọc | |
| 12/10 | Ghép Ngọc (nguyên liệu): 33 ngọc cấp 7 (5 × giá ngọc 6 − 10.000; Minh Thạch giảm kháng − 20.000), 12 điêu văn cấp 5 (50.000 / 38.000 / 54.000) | API SUPER, không có file repo |
| 12/10 | Tắt dòng [Giúp] Thẻ Tài Phú (vá chuỗi trong binary) | `tools/tat-giup-thetaiphu.py` |
| 12/10 | Thông báo boss Tần Hoàng dịch sang tiếng Việt; tắt tin boss xuất hiện ở 5 script `MyNew/zhaohuan` (giữ tin Thông Thiên Tháp) | |
| 12/10 | **Tab 📅 Lịch Boss & Hoạt động** (bot, cả cổng mod) | `tools/lich-boss.js`, `tools/lich-hoat-dong.js` → `bialk/BotDoMin/lichboss.json`, `lichhoatdong.json`. Sửa giờ boss / ActivityNotice thì chạy lại 2 tool + deploy bot |
| 12/10 | **Khôi phục Custom Trùng Lâu**: 11/10 21:48 có thao tác "trả tất cả về gốc" từ IP chủ server (xóa 4 mã + hiệu ứng). Đã dựng lại từ bản sao lưu `/opt/tlbb-backup/trunglau-20261011-214852` và ghi qua API | Chờ restart (mục 3) |

## 5. Việc treo / chờ chủ server quyết

| Việc | Ghi chú |
|---|---|
| **Custom dòng thuộc tính Võ Hồn**: chọn A / B / C | **A.** Admin tạo Võ Hồn dòng chọn sẵn (tooltip đúng). **B.** NPC cho người chơi chọn / đổi dòng (tooltip đúng). **C.** Đổi số mỗi cấp trong `StandardImpact` 10675–10770 (tooltip **lệch**). Cơ chế ở mục 6 |
| Lỗi nhỏ thăng linh | Ô áo (102) không được tính điểm thăng linh; tổng ≥ 400 thì về 0 (nên kẹp 399). Chưa sửa (`MyLua/ShuaXinClient.lua`, `obj/dali/xian1z.lua` `MsgBox33`) |
| Tắt nốt tin boss Hạn Huyết Lĩnh / Mai Nha Đảo / Vân Phù | Ở `new/bosshhl.lua`, `bossmnd.lua`, `bossvanphu.lua`. Chủ server mới bảo tắt 5 script zhaohuan |
| Cảnh báo Ghép Ngọc | Đang cho bỏ KNB web vào và có phiếu KNB làm món đích, nên đổi được KNB web sang phiếu game (lách giới hạn rút). Chủ server chưa quyết |
| Giá Kim Tàm Ti | Chưa có giá KNB ở đâu. Giá điêu văn cấp 5 đang tính với giả định 100 KNB / viên |
| Kim Đan 38000943 / 944 | Chưa được cộng trong `zhenyuanitem.lua` (chỉ 945–952) |
| Chuyển giới pet | Đang miễn phí, có thể bị dùng để quay lại tư chất |
| Mô tả Chân Nguyên trong client sai số | Ví dụ Hỏa phẩm 5 cấp 9 thật +675, mô tả ghi +450. Số thật = đơn vị × phẩm × cấp (`ShuaXinClient.lua` `x892002_g_adddsuxingvalue`). Mô tả nằm ở client, không sửa được |
| Vòng quay may mắn | Đang BẬT, bộ quà do chủ server tự thêm lại (11/10 xóa hết) |
| Nút "Trả tất cả về gốc" của Custom Trùng Lâu | Nên thêm xác nhận 2 lần (sự cố 11/10 21:48) |

## 6. Kiến thức đã kiểm chứng (đừng mất công tìm lại)

### Client (KHÔNG sửa được)
- Bảng dữ liệu và giao diện client (`Config.axp`, `Interface.axp`) **nhúng trong `OgreMain.dll` có Themida**. Thử 08/10: đặt `Bin/Config.axp` ra ngoài đĩa, client vẫn dùng bản nhúng. → **Tooltip, chữ buff, mô tả vật phẩm, dòng xanh thăng linh đều do client vẽ, server không đổi được.** Không vượt bảo vệ client (nguyên tắc dự án).
- Server điều khiển được:
  - **icon + chữ của buff khi mặc đồ**: `StandardImpact` cột 5 = 1 mã `ImpactSEData` mà client đã có. Phải xem ảnh icon trước khi chọn, vì 755 khớp chữ nhưng icon là quả bóng.
  - **chuỗi creator mã hóa** trên món (client tự dịch).
- Thời trang khảm ngọc: server đục được lỗ nhưng giao diện client từ chối khảm, ngõ cụt.
- Bản giải mã client (dump RAM, `goiA.axp` giao diện, `goiB.axp` bảng chữ, `ImpactSEData`...) và công cụ `trich.js` / `giaima.js` nằm ở máy chủ server: `D:\Thiên Long Bát Bộ NetCo4\scratchpad-claude\pet3d\`. Bản công cụ trong repo: `tools/pet3d/`.

### Lua / engine
- **Hộp thoại mở từ VẬT PHẨM** (`DispatchEventList(sceneId, selfId, -1)`) hiện được nhưng **không bấm được lựa chọn** (engine chặn NPCID -1). Lựa chọn phải đi qua NPC thật.
- **Biến toàn cục Lua mất giữa 2 lần bấm NPC**, vì server nạp lại file script mỗi lần gọi. Trạng thái phải mã hóa vào **số của lựa chọn** (ví dụ ô túi × 1000 + mã % 1000, để kiểm món còn đúng). Mẫu: `x111997_CDMenu`, `x044800_TLNhanh`, `x111998_CGMenu`.
- Lựa chọn thêm từ script khác vào NPC: `OnEventRequest` của script chính nhận `eventId` = id script kia. Chuyển tiếp bằng `CallScriptFunction(id, "Fn", sceneId, selfId, targetId, GetNumText())`.
- **Giới tính pet = bit cuối của GUID thấp** (`t_pet.lpetguid`: lẻ = Đực, chẵn = Cái). Không có hàm set GUID / tư chất / cấp / kỹ năng pet. Tên pet phía server là GBK tiếng Trung, đừng hiện trong hộp thoại.
- **Không có hàm Lua đọc giá trị từng dòng thuộc tính** của món đồ (trừ ám khí). Giá trị dòng tính lại từ `EquipBase` + `ItemSegValue` mỗi lần vào game (`tlbb-equip-attr`: cột 32–89 trọng số dòng, 90 quy tắc phẩm chất, 91 đoạn giá trị, 92 / 93 số dòng, 100 T; giá trị = ceil(V × Rate × 0.01f)). Đổi bảng là đổi luôn mọi món cùng mã đã có.
- **Chuỗi creator** (`LuaFnGetItemCreator` / `SetItemCreator`) chứa:
  - thăng linh `w#p<n>` / `t#p<n>`;
  - điêu văn `&DW…`;
  - Tinh Thông `&JT` + 3 × (mã + cấp);
  - thần khí `#S`, `&QHD`;
  - Võ Hồn `&WH…`.

  Chép nguyên chuỗi = chép mọi thứ trên (cách Chuyển đồ và Tuyết Phi Phi làm).
- Engine **không có hàm gỡ ngọc**. Muốn "chuyển ngọc" thì tạo ngọc mới cùng mã, khảm vào món mới, rồi xóa món cũ (`x895111_SHANG_BAOS`).
- Cường hóa: cấp lưu ở `GetBagItemParam(o, 3, 1)`, nâng bằng `LuaFnEquipEnhance` lặp lại.
- Thăng linh:
  - Server cộng **phẳng** theo tổng điểm (`XIEZI_SL` → `wq_sld` trong `ShuaXinClient.lua`): Lực / Linh / Thể / Định / Thân +10 mỗi điểm, HP +1000 mỗi điểm.
  - Phí thật: VQ = 20 × cấp + 1 Tử Vi Linh Phách. Client ghi sai 10 × cấp + 1.
  - Mỗi chỉ số là 1 dải mã hiệu ứng có trần (ví dụ Lực 13000–13699, Hỏa 18050–19099, HP 30200–30999). Cộng vượt trần thì mất.
- Võ Hồn:
  - 12 loại dòng × cấp 1–8, tối đa 8 dòng: Băng / Hỏa / Huyền / Độc công +30 mỗi cấp; Kháng 4 hệ +10; Bỏ qua kháng 4 hệ +10.
  - Học bằng sách 30700214–229 (`x892101_WuhunAttr_Book`).
  - Lưu trong `&WH` (16 ký tự = 8 ô × mã + cấp).
  - Số thật ở `StandardImpact` 10675–10770 (`wuhun_addbuff.lua` `x892112_wuhun_addImpact`).
  - Không có cấp 9, không có loại dòng mới.
- Hàng chờ quà `Server/txt/NetCo4Qua/<GUID>.txt`: nhận khi đăng nhập hoặc đổi map; lệnh `item <id> <sl>`, `itemten`, `doi`, `pet`, `xoa`… (`NetCo4/quatang.lua`).
- Mã chữ hệ thống `#{KEY}`: chữ nằm ở client. Nếu không có trong script / bảng nào thì là **binary tự gửi** (ví dụ `#{CFKBZ_20080228_01}`).

### Dữ liệu / DB
- File game là **VISCII / GBK, không phải UTF-8**. Chỉ sửa bằng Node đọc / ghi `latin1`, giữ CR / LF từng dòng, đếm byte > 0x7F so với HEAD. Edit tool chỉ an toàn với file toàn ASCII hoặc UTF-8 (`panel.py`, bot JS). Chữ Việt trong Lua viết bằng escape `\ddd` qua `tools/viscii-map.json`.
- Kiểm cú pháp Lua: không có `luac`. Dùng npm `luaparse` (máy chủ server: `D:\Thiên Long Bát Bộ NetCo4\scratchpad-claude\node_modules\luaparse`, chạy node từ trong thư mục đó).
- Git Bash heredoc làm hỏng dấu `\` và `\u`. Script có `\` thì viết bằng Write tool.
- Bot repo `core.autocrlf=true`: bản làm việc là CRLF, deploy lấy bản LF bằng `git show`.
- Tên nhân vật trong MySQL mã hóa 2 lần (VISCII → UTF-8): bóc lớp UTF-8 rồi giải VISCII.
- Rơi đồ thật: đọc `Server/Log/Audit_*.log` dòng `ITEM_CREATED … Dropped by` (chạy với `LC_ALL=C`).

## 7. Đã thử, thất bại hoặc đã bỏ (đừng làm lại)

| Thử | Kết quả |
|---|---|
| `Bin/Config.axp` ngoài đĩa để sửa tooltip (08/10) | Client bỏ qua |
| Đục lỗ / khảm ngọc thời trang (09/10) | Client từ chối khảm, đã rollback |
| Mở trứng trân thú chọn giới tính bằng hộp thoại vật phẩm (11/10) | Engine chặn click, đã rollback |
| Đồ VIP mã chỉ-GM cũ + Tinh Thông | Giao diện client tự chặn theo danh sách cứng `g_JTSupport_Item` (239 mã), nên đã đổi sang mã trong danh sách |
| Thăng linh +60% mọi dòng như server khác (11/10) | Cần client khác + không đọc được dòng từ Lua. Chủ server bỏ |
| **Bộ "Thiên Long 14 phái 2024" (TeraBox, 12/10)** | Server (máy ảo CentOS 7) sạch ở bản đang chạy (`/var/adm/tlbb`), có cửa sau `gm.xtl3.com` ở script 960922 không được khai báo. **Client có 6 file + launcher + công cụ GM bị Defender báo virus / trojan** (Mikcer, Mofksys, Malgent, BlackMoon). `game.exe` chỉ chạy qua launcher tiêm mã (VMProtect), 2 plugin bọc Enigma. Dữ liệu `Config.axp` / `Interface.axp` là chữ trơn (về lý thuyết sửa được) nhưng không thử được. **Chủ server đã bỏ, xóa hết.** Claude không giúp chạy launcher hay phá bảo vệ của bộ này |
| Đội bot "người giả" ở Hậu Hoa Viên (07/10) | Gỡ khỏi prod; ghi chép ở `docs/BOT-NGUOI-GIA.md` |

## 8. Công tắc khẩn cấp và rollback

| Việc | Cách |
|---|---|
| Tắt Thương Phố | `touch /opt/tlbb-root/home/tlbb/Server/txt/NetCo4Web/thuongpho-tat` (xóa file là mở lại) |
| Tắt 1 chức năng web | Panel SUPER → Mở / Đóng chức năng |
| Quay lại 1 thay đổi game | `git revert` commit hoặc `git checkout <tag> -- <file>` → push → chủ server `cap-nhat.sh` (+ restart nếu là bảng) |
| Quay lại bot | Thư mục `/opt/tlbb-backup/bot-truoc-<hash>-<giờ>` → chép lại → `systemctl restart minigame` |
| Custom Trùng Lâu bị trả về gốc nhầm | Mỗi lần lưu có bản sao lưu game files `/opt/tlbb-backup/trunglau-<giờ>`. Dựng lại cấu hình bằng `trunglau.du_lieu()` với `TLBB_GAME` trỏ vào bản sao lưu (cách làm 12/10, TRANG-THAI) |
| Binary `Server/Server` | Sao lưu `/opt/tlbb-backup/Server-truoc-tat-CFKBZ-<giờ>`; bản UPX gốc `Server/Server.upx-goc` |

## 9. Bản đồ tài liệu

| Chủ đề | File |
|---|---|
| Quy tắc repo, hệ thống, script VPS | `CLAUDE.md` |
| Nhật ký mọi thay đổi + tag | `docs/TRANG-THAI.md` |
| Cân bằng (chiêu, boss, chế đồ, máu, nhịp) | `docs/CAN-BANG.md` |
| Custom Trùng Lâu / Long Văn / Võ Hồn (trang admin) | `docs/TRUNG-LAU-CUSTOM.md` |
| Client: giải mã, giới hạn, pet 3D | `docs/CLIENT-GIAI-MA.md`, `tools/pet3d/README.md` |
| Boss, phó bản, túi boss web | `docs/BOSS-PHO-BAN.md`, `docs/TUI-BOSS.md` |
| Ghép Ngọc, vòng quay, Thương Phố, shop | `docs/GHEP-NGOC.md`, `docs/VONG-QUAY.md`, `docs/THUONG-PHO.md`, `docs/SHOP-TRONG-GAME.md` |
| Ngày mở server, quyết định gốc | `docs/MO-SERVER.md` |
| Pet (danh sách, skin, pet đẹp) | `docs/pet-*.md`, `docs/pet-danh-sach.tsv` |
| Vật phẩm: tên Việt, chỉ-GM, hiệu ứng thần khí | `docs/vat-pham/` |
| Lệnh GM | `docs/lenh-gm.txt` |

## 10. Công cụ hay dùng (`tools/`)

| Công cụ | Việc |
|---|---|
| `tim-nguon.js <item>` | Mọi hộp / quái rơi 1 món |
| `chi-gm.js --nguon <id>…` | Nguồn ra của từng mã (shop / rơi / chế / rương / Lua). Không có nguồn = "chỉ GM" |
| `bang-roi/lam.js` | Dựng lại netco4.click |
| `lich-boss.js`, `lich-hoat-dong.js` | Dữ liệu tab Lịch Boss & Hoạt động của bot |
| `mau-boss-goc-120-11-10.js` | Máu boss = gốc × hệ số (sửa hệ số trong file nếu cần mức khác) |
| `dovip-*.js`, `chuyendo-11-10.js`, `thanglinh-nhanh-11-10.js`, `chuyengioi-pet-11-10.js` | Mẫu cách sinh code Lua NPC (escape `\ddd`, chép neo, kiểm byte) |
| `tat-giup-thetaiphu.py` | Vá chuỗi trong binary Server (chủ server tự chạy trên VPS) |
| `viscii-map.json` | Bảng VISCII ↔ Unicode |
