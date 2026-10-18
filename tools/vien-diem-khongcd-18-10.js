// 18/10 (chu server): vien +5 diem 30103041 dung lien tuc nhu phieu KNB, khong "xoay" (dong ho hoi chieu tren o).
// CommonItem.txt cot 15 技能编号 51 (标准吃血(瞬发) = an thuoc mau, hoi chieu chung nhom 80) -> 78 (使用无CD物品 = dung vat pham
// khong hoi chieu, giong phieu 39910001). Ca 2 deu skill-like; 78 bi chan khi cuoi / bien than (giong phieu).
// Bang .txt -> can cap-nhat + RESTART. Chay: node tools/vien-diem-khongcd-18-10.js. Rollback: tag truoc-vien-diem-khongcd-18-10
const fs = require('fs');
const p = __dirname + '/../server/Public/Config/CommonItem.txt';
const t = fs.readFileSync(p, 'latin1');
let n = 0;
const o = t.split('\n').map((l) => {
  const c = l.split('\t');
  if (c[0] !== '30103041') return l;
  if (c[14] !== '51') throw new Error('cot 15 = ' + c[14] + ', can 51 (da chay roi?)');
  n++; c[14] = '78'; return c.join('\t');
}).join('\n');
if (n !== 1) throw new Error('dong 30103041 khop ' + n);
fs.writeFileSync(p, o, 'latin1');
console.log('30103041: ky nang dung 51 -> 78 (khong hoi chieu)');
