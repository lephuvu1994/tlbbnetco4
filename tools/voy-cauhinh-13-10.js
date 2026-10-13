// 13/10: he so Vo Y (noi tuc moi quai) chinh tren web admin (⚙️ Cai dat toan server), khong can restart.
// MyNew/guaiwu_die.lua (999998) truoc ghi cung: Neixi = (770 + cap quai x 10) x 4, x12 them o scene 6 / 73 / 74 (Vo Luong Son) + 427 (Thap Khac Lap Ma Can).
// Sau: doc Server/txt/NetCo4Cfg/voy.txt ("<moi noi> <ban do train>", panel GM panel.py voy_set) MOI LAN quai chet
// (server nap lai file script moi lan goi nen khong cache duoc; file 1 dong, re hon nap script). Khong co file / so sai = 4 va 12 nhu cu.
//   node tools/voy-cauhinh-13-10.js      (chay tu goc repo; chay lai lan 2 bao "da sua")
const fs = require('fs');
const P = 'server/Public/Data/Script/MyNew/guaiwu_die.lua';
let t = fs.readFileSync(P, 'latin1');
if (t.includes('x999998_HeSo')) { console.log('da sua, khong lam gi'); process.exit(0); }
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
const h0 = hi(t);

const CU1 = '        local Neixi = (770 + GuaiLev*10) * 4  -- [NetCo4 30/09] x4 noi tuc Vo Y theo yeu cau chu server (goc: 770 + GuaiLev*10)';
const CU2 = /        if sceneId == 6 or sceneId == 73 or sceneId == 74 or sceneId == 427 then Neixi = Neixi \* 12 end([^\r\n]*)/;
if (t.split(CU1).length !== 2) throw new Error('khong thay dong Neixi x4');
const m2 = t.match(CU2);
if (!m2) throw new Error('khong thay dong x12');

t = t.replace(CU1, [
  '        local VoyA, VoyB = x999998_HeSo()   -- [NetCo4 13/10] he so tu web admin (voy.txt); mac dinh 4 / 12 (30/09: x4, 09/10 + 11/10: x12 ban do train)',
  '        local Neixi = (770 + GuaiLev*10) * VoyA  -- goc: 770 + GuaiLev*10',
].join('\r\n'));
t = t.replace(m2[0], '        if sceneId == 6 or sceneId == 73 or sceneId == 74 or sceneId == 427 then Neixi = Neixi * VoyB end' + m2[1]);

const HAM = [
  '-- [NetCo4 13/10] He so Vo Y: Server/txt/NetCo4Cfg/voy.txt = "<moi noi> <ban do train>" (panel GM - Cai dat toan server, 1-100).',
  '-- Doc moi lan quai chet (hieu luc ngay). Khong co file / so sai = 4 moi noi, 12 them o Vo Luong Son (6 / 73 / 74) + Thap Khac Lap Ma Can (427).',
  'function x999998_HeSo()',
  '\tlocal a, b = 4, 12',
  '\tlocal h = openfile( "./txt/NetCo4Cfg/voy.txt", "r" )',
  '\tif h == nil then',
  '\t\treturn a, b',
  '\tend',
  '\tlocal s = read( h, "*l" )',
  '\tclosefile( h )',
  '\tlocal _, _, x, y = strfind( s or "", "^%s*(%d+)%s+(%d+)" )',
  '\tx = tonumber( x or "" )',
  '\ty = tonumber( y or "" )',
  '\tif x ~= nil and x >= 1 and x <= 100 then a = x end',
  '\tif y ~= nil and y >= 1 and y <= 100 then b = y end',
  '\treturn a, b',
  'end',
  '',
].join('\r\n');
const NEO = 'function x999998_OnDie(';
if (t.split(NEO).length !== 2) throw new Error('khong thay ham OnDie');
t = t.replace(NEO, HAM + NEO);

if (hi(t) !== h0) throw new Error('byte > 0x7F bi doi');
fs.writeFileSync(P, t, 'latin1');
console.log('da sua ' + P + ' (byte > 0x7F giu nguyen ' + h0 + ')');
