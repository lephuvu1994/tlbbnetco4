#!/usr/bin/env python3
# Chi doc: phieu 39910001 rot qua script o cac ban do, tu 03:10 17/10 (moc ha 1%) den 17:16 (nang 4%). Theo loai quai (DataID):
# so lan giet (MONSTER_KILLED), so phieu, so GUID, khoang thoi gian -> % thuc te va toc do giet / gio.
import glob, re, collections
LOG = "/opt/tlbb-root/home/tlbb/Server/Log/"
re_t = re.compile(r"T0=(\d+)-(\d+)-(\d+)_(\d+):(\d+):(\d+)")
kill = collections.Counter(); roi = collections.Counter(); ten = {}; tg = collections.defaultdict(list)
for A in sorted(glob.glob(LOG + "Audit_2026-10-17-*.log")):
    for l in open(A, encoding="latin-1"):
        m = re_t.search(l)
        if not m: continue
        ph = int(m.group(4)) * 60 + int(m.group(5))
        if ph < 3 * 60 + 11 or ph >= 17 * 60 + 16: continue
        p = l.split(",")
        if l.startswith("MONSTER_KILLED"):
            kill[p[2]] += 1; ten[p[2]] = p[3]; tg[p[2]].append(ph)
        elif l.startswith("ITEM_CREATED") and ",39910001," in l and "Dropped by" in l:
            dm = re.search(r'Dropped by "([^"]*)",(\d+)', l)
            if dm: roi[dm.group(2)] += int(p[2]); ten.setdefault(dm.group(2), dm.group(1))
for q in sorted(set(roi) | {k for k in kill if k in roi}, key=lambda k: -kill[k]):
    k = kill[q]; t = tg[q]
    phut = (max(t) - min(t)) if t else 0
    print("%s %-24s giet %5d | phieu %3d | %.2f%% | %s-%s" % (q, ten.get(q, "?").strip(), k, roi[q], 100.0 * roi[q] / k if k else 0,
          "%02d:%02d" % divmod(min(t), 60) if t else "-", "%02d:%02d" % divmod(max(t), 60) if t else "-"))
