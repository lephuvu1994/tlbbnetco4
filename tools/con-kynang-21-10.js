// 21/10 (chu server: kiem con cai): ShuaXinClient.lua x892002_InfantBUFF2 (khang / giam khang tu 4 ky nang con) - he so theo Ngu Nghe:
//  client (Infant.lua 854): hieu qua = floor(SKEffect x floor((100 + floor(100 x tongNguNghe / 445)) x 2) / 100) -> tang DEU tu x2 (chua hoc) toi x4 (max 445).
//  server truoc: SKEffect x 2 x (1 + floor(tong / 445)) -> x2 toi khi Ngu Nghe DU 445 moi nhay x4 (chua max thi mat phan Ngu Nghe).
//  Sau: dung cong thuc client. Phan chi so anh hung / Dien Tich / sao (x892002_InfantBUFF) da khop client 100% (bang giong het) - khong doi.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-con-kynang-21-10.   node tools/con-kynang-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
const goc = fs.readFileSync(F, 'latin1'); let s = goc; let loi = 0;
const a = 'ZH_ratio = ZH_ratio + ZH_ratio1';
const i = s.indexOf(a); if (i < 0 || s.indexOf(a, i + 1) >= 0) { console.log('LOI neo ZH_ratio'); process.exit(1); }
const E = s[s.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n'; const het = s.indexOf('\n', i) + 1;
s = s.slice(0, het) + '-- [NetCo4 21/10] he so giong client Infant.lua: tang deu theo tong Ngu Nghe (truoc chi nhay khi du 445) - tools/con-kynang-21-10.js' + E +
  'local ZH_pct = floor( ( 100 + floor( 100 * ( ZH_Value1 + ZH_Value2 + ZH_Value3 + ZH_Value4 + ZH_Value5 ) / 445 ) ) * x892002_ZH_ratio )' + E + s.slice(het);
for (let k = 1; k <= 4; k++) {
  const cu = 'floor(floor(x892002_Infant_SKEffect[SKILL' + k + '_LV] * x892002_ZH_ratio * ZH_ratio)/1)';
  const n = s.split(cu).length - 1; if (n !== 1) { console.log('LOI ky nang ' + k + ': ' + n + ' cho'); loi++; continue; }
  s = s.replace(cu, 'floor(x892002_Infant_SKEffect[SKILL' + k + '_LV] * ZH_pct / 100)');
}
if (loi) process.exit(1);
console.log('ShuaXinClient.lua: InfantBUFF2 he so Ngu Nghe theo client');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
