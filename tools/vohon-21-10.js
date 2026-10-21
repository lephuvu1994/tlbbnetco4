// 21/10 (chu server: kiem Vo Hon). Bang dong (x892101_iTextkkp) + hieu ung 10675-10770 da khop client Wuhun.lua:
//  q/w/e/r Bang/Hoa/Huyen/Doc cong +30/cap, t/y/u/i khang +10/cap, o/p/a/s bo qua khang +10/cap, d/f/g/h giam khang muc tieu +4/cap.
// Loi sua:
//  1. ShuaXinClient.lua x892002_WHget_sx: dong d/f/g/h (giam khang, da tinh qua qqh + pha khang Long Van) VAN gui hieu ung bang = 10770
//     (= dong s cap 8 "bo qua khang Doc +80") -> ai co 1 dong d/f/g/h duoc tang +80 bo qua khang Doc. Sua: bo qua d/f/g/h.
//  2. Hieu ung Vo Hon la vinh vien (-1, khong mat khi out) va chi bi go khi THAO Vo Hon -> tay / doi dong hoac doi Vo Hon khac
//     thi hieu ung dong cu con mai (cong don). Sua: moi lan lam moi, go moi hieu ung 10675-10770 khong thuoc dong hien tai.
//  3. lvshux1 (hien thi giam khang MD 502-505) cap 8 = 30, dung 32 (hieu ung that -4/cap).
//  4. StandardImpact.txt: pha khang Bang/Hoa/Huyen/Doc (31430/31470/31510/12960 +0..19) chung mutex 2029, debuff len muc tieu
//     (31450/31490/31530/12980) chung mutex 2030 -> Long Van 1 he + Vo Hon he khac (hoac 2 dong d/f/g/h) thi de nhau, chi he gui
//     sau cung con. Sua: tach moi he 1 mutex rieng (2029/2031/2032/2033, debuff 2030/2034/2035/2036 - truoc do chua ai dung).
// 1-3 Lua (cap-nhat.sh, khong restart). 4 la .txt -> CAN restart game. Rollback: tag truoc-vohon-21-10.   node tools/vohon-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server');
const F = path.join(S, 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
const T = path.join(S, 'Server', 'Config', 'StandardImpact.txt');
const goc = fs.readFileSync(F, 'latin1'); let s = goc; let loi = 0;
const E = goc.includes('\r\n') ? '\r\n' : '\n';
const mot = (a, b, ten) => { a = a.split('\n').join(E); b = b.split('\n').join(E); const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return; } s = s.replace(a, b); };

mot('\t     local er,kz,r,d,sx,jn ,shuxingtab =x892002_Get_WH_SXe(sceneId, selfId,110)\n\t\tif er ==1 then \n',
  '\t     local er,kz,r,d,sx,jn ,shuxingtab =x892002_Get_WH_SXe(sceneId, selfId,110)\n' +
  '\t\tlocal whCan = {}   -- [NetCo4 21/10] hieu ung cua dong hien tai; dong cu (tay/doi Vo Hon) bi go o duoi - tools/vohon-21-10.js\n' +
  '\t\tif er ==1 then \n', 'neo whCan');
mot('\t\t\t if LuaFnHaveImpactOfSpecificDataIndex(sceneId, selfId,x892101_iTextkkp[shuxingtab[i]][4]) ~= 1 then \n' +
  '                LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId,x892101_iTextkkp[shuxingtab[i]][4], 0);\n' +
  '\t\t\t end\t\n',
  '\t\t\t -- [NetCo4 21/10] d/f/g/h (giam khang) tinh qua qqh, truoc van gui 10770 (= s8 bo qua khang Doc +80) -> bo\n' +
  '\t\t\t local whL = strsub(shuxingtab[i],1,1)\n' +
  '\t\t\t if whL ~= "d" and whL ~= "f" and whL ~= "g" and whL ~= "h" and x892101_iTextkkp[shuxingtab[i]] ~= nil then\n' +
  '\t\t\t  local whId = x892101_iTextkkp[shuxingtab[i]][4]\n' +
  '\t\t\t  whCan[whId] = 1\n' +
  '\t\t\t  if LuaFnHaveImpactOfSpecificDataIndex(sceneId, selfId,whId) ~= 1 then \n' +
  '                LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId,whId, 0);\n' +
  '\t\t\t  end\n' +
  '\t\t\t end\t\n', 'gui hieu ung');
mot('\t\tend\n\t\telse\n\t\t\tfor i=10675,10770 do \n',
  '\t\tend\n' +
  '\t\tfor i=10675,10770 do   -- [NetCo4 21/10] go hieu ung dong khong con tren Vo Hon dang mang\n' +
  '\t\t\tif whCan[i] == nil and LuaFnHaveImpactOfSpecificDataIndex(sceneId, selfId,i) == 1 then\n' +
  '\t\t\t\tLuaFnCancelSpecificImpact(sceneId,selfId,i)\n' +
  '\t\t\tend\n' +
  '\t\tend\n' +
  '\t\telse\n\t\t\tfor i=10675,10770 do \n', 'go dong cu');
mot('{0,4,8,12,16,20,24,28,30,36,', '{0,4,8,12,16,20,24,28,32,36,', 'lvshux1');
if (loi) process.exit(1);

// StandardImpact: cot 8 (mutex)
const tg = fs.readFileSync(T, 'latin1');
const EOL = tg.includes('\r\n') ? '\r\n' : '\n';
const MX = [[31430, 31449, '2029', '2029'], [31450, 31469, '2030', '2030'], [31470, 31489, '2029', '2031'], [31490, 31509, '2030', '2034'],
  [31510, 31529, '2029', '2032'], [31530, 31549, '2030', '2035'], [12960, 12979, '2029', '2033'], [12980, 12999, '2030', '2036']];
let doi = 0;
const dong = tg.split(EOL).map((l) => {
  const c = l.split('\t'); const id = +c[0];
  for (const [a, b, cu, moi] of MX) if (id >= a && id <= b) {
    if (c[7] !== cu) { console.log('LOI mutex ' + id + ' = ' + c[7]); loi++; return l; }
    if (cu !== moi) { c[7] = moi; doi++; }
    return c.join('\t');
  }
  if (['2031', '2032', '2033', '2034', '2035', '2036'].includes(c[7])) { console.log('LOI mutex ' + c[7] + ' da co dong ' + id); loi++; }
  return l;
});
if (doi !== 120) { console.log('LOI so dong doi mutex: ' + doi); loi++; }
const tg2 = dong.join(EOL);
if (tg2.length !== tg.length) { console.log('LOI do dai StandardImpact'); loi++; }
if (loi) process.exit(1);
console.log('ShuaXinClient.lua: Vo Hon bo 10770 cho d/f/g/h, go dong cu, lvshux1 cap 8 = 32');
console.log('StandardImpact.txt: tach mutex pha khang 4 he (' + doi + ' dong, do dai giu nguyen)');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); fs.writeFileSync(T, tg2, 'latin1'); console.log('DA GHI');
