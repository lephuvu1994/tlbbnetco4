// 14/10: Tuc Cau - Li Hoa 20700063 30% cho TOAN BO quai (truoc chi boss Ton My My). Qua nho / giua / bong lon (script 402045,
// event/fuben/efuben_cuju_4.lua x402045_OnDie) goi them RoiCfg "tuccau" -> dung chung dong roithem.txt "tuccau 30 20700063" voi boss
// (efuben_cuju.lua x402040_OnDie). Sua ti le: doi so trong roithem.txt tren VPS (hieu luc ngay). Lua, can cap-nhat, khong restart.
//   node tools/tuccau-lihoa-toanbo-14-10.js      (chay tu goc repo; chay lai bao "da sua")
const fs = require('fs');
const P = 'server/Public/Data/Script/event/fuben/efuben_cuju_4.lua';
let t = fs.readFileSync(P, 'latin1');
if (t.includes('"RoiCfg"')) { console.log('da sua, khong lam gi'); process.exit(0); }
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
const h0 = hi(t);
const NEO = /(\tCallScriptFunction\( 950001, "RoiDo", sceneId, objId, killerId, 30600084, 30 \)[^\r\n]*)(\r?\n)/;
const m = t.match(NEO);
if (!m || t.split(m[0]).length !== 2) throw new Error('khong thay dung 1 dong RoiDo Tu Vi trong x402045_OnDie');
t = t.replace(NEO, m[1] + m[2] + '\tCallScriptFunction( 950001, "RoiCfg", sceneId, objId, killerId, "tuccau" )   -- [NetCo4 14/10] moi quai Tuc Cau: roi them theo roithem.txt khoa tuccau (Li Hoa 30%), chung voi boss' + m[2]);
if (hi(t) !== h0) throw new Error('byte > 0x7F bi doi');
fs.writeFileSync(P, t, 'latin1');
console.log('da sua ' + P + ' (byte > 0x7F giu nguyen ' + h0 + ')');
