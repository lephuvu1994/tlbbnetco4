// 12/10 (chu server): LICH HOAT DONG cho mod panel - doc Public/Config/ActivityNotice.txt (bang lich server: moi dong chay 1 script vao gio co dinh).
//  Cot: 0 id, 1 opt_type, 2 time_type (1 = hang ngay, 2 = hang tuan, 0 = 1 lan theo ngay - bo), 3 time_start, 4 sceneid, 5 scriptid, 6 time_slice,
//       29 ten hoat dong, 30 time_invalid. Gio = o 15 phut (0-95): 80 = 20:00. Hang tuan: thu*100 + o (thu 0 = CN).
//  Ten / ban do / mo ta lay theo bang TEN (chu server doc duoc) - dong khong co trong TEN lay ten goc trong bang (VISCII / GBK).
//  Chi giu hoat dong co script dang ky trong Script.dat + co file. Ghep voi lich boss (tools/lich-boss.js) thanh 1 file cho bot.
//   node tools/lich-hoat-dong.js [--in]      (--in = chi in, khong ghi)
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'server');
const OUT = path.join(__dirname, '..', '..', 'bialk', 'BotDoMin', 'lichhoatdong.json');
const vis = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8')); const rv = {}; for (const k in vis) rv[vis[k]] = k;
const gbk = new TextDecoder('gbk');
const ten0 = (s) => { const b = Buffer.from(s || '', 'latin1'); let v = ''; let thieu = 0; for (const c of b) { if (c < 128) v += String.fromCharCode(c); else if (rv[c]) v += rv[c]; else { thieu++; v += '?'; } }
  return thieu ? gbk.decode(b) : v; };
const lines = (f) => fs.readFileSync(path.join(R, f), 'latin1').split(/\r?\n/);
const MAP = {}; { let cur = null; for (const l0 of lines('Public/Config/SceneInfo.ini')) { const l = l0.replace(/;.*$/, '').trim(); const m = l.match(/^\[scene(\d+)\]$/); if (m) { cur = m[1]; continue; }
  const kv = l.match(/^name=(.*)$/); if (cur && kv) MAP[cur] = ten0(kv[1]).trim(); } }
