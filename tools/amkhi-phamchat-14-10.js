// 14/10: tay pham chat am khi (Item::ResetDarkQuality: pham chat = cot 102 EquipBase + bac x 40 + rand 0..39; bac boc theo trong so phan nghin
// trong Server/Config/DarkConfigTable.ini). Chu server chot: Thien Thoi Than Ngoc (HighDark) bac 4 (2160-2199 o am khi cap 90) 0,5% -> 10%,
// Bach Thoi Thach (LowDark) 0,2% -> 3%. DefaultDark (am khi moi tao) giu nguyen. File .ini doc luc khoi dong -> can cap-nhat + RESTART.
//   node tools/amkhi-phamchat-14-10.js      (chay tu goc repo)
const fs = require('fs');
const P = 'server/Server/Config/DarkConfigTable.ini';
const MOI = { LowDark_Quality_GorwRate: [500, 270, 150, 50, 30], HighDark_Quality_GorwRate: [0, 550, 250, 100, 100] };
let t = fs.readFileSync(P, 'latin1');
for (const [k, ds] of Object.entries(MOI)) {
  if (ds.reduce((a, b) => a + b, 0) !== 1000) throw new Error(k + ' tong khac 1000');
  ds.forEach((v, i) => {
    const re = new RegExp('^(' + k + i + '=)\d+', 'm');
    if (!re.test(t)) throw new Error('khong thay ' + k + i);
    t = t.replace(re, '$1' + v);
  });
}
fs.writeFileSync(P, t, 'latin1');
console.log(t.replace(/\r/g, ''));
