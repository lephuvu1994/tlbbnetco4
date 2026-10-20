// 20/10 (chu server): MO LAI Shop BaBy (ke 270, Khu Buon Ban) - lay nguyen dong 270 tu tag truoc-sachpet-shopbaby-02-10
// (19 mon: Ngo Linh Chau, Giac Linh Chau, Ngu Nghe Tan Quyen x5 + Toan Quyen, Dien Tich Chu Giai / Tan Hiet, Giang Tu / Xich Ha Tien Lo,
//  7 bo thoi trang BaBy 30008401-407; gia nhu cu - docs/SHOP-TRONG-GAME.md). File .txt -> cap-nhat.sh + RESTART game.
//   node tools/mo-shopbaby-20-10.js [--ghi]
const fs = require('fs'), path = require('path'), cp = require('child_process');
const REPO = path.join(__dirname, '..'), F = 'server/Public/Config/ShopTable.txt';
const cu = cp.execSync('git show truoc-sachpet-shopbaby-02-10:' + F, { cwd: REPO, maxBuffer: 64 << 20 }).toString('latin1').split('\n').find((l) => l.startsWith('270\t'));
let s = fs.readFileSync(path.join(REPO, F), 'latin1');
const L = s.split('\n'); const i = L.findIndex((l) => l.startsWith('270\t'));
if (!cu || i < 0) { console.log('LOI khong thay dong 270'); process.exit(1); }
const cr = L[i].endsWith('\r') ? '\r' : '';
const moi = cu.replace(/\r$/, '') + cr;
const ids = moi.split('\t').filter((x, k) => k >= 25 && /^\d{8}$/.test(x));
console.log('dong 270 hien tai:', L[i].split('\t').filter((x) => /^\d{8}$/.test(x)).length, 'mon -> khoi phuc', ids.length, 'mon:', ids.join(' '));
L[i] = moi;
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(path.join(REPO, F), L.join('\n'), 'latin1'); console.log('DA GHI');
