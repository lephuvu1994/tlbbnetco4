// Mo phong giftcode trong game (CDK.lua x999999_XuKaJiHuo2 -> x999999_GCNhap, tools/giftcode-tl-20-10.js) bang fengari (Lua 5.3)
// + shim ham Lua 4 / game, FS ao. Client gui 6 ky tu sau "TL" duoi dang MA BYTE.   FENGARI=<duong dan> node tools/giftcode-sim.js
const fs = require('fs'), path = require('path');
const { lua, lauxlib, lualib, to_luastring } = require(process.env.FENGARI || 'fengari');   // npm i fengari@0.1.4
const SRC = fs.readFileSync(path.join(__dirname, '../server/Public/Data/Script/CDK/CDK.lua'), 'latin1');
const GC = SRC.slice(SRC.indexOf('x999999_g_GCKyTu = '), SRC.indexOf('function x999999_XuKaJiHuo3'));
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const REV = {}; for (const [k, b] of Object.entries(VMAP)) REV[b] = k;
const dv = (s) => [...s].map((c) => REV[c.charCodeAt(0)] || c).join('');
const SHIM = `
x999999_g_Dir = "./txt/NetCo4Web/"
FILES = FILES or {}
TIPS = {}
CALLS = 0
strfind = string.find; strsub = string.sub; strlen = string.len; tinsert = table.insert
function getn(t) return #t end
function openfile(p, m)
  if m == "r" then
    if FILES[p] == nil then return nil end
    local ls = {}
    for l in string.gmatch(FILES[p], "([^\\n]*)\\n") do ls[#ls + 1] = l end
    return { lines = ls, i = 0 }
  end
  if m == "a" then return { p = p } end
  if m == "w" then FILES[p] = ""; return { p = p } end
end
function read(h, f) h.i = h.i + 1; return h.lines[h.i] end
function write(h, s) FILES[h.p] = (FILES[h.p] or "") .. s end
function closefile(h) end
function BeginEvent() end
function AddText(s, m) TIPS[#TIPS + 1] = m end
function EndEvent() end
function DispatchMissionTips() end
function LuaFnGetCurrentTime() return NOW end
function LuaFnGetGUID() return GUID end
function CallScriptFunction() CALLS = CALLS + 1 end
`;
const L = lauxlib.luaL_newstate(); lualib.luaL_openlibs(L);
const run = (code) => { const buf = Buffer.from(code, 'latin1'); if (lauxlib.luaL_loadbuffer(L, buf, null, to_luastring('chunk')) !== 0 || lua.lua_pcall(L, 0, lua.LUA_MULTRET, 0) !== 0) throw new Error(lua.lua_tojsstring(L, -1)); };
const lstr = (expr) => { run('__R = ' + expr); lua.lua_getglobal(L, to_luastring('__R')); const b = lua.lua_tolstring(L, -1); lua.lua_pop(L, 1); return b ? Buffer.from(b).toString('latin1') : null; };
run(SHIM); run(GC);
const D = './txt/NetCo4Web/';
run(`FILES["${D}giftcode.txt"] = "TLHETHAN|1700000000|0|item 20310185 1\\nTLK7Q9X2|0|1|item 20310185 1;knb 100;level 99\\nTLNHIEU2|0|0|item 1 2\\n"`);
run(`FILES["${D}giftcode-acc.txt"] = "1010100025 bialk\\n1010100026 bialk\\n1010100030 hoang01\\n1010100031 hoang02\\n"`);
run('NOW = 1792480000');
let ok = 0, sai = 0;
// nguoi choi go `go` (8 ky tu, client da kiem "TL") -> client gui byte ky tu 3..8
const thu = (ten, guid, go, mong, extra) => {
  const b = [...go.slice(2)].map((c) => c.charCodeAt(0)).join(', ');
  run(`TIPS = {}; CALLS = 0; GUID = ${guid}`);
  run(`x999999_XuKaJiHuo2(0, 0, ${b})`);
  const tip = dv(lstr('TIPS[#TIPS]') || ''), calls = Number(lstr('tostring(CALLS)'));
  const dat = tip.includes(mong) && (!extra || extra(calls));
  console.log((dat ? 'OK  ' : 'LOI ') + ten + ' | ' + tip + ' | calls ' + calls); dat ? ok++ : sai++;
};
thu('ma het han', 1010100025, 'TLHETHAN', 'hết hạn');
thu('ma khong ton tai', 1010100025, 'TLABCDEF', 'không tồn tại: TLABCDEF');
thu('ky tu la (dau -)', 1010100025, 'TLK7-9X2', 'chỉ gồm chữ và số');
thu('nhan vat chua co trong map', 1010100099, 'TLK7Q9X2', 'Nhân vật mới');
thu('dung lan dau (go chu thuong) -> thanh cong, goi NhanQua', 1010100025, 'TLk7q9x2', 'thành công: TLK7Q9X2', (c) => c === 1);
thu('cung tai khoan, nhan vat khac -> da dung', 1010100026, 'TLK7Q9X2', 'đã dùng mã này');
thu('tai khoan khac, ma 1 luot -> het luot', 1010100030, 'TLK7Q9X2', 'hết lượt');
thu('ma khong gioi han: hoang01', 1010100030, 'TLNHIEU2', 'thành công');
thu('ma khong gioi han: hoang02', 1010100031, 'TLNHIEU2', 'thành công');
const dung = lstr(`FILES["${D}giftcode-dung.txt"]`), q25 = lstr('FILES["./txt/NetCo4Qua/1010100025.txt"]');
const dungOk = /^TLK7Q9X2\|bialk\|1010100025\|1792480000$/.test(dung.split('\n')[0]) && dung.split('\n').filter(Boolean).length === 3;
console.log((dungOk ? 'OK  ' : 'LOI ') + 'giftcode-dung.txt dung dinh dang | ' + JSON.stringify(dung)); dungOk ? ok++ : sai++;
const qOk = q25 === '\nitem 20310185 1\nknb 100\n';
console.log((qOk ? 'OK  ' : 'LOI ') + 'hang qua: item + knb, bo dong "level 99" | ' + JSON.stringify(q25)); qOk ? ok++ : sai++;
console.log(ok + ' / ' + (ok + sai) + ' OK'); process.exitCode = sai ? 1 : 0;
