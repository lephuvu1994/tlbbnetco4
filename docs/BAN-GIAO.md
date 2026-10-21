# Bàn giao cho phiên Claude tiếp theo (viết lại 18/10/2026)

File này là **điểm bắt đầu** cho mọi phiên Claude mới, kể cả Claude ở máy hoặc tài khoản khác không có "ghi nhớ" của phiên trước. Mọi kinh nghiệm quan trọng đã chép vào đây hoặc vào các file `docs/` được nêu tên. Bản trước (12/10) nằm trong git history.

**Đọc theo thứ tự:**
1. `CLAUDE.md`: quy tắc bắt buộc (bảng mã VISCII/GBK, DB, bí mật, script trên VPS, billing).
2. File này: mục 3 (trạng thái) và mục 5 (việc treo) trước tiên.
3. `docs/TRANG-THAI.md`: nhật ký chi tiết. Đọc **từ cuối lên**, mỗi mục ghi tag rollback.
4. `docs/CAN-BANG.md` trước khi đổi sức mạnh / tỉ lệ rơi. Mọi lần đổi phải ghi vào đó.
5. Đụng chủ đề nào thì đọc file tương ứng ở **mục 9**.
6. Bot web: repo `bialk`, `BotDoMin/README.md`.

---

> **14/10/2026: SẮP TẠM ĐÓNG SERVER.** Khoảng **21–24/10** chủ server tạm đóng TLBB, sao lưu toàn bộ để mở lại sau khi đông người. Muốn người chơi lên endgame nhanh → tỉ lệ rơi / EXP cao là **cố ý**. Nói rõ khối lượng và rủi ro 1 lần rồi làm theo, không cản vì cân bằng lâu dài. Việc đóng / sao lưu chỉ làm khi chủ server bảo.

## 1. Chủ server và cách làm việc

