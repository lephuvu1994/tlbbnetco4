// 21/10 (chu server: kiem Vo Y): ShuaXinClient.lua - diem Vo Y "Sinh luc" (WUYI_1 4 so cuoi) cong thang 1 diem = 1 don vi dai HP (1.000),
// client Martial_WuYi.lua (WuYiAttrPoint = {1500, 15, 15, 15, 15, 100, 80, 3, 3}) ghi +1.500 / diem -> thieu 1/3. Sua: don vi = floor(diem x 3 / 2).
// Thuoc tinh (15), Chinh xac (100), Ne (80) da khop 1 diem = 1 don vi. Xuyen thich / Xuyen phong giu muc chu server chot 15/10 (+100 / +50).
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-voy-mau-21-10.   node tools/voy-mau-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
const goc = fs.readFileSync(F, 'latin1');
const a = 'local WuYiSX_XSX = mod(GetMissionData(sceneId,selfId,WUYI_1),10000)';
const i = goc.indexOf(a); if (i < 0 || goc.indexOf(a, i + 1) >= 0) { console.log('LOI neo WuYiSX_XSX'); process.exit(1); }
const E = goc[goc.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n'; const het = goc.indexOf('\n', i) + 1;
const s = goc.slice(0, het) + '       WuYiSX_XSX = floor( WuYiSX_XSX * 3 / 2 )   -- [NetCo4 21/10] 1 diem Vo Y Sinh luc = +1.500 nhu client (dai HP 1.000 / don vi) - tools/voy-mau-21-10.js' + E + goc.slice(het);
console.log('ShuaXinClient.lua: Vo Y Sinh luc x1,5');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
