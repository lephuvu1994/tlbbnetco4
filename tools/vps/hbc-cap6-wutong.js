// 19/10: Vo Dong (Lac Duong) = Script/new/event/wuhun/wutong.lua (895099), CHI CO TREN VPS (Script/new trung ten
// Script/New tren Windows -> khong co trong repo). Ap cung 2 sua nhu 892101 (tools/hbc-hop-cap6-19-10.js + hbc-thongbao-19-10.js):
//  (1) hop Hon Bang Chau mo toi cap 6: chan ">= 6" -> ">= 7" (cap 7+ van chan: g_hubin2[7] ghi nham 20309106), cau bao "Cap 6" -> "Cap 7"
//  (2) khong hop duoc vien nao -> bao so vien tung cap + "can 5 vien cung cap" thay cau "khong co / da bi khoa".
// Chay tren VPS (can viscii-map.json cung thu muc):
//   node hbc-cap6-wutong.js [--ghi]     (--ghi: sao luu /opt/tlbb-backup/wutong.lua-truoc-hbc-cap6-<ngay gio> roi ghi)
// Lua -> hieu luc ngay (server nap lai script moi lan goi), khong restart. Hoan tac: chep ban sao luu ve.
const fs = require('fs'), path = require('path');
const F = '/opt/tlbb-root/home/tlbb/Public/Data/Script/new/event/wuhun/wutong.lua';
const vis = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const V = t => t.replace(/[^\x00-\x7f]/g, c => { if (vis[c] === undefined) throw new Error('VISCII thieu: ' + c); return String.fromCharCode(vis[c]); });
let s = fs.readFileSync(F, 'latin1');
const mot = (a, b) => { if (s.split(a).length !== 2) throw new Error('khong thay dung 1 cho: ' + a.slice(0, 60)); s = s.replace(a, b); };
mot('if  mod((NumText  -  632),8)+1  >=  6  then', 'if  mod((NumText  -  632),8)+1  >=  7  then');
mot(V('Hồn Băng Châu lên Cấp 6!'), V('Hồn Băng Châu lên Cấp 7!'));
const cu = V('x895099_ShowNotice(  sceneId,  selfId,  targetId,  " Trên người không có Hồn Băng Châu hoặc đã bị khóa ",2)');
if (s.split(cu).length !== 2) throw new Error('khong thay dung 1 cau bao cu');
const i = s.indexOf(cu), dau = s.lastIndexOf('\n', i) + 1, thut = s.slice(dau, i);
const eol = s.slice(i + cu.length).startsWith('\r\n') ? '\r\n' : '\n';
s = s.replace(cu, [
  V('local  tbao  =  "Chưa đủ Hồn Băng Châu để hợp lên cấp "..stopid..": cần 5 viên cùng cấp (không bị khóa) mới hợp lên cấp kế tiếp. Đang có:"'),
  'for  k  =  1,stopid-1  do',
  V('\ttbao  =  tbao.." cấp "..k..": "..LuaFnGetAvailableItemCount(sceneId,  selfId,  x895099_g_hubin2[k]).." viên;"'),
  'end',
  'x895099_ShowNotice(  sceneId,  selfId,  targetId,  tbao,2)',
].map(l => thut + l).join(eol).slice(thut.length));
if (!s.includes('local  stopid  =  NumText-631')) throw new Error('khong thay bien stopid');
console.log('OK: chan >= 7, cau bao Cap 7, cau bao so vien tung cap');
if (process.argv.includes('--ghi')) {
  const t = new Date(Date.now() + 7 * 3600e3).toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const bk = '/opt/tlbb-backup/wutong.lua-truoc-hbc-cap6-' + t; fs.copyFileSync(F, bk);
  fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI, sao luu: ' + bk);
}
