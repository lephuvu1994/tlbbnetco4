#!/bin/bash
# Go "dong bang tu dong" cua engine cho nhan vat (17/10).
# Engine (Obj_Human::DetectorLogic) dem so lan TANG tien / KNB; vuot FreezePer10M / FreezePerHour (ConfigInfo.ini [Human])
# -> CannotSay(433000000): ghi co JINYAN vao settings nhan vat (byte 0x141-0x144, int LE; > 369999999 = bi khoa).
# Moi lan vao game client hien "do su dung nhung chuong trinh bi cam..." roi thoat. Log: Server/Log/Waigua_*.log "Auto-Frezze".
#   ./go-dong-bang.sh --ds            liet ke nhan vat dang bi dong bang (chay duoc ca khi game dang bat, chi doc)
#   ./go-dong-bang.sh <ten nv|GUID>   go dong bang. Game phai TAT (ShareMemory giu du lieu nhan vat trong RAM):
#                                     systemctl stop tlbb && ./go-dong-bang.sh KimJongUn && systemctl start tlbb
set -euo pipefail
. "$(dirname "$0")/common.sh"
need_root
# settings luu dang chuoi hex (2 ky tu / byte): byte 0x141 = vi tri SQL 643, 4 byte = 8 ky tu (643-650)
V="CONV(CONCAT(SUBSTRING(settings,649,2),SUBSTRING(settings,647,2),SUBSTRING(settings,645,2),SUBSTRING(settings,643,2)),16,10)"

if [ "${1:-}" = --ds ]; then
    is_running mysqld || die "MySQL dang tat"
    mysql_root "tlbbdb -e \"SELECT charguid, charname, accname, $V AS co FROM t_char WHERE isvalid=1 AND $V > 369999999\"" | iconv -f VISCII -t UTF-8
    exit 0
fi
[ -n "${1:-}" ] || die "Cach dung: $0 --ds | <ten nv|GUID>"
is_running ShareMemory && die "Game dang chay. Tat truoc: systemctl stop tlbb"

mount_chroot
trap umount_chroot EXIT
TU_BAT=0
if ! is_running mysqld; then
    spawn_chroot "$MYSQL_BIN/mysqld_safe --user=root"; TU_BAT=1
    wait_mysql "-uroot -p'$MYSQL_ROOT_PASS'" || die "MySQL khong len"
fi
sql() { mysql_root "-N -B -e \"$1\""; }

case "$1" in
    *[!0-9]*) W="charname='$1'" ;;
    *)        W="charguid=$1" ;;
esac
n=$(sql "SELECT COUNT(*) FROM tlbbdb.t_char WHERE isvalid=1 AND $W")
[ "$n" = 1 ] || die "Tim thay $n nhan vat ($W)"
cu=$(sql "SELECT $V FROM tlbbdb.t_char WHERE isvalid=1 AND $W")
log "Co hien tai: $cu (> 369999999 = dang bi dong bang)"
f="$BACKUP_DIR/go-dong-bang-$(date +%Y%m%d-%H%M%S).txt"
sql "SELECT charguid, settings FROM tlbbdb.t_char WHERE isvalid=1 AND $W" > "$f"
log "Sao luu settings: $f"
sql "UPDATE tlbbdb.t_char SET settings = CONCAT(SUBSTRING(settings,1,642), '00000000', SUBSTRING(settings,651)) WHERE isvalid=1 AND $W"
log "Co sau khi go: $(sql "SELECT $V FROM tlbbdb.t_char WHERE isvalid=1 AND $W")"

if [ "$TU_BAT" = 1 ]; then
    in_chroot "$MYSQL_BIN/mysqladmin -uroot -p'$MYSQL_ROOT_PASS' shutdown"
    for i in $(seq 1 30); do is_running mysqld || break; sleep 1; done
fi
log "Xong. Bat game: systemctl start tlbb"
