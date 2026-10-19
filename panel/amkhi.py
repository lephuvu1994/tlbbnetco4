#!/usr/bin/env python3
"""04/10: TAY 3 DONG AM KHI (Phap bao, he "Dark" cua engine) - admin chinh trong so boc ky nang cua 3 dong.

Co che (dich nguoc Server.elf 04/10):
  - Am khi hoc ky nang o 3 moc cap 40 / 70 / 90 = 3 dong. Lua tay ky nang (obj/item/darkitem.lua 332207,
    vat pham 30503118 + 50.000 tien) goi AdjustDarkSkillForBagItem -> Item::AdjustDarkSkill (0x833b19c):
    doc g_DarkSkillStudyTbl (nap tu Server/Config/DarkSkillStudy.txt) roi rand theo trong so, SetDarkSkillId.
  - DarkSkillStudy.txt: moi hang = 1 lua chon, cot 1/2 = ky nang + trong so dong 1 (cap 40), cot 3/4 = dong 2 (cap 70),
    cot 5/6 = dong 3 (cap 90). Ky nang -1 = khong co. Ty le = trong so / tong trong so cua dong.
  => Chi doi 3 cot trong so (2, 4, 6), giu nguyen ID ky nang va moi byte khac. Co hieu luc sau restart.

Trong so dang ap luu o Server/txt/NetCo4Cfg/amkhi.json (ngoai repo). cap-nhat.sh rsync ghi de DarkSkillStudy.txt bang ban
repo roi goi `python3 amkhi.py --ap-lai`. Tra ve goc = chep lai ban repo.
"""
import json
import os
import sys
import time

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME = "/opt/tlbb-root/home/tlbb"
CFG = GAME + "/Server/txt/NetCo4Cfg/amkhi.json"
# 19/10: CONG TAC THUOC TINH NHAN DIEM KHI TAY AM KHI (NPC Yen Thanh -> obj/item/darkitem.lua x332207_DarkAttrAdjustForBagItem).
# File 1 dong "c n t tr th" (1 = cho nhan diem, 0 = khong) theo thu tu Luc, Linh khi, The luc, Dinh luc, Than phap (= attrfrom 0..4 Lua nhan tu engine).
# Khong co file hoac ca 5 = 1 -> engine goc (ngau nhien). Lua doc MOI LAN tay -> luu la co hieu luc ngay, KHONG restart.
TAY = GAME + "/Server/txt/NetCo4Cfg/amkhitay.txt"
TAY_TEN = ["Luc", "Linh khi", "The luc", "Dinh luc", "Than phap"]
F_GAME = GAME + "/Server/Config/DarkSkillStudy.txt"
F_REPO = os.path.join(REPO, "server", "Server", "Config", "DarkSkillStudy.txt")
DONG = [(40, 1, 2), (70, 3, 4), (90, 5, 6)]   # (moc cap, cot ky nang, cot trong so)

# Ten ky nang (StandardImpact.txt cot 1, GBK "法宝..." -> Viet). Dong 1 cong cong, dong 2 hieu ung len dich, dong 3 chi so.
TEN = {
    32003: "+Ngoại công", 32019: "+Nội công", 32035: "+Băng công", 32051: "+Hỏa công", 32067: "+Huyền công",
    32083: "+Độc công", 32099: "+Sát thương trực tiếp", 32115: "Độc (mất máu dần)",
    32150: "Giảm công kích địch", 32166: "Giảm phòng thủ địch", 32182: "Giảm tốc", 32198: "Định thân", 32214: "Tán công",
    32230: "Mù", 32262: "Phong huyệt", 32278: "Tê liệt", 32294: "Vây hãm", 32310: "Hôn mê",
    32328: "+Lực", 32344: "+Linh khí", 32360: "+Thể lực", 32376: "+Định lực", 32392: "+Thân pháp",
    32400: "+Sinh lực tối đa %", 32401: "+Nội lực tối đa %", 32402: "+Ngoại công %", 32403: "+Nội công %",
    32404: "+Phòng ngoại %", 32405: "+Phòng nội %",
}


