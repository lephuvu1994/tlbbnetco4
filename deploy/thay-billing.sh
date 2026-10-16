#!/bin/bash
# 16/10: thay billing 2019 (thieu 12 byte cuoi goi tra loi 0xA2/0xA3/0xA6 -> Login lech dong du lieu, treo dang nhap)
# bang billing_go v1.3.5 x32. Chay trong may co game (VPS hoac WSL local) bang root.
#   thay-billing.sh <thu muc chua billing moi>   : sao luu ban cu, chep ban moi, them cau hinh, bat lai rieng billing
#   thay-billing.sh --tra                         : tra ban cu (billing.cu-2019) va bat lai
# Khong dung toi game (Login tu ket noi lai billing). config.json giu nguyen, chi them khoa con thieu (khong in mat khau).
set -e
H=/opt/tlbb-root/home
CG=/sys/fs/cgroup/system.slice/tlbb.service/cgroup.procs

bat_lai() {
    pkill -x billing || true
    for i in $(seq 1 10); do pgrep -x billing >/dev/null || break; sleep 1; done
    pgrep -x billing >/dev/null && pkill -9 -x billing || true
    # bat lai TRONG nhom tlbb.service (systemd van quan ly, xem CLAUDE.md quy tac 5)
    nohup sh -c "echo \$\$ > $CG; exec setsid chroot /opt/tlbb-root /bin/bash -c 'ulimit -n 65535; cd /home && exec ./billing >>/home/billing.log 2>&1'" </dev/null >/dev/null 2>&1 &
    sleep 4
    P=$(pgrep -x billing) || { echo "LOI: billing khong chay, xem $H/billing.log"; exit 1; }
    echo "billing pid=$P md5=$(md5sum $H/billing | cut -c1-12) cgroup=$(cat /proc/$P/cgroup)"
}

if [ "$1" = "--tra" ]; then
    [ -f $H/billing.cu-2019 ] || { echo "khong co $H/billing.cu-2019"; exit 1; }
    cp -p $H/billing.cu-2019 $H/billing.tmp && mv -f $H/billing.tmp $H/billing
    [ -f $H/config.json.cu-2019 ] && cp -p $H/config.json.cu-2019 $H/config.json
    bat_lai; exit 0
fi

MOI="$1/billing"
[ -x "$MOI" ] || { echo "khong thay $MOI"; exit 1; }
file "$MOI" | grep -q "ELF 32-bit" || { echo "$MOI khong phai ELF 32-bit"; exit 1; }
[ -f $H/billing.cu-2019 ] || cp -p $H/billing $H/billing.cu-2019
[ -f $H/config.json.cu-2019 ] || cp -p $H/config.json $H/config.json.cu-2019
python3 - "$H/config.json" <<'PY'
import json, sys
p = sys.argv[1]
d = json.load(open(p))
# ban moi mac dinh pc_max_client_count=3 (3 nick / may), max_client_count=500 -> giu nhu ban cu: khong gioi han
d.setdefault("max_client_count", 0)
d.setdefault("pc_max_client_count", 0)
d.setdefault("point_fix", 0)
d.setdefault("bill_type", 0)
json.dump(d, open(p, "w"), indent=2)
print("config: " + ", ".join(k for k in d if "pass" not in k and "user" not in k))
PY
cp "$MOI" $H/billing.tmp && chmod 755 $H/billing.tmp && mv -f $H/billing.tmp $H/billing
bat_lai
