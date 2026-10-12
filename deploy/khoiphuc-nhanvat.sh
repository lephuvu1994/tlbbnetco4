#!/bin/bash
# Khoi phuc nhan vat da bi xoa tu ban sao luu mysqldump (.sql.gz) vao DB dang chay, moi nhan vat gan vao 1 tai khoan chi dinh.
# Lay: nhan vat, do, pet, chieu, tam phap, ky nang song, buff... KHONG lay: bang, thu, ban be, quan hang ca nhan.
# Nhieu nhan vat 1 lan (chi tat game 1 lan). Moi tai khoan chi online duoc 1 nhan vat 1 luc -> treo auto thi moi nhan vat 1 tai khoan.
# 12/10: bia1 (1010100008) -> admin; Hoang (1010100004) -> admin1; cuocdoibuon (1010100003) -> admin2, tu truoc-moserver-20261004-111211.sql.gz.
# Ma do/pet cua nhan vat cu nho hon bo dem hien tai (t_itemkey) nen khong trung voi do sinh ra sau nay.
#   ./khoiphuc-nhanvat.sh <file.sql.gz> <charguid>:<tai_khoan> [<charguid>:<tai_khoan> ...] --thu
#        chay thu tren BAN SAO (tlbbdb_thu), game van chay; tai khoan chua tao chi canh bao
#   ./khoiphuc-nhanvat.sh <file.sql.gz> <charguid>:<tai_khoan> [...]
#        chay that: tai khoan phai co san (./tao-account.sh <ten> <mat khau>), game phai TAT (systemctl stop tlbb).
#        Tu sao luu DB truoc khi ghi. Hoi go KHOIPHUC.
#   Them:  --knb N            dat KNB (t_char.yuanbao) = N cho moi nhan vat duoc nap
#          --knb-tk a,b,...   cung dat KNB = N cho moi nhan vat DA CO cua cac tai khoan nay (vd bia1 cua admin) - game phai tat
set -euo pipefail
. "$(dirname "$0")/common.sh"
need_root

[ $# -ge 2 ] || die "Dung: $0 <file.sql.gz> <charguid>:<tai_khoan> [...] [--knb N] [--knb-tk tk1,tk2] [--thu]"
BK=$1; shift
THU=0; CAP=(); KNB=""; KNB_TK=""
while [ $# -gt 0 ]; do
    case "$1" in
        --thu) THU=1 ;;
        --knb) KNB=${2:-}; shift; [[ "$KNB" =~ ^[0-9]+$ ]] || die "--knb can so" ;;
        --knb-tk) KNB_TK=${2:-}; shift; [[ "$KNB_TK" =~ ^[A-Za-z0-9_]+(,[A-Za-z0-9_]+)*$ ]] || die "--knb-tk can ten tai khoan, cach nhau dau phay" ;;
        *) [[ "$1" =~ ^[0-9]+:[A-Za-z0-9_]+$ ]] || die "Sai dang '$1' (can <charguid>:<tai_khoan>)"; CAP+=("$1") ;;
    esac
    shift
