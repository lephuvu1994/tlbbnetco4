// 21/10 (chu server: "dat 4 cuon cap 1 vao bi mat het"): odali_wuyazi.lua (892101) - cac bang Vo Hon tru nguyen lieu bang
// LuaFnEraseItem(o tui) = XOA CA CHONG -> dat chong 4 Nhuan Hon Thach / 2 sach thuoc tinh vao o thi mat het, chi duoc 1 lan.
// Sua: ham x892101_TruMot - chong > 1 thi tru 1 (LuaFnDelAvailableItem cung ID), con 1 thi xoa o nhu cu.
// Ap dung: hop thanh (chung minh 38001101-108), doi thuoc tinh (di hon), nang cap thuoc tinh (Nhuan Hon Thach),
// mo o thuoc tinh (Lan Moc Tien / Pha Thien Tien), hoc thuoc tinh (Chuc Tinh Thu). Khong dong vao cho xoa chinh Vo Hon.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-vohon-trumot-21-10.   node tools/vohon-trumot-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'wuhunxt', 'odali_wuyazi.lua');
const goc = fs.readFileSync(F, 'latin1');
if (goc.includes('x892101_TruMot')) { console.log('LOI: da co TruMot'); process.exit(1); }
const L = goc.split('\n'); let loi = 0;
// [ten ham chua dong, bien o tui]
const CHO = [['x892101_WuhunJinShen', 'svbzbbcf'], ['x892101_WuhunAttrSub', 'itemid'], ['x892101_WuhunAttrUpLevel', 'itemid'],
  ['x892101_WuhunTypeSlot', 'm_Equip_Item'], ['x892101_WuhunAttrStudey', 'm_Equip_Item']];
for (const [ham, bien] of CHO) {
  const d = L.findIndex((l) => l.startsWith('function  ' + ham + '('));
  if (d < 0) { console.log('LOI khong thay ' + ham); loi++; continue; }
  let k = d + 1, gap = -1;
  for (; k < L.length && !/^function /.test(L[k]); k++) {
    const m = L[k].match(new RegExp('^(\\s*)LuaFnEraseItem\\(  sceneId,  selfId,  ' + bien + '  \\)(\\r?)$'));
    if (m) { if (gap >= 0) { console.log('LOI 2 cho trong ' + ham); loi++; } gap = k; L[k] = m[1] + 'x892101_TruMot(  sceneId,  selfId,  ' + bien + '  )   -- [NetCo4 21/10] tru 1 (truoc xoa ca chong)' + m[2]; }
  }
  if (gap < 0) { console.log('LOI khong thay EraseItem ' + bien + ' trong ' + ham); loi++; } else console.log(ham + ': dong ' + (gap + 1));
}
if (loi) process.exit(1);
let s = L.join('\n');
const nA = goc.indexOf('\n', goc.indexOf('function  x892101_WuhunAttrUpLevel('));
const E = goc[nA - 1] === '\r' ? '\r\n' : '\n';
s = s.replace(/\s*$/, '') + E + [
  '',
  '-- [NetCo4 21/10] tru 1 mon o o tui pos: chong > 1 thi tru 1 cung ID (LuaFnEraseItem xoa ca chong), con 1 thi xoa o nhu cu',
  'function x892101_TruMot( sceneId, selfId, pos )',
  '\tlocal id = LuaFnGetItemTableIndexByIndex( sceneId, selfId, pos )',
  '\tif id ~= nil and id > 0 and LuaFnGetItemCountInBagPos( sceneId, selfId, pos ) > 1 then',
  '\t\tif LuaFnDelAvailableItem( sceneId, selfId, id, 1 ) == 1 then',
  '\t\t\treturn',
  '\t\tend',
  '\tend',
  '\tLuaFnEraseItem( sceneId, selfId, pos )',
  'end',
  '',
].join(E);
console.log('odali_wuyazi.lua: them x892101_TruMot');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
