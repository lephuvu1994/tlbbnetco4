#!/usr/bin/env python3
# Va binary Server (21/10/2026): "Giam khang <he> den am X" dung nhu tooltip.
# Combat_Module::CombatCore_T::{Cold,Fire,Light,Poison}Damage goc: R = khang muc tieu (+bu ky nang, chan +-4096); R < 0 -> dung R;
# R >= 0 -> R - giam khang (ResistOther nguoi danh), chan 0..100 -> "den am" khong bao gio co tac dung khi giam khang > khang.
# Ban moi (viet lai ca ham, 207/244 byte, phan tinh so thuc giu nguyen byte goc):
#   R2 = R - giam khang (giam khang < 0 -> 0), R2 > 100 -> 100
#   R2 < 0: neu nguoi danh la nguoi choi (GetObjType() == 1, vtable +0x8) -> X = Obj_Human::GetMissionData(502/503/504/505)
#           (0x081050c4; ShuaXinClient ghi lvshux1 = Long Van + dong Bao Vo Hon), chan 0..100 -> R2 = max(R2, -X); khac -> R2 = 0
#   R < 0 va R < R2 -> R2 = R (giu hanh vi goc cho muc tieu khang am)
#   sat thuong he = cong x (100 - R2) / 100 (nhu goc). Quai / pet danh: X = 0 -> y het goc.
# Da chay thu bang chuong trinh 32-bit nap ham o dung dia chi (11 ca, vd khang 588, giam khang 952, X 36 -> 1360 / goc 1000).
# Ma nguon (as --32; ld -Ttext=<dia chi ham>; thay ATK/RES/IGN/MD theo he):
#   .text
#   .globl _start
#   _start:
#     push %ebp
#     mov %esp,%ebp
#     push %edi
#     push %esi
#     push %ebx
#     sub $0x18,%esp
#     mov 0xc(%ebp),%esi
#     mov 0x10(%ebp),%edi
#     mov (%esi),%eax
#     push %esi
#     call *ATK(%eax)
#     add 0x14(%ebp),%eax
#     jns 1f
#     xor %eax,%eax
#   1: mov %eax,-0x10(%ebp)
#     mov (%edi),%eax
#     push %edi
#     call *RES(%eax)
#     add 0x18(%ebp),%eax
#     cmp $-4096,%eax
#     jge 2f
#     mov $-4096,%eax
#   2: cmp $4096,%eax
#     jle 3f
#     mov $4096,%eax
#   3: mov %eax,-0x14(%ebp)
#     mov %eax,%ebx
#     mov (%esi),%eax
#     push %esi
#     call *IGN(%eax)
#     test %eax,%eax
#     jns 4f
#     xor %eax,%eax
#   4: sub %eax,%ebx
#     cmp $100,%ebx
#     jle 5f
#     mov $100,%ebx
#   5: test %ebx,%ebx
#     jns Lchk
#     mov (%esi),%eax
#     push %esi
#     call *0x8(%eax)
#     cmp $1,%eax
#     jne Lzero
#     push $MD
#     push %esi
#     call 0x081050c4
#     test %eax,%eax
#     jle Lzero
#     cmp $100,%eax
#     jle 6f
#     mov $100,%eax
#   6: neg %eax
#     cmp %eax,%ebx
#     jge Lchk
#     mov %eax,%ebx
#     jmp Lchk
#   Lzero: xor %ebx,%ebx
#   Lchk: mov -0x14(%ebp),%eax
#     cmp %ebx,%eax
#     jge Ldone
#     mov %eax,%ebx
#   Ldone: mov %ebx,%edx
#     flds 0x845afe4
#     fld %st(0)
#     push %edx
#     fisubl (%esp)
#     fimull -0x10(%ebp)
#     .byte 0xde,0xf9
#     fldz
#     fucom %st(1)
#     fnstsw %ax
#     test $0x45,%ah
#     jne Lpos
#     fstp %st(1)
#     jmp Lret
#   Lpos: fstp %st(0)
#   Lret: lea -0xc(%ebp),%esp
#     pop %ebx
#     pop %esi
#     pop %edi
#     leave
#     ret
#
# Dung:  python3 va-den-am.py <Server hien tai> <file ra>   (vao phai la ban da va tu-di-theo + Tai Phu, md5 996f8758...)
# Quay lai: giu ban truoc (vd Server.truoc-denam) roi chep de lai + restart.
import hashlib, sys

