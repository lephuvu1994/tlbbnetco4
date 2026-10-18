// 18/10: vo hieu 12 So cap Hoan Dong Dan 30309150-30309161 (obj/item/huantongdan_4.lua, script 300100).
// 60 ID pet dich (25009, 25049, 25309...) KHONG co trong PetAttrTable.txt, ma OnActivateOnce tru tien -> XOA pet cu
// -> moi tao pet moi => tao that bai, nguoi choi mat pet + tien. Comment cac dong x300100_g_itemList[30309150..161]
// => CanOperate tra "chua mo dao cu" ngay o OnConditionCheck, khong tru dan / tien / pet. 30309162+ giu nguyen.
// Lua, can cap-nhat, khong restart. Chay: node tools/hoandongdan-18-10.js. Rollback: tag truoc-hoandongdan-18-10
const fs = require('fs');
const p = __dirname + '/../server/Public/Data/Script/obj/item/huantongdan_4.lua';
const t = fs.readFileSync(p, 'latin1');
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
const re = /^x300100_g_itemList\[(3030915\d|3030916[01])\]/;
let n = 0;
const out = t.split('\n').map((l) => (re.test(l) ? (n++, '--' + l) : l)).join('\n');
if (n !== 72) throw new Error('so dong khop = ' + n + ', can 72 (12 dan x 6 dong) - da chay roi hoac file da doi');
if (hi(out) !== hi(t)) throw new Error('so byte > 0x7f thay doi');
fs.writeFileSync(p, out, 'latin1');
console.log('da comment ' + n + ' dong (12 dan)');
