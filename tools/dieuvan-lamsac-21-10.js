// 21/10 (chu server: kiem Dieu Van): ShuaXinClient.lua - Dieu Van lam sac (Vong Vo ww / Minh Tuong mx / Ngu Kinh yj / Bao No bn):
//  1. XZ_LANSEDIAOWEN (MD 437) ma hoa ca 4 cap theo vi tri so (ww x1, mx x100, yj x10000, bn x1000000) nhung code GHI DE
//     (SetMissionData = mx*100...) -> co Vong Vo + 1 loai khac thi mat cap Vong Vo -> SuangHaia.lua (899039) khong cong sat thuong Vong Vo.
//     Sua: cong don vao gia tri vua dat 0.
//  2. ww/mx/yj/bn = TONG cap tren moi mon (x892002_Get_DWXS): > 10 thi Vong Vo bi bo qua (SuangHaia chi nhan 1-10), Minh Tuong 9790+mx-1
//     tran sang hieu ung Ngu Kinh (9800+)... Sua: tran 10.
//  Bang so (hieu ung 9790-9819 10..150%, Vong Vo 15..360 sat thuong) da khop client TargetFrame.lua GetDW.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-dieuvan-lamsac-21-10.   node tools/dieuvan-lamsac-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
const goc = fs.readFileSync(F, 'latin1'); let s = goc; let loi = 0;
const mot = (a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return; } s = s.replace(a, b); };
const a0 = '           SetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN, 0)';
const E = s[s.indexOf('\n', s.indexOf(a0)) - 1] === '\r' ? '\r\n' : '\n';
mot(a0, a0 + E + '           -- [NetCo4 21/10] tran 10 (tong cap nhieu mon): Vong Vo > 10 bi bo qua, Minh Tuong / Ngu Kinh tran sang hieu ung loai khac' + E +
  '           if ww > 10 then ww = 10 end' + E + '           if mx > 10 then mx = 10 end' + E + '           if yj > 10 then yj = 10 end' + E + '           if bn > 10 then bn = 10 end', 'neo dat 0');
const XZ = 'GetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN) + ';
mot('SetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN, ww )', 'SetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN, ' + XZ + 'ww )   -- [NetCo4 21/10] cong don (truoc ghi de)', 'ww');
mot('SetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN, mx*100 )', 'SetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN, ' + XZ + 'mx*100 )', 'mx');
mot('SetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN, yj*10000 )', 'SetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN, ' + XZ + 'yj*10000 )', 'yj');
mot('SetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN, bn*1000000 )', 'SetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN, ' + XZ + 'bn*1000000 )', 'bn');
if (loi) process.exit(1);
console.log('ShuaXinClient.lua: Dieu Van lam sac cong don + tran 10');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
