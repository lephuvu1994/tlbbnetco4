// 21/10 (chu server, vu khi Minh Ton cua bialk mat dong Thang Linh tren tooltip sau khi "nang Vuong Quyen"):
//  Loi: obj/dali/xian1z.lua (391060 MsgBox32Goc, txpp 100 = Vuong Quyen) KHONG kiem mon da Thien Dao (chuoi nguoi che co "t#p<n>")
//  -> them "w#p1", "w#p2"... vao mon Thien Dao. Client (SuperToolTip.lua) cong VQ + (TD + 10): <= 19 hien SAI (vd TD 8 + w#p1 = "Thien Dao 9"),
//  > 19 thi KHONG hien gi; server XIEZI_SL con cong ca 2 muc (thuong thang linh du).
//  1. xian1z.lua: nhanh Vuong Quyen tu choi mon da co t#p (truoc khi tru Tu Vi Linh Phach / vang).
//  2. NetCo4/quatang.lua (950000 NhanQua, chay moi lan dang nhap / doi ban do): mon trang bi trong TUI co ca t#p lan w#p -> bo w#p<n>
//     (giu Thien Dao). Mon dang MAC khong quet duoc (Lua chi doc chuoi nguoi che theo o tui) -> thao ra tui roi doi ban do.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-thanglinh-vq-td-21-10.   node tools/thanglinh-vq-td-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const v = (t) => [...t.normalize('NFC')].map((ch) => { if (ch.charCodeAt(0) < 128) return ch; const b = VMAP[ch]; if (b === undefined) { console.log('LOI VISCII thieu ' + ch); loi++; return '?'; } return String.fromCharCode(b); }).join('');
const esc = (t) => [...t.normalize('NFC')].map((ch) => { const c = ch.charCodeAt(0); if (c < 128) return ch; const b = VMAP[ch]; if (b === undefined) { console.log('LOI VISCII thieu ' + ch); loi++; return '?'; } return '\\' + String(b).padStart(3, '0'); }).join('');
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const ra = {};
// 1. xian1z
{
  const f = 'obj/dali/xian1z.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1'); const E = '\r\n';
  const i = goc.indexOf('      if  txpp  ==  100  then'); const a = '\t if  lw20  >=  9  then'; const j = goc.indexOf(a, i);
  if (i < 0 || j < 0 || j - i > 400) { console.log('LOI xian1z: khong thay nhanh Vuong Quyen'); process.exit(1); }
  const msg = v('Trang bị đã thăng linh Thiên Đạo, không nâng Vương Quyền được nữa');
  const s = goc.slice(0, j) + '\t if  x391060_level2(sceneId,  selfId,  lwIndex)  >=  1  then   -- [NetCo4 21/10] mon da Thien Dao (t#p) khong nang Vuong Quyen (tools/thanglinh-vq-td-21-10.js)' + E +
    '\t \t x391060_NotifyTip(  sceneId,  selfId,  "' + msg + '"  )' + E + '\t \t return' + E + '\t end' + E + goc.slice(j);
  if (cao(s) !== cao(goc) + cao(msg)) { console.log('LOI lech byte xian1z'); loi++; }
  ra[f] = s; console.log(f + ': chan Vuong Quyen tren mon Thien Dao');
}
// 2. quatang
{
  const f = 'NetCo4/quatang.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1');
  const a = '\tx950000_TamPhap1( sceneId, selfId )   -- [NetCo4 03/10] tam phap nhan vat cu ve 1 (1 lan)\n';
  if (goc.split(a).length !== 2) { console.log('LOI quatang: khong thay neo TamPhap1'); process.exit(1); }
  let s = goc.replace(a, a + '\tx950000_SuaThangLinh( sceneId, selfId )   -- [NetCo4 21/10] mon Thien Dao bi gan nham Vuong Quyen -> bo w#p\n');
  const fn = [
    '',
    '-- [NetCo4 21/10] xian1z.lua tung cho "nang Vuong Quyen" mon da Thien Dao -> chuoi nguoi che co ca t#p<n> va w#p<n>: tooltip client cong 2 muc',
    '-- (> 19 thi mat dong Thang Linh) va XIEZI_SL cong du. Quet mon trang bi trong TUI, bo w#p<n> (giu Thien Dao). Mon dang mac: thao ra tui roi doi ban do.',
    'function x950000_SuaThangLinh( sceneId, selfId )',
    '\tlocal het = LuaFnGetMaterialEndBagPos( sceneId, selfId )',
    '\tif het == nil or het < 0 then',
    '\t\treturn',
    '\tend',
    '\tlocal n = 0',
    '\tfor p = 0, het do',
    '\t\tlocal id = LuaFnGetItemTableIndexByIndex( sceneId, selfId, p )',
    '\t\tif id ~= nil and id >= 10000010 and id < 10957019 then',
    '\t\t\tlocal _, ten = LuaFnGetItemCreator( sceneId, selfId, p )',
    '\t\t\tif ten ~= nil and strfind( ten, "t#p" ) ~= nil and strfind( ten, "w#p" ) ~= nil then',
    '\t\t\t\twhile strfind( ten, "w#p%d" ) ~= nil do',
    '\t\t\t\t\tten = gsub( ten, "w#p%d", "", 1 )',
    '\t\t\t\tend',
    '\t\t\t\tLuaFnSetItemCreator( sceneId, selfId, p, ten )',
    '\t\t\t\tLuaFnRefreshItemInfo( sceneId, selfId, p )',
    '\t\t\t\tn = n + 1',
    '\t\t\tend',
    '\t\tend',
    '\tend',
    '\tif n > 0 then',
    '\t\tx950000_Tip( sceneId, selfId, "' + esc('Đã sửa thăng linh cho ') + '"..n.."' + esc(' món (bỏ Vương Quyền gắn nhầm trên đồ Thiên Đạo)') + '" )',
    '\tend',
    'end',
    '',
  ].join('\n');
  s = s.replace('\nfunction x950000_Tip( sceneId, selfId, msg )', fn + '\nfunction x950000_Tip( sceneId, selfId, msg )');
  if (s.split('function x950000_SuaThangLinh').length !== 2) { console.log('LOI quatang: khong chen duoc ham'); loi++; }
  if (/[^\x00-\x7f]/.test(s)) { console.log('LOI quatang: co ky tu ngoai ASCII'); loi++; }
  ra[f] = s; console.log(f + ': x950000_SuaThangLinh trong NhanQua');
}
if (loi) process.exit(1);
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
for (const [f, s] of Object.entries(ra)) fs.writeFileSync(path.join(S, f), s, 'latin1');
console.log('DA GHI');