const SD = new Map(); for (const l of lines('Public/Data/Script.dat')) { const m = l.match(/^0*(\d+)=(.+)$/); if (m) SD.set(m[1], m[2].trim().split('\\').join('/').replace(/^\//, '')); }

// script -> ten de hieu + nhom + ghi chu (chu server / nguoi choi doc). Script 808000 = chi la thong bao -> lay ten theo cot 29.
const TEN = {
  50016: { ten: 'Kẻ Thù Xâm Lược (Ác Tặc / Ác Bá)', nhom: 'boss', ghi: 'Tặc binh xuất hiện ở bản đồ → nhận nhiệm vụ, vào phó bản đánh Ác Tặc / Ác Bá (có túi boss web)' },
  900020: { ten: 'Phượng Hoàng Lăng Mộ (tặc binh)', nhom: 'boss', ghi: 'Bản tặc binh ở Phượng Hoàng' },
  808001: { ten: 'BOSS Môn Phái', nhom: 'boss' },
  810000: { ten: 'BOSS Ác Cẩm', nhom: 'boss' }, 810001: { ten: 'BOSS Kim Cương', nhom: 'boss' }, 810002: { ten: 'BOSS Nga My', nhom: 'boss' }, 810003: { ten: 'BOSS Thảo Nguyên', nhom: 'boss' },
  810110: { ten: 'BOSS Long Quy', nhom: 'boss', ghi: 'Có túi boss web' },
  810112: { ten: 'Tàng Kinh Các', nhom: 'hoatdong' },
  808066: { ten: 'Thánh Thú Sơn - cải tiến bảo sương', nhom: 'hoatdong' },
  402100: { ten: 'Hoạt động Thánh Thú Sơn', nhom: 'hoatdong' }, 402103: { ten: 'Sự kiện Dã Trư (Thánh Thú Sơn)', nhom: 'hoatdong' },
  801016: { ten: 'Khoa Cử', nhom: 'hoatdong', ghi: 'Đại Lý (51,149) Chủ Khảo Quan - LV10 trở lên' },
  801019: { ten: 'Khoa Cử', nhom: 'hoatdong' }, 801020: { ten: 'Khoa Cử', nhom: 'hoatdong' }, 801021: { ten: 'Khoa Cử', nhom: 'hoatdong' },
  808015: { ten: 'Đánh Lén Môn Phái', nhom: 'hoatdong' },
  808037: { ten: 'Linh Dược (Kính Hồ)', nhom: 'hoatdong' },
  808003: { ten: 'Đại Đào Sát', nhom: 'pk' },
  805041: { ten: 'Bảo Hộ Bang Phái', nhom: 'bang' },
  808120: { ten: 'Huyền Vũ Đảo - Lôi Lân Sứ Phụng', nhom: 'boss' },
  402042: { ten: 'Túc Cầu', nhom: 'hoatdong' }, 402043: { ten: 'Túc Cầu (thông báo)', nhom: 'hoatdong' },
  808068: { ten: 'Quái tuần tra Huyền Vũ Đảo', nhom: 'hoatdong' },
  50030: { ten: 'BOSS Xuân Vãn', nhom: 'boss' },
};
// bo: le hoi / su kien cu (Giang sinh 08, Hong Kong, dao bao su do...), thong bao trung lap, script khong ro
const BO = new Set(['50023', '50024', '808076', '820001', '808040', '808106', '808123', '402043']);
// script 808000 = chi thong bao -> chi giu cac ten nay (con lai la rac / tieng Trung / trung voi script that)
const GIU_808000 = { 'Lâu Lan Tầm Bảo': 'Lâu Lan Tầm Bảo', 'Trân thú cổ mộ': 'Trân Thú Cổ Mộ', 'Phụng Hoàng Cổ Thành': 'Phụng Hoàng Cổ Thành', 'Thử Tài Vận May': 'Thử Tài Vận May' };
// them tay: hoat dong co gio trong script nhung khong nam o ActivityNotice
const THEM = [
  { ten: 'Thông Thiên Tháp', nhom: 'hoatdong', ghi: 'Mở 20:00 - đóng 22:00 mỗi ngày, các tầng có Boss', script: 100121, scene: null, banDo: '', ngay: ['20:00'], tuan: [], den: '22:00' },
];
const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const gio = (o) => String(Math.floor(o / 4)).padStart(2, '0') + ':' + String((o % 4) * 15).padStart(2, '0');
const g = new Map();
for (const l of lines('Public/Config/ActivityNotice.txt').slice(2)) {
  const c = l.split('\t'); if (!/^\d+$/.test(c[0])) continue;
  const tt = +c[2], st = +c[3], sc = +c[4], sid = String(+c[5]);
  if (tt !== 1 && tt !== 2) continue;                       // 0 = 1 lan theo ngay le (het han)
  const rel = SD.get(sid); const co = rel && fs.existsSync(path.join(R, 'Public/Data/Script', rel)); if (!co) continue;
  const t = TEN[sid]; const goc = ten0(c[29] || '').trim();
  if (BO.has(sid)) continue;
  if (sid === '808000' && !GIU_808000[goc]) continue;
  if (!t && /[\u4e00-\u9fff]/.test(goc)) continue;           // dong ten tieng Trung khong co trong TEN = su kien Trung cu (dao sat, le hoi) - bo
  if (!t && sid === '808000' && !goc) continue;
  const ten = t ? t.ten : GIU_808000[goc] || goc || ('Script ' + sid);
  const key = ten + '|' + (sc > 0 ? sc : '');
  if (!g.has(key)) g.set(key, { ten, nhom: t ? t.nhom : 'hoatdong', ghi: t && t.ghi || '', script: +sid, scene: sc > 0 ? sc : null, banDo: sc > 0 ? (MAP[sc] || 'Bản đồ ' + sc) : '', ngay: new Set(), tuan: new Set() });
  const o = g.get(key);
  if (tt === 1 && st >= 0 && st <= 95) o.ngay.add(gio(st));
  if (tt === 2) { const thu = Math.floor(st / 100), q = st % 100; if (thu >= 0 && thu <= 6 && q <= 95) o.tuan.add(THU[thu] + ' ' + gio(q)); }
}
const hd = [...g.values()].map((o) => ({ ...o, ngay: [...o.ngay].sort(), tuan: [...o.tuan].sort() })).filter((o) => o.ngay.length || o.tuan.length).concat(THEM);
hd.sort((a, b) => (a.nhom > b.nhom ? 1 : a.nhom < b.nhom ? -1 : a.ten.localeCompare(b.ten)));
for (const o of hd) console.log(o.nhom.padEnd(9), o.script, o.ten, o.banDo ? '@' + o.banDo : '', '|', o.ngay.join(' '), o.tuan.length ? '| tuan: ' + o.tuan.join(', ') : '');
if (!process.argv.includes('--in')) { fs.writeFileSync(OUT, JSON.stringify({ taoLuc: new Date().toISOString(), nguon: 'tools/lich-hoat-dong.js (Public/Config/ActivityNotice.txt)', hd }, null, 1)); console.log('ghi', OUT, hd.length); }
