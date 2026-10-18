#!/usr/bin/env python3
# Chi doc Audit log: phieu Nguyen Bao 39910001-006 cua cac GUID (mac dinh hoang01-05 = 1010100020-024) den tu dau.
# Theo GUID: tong theo ma phieu; theo nguon (quai "Dropped by" + DataID, hoac ly do khac); theo ngay; gio cao diem;
# so lan giet (MONSTER_KILLED) cung quai de ra % thuc te. Chay: python3 phieu-acc.py [ngay_tu YYYY-MM-DD] [guid ...]
import glob, re, sys, collections
LOG = "/opt/tlbb-root/home/tlbb/Server/Log/"
PH = {"39910001", "39910002", "39910003", "39910004", "39910005", "39910006"}
args = sys.argv[1:]
tu = args.pop(0) if args and re.match(r"\d{4}-\d{2}-\d{2}$", args[0]) else "0000-00-00"
guids = [int(g) for g in args] or list(range(1010100020, 1010100025))
want = {g: g for g in guids}
for g in guids: want["0X%X" % g] = g; want[str(g)] = g
re_t = re.compile(r"T0=(\d+)-(\d+)-(\d+)_(\d+):(\d+)")
tong = collections.defaultdict(collections.Counter); nguon = collections.defaultdict(collections.Counter)
ngay = collections.defaultdict(collections.Counter); gio = collections.defaultdict(collections.Counter)
giet = collections.defaultdict(collections.Counter); ten = {}
def gid(s):
    return want.get(s.strip().upper())
for A in sorted(glob.glob(LOG + "Audit_*.log")):
    d = A.rsplit("Audit_", 1)[1][:10]
    if d < tu: continue
    for l in open(A, encoding="latin-1"):
        if not (l.startswith("ITEM_CREATED") or l.startswith("MONSTER_KILLED")): continue
        p = l.split(","); g = gid(p[1]) if len(p) > 3 else None
        if g is None: continue
        if l.startswith("MONSTER_KILLED"):
            giet[g][p[2]] += 1; ten.setdefault(p[2], p[3].strip()); continue
        if p[3] not in PH: continue
        n = int(p[2]) if p[2].isdigit() else 1
        dm = re.search(r'Dropped by "([^"]*)",(\d+)', l)
        if dm: k = "quai " + dm.group(2); ten.setdefault(dm.group(2), dm.group(1).strip())
        else: k = "khac: " + ",".join(x.strip() for x in p[5:7])[:60]
        tong[g][p[3]] += n; nguon[g][k] += n; ngay[g][d] += n
        m = re_t.search(l)
        if m: gio[g][m.group(4)] += n
for g in guids:
    print("=" * 70); print("GUID %d (0X%X)  tong phieu: %s" % (g, g, dict(tong[g]) or 0))
    if not tong[g]: continue
    print(" theo ngay:", " ".join("%s:%d" % (k[5:], v) for k, v in sorted(ngay[g].items())))
    print(" gio nhieu nhat:", " ".join("%sh:%d" % kv for kv in gio[g].most_common(6)))
    print(" nguon:")
    for k, v in nguon[g].most_common(12):
        if k.startswith("quai "):
            q = k[5:]; kk = giet[g][q]
            print("   %5d  %s %-22s giet %6d  %s" % (v, q, ten.get(q, "?"), kk, ("%.2f%%" % (100.0 * v / kk)) if kk else "-"))
        else:
            print("   %5d  %s" % (v, k))
