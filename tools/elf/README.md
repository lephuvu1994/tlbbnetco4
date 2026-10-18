# Dich nguoc Server.elf (chi doc)

Ban ELF giai nen UPX + disassembly nam o may chu server (khong co trong repo, nang):
`D:\Thien Long Bat Bo NetCo4\scratchpad-claude\server-elf\Server.elf` va `...\sinhsan\dis.txt` (objdump -d -C).
Cac script dat duong dan cung `/mnt/d/...` -> chay bang python3 trong WSL (`wsl -d Ubuntu-22.04 -u root -- python3 -I <file>`), sua duong dan neu may khac.

| File | Viec |
|---|---|
| `tim-dangky.py` | Ten dang ky Lua cua 1 ham C++ (vd `LuaFnAddItemWithQuality` C++ = `AddItemWithQuality` trong Lua) |
| `str-at.py <dia chi hex>...` | Doc chuoi C tai dia chi ao |
| `jumptbl.py` | Bang nhay `LuaFnAwardTitle` (20 o danh hieu) |
| `frezze.py`, `jinyan.py` | Tim chuoi "Frezze" / "JINYAN" va cho dung (dong bang tu dong, 17/10) |

Doc gia tri engine dang chay (vd nguong dong bang): tren VPS `python3` mo `/proc/<pid Server>/mem`, seek dia chi, doc (chi doc).
