// Mo phong x888899_GCNhap (eprize.lua, tools/giftcode-20-10.js) bang fengari (Lua 5.3) + shim ham Lua 4 / game, FS ao. node tools/giftcode-sim.js
const fs = require('fs');
const { lua, lauxlib, lualib, to_luastring } = require(process.env.FENGARI || "fengari");   // npm i fengari@0.1.4 (scratchpad)
const SRC = fs.readFileSync(String.raw`D:\TeraBoxDownload\TLBBFULLTOOL\netco4\github-repo\server\Public\Data\Script\event\prize\eprize.lua`, 'latin1');
const i0 = SRC.indexOf('x888899_g_GCDir = ');
const GC = SRC.slice(i0);
const VMAP = JSON.parse(fs.readFileSync(String.raw`D:\TeraBoxDownload\TLBBFULLTOOL\netco4\github-repo\tools\viscii-map.json`, 'utf8'));
const REV = {}; for (const [k, b] of Object.entries(VMAP)) REV[b] = k;
const dv = (s) => [...s].map((c) => REV[c.charCodeAt(0)] || c).join('');

const SHIM = `
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
run(`FILES["${D}giftcode.txt"] = "NC4-HETHAN|1700000000|0|item 20310185 1\\nNC4-7KQ9X2MP|0|1|item 20310185 1;knb 100;level 99\\nNC4-NHIEU|0|0|item 1 2\\n"`);
run(`FILES["${D}giftcode-acc.txt"] = "1010100025 bialk\\n1010100026 bialk\\n1010100030 hoang01\\n1010100031 hoang02\\n"`);
run('NOW = 1792480000');
let ok = 0, sai = 0;
const thu = (ten, guid, card, mong, extra) => {
  run(`TIPS = {}; CALLS = 0; GUID = ${guid}`);
  run(`x888899_GCNhap(0, 0, "${card}")`);
  const tip = dv(lstr('TIPS[#TIPS]') || ''), calls = Number(lstr('tostring(CALLS)'));
  const dat = tip.includes(mong) && (!extra || extra(calls));
  console.log((dat ? 'OK  ' : 'LOI ') + ten + ' | ' + tip + ' | calls ' + calls); dat ? ok++ : sai++;
};
thu('ma het han', 1010100025, 'NC4-HETHAN', 'hết hạn');
thu('ma khong ton tai', 1010100025, 'ABCD', 'không tồn tại');
thu('ma qua ngan', 1010100025, 'ab', 'không hợp lệ');
thu('nhan vat chua co trong map', 1010100099, 'NC4-7KQ9X2MP', 'Nhân vật mới');
thu('dung lan dau (chu thuong + dau cach) -> thanh cong, goi NhanQua', 1010100025, ' nc4-7kq9x2mp ', 'thành công: NC4-7KQ9X2MP', (c) => c === 1);
thu('cung tai khoan, nhan vat khac -> da dung', 1010100026, 'NC4-7KQ9X2MP', 'đã dùng mã này');
thu('tai khoan khac, ma 1 luot -> het luot', 1010100030, 'NC4-7KQ9X2MP', 'hết lượt');
thu('ma khong gioi han: hoang01', 1010100030, 'NC4-NHIEU', 'thành công');
thu('ma khong gioi han: hoang02', 1010100031, 'NC4-NHIEU', 'thành công');
const dung = lstr(`FILES["${D}giftcode-dung.txt"]`), q25 = lstr(`FILES["./txt/NetCo4Qua/1010100025.txt"]`);
const c1 = dung.split('\n')[0];
const dungOk = /^NC4-7KQ9X2MP\|bialk\|1010100025\|1792480000$/.test(c1) && dung.split('\n').filter(Boolean).length === 3;
console.log((dungOk ? 'OK  ' : 'LOI ') + 'giftcode-dung.txt dung dinh dang | ' + JSON.stringify(dung)); dungOk ? ok++ : sai++;
const qOk = q25 === '\nitem 20310185 1\nknb 100\n';
console.log((qOk ? 'OK  ' : 'LOI ') + 'hang qua: item + knb, bo dong "level 99" | ' + JSON.stringify(q25)); qOk ? ok++ : sai++;
console.log(ok + ' / ' + (ok + sai) + ' OK'); process.exitCode = sai ? 1 : 0;
