#!/bin/bash
# 24/10: Dung lai server Y HET luc dong mua 1 tren 1 VPS MOI tu goi sao luu nguyen khoi (khong lay tu git).
# Goi sao luu (chi tren may nha chu server, CO MAT KHAU - khong len git):
#   1-tlbb-root.tar.gz   /opt/tlbb-root: chroot Ubuntu 10.04 32-bit + MySQL 5.0 (DB) + game (engine da va, billing, cau hinh)
#   2-he-thong.tar.gz    /opt/minigame (bot web + .env), /opt/tlbb-repo (repo + deploy/config.env), nginx, SSL, cron, systemd, /root/...
#   3-tlbb-backup.tar.gz /opt/tlbb-backup (khong bat buoc)
# VPS moi: Ubuntu 22.04 x86_64, IP public nam TREN card mang (khong NAT), >= 4GB RAM, >= 25GB trong. Chay bang root:
#   bash khoi-phuc-nguyen-khoi.sh <thu muc chua goi> [--co-backup]
# Script KHONG bat game. Xong thi lam tiep theo huong dan in ra cuoi (doi IP, mo cong, bat dich vu). Chi tiet: docs/MO-LAI.md.
set -euo pipefail
log()  { echo -e "\e[1;32m[+]\e[0m $*"; }
warn() { echo -e "\e[1;33m[!]\e[0m $*"; }
die()  { echo -e "\e[1;31m[x]\e[0m $*"; exit 1; }

G=${1:-}; [ -n "$G" ] && [ -f "$G/1-tlbb-root.tar.gz" ] && [ -f "$G/2-he-thong.tar.gz" ] || die "Dung: $0 <thu muc chua 1-tlbb-root.tar.gz + 2-he-thong.tar.gz> [--co-backup]"
[ "$(id -u)" = 0 ] || die "Chay bang root"
[ "$(uname -m)" = x86_64 ] || die "VPS phai la x86_64"
[ -e /opt/tlbb-root/home/tlbb ] && die "/opt/tlbb-root da co game - khong ghi de. Xoa tay neu that su muon dung lai"
free_gb=$(df -BG --output=avail / | tail -1 | tr -dc 0-9)
[ "$free_gb" -ge 15 ] || die "O dia con ${free_gb}GB, can >= 15GB"

log "Cai goi: nginx certbot rsync ufw curl + Node 20 (bot web) + python3 (panel GM)"
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx certbot python3-certbot-nginx python3 rsync ufw curl ca-certificates
if ! command -v node >/dev/null || [ "$(node -v | cut -c2-3)" != 20 ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null
    DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nodejs
fi

log "Giai nen 1-tlbb-root (~6.4GB, vai phut)"
tar xzpf "$G/1-tlbb-root.tar.gz" -C /
mkdir -p /opt/tlbb-root/proc /opt/tlbb-root/sys /opt/tlbb-root/dev
log "Giai nen 2-he-thong (bo qua fstab / ufw / .ssh cua VPS cu - khac may, ghi de la mat dang nhap)"
tar xzpf "$G/2-he-thong.tar.gz" -C / --anchored --exclude=etc/fstab --exclude=etc/ufw --exclude=root/.ssh --exclude=tmp
if [ "${2:-}" = --co-backup ] && [ -f "$G/3-tlbb-backup.tar.gz" ]; then
    log "Giai nen 3-tlbb-backup"; tar xzpf "$G/3-tlbb-backup.tar.gz" -C /
fi
mkdir -p /opt/tlbb-backup/hang-ngay
ln -sfn /opt/tlbb-repo/deploy /opt/tlbb-deploy

log "Shared memory + swap (giong 00-cai-dat-vps.sh)"
sysctl -q --system
if ! swapon --show | grep -q .; then
    fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
    grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
systemctl daemon-reload
systemctl enable tlbb tlbb-panel minigame nginx >/dev/null 2>&1

IP_CU=$(. /opt/tlbb-repo/deploy/config.env; echo "$PUBLIC_IP")
IP_MOI=$(ip -4 -o addr show scope global | awk '{print $4}' | cut -d/ -f1 | head -1)
log "Xong phan giai nen. IP cu: $IP_CU - IP tren card mang VPS nay: $IP_MOI"
cat <<EOF

=== LAM TIEP (theo docs/MO-LAI.md) ===
1. Doi IP (neu khac):
     sed -i 's/$IP_CU/$IP_MOI/g' /opt/tlbb-repo/deploy/config.env /opt/tlbb-root/home/tlbb/Server/Config/ServerInfo.ini /opt/tlbb-repo/panel/panel.py
   (panel.py: kiem Host + chung chi tu ky cua panel GM 8443)
   + client phat cho nguoi choi: sua danh sach may chu (deploy/client) sang IP moi.
   + DNS netco4.click (+ admin/mod/play...) tro ve IP moi, roi: certbot renew --force-renewal
2. Mo cong (KIEM cong SSH dang dung truoc khi bat ufw, khong thi tu khoa minh ngoai):
     ufw allow 22/tcp; ufw allow 7384/tcp; ufw allow 3731/tcp; ufw allow 80/tcp; ufw allow 443/tcp
     ufw allow from <IP nha> to any port 8443 proto tcp; ufw enable
3. Bat: systemctl start tlbb   (cho ~1 phut)  -> ./tlbb.sh status;  roi systemctl start tlbb-panel minigame; systemctl restart nginx
   MySQL khong len (ban chep luc dang chay bi do dang): nap lai DB tu db-*.sql.gz (docs/MO-LAI.md muc Su co).
4. Mua moi (xoa trang nhan vat + vi web): docs/MO-LAI.md muc Mua moi.
EOF
