import struct, sys
P = "/mnt/d/Thiên Long Bát Bộ NetCo4/scratchpad-claude/server-elf/Server.elf"
b = open(P, "rb").read()
phoff = struct.unpack_from("<I", b, 28)[0]; phnum = struct.unpack_from("<H", b, 44)[0]; phsz = struct.unpack_from("<H", b, 42)[0]
seg = []
for i in range(phnum):
    t, off, va, pa, fsz, msz = struct.unpack_from("<IIIIII", b, phoff + i * phsz)
    if t == 1: seg.append((va, off, fsz))
def v2o(v):
    for va, off, fsz in seg:
        if va <= v < va + fsz: return off + v - va
for a in sys.argv[1:]:
    o = v2o(int(a, 16)); print(a, b[o:b.index(b"\0", o)])