done
[ -z "$KNB_TK" ] || [ -n "$KNB" ] || die "--knb-tk can kem --knb N"
TK_IN="'${KNB_TK//,/\',\'}'"
[ ${#CAP[@]} -ge 1 ] || die "Chua chon nhan vat nao"
[ -s "$BK" ] || die "Khong thay file $BK"

sql() { mysql_root "-N -B -e \"$1\""; }

TMP="$ROOT/tmp/khoiphuc-nv-$$.sql"          # nam trong chroot de mysql cu doc duoc
trap 'rm -f "$TMP" "$TMP.log"' EXIT
: > "$TMP"
declare -A BANG
for c in "${CAP[@]}"; do
    G=${c%%:*}; ACC=${c#*:}
    python3 "$DEPLOY_DIR/khoiphuc-nhanvat.py" "$BK" "$G" "$ACC" $KNB >> "$TMP" 2> "$TMP.log" || { cat "$TMP.log"; die "Doc ban sao luu that bai ($G)"; }
    grep -v '^BANG: ' "$TMP.log"
    BANG[$G]=$(sed -n 's/^BANG: //p' "$TMP.log")
done

kiem_truoc() {   # $1 = DB game, $2 = 1 neu thieu tai khoan thi dung
    local c G ACC t n
    for c in "${CAP[@]}"; do
        G=${c%%:*}; ACC=${c#*:}
        if [ "$(sql "SELECT COUNT(*) FROM web.account WHERE name='$ACC'")" != 1 ]; then
            [ "$2" = 1 ] && die "Chua co tai khoan $ACC. Tao truoc (game dang chay): ./tao-account.sh $ACC <mat khau>"
            warn "Chua co tai khoan $ACC - nho tao truoc khi chay that"
        fi
        n=$(sql "SELECT COUNT(*) FROM $1.t_char WHERE accname='$ACC'")
        [ "$n" -lt 3 ] || die "Tai khoan $ACC da du 3 nhan vat"
        for t in ${BANG[$G]}; do
            n=$(sql "SELECT COUNT(*) FROM $1.$t WHERE charguid=$G")
            [ "$n" = 0 ] || die "$1.$t da co $n dong cua $G - nhan vat dang ton tai, KHONG ghi"
        done
    done
}

dem() {   # $1 = DB game
    local c G t
    for c in "${CAP[@]}"; do
        G=${c%%:*}
        log "Sau khi nap $G ($1): $(sql "SELECT CONCAT('tai khoan ',accname,', KNB ',yuanbao) FROM $1.t_char WHERE charguid=$G")"
        for t in ${BANG[$G]}; do printf '   %-14s %s\n' "$t" "$(sql "SELECT COUNT(*) FROM $1.$t WHERE charguid=$G")"; done
    done
}

knb_co_san() {   # $1 = DB game: dat KNB cho nhan vat da co cua --knb-tk
    [ -n "$KNB_TK" ] || return 0
    sql "UPDATE $1.t_char SET yuanbao=$KNB WHERE accname IN ($TK_IN)"
    log "KNB nhan vat co san ($KNB_TK):"
    sql "SELECT charguid, accname, yuanbao FROM $1.t_char WHERE accname IN ($TK_IN)" | sed 's/^/   /'
}

if [ "$THU" = 1 ]; then
    is_running mysqld || die "MySQL chua chay (che do --thu dung MySQL dang chay)"
    log "CHAY THU tren ban sao. Game KHONG bi tat, DB that KHONG bi dong."
    sql "DROP DATABASE IF EXISTS tlbbdb_thu"; sql "CREATE DATABASE tlbbdb_thu"
    in_chroot "$MYSQL_BIN/mysqldump -uroot -p'$MYSQL_ROOT_PASS' --single-transaction tlbbdb | $MYSQL_BIN/mysql -uroot -p'$MYSQL_ROOT_PASS' tlbbdb_thu"
    kiem_truoc tlbbdb_thu 0
    mysql_root "tlbbdb_thu < /tmp/$(basename "$TMP")"
    dem tlbbdb_thu
    knb_co_san tlbbdb_thu
    sql "DROP DATABASE tlbbdb_thu"
    log "Da xoa ban sao. Chay that: bo --thu, game phai tat (systemctl stop tlbb)"
    exit 0
fi

is_running ShareMemory && die "Server dang chay. Tat truoc: systemctl stop tlbb"
is_running Server && die "Server dang chay. Tat truoc: systemctl stop tlbb"
is_running mysqld && die "MySQL van chay ngoai tlbb.service. Kiem tra: systemctl status tlbb"
echo "Se nap vao DB that: ${CAP[*]}"
read -r -p "Go KHOIPHUC de xac nhan: " x; [ "$x" = KHOIPHUC ] || die "Da huy"

mount_chroot
trap 'rm -f "$TMP" "$TMP.log"; umount_chroot' EXIT
spawn_chroot "$MYSQL_BIN/mysqld_safe --user=root"
wait_mysql "-uroot -p'$MYSQL_ROOT_PASS'" || die "MySQL khong len"

kiem_truoc tlbbdb 1
f="$BACKUP_DIR/truoc-khoiphuc-$(date +%Y%m%d-%H%M%S).sql.gz"
in_chroot "$MYSQL_BIN/mysqldump -uroot -p'$MYSQL_ROOT_PASS' --routines --databases tlbbdb web" | gzip > "$f"
[ -s "$f" ] || die "Sao luu that bai, KHONG ghi gi"
log "Da sao luu: $f"

mysql_root "tlbbdb < /tmp/$(basename "$TMP")"
dem tlbbdb
knb_co_san tlbbdb

in_chroot "$MYSQL_BIN/mysqladmin -uroot -p'$MYSQL_ROOT_PASS' shutdown"
for i in $(seq 1 30); do is_running mysqld || break; sleep 1; done
log "Xong. Bat game: systemctl start tlbb"
