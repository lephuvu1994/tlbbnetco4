#!/usr/bin/env python3
# Rut moi dong cua 1 nhan vat (charguid) tu file mysqldump .sql.gz -> cau lenh INSERT (stdout). Dung boi khoiphuc-nhanvat.sh.
# Lay moi bang tlbbdb co cot charguid, TRU bang/thu/ban be/quan hang (gan voi nhan vat, bang da xoa).
# aid (tu tang) = NULL de MySQL cap so moi. t_char: doi accname sang tai khoan moi, guldid = -1 (khong bang).
# Dong tra ve giu nguyen chu SQL goc (chuoi VISCII/GBK khong bi doi). stderr: tom tat + dong "BANG: ..." cho script goi.
#   python3 khoiphuc-nhanvat.py <file.sql.gz> <charguid> <tai_khoan> [knb]     knb: dat lai KNB (t_char.yuanbao) cua nhan vat
import gzip, re, sys

BO = {"t_guild_user", "t_guild_new", "t_relation", "t_mail", "t_pshop_new", "t_city_new"}


def tach_dong(s):
    """'(1,'a,b',3),(...)' -> list dong, moi dong la list token giu nguyen chu SQL (ca dau nhay)."""
    out, row, cur, q, i = [], None, [], False, 0
    while i < len(s):
        c = s[i]
        if q:
            cur.append(c)
            if c == "\\":
                cur.append(s[i + 1]); i += 2; continue
            if c == "'":
                q = False
        elif c == "'":
            q = True; cur.append(c)
        elif c == "(" and row is None:
            row, cur = [], []
        elif c == "," and row is not None:
            row.append("".join(cur)); cur = []
        elif c == ")" and row is not None:
            row.append("".join(cur)); out.append(row); row, cur = None, []
        elif row is not None:
            cur.append(c)
        i += 1
    return out


def main():
    if len(sys.argv) not in (4, 5):
        sys.exit("Dung: khoiphuc-nhanvat.py <file.sql.gz> <charguid> <tai_khoan> [knb]")
    bk, guid, acc = sys.argv[1:4]
    knb = sys.argv[4] if len(sys.argv) == 5 else None
    if not guid.isdigit() or not re.fullmatch(r"\w+", acc) or (knb is not None and not knb.isdigit()):
        sys.exit("charguid / knb phai la so, tai khoan chi gom chu/so/_")
    t = gzip.open(bk, "rb").read().decode("latin1")
    a = t.find("USE `tlbbdb`")
    if a < 0:
        sys.exit("Ban sao luu khong co DB tlbbdb")
    b = t.find("USE `", a + 1)
    sec = t[a:b if b > 0 else len(t)]

    cols = {m.group(1): re.findall(r"^\s+`(\w+)`", m.group(2), re.M)
            for m in re.finditer(r"CREATE TABLE `(\w+)` \((.*?)\n\) ", sec, re.S)}
    lay = {}
    for m in re.finditer(r"INSERT INTO `(\w+)` VALUES (.*?);\n", sec, re.S):
        tb = m.group(1)
        c = cols.get(tb, [])
        if tb in BO or "charguid" not in c:
            continue
        ci = c.index("charguid")
        for r in tach_dong(m.group(2)):
            if len(r) != len(c):
                sys.exit("%s: dong co %d gia tri, bang co %d cot - khong doc duoc" % (tb, len(r), len(c)))
            if r[ci].strip("'") == guid:
                lay.setdefault(tb, []).append(r)
    if "t_char" not in lay:
        sys.exit("Khong thay nhan vat %s trong ban sao luu" % guid)

    c = cols["t_char"]
    r = lay["t_char"][0]
    r[c.index("accname")] = "'%s'" % acc
    if "guldid" in c:
        r[c.index("guldid")] = "-1"
    if knb is not None:
        r[c.index("yuanbao")] = knb
    tom ={k: r[c.index(k)] for k in ("charname", "menpai", "level", "yuanbao", "vmoney") if k in c}

    nm = re.search(r"/\*!40101 SET NAMES (\w+) \*/", t)
    out = ["SET NAMES %s;" % nm.group(1)] if nm else []
    for tb in ["t_char"] + sorted(k for k in lay if k != "t_char"):   # t_char truoc: trung ten/guid thi dung ngay, chua ghi gi
        c = cols[tb]
        rows = []
        for r in lay[tb]:
            r = list(r)
            if "aid" in c:
                r[c.index("aid")] = "NULL"
            rows.append("(" + ",".join(r) + ")")
        out.append("INSERT INTO `%s` (%s) VALUES %s;" % (tb, ",".join("`%s`" % x for x in c), ",".join(rows)))
    sys.stdout.buffer.write(("\n".join(out) + "\n").encode("latin1"))

    sys.stderr.write("Nhan vat %s: %s\n" % (guid, ", ".join("%s=%s" % kv for kv in tom.items())))
    for tb in ["t_char"] + sorted(k for k in lay if k != "t_char"):
        sys.stderr.write("   %-14s %d dong\n" % (tb, len(lay[tb])))
    sys.stderr.write("BANG: %s\n" % " ".join(["t_char"] + sorted(k for k in lay if k != "t_char")))


main()
