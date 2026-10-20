# Script chay tren VPS (scp len /tmp roi chay). Mat khau tu doc tu file, KHONG in.

| File | Viec |
|---|---|
| `tb-cfg.js [luu.json]` | Dang nhap cong SUPER bot (127.0.0.1:1508, mat khau doc tu `/opt/minigame/BotDoMin/.env`), lay cau hinh tui boss, in dong co Yeu Quyet |
| `tb-them-yq.js [--ghi]` | Mau sua tui boss qua API (`/api/tuiboss/save`), sao luu cau hinh truoc vao `/opt/tlbb-backup` |
| `soat-3pb.py [ngay...]` | Chi doc Audit log: Ky Cuoc / Tuc Cau / Lau Lan Tam Bao - so lan giet, ha boss, do roi |
| `do-phieu2.py` | Chi doc Audit log: phieu 39910001 roi theo loai quai, % thuc te (sua khung gio trong file) |
- `gn-ao9-thucuoi9.js` (20/10): Ghép Ngọc thêm món đích 20 mẫu thời trang 9 sao (màu 1) + thú cưỡi 9 sao 10141214, giá trị 2.000.000, thắng nhận 1. Qua API SUPER, sao lưu `/opt/tlbb-backup/gn-cfg-truoc-ao9-thucuoi9-*.json`. Đã chạy --ghi 20/10.
