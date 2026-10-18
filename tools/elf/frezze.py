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
L = open(D, encoding="latin-1").read().split("\n")
for m in re.finditer(rb"[ -~]*(Frezze|Freeze|Frozen)[ -~]*", b):
    st = m.start()
    while b[st-1:st] not in (b"\0",): st -= 1
    v = o2v(st); s = b[st:b.index(b"\0", st)]
    print(hex(v), s[:140])
    for i, l in enumerate(L):
        if ("$0x%x" % v) in l:
            print("   use", l.strip()[:60])
