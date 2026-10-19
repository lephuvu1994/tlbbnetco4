// 19/10: Hop thanh Hon Bang Chau (Vo Nhai Tu, 892101 x892101_WuhunHunBinShu) cho len toi cap 6 (GM cu chan >= 6).
// stopid = NumText - 631 = cap dich; vong lap hop g_hubin2[i] -> g_hubin2[i+1] voi i < stopid.
// Van chan cap 7+: g_hubin2[7] ghi nham 20309106 (5 vien cap 6 -> 1 vien cap 6).
// Sua theo latin1 (file VISCII), giu CRLF. Chay: node tools/hbc-hop-cap6-19-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Public/Data/Script/MyLua/wuhunxt/odali_wuyazi.lua');
let s = fs.readFileSync(F, 'latin1');
const doi = [
  ['if  mod((NumText  -  632),8)+1  >=  6  then', 'if  mod((NumText  -  632),8)+1  >=  7  then'],
  ['Hồn Băng Châu lên Cấp 6,'.replace(/[^\x00-\x7f]/g, c => String.fromCharCode(JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'))[c])), null],
];
const a = doi[0][0], b = doi[0][1];
if (s.split(a).length !== 2) throw new Error('khong thay dung 1 cho dieu kien chan');
s = s.replace(a, b);
const m = doi[1][0]; if (s.split(m).length !== 2) throw new Error('khong thay dung 1 cau bao');
s = s.replace(m, m.replace('Cấp 6'.replace(/[^\x00-\x7f]/g, c => String.fromCharCode(JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'))[c])), 'C\xe1p 7'.replace('\xe1', String.fromCharCode(JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'))['ấ']))));
console.log('dieu kien: >= 6 -> >= 7; cau bao: Cap 6 -> Cap 7');
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI'); }
