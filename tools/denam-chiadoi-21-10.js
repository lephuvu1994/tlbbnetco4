// 21/10 (chu server: "do manh qua giup minh chia doi"): "Giam khang <he> den am X" (engine va-den-am.py doc MD 502-505) giam 1 nua:
// ShuaXinClient.lua bang lvshux1 (cap Long Van pha khang + dong Bao Vo Hon -> X) 4 / cap -> 2 / cap. Vd Hoa cap 17: 68 -> 34 (+34% toi da),
// Bao cap 8: 32 -> 16. So hien o bang nhan vat (client doc MD 503...) cung giam theo. Hieu luc khi lam moi buff (doi ban do / thao tac Vo Hon).
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-denam-chiadoi-21-10.   node tools/denam-chiadoi-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
const goc = fs.readFileSync(F, 'latin1');
const cu = '\tlocal lvshux1 = {0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100}';
if (goc.split(cu).length !== 2) { console.log('LOI neo lvshux1'); process.exit(1); }
const so = []; for (let i = 0; i <= 25; i++) so.push(i * 2);
const moi = '\tlocal lvshux1 = {' + so.join(',') + '}   -- [NetCo4 21/10] den am chia doi: 2 / cap (truoc 4) - tools/denam-chiadoi-21-10.js';
const s = goc.replace(cu, moi);
console.log('ShuaXinClient.lua: lvshux1 4/cap -> 2/cap');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