def _doc(path):
    s = open(path, "rb").read().decode("latin-1")
    eol = "\r\n" if "\r\n" in s else "\n"
    return s.split(eol), eol


def _hang(lines):
    """Chi so cac hang du lieu (cot 0 la so) trong file."""
    return [i for i, l in enumerate(lines) if l.split("\t")[0].strip().isdigit()]


def doc_cfg():
    try:
        return json.load(open(CFG, encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def tay_doc():
    """[c, n, t, tr, th] - 1 = thuoc tinh duoc nhan diem khi tay. Mac dinh ca 5 = 1 (goc)."""
    try:
        p = open(TAY, encoding="ascii", errors="replace").readline().split()
        if len(p) >= 5:
            return [1 if x == "1" else 0 for x in p[:5]]
    except OSError:
        pass
    return [1, 1, 1, 1, 1]


def tay_luu(bat, ai=""):
    """Ghi amkhitay.txt (ghi tam roi doi ten). Ca 5 = 1 -> xoa file = ve goc. Can it nhat 1 thuoc tinh bat."""
    try:
        bat = [1 if int(x) else 0 for x in bat]
    except (TypeError, ValueError):
        return False, "Du lieu cong tac khong hop le"
    if len(bat) != 5:
        return False, "Can du 5 cong tac"
    if sum(bat) == 0:
        return False, "Phai bat it nhat 1 thuoc tinh"
    if sum(bat) == 5:
        if os.path.exists(TAY):
            os.remove(TAY)
        return True, "Da luu: bat ca 5, tay am khi ngau nhien nhu goc"   # "Da " = bot bao thanh cong
    ai = "".join(c for c in str(ai) if c.isalnum() or c in "._@-")[:40]
    tmp = TAY + ".tmp"
    with open(tmp, "w", encoding="ascii", newline="\n") as f:
        f.write(" ".join(str(x) for x in bat) + "\n# ai=%s t=%d\n" % (ai, int(time.time())))
    os.replace(tmp, TAY)
    return True, "Da luu: tay am khi chi do diem vao " + ", ".join(TAY_TEN[i] for i in range(5) if bat[i])


def du_lieu():
    """3 dong: moi lua chon {id, ten, goc (trong so ban repo), hien (trong so file game)}."""
    goc, _ = _doc(F_REPO)
    try:
        hien, _ = _doc(F_GAME)
    except OSError:
        hien = goc
    hg, hh = _hang(goc), _hang(hien)
    out = []
    for cap, ck, cw in DONG:
        ds = []
        for n, i in enumerate(hg):
            c = goc[i].split("\t")
            sk = int(c[ck])
            if sk < 0:
                continue
            w_hien = int(hien[hh[n]].split("\t")[cw]) if n < len(hh) else int(c[cw])
            ds.append({"id": sk, "ten": TEN.get(sk, "#%d" % sk), "goc": int(c[cw]), "hien": w_hien})
        out.append({"cap": cap, "ds": ds})
    cfg = doc_cfg()
    return {"dong": out, "dangAp": bool(cfg), "t": cfg.get("t", 0), "ai": cfg.get("ai", ""), "pc": pc_du_lieu()}   # 14/10: + pham chat


def _ghi(w):
    """w = {40: [..], 70: [..], 90: [..]} theo thu tu hang co ky nang. Dung ban repo lam khuon."""
    goc, eol = _doc(F_REPO)
    for cap, ck, cw in DONG:
        k = 0
        for i in _hang(goc):
            c = goc[i].split("\t")
            if int(c[ck]) < 0:
                continue
            c[cw] = str(w[cap][k])
            k += 1
            goc[i] = "\t".join(c)
    tmp = F_GAME + ".moi"
    open(tmp, "wb").write(eol.join(goc).encode("latin-1"))
    os.replace(tmp, F_GAME)


def kiem(d40, d70, d90):
    base = {x["cap"]: len(x["ds"]) for x in du_lieu()["dong"]}
    w = {}
    for cap, s in ((40, d40), (70, d70), (90, d90)):
        try:
            a = [int(x) for x in str(s).replace(" ", "").split(",") if x != ""]
        except ValueError:
            return None, "Dong cap %d: trong so phai la so nguyen" % cap
        if len(a) != base[cap]:
            return None, "Dong cap %d can %d trong so (dang co %d)" % (cap, base[cap], len(a))
        if any(x < 0 or x > 9999 for x in a):
            return None, "Dong cap %d: moi trong so 0-9999" % cap
        if sum(a) <= 0:
            return None, "Dong cap %d: tong trong so phai > 0" % cap
        w[cap] = a
    return w, None


def ap(d40, d70, d90, ai=""):
    w, err = kiem(d40, d70, d90)
    if err:
        return False, err
    _ghi(w)
    os.makedirs(os.path.dirname(CFG), exist_ok=True)
    tmp = CFG + ".moi"
    json.dump({"w": {str(k): v for k, v in w.items()}, "t": int(time.time()), "ai": ai}, open(tmp, "w", encoding="utf-8"))
    os.replace(tmp, CFG)
    return True, "Da ap trong so tay am khi (3 dong). Co hieu luc sau khi restart."


def tra():
    if not doc_cfg():
        return False, "Dang dung trong so goc roi"
    open(F_GAME, "wb").write(open(F_REPO, "rb").read())
    try:
        os.remove(CFG)
    except OSError:
        pass
    return True, "Da tra trong so tay am khi ve goc. Co hieu luc sau khi restart."


# ------------------------------------------------------------------ 14/10: PHAM CHAT AM KHI
# Item::ResetDarkQuality: pham chat = cot 102 EquipBase (am khi cap 90 = 2000) + bac x 40 + rand(0..39); bac 0-4 boc theo trong so
# PHAN NGHIN trong Server/Config/DarkConfigTable.ini: LowDark = tay bang Bach Thoi Thach 30503119, HighDark = Thien Thoi Than Ngoc
# 30503120, DefaultDark = am khi moi tao. File .ini doc luc khoi dong -> sau khi ap phai RESTART. Ban dang ap luu amkhi_pc.json
# (ngoai repo), cap-nhat.sh rsync ghi de .ini bang ban repo roi goi --ap-lai. Ban repo 14/10 da la bang can bang (Thien Thoi bac 4 10%).
CFG_PC = GAME + "/Server/txt/NetCo4Cfg/amkhi_pc.json"
F_PC_GAME = GAME + "/Server/Config/DarkConfigTable.ini"
F_PC_REPO = os.path.join(REPO, "server", "Server", "Config", "DarkConfigTable.ini")
PC_NHOM = [("low", "LowDark_Quality_GorwRate", "Bách Thối Thạch 30503119"),
           ("high", "HighDark_Quality_GorwRate", "Thiên Thối Thần Ngọc 30503120"),
           ("def", "DefaultDark_Quality_GrowRate", "Ám khí mới tạo (rơi / chế)")]
PC_GAME_GOC = {"low": [738, 200, 50, 10, 2], "high": [0, 875, 100, 20, 5], "def": [874, 100, 20, 5, 1]}   # game goc truoc 14/10


def _pc_doc(path):
    s = open(path, "rb").read().decode("latin-1")
    kv = {}
    for l in s.replace("\r", "").split("\n"):
        if "=" in l:
            k, v = l.split("=", 1)
            kv[k.strip()] = v.strip()
    out = {}
    for khoa, ten, _ in PC_NHOM:
        out[khoa] = [int(kv.get(ten + str(i), "0") or 0) for i in range(5)]
    return out


def doc_cfg_pc():
    try:
        return json.load(open(CFG_PC, encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def pc_du_lieu():
    repo = _pc_doc(F_PC_REPO)
    try:
        hien = _pc_doc(F_PC_GAME)
    except OSError:
        hien = repo
    cfg = doc_cfg_pc()
    return {"nhom": [{"k": k, "ten": t, "repo": repo[k], "hien": hien[k], "gameGoc": PC_GAME_GOC[k]} for k, _, t in PC_NHOM],
            "dangAp": bool(cfg), "t": cfg.get("t", 0), "ai": cfg.get("ai", "")}


def _pc_ghi(w):
    """w = {low: [5], high: [5], def: [5]}. Dung ban repo lam khuon, chi thay so sau dau '=' cua 15 khoa, giu moi byte khac."""
    s = open(F_PC_REPO, "rb").read().decode("latin-1")
    eol = "\r\n" if "\r\n" in s else "\n"
    ten = {t + str(i): str(w[k][i]) for k, t, _ in PC_NHOM for i in range(5)}
    out = []
    for l in s.split(eol):
        k = l.split("=", 1)[0].strip() if "=" in l else ""
        out.append(k + "=" + ten[k] if k in ten else l)
    tmp = F_PC_GAME + ".moi"
    open(tmp, "wb").write(eol.join(out).encode("latin-1"))
    os.replace(tmp, F_PC_GAME)


def pc_kiem(low, high, de):
    w = {}
    for (k, _, ten), s in zip(PC_NHOM, (low, high, de)):
        try:
            a = [int(x) for x in str(s).replace(" ", "").split(",") if x != ""]
        except ValueError:
            return None, "%s: phai la so nguyen" % ten
        if len(a) != 5 or any(x < 0 or x > 1000 for x in a):
            return None, "%s: can 5 so 0-1000 (bac 0-4)" % ten
        if sum(a) != 1000:
            return None, "%s: tong phai dung 1000 (phan nghin), dang %d" % (ten, sum(a))
        w[k] = a
    return w, None


def pc_ap(low, high, de, ai=""):
    w, err = pc_kiem(low, high, de)
    if err:
        return False, err
    _pc_ghi(w)
    os.makedirs(os.path.dirname(CFG_PC), exist_ok=True)
    tmp = CFG_PC + ".moi"
    json.dump({"w": w, "t": int(time.time()), "ai": ai}, open(tmp, "w", encoding="utf-8"))
    os.replace(tmp, CFG_PC)
    return True, "Da ap ti le pham chat am khi. Co hieu luc sau khi restart."


def pc_tra():
    if not doc_cfg_pc():
        return False, "Dang dung bang trong repo roi"
    open(F_PC_GAME, "wb").write(open(F_PC_REPO, "rb").read())
    try:
        os.remove(CFG_PC)
    except OSError:
        pass
    return True, "Da tra ti le pham chat am khi ve bang trong repo. Co hieu luc sau khi restart."


def ap_lai():
    """Goi tu cap-nhat.sh sau rsync: ap lai amkhi.json + amkhi_pc.json (neu co) len ban repo moi nhat."""
    kq = []
    cfg = doc_cfg()
    if not cfg:
        kq.append("khong co trong so tay 3 dong rieng")
    else:
        w = {int(k): v for k, v in cfg.get("w", {}).items()}
        base = {x["cap"]: len(x["ds"]) for x in du_lieu()["dong"]}
        if set(w) != {40, 70, 90} or any(len(w[c]) != base[c] for c in base):
            kq.append("BO QUA: amkhi.json khong khop so lua chon cua ban repo (kiem lai tren admin)")
        else:
            _ghi(w)
            kq.append("ap lai trong so tay 3 dong")
    pc = doc_cfg_pc()
    if pc:
        w, err = pc_kiem(*[",".join(str(x) for x in pc.get("w", {}).get(k, [])) for k, _, _ in PC_NHOM])
        if err:
            kq.append("BO QUA pham chat: " + err)
        else:
            _pc_ghi(w)
            kq.append("ap lai ti le pham chat")
    return "; ".join(kq)


if __name__ == "__main__":
    if sys.argv[1:] == ["--ap-lai"]:
        print(ap_lai())
    else:
        d = du_lieu()
        for x in d["dong"]:
            tg, th = sum(o["goc"] for o in x["ds"]), sum(o["hien"] for o in x["ds"])
            print("== dong cap %d" % x["cap"])
            for o in x["ds"]:
                print("   %5d %-24s goc %4d (%5.1f%%)  hien %4d (%5.1f%%)" % (o["id"], o["ten"], o["goc"], 100.0 * o["goc"] / tg, o["hien"], 100.0 * o["hien"] / th))
        print("dang ap:", d["dangAp"])
