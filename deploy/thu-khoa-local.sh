#!/bin/bash
# 16/10: thu khoa tai khoan tren SERVER LOCAL (WSL): gui goi dang nhap 0xA2 thang vao billing 127.0.0.1:12680
# khi chua khoa / khi id_card='1' / sau khi mo lai. Khong in mat khau. Tra id_card ve nhu cu.
set -e
cd /mnt/d/tlbb-local/deploy
. ./common.sh
TK=${1:-phat1}
CU=$(mysql_root "web -N -e \"SELECT IFNULL(id_card,'NULL') FROM account WHERE name='$TK'\"")
PW=$(mysql_root "web -N -e \"SELECT password FROM account WHERE name='$TK'\"")
[ -n "$PW" ] || { echo "khong co tai khoan $TK"; exit 1; }
thu() {
python3 - "$TK" "$PW" <<'PY'
import socket, struct, sys
u, p = sys.argv[1].encode(), sys.argv[2].encode()
ip = b"127.0.0.1"
op = bytes([len(u)]) + u + bytes([len(p)]) + p + bytes([len(ip)]) + ip + b"\x00" * 14 + b"0" * 32
g = b"\xaa\x55" + struct.pack(">H", 3 + len(op)) + b"\xa2" + b"\x00\x07" + op + b"\x55\xaa"
s = socket.create_connection(("127.0.0.1", 12680), timeout=5)
s.sendall(g)
r = s.recv(4096)
s.close()
n = r[7]
print("ket qua dang nhap = %d (1 = thanh cong, 3 = sai mat khau, 7 = bi khoa)" % r[8 + n - 1 + 1])
PY
}
echo "== $TK chua khoa (id_card cu = $CU)"; thu
mysql_root "web -e \"UPDATE account SET id_card='1' WHERE name='$TK'\""
echo "== $TK khoa (id_card='1')"; thu
if [ "$CU" = "NULL" ]; then mysql_root "web -e \"UPDATE account SET id_card=NULL WHERE name='$TK'\""; else mysql_root "web -e \"UPDATE account SET id_card='$CU' WHERE name='$TK'\""; fi
echo "== $TK mo lai"; thu
