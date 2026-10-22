// 22/10 (chu server: "ok nang len 250"): Vo Y toi da 200 -> 250 (sau tools/voy-200-22-10.js). Muc dich: du 20 diem boi nguyen
// (+1 moi cap chia het cho 5: 155..250) de max 2 quyen bi truyen con lai.
// obj/dali/odali_fanhua.lua: chan 200 -> 250; them noi tuc [201..250] cung quy luat (+30.000 / cap: cap n = cap n-1 + 4.000.000 + 30.000*(n-150)).
// Kiem tran so: noi tuc cap 250 ~836 trieu, du con int32 (2,1 ty); diem Sinh luc Vo Y (4 so cuoi WUYI_1) toi da ~1.580 < 9.999.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-voy-250-22-10.   node tools/voy-250-22-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'obj', 'dali', 'odali_fanhua.lua');
const goc = fs.readFileSync(F, 'latin1'); let s = goc; let loi = 0;
const mot = (a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return; } s = s.replace(a, b); };
const d200 = 'x002015_WUYI_expLE[200]  =  522830000';
const i = s.indexOf(d200);
if (i < 0) { console.log('LOI chua co bang cap 200 (chay tools/voy-200-22-10.js truoc)'); process.exit(1); }
const E = s[s.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n';
const them = ['-- [NetCo4 22/10] Vo Y 200 -> 250: noi tuc cap 201-250 cung quy luat - tools/voy-250-22-10.js'];
let v = 522830000;
for (let n = 201; n <= 250; n++) { v += 4000000 + 30000 * (n - 150); them.push('x002015_WUYI_expLE[' + n + ']  =  ' + v); }
if (v >= 2147483647) { console.log('LOI vuot int32'); process.exit(1); }
mot(d200 + E, d200 + E + them.join(E) + E, 'bang [200]');
mot('if  WuyiLev  >=  200  or  KillNum  >  3000  then   -- [NetCo4 22/10] tran 150 -> 200',
  'if  WuyiLev  >=  250  or  KillNum  >  3000  then   -- [NetCo4 22/10] tran 150 -> 200 -> 250', 'tran 200');
if (loi) process.exit(1);
console.log('odali_fanhua.lua: Vo Y toi da 250, noi tuc cap 201 = ' + (522830000 + 4000000 + 30000 * 51) + ', cap 250 = ' + v);
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
