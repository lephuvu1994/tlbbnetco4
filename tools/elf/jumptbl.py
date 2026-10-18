#!/usr/bin/env python3
# Doc bang nhay 0x8508fac (LuaFnAwardTitle: o 0..19) trong Server.elf, in dich den cua tung o + ham duoc goi o dich do (tu dis.txt).
import struct, re
P = "/mnt/d/Thiên Long Bát Bộ NetCo4/scratchpad-claude/server-elf/Server.elf"
D = "/mnt/d/Thiên Long Bát Bộ NetCo4/scratchpad-claude/sinhsan/dis.txt"
b = open(P, "rb").read()
phoff = struct.unpack_from("<I", b, 28)[0]; phnum = struct.unpack_from("<H", b, 44)[0]; phsz = struct.unpack_from("<H", b, 42)[0]
seg = []
for i in range(phnum):
    t, off, va, pa, fsz, msz = struct.unpack_from("<IIIIII", b, phoff + i * phsz)
    if t == 1: seg.append((va, off, fsz))
def v2o(v):
    for va, off, fsz in seg:
        if va <= v < va + fsz: return off + v - va
o = v2o(0x8508fac)
dich = [struct.unpack_from("<I", b, o + 4 * k)[0] for k in range(20)]
lines = open(D, encoding="latin-1").read().split("\n")
idx = {}
for i, l in enumerate(lines):
    m = re.match(r"^ ([0-9a-f]{7,8}):", l)
    if m: idx[int(m.group(1), 16)] = i
for k, d in enumerate(dich):
    i = idx.get(d)
    calls = []
    if i is not None:
        for l in lines[i:i + 25]:
            mm = re.search(r"call +[0-9a-f]+ <([^>]+)>", l)
            if mm and "Obj_Human::" in mm.group(1): calls.append(mm.group(1).split("(")[0].replace("Obj_Human::", "")); break
        # tham so hang (push $0x..) truoc call
        pu = [re.search(r"push +\$0x([0-9a-f]+)", l).group(1) for l in lines[i:i + 12] if re.search(r"push +\$0x([0-9a-f]+)", l)]
    print("o %2d -> %x  %s  push=%s" % (k, d, calls, pu[:3] if i is not None else "?"))
