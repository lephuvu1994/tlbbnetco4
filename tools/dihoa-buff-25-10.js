// 25/10 (chu server): buff nhe Di Hoa Tiep Moc (Thien Son, skill 498, SkillData 2885-2896).
// Chuoi: SkillData -> impact 800 (cap thap, 20s) / 801 (cap 12, 21s) STD_IMPACT_060 -> moi don danh gan 691/692 (no, ban kinh 4,
// toi da 4 muc tieu) -> 693/694 STD_IMPACT_001 "伤害数值+" = sat thuong co dinh.
// Chot (chu server, phai qua yeu, chi 1 chieu danh lan): sat thuong goc 276 / 300 -> 1800 / 2000; thoi gian 800 / 801 (cot 20,
// "总持续时间(毫秒)") 20s / 21s -> 28s / 30s. Hoi chieu 108s KHONG giam duoc (client co ban SkillData rieng, van to xam 108s).
// Tooltip client (300, 21s) KHONG doi (bang client nam trong OgreMain.dll).
// Server/Config/StandardImpact.txt (file engine nap "./Config/StandardImpact.txt"; 999StandardImpact.txt KHONG duoc nap - 25/10 sua nham file do) (GBK, sua theo byte latin1, giu CRLF). Can cap-nhat + RESTART. Rollback: tag truoc-dihoa-25-10.
//   node tools/dihoa-buff-25-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Server/Config/StandardImpact.txt');
// Lan 3 (chu server): sat thuong 1800 / 2000 -> 2700 / 3000, hoi chieu 108s -> 70s (SkillData_V1.txt 2885-2896 cot 6 "冷却时间",
// engine nap ../Public/Config/SkillData_V1.txt). Client co ban SkillData rieng -> neu nut van xam 108s thi client giu hoi chieu, tra lai 108s.
const DOI = { 693: [[276, 900, 1800], 2700], 694: [[300, 1000, 2000], 3000] };   // [gia tri cu chap nhan], moi
const F_SD = path.join(__dirname, '../server/Public/Config/SkillData_V1.txt');
const HOICHIEU = [108000, 70000];   // 2885-2896 cot 6
const THOIGIAN = { 800: [20000, 28000], 801: [21000, 30000] };   // cot 20, ms
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
  if (k < 0 || !cu.includes(Number(c[k + 1]))) { console.log('LOI dong ' + id + ': cot sat thuong = ' + c[k + 1] + ', mong ' + cu.join('/')); loi++; continue; }
  console.log('impact ' + id + ': sat thuong ' + c[k + 1] + ' -> ' + moi);
  c[k + 1] = String(moi);
  L[i] = c.join('\t');
}
for (const [id, [cu, moi]] of Object.entries(THOIGIAN)) {
  const i = L.findIndex((l) => l.split('\t')[0] === id);
  const c = i < 0 ? [] : L[i].split('\t');
  if (i < 0 || ![cu, moi].includes(Number(c[20]))) { console.log('LOI dong ' + id + ': thoi gian = ' + c[20] + ', mong ' + cu); loi++; continue; }
  console.log('impact ' + id + ': thoi gian ' + c[20] + ' -> ' + moi + ' ms');
  c[20] = String(moi);
  L[i] = c.join('\t');
}
const sd = fs.readFileSync(F_SD).toString('latin1');
const E2 = sd.includes('\r\n') ? '\r\n' : '\n';
const L2 = sd.split(E2);
for (let id = 2885; id <= 2896; id++) {
  const i = L2.findIndex((l) => l.split('\t')[0] === String(id));
  const c = i < 0 ? [] : L2[i].split('\t');
  if (i < 0 || !HOICHIEU.includes(Number(c[6]))) { console.log('LOI SkillData ' + id + ': hoi chieu = ' + c[6]); loi++; continue; }
  c[6] = String(HOICHIEU[1]);
  L2[i] = c.join('\t');
}
console.log('SkillData 2885-2896: hoi chieu -> ' + HOICHIEU[1] + ' ms');
if (loi) { console.log(loi + ' loi, KHONG ghi'); process.exit(1); }
if (process.argv.includes('--ghi')) {
  fs.writeFileSync(F, Buffer.from(L.join(E), 'latin1')); console.log('DA GHI ' + F);
  fs.writeFileSync(F_SD, Buffer.from(L2.join(E2), 'latin1')); console.log('DA GHI ' + F_SD);
}
else console.log('(chay thu, them --ghi de luu)');
