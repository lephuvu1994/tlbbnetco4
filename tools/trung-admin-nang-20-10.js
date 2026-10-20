// 20/10 (chu server, sau tools/trung-admin-20-10.js): Trung Lau ADMIN NANG DUOC len ban Chan cua admin o NPC Tuyet Phi Phi
// (wuyazi85o.lua tepp 36, 250 Thien Dia Huyen Tinh, giu lo / bao thach / cuong hoa / khoa nhu cu):
//   Gioi admin 10553113 -> 10422018 (ban "Chan" gia), Ngoc admin 10553114 -> 10423025 (Chan that).
// Van chan: 10422018 (da la ban Chan) va 10423026 (bo khong dung). Truoc do 113 / 114 -> Chan nguoi choi 10553104 / 10553105.
// File latin1 (VISCII), giu CR. Hieu luc sau cap-nhat.sh + restart game.   node tools/trung-admin-nang-20-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public/Data/Script/MyLua/shenqinew/wuyazi85o.lua');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const viscii = (t) => [...t.normalize('NFC')].map((ch) => (ch.charCodeAt(0) < 128 ? ch : String.fromCharCode(VMAP[ch]))).join('');
const mot = (s, a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return s; } return s.replace(a, b); };
const goc = fs.readFileSync(F, 'latin1'); let s = goc;
const msgCu = viscii('Trùng Lâu admin không nâng lên Chân được'), msgMoi = viscii('Món này đã là bản Chân admin, không nâng tiếp được');
s = mot(s, '      if whz == 10553113 or whz == 10553114 or whz == 10422018 or whz == 10423026 then   -- [NetCo4 20/10] Trung Lau admin (chi admin / gift code): khong nang\r\n' +
  '         x895111_NotifyTips( sceneId, selfId, "' + msgCu + '" )',
  '      if whz == 10422018 or whz == 10423026 then   -- [NetCo4 20/10] Trung Lau admin: 10422018 da la ban "Chan" (Gioi), 10423026 bo khong dung -> khong nang\r\n' +
  '         x895111_NotifyTips( sceneId, selfId, "' + msgMoi + '" )', 'khoi chan');
s = mot(s, 'elseif whz == 10553113 then\r\n      idx = 10553104\r\n', 'elseif whz == 10553113 then   -- [NetCo4 20/10] Gioi admin -> ban "Chan" admin 10422018 (truoc: Chan nguoi choi 10553104)\r\n      idx = 10422018\r\n', '113');
s = mot(s, 'elseif whz == 10553114 then\r\n      idx = 10553105\r\n', 'elseif whz == 10553114 then   -- [NetCo4 20/10] Ngoc admin -> Chan-Trung Lau Ngoc admin 10423025 (truoc: Chan nguoi choi 10553105)\r\n      idx = 10423025\r\n', '114');
if (cao(s) !== cao(goc) - cao(msgCu) + cao(msgMoi)) { console.log('LOI lech byte'); loi++; }
if (loi) process.exit(1);
console.log('wuyazi85o.lua: 10553113 -> 10422018, 10553114 -> 10423025; chan 10422018 / 10423026');
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
