// 15/10: Cong Luc Dan 39999901 chinh tren web admin (⚙️ Cai dat toan server), khong can restart, khong can sua Lua nua.
// MyLua/xiulian/Gonglidan.lua (390102) truoc ghi cung: +100 / vien, tran 99999 (doi = sua Lua + cap-nhat; 07/10 + 14/10 doi roi tra lai).
// Sau: doc Server/txt/NetCo4Cfg/congluc.txt ("<moi vien> <tran>", panel GM panel.py congluc_set) MOI LAN can dan.
// Khong co file / so sai = 100 / 99999 nhu goc. Them 2 cho chan:
//   - cong luc da >= tran: KHONG cho can (truoc: mat vien ma khong duoc gi)
//   - tran ha thap hon cong luc dang co: can dan KHONG lam giam cong luc (truoc: bi ep ve tran)
// Thong bao hien so cong luc thuc nhan (vd sat tran chi +37).
//   node tools/congluc-cauhinh-15-10.js      (chay tu goc repo; chay lai lan 2 bao "da sua")
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '../server/Public/Data/Script/MyLua/xiulian/Gonglidan.lua');
const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const vn = (s) => [...s].map((c) => (MAP[c] !== undefined ? '\\' + String(MAP[c]).padStart(3, '0') : c)).join('');
let t = fs.readFileSync(P, 'latin1');
if (t.includes('x390102_CauHinh')) { console.log('da sua, khong lam gi'); process.exit(0); }
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
const cr = (s) => (s.match(/\r/g) || []).length;
const h0 = hi(t), c0 = cr(t);
const thay = (cu, moi) => {
  const n = typeof cu === 'string' ? t.split(cu).length - 1 : [...t.matchAll(new RegExp(cu.source, 'g'))].length;
  if (n !== 1) throw new Error('can dung 1 cho, thay ' + n + ': ' + cu);
  t = t.replace(cu, moi);
};

// 1) Ham doc cau hinh, dat ngay truoc OnConditionCheck
thay('function x390102_OnConditionCheck( sceneId, selfId )', [
  '-- [NetCo4 15/10] Cong Luc Dan chinh tren web admin: Server/txt/NetCo4Cfg/congluc.txt = "<moi vien> <tran>" (panel GM - Cai dat toan server).',
  '-- Doc moi lan can dan (hieu luc ngay, khong restart). Khong co file / so sai = 100 / 99999 nhu goc.',
  'function x390102_CauHinh()',
  '\tlocal a, b = 100, 99999',
  '\tlocal h = openfile( "./txt/NetCo4Cfg/congluc.txt", "r" )',
  '\tif h == nil then',
  '\t\treturn a, b',
  '\tend',
  '\tlocal s = read( h, "*l" )',
  '\tclosefile( h )',
  '\tlocal _, _, x, y = strfind( s or "", "^%s*(%d+)%s+(%d+)" )',
  '\tx = tonumber( x or "" )',
  '\ty = tonumber( y or "" )',
  '\tif x ~= nil and x >= 1 and x <= 10000000 then a = x end',
  '\tif y ~= nil and y >= 100 and y <= 99999999 then b = y end',
  '\treturn a, b',
  'end',
  '',
  'function x390102_OnConditionCheck( sceneId, selfId )',
].join('\r\n'));

// 2) Cham tran -> khong cho can (OnConditionCheck chay truoc OnDeplete nen vien con nguyen)
thay(/(\tif\(1~=LuaFnVerifyUsedItem\(sceneId, selfId\)\) then\r\n\t\treturn 0\r\n\tend\r\n)/, (m) => m + [
  '\tlocal _, tran = x390102_CauHinh()\t-- [NetCo4 15/10] da cham tran thi khong cho can (truoc: mat vien ma khong duoc gi)',
  '\tif GetMissionData( sceneId, selfId, XIULIAN_GONGLI ) >= tran then',
  '\t\tBeginEvent( sceneId )',
  '\t\t\tAddText( sceneId, "' + vn('Công lực đã đạt tối đa ') + '"..tran )',
  '\t\tEndEvent( sceneId )',
  '\t\tDispatchMissionTips( sceneId, selfId )',
  '\t\treturn 0',
  '\tend',
  '',
].join('\r\n'));

// 3) So moi vien + tran lay tu cau hinh; khong bao gio lam giam cong luc
thay(/\tlocal num=\d+\t[^\r\n]*(--[^\r\n]*)\r\n/, (_, c) => '\tlocal num, tran = x390102_CauHinh()\t-- [NetCo4 15/10] tu web admin (congluc.txt), mac dinh 100 / 99999 nhu goc\t' + c + '\r\n');
thay(/\tif total>\d+ then\t([^\r\n]*)\r\n\t\ttotal=\d+\r\n\tend\r\n/, (_, c) => [
  '\tif total>tran then\t' + c,
  '\t\ttotal=tran',
  '\tend',
  '\tif total<gongli then\t-- [NetCo4 15/10] tran ha thap hon cong luc dang co: giu nguyen, khong ep ve tran',
  '\t\ttotal=gongli',
  '\tend',
  '',
].join('\r\n'));
thay(/(AddText\( sceneId, "C\xf4ng L\xf1c c\xfca c\xe1c h\xd5 \+)\d+" \)/, (_, a) => a + '"..(total-gongli) )');

console.log('byte>127', h0, '->', hi(t), '| CR', c0, '->', cr(t));
if (hi(t) !== h0) throw new Error('so byte >127 doi - dung lai, khong ghi');
fs.writeFileSync(P, t, 'latin1');
console.log('DA GHI', P);
