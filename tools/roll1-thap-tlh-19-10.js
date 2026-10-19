// 19/10: Phieu 1.000 KNB o Thap Khac Lap Ma Can (427) + Tuyet Lang Ho (179) -> "1 nguoi roll" 0.5%:
// quai chet chi roll 1 lan (bat ke to bao nhieu nguoi), trung thi phieu roi cho 1 thanh vien to o gan (ngau nhien).
// Truoc: moi thanh vien to roll rieng (to 6 acc = x6). Khoa moi trong roithem.txt: thap1, tlh1 (khoa cu thap khong dung nua,
// bando chi con Han Huyet Linh 432 / Thanh Hoa Cung 537). Sua 3 file:
//   server/Public/Data/Script/NetCo4/roimap.lua  (g_MapCfg, g_Roll1, x950001_Chia1, RoiCfg goi Chia1)
//   panel/panel.py                               (ROI_KHOA them thap1 / tlh1 - neu thieu, luu tren web se XOA dong)
//   tools/bang-roi/build.js                      (trang netco4.click)
// Chay: node tools/roll1-thap-tlh-19-10.js [--ghi]
const fs = require('fs'), path = require('path');
const R = p => path.join(__dirname, '..', p);
const ghi = process.argv.includes('--ghi');
function sua(f, doi) {
  let s = fs.readFileSync(R(f), 'latin1');
  for (const [a, b] of doi) { if (s.split(a).length !== 2) throw new Error(f + ': khong thay dung 1 cho: ' + a.slice(0, 70)); s = s.replace(a, b); }
  if (ghi) fs.writeFileSync(R(f), s, 'latin1');
  console.log('OK ' + f + ' (' + doi.length + ' cho)');
}
const L = 'server/Public/Data/Script/NetCo4/roimap.lua';
const eolL = fs.readFileSync(R(L), 'latin1').includes('\r\n') ? '\r\n' : '\n';
const n = t => t.replace(/\n/g, eolL);
sua(L, [
  ['[179] = "bando", [432] = "bando"', '[179] = "tlh1", [432] = "bando"'],
  ['[427] = "thap" }', n('[427] = "thap1" }   -- [19/10] Tuyet Lang Ho (179) tach khoi bando -> tlh1; Thap -> thap1 (ca 2 "1 nguoi roll", x950001_g_Roll1)\n' +
    '-- [19/10] khoa "1 nguoi roll": quai chet chi roll 1 lan, trung thi roi cho 1 thanh vien to o gan (ngau nhien). Khoa khac: moi thanh vien roll rieng.\n' +
    'x950001_g_Roll1 = { thap1 = 1, tlh1 = 1 }')],
  ['\tfor i = 1, getn( ds ) do\n\t\tx950001_Chia( sceneId, selfId, killerId, ds[i] )\n\tend'.replace(/\n/g, eolL),
   n('\tfor i = 1, getn( ds ) do\n\t\tif x950001_g_Roll1[ khoa ] then\n\t\t\tx950001_Chia1( sceneId, selfId, killerId, ds[i] )\n\t\telse\n\t\t\tx950001_Chia( sceneId, selfId, killerId, ds[i] )\n\t\tend\n\tend')],
  ['function x950001_Chia( sceneId, selfId, killerId, r )', n(
    '-- [19/10] 1 nguoi roll (khoa trong x950001_g_Roll1): roll 1 lan cho ca to, trung thi roi cho 1 thanh vien o gan (ngau nhien, ke ca nguoi giet)\n' +
    'function x950001_Chia1( sceneId, selfId, killerId, r )\n' +
    '\tif LuaFnIsObjValid( sceneId, killerId ) ~= 1 then\n\t\treturn\n\tend\n' +
    '\tlocal playerId = killerId\n' +
    '\tif GetCharacterType( sceneId, killerId ) == 3 then\n\t\tplayerId = GetPetCreator( sceneId, killerId )\n\tend\n' +
    '\tif LuaFnHasTeam( sceneId, playerId ) == 1 then\n' +
    '\t\tlocal n = GetNearTeamCount( sceneId, playerId )\n' +
    '\t\tif n >= 1 then\n\t\t\tplayerId = GetNearTeamMember( sceneId, playerId, random( 0, n - 1 ) )\n\t\tend\n\tend\n' +
    '\tx950001_Roll( sceneId, selfId, playerId, r )\nend\n\n' +
    'function x950001_Chia( sceneId, selfId, killerId, r )')],
]);
sua('panel/panel.py', [
  ['    "bando": ("3 ban do: Tuyet Lang Ho / Han Huyet Linh / Thanh Hoa Cung - moi quai", 700),   # 16/10: roimap.lua x950001_g_MapCfg scene 179/432/537',
   '    "bando": ("2 ban do: Han Huyet Linh / Thanh Hoa Cung - moi quai", 180),   # 16/10: roimap.lua x950001_g_MapCfg scene 432/537 (19/10: Tuyet Lang Ho 179 tach ra tlh1)'],
  ['    "thap": ("Thap Khac Lap Ma Can - moi quai", 90),   # 17/10: tach khoi bando (roimap.lua x950001_g_MapCfg [427])',
   '    "thap": ("(KHONG DUNG tu 19/10, thay bang thap1) Thap Khac Lap Ma Can", 90),   # 17/10: tach khoi bando; 19/10 roimap [427] doi sang thap1\n' +
   '    "thap1": ("Thap Khac Lap Ma Can - moi quai, 1 NGUOI ROLL (to chi roll 1 lan)", 90),   # 19/10: roimap.lua x950001_g_Roll1\n' +
   '    "tlh1": ("Tuyet Lang Ho - moi quai, 1 NGUOI ROLL (to chi roll 1 lan)", 533),   # 19/10: roimap.lua [179] + x950001_g_Roll1'],
]);
sua('tools/bang-roi/build.js', [
  ["{ const BANDO = { 'xuelanghu_monster.ini': 0.2, 'takelamagan_monster.ini': 0.1,",
   "// 19/10: Tuyet Lang Ho + Thap -> 1 nguoi roll 0.5% (roithem tlh1 / thap1): to chi roll 1 lan / quai -> ti le / quai dung la con so nay.\n{ const BANDO = { 'xuelanghu_monster.ini': 0.5, 'takelamagan_monster.ini': 0.5,"],
]);
console.log(ghi ? 'DA GHI' : '(chay thu, them --ghi de ghi)');
