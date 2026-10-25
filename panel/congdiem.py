"""25/10: CONG DIEM QUA WEB - nguoi choi chia diem tu do (t_char.points) vao 5 chi so goc tren web, ghi DB khi nhan vat DA THOAT.

Engine khong co ham Lua ghi chi so goc (docs/DICH-NGUOC.md) -> ghi thang t_char.str/spr/con/ipr/dex luc nhan vat offline.
Luong: bot (web nguoi choi, chi nhan vat da lien ket voi vi) goi panel /api/congdiem -> xep yeu cau vao txt/NetCo4CongDiem/<guid>.cho
-> luong nen (chay()) moi 5 giay: nhan vat KHONG online (billing.log) VA ShareMemory da luu offline (dong cuoi cua GUID la
"离线存盘成功", hoac ShareMemory khoi dong lai sau dong cuoi) -> 1 cau UPDATE nguyen tu: cong 5 cot, tru points, chi khi points du.
Khong sinh diem: chi chuyen diem tu do sang chi so. Nguoi choi vao lai dung luc ghi -> lan luu sau cua server ghi de ca chi so lan
points ve gia tri trong game (mat yeu cau, khong mat / khong them diem).
Mo phong: he so BaseValueTable.ini (moi phai 1 khoi, chia 100 - docs/DICH-NGUOC.md). Hieu luc: panel restart (khong can restart game).
"""
import datetime
import glob
import json
import os
import re
import subprocess
import threading
import time

COT = ("str", "spr", "con", "ipr", "dex")   # Cuong / Noi (Linh khi) / The / Tri (Dinh luc) / Than phap
TEN = ("Cường lực", "Nội lực", "Thể lực", "Trí lực", "Thân pháp")
TRAN = 10000000   # tong diem 1 lan
OFFLINE = "离线存盘成功".encode("gbk")
RE_T0 = re.compile(rb"T0=(\d{4}-\d{2}-\d{2}_\d{1,2}:\d{1,2}:\d{1,2})")
# AINFOTYPE trong BaseValueTable.ini: [ten, chi so goc tac dong (0-4), so AINFOTYPE]
HESO = [("Sinh lực", 2, 1), ("Khí", 3, 7), ("Ngoại công", 0, 13), ("Nội công", 1, 16), ("Ngoại thủ", 2, 19),
        ("Nội thủ", 3, 22), ("Chính xác", 4, 25), ("Né tránh", 4, 28), ("Hội công", 4, 31), ("Hội thủ", 4, 34)]


