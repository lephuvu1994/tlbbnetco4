#!/bin/bash
# Khoi phuc 1 nhan vat da bi xoa tu ban sao luu mysqldump (.sql.gz) vao DB dang chay, gan vao tai khoan chi dinh.
# Lay: nhan vat, do, pet, chieu, tam phap, ky nang song, buff... KHONG lay: bang, thu, ban be, quan hang ca nhan.
# 12/10: bia1 (Tieu Dao 119, GUID 1010100008) tu truoc-moserver-20261004-111211.sql.gz -> tai khoan admin.
# Ma do/pet cua nhan vat cu nho hon bo dem hien tai (t_itemkey) nen khong trung voi do sinh ra sau nay.
#   ./khoiphuc-nhanvat.sh <file.sql.gz> <charguid> <tai_khoan> --thu   chay thu tren BAN SAO (tlbbdb_thu), game van chay
#   ./khoiphuc-nhanvat.sh <file.sql.gz> <charguid> <tai_khoan>         chay that: game phai TAT (systemctl stop tlbb).
#                                                                       Tu sao luu DB truoc khi ghi. Hoi go KHOIPHUC.
set -euo pipefail
. "$(dirname "$0")/common.sh"
need_root

[ $# -ge 3 ] || die "Dung: $0 <file.sql.gz> <charguid> <tai_khoan> [--thu]"
BK=$1; G=$2; ACC=$3; THU=0; [ "${4:-}" = --thu ] && THU=1
[ -s "$BK" ] || die "Khong thay file $BK"
[[ "$G" =~ ^[0-9]+$ ]] || die "charguid phai la so"
[[ "$ACC" =~ ^[A-Za-z0-9_]+$ ]] || die "Ten tai khoan sai"

sql() { mysql_root "-N -B -e \"$1\""; }

TMP="$ROOT/tmp/khoiphuc-nv-$$.sql"          # nam trong chroot de mysql cu doc duoc
trap 'rm -f "$TMP"' EXIT
python3 "$DEPLOY_DIR/khoiphuc-nhanvat.py" "$BK" "$G" "$ACC" > "$TMP" 2> "$TMP.log" || { cat "$TMP.log"; rm -f "$TMP.log"; die "Doc ban sao luu that bai"; }
grep -v '^BANG: ' "$TMP.log"
BANG=$(sed -n 's/^BANG: //p' "$TMP.log"); rm -f "$TMP.log"

kiem_truoc() {   # $1 = DB game
    local t n
    [ "$(sql "SELECT COUNT(*) FROM web.account WHERE name='$ACC'")" = 1 ] || die "Chua co tai khoan $ACC. Tao truoc: ./tao-account.sh $ACC <mat khau>"
    for t in $BANG; do
        n=$(sql "SELECT COUNT(*) FROM $1.$t WHERE charguid=$G")
        [ "$n" = 0 ] || die "$1.$t da co $n dong cua $G - nhan vat dang ton tai, KHONG ghi"
    done
}

dem() {   # $1 = DB game
    local t
    log "Sau khi nap ($1):"
    for t in $BANG; do printf '   %-14s %s\n' "$t" "$(sql "SELECT COUNT(*) FROM $1.$t WHERE charguid=$G")"; done
    printf '   %-14s %s\n' "tai khoan" "$(sql "SELECT accname FROM $1.t_char WHERE charguid=$G")"
}

if [ "$THU" = 1 ]; then
    is_running mysqld || die "MySQL chua chay (che do --thu dung MySQL dang chay)"
    log "CHAY THU tren ban sao. Game KHONG bi tat, DB that KHONG bi dong."
    sql "DROP DATABASE IF EXISTS tlbbdb_thu"; sql "CREATE DATABASE tlbbdb_thu"
    in_chroot "$MYSQL_BIN/mysqldump -uroot -p'$MYSQL_ROOT_PASS' --single-transaction tlbbdb | $MYSQL_BIN/mysql -uroot -p'$MYSQL_ROOT_PASS' tlbbdb_thu"
    kiem_truoc tlbbdb_thu
    mysql_root "tlbbdb_thu < /tmp/$(basename "$TMP")"
    dem tlbbdb_thu
    sql "DROP DATABASE tlbbdb_thu"
    log "Da xoa ban sao. Chay that: systemctl stop tlbb && $0 $BK $G $ACC && systemctl start tlbb"
    exit 0
fi

is_running ShareMemory && die "Server dang chay. Tat truoc: systemctl stop tlbb"
is_running Server && die "Server dang chay. Tat truoc: systemctl stop tlbb"
is_running mysqld && die "MySQL van chay ngoai tlbb.service. Kiem tra: systemctl status tlbb"
echo "Se nap nhan vat $G vao tai khoan $ACC (DB that)."
read -r -p "Go KHOIPHUC de xac nhan: " x; [ "$x" = KHOIPHUC ] || die "Da huy"

mount_chroot
trap 'rm -f "$TMP"; umount_chroot' EXIT
spawn_chroot "$MYSQL_BIN/mysqld_safe --user=root"
wait_mysql "-uroot -p'$MYSQL_ROOT_PASS'" || die "MySQL khong len"

kiem_truoc tlbbdb
f="$BACKUP_DIR/truoc-khoiphuc-$G-$(date +%Y%m%d-%H%M%S).sql.gz"
in_chroot "$MYSQL_BIN/mysqldump -uroot -p'$MYSQL_ROOT_PASS' --routines --databases tlbbdb web" | gzip > "$f"
[ -s "$f" ] || die "Sao luu that bai, KHONG ghi gi"
log "Da sao luu: $f"

mysql_root "tlbbdb < /tmp/$(basename "$TMP")"
dem tlbbdb

in_chroot "$MYSQL_BIN/mysqladmin -uroot -p'$MYSQL_ROOT_PASS' shutdown"
for i in $(seq 1 30); do is_running mysqld || break; sleep 1; done
log "Xong. Bat game: systemctl start tlbb"
