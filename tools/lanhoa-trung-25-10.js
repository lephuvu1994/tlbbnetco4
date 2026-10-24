// 25/10 (chu server): Lan Hoa Diem Huyet Thu (Thien Son 499) + ban tien giai ·Toa (1726) bi MISS du da tang hinh + ap sat.
// SkillTemplate_V1.txt cot 48 "命中率" = -1 -> tinh trung theo chinh xac / ne. Dat 100 (trung chac) nhu 3 chieu khoa khac cua
// Thien Son (514 Thien Dia Minh Diet, 515 Bang Ngung Suong Hoa, 517 Tu Thuy Vi Thanh) va 1.282 chieu khac trong game.
// Thiet Toa Hoanh Giang 495, Dong Sinh Cong Tu 513/1727 (khong can tang hinh) giu -1. Trung / truot do server tinh.
// GBK, sua theo byte latin1 (giu xuong dong goc). Can cap-nhat + RESTART. Rollback: tag truoc-lanhoa-25-10.
//   node tools/lanhoa-trung-25-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Public/Config/SkillTemplate_V1.txt');
const COT = 48, DOI = { 499: ['-1', '100'], 1726: ['-1', '100'] };
const s = fs.readFileSync(F).toString('latin1');
const E = s.includes('\r\n') ? '\r\n' : '\n';
const L = s.split(E);
const gbk = new TextDecoder('gbk');
if (gbk.decode(Buffer.from(L[1].split('\t')[COT], 'latin1')) !== '命中率') { console.log('LOI cot ' + COT + ' khong phai 命中率'); process.exit(1); }
let loi = 0;
for (const [id, [cu, moi]] of Object.entries(DOI)) {
  const i = L.findIndex((l) => l.split('\t')[0] === id);
  const c = i < 0 ? [] : L[i].split('\t');
  if (i < 0 || ![cu, moi].includes(c[COT])) { console.log('LOI dong ' + id + ': 命中率 = ' + c[COT] + ', mong ' + cu); loi++; continue; }
  console.log('skill ' + id + ': 命中率 ' + c[COT] + ' -> ' + moi);
  c[COT] = moi;
  L[i] = c.join('\t');
}
if (loi) { console.log(loi + ' loi, KHONG ghi'); process.exit(1); }
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, Buffer.from(L.join(E), 'latin1')); console.log('DA GHI ' + F); }
else console.log('(chay thu, them --ghi de luu)');
