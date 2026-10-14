// 14/10: Lau Lan Tam Bao (event/huodong/seek_treasure.lua 808039) - MOI quai (200 quai + boss, ID 12102-12146) roi Tu Phu Tinh Tuy 38002047 40%,
// moi nguoi trong to doi o gan roll rieng (roimap.lua x950001_RoiDo -> x950001_Chia), do roi tren xac quai. Lua, hieu luc sau cap-nhat, khong restart.
//   node tools/lltb-tuphu-14-10.js      (chay tu goc repo; chay lai lan 2 bao "da sua")
const fs = require('fs');
const P = 'server/Public/Data/Script/event/huodong/seek_treasure.lua';
let t = fs.readFileSync(P, 'latin1');
if (t.includes('38002047')) { console.log('da sua, khong lam gi'); process.exit(0); }
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
const h0 = hi(t);
const NEO = /(\tCallScriptFunction\( 950001, "TB_Ghi", sceneId, objId, killerId \)[^\r\n]*)(\r?\n)/;
const m = t.match(NEO);
if (!m || t.split(m[0]).length !== 2) throw new Error('khong thay dung 1 dong TB_Ghi trong x808039_OnDie');
t = t.replace(NEO, m[1] + m[2] + '\tCallScriptFunction( 950001, "RoiDo", sceneId, objId, killerId, 38002047, 40 )   -- [NetCo4 14/10] moi quai: Tu Phu Tinh Tuy 40%, moi nguoi trong to roll rieng' + m[2]);
if (hi(t) !== h0) throw new Error('byte > 0x7F bi doi');
fs.writeFileSync(P, t, 'latin1');
console.log('da sua ' + P + ' (byte > 0x7F giu nguyen ' + h0 + ')');
