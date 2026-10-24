// 25/10 (chu server): he so thuoc tinh PHU cua moi phai 1,00 -> 1,10 (he chinh giu nguyen theo heso-thuoctinh-25-10.js).
// AttackTraits.txt cot 6-9 (chi so 5-8) = Bang / Hoa / Huyen / Doc x 1.000.000. Chi sua dong PHAI (0-8, 14 Mo Dung, 15 Duong Mon, 16 Quy Coc),
// chi o dang DUNG 1000000 -> 1100000; dong 9-13 (khong phai phai) khong dong. Chay lai lan 2 khong doi gi them.
// Can cap-nhat + RESTART game. Rollback: tag truoc-heso-phu-25-10.
//   node tools/heso-phu-25-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Public/Config/AttackTraits.txt');
const PHAI = { 0: 'Thieu Lam', 1: 'Minh Giao', 2: 'Cai Bang', 3: 'Vo Dang', 4: 'Nga My', 5: 'Tinh Tuc', 6: 'Thien Long', 7: 'Thien Son', 8: 'Tieu Dao', 14: 'Mo Dung', 15: 'Duong Mon', 16: 'Quy Coc' };
const HE = ['Bang', 'Hoa', 'Huyen', 'Doc'];
const L = fs.readFileSync(F, 'latin1').split('\r\n');
let doi = 0;
for (const [dong, ten] of Object.entries(PHAI)) {
  const i = L.findIndex((l) => l.split('\t')[0] === dong);
  if (i < 0) { console.log('LOI khong co dong ' + dong); process.exit(1); }
  const c = L[i].split('\t');
  const cu = c.slice(5, 9).map(Number);
  const o = [];
  for (let k = 0; k < 4; k++) if (cu[k] === 1000000) { c[5 + k] = '1100000'; o.push(HE[k]); doi++; }
  L[i] = c.join('\t');
  const t = (a) => a.map((x) => (x / 1e6).toFixed(2)).join(' / ');
  console.log(('dong ' + dong + ' ' + ten).padEnd(16) + t(cu) + '  ->  ' + t(c.slice(5, 9).map(Number)) + (o.length ? '   (' + o.join(', ') + ')' : ''));
}
console.log(doi + ' o 1,00 -> 1,10');
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, L.join('\r\n'), 'latin1'); console.log('DA GHI ' + F); }
else console.log('(chay thu, them --ghi de luu)');
