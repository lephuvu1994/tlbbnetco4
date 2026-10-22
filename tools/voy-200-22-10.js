// 22/10 (chu server: "nang len 200 thu"): Vo Y toi da 150 -> 200.
// obj/dali/odali_fanhua.lua (002015): x002015_WuyiExpUp chan "WuyiLev >= 150" -> 200; bang noi tuc x002015_WUYI_expLE chi toi [150]
// -> them [151..200] theo dung quy luat bang goc (moi cap tang them 30.000: [150]-[149] = 4.000.000, cap n = cap n-1 + 4.000.000 + 30.000*(n-150)).
// Moi cap tu 120 tro len van +8 diem tiem nang, cu 5 cap +1 diem boi nguyen (code goc, khong doi). Server khong gioi han diem / thuoc tinh.
// Client Martial_WuYi.lua (g_MartialMaxLevel = 150, khong sua duoc): cap > 150 van hien so cap, thanh noi tuc tinh theo moc cap 150,
// dong "Thang toi cap: thuong +N diem" hien +0 - chi hien thi.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-voy-200-22-10.   node tools/voy-200-22-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'obj', 'dali', 'odali_fanhua.lua');
const goc = fs.readFileSync(F, 'latin1'); let s = goc; let loi = 0;
const mot = (a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return; } s = s.replace(a, b); };
const d150 = 'x002015_WUYI_expLE[150]  =  284580000';
const i = s.indexOf(d150);
if (i < 0 || s.indexOf('x002015_WUYI_expLE[149]  =  280580000') < 0) { console.log('LOI bang noi tuc khong khop goc'); process.exit(1); }
const E = s[s.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n';
const them = ['-- [NetCo4 22/10] Vo Y 150 -> 200: noi tuc cap 151-200 theo quy luat bang goc (+30.000 / cap) - tools/voy-200-22-10.js'];
let v = 284580000;
for (let n = 151; n <= 200; n++) { v += 4000000 + 30000 * (n - 150); them.push('x002015_WUYI_expLE[' + n + ']  =  ' + v); }
mot(d150 + E, d150 + E + them.join(E) + E, 'bang [150]');
mot('if  WuyiLev  >=  150  or  KillNum  >  3000  then', 'if  WuyiLev  >=  200  or  KillNum  >  3000  then   -- [NetCo4 22/10] tran 150 -> 200', 'tran 150');
if (loi) process.exit(1);
console.log('odali_fanhua.lua: Vo Y toi da 200, noi tuc cap 151 = ' + (284580000 + 4030000) + ', cap 200 = ' + v);
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
