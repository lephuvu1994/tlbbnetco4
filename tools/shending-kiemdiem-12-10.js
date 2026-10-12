// 12/10: Than Dinh (MyLua/shendian/ShenDing.lua, 339008) - nut "xac dinh" chia diem Khon Vu / Chan Ngu / Giam Khang.
// Goc: x339008_OnLianDanLuQianNengAccept GHI THANG 4 so client gui (SetMissionData) ROI MOI kiem "chi 1 he" -> phan phoi sai van bi luu,
// khong kiem so am / tong vuot muc. (Buff that trong ShuaXinClient lay theo CAP, so diem chi chon he -> rui ro thap, va cho sach.)
// Vá: them x339008_NetCo4_KiemDiem, goi DAU moi nhanh inden 10 / 30 / 50 truoc khi ghi.
// Tong toi da theo client (Interface selfshending.lua, LOvee / LOveeu): Khon Vu 30 x SD_SHUXINGDENGJ,
// Chan Ngu 8 x SD_KANGXINGDENGJ, Giam Khang 8 x SD_JIANKANGDENGJ (cap toi da 60 -> 1800 / 480 / 480).
//   node tools/shending-kiemdiem-12-10.js      (chay tu goc repo; chay lai lan 2 se bao "da va")
const fs = require('fs');
const P = 'server/Public/Data/Script/MyLua/shendian/ShenDing.lua';
const MAP = JSON.parse(fs.readFileSync('tools/viscii-map.json', 'utf8'));
const vi = (s) => [...s].map((c) => (c.charCodeAt(0) < 128 ? c : (MAP[c] !== undefined ? '\\' + MAP[c] : (() => { throw new Error('khong co VISCII: ' + c); })()))).join('');

let t = fs.readFileSync(P, 'latin1');
if (t.includes('x339008_NetCo4_KiemDiem')) { console.log('da va, khong lam gi'); process.exit(0); }
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
const h0 = hi(t);

const MSG = vi('Phân phối không hợp lệ: chỉ được dồn vào 1 hệ, không số âm, tổng không vượt điểm hiện có.');
const HAM = [
  '-- [NetCo4 12/10] Kiem so client gui TRUOC khi ghi (goc ghi truoc roi moi kiem). tools/shending-kiemdiem-12-10.js',
  '-- Dung 1 he > 0, khong am, tong <= buoc x cap (client: Khon Vu 30 x cap, Chan Ngu / Giam Khang 8 x cap).',
  'function  x339008_NetCo4_KiemDiem(  sceneId,  selfId,  buoc,  capId,  a,  b,  c,  d  )',
  '\t if  a == nil  or  b == nil  or  c == nil  or  d == nil  then  return 0  end',
  '\t if  a < 0  or  b < 0  or  c < 0  or  d < 0  then  return 0  end',
  '\t local  co  =  0',
  '\t if  a > 0  then  co = co + 1  end',
  '\t if  b > 0  then  co = co + 1  end',
  '\t if  c > 0  then  co = co + 1  end',
  '\t if  d > 0  then  co = co + 1  end',
  '\t if  co ~= 1  then  return 0  end',
  '\t if  a + b + c + d  >  buoc * GetMissionData(  sceneId,  selfId,  capId  )  then  return 0  end',
  '\t return 1',
  'end',
  '',
].join('\r\n');

const NEO_HAM = 'function  x339008_OnLianDanLuQianNengAccept(';
if (t.split(NEO_HAM).length !== 2) throw new Error('khong thay dung 1 cho ham OnLianDanLuQianNengAccept');
t = t.replace(NEO_HAM, HAM + NEO_HAM);

const NHANH = [[10, 30, 'SD_SHUXINGDENGJ'], [30, 8, 'SD_KANGXINGDENGJ'], [50, 8, 'SD_JIANKANGDENGJ']];
for (const [inden, buoc, cap] of NHANH) {
  const re = new RegExp('(\\t if  inden==' + inden + '  then[^\\r\\n]*\\r\\n)');
  const m = t.match(re);
  if (!m || t.split(m[1]).length !== 2) throw new Error('khong thay dung 1 nhanh inden==' + inden);
  const chen = [
    '\t if  x339008_NetCo4_KiemDiem(  sceneId,  selfId,  ' + buoc + ',  ' + cap + ',  bing,  huo,  xuan,  du  )  ~=  1  then  --[NetCo4 12/10]',
    '\t       x339008_MsgBox(  sceneId,  selfId,  "' + MSG + '"  )',
    '\t       return',
    '\t end',
    '',
  ].join('\r\n');
  t = t.replace(m[1], m[1] + chen);
}

if (hi(t) !== h0) throw new Error('byte > 0x7F bi doi: ' + h0 + ' -> ' + hi(t));
fs.writeFileSync(P, t, 'latin1');
console.log('da va ' + P + ': them ham kiem + 3 nhanh (10/30/50); byte > 0x7F giu nguyen ' + h0);
