// 21/10 (chu server chon "sua loi + lam dung tooltip"): "Giam khang <he> den am X" (pha khang Long Van + dong Bao Vo Hon d/f/g/h,
// MD 502-505 = lvshux1[...]) gio do ENGINE tinh (deploy/va-server/va-den-am.py): khang muc tieu sau giam khang duoc xuong toi -X
// -> danh them toi X% sat thuong he do. Cach cu (ShuaXinClient gui hieu ung 31430/31470/31510/12960 + cap, danh thuong / lien chieu
// gan debuff -4/cap khang len muc tieu) bi: debuff VINH VIEN (khong het gio, chet / out khong mat - 9 nhan vat dang mang -36 khang Hoa),
// gan nhu khong tang sat thuong khi giam khang da vuot khang muc tieu. Sua: bo gui, moi lan lam moi go sach hieu ung + debuff cu.
// PHAI di cung ban va engine (restart). Lua -> cap-nhat.sh. Rollback: tag truoc-vohon-denam-21-10.   node tools/vohon-denam-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
const goc = fs.readFileSync(F, 'latin1');
const E = goc.includes('\r\n') ? '\r\n' : '\n';
const a = '\tif b1 > 0 or qqh1 > 0 then  ' + E;
const bCuoi = '12960+d1+qqh4, 0)' + E + '\tend' + E + '\tend' + E;
const i = goc.indexOf(a), j = goc.indexOf(bCuoi);
if (i < 0 || goc.indexOf(a, i + 1) >= 0 || j < i || j - i > 1200) { console.log('LOI neo khoi pha khang'); process.exit(1); }
const moi = [
  '\t-- [NetCo4 21/10] "den am" (MD 502-505 o tren) do engine tinh (deploy/va-server/va-den-am.py) - bo hieu ung kich hoat',
  '\t-- 31430/31470/31510/12960 (+cap) va debuff vinh vien 31450/31490/31530/12980 (+cap) da gan len nguoi bi danh - tools/vohon-denam-21-10.js',
  '\tfor i = 0, 19 do',
  '\t\tLuaFnCancelSpecificImpact(sceneId,selfId,31430+i)',
  '\t\tLuaFnCancelSpecificImpact(sceneId,selfId,31450+i)',
  '\t\tLuaFnCancelSpecificImpact(sceneId,selfId,31470+i)',
  '\t\tLuaFnCancelSpecificImpact(sceneId,selfId,31490+i)',
  '\t\tLuaFnCancelSpecificImpact(sceneId,selfId,31510+i)',
  '\t\tLuaFnCancelSpecificImpact(sceneId,selfId,31530+i)',
  '\t\tLuaFnCancelSpecificImpact(sceneId,selfId,12960+i)',
  '\t\tLuaFnCancelSpecificImpact(sceneId,selfId,12980+i)',
  '\tend',
  '',
].join(E);
const s = goc.slice(0, i) + moi + goc.slice(j + bCuoi.length);
console.log('ShuaXinClient.lua: bo gui pha khang, go hieu ung + debuff cu (' + (j + bCuoi.length - i) + ' byte cu)');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
