// 19/10 (chu server): tay diem Am khi o Yen Thanh - admin chon thuoc tinh nao DUOC nhan diem (panel: "Tay diem Am khi").
// Engine Item::AdjustAppendAttr(nguon 0..4): can nguon > 1, rut 1 diem nguon, cong 1 cho 1 trong 4 thuoc tinh con lai (rand deu).
// (CGAskDarkAdjustHandler da tru 1 -> attrfrom Lua = 0..4 = Luc, Linh khi, The luc, Dinh luc, Than phap.)
// Vá obj/item/darkitem.lua (332207): neu diem roi vao thuoc tinh bi tat -> day tiep CHINH diem do bang engine toi khi roi vao
// thuoc tinh bat (khac nguon). Tong diem khong doi, thuoc tinh khac giu nguyen. Ca 5 bat / khong co file -> y nhu goc.
// Lua, khong restart. Chay: node tools/amkhitay-19-10.js. Rollback: tag truoc-amkhitay-19-10
const fs = require('fs');
const R = __dirname + '/../';
const p = R + 'server/Public/Data/Script/obj/item/darkitem.lua';
const M = JSON.parse(fs.readFileSync(R + 'tools/viscii-map.json', 'utf8'));
const vn = (s) => [...s].map((c) => { if (c.charCodeAt(0) < 128) return c; if (M[c] === undefined) throw new Error('khong ma hoa duoc ' + c); return String.fromCharCode(92) + String(M[c]).padStart(3, '0'); }).join('');
let t = fs.readFileSync(p, 'latin1');
if (t.includes('NetCo4_Tay')) throw new Error('da va roi');
const NL = '\r\n';
const L = (a) => a.join(NL) + NL;
const ham = 'function x332207_DarkAttrAdjustForBagItem( sceneId, selfId, bagpos, attrfrom )';
if (t.split(ham).length !== 2) throw new Error('khong thay ham tay diem');
const them = L([
  '-- NetCo4 19/10: admin chon thuoc tinh duoc nhan diem khi tay (panel -> ./txt/NetCo4Cfg/amkhitay.txt, 1 dong "1 1 1 1 1"',
  '-- = Luc, Linh khi, The luc, Dinh luc, Than phap; 0 = khong nhan). Khong co file / ca 5 = 1 -> y nhu goc. Doc moi lan tay.',
  'x332207_NetCo4_TayFile = "./txt/NetCo4Cfg/amkhitay.txt"',
  '',
  'function x332207_NetCo4_TayCfg()',
  '\tlocal bat = { 1, 1, 1, 1, 1 }',
  '\tlocal h = openfile( x332207_NetCo4_TayFile, "r" )',
  '\tif h == nil then',
  '\t\treturn bat',
  '\tend',
  '\tlocal line = read( h, "*l" )',
  '\tclosefile( h )',
  '\tif line == nil then',
  '\t\treturn bat',
  '\tend',
  '\tlocal _, _, a, b, c, d, e = strfind( line, "^%s*([01])%s+([01])%s+([01])%s+([01])%s+([01])" )',
  '\tif a == nil then',
  '\t\treturn bat',
  '\tend',
  '\treturn { tonumber( a ), tonumber( b ), tonumber( c ), tonumber( d ), tonumber( e ) }',
  'end',
  '',
  '-- Engine rut 1 diem tu attrfrom cho 1 thuoc tinh khac ngau nhien. Roi vao thuoc tinh tat (hoac quay ve nguon) -> day tiep',
  '-- chinh diem do (nguon moi = noi vua nhan, luc nay >= 2 nen engine cho rut). Tra ve noi diem nam lai (0..4) hoac -1.',
  'function x332207_NetCo4_TayDiem( sceneId, selfId, bagpos, attrfrom, bat )',
  '\tlocal nTo = AdjustDarkAttrForBagItem( sceneId, selfId, bagpos, attrfrom )',
  '\tlocal i = 0',
  '\twhile nTo >= 0 and nTo <= 4 and ( nTo == attrfrom or bat[ nTo + 1 ] ~= 1 ) and i < 100 do',
  '\t\tlocal nNext = AdjustDarkAttrForBagItem( sceneId, selfId, bagpos, nTo )',
  '\t\tif nNext < 0 or nNext > 4 then',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tnTo = nNext',
  '\t\ti = i + 1',
  '\tend',
  '\treturn nTo',
  'end',
  '',
]);
t = t.replace(ham, them + ham);
// chan som (truoc khi tru da / tien) neu khong con thuoc tinh bat nao khac nguon
const sau = '\tif (nAttrValue <= 1) then' + NL + '\t\tDarkOperateResult(sceneId, selfId, 0, -1);' + NL + '\t\treturn' + NL + '\tend' + NL;
const i0 = t.indexOf(sau, t.indexOf(ham));
if (i0 < 0) throw new Error('khong thay check nAttrValue');
const chan = L([
  '\t',
  '\t-- NetCo4 19/10: cong tac admin',
  '\tlocal bat = x332207_NetCo4_TayCfg()',
  '\tlocal nCo = 0',
  '\tfor k = 0, 4 do',
  '\t\tif k ~= attrfrom and bat[ k + 1 ] == 1 then',
  '\t\t\tnCo = nCo + 1',
  '\t\tend',
  '\tend',
  '\tif nCo == 0 then',
  '\t\tx332207_ShowNotice( sceneId, selfId, "' + vn('Hiện không có thuộc tính nào khác được nhận điểm khi tẩy thuộc tính này.') + '" )',
  '\t\treturn',
  '\tend',
]);
t = t.slice(0, i0 + sau.length) + chan + t.slice(i0 + sau.length);
const goc = '\tlocal nAttrTo = AdjustDarkAttrForBagItem(sceneId, selfId, bagpos, attrfrom );';
if (t.split(goc).length !== 2) throw new Error('khong thay lenh AdjustDarkAttrForBagItem');
t = t.replace(goc, '\tlocal nAttrTo = x332207_NetCo4_TayDiem( sceneId, selfId, bagpos, attrfrom, bat );   -- NetCo4 19/10 (goc: AdjustDarkAttrForBagItem)');
fs.writeFileSync(p, t, 'latin1');
console.log('da va ' + p);
