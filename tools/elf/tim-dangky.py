#!/usr/bin/env python3
# Tim ten dang ky Lua cua 1 ham C++ trong Server.elf: tim cac cho chua dia chi ham (LE 4 byte), doc 4 byte ngay truoc
# (con tro chuoi ten trong bang {ten, ham}) roi in chuoi do. ELF 32-bit, doi dia chi ao -> offset file qua program header.
import struct, sys, subprocess
P = "/mnt/d/Thiên Long Bát Bộ NetCo4/scratchpad-claude/server-elf/Server.elf"
b = open(P, "rb").read()
phoff = struct.unpack_from("<I", b, 28)[0]; phnum = struct.unpack_from("<H", b, 44)[0]; phsz = struct.unpack_from("<H", b, 42)[0]
seg = []
for i in range(phnum):
    t, off, va, pa, fsz, msz = struct.unpack_from("<IIIIII", b, phoff + i * phsz)
    if t == 1:
        seg.append((va, off, fsz))
def v2o(v):
    for va, off, fsz in seg:
        if va <= v < va + fsz:
            return off + v - va
    return None
def cstr(v):
    o = v2o(v)
    if o is None: return None
    e = b.index(b"\0", o)
    return b[o:e].decode("latin-1")
for ten in sys.argv[1:]:
    out = subprocess.run(["bash", "-c", "grep -m1 -E '^[0-9a-f]+ <LuaFnTbl::%s\\(' '/mnt/d/Thiên Long Bát Bộ NetCo4/scratchpad-claude/sinhsan/dis.txt'" % ten], capture_output=True, text=True).stdout
    if not out:
        print(ten, ": khong thay trong dis.txt"); continue
    addr = int(out.split()[0], 16)
    pat = struct.pack("<I", addr)
    i = b.find(pat); kq = []
    while i >= 0:
        for lui in (4, -4):
            j = i - lui
            if 0 <= j < len(b) - 4:
                s = cstr(struct.unpack_from("<I", b, j)[0])
                if s and 3 <= len(s) < 60 and s.replace("_", "").isalnum():
                    kq.append(s)
        i = b.find(pat, i + 1)
    print(ten, hex(addr), "-> ten dang ky:", sorted(set(kq)) or "KHONG CO trong bang dang ky")
