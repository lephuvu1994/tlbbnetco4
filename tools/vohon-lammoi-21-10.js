// 21/10 (chu server: "vo hon ep vo va mac chi so cong diem do chua dung"): buff chi so (AHa_ReMyBuff, ShuaXinClient 892002) chi chay
// khi dang nhap / doi ban do -> hoc / nang / doi / xoa dong Vo Hon xong chi so (cong / khang / giam khang den am MD 502-505) van la cu.
// Sua: boc x892101_GetWh_XinXT (moi bang Vo Hon cua client deu goi ham nay) - chay ham goc roi goi AHa_ReMyBuff.
// Mac / thao Vo Hon (engine, khong co hook Lua) van can doi ban do.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-vohon-lammoi-21-10.   node tools/vohon-lammoi-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'wuhunxt', 'odali_wuyazi.lua');
const goc = fs.readFileSync(F, 'latin1');
if (goc.includes('x892101_GetWh_XinXT_Goc')) { console.log('LOI: da boc'); process.exit(1); }
if (!goc.includes('function  x892101_GetWh_XinXT(  sceneId,  selfId,keyids,  m_Equip_Idx,  m_Equip_Item,  keyid)')) { console.log('LOI neo GetWh_XinXT'); process.exit(1); }
const nA = goc.indexOf('\n', goc.indexOf('function  x892101_WuhunAttrUpLevel('));
const E = goc[nA - 1] === '\r' ? '\r\n' : '\n';
const s = goc.replace(/\s*$/, '') + E + [
  '',
  '-- [NetCo4 21/10] lam moi buff chi so ngay sau moi thao tac o bang Vo Hon (truoc chi lam moi khi dang nhap / doi ban do)',
  'x892101_GetWh_XinXT_Goc = x892101_GetWh_XinXT',
  'function x892101_GetWh_XinXT( sceneId, selfId, keyids, m_Equip_Idx, m_Equip_Item, keyid )',
  '\tx892101_GetWh_XinXT_Goc( sceneId, selfId, keyids, m_Equip_Idx, m_Equip_Item, keyid )',
  '\tCallScriptFunction( 892002, "AHa_ReMyBuff", sceneId, selfId )',
  'end',
  '',
].join(E);
console.log('odali_wuyazi.lua: boc GetWh_XinXT + AHa_ReMyBuff');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
