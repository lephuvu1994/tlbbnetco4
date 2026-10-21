// 21/10 (chu server): Vo Hon - nang nhanh KY NANG (bang "Thang cap ky nang Vo Hon", Hon Bang Chau), giong nang nhanh dong thuoc tinh.
// odali_wuyazi.lua x892101_WuhunSkillUp (GetWh_XinXT nhanh 17): moi lan bam 1 cap (toi da 6), 1 Hon Bang Chau dung cap (x892101_g_hubin2[cap moi])
// + 60000 tien. Boc ham: cap dau thanh cong -> goi lai ham goc toi cap 6 (moi cap kiem / tru y nhu goc, ca DelSkill/AddSkill), nuot thong bao
// tung cap, cuoi cung bao 1 cau "them N cap ... dung: <ly do>". Lua -> cap-nhat.sh, KHONG can restart.
// Rollback: tag truoc-vohon-kynang-nhanh-21-10.   node tools/vohon-kynang-nhanh-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'wuhunxt', 'odali_wuyazi.lua');
const VM = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const vn = (t) => [...t].map((c) => (VM[c] !== undefined ? String.fromCharCode(VM[c]) : c)).join('');
const goc = fs.readFileSync(F, 'latin1');
if (goc.includes('x892101_WuhunSkillUp_Goc')) { console.log('LOI: da boc'); process.exit(1); }
if (!goc.includes('function  x892101_WuhunSkillUp(  sceneId,  selfId,  equitid,idosoebn)')) { console.log('LOI neo WuhunSkillUp'); process.exit(1); }
const nA = goc.indexOf('\n', goc.indexOf('function  x892101_WuhunAttrUpLevel('));
const E = goc[nA - 1] === '\r' ? '\r\n' : '\n';
const s = goc.replace(/\s*$/, '') + E + [
  '',
  '-- [NetCo4 21/10] nang nhanh ky nang Vo Hon: cap dau thanh cong -> nang tiep toi cap 6 (moi cap nhu goc) - tools/vohon-kynang-nhanh-21-10.js',
  'function x892101_NN_CapKN( sceneId, selfId, equitid, o )',
  '\tif o == nil or o < 1 or o > 3 then',
  '\t\treturn -1',
  '\tend',
  '\tlocal _, s = LuaFnGetItemCreator( sceneId, selfId, equitid )',
  '\tif s == nil then',
  '\t\treturn -1',
  '\tend',
  '\tlocal x, z, a1, l1, a2, l2, a3, l3 = strfind( s, "&WH"..strrep("%w",18).."(%w)(%d)(%w)(%d)(%w)(%d)"..strrep("%w",1) )',
  '\tif x == nil then',
  '\t\treturn -1',
  '\tend',
  '\tlocal t = { l1, l2, l3 }',
  '\tlocal v = tonumber( t[o] )',
  '\tif v == nil then',
  '\t\treturn -1',
  '\tend',
  '\treturn v',
  'end',
  '',
  'function x892101_NN_Nuot( sceneId, selfId, msg )',
  '\tx892101_NN_Msg = msg',
  'end',
  '',
  'x892101_WuhunSkillUp_Goc = x892101_WuhunSkillUp',
  'function x892101_WuhunSkillUp( sceneId, selfId, equitid, idosoebn )',
  '\tlocal truoc = x892101_NN_CapKN( sceneId, selfId, equitid, idosoebn )',
  '\tx892101_WuhunSkillUp_Goc( sceneId, selfId, equitid, idosoebn )',
  '\tlocal cap = x892101_NN_CapKN( sceneId, selfId, equitid, idosoebn )',
  '\tif truoc < 0 or cap <= truoc then',
  '\t\treturn',
  '\tend',
  '\tlocal them = 0',
  '\tlocal lydo = ""',
  '\tlocal baoGoc = x892101_NotifyFailBox',
  '\tfor lan = 1, 5 do',
  '\t\tif cap >= 6 then',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tx892101_NN_Msg = ""',
  '\t\tx892101_NotifyFailBox = x892101_NN_Nuot',
  '\t\tx892101_WuhunSkillUp_Goc( sceneId, selfId, equitid, idosoebn )',
  '\t\tx892101_NotifyFailBox = baoGoc',
  '\t\tlocal moi = x892101_NN_CapKN( sceneId, selfId, equitid, idosoebn )',
  '\t\tif moi <= cap then',
  '\t\t\tlydo = x892101_NN_Msg',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tcap = moi',
  '\t\tthem = them + 1',
  '\tend',
  '\tx892101_NotifyFailBox = baoGoc',
  '\tif them > 0 then',
  '\t\tlocal t = "' + vn('Nâng nhanh kỹ năng: thêm ') + '"..them.."' + vn(' cấp, giờ cấp ') + '"..cap',
  '\t\tif lydo ~= "" then',
  '\t\t\tt = t.."' + vn(', dừng: ') + '"..lydo',
  '\t\tend',
  '\t\tx892101_NotifyFailBox( sceneId, selfId, t )',
  '\telseif lydo ~= "" then',
  '\t\tx892101_NotifyFailBox( sceneId, selfId, "' + vn('Nâng nhanh kỹ năng, dừng: ') + '"..lydo )',
  '\tend',
  'end',
  '',
].join(E);
// + GetWuhunSkillNum (lam moi bang, -990 + sau moi lan nang) doc mau cu "_"+16 -> Vo Hon &WH khong khop -> luon bao sai 'Moi bo vao Vo Hon da Linh Ngo...'. Sua mau theo &WH.
const MAU_CU = 'strfind(skilstring,"_"..strrep("%w",16).."(%w%d)(%w%d)(%w%d)"..strrep("%w",9))';
const MAU_MOI = 'strfind(skilstring,"&WH"..strrep("%w",18).."(%w%d)(%w%d)(%w%d)"..strrep("%w",1))   -- [NetCo4 21/10] mau cu "_" khong khop Vo Hon &WH';
if (s.split(MAU_CU).length !== 2) { console.log('LOI mau GetWuhunSkillNum'); process.exit(1); }
const s2 = s.replace(MAU_CU, MAU_MOI);
console.log('odali_wuyazi.lua: boc WuhunSkillUp (nang nhanh toi cap 6) + sua mau GetWuhunSkillNum');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s2, 'latin1'); console.log('DA GHI');