class CongDiem:
    def __init__(self, game, sql, viscii, billing_online, audit):
        self.dir = game + "/Server/txt/NetCo4CongDiem"
        self.smlog = game + "/Server/Log"
        self.bvt = game + "/Server/Config/BaseValueTable.ini"
        self.sql, self.viscii, self.billing_online, self.audit = sql, viscii, billing_online, audit
        self.lock = threading.Lock()
        os.makedirs(self.dir, exist_ok=True)
        self._heso = None

    # ------------------------------------------------------------------ du lieu
    def heso(self):
        if self._heso is None:
            b, cur = {}, None
            with open(self.bvt, "rb") as f:
                for l in f:
                    m = re.match(rb"^\[MENPAI(\d+)\]", l)
                    if m:
                        cur = int(m.group(1)); b[cur] = {}
                        continue
                    k = re.match(rb"^AINFOTYPE(\d+)=(-?\d+)", l)
                    if k and cur is not None:
                        b[cur][int(k.group(1))] = int(k.group(2))
            self._heso = b
        return self._heso

    def _p(self, guid, duoi):
        return os.path.join(self.dir, "%d.%s" % (int(guid), duoi))

    def _doc(self, guid, duoi):
        try:
            with open(self._p(guid, duoi), encoding="utf-8") as f:
                return json.load(f)
        except (OSError, ValueError):
            return None

    def _ghi(self, guid, duoi, obj):
        p = self._p(guid, duoi)
        with open(p + ".tmp", "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False)
        os.replace(p + ".tmp", p)

    def nhan_vat(self, guid):
        r = self.sql("SELECT charguid, accname, charname, menpai, level, %s, points FROM tlbbdb.t_char WHERE charguid=%d AND isvalid=1"
                     % (", ".join(COT), int(guid)))
        if not r:
            return None
        c = r[0]
        return {"guid": c[0].decode(), "acc": self.viscii(c[1]), "ten": self.viscii(c[2]), "phai": int(c[3]), "cap": int(c[4]),
                "goc": [int(x) for x in c[5:10]], "diem": int(c[10])}

    def trang_thai(self, guid):
        nv = self.nhan_vat(guid)
        if not nv:
            return {"ok": False, "error": "Không tìm thấy nhân vật"}
        bl = self.billing_online()
        h = self.heso().get(nv["phai"], {})
        acc = nv.pop("acc")
        return {"ok": True, "nv": nv, "online": bool(bl is not None and acc in bl), "ten": TEN,
                "heso": [{"ten": t, "o": o, "k": h.get(i, 0) / 100.0} for t, o, i in HESO],
                "cho": self._doc(guid, "cho"), "kq": self._doc(guid, "kq")}

    # ------------------------------------------------------------------ xep / huy
    def xep(self, guid, d, ai):
        # 25/10: 1 o = -1 -> "DON HET": luc ap (da thoat) o do nhan TAT CA diem tu do con lai (diem moi can trong game chua luu DB van tinh)
        try:
            d = [int(x) for x in d]
        except (TypeError, ValueError):
            return {"ok": False, "error": "Số điểm phải là số nguyên"}
        het = [i for i, v in enumerate(d) if v == -1]
        if len(d) != 5 or len(het) > 1 or any(v < 0 for i, v in enumerate(d) if i not in het):
            return {"ok": False, "error": "Nhập 5 ô ≥ 0 (tối đa 1 ô chọn Dồn hết)"}
        co = sum(v for v in d if v > 0)
        if (not het and co < 1) or co > TRAN:
            return {"ok": False, "error": "Tổng từ 1 đến %d (hoặc chọn Dồn hết)" % TRAN}
        nv = self.nhan_vat(guid)
        if not nv:
            return {"ok": False, "error": "Không tìm thấy nhân vật"}
        with self.lock:
            self._ghi(guid, "cho", {"d": d, "luc": time.strftime("%Y-%m-%d %H:%M:%S"), "ai": str(ai)[:40]})
        self.audit("cong diem xep GUID %s (%s) %s tong %d%s [%s]" % (guid, nv["ten"], d, co, " + DON HET o %d" % het[0] if het else "", ai))
        return self.trang_thai(guid)

    def huy(self, guid, ai):
        with self.lock:
            try:
                os.remove(self._p(guid, "cho"))
            except OSError:
                pass
        self.audit("cong diem huy GUID %s [%s]" % (guid, ai))
        return self.trang_thai(guid)

    # ------------------------------------------------------------------ kiem offline
    def _sm_bat_dau(self):
        p = subprocess.run(["ps", "-o", "lstart=", "-C", "ShareMemory"], capture_output=True, text=True)
        try:
            return datetime.datetime.strptime(p.stdout.strip().splitlines()[0].strip(), "%a %b %d %H:%M:%S %Y")
        except (ValueError, IndexError):
            return None

    def _sm_dong_cuoi(self, guid):
        """dong ShareMemory cuoi cung cua GUID trong 3 log gan nhat: (la_luu_offline, thoi_diem) hoac None"""
        khoa = ("Guid=%08X " % int(guid)).encode()
        tot = None
        for f in sorted(glob.glob(self.smlog + "/ShareMemory_*.log"), key=os.path.getmtime)[-3:]:
            try:
                with open(f, "rb") as h:
                    for l in h:
                        if khoa in l:
                            m = RE_T0.search(l)
                            t = datetime.datetime.strptime(m.group(1).decode(), "%Y-%m-%d_%H:%M:%S") if m else None
                            if t and (tot is None or t >= tot[1]):
                                tot = (OFFLINE in l, t)
            except OSError:
                continue
        return tot

    def an_toan(self, guid, acc):
        bl = self.billing_online()
        if bl is None or acc in bl:
            return False
        d = self._sm_dong_cuoi(guid)
        if d is None or d[0]:
            return True
        bd = self._sm_bat_dau()
        return bd is not None and bd > d[1]

    # ------------------------------------------------------------------ ap
    def ap(self, guid):
        cho = self._doc(guid, "cho")
        if not cho:
            return
        nv = self.nhan_vat(guid)
        if not nv:
            os.remove(self._p(guid, "cho"))
            return
        if not self.an_toan(guid, nv["acc"]):
            return
        d = [int(x) for x in cho["d"]]
        if -1 in d:   # Don het: o -1 nhan phan con lai cua diem tu do DA LUU (sau khi thoat = so that)
            i = d.index(-1)
            d[i] = 0
            d[i] = max(0, nv["diem"] - sum(d))
        s = sum(d)
        if s < 1:
            with self.lock:
                self._ghi(guid, "kq", {"ok": False, "d": d, "luc": time.strftime("%Y-%m-%d %H:%M:%S"), "msg": "Không cộng: nhân vật không có điểm tự do. Yêu cầu đã huỷ."})
                os.remove(self._p(guid, "cho"))
            return
        with self.lock:
            if self._doc(guid, "cho") != cho:   # nguoi choi vua doi / huy
                return
            r = self.sql("UPDATE tlbbdb.t_char SET %s, points=points-%d WHERE charguid=%d AND isvalid=1 AND points>=%d; SELECT ROW_COUNT()"
                         % (", ".join("%s=%s+%d" % (c, c, v) for c, v in zip(COT, d)), s, int(guid), s))
            ok = bool(r) and r[-1][0].decode() == "1"
            if ok:
                msg = "Đã cộng %s (tổng %d điểm). Vào game là thấy." % (", ".join("%s +%d" % (t, v) for t, v in zip(TEN, d) if v), s)
            else:
                msg = "Không cộng: nhân vật chỉ còn %d điểm tự do (cần %d). Yêu cầu đã huỷ, điểm giữ nguyên." % (nv["diem"], s)
            self._ghi(guid, "kq", {"ok": ok, "d": d, "luc": time.strftime("%Y-%m-%d %H:%M:%S"), "msg": msg})
            os.remove(self._p(guid, "cho"))
        self.audit("cong diem %s GUID %s (%s) %s tong %d, truoc goc %s diem %d" % ("AP" if ok else "THIEU DIEM", guid, nv["ten"], d, s, nv["goc"], nv["diem"]))

    def vong(self):
        for p in glob.glob(os.path.join(self.dir, "*.cho")):
            g = os.path.basename(p)[:-4]
            if g.isdigit():
                try:
                    self.ap(g)
                except Exception as e:   # 1 nhan vat loi khong lam dung ca vong
                    self.audit("cong diem LOI GUID %s: %s" % (g, e))

    def chay(self):
        def loop():
            while True:
                try:
                    self.vong()
                except Exception as e:
                    self.audit("cong diem LOI vong: %s" % e)
                time.sleep(5)
        threading.Thread(target=loop, daemon=True, name="congdiem").start()
