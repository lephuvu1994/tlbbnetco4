#!/bin/bash
# 21/10: don log game hang ngay (cai bang /etc/cron.d/tlbb-don-log, xem cuoi file).
# Server/Log phinh ~280 MB/ngay (debug ~160 MB) -> truoc khi don co 6.512 file / 5,1 GB.
# Giu: Audit 30 ngay (do ti le roi do: ITEM_CREATED / MONSTER_KILLED), con lai 14 ngay. Chi xoa file, khong dung file dang ghi (moi hon han giu).
# Cai:  cp /opt/tlbb-repo/deploy/don-log.sh /opt/tlbb-deploy/ 2>/dev/null; echo "30 4 * * * root bash /opt/tlbb-repo/deploy/don-log.sh" > /etc/cron.d/tlbb-don-log
set -u
LOG=/opt/tlbb-root/home/tlbb/Server/Log
[ -d "$LOG" ] || exit 0
find "$LOG" -maxdepth 1 -type f -name 'Audit*' -mtime +30 -delete
find "$LOG" -maxdepth 1 -type f ! -name 'Audit*' -mtime +14 -delete
