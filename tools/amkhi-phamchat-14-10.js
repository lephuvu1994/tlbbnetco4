// 14/10: tay pham chat am khi (Item::ResetDarkQuality: pham chat = cot 102 EquipBase + bac x 40 + rand 0..39; bac boc theo trong so phan nghin
// trong Server/Config/DarkConfigTable.ini). Chu server chot: Thien Thoi Than Ngoc (HighDark) bac 4 (2160-2199 o am khi cap 90) 0,5% -> 10%,
// Bach Thoi Thach (LowDark) 0,2% -> 3%. DefaultDark (am khi moi tao) giu nguyen. File .ini doc luc khoi dong -> can cap-nhat + RESTART.
//   node tools/amkhi-phamchat-14-10.js      (chay tu goc repo; chay lai lan 2 khong doi gi them)
// 14/10: ban dau tao file nay bang heredoc Git Bash -> mat dau "\" trong regex, tool khong sua duoc gi (commit 2a20c43). Viet lai, khong dung "\".
const fs = require('fs');
const P = 'server/Server/Config/DarkConfigTable.ini';
const MOI = { LowDark_Quality_GorwRate: [500, 270, 150, 50, 30], HighDark_Quality_GorwRate: [0, 550, 250, 100, 100] };
const t = fs.readFileSync(P, 'latin1');
const nl = t.includes('\r\n') ? '\r\n' : '\n';
const thay = {};
for (const [k, ds] of Object.entries(MOI)) {
  if (ds.reduce((a, b) => a + b, 0) !== 1000) throw new Error(k + ' tong khac 1000');
  ds.forEach((v, i) => { thay[k + i] = String(v); });
}
const gap = new Set();
const out = t.split(nl).map((l) => {
  const j = l.indexOf('=');
  const k = j > 0 ? l.slice(0, j) : '';
  if (k in thay) { gap.add(k); return k + '=' + thay[k]; }
  return l;
});
const thieu = Object.keys(thay).filter((k) => !gap.has(k));
if (thieu.length) throw new Error('khong thay: ' + thieu.join(', '));
fs.writeFileSync(P, out.join(nl), 'latin1');
console.log(out.filter((l) => /Dark/.test(l)).join('\n'));
