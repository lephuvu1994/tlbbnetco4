# Tim chuoi JINYAN trong Server.elf + cho dung (dia chi) trong dis.txt
import re, struct
P = "/mnt/d/Thiên Long Bát Bộ NetCo4/scratchpad-claude/server-elf/Server.elf"
D = "/mnt/d/Thiên Long Bát Bộ NetCo4/scratchpad-claude/sinhsan/dis.txt"
b = open(P, "rb").read()
phoff = struct.unpack_from("<I", b, 28)[0]; phnum = struct.unpack_from("<H", b, 44)[0]; phsz = struct.unpack_from("<H", b, 42)[0]
seg = []
for i in range(phnum):
    t, off, va, pa, fsz, msz = struct.unpack_from("<IIIIII", b, phoff + i * phsz)
    if t == 1: seg.append((va, off, fsz))
def o2v(o):
    for va, off, fsz in seg:
        if off <= o < off + fsz: return va + o - off
for m in re.finditer(rb"[ -~]*JINYAN[ -~]*", b):
    s = m.group(0); st = m.start()
    v = o2v(st); print(hex(v) if v else None, s[:120])
    if v:
        lines = [l for l in open(D, encoding="latin-1") if ("$0x%x" % v) in l]
        for l in lines[:4]: print("   ", l.rstrip()[:150])
