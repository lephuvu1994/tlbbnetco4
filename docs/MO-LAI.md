# Mở lại TLBB NetCo4 (sau khi đóng mùa 1, 24/10/2026)

Chủ server đóng mùa 1 ngày 24/10/2026. Kế hoạch là **mở mùa mới (xóa trắng)**: giữ nguyên code và mọi chỉnh cân bằng, xóa nhân vật và ví web.

## Lưu ở đâu

| Thứ | Chỗ | Lên git? |
|---|---|---|
| Code game + script deploy + panel GM | GitHub `tlbbnetco4` (`main`) | ✅ |
| Cấu hình cân bằng admin (`Server/txt/NetCo4Cfg`: rơi thêm, Trùng Lâu, Võ Hồn, Võ Ý, ám khí, cấp max...) | `deploy/cau-hinh-vps/NetCo4Cfg/` (chụp 24/10 13:34) | ✅ |
| Bot web + portal | GitHub `bialk` (`main`) | ✅ |
| Cấu hình web (shop, túi boss, vòng quay, Ghép Ngọc, Pet Boss, điểm danh...) | `bialk/BotDoMin/cauhinh-mua-moi.json` + `thu/nap-cauhinh-mua-moi.js` | ✅ |
| Ảnh web (icon vật phẩm 426, pet 3D 1.575 file, ảnh admin tải lên 212) | `bialk/itemicon`, `bialk/pet3d`, `bialk/BotDoMin/assets/itemimage` | ✅ |
| **Gói nguyên khối VPS** (chroot + MySQL + engine đã vá + billing + mật khẩu + bot + nginx/SSL) | Máy nhà chủ server, thư mục `Thiên Long\2-code-chay-server` | ❌ có mật khẩu |
| DB nhân vật + ví web mùa 1 | Cùng chỗ trên (`db-*.sql.gz`, `bot-*.json.gz`) | ❌ dữ liệu người chơi |

## Trạng thái lúc đóng
- Game `main` `a79182a` (22/10). VPS chạy đúng commit này, `git status` sạch.
- Engine `Server/Server` md5 `8f85c1ee` (= `Server.denam2`, đọc "đến âm" ở MD 470). Tạo lại từ bản gốc bằng `deploy/va-server/va-tu-di-theo.py` + `va-den-am.py`; bản đã vá có sẵn trong gói nguyên khối.
- 3 bảng `EquipBase` / `ItemSegValue` / `StandardImpact` trên VPS lệch repo: **đúng thiết kế**. Đó là Custom Trùng Lâu do `panel/trunglau.py` áp từ `NetCo4Cfg/trunglau.json`; `cap-nhat.sh` tự áp lại (`--ap-lai`).
- Bot `bialk` `c54d279`. VPS khớp, trừ `ichky.client.js`: git (`ef2a3ce`, giới hạn nhận 1.000 / món) **mới hơn** VPS (`5cc0174`) vì chưa chép lên. Dựng lại từ git là có bản mới.
- Còn sót trên VPS, không dùng: `Public/Data/AIScript/script346-349.ai`, `NetCo4/botdoi.lua` (đội bot đã gỡ 07/10).

## Cách A - Dựng y hệt từ gói nguyên khối (cách chính)
Cần VPS mới: Ubuntu 22.04 x86_64, IP public **trên card mạng** (không NAT), ≥ 4 GB RAM, ≥ 25 GB trống.

1. Chép `1-tlbb-root.tar.gz`, `2-he-thong.tar.gz` (và `3-tlbb-backup.tar.gz` nếu muốn lịch sử) lên VPS, ví dụ `/root/goi`.
2. `bash khoi-phuc-nguyen-khoi.sh /root/goi` (script nằm ở `deploy/`, cũng có trong gói 2 ở `/opt/tlbb-repo/deploy/`).
3. Làm theo phần in ra cuối:
   - Đổi IP cũ → mới trong `config.env`, `ServerInfo.ini` và `panel.py`.
   - Đổi IP trong client phát cho người chơi.
   - Trỏ DNS `netco4.click` về IP mới, rồi `certbot renew --force-renewal`.
   - Mở cổng: 7384 Login, 3731 Game, 80/443 web, 8443 panel (chỉ IP nhà).
   - SSH VPS cũ dùng cổng **24700**. VPS mới mặc định 22. Đổi trong `/etc/ssh/sshd_config` nếu muốn giữ, và mở cổng ufw **trước** khi `ufw enable`.
