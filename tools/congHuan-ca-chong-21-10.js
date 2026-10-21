// 21/10 (chu server): Ngu Tu Lenh Thuong 38001089 / 38001090 (+1000 diem Cong Huan Hiep An moi cai, MyLua/xiayin/XiaYin_gongxunquan.lua 880007):
// chuot phai 1 lan AN CA CHONG cung ma (giong Duoc Tran / Nguyen Tinh 7ff4e43). OnDeplete da tru 1 cai; OnActivateOnce tru not phan
// con lai (LuaFnGetAvailableItemCount: cai bi khoa mat khau khong tinh) roi cong 1000 x tong.
// File latin1 (VISCII), giu CR. Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-conghuan-ca-chong-21-10.
//   node tools/congHuan-ca-chong-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'xiayin', 'XiaYin_gongxunquan.lua');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const mot = (s, a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return s; } return s.replace(a, b); };
const goc = fs.readFileSync(F, 'latin1'); let s = goc; const E = '\r\n';
const a1 = '          SetMissionData(  sceneId,  selfId,  RIDEIMPACT1,  0  )' + E;
s = mot(s, a1, a1 +
  '\t   -- [NetCo4 21/10] an CA CHONG cung ma (OnDeplete da tru 1 cai) - tools/congHuan-ca-chong-21-10.js' + E +
  '\t   local  so  =  1' + E +
  '\t   local  conlai  =  LuaFnGetAvailableItemCount(  sceneId,  selfId,  itemmission  )' + E +
  '\t   if  conlai  >  0  and  LuaFnDelAvailableItem(  sceneId,  selfId,  itemmission,  conlai  )  ==  1  then' + E +
  '\t   \t so  =  1  +  conlai' + E +
  '\t   end' + E, 'chen dem');
s = mot(s, 'SetMissionData(  sceneId,  selfId,XIAYIN_GONGXUN,jiayingonsangzhi+x880007_g_item[itemmission])',
  'SetMissionData(  sceneId,  selfId,XIAYIN_GONGXUN,jiayingonsangzhi+x880007_g_item[itemmission]*so)', 'cong diem');
s = mot(s, '"..  x880007_g_item[itemmission].."', '"..  (x880007_g_item[itemmission]*so).."', 'thong bao');
if (cao(s) !== cao(goc)) { console.log('LOI lech byte'); loi++; }
if (loi) process.exit(1);
console.log('XiaYin_gongxunquan.lua: an ca chong 38001089 / 38001090');
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
