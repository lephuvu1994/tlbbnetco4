# Dịch ngược & nghiên cứu TLBB NetCo4 – mục lục (24/10/2026)

File này là **bản đồ**: mỗi mục cho biết ai đã tìm ra điều gì, chi tiết ghi ở đâu, file thô nằm ở đâu.

File thô (ELF, disassembly, gói client trích từ RAM...) **không nằm trên git**. Chúng ở bộ lưu trên máy nhà chủ server: `D:\dự án gunny + tlbb\ThienLong\5-khac\nghien-cuu\` (xem `README.md` trong đó).

## 1. Engine server (`Server/Server`, ELF 32-bit)

| Thứ | Ở đâu |
|---|---|
| Bản gốc nén UPX (11 MB) / bản giải nén (86 MB) / bản đang chạy đã vá (md5 `8f85c1ee`) | `nghien-cuu/engine-vps/Server.upx-goc`, `Server.truoc-denam`, `Server` |
| ELF giải nén + disassembly toàn bộ + chuỗi kèm địa chỉ | `nghien-cuu/engine-vps/re/` (`Server.elf`, `text.asm`, `str.vma`, `lvup.dis` / `levelup.dis` / `allxf.dis` = các hàm lên cấp / hệ phái đã tách) |
| Bản dịch ngược làm việc của Claude | `nghien-cuu/scratchpad-claude/server-elf/`, `tunhat/` (`si038.s`, `docmem.py`), `sinhsan/` (`CreatePet.s`, `TakeOut.s`... hàm pet) |
| Bản vá đang chạy (có địa chỉ, byte, cách lắp ráp và cách thử) | `deploy/va-server/va-tu-di-theo.py` (tổ đội tự đồng ý đi theo, `CGAskTeamFollowHandler::Execute` 0x081c15dc), `va-den-am.py` (`CombatCore_T::{Cold,Fire,Light,Poison}Damage`, đọc MD 470 qua `Obj_Human::GetMissionData` 0x081050c4), `tools/tat-giup-thetaiphu.py` |

Đã biết thêm:
- **Hàm Lua của engine** = chuỗi `int LuaFnTbl::LuaFn...(lua_State*)` trong file (`strings Server | grep LuaFnTbl::`).
  - **Không có hàm ghi chỉ số gốc** Cường / Nội / Thể / Trí / Thân. Chỉ có `GetStr...` và `SetPlayerRemainPoints`. Cộng điểm chỉ đi qua gói `CGReqManualAttr` (`CGReqManualAttrHandler`).
  - `LuaFnUpdateAttr` là hàm của hệ thư / bang, không phải chỉ số.
- Công thức "điểm → chỉ số" lấy từ `Server/Config/BaseValueTable.ini`: hệ số chia 100, mỗi phái một khối `[MENPAI0..12]`, 6 = Thiên Long. Đã đối chiếu với ảnh trong game: khớp từng điểm.

## 2. Client (`Bin/OgreMain.dll`, có Themida)

| Thứ | Ở đâu |
|---|---|
| Giải mã, cách client được bảo vệ, những gì đã thử và thất bại | `docs/CLIENT-GIAI-MA.md` |
| `Config.axp` + `Interface.axp` **trích từ RAM** (không có trên đĩa) | `nghien-cuu/client-axp-trich-tu-RAM/goi1.axp`, `goi2.axp`. Đọc bằng `tools/pet3d/trich.js` (`node trich.js goi2.axp cfg "^CharModelEx\.txt$"`). Cách trích lại: `tools/pet3d/README.md` (`dumpmod.ps1`, `tachgoi.js`, `docram.ps1`) |
| Bảng client đã tách ra (`EquipBase`, `ItemRule`, pet...) + giao diện | `nghien-cuu/scratchpad-claude/client-cfg/`, `client-ui/` |
| Mô hình 3D pet (đọc gói `Data/*.axp` mã hóa) | `tools/pet3d/` + dữ liệu `bialk/pet3d` |

Đã biết thêm:
- Tooltip, chữ buff, mô tả vật phẩm, nút "+" cộng điểm, bảng chỉ số con cái, dòng Thăng Linh trên món đồ đều do **client tự tính / tự vẽ**. Server không sửa được.
- Bảng client lệch sẵn với server ở vài chỗ, ví dụ `ItemAptRate` né / chính xác.

## 3. Dữ liệu & mã hóa

| Thứ | Ghi chú |
|---|---|
| Mã hóa | Lua + bảng tiếng Việt: **VISCII** (`tools/viscii-map.json`). Bảng engine `Server/Config`: **GBK**. Xuống dòng CRLF lẫn LF, có cả NEL. Sửa ở mức byte bằng Node `latin1` |
| MissionData | `t_char.mdata` = chuỗi hex, mỗi chỉ số 8 ký tự int32 little-endian (MD n ở `SUBSTRING(mdata, n*8+1, 8)`). Tên hằng ở `ScriptGlobal.lua` (vd `XIEZI_SL = 381`) |
| Số lượng vật phẩm trong DB | `(p7>>24)&255` của `t_iteminfo.p7` (CLAUDE.md) |
| Chuỗi "người chế" (`creator`) của trang bị chứa thẻ hệ thống | `w#p<n>` Vương Quyền, `t#p<n>` Thiên Đạo (`obj/dali/xian1z.lua`, điểm ghi MD 381), `&DW` Điêu Văn (`aHaDiaoWenSys_1.lua`), `&JT` Tinh Thông, `#S` Thái Cổ Thần Khí, `&WH` Võ Hồn |
| Buff chỉ số | `MyLua/ShuaXinClient.lua` (`AHa_ReMyBuff`): mỗi chỉ số một dải mã impact có trần, vd Cường 13000-13699 = +10 / đơn vị, trần 6.990. Mọi nguồn cộng chung một dải |
| Điêu Văn lam (Vong Vô / Minh Tưởng / Ngự Kính / Bạo Nộ) | Chỉ khắc lên dây chuyền. MD 437 `XZ_LANSEDIAOWEN`, impact 9790-9819, nhóm chiêu `Public/Config/IDCollections.txt` 121-126 |

## 4. Nghiên cứu theo tính năng (đã ghi thành tài liệu)
- `CLAUDE.md` + `docs/BAN-GIAO.md`: quy tắc, bẫy, cách deploy.
- `docs/TRANG-THAI.md`: nhật ký từng ngày, đọc từ cuối lên.
- `docs/CAN-BANG.md`: mọi thay đổi cân bằng, số liệu trước / sau.
- `docs/PHAT-TRIEN.md`: thêm NPC / script, API Lua hay dùng, rơi đồ, kỹ năng, pet.
- Theo hệ thống: `BOSS-PHO-BAN.md`, `GHEP-NGOC.md`, `TUI-BOSS.md`, `TRUNG-LAU-CUSTOM.md`, `VONG-QUAY.md`, `THUONG-PHO.md`, `FAMILY.md`, `KIEM-TOAN.md`, `TINH-NANG-BI-TAT.md`, `SHOP-TRONG-GAME.md`, `EVENT-CU.md`, `pet-*.md`.
- Công cụ sửa từng việc: `tools/*.js` (tên file = việc + ngày, đầu file ghi lý do / cách chạy / tag rollback).

## 5. Script thử nghiệm của Claude (không gọn, nhưng có thể dùng lại)
`nghien-cuu/scratchpad-claude/`:
- `quangay/`: mẫu chép file lên server.
- `luakiem/`: kiểm cú pháp Lua 4.
- `mu/`, `lihoa/`, `tuiboss/`, `voy-*`, `amkhi-*`, `tuluyen-*`...: phân tích từng tính năng.
- `billing-moi/`: billing thay thế.

`nghien-cuu/scratchpad-phien-24-10/`: script phân tích của phiên đóng mùa.
