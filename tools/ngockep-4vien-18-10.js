// 18/10 (chu server chot "chi va"): ghep ngoc kep (MyLua/mingjingshi/Gem_ZuoKeFenLi.lua 290205, OnDoubleGemzhuoke).
// Client Gemzhuoke.lua bat 4 vien phu (ngoc <= cap 8) va kiem ca 4; bua 38000446 ghi "tu khoa" (4 vien). Server cu chi kiem ma 3 vien
// (vong for i = 1, 3: ItemIndex2-4), vien thu 4 (ItemIndex5) KHONG kiem ma nhung van LuaFnEraseItem -> sua goi tin nhet mon rac
// vao o 4 = tiet kiem 1 ngoc / lan ghep. Chen kiem ItemIndex5 cung ma voi 3 vien kia (biaoshi == 1 = ngoc <= cap 8; cap 9 bi chan san).
// Lua, can cap-nhat, khong restart. Chay: node tools/ngockep-4vien-18-10.js. Rollback: tag truoc-ngockep-4vien-18-10
const fs = require('fs');
const p = __dirname + '/../server/Public/Data/Script/MyLua/mingjingshi/Gem_ZuoKeFenLi.lua';
const t = fs.readFileSync(p, 'latin1');
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
const re = /(\tfor i = 1, 3 do\r?\n\t\tif LuaFnGetItemTableIndexByIndex\(sceneId, selfId, itemindex\[i\]\) ~= itemid then\r?\n\t\t\tx290205_NotifyFailTips\(sceneId, selfId, ("[^"\r\n]*")\)\r?\n\t\t\treturn\r?\n\t\tend\r?\n\tend(\r?\n))/;
const m = t.match(re);
if (!m) throw new Error('khong thay vong kiem 3 vien (da chay roi / file doi?)');
if (t.includes('[NetCo4 18/10] kiem vien phu thu 4')) throw new Error('da chay roi');
const nl = m[3];   // giu kieu xuong dong cua file (CRLF)
const them = ['\t-- [NetCo4 18/10] kiem vien phu thu 4 (client bat 4 vien, server cu chi kiem 3)',
  '\tif biaoshi == 1 and LuaFnGetItemTableIndexByIndex(sceneId, selfId, ItemIndex5) ~= itemid then',
  '\t\tx290205_NotifyFailTips(sceneId, selfId, ' + m[2] + ')',
  '\t\treturn',
  '\tend', ''].join(nl);
const o = t.replace(re, m[1] + them);
if (hi(o) - hi(t) !== hi(m[2])) throw new Error('so byte > 0x7f lech');
fs.writeFileSync(p, o, 'latin1');
console.log('da chen kiem vien thu 4');
