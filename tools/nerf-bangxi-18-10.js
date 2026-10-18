// 18/10 (chu server): nerf Bang Xi (Tu Tuyet Trang, boss cuoi 14145, AI script 893069 event/sijuezhuang/ai_liqiushui.lua).
// (1) Server/Config/StandardImpact.txt dong 2868 "Tinh La Ky Bo (sat thuong truc tiep)" - CHI Bang Xi dung (SkillData 26107 Hac Bach
//     Song Van 1638 = chieu A moi 60 giay, 26108 Tinh La Ky Bo 1639 = chieu C moi 5 giay + chieu D moi 20 giay, danh ca to):
//     50556 + 12.99766997 -> 20000 + 5.2 (~ -60%). Dong 2856 / 2867 cung so nhung khong chieu nao dung -> khong doi.
// (2) Cuong bao (buff 10235 "tang sat thuong 9999%" = gap 100 lan) sau 10 -> 20 phut, chi rieng Bang Xi (x893069_EnterKuangBaoTime).
//     Buff 10235 dung chung voi boss PMF / Bang Than -> khong sua bang.
// Bang .txt can cap-nhat + RESTART; Lua sau cap-nhat. Rollback: tag truoc-nerf-bangxi-18-10
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
    const cu = '\t50556\t12.99766997\t';
    if (L[i].split(cu).length !== 2) throw new Error('dong 2868 khong co moc');
    L[i] = L[i].replace(cu, '\t20000\t5.2\t'); n++;
  }
  if (n !== 1) throw new Error('dong 2868 xuat hien ' + n + ' lan');
  return L.join('\n');
});
va('Public/Data/Script/event/sijuezhuang/ai_liqiushui.lua', (t) => {
  const cu = 'x893069_EnterKuangBaoTime\t= 10*60*1000';
  if (t.split(cu).length !== 2) throw new Error('moc cuong bao');
  return t.replace(cu, 'x893069_EnterKuangBaoTime\t= 20*60*1000   -- [NetCo4 18/10] 10 -> 20 phut (cuong bao 10235 = sat thuong x100), tools/nerf-bangxi-18-10.js');
});
