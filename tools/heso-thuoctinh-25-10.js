// 25/10 (chu server, can bang sau khi buff item mau): he so sat thuong 4 thuoc tinh (Bang / Hoa / Huyen / Doc) theo phai.
// AttackTraits.txt cot 6-9 (chi so 5-8) = C-cold / C-fire / C-light / C-poison, x 1.000.000. Sat thuong he = cong x (100 - khang)/100 x he so.
// Phai -> dong: 0-8 = 0-8, Mo Dung 14, Duong Mon 15, Quy Coc 16 (docs/CAN-BANG.md 19/10).
// Kiem DUNG gia tri cu truoc khi ghi (lech 1 o -> dung, khong ghi gi). Sua latin1 (ten GBK), giu CRLF.
// Can cap-nhat + RESTART game. Rollback: tag truoc-heso-thuoctinh-25-10.
//   node tools/heso-thuoctinh-25-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Public/Config/AttackTraits.txt');
// dong: [ten, cu [bang, hoa, huyen, doc], moi [bang, hoa, huyen, doc]]  (don vi x 1.000.000)
const BANG = {
  0: ['Thieu Lam', [1000000, 1000000, 1550000, 1000000], [1000000, 1000000, 1750000, 1000000]],
  1: ['Minh Giao', [1000000, 1550000, 1000000, 1000000], [1000000, 1750000, 1000000, 1000000]],
  2: ['Cai Bang', [1100000, 1350000, 1000000, 1350000], [1100000, 1500000, 1000000, 1500000]],
  3: ['Vo Dang', [1350000, 1100000, 1350000, 1000000], [1450000, 1100000, 1450000, 1000000]],
  4: ['Nga My', [1350000, 1100000, 1350000, 1000000], [1500000, 1100000, 1500000, 1000000]],
  5: ['Tinh Tuc', [1000000, 1000000, 1100000, 1550000], [1000000, 1000000, 1100000, 1650000]],
  6: ['Thien Long', [1300000, 1300000, 1300000, 1300000], [1350000, 1350000, 1350000, 1350000]],
  7: ['Thien Son', [1550000, 1000000, 1100000, 1000000], [1800000, 1000000, 1100000, 1000000]],
  8: ['Tieu Dao', [1100000, 1350000, 1000000, 1350000], [1100000, 1450000, 1000000, 1450000]],
  14: ['Mo Dung', [1000000, 1100000, 1550000, 1000000], [1000000, 1100000, 1650000, 1000000]],
  15: ['Duong Mon', [1100000, 1200000, 1450000, 1450000], [1100000, 1200000, 1550000, 1550000]],
  16: ['Quy Coc', [1100000, 1350000, 1350000, 1000000], [1100000, 1500000, 1500000, 1000000]],
};
const L = fs.readFileSync(F, 'latin1').split('\r\n');
let loi = 0;
for (const [dong, [ten, cu, moi]] of Object.entries(BANG)) {
  const i = L.findIndex((l) => l.split('\t')[0] === dong);
  if (i < 0) { console.log('LOI khong co dong ' + dong); loi++; continue; }
  const c = L[i].split('\t');
  const hien = c.slice(5, 9).map(Number);
  if (hien.join() !== cu.join()) { console.log('LOI dong ' + dong + ' ' + ten + ': dang ' + hien.join(' ') + ', mong ' + cu.join(' ')); loi++; continue; }
  for (let k = 0; k < 4; k++) c[5 + k] = String(moi[k]);
  L[i] = c.join('\t');
  const t = (a) => a.map((x) => (x / 1e6).toFixed(2)).join(' / ');
  console.log(('dong ' + dong + ' ' + ten).padEnd(16) + t(cu) + '  ->  ' + t(moi) + '   (tong ' + (moi.reduce((a, b) => a + b, 0) / 1e6).toFixed(2) + ')');
}
if (loi) { console.log(loi + ' loi, KHONG ghi'); process.exit(1); }
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, L.join('\r\n'), 'latin1'); console.log('DA GHI ' + F); }
else console.log('(chay thu, them --ghi de luu)');
