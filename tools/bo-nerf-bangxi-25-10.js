// 25/10 (chu server): BO nerf Bang Xi (Tu Tuyet Trang, boss cuoi 14145) cua tools/nerf-bangxi-18-10.js - tra DUNG 2 cho ve goc:
// (1) Server/Config/StandardImpact.txt dong 2868 "Tinh La Ky Bo": 20000 + 5.2 -> 50556 + 12.99766997 (chi doi dong 2868; file da co
//     thay doi khac sau 18/10 - Trung Lau, Di Hoa Tiep Moc, am khi 32400 - nen KHONG checkout ca file ve tag).
// (2) ai_liqiushui.lua: cuong bao 20 -> 10 phut (x893069_EnterKuangBaoTime).
// Kiem byte > 0x7f khong doi. Bang .txt can cap-nhat + RESTART; Lua sau cap-nhat. Rollback: tag truoc-bo-nerf-bangxi-25-10
//   node tools/bo-nerf-bangxi-25-10.js
const fs = require('fs');
const R = __dirname + '/../server/';
function va(f, fn) {
  const p = R + f; const t = fs.readFileSync(p, 'latin1');
  const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
  const m = fn(t);
  if (hi(m) !== hi(t)) throw new Error(f + ': byte > 0x7f doi');
  fs.writeFileSync(p, m, 'latin1'); console.log('ok', f);
}
va('Server/Config/StandardImpact.txt', (t) => {
  const L = t.split('\n'); let n = 0;
  for (let i = 0; i < L.length; i++) {
    if (!L[i].startsWith('2868\t')) continue;
    const cu = '\t20000\t5.2\t';
    if (L[i].split(cu).length !== 2) throw new Error('dong 2868 khong co moc nerf 20000/5.2');
    L[i] = L[i].replace(cu, '\t50556\t12.99766997\t'); n++;
  }
  if (n !== 1) throw new Error('dong 2868 xuat hien ' + n + ' lan');
  return L.join('\n');
});
va('Public/Data/Script/event/sijuezhuang/ai_liqiushui.lua', (t) => {
  const cu = 'x893069_EnterKuangBaoTime\t= 20*60*1000   -- [NetCo4 18/10] 10 -> 20 phut (cuong bao 10235 = sat thuong x100), tools/nerf-bangxi-18-10.js';
  if (t.split(cu).length !== 2) throw new Error('moc cuong bao 20 phut');
  return t.replace(cu, 'x893069_EnterKuangBaoTime\t= 10*60*1000   -- [NetCo4 25/10] bo nerf 18/10 (20 -> 10 phut lai), tools/bo-nerf-bangxi-25-10.js');
});
