// 19/10: Hop thanh Hon Bang Chau (892101 x892101_WuhunHunBinShu): khi khong hop duoc vien nao, cau bao cu
// "Tren nguoi khong co Hon Bang Chau hoac da bi khoa" gay hieu lam (hoang05 co 3-4 vien cap 3, can 5).
// Thay bang cau bao so vien tung cap (cap 1 .. cap dich - 1) + "can 5 vien cung cap". Chu VISCII qua tools/viscii-map.json.
// Chay: node tools/hbc-thongbao-19-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Public/Data/Script/MyLua/wuhunxt/odali_wuyazi.lua');
const vis = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const V = t => t.replace(/[^\x00-\x7f]/g, c => { if (vis[c] === undefined) throw new Error('VISCII thieu: ' + c); return String.fromCharCode(vis[c]); });
let s = fs.readFileSync(F, 'latin1');
const cu = V('x892101_ShowNotice(  sceneId,  selfId,  targetId,  " Trên người không có Hồn Băng Châu hoặc đã bị khóa ",2)');
if (s.split(cu).length !== 2) throw new Error('khong thay dung 1 cau bao cu');
const i = s.indexOf(cu), dau = s.lastIndexOf('\n', i) + 1, thut = s.slice(dau, i);
const eol = s.slice(i + cu.length).startsWith('\r\n') ? '\r\n' : '\n';
const moi = [
  V('local  tbao  =  "Chưa đủ Hồn Băng Châu để hợp lên cấp "..stopid..": cần 5 viên cùng cấp (không bị khóa) mới hợp lên cấp kế tiếp. Đang có:"'),
  'for  k  =  1,stopid-1  do',
  V('\ttbao  =  tbao.." cấp "..k..": "..LuaFnGetAvailableItemCount(sceneId,  selfId,  x892101_g_hubin2[k]).." viên;"'),
  'end',
  'x892101_ShowNotice(  sceneId,  selfId,  targetId,  tbao,2)',
].map(l => thut + l).join(eol).slice(thut.length);
s = s.replace(cu, moi);
console.log('thay cau bao (giu thut dau dong, ' + JSON.stringify(eol) + ')');
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI'); }