- Chủ server (tài khoản game **bialk**, GUID **1010100017**, nhân vật Thiên Long cấp 102; nhân vật phụ `bia1` Tiêu Dao 119 ở tài khoản `admin`) nói tiếng Việt. **Luôn trả lời bằng tiếng Việt**, gọn, rõ. Hay viết tắt / sai chính tả ("neft" = nerf, "chat" = gọi Claude).
- Tổ chức yêu cầu Claude **thẳng thắn, không xu nịnh**: làm đúng yêu cầu nhưng chỉ ra rủi ro kinh tế / cân bằng bằng số liệu (ví dụ: chủ server đổi tỉ lệ phiếu 6 lần trong 1 ngày theo cảm giác → khuyên đo log rồi mới đổi).
- Khi chủ server chỉ **hỏi / nhờ check** thì trả lời rồi dừng. Khi họ nói "làm đi / deploy / ok" mới làm.
- Server riêng cho khoảng 10 người bạn, không kinh doanh.
- Trước mỗi thay đổi game: **tag rollback** (`truoc-<viec>-<ngay>`), **tool tái chạy được** trong `tools/` (chú thích đầu file), ghi `docs/TRANG-THAI.md` (+ `docs/CAN-BANG.md` nếu đổi sức mạnh). Commit message tiếng Việt không dấu, ghi "can cap-nhat" / "can restart" / tag. Cuối commit: dòng Co-Authored-By theo hướng dẫn của hệ thống.
- **Việc thử nghiệm làm trên server LOCAL trước** (mục 2b), việc thường làm thẳng `main`.
- Web người chơi / admin **không dùng `confirm()` / `alert()` / `prompt()`**: dùng `gConfirm` (`webplay.js`) hoặc "bấm 2 lần để xác nhận".
- **File làm việc để ở ổ D**: `D:\Thiên Long Bát Bộ NetCo4\scratchpad-claude\<việc>` (ổ C nhỏ). Ngoại lệ: `~/.ssh/tlbb_vps`.
- **18/10: chủ server cài lại Windows → repo chuyển hẳn về `D:\Dự án\Thiên Long Bát Bộ\code`** (bản ở `C:\Users\Bia\tlbbnetco4` sẽ mất). Sao lưu: `D:\Dự án\Claude Code\.claude` (toàn bộ dữ liệu Claude Code), `D:\Dự án\Thiên Long Bát Bộ\server-test-wsl\Ubuntu-22.04.tar` (server test, khôi phục `wsl --import`), `D:\Dự án\BI-MAT-khong-chia-se\` (khóa SSH VPS `id_ed25519` + file mật khẩu VPS - KHÔNG đọc ra / không commit). Hướng dẫn khôi phục + việc bảo mật: `D:\Dự án\DOC-TRUOC - CAI LAI WIN - DU LIEU QUAN TRONG.txt`. Thư mục làm việc Claude vẫn `D:\Thiên Long Bát Bộ NetCo4\scratchpad-claude`; server test `D:\tlbb-local` (worktree `code` cần `git worktree repair` sau khi đổi chỗ repo).
- **Không in bí mật**: `PANEL_SUPER_PASSWORD` (`/opt/minigame/BotDoMin/.env`), `PANEL_PASS` + MySQL (`/opt/tlbb-deploy/secrets.env`). Script tự đọc file, không in. **Không commit bí mật** (repo public).
- Gunny (`D:\gunny-netco4`) là dự án song song do Claude khác lo, luật khác TLBB.

## 2. Quyền của Claude và cách deploy

| Việc | Claude được làm? | Cách |
|---|---|---|
| Sửa repo game, commit, push | ✅ | Push ≠ deploy |
| Chạy `cap-nhat.sh` trên VPS | ❌ **KHÔNG** (bộ phân loại chặn) | Đưa lệnh cho chủ server: `cd /opt/tlbb-deploy && ./cap-nhat.sh -y` (không restart) hoặc `-y -r` (restart luôn). Lệnh "chờ mọi người off rồi cập nhật + restart": xem TRANG-THAI / lịch sử 18/10, mẫu `nohup setsid bash -c '...' cho-off` |
| Restart game `systemctl restart tlbb` | Chỉ khi chủ server bảo | Đếm online **cả 2 cổng**: `ss -Htn state established '( sport = :3731 )'` (trong game) và `:7384` (đang đăng nhập) |
| Restart panel GM `systemctl restart tlbb-panel` | ✅ khi cần | Sau khi chủ server cap-nhat có đổi `panel/*.py` (không đá ai) |
| Gọi panel GM (quà, khóa TK, roi_them…) | ✅ | Trên VPS: `curl -sk -X POST -H "X-NetCo4-Key: $PANEL_PASS" -H "Content-Type: application/json" -d '{"a":"qua","guid":"…","loai":"item","gt":"<id>","sl":"1"}' https://127.0.0.1:8443/api/act` (`. /opt/tlbb-deploy/secrets.env` trước). Loại quà: item, xoa, knb, vang, diemtang, level, exp, nangngoc, vip, popup, pet, **tamphap** (cấp tâm pháp 1–159), **itemsao** (sl = số sao 1–9) |
| Đổi cấu hình bot (túi boss, Ghép Ngọc, vòng quay…) | ✅ | Script Node chạy trên VPS: `POST /api/login` cổng SUPER `127.0.0.1:1508` (mật khẩu đọc từ `.env`) → `Authorization: Bearer <token>`. **Không sửa `database.json`.** Sao lưu cấu hình vào `/opt/tlbb-backup` trước. Báo chủ server **F5** trang admin đang mở (không thì trang cũ ghi đè) |
| Deploy bot | ✅ khi chủ server OK | `git show HEAD:<file>` (LF) → so md5 VPS → `systemctl list-jobs \| grep -c tlbb` = 0 → sao lưu → `/tmp` + `node --check` → chép → `systemctl restart minigame` |
| Sửa `roithem.txt` (rơi thêm qua script) | ✅ | Sửa thẳng `/opt/tlbb-root/home/tlbb/Server/txt/NetCo4Cfg/roithem.txt` sau khi sao lưu `roithem-truoc-<việc>-<giờ>.txt`; **hiệu lực ngay**. Sau đó dựng lại netco4.click (mục 6) |
| Tắt "lớp bảo vệ" của engine (chống hack, ngưỡng đóng băng…) | ⚠ bị chặn nếu chưa có cho phép rõ | 17/10 bị chặn "Security Weaken"; chủ server phải nói rõ "ok nâng …" thì mới làm, và chọn mức vừa phải chứ không tắt hẳn |
| Đọc DB / log / RAM | ✅ chỉ đọc | `. deploy/common.sh; mysql_root "tlbbdb -e '…'"`. DB trễ ~15 phút so với game. Đọc giá trị engine đang chạy: `python3` mở `/proc/<pid Server>/mem` đọc địa chỉ (mẫu 17/10: ngưỡng đóng băng `0x8696f34`) |

- SSH: `ssh -p 24700 root@103.216.118.123` (khóa `~/.ssh/tlbb_vps`).
- Hiệu lực: **Lua** = cap-nhat (không restart, script nạp lại mỗi lần gọi). **Bảng `.txt`/`.ini`** = cap-nhat + **restart**. **Panel** = cap-nhat + restart tlbb-panel.
- **File trên VPS có thể KHÁC repo** vì trang admin ghi thẳng: `StandardImpact.txt` / `EquipBase` / `ItemSegValue` (Custom Trùng Lâu), `ConfigInfo.ini` (cấp tối đa, EXP), `MonsterDropBoxs` / `DropBoxContent` (tab Drop Boss), `DarkConfigTable.ini` (ám khí). `cap-nhat.sh` tự áp lại cấp tối đa / EXP / Trùng Lâu / màu đồ chế / ám khí từ json ngoài repo sau khi chép, **nhưng trước khi commit 1 file bảng vẫn phải so md5 VPS với `git show HEAD:`**; khác thì lấy bản VPS làm gốc rồi mới sửa (cách làm 17–18/10 với `ConfigInfo.ini`, `StandardImpact.txt`). Drop Boss tab: chạy `./lay-tu-server.sh` trước.
- Đổi **tỉ lệ rơi** (bảng / `roimap.lua` / `roithem.txt`): **bắt buộc dựng lại https://netco4.click**: sửa tỉ lệ ghi tay trong `tools/bang-roi/build.js` nếu là rơi qua script → `node tools/bang-roi/lam.js` → sao lưu `/var/www/netco4/index.html` + `data.json` → scp **cả** `web/index.html` **và** `web/data.json`.
- `minigame.service` chạy sau `tlbb.service`: restart bot lúc game đang restart thì web chết tới khi game lên.

### 2b. Server LOCAL để thử

- WSL `Ubuntu-22.04`, lệnh: `MSYS_NO_PATHCONV=1 wsl -d Ubuntu-22.04 -u root -- bash /mnt/d/tlbb-local/local.sh start|stop|restart|status`. Client: `D:\NetCo4-Local\NetCo4.cmd` (18/10). **`D:\tlbb-local\CAP-NHAT-TEST.cmd`** = gộp main vào local + lấy NetCo4Cfg từ VPS + dongbo + `local.sh apcfg` (ConfigInfo repo + khóa cấp/EXP, Mẫu đồ chế, Trùng Lâu, Ám khí như cap-nhat.sh) + restart + `local.sh loi`. Đã so md5: local = prod + thay đổi chờ lên (chỉ thêm buff 9900–9907 rồng bay).
- Chạy script trong WSL: viết file `.sh` (Write tool) rồi `wsl … -- bash -c "tr -d '\r' < '<file>' | bash"`. Biến `$VAR` viết inline qua Git Bash bị nuốt.
- Chép file từ repo sang local: mẫu `D:\Thiên Long Bát Bộ NetCo4\scratchpad-claude\quangay\local-*.sh` (luôn sao lưu bản cũ vào `/root/…`).
- **Local hiện đang chạy** (18/10): bản `main` của `quatang.lua` (18 danh hiệu), `ShuaXinClient.lua`, `shengjjll.lua`, 4 script nhịp 1 giây, `oluoyang_penghuaiyu.lua` (đục lỗ 4 nhanh), billing_go v1.3.5. Chủ server bảo "tắt local" thì `local.sh stop`.

## 3. Trạng thái lúc bàn giao (18/10/2026)

| Thành phần | Trạng thái |
|---|---|
| Game | Chạy từ **17/10 19:10**. VPS repo = **`fe5864f`** (= HEAD lúc viết, đã cap-nhat -y). **Chờ restart** để `StandardImpact.txt` (nerf Bàng Xí) có hiệu lực; chủ server nói sẽ tự restart tay |
| Billing | **billing_go v1.3.5** (từ 16/10, xem CLAUDE.md). Đừng đưa lại bản 2019 (gây treo "Đang kiểm tra mật mã"). Panel đọc online từ `billing.log` |
| `Server/Server` | Bản vá (tự đi theo + tắt [Giúp] Thẻ Tài Phú), md5 `996f8758` (sao lưu `Server.truoc-denam`). **21/10: chờ thay bằng `Server.denam`** md5 `3032a629` = thêm vá "giảm kháng đến âm" (`deploy/va-server/va-den-am.py`, đi cùng Lua `tools/vohon-denam-21-10.js`). Trả về `.upx-goc` là mất hết vá |
| Bot | VPS `panel.js` md5 `479ffe55`. Danh mục vật phẩm bot cache lúc khởi động → tên Chân Nguyên trong shop/vòng quay vẫn còn `#G` tới lần restart bot sau (chủ server chưa cho restart) |
| Online | ~6 người lúc viết |

## 4. Việc đã làm 13/10 → 18/10 (tóm tắt; chi tiết + tag ở TRANG-THAI / CAN-BANG)

| Ngày | Việc | Ghi chú |
|---|---|---|
| 13–14/10 | Võ Ý chỉnh trên web; bình tự nhặt; mũ top 2/3; Li Hỏa Kỳ Cuộc / Túc Cầu / HHV; độc dược ám khí; Lâu Lan Tầm Bảo Tử Phủ Tinh Tủy 40%; tẩy phẩm chất ám khí; tu luyện 15 cuốn; sửa Tuyết Ủng Lam Quan·Xuyên Thích | TRANG-THAI 13–14/10 |
| 15/10 | Công Lực Đan chỉnh trên web; soát Võ Ý; Kim Sí Linh Vũ khắc điêu văn + song cực (`aHaDiaoWenSys_1.lua` `x809272_LaKimSi`); Dược Trần / Nguyên Tinh ăn cả chồng | |
| 16/10 | **Thay billing** (hết treo đăng nhập); quà ngày 5.000 vàng + 80.000 vàng khóa (kẹp trần 144M đồng); tỉ lệ KNB → vàng do admin đặt trên web (đang 1:2); quà panel `tamphap`; Khế Hợp lên thẳng cấp 9; Dục Linh lên thẳng 20; **khóa / mở tài khoản trên admin** (khóa luôn web); Tử Vi Linh Phách Kỳ Cuộc + Túc Cầu **100%** | |
| 16–17/10 | **Phiếu 1.000 KNB rơi ở bản đồ**: `roithem.txt` `bando 2 39910001` (Tuyết Lang Hồ 179, Hạn Huyết Lĩnh 432, Thánh Hỏa Cung 537) + `thap 0.5 39910001` (Tháp Khắc Lạp Mã Can 427). Phiếu 39910001–006 xếp chồng được (ItemRule 65) | CAN-BANG "Phiếu 1.000 KNB". **Chốt 2% / 0,5%, đo lại sau ≥2.000 con/bản đồ** |
| 17/10 | Tru Tiên hồn vị lên thẳng cấp 10; quà panel `itemsao`; thử vũ khí huyễn sức → **không làm được, đã trả về gốc** (mục 7) | |
| 17/10 | **Danh hiệu đua top vĩnh viễn cho mọi nhân vật, đủ 18 cái** (`quatang.lua` `x950000_DanhHieuTop`, chạy khi đăng nhập / đổi map). Đeo danh hiệu top = **+30 Cường/Nội/Thể/Trí/Thân, chỉ tính cái đang đeo** (`ShuaXinClient.lua`). Nút "Nhận thưởng Bảng Top" (shengjjll index 40) bị khóa | Hạng 2/3 mượn ô 8–19 (mục 6). Ô 14–17 **chưa kiểm hiện đúng tên** |
| 17/10 | **Đóng băng tự động** (hoang01 bán sạp 234 lần / 10 phút → bị khóa vĩnh viễn): nâng ngưỡng `ConfigInfo.ini` [Human] cảnh báo 1.000 / 5.000, đóng băng **2.000 / 10.000**; gỡ băng hoang01; tool `deploy/go-dong-bang.sh` | Mục 6, mục 8 |
| 17/10 | Panel tra ID: bỏ mã màu `#G…`, Chân Nguyên ghi chỉ số + bậc + cấp | |
| 17/10 | **Nhịp ra quái 1 giây** Kỳ Cuộc / Túc Cầu / Lâu Lan Tầm Bảo (chờ đầu giữ) | `tools/nhip-1giay-17-10.js`. **Đã lên VPS, chưa ai đánh thử** |
| 17/10 | **NPC Quách Kiến An: "Đục lỗ 4 nhanh"** (menu 2022 xem trước → 2023 xác nhận; món đúng 3 lỗ → lỗ 4, 2.000 KNB/món, hoàn nếu không lên) | `tools/duclo4-nhanh-17-10.js`. **Đã lên VPS, chưa thử** `AddBagItemSlotFour` với đồ thường |
| 17/10 | **Yếu Quyết tâm pháp cuối** (24 cuốn: 30308112–30308133 + Quỷ Cốc 30308139/140) thêm vào **mọi ô Yếu Quyết của 9 túi boss web** | API SUPER; sao lưu `/opt/tlbb-backup/tuiboss-cfg-truoc-yqcuoi-*.json` |
| 17/10 | Gửi tay: tâm pháp 109 cho `bia1`; 2 sách Yếu Quyết Quỷ Cốc cho `Jr` (admin3) và `ElizabethII` (hoang05) | Panel quà |
| 18/10 | **Nerf Bàng Xí** (Tứ Tuyệt Trang 14145): impact 2868 Tinh La Kỳ Bố 50.556 → **20.000** (đánh cả tổ mỗi 5 giây); cuồng bạo (×100 sát thương) **10 → 20 phút** | `tools/nerf-bangxi-18-10.js`. **Chờ restart** |

## 5. Việc treo / chờ chủ server quyết

| Việc | Ghi chú |
|---|---|
| **Restart game** | Áp nerf Bàng Xí (bảng). Đếm 3731 + 7384 trước |
| Thử trong game các việc đã lên VPS mà chưa ai thử | Nhịp 1 giây (nhất là Lâu Lan Tầm Bảo: 200 con ra trong ~1 phút, có thể dồn quái), đục lỗ 4 nhanh với phù / nhẫn / vũ khí, danh hiệu top ô 14–17 hiện tên, Bàng Xí sau nerf |
| **Đo lại phiếu bản đồ** | Lần đo duy nhất (2%, Tháp, 17/10) ra gấp đôi mức đặt. Tool: `D:\Thiên Long Bát Bộ NetCo4\scratchpad-claude\quangay\do-phieu2.py` (chép lên `/tmp` VPS chạy, chỉ đọc Audit log) |
| **Tử Vi Linh Phách 100%** (Kỳ Cuộc ~200 + Túc Cầu 150 / người / ngày) | Vương Quyền 1→9 (728 viên) xong trong ~2 ngày. Claude khuyên hạ về ~30% (`roithem.txt`, hiệu lực ngay). Chủ server chưa quyết |
| Giá đục lỗ 4 nhanh 2.000 KNB | Rẻ hơn 10 lần Kim Chi Tiễn / Hàn Ngọc (20.000 KNB) ở shop → 2 món đó gần như vô dụng. Đổi giá: `x000110_g_Lo4Gia` |
| Viên thuốc custom +5 điểm Cường/Nội/Thể/Trí/Thân | Claude đã hỏi 3 câu (mượn món nào — gợi ý Chân Vũ Kim Đan 20306023 —, +bao nhiêu / viên, trần, nguồn), **chưa có trả lời** |
| Nguồn sách Yếu Quyết tâm pháp cuối cho người chơi | Đã vào túi boss web (17/10). Bảng game: hộp 50042 (đủ 24 cuốn) **không gắn cho quái nào**; shop 228 không có trong Tiệm KNB |
| Sách Kinh Mạch (30308320–30308373) | **Đừng mở nguồn**: chiêu gần như chắc không có tác dụng (mục 6). Nếu chủ server muốn có tác dụng thật thì phải làm bằng script buff |
| Restart bot | Để danh mục vật phẩm của bot sạch mã màu (shop, vòng quay, túi boss). Làm lúc vắng, không trùng lúc restart game |
| Bảo mật (từ 12/10, chưa xác nhận đã làm) | Máy Windows từng chạy launcher bị Defender báo Trojan → nên đổi khóa SSH `~/.ssh/tlbb_vps`, `PANEL_SUPER_PASSWORD`, token GitHub; bật lại Real-time protection |
| Các mục treo cũ từ 12/10 | Custom dòng Võ Hồn (A/B/C), lỗi nhỏ thăng linh (ô áo 102, tổng ≥ 400 về 0), tin boss HHL / Mai Nha / Vân Phù, cảnh báo Ghép Ngọc (KNB web → phiếu), Kim Đan 38000943/944, chuyển giới pet miễn phí, nút "Trả tất cả về gốc" Custom Trùng Lâu cần xác nhận 2 lần. **Chưa kiểm lại** từ 12/10 |

## 6. Kiến thức đã kiểm chứng (đừng mất công tìm lại)

### Client (KHÔNG sửa được)
- `Config.axp` / `Interface.axp` nhúng trong `OgreMain.dll` (Themida); client bỏ qua file ngoài đĩa → **tooltip, chữ buff, mô tả vật phẩm, tên chiêu do client vẽ**. Không vượt bảo vệ client.
- Server điều khiển được: icon + chữ buff khi mặc đồ (`StandardImpact` cột 5 = mã `ImpactSEData` client có), chuỗi creator trên món.
- Client mới hơn server: ô trang bị client tới 22 (19 Long Văn, 20 g_RL, 21 Hào Hiệp Ấn, **22 Vũ Khí Huyễn Sức**) nhưng **server chỉ có 19 ô (0–18)** (`Obj_Human::InitAllContainer`) → huyễn sức không đeo được. Sao/phẩm chất gán theo nhóm điểm trang bị; điểm 19/20/22 rơi về 1★.
- Bản trích client: `tools/pet3d/img/goi1.axp` (Interface), `goi2.axp` (Config); trích bằng `D:\…\scratchpad-claude\client-ui\trich2.js`. `docs/CLIENT-GIAI-MA.md`.

### Engine (dịch ngược `Server.elf`)
- Bản ELF + disassembly ở máy chủ server: `D:\Thiên Long Bát Bộ NetCo4\scratchpad-claude\server-elf\Server.elf`, `…\sinhsan\dis.txt`. Tool: `…\quangay\tim-dangky.py` (tên đăng ký Lua của 1 hàm C++), `…\quangay\str-at.py` (đọc chuỗi theo địa chỉ), `…\quangay\jumptbl.py`. Chạy bằng python3 trong WSL (Windows không có python).
- **Tên hàm Lua ≠ tên C++**: `AddItemWithQuality(scene, itemId, sl, phẩm chất)` (gọi `LuaFnAddItemWithQuality` = nil, lỗi cả hàm). Luôn tra bằng `tim-dangky.py`.
- **Danh hiệu**: 20 ô (0–19), **mỗi ô 1 danh hiệu**. `LuaFnAwardTitle(scene, self, ô, mã, số giờ)` — **số giờ 0 = vĩnh viễn**; `GetTitle(scene, self, ô)`, `GetCurTitle`, `LuaFnDispatchAllTitle`. Ô: 0 Level (Đệ nhất môn phái), 1–6 sáu bảng top (1 Tài Phú 101–103, 2 → 113–115, 3 → 104–106, 4 → 107–109, 5 → 110–112, 6 Top Level 118–120), 7 chenghao.lua, 8 Rose, 9–12 Hero, 13 Tiễu Phỉ, 14 GodOfFire, 15–17 GuildWar (không ai dùng), 18 Thành chủ Lạc Dương, 19 PiaoMiao (chết). Hạng 2/3 top đang mượn ô 8–19, **chỉ cấp khi ô trống** → hệ khác cấp danh hiệu thật thì đè.
- **Đóng băng tự động** (`Obj_Human::DetectorLogic`): đếm số lần **tăng** tiền (`SetMoney`, `AddMoneyJZ`, tiền ngân hàng) và KNB (`SetYuanBao`) trong 10 phút / 1 giờ; vượt `FreezePer10M` / `FreezePerHour` (`ConfigInfo.ini` [Human]) → `CannotSay(433000000)` ghi cờ JINYAN vĩnh viễn vào `t_char.settings` (byte 0x141–0x144). Client hiện "do sử dụng những chương trình bị cấm…" rồi thoát. Log `Server/Log/Waigua_*.log` dòng `Auto-Frezze`. Không có hàm Lua gỡ → `deploy/go-dong-bang.sh` (game phải tắt).
- Vàng khóa trần 144.000.000 đồng = 14.400 vàng.
- `YuanBao(scene, self, -1, 3, 0)` đọc KNB; `(…, 2, n)` trừ n (trả 0 = thành công); `(…, 1, n)` cộng n.
- Đục lỗ: `AddBagItemSlot` (lỗ 1–3), `AddBagItemSlotFour` (lỗ 4), `GetBagGemCount`. Trước 17/10 lỗ 4 chỉ dùng cho loại 8/9/10/18.
- Billing_go không ghi `web.account.is_online` → panel đọc `billing.log`. Khóa tài khoản = `web.account.id_card='1'` (+ `is_lock`).

### Lua / script
- **Hộp thoại mở từ VẬT PHẨM** (`DispatchEventList(…, -1)`) không bấm được lựa chọn. **Biến toàn cục mất giữa 2 lần bấm** → mã hóa trạng thái vào số lựa chọn.
- Cấu hình admin không restart: panel ghi `Server/txt/NetCo4Cfg/<tên>.txt`, Lua đọc mỗi lần gọi (`roithem.txt`, `voy.txt`, `congluc.txt`, `tpmax.txt`…).
- **Rơi qua script** `NetCo4/roimap.lua` (950001): `x950001_g_Roi[scene]` (món cố định / bản đồ), `x950001_g_MapCfg[scene]` = khóa `roithem.txt` (`hhv`, `bando`, `thap`), `RoiCfg(khoa)` cho Kỳ Cuộc / Túc Cầu / Sát Tinh. Mỗi thành viên đứng gần roll riêng, thang 1/10.000. Bản đồ mới phải gắn `script_id=950001` trong `<map>_monster.ini` (+ restart).
- Hàng chờ quà `Server/txt/NetCo4Qua/<GUID>.txt` (`NetCo4/quatang.lua` `NhanQua`, chạy khi đăng nhập / đổi map; cũng gọi `DanhHieuTop`, `AmKhiDoc`, `BinhNhat`).
- **Học sách**: `obj/book/skillbook.lua` (338000) = tâm pháp / Yếu Quyết / 5 chiêu tiến cấp mỗi phái (sách 30308200–30308314, chiêu 1688–1788, **chiêu thật**). `skillbook1.lua` (338001) = **Kinh Mạch** huyệt Thần Đình (chiêu 1850–1873) và Chí Dương (1880–1903), mỗi huyệt 1 chiêu, **không kiểm phái** (thiết kế: chiêu khắc chế phái khác), mô tả "phụ thuộc điểm Tiến Giai" — engine không có hệ này, không chỗ nào dùng mã chiêu → **gần như chắc chỉ là icon**. Đừng nhầm với "4 cuốn kinh mạch" của **Tu Luyện 15 cuốn** (14/10, có tác dụng).
- Yếu Quyết tâm pháp cuối: mỗi phái 2 cuốn (`shipotianjing_N` + `kunxiansuo_N`; Quỷ Cốc 30308139 / 30308140 → chiêu 987 / 988), cần cấp 80 + tâm pháp cuối.
- Phó bản nhịp ra quái: Kỳ Cuộc `x401001_g_createMonsterIntervalInfoList` (tick 1 giây); Túc Cầu `efuben_cuju.lua` so `nCurTime-nPreTime`; Lâu Lan Tầm Bảo `seek_treasure.lua` tick `x808039_g_TickTime` (đổi tick thì nhân lại mọi hằng số tính theo tick).
- Boss AI script (ví dụ Bàng Xí `event/sijuezhuang/ai_liqiushui.lua` 893069): sát thương chiêu = `SkillTemplate_V1` (cột 59–74 = mã SkillData) → `SkillData_V1` cột 26 (impact) → `Server/Config/StandardImpact.txt` (logic 001 "伤害数值+" = cố định + hệ số). Kiểm impact có ai dùng chung trước khi sửa. Buff cuồng bạo 10234/10235 dùng chung nhiều boss.

### Dữ liệu / DB / web
- File game **VISCII / GBK**: sửa bằng Node `latin1`, giữ CR/LF từng dòng (nhiều file CRLF), đếm byte > 0x7F so với HEAD, grep `\xef\xbf\xbd`. Chữ Việt mới: escape `\ddd` qua `tools/viscii-map.json` (máy nhà không có python → hàm `vn()` trong `tools/duclo4-nhanh-17-10.js`).
- Kiểm cú pháp Lua: `luaparse` ở `D:\Thiên Long Bát Bộ NetCo4\scratchpad-claude\luakiem\lp.js` (so với `git show HEAD:`; 2 file Kỳ Cuộc báo lỗi dòng 259 từ bản gốc là bình thường).
- Git Bash heredoc / `node -e` làm hỏng `\` → script có `\` phải viết bằng Write tool.
- Bảng `.txt` DBC phải sắp ID tăng dần. `MonsterAttrExTable` cột 60 = MaxHP.
- Túi boss web: mỗi dòng tối đa **50 ID**, tối đa 20 dòng. API `/api/tuiboss/cfg` (đọc, `ds[]`: `hd, on, knb, ngay, luot, mon[{ids,min,max}]`) và `/api/tuiboss/save` (gửi lại đúng các trường đó). Mẫu: `…\scratchpad-claude\quangay\tb-them-yq.js`.
- Đo rơi / số lần giết: `Server/Log/Audit_*.log` (`LC_ALL=C grep -a`), `ITEM_CREATED … Dropped by "<tên>",<DataID>` và `MONSTER_KILLED,<GUID>,<DataID>`. Mẫu tool: `…\quangay\soat-3pb.py`, `do-phieu2.py`.
- GUID hex trong log: `0X3C34E731` = 1010100017 (bialk). Nhân vật hay gặp: 1010100008 `bia1` (Tiêu Dao), 1010100020 `KimJongUn` (hoang01, Thiên Long), 1010100009 `Jr` / 1010100024 `ElizabethII` (Quỷ Cốc).

## 7. Đã thử, thất bại hoặc đã bỏ (đừng làm lại)

| Thử | Kết quả |
|---|---|
| `Bin/Config.axp` ngoài đĩa để sửa tooltip | Client bỏ qua |
| Đục lỗ / khảm ngọc thời trang | Client từ chối khảm |
| Mở trứng trân thú chọn giới tính bằng hộp thoại vật phẩm | Engine chặn click |
| Đồ VIP mã chỉ-GM + Tinh Thông | Client chặn theo danh sách cứng → đổi sang mã client |
| Thăng linh +60% mọi dòng | Cần client khác |
| **Vũ khí huyễn sức có dòng như thú cưỡi 9 sao (17/10)** | Server chỉ có 19 ô trang bị (0–18), ô huyễn sức client = 22 → không đeo được; điểm trang bị 19/20/22 ra 1★. Đã trả `EquipBase` về gốc (revert `01efc3a`) |
| Bộ "Thiên Long 14 phái 2024" (12/10) | Client có trojan, chủ server đã bỏ |
| Đội bot "người giả" (07/10) | Gỡ khỏi prod, `docs/BOT-NGUOI-GIA.md` |

## 8. Công tắc khẩn cấp và rollback

| Việc | Cách |
|---|---|
| Quay lại 1 thay đổi game | `git checkout <tag> -- <file>` hoặc `git revert` → push → chủ server `cap-nhat.sh` (+ restart nếu bảng) |
| Nhân vật bị đóng băng ("chương trình bị cấm") | `./go-dong-bang.sh --ds` (liệt kê, chạy được khi game bật) → `systemctl stop tlbb && ./go-dong-bang.sh <tên\|GUID> && systemctl start tlbb` |
| Rơi thêm qua script sai | Sửa / xóa dòng trong `roithem.txt` (hiệu lực ngay); bản cũ `/opt/tlbb-backup/roithem-truoc-*` |
| Túi boss web sai | Bản sao lưu `/opt/tlbb-backup/tuiboss-cfg-truoc-*.json` → gửi lại qua `/api/tuiboss/save` (mỗi hoạt động 1 lần) |
| Tắt Thương Phố | `touch …/Server/txt/NetCo4Web/thuongpho-tat` |
| Billing lỗi | `deploy/thay-billing.sh <thư mục> \| --tra` (CLAUDE.md) |
| Quay lại bot | `/opt/tlbb-backup/bot-truoc-<hash>-<giờ>` → chép → `systemctl restart minigame` |
| Custom Trùng Lâu bị trả về gốc nhầm | Dựng lại từ `/opt/tlbb-backup/trunglau-<giờ>` (cách làm 12/10) |
| Binary `Server/Server` | Bản UPX gốc `Server/Server.upx-goc` (mất 2 bản vá) |

Tag rollback 16–18/10 hay cần: `truoc-danhhieu-top-17-10`, `truoc-danhhieu18-17-10`, `truoc-nguong-dongbang-17-10`, `truoc-nhip-1giay-17-10`, `truoc-duclo4-nhanh-17-10`, `truoc-nerf-bangxi-18-10`, `truoc-itemsao-17-10`, `truoc-huyensuc-9sao-17-10`.

## 9. Bản đồ tài liệu

| Chủ đề | File |
|---|---|
| Quy tắc repo, hệ thống, script VPS, billing | `CLAUDE.md` |
| Nhật ký mọi thay đổi + tag | `docs/TRANG-THAI.md` |
| Cân bằng (chiêu, boss, rơi, phiếu, nhịp) | `docs/CAN-BANG.md` |
| Custom Trùng Lâu / Long Văn / Võ Hồn | `docs/TRUNG-LAU-CUSTOM.md` |
| Client: giải mã, giới hạn | `docs/CLIENT-GIAI-MA.md`, `tools/pet3d/README.md` |
| Boss, phó bản, túi boss web | `docs/BOSS-PHO-BAN.md`, `docs/TUI-BOSS.md` |
| Ghép Ngọc, vòng quay, Thương Phố, shop | `docs/GHEP-NGOC.md`, `docs/VONG-QUAY.md`, `docs/THUONG-PHO.md`, `docs/SHOP-TRONG-GAME.md` |
| Làm nội dung mới (event, NPC, drop) | `docs/PHAT-TRIEN.md` |
| Đã vá so với bản public | `docs/KIEM-TOAN.md` |
| Vật phẩm, pet, lệnh GM | `docs/vat-pham/`, `docs/pet-*.md`, `docs/lenh-gm.txt` |

## 10. Công cụ hay dùng

| Công cụ | Việc |
|---|---|
| `tools/tim-nguon.js <item>`, `tools/chi-gm.js --nguon <id>` | Ai rơi / bán / chế 1 món |
| `tools/bang-roi/lam.js` | Dựng lại netco4.click |
| `tools/soat-boss/soat.js <ID script>` | Soát lỗi boss / phó bản đã biết |
| `tools/phieu-boss/ky-vong.js` | Mô phỏng rơi boss theo luật thật |
| `deploy/go-dong-bang.sh` | Liệt kê / gỡ đóng băng |
| `tools/nhip-1giay-17-10.js`, `tools/duclo4-nhanh-17-10.js`, `tools/nerf-bangxi-18-10.js` | Mẫu mới nhất: sửa byte-level có kiểm, chèn menu NPC, escape `\ddd` |
| `tools/vps/` | Script chạy trên VPS: đọc / sửa túi boss qua API SUPER (`tb-cfg.js`, `tb-them-yq.js`), đo log (`soat-3pb.py`, `do-phieu2.py`). Xem README trong thư mục |
| `tools/elf/` | Dịch ngược `Server.elf` (`tim-dangky.py`, `str-at.py`, `jumptbl.py`, `frezze.py`, `jinyan.py`). ELF + disassembly ở máy chủ server, xem README |
| `…\scratchpad-claude\quangay\` (máy chủ server) | Bản gốc các tool trên + script local (`local-*.sh`), script danh hiệu (`danhhieu-*.js`) |
| `tools/viscii-map.json` | Bảng VISCII ↔ Unicode |
