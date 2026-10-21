// 21/10 lan 2 (chu server: "so van hien thi 68 nhung sat thuong giam khang am chia 2"): tach so hien thi va so engine dung.
// - lvshux1 tra ve 4 / cap (MD 502-505, client bang nhan vat hien "Giam K.<he> den am", vd Hoa cap 17 = 68).
// - Them MD 470 (o trong, khong script / client nao dung) = so hien thi x x892002_DenAmTiLe / 100 (mac dinh 50), 4 he goi 1 o:
//   Bang byte 0, Hoa byte 1 (x256), Huyen byte 2 (x65536), Doc byte 3 (x16777216), moi he chan 0..100.
//   Engine (deploy/va-server/va-den-am.py ban 21/10 lan 2, Server.denam2 md5 8f85c1ee) doc o nay. Doi ti le: sua x892002_DenAmTiLe, khong restart.
// PHAI di cung Server.denam2 (restart). Ban engine dang chay (3032a629) doc MD 502-505 -> neu chi cap-nhat ma chua thay engine thi sat thuong
// quay ve 4 / cap. Lua -> cap-nhat.sh. Rollback: tag truoc-denam-o470-21-10.   node tools/denam-o470-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
const goc = fs.readFileSync(F, 'latin1'); let s = goc; let loi = 0;
const E = goc.includes('\r\n') ? '\r\n' : '\n';
const mot = (a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return; } s = s.replace(a, b); };
const so = []; for (let i = 0; i <= 25; i++) so.push(i * 4);
mot('\tlocal lvshux1 = {0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50}   -- [NetCo4 21/10] den am chia doi: 2 / cap (truoc 4) - tools/denam-chiadoi-21-10.js',
  '\tlocal lvshux1 = {' + so.join(',') + '}   -- [NetCo4 21/10] so HIEN THI 4 / cap; so engine dung = MD 470 (x892002_DenAmTiLe %) - tools/denam-o470-21-10.js', 'lvshux1');
const d505 = '\tSetMissionData( sceneId, selfId, 505,lvshux1[d1+qqh4+1])' + E;
mot(d505, d505 + [
  '\t-- [NetCo4 21/10] engine (deploy/va-server/va-den-am.py) doc "den am" o MD 470: 4 he goi 1 o (Bang byte 0, Hoa 1, Huyen 2, Doc 3)',
  '\tlocal daTL = x892002_DenAmTiLe',
  '\tif daTL == nil or daTL < 0 then',
  '\t\tdaTL = 50',
  '\tend',
  '\tlocal daSo = { lvshux1[b1+qqh1+1], lvshux1[h1+qqh2+1], lvshux1[x1+qqh3+1], lvshux1[d1+qqh4+1] }',
  '\tlocal daGoi = 0',
  '\tlocal daNhan = 1',
  '\tfor i = 1, 4 do',
  '\t\tlocal v = 0',
  '\t\tif daSo[i] ~= nil then',
  '\t\t\tv = floor( daSo[i] * daTL / 100 )',
  '\t\tend',
  '\t\tif v > 100 then',
  '\t\t\tv = 100',
  '\t\tend',
  '\t\tdaGoi = daGoi + v * daNhan',
  '\t\tdaNhan = daNhan * 256',
  '\tend',
  '\tSetMissionData( sceneId, selfId, 470, daGoi )',
  '',
].join(E), 'sau MD 505');
const fn = 'function x892002_AHa_ReMyBuff(sceneId, selfId)';
mot(fn, '-- [NetCo4 21/10] ti le % "den am" engine dung so voi so hien thi (MD 502-505) - tools/denam-o470-21-10.js' + E + 'x892002_DenAmTiLe = 50' + E + fn, 'ham AHa_ReMyBuff');
if (loi) process.exit(1);
console.log('ShuaXinClient.lua: hien thi 4/cap, MD 470 = 50%');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
