"""20/10: CON CAI - admin chon LOAI ky nang con duoc ra khi tay (NPC Truong Ton Ba Ba / Moc Tu Tu Tu, Giac Linh Chau).

File Server/txt/NetCo4Cfg/concaikn.txt: 1 dong 8 so 0/1 = loai 1..8 (thu tu engine / client Infant_SkillReset):
Khang Bang, Khang Hoa, Khang Huyen, Khang Doc, Giam khang Bang, Giam khang Hoa, Giam khang Huyen, Giam khang Doc.
Khong co file / bat ca 8 = random 8 loai nhu goc. Lua (MyNew/zhinv/zhinv_NPC.lua x910052_NetCo4_KnLoai) doc MOI LAN tay
-> luu la co hieu luc ngay, KHONG restart.
"""
import os
import time

GAME = "/opt/tlbb-root/home/tlbb"
FILE = GAME + "/Server/txt/NetCo4Cfg/concaikn.txt"
TEN = ["Khang Bang", "Khang Hoa", "Khang Huyen", "Khang Doc", "Giam khang Bang", "Giam khang Hoa", "Giam khang Huyen", "Giam khang Doc"]


def doc():
    """[8 so 0/1] - mac dinh ca 8 = 1 (random nhu goc)."""
    try:
        p = open(FILE, encoding="ascii", errors="replace").readline().split()
        if len(p) >= 8:
            return [1 if x == "1" else 0 for x in p[:8]]
    except OSError:
        pass
    return [1] * 8


def luu(bat, ai=""):
    """Ghi concaikn.txt (ghi tam roi doi ten). Ca 8 = 1 -> xoa file = ve goc. Can it nhat 1 loai bat."""
    try:
        bat = [1 if int(x) else 0 for x in bat]
    except (TypeError, ValueError):
        return False, "Du lieu cong tac khong hop le"
    if len(bat) != 8:
        return False, "Can du 8 cong tac"
    if sum(bat) == 0:
        return False, "Phai bat it nhat 1 loai ky nang"
    if sum(bat) == 8:
        if os.path.exists(FILE):
            os.remove(FILE)
        return True, "Da luu: bat ca 8, tay ky nang con ngau nhien nhu goc"   # "Da " = bot bao thanh cong
    ai = "".join(c for c in str(ai) if c.isalnum() or c in "._@-")[:40]
    tmp = FILE + ".tmp"
    with open(tmp, "w", encoding="ascii", newline="\n") as f:
        f.write(" ".join(str(x) for x in bat) + "\n# ai=%s t=%d\n" % (ai, int(time.time())))
    os.replace(tmp, FILE)
    return True, "Da luu: tay ky nang con chi ra " + ", ".join(TEN[i] for i in range(8) if bat[i])