MD5_VAO = "996f8758ffaaebeddf113de424e562c3"
VADDR_TEXT, OFF_TEXT = 0x08048000, 0x0
HAM = [  # ten, dia chi, (ATK, RES, IGN vtable), MD, byte goc, byte moi
    ("Cold", 0x083c0488, (0x310, 0x31c, 0x328), 502,
     "5589e557565383ec188b750c8b06568b5d148b7d10ff901003000083c41001d88945f00f88bf00000083ec0c8b0757ff901c03000089c3035d1883c41081fb00f0ffff7d5bbb00f0ffff83ec0c8b0656ff902803000083c41085c078633d001000007f6831d285db785e29c383fb647e6fba64000000d905e4af4508d9c052da2424da4df0def1d9eedde1dfe083c404f6c445753fddd98d65f45b5e5fc9c39081fb001000007ea283ec0c8b0656ff902803000083c41085c0bb00100000799d31c031d285db79a289daebaab800100000eb9190ddd88d65f45b5e5fc9c389f685db789289daeb8ec745f000000000e935ffffff",
     "5589e557565383ec188b750c8b7d108b0656ff9010030000034514790231c08945f08b0757ff901c0300000345183d00f0ffff7d05b800f0ffff3d001000007e05b8001000008945ec89c38b0656ff902803000085c0790231c029c383fb647e05bb6400000085db79308b0656ff500883f801752368f601000056e8bc4bd4ff85c07e1483f8647e05b864000000f7d839c37d0689c3eb0231db8b45ec39d87d0289c389dad905e4af4508d9c052da2424da4df0def1d9eedde1dfe0f6c4457504ddd9eb02ddd88d65f45b5e5fc9c390909090909090909090909090909090909090909090909090909090909090909090909090"),
    ("Fire", 0x083c057c, (0x334, 0x340, 0x34c), 503,
     "5589e557565383ec188b750c8b06568b5d148b7d10ff903403000083c41001d88945f00f88bf00000083ec0c8b0757ff904003000089c3035d1883c41081fb00f0ffff7d5bbb00f0ffff83ec0c8b0656ff904c03000083c41085c078633d001000007f6831d285db785e29c383fb647e6fba64000000d905e4af4508d9c052da2424da4df0def1d9eedde1dfe083c404f6c445753fddd98d65f45b5e5fc9c39081fb001000007ea283ec0c8b0656ff904c03000083c41085c0bb00100000799d31c031d285db79a289daebaab800100000eb9190ddd88d65f45b5e5fc9c389f685db789289daeb8ec745f000000000e935ffffff",
     "5589e557565383ec188b750c8b7d108b0656ff9034030000034514790231c08945f08b0757ff90400300000345183d00f0ffff7d05b800f0ffff3d001000007e05b8001000008945ec89c38b0656ff904c03000085c0790231c029c383fb647e05bb6400000085db79308b0656ff500883f801752368f701000056e8c84ad4ff85c07e1483f8647e05b864000000f7d839c37d0689c3eb0231db8b45ec39d87d0289c389dad905e4af4508d9c052da2424da4df0def1d9eedde1dfe0f6c4457504ddd9eb02ddd88d65f45b5e5fc9c390909090909090909090909090909090909090909090909090909090909090909090909090"),
    ("Light", 0x083c0670, (0x358, 0x364, 0x370), 504,
     "5589e557565383ec188b750c8b06568b5d148b7d10ff905803000083c41001d88945f00f88bf00000083ec0c8b0757ff906403000089c3035d1883c41081fb00f0ffff7d5bbb00f0ffff83ec0c8b0656ff907003000083c41085c078633d001000007f6831d285db785e29c383fb647e6fba64000000d905e4af4508d9c052da2424da4df0def1d9eedde1dfe083c404f6c445753fddd98d65f45b5e5fc9c39081fb001000007ea283ec0c8b0656ff907003000083c41085c0bb00100000799d31c031d285db79a289daebaab800100000eb9190ddd88d65f45b5e5fc9c389f685db789289daeb8ec745f000000000e935ffffff",
     "5589e557565383ec188b750c8b7d108b0656ff9058030000034514790231c08945f08b0757ff90640300000345183d00f0ffff7d05b800f0ffff3d001000007e05b8001000008945ec89c38b0656ff907003000085c0790231c029c383fb647e05bb6400000085db79308b0656ff500883f801752368f801000056e8d449d4ff85c07e1483f8647e05b864000000f7d839c37d0689c3eb0231db8b45ec39d87d0289c389dad905e4af4508d9c052da2424da4df0def1d9eedde1dfe0f6c4457504ddd9eb02ddd88d65f45b5e5fc9c390909090909090909090909090909090909090909090909090909090909090909090909090"),
    ("Poison", 0x083c0764, (0x37c, 0x388, 0x394), 505,
     "5589e557565383ec188b750c8b06568b5d148b7d10ff907c03000083c41001d88945f00f88bf00000083ec0c8b0757ff908803000089c3035d1883c41081fb00f0ffff7d5bbb00f0ffff83ec0c8b0656ff909403000083c41085c078633d001000007f6831d285db785e29c383fb647e6fba64000000d905e4af4508d9c052da2424da4df0def1d9eedde1dfe083c404f6c445753fddd98d65f45b5e5fc9c39081fb001000007ea283ec0c8b0656ff909403000083c41085c0bb00100000799d31c031d285db79a289daebaab800100000eb9190ddd88d65f45b5e5fc9c389f685db789289daeb8ec745f000000000e935ffffff",
     "5589e557565383ec188b750c8b7d108b0656ff907c030000034514790231c08945f08b0757ff90880300000345183d00f0ffff7d05b800f0ffff3d001000007e05b8001000008945ec89c38b0656ff909403000085c0790231c029c383fb647e05bb6400000085db79308b0656ff500883f801752368f901000056e8e048d4ff85c07e1483f8647e05b864000000f7d839c37d0689c3eb0231db8b45ec39d87d0289c389dad905e4af4508d9c052da2424da4df0def1d9eedde1dfe0f6c4457504ddd9eb02ddd88d65f45b5e5fc9c390909090909090909090909090909090909090909090909090909090909090909090909090"),
]

vao, ra = sys.argv[1], sys.argv[2]
data = bytearray(open(vao, "rb").read())
md5 = hashlib.md5(data).hexdigest()
if md5 != MD5_VAO:
    sys.exit("md5 file vao %s khac %s -> DUNG" % (md5, MD5_VAO))
for ten, a, _, _, goc, moi in HAM:
    goc, moi = bytes.fromhex(goc), bytes.fromhex(moi)
    assert len(goc) == len(moi) == 0xf4
    off = a - VADDR_TEXT + OFF_TEXT
    if bytes(data[off:off + len(goc)]) != goc:
        sys.exit("byte goc %s tai 0x%x khong khop -> DUNG" % (ten, a))
    data[off:off + len(moi)] = moi
    print("va", ten, hex(a))
open(ra, "wb").write(data)
print("md5 ra", hashlib.md5(data).hexdigest())
