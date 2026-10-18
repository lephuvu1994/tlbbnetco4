// 18/10 (chu server): vien +5 diem 30103041 xep chong (tui / ruong day vi moi vien 1 o).
// CommonItem.txt dong 30103041: cot 12 ItemRule 26 -> 10 (ItemRule.txt: 10 giong het 26 - bo / nhanh / ban NPC / KHONG giao dich /
// dung / khoa khi nhat / cat ngan hang - chi khac 重叠=1 va 是否唯一=0), cot 13 叠放数量 1 -> 250.
// (Cung cach phieu 39910001-006 ngay 17/10: chi doi cot chong ma rule khong cho 重叠 thi van 1 o / vien.)
// Bang .txt -> can cap-nhat + RESTART. Chay: node tools/vien-diem-chong-18-10.js. Rollback: tag truoc-vien-diem-chong-18-10
const fs = require('fs');
const p = __dirname + '/../server/Public/Config/CommonItem.txt';
const t = fs.readFileSync(p, 'latin1');
let n = 0;
const o = t.split('\n').map((l) => {
  const c = l.split('\t');
  if (c[0] !== '30103041') return l;
  if (c[11] !== '26' || c[12] !== '1') throw new Error('cot 12/13 = ' + c[11] + '/' + c[12] + ', can 26/1 (da chay roi?)');
  n++; c[11] = '10'; c[12] = '250'; return c.join('\t');
}).join('\n');
if (n !== 1) throw new Error('dong 30103041 khop ' + n);
fs.writeFileSync(p, o, 'latin1');
console.log('30103041: ItemRule 26 -> 10, chong 1 -> 250');
