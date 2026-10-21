// 21/10: ShuaXinClient.lua (892002 AHa_ReMyBuff) - buff % Sinh luc cua Long Van (Huyet, dai 31400-31429, 3% / bac) chi GAN khi co,
// KHONG GO khi thao Long Van (dong 517 chi huy ma 31400; buff that la 31401-31429, con luu DB) -> thao Long Van van giu Huyet.
// Sua: khong con Huyet (xxxxassx = 31400) thi go moi ma 31401-31429 dang gan.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-go-huyet-lv-21-10.   node tools/go-huyet-lv-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
const goc = fs.readFileSync(F, 'latin1');
const i = goc.indexOf('\tif xxxxassx > 31400 then'); const j = goc.indexOf('\tif xueshangxbuff > 30200 then', i);
if (i < 0 || j < 0 || j - i > 400) { console.log('LOI khong thay khoi xxxxassx'); process.exit(1); }
const khoi = goc.slice(i, j);
const E = khoi.includes('\r\n') ? '\r\n' : '\n';
const cuoi = '\tend' + E;   // "end" dong ngoai cung cua khoi
if (!khoi.endsWith(cuoi)) { console.log('LOI khoi khong ket thuc bang end'); process.exit(1); }
const moi = khoi.slice(0, khoi.length - cuoi.length) + [
  '\telse   -- [NetCo4 21/10] khong con Long Van Huyet -> go buff % Sinh luc cu (truoc chi gan, khong go) - tools/go-huyet-lv-21-10.js',
  '\t\tfor i = 31401, 31429 do',
  '\t\t\tif LuaFnHaveImpactOfSpecificDataIndex( sceneId, selfId, i ) == 1 then',
  '\t\t\t\tLuaFnCancelSpecificImpact( sceneId, selfId, i )',
  '\t\t\tend',
  '\t\tend',
  '\tend',
].join(E) + E;
const s = goc.slice(0, i) + moi + goc.slice(j);
console.log('ShuaXinClient.lua: go Huyet Long Van khi thao');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
