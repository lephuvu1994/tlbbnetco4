// 25/10 (chu server): buff nhe Di Hoa Tiep Moc (Thien Son, skill 498, SkillData 2885-2896).
// Chuoi: SkillData -> impact 800 (cap thap, 20s) / 801 (cap 12, 21s) STD_IMPACT_060 -> moi don danh gan 691/692 (no, ban kinh 4,
// toi da 4 muc tieu) -> 693/694 STD_IMPACT_001 "伤害数值+" = sat thuong co dinh. Goc 276 / 300 -> 900 / 1000.
// Hoi chieu 108s, thoi gian 21s giu nguyen. Tooltip client (300) KHONG doi (bang client nam trong OgreMain.dll).
// Server/Config/999StandardImpact.txt (GBK, sua theo byte latin1, giu CRLF). Can cap-nhat + RESTART. Rollback: tag truoc-dihoa-25-10.
//   node tools/dihoa-buff-25-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Server/Config/999StandardImpact.txt');
const DOI = { 693: [276, 900], 694: [300, 1000] };
const raw = fs.readFileSync(F);
const s = raw.toString('latin1');
const E = s.includes('\r\n') ? '\r\n' : '\n';
const L = s.split(E);
const gbk = new TextDecoder('gbk');
let loi = 0;
for (const [id, [cu, moi]] of Object.entries(DOI)) {
  const i = L.findIndex((l) => l.split('\t')[0] === id);
  if (i < 0) { console.log('LOI khong co dong ' + id); loi++; continue; }
  const c = L[i].split('\t');
  const k = gbk.decode(Buffer.from(L[i], 'latin1')).split('\t').indexOf('伤害数值+');
  if (k < 0 || Number(c[k + 1]) !== cu) { console.log('LOI dong ' + id + ': cot sat thuong = ' + c[k + 1] + ', mong ' + cu); loi++; continue; }
  c[k + 1] = String(moi);
  L[i] = c.join('\t');
  console.log('impact ' + id + ': sat thuong ' + cu + ' -> ' + moi);
}
if (loi) { console.log(loi + ' loi, KHONG ghi'); process.exit(1); }
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, Buffer.from(L.join(E), 'latin1')); console.log('DA GHI ' + F); }
else console.log('(chay thu, them --ghi de luu)');
