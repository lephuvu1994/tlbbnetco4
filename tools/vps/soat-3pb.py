#!/usr/bin/env python3
# Chi doc: soat Ky Cuoc / Tuc Cau / Lau Lan Tam Bao tu Audit log 3 ngay gan nhat.
# Moi hoat dong: so lan giet quai (MONSTER_KILLED), so lan ha boss, do roi theo mon (ITEM_CREATED "Dropped by"), so nguoi nhan.
import glob, re, collections, sys
LOG = "/opt/tlbb-root/home/tlbb/Server/Log/"
def r(a, b): return set(range(a, b + 1))
HD = {
    "Ky Cuoc": {"quai": r(1770, 1809) | r(31770, 31809) | {700, 701} | r(12000, 12039) | r(12050, 12089) | r(42000, 42039) | r(42050, 42089),
                "boss": r(1850, 1859) | r(31850, 31859) | r(12040, 12049) | r(42040, 42049) | r(12090, 12099) | r(42090, 42099)},
    "Tuc Cau": {"quai": r(3680, 3719) | r(9160, 9199) | r(33680, 33719) | r(39160, 39199), "boss": r(3720, 3729) | r(33720, 33729)},
    "Lau Lan Tam Bao": {"quai": r(12102, 12137), "boss": r(12138, 12146)},
}
def hd_of(i):
    for k, v in HD.items():
        if i in v["quai"]: return k, "quai"
        if i in v["boss"]: return k, "boss"
    return None, None
ngay = sys.argv[1:] or ["2026-10-15", "2026-10-16", "2026-10-17"]
kill = collections.Counter(); bossT = collections.defaultdict(set); roi = collections.defaultdict(collections.Counter)
ten = {}; nguoi = collections.defaultdict(set); lvl = collections.defaultdict(set)
re_t = re.compile(r"T0=([0-9_:-]+)")
for d in ngay:
    for A in sorted(glob.glob(LOG + "Audit_%s-*.log" % d)):
        for l in open(A, encoding="latin-1"):
            p = l.split(",")
            if l.startswith("MONSTER_KILLED") and len(p) > 3 and p[2].isdigit():
                k, loai = hd_of(int(p[2]))
                if k:
                    kill[(k, loai)] += 1
                    if loai == "boss":
                        m = re_t.search(l); bossT[k].add(m.group(1)[:16] if m else "?")
            elif l.startswith("ITEM_CREATED") and "Dropped by" in l:
                m = re.search(r'Dropped by "[^"]*",(\d+)', l)
                if not m: continue
                k, loai = hd_of(int(m.group(1)))
                if not k: continue
                roi[(k, loai)][p[3]] += int(p[2]); ten[p[3]] = p[4]; nguoi[k].add(p[1])
for k in HD:
    print("=" * 70); print(k, "| giet quai:", kill[(k, "quai")], "| ha boss:", kill[(k, "boss")], "lan", sorted(bossT[k])[-6:], "| nguoi nhan do:", len(nguoi[k]))
    for loai in ("quai", "boss"):
        c = roi[(k, loai)]
        if not c: continue
        print("  roi tu", loai, "(tong %d mon):" % sum(c.values()))
        for it, n in c.most_common(12):
            print("    %-9s %-32s %5d" % (it, ten[it].strip()[:32], n))