4. `systemctl start tlbb` → `./tlbb.sh status` → `systemctl start tlbb-panel minigame` → `systemctl restart nginx`.

Cách B (cài sạch từ git bằng `deploy/00..04`) cần ảnh gốc `/root/Ubuntu.vmdk` (5,5 GB). Ảnh này **không** được sao lưu, vì gói 1 đã là chroot giải nén và dọn sẵn từ ảnh đó. Nên luôn dùng cách A.

## Mùa mới (xóa trắng) - làm sau bước 3, trước khi mở cho người chơi
1. Game: `cd /opt/tlbb-deploy && ./mo-server.sh --thu` (chạy thử trên bản sao DB, đếm), rồi `./tlbb.sh stop && ./mo-server.sh` (gõ `MOSERVER`).
   - Xóa mọi nhân vật và mọi tài khoản trừ `admin`.
   - Giữ bộ đếm GUID, ô bang / thành (trả về trống) và `NetCo4Cfg`.
   - Quy trình đầy đủ: `docs/MO-SERVER.md` mục 3.
2. Bot web:
   ```
   systemctl stop minigame
   cd /opt/minigame/BotDoMin && mv database.json database.json.mua1
   node thu/nap-cauhinh-mua-moi.js nap database.json --ghi
   systemctl start minigame
   ```
   Kết quả: ví, Family, Rương Ích Kỷ, Thương Phố, nhật ký và giftcode đều trống; cấu hình shop, túi boss, vòng quay... giữ nguyên. **Chưa chạy thử bot với database chỉ có cấu hình.** Mở trang admin kiểm từng mục trước khi mở cửa.
3. Xem lại các quyết định cân bằng dành cho "người chơi lên endgame nhanh". Chúng hợp lý cho mùa 1, có thể không hợp với mùa mới:
   - `roithem.txt`: Tử Vi Linh Phách / Li Hoa 100% ở Kỳ Cuộc, Túc Cầu;
   - viên +5 điểm không trần;
   - Võ Ý tối đa 250;
   - máu boss 120% gốc.

   Tham khảo `docs/CAN-BANG.md`.

## Cập nhật code sau khi dựng lại
- Game: `cd /opt/tlbb-deploy && ./cap-nhat.sh -y` (kéo GitHub qua HTTPS). Repo chuyển **private** thì VPS cần deploy key:
  - Dùng `/root/.ssh/github_deploy.pub` (trong gói 2, nhưng gói 2 không tự giải nén `.ssh`, phải chép tay), hoặc tạo key mới.
  - Thêm key vào repo → Settings → Deploy keys.
  - Đổi remote: `git -C /opt/tlbb-repo remote set-url origin git@github.com:nguyendangkhoa150899-boop/tlbbnetco4.git`.
- Bot: VPS không có git. Làm theo quy trình deploy bot trong `CLAUDE.md`: so md5 → sao lưu → `node --check` → chép → `systemctl restart minigame`.

## Sự cố
- **MySQL không lên.** Gói 1 được chép lúc DB đang chạy nên có thể dở dang. Cách sửa:
  1. Lấy `db-20261024-1331.sql.gz` (trong gói, hoặc `/opt/tlbb-backup/hang-ngay/`).
  2. `. /opt/tlbb-deploy/common.sh; mount_chroot; spawn_chroot "$MYSQL_BIN/mysqld_safe --user=root"; wait_mysql "-uroot -p'$MYSQL_ROOT_PASS'"`
  3. `zcat <dump> | mysql_root ""`
  4. `umount_chroot`, rồi `systemctl start tlbb`.

  Mùa mới thì DB cũ không quan trọng: chỉ cần MySQL lên được để chạy `mo-server.sh`.
- **Game không vào được sau khi đổi IP:** sót IP cũ ở `ServerInfo.ini` hoặc ở client.
