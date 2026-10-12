#!/usr/bin/env python3
# 12/10 (chu server): tat dong "[Giup] Trong thoi gian hoat dong, pham la nguoi choi dang ki moi ... Do Dai Sang[154,171] ... The Tai Phu"
# Cau nay la ma chu #{CFKBZ_20080228_01} (bang chu client), KHONG co trong script / cau hinh nao - nam CUNG trong file chay Server/Server
# (engine tu gui). Script nay thay chuoi do bang byte 0 (chuoi rong), giu nguyen kich thuoc file. Sao luu truoc vao /opt/tlbb-backup.
# File chay KHONG nam trong repo -> cap-nhat.sh khong ghi de. Can RESTART game moi co hieu luc (game dang chay van dung ban cu).
#   python3 tools/tat-giup-thetaiphu.py            (chi kiem tra)
#   python3 tools/tat-giup-thetaiphu.py --ghi      (sao luu + sua)
# Quay lai: cp -p /opt/tlbb-backup/Server-truoc-tat-CFKBZ-<gio> /opt/tlbb-root/home/tlbb/Server/Server  roi restart.
import os, shutil, sys, time

F = "/opt/tlbb-root/home/tlbb/Server/Server"
K = b"#{CFKBZ_20080228_01}"
d = open(F, "rb").read()
n = d.count(K)
if n == 0:
    sys.exit("Khong con chuoi %s - da tat roi?" % K.decode())
if n != 1:
    sys.exit("LOI: thay %d cho, khong sua" % n)
i = d.index(K)
if d[i - 1:i] != b"\x00" or d[i + len(K):i + len(K) + 1] != b"\x00":
    sys.exit("LOI: chuoi khong dung bien (khong co byte 0 hai dau), khong sua")
print("Thay chuoi o offset %d (%d byte), file %d byte" % (i, len(K), len(d)))
if "--ghi" not in sys.argv:
    print("(chi kiem tra - them --ghi de sua)")
    sys.exit(0)
bk = "/opt/tlbb-backup/Server-truoc-tat-CFKBZ-" + time.strftime("%Y%m%d-%H%M%S")
shutil.copy2(F, bk)
moi = d[:i] + b"\x00" * len(K) + d[i + len(K):]
assert len(moi) == len(d)
tmp = F + ".moi"
with open(tmp, "wb") as f:
    f.write(moi)
shutil.copystat(F, tmp)
st = os.stat(F)
os.chown(tmp, st.st_uid, st.st_gid)
os.replace(tmp, F)   # game dang chay giu file cu (inode cu) toi khi restart
print("Da sua. Sao luu: %s. Can RESTART game." % bk)
