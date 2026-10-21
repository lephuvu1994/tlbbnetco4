// 21/10 (chu server): Vo Hon - nang nhanh dong thuoc tinh mo rong bang Nhuan Hon Thach, giong nang nhanh ky nang pet (10/10).
// odali_wuyazi.lua (892101, client WuhunExtraPropertyUp goi GetWh_XinXT nhanh 14 -> x892101_WuhunAttrUpLevel): bam 1 lan nang 1 cap nhu goc,
// thanh cong thi NANG TIEP dong do toi cap 8: moi cap can dung 1 vien Nhuan Hon Thach dung cap (x892101_WuhunSuxingve[chu][cap], lay
// bat ky vien nao trong tui khong khoa) + 5 vang nhu goc; thieu da / vang thi dung va bao. Sua dung vi tri dong (khong gsub chuoi).
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-vohon-nangnhanh-21-10.   node tools/vohon-nangnhanh-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'wuhunxt', 'odali_wuyazi.lua');
const VM = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const vn = (t) => [...t].map((c) => (VM[c] !== undefined ? String.fromCharCode(VM[c]) : c)).join('');
const goc = fs.readFileSync(F, 'latin1'); let s = goc;
const nA = goc.indexOf('\n', goc.indexOf('function  x892101_WuhunAttrUpLevel('));
const E = goc[nA - 1] === '\r' ? '\r\n' : '\n';   // file tron LF / CRLF: theo dong cua ham dang sua
if (s.includes('x892101_NangNhanhDong')) { console.log('LOI: da co NangNhanhDong'); process.exit(1); }
const i0 = s.indexOf('function  x892101_WuhunAttrUpLevel(  sceneId,  selfId,  equitid,  itemid,idssea)');
const i1 = s.indexOf('LuaFnCostMoneyWithPriority(  sceneId,  selfId,  50000  );', i0);
const i2 = s.indexOf('function  x892101_WuhunAttrUpLevelGongGao', i0);
if (i0 < 0 || i1 < 0 || i2 < 0 || i1 > i2) { console.log('LOI neo WuhunAttrUpLevel'); process.exit(1); }
const dongTB = s.indexOf(E, i1) + E.length;            // dong NotifyFailBox "chuc mung..." ngay sau tru tien
const het = s.indexOf(E, dongTB) + E.length;
if (!s.slice(dongTB, het).includes('x892101_NotifyFailBox') || !s.slice(het).startsWith('end')) { console.log('LOI neo dong chuc mung'); process.exit(1); }
s = s.slice(0, het) + 'x892101_NangNhanhDong(  sceneId,  selfId,  equitid,  idssea  )   -- [NetCo4 21/10] nang tiep toi cap 8 - tools/vohon-nangnhanh-21-10.js' + E + s.slice(het);

const ham = [
  '',
  '-- [NetCo4 21/10] chu server: nang nhanh dong thuoc tinh mo rong Vo Hon (sau khi cap dau thanh cong o WuhunAttrUpLevel).',
  '-- Moi cap: 1 Nhuan Hon Thach dung cap (bang x892101_WuhunSuxingve) + 50000 tien nhu goc. Toi cap 8 hoac het da / tien thi dung.',
  'function x892101_NangNhanhDong( sceneId, selfId, equitid, idssea )',
  '\tlocal them = 0',
  '\tlocal lydo = ""',
  '\tlocal capMoi = 0',
  '\tlocal chu = ""',
  '\tfor lan = 1, 7 do',
  '\t\tif LuaFnIsItemAvailable( sceneId, selfId, equitid ) ~= 1 then',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tlocal _, skilstring = LuaFnGetItemCreator( sceneId, selfId, equitid )',
  '\t\tif skilstring == nil then',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tlocal bd = strfind( skilstring, "&WH%w%w"..strrep("%w",16)..strrep("%w",6).."%w" )',
  '\t\tif bd == nil then',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tlocal vt = 0',
  '\t\tlocal dem = 0',
  '\t\tfor k = 0, 7 do',
  '\t\t\tlocal p = bd + 5 + k * 2',
  '\t\t\tif strsub( skilstring, p, p + 1 ) ~= "00" then',
  '\t\t\t\tdem = dem + 1',
  '\t\t\t\tif dem == idssea then',
  '\t\t\t\t\tvt = p',
  '\t\t\t\tend',
  '\t\t\tend',
  '\t\tend',
  '\t\tif vt == 0 then',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tchu = strsub( skilstring, vt, vt )',
  '\t\tlocal cap = tonumber( strsub( skilstring, vt + 1, vt + 1 ) )',
  '\t\tif cap == nil or cap < 1 or cap >= 8 or x892101_WuhunSuxingve[chu] == nil then',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tlocal da = x892101_WuhunSuxingve[chu][cap]',
  '\t\tif LuaFnGetAvailableItemCount( sceneId, selfId, da ) < 1 then',
  '\t\t\tlydo = "' + vn(', dừng: thiếu ') + '#{_ITEM"..da.."}"',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tif GetMoney( sceneId, selfId ) + GetMoneyJZ( sceneId, selfId ) < 50000 then',
  '\t\t\tlydo = "' + vn(', dừng: không đủ vàng (5 vàng / cấp)') + '"',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tif LuaFnDelAvailableItem( sceneId, selfId, da, 1 ) ~= 1 then',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tLuaFnCostMoneyWithPriority( sceneId, selfId, 50000 )',
  '\t\tcapMoi = cap + 1',
  '\t\tLuaFnSetItemCreator( sceneId, selfId, equitid, strsub( skilstring, 1, vt ) .. capMoi .. strsub( skilstring, vt + 2 ) )',
  '\t\tthem = them + 1',
  '\tend',
  '\tif them > 0 then',
  '\t\tLuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, 49, 0 )',
  '\t\tx892101_NotifyFailBox( sceneId, selfId, "' + vn('Nâng nhanh: thêm ') + '"..them.."' + vn(' cấp, dòng') + '"..x892101_iText[chu].."' + vn('lên cấp ') + '"..capMoi..lydo )',
  '\telseif lydo ~= "" then',
  '\t\tx892101_NotifyFailBox( sceneId, selfId, "' + vn('Nâng nhanh') + '"..lydo )',
  '\tend',
  'end',
  '',
].join(E);
s = s.replace(/\s*$/, '') + E + ham;
console.log('odali_wuyazi.lua: them x892101_NangNhanhDong + goi sau khi nang 1 cap thanh cong');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
