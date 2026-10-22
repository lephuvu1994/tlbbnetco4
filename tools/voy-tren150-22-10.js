// 22/10 (chu server: "trong 10 ngay max thi de exp sao"): nhan noi tuc RIENG cho nguoi co Vo Y >= 150 (tran moi 250, bang noi tuc 151-250 ~53,8 ty).
// Thap Ma Can quai ~105: (770 + 1050) x 15 (moi noi) x 18 (ban do train) = 491.400 / con. Tran 3.000 con / ngay.
// x5 -> ~2,46 trieu / con: 3.000 con / ngay ~7,3 ngay, 2.000 con / ngay ~11 ngay (thuong noi tuc x2 thi nhanh hon).
// Nguoi duoi 150 KHONG doi (khong dung he so chung voy.txt / panel). Doi he so: sua x002015_VoYTren150 (1 = tat).
// obj/dali/odali_fanhua.lua x002015_WuyiExpUp. Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-voy-tren150-22-10.
//   node tools/voy-tren150-22-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'obj', 'dali', 'odali_fanhua.lua');
const goc = fs.readFileSync(F, 'latin1'); let s = goc; let loi = 0;
const mot = (a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return; } s = s.replace(a, b); };
const fn = 'function  x002015_WuyiExpUp(  sceneId,selfId,number  )';
const i = s.indexOf(fn);
if (i < 0) { console.log('LOI neo WuyiExpUp'); process.exit(1); }
const E = s[s.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n';
mot(fn, '-- [NetCo4 22/10] he so noi tuc rieng cho Vo Y >= 150 (1 = tat) - tools/voy-tren150-22-10.js' + E + 'x002015_VoYTren150 = 5' + E + fn, 'ham');
const a = '        x002015_JianCe(sceneId,selfId)' + E;
mot(a, a +
  '        if  x002015_VoYTren150  ~=  nil  and  x002015_VoYTren150  >  1  and  mod(GetMissionData(sceneId,selfId,WUYI_LEVEL),10000)  >=  150  then   -- [NetCo4 22/10]' + E +
  '              number  =  number  *  x002015_VoYTren150' + E +
  '        end' + E, 'sau JianCe');
if (loi) process.exit(1);
console.log('odali_fanhua.lua: noi tuc x5 cho Vo Y >= 150');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
