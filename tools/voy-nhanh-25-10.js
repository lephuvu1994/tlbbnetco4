// 25/10 (chu server): Vo Y - "luyen khi" va "tam diem" bam 1 lan lam HET, thay vi 1 diem / lan.
//  File: MyLua/shenqinew/shenqichongxi.lua (script 900033), ham x900033_XIEZI_WUYI.
//  1. xieziId==1 (Luyen Khi, nut giua, mien phi): 1 bam dung HET diem tiem linh dang co, moi diem cong +1 NGAU NHIEN
//     vao 1 trong 9 thuoc tinh (nhu goc, chi khac la lap het trong 1 lan).
//  2. xieziId==2 (nut "-" / tam diem): 1 bam doi HET diem cua thuoc tinh do sang thuoc tinh khac (ngau nhien),
//     TRU DUNG so Tu Phu Tinh Tuy (38002047) + 50.000 kim tien moi diem; chi doi toi da = min(diem, item, tien).
//     Khau tru tien TRUOC roi moi tru item (loi tien thi khong mat item). Da kiem du item/tien truoc khi tru.
//  Ap cho ca item Xiezi Quickly (goi 900033 XIEZI_WUYI 1/2). Lua -> cap-nhat.sh, KHONG restart. Tag truoc-voy-nhanh-25-10.
//    node tools/voy-nhanh-25-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'shenqinew', 'shenqichongxi.lua');
const M = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const R = {}; for (const k in M) R[M[k]] = k;
const vn = (s) => [...s.normalize('NFC')].map((c) => { if (c.charCodeAt(0) < 128) return c; if (M[c] === undefined) throw new Error('thieu VISCII ' + c); return String.fromCharCode(M[c]); }).join('');
const de = (s) => [...s].map((c) => (c.charCodeAt(0) > 127 && R[c.charCodeAt(0)] ? R[c.charCodeAt(0)] : c)).join('');
const E = '\r\n';
let s = fs.readFileSync(F, 'latin1');

// thay toan bo doan [dong chua startSub .. dong chua endSub] bang moi (moi = mang dong, noi bang CRLF)
function thaySpan(startSub, endSub, moiLines, ten) {
  const i = s.indexOf(startSub); if (i < 0) throw new Error('khong thay START: ' + ten);
  if (s.indexOf(startSub, i + 1) >= 0) throw new Error('START khong duy nhat: ' + ten);
  const j = s.indexOf(endSub); if (j < 0) throw new Error('khong thay END: ' + ten);
  if (s.indexOf(endSub, j + 1) >= 0) throw new Error('END khong duy nhat: ' + ten);
  const ls = s.lastIndexOf('\n', i) + 1;
  let le = s.indexOf('\n', j); if (le < 0) le = s.length;
  s = s.slice(0, ls) + moiLines.join(E) + E + s.slice(le + 1);
  console.log(ten + ': thay ' + (le - ls) + ' byte');
}

// ---------- 1) xieziId==1: luyen khi dung het ----------
const br = (n, op, v) => '                      SetMissionData(sceneId,selfId,WUYI_' + n + ',GetMissionData(sceneId,selfId,WUYI_' + n + ')' + op + v + ')';
thaySpan(
  'SetMissionData(sceneId,selfId,WUYI_1,GetMissionData(sceneId,selfId,WUYI_1)-10000)',
  'x900033_WUYI_Refresh1(sceneId,selfId,SuiJiPoint)',
  [
    '                for KLap = 1, QianLingNum do   -- [NetCo4 25/10] luyen khi: 1 bam dung het diem tiem linh',
    '                SetMissionData(sceneId,selfId,WUYI_1,GetMissionData(sceneId,selfId,WUYI_1)-10000)',
    '                local  SuiJiPoint  =  random(1,9)',
    '                if  SuiJiPoint  ==  1  then',
    br(1, '+', 1),
    '                elseif  SuiJiPoint  ==  2  then', br(2, '+', 10000),
    '                elseif  SuiJiPoint  ==  3  then', br(2, '+', 1),
    '                elseif  SuiJiPoint  ==  4  then', br(3, '+', 10000),
    '                elseif  SuiJiPoint  ==  5  then', br(3, '+', 1),
    '                elseif  SuiJiPoint  ==  6  then', br(4, '+', 10000),
    '                elseif  SuiJiPoint  ==  7  then', br(4, '+', 1),
    '                elseif  SuiJiPoint  ==  8  then', br(5, '+', 10000),
    '                elseif  SuiJiPoint  ==  9  then', br(5, '+', 1),
    '                end',
    '                end',
    '                CallScriptFunction(892002,"AHa_ReMyBuff",sceneId,selfId)',
    '                LuaFnSendSpecificImpactToUnit(sceneId,  selfId,  selfId,  selfId,  148,  0)',
    '                x900033_NotifyTips(  sceneId,  selfId,  "' + vn(' Đã luyện khí ') + '"..QianLingNum.."' + vn(' điểm tiềm linh, cộng ngẫu nhiên vào thuộc tính. ') + '"  )',
    '                for KI = 1, 9 do x900033_WUYI_Refresh1(sceneId,selfId,KI) end',
  ], 'xieziId==1 luyen khi',
);

// ---------- 2) xieziId==2: tam diem doi het + tru dung item/tien ----------
const wx = (k, n, part) => '                            WuYiSX[' + k + ']  =  ' + (part === 'hi' ? 'floor(GetMissionData(sceneId,selfId,WUYI_' + n + ')/10000)' : 'mod(GetMissionData(sceneId,selfId,WUYI_' + n + '),10000)');
thaySpan(
  'local  KillPoint  =  sxpot  +  1',
  'x900033_WUYI_Refresh1(sceneId,selfId,NewPoint)',
  [
    '                local  KillPoint  =  sxpot  +  1',
    '                local  WuYiSX  =  {}',
    wx(0, 1, 'hi'), wx(1, 1, 'lo'), wx(2, 2, 'hi'), wx(3, 2, 'lo'), wx(4, 3, 'hi'), wx(5, 3, 'lo'),
    wx(6, 4, 'hi'), wx(7, 4, 'lo'), wx(8, 5, 'hi'), wx(9, 5, 'lo'),
    '                -- [NetCo4 25/10] tam diem: 1 bam doi HET diem thuoc tinh nay, tru dung Tu Phu Tinh Tuy + 50.000 moi diem',
    '                local  DiemCo  =  WuYiSX[KillPoint]',
    '                if  DiemCo  <=  0  then',
    '                      x900033_NotifyTips(  sceneId,  selfId,  "' + vn(' Thuộc tính này không có điểm, không thể tắm. ') + '"  )',
    '                      return',
    '                end',
    '                local  ItemCo  =  LuaFnGetAvailableItemCount(sceneId,  selfId,  38002047)',
    '                local  TienCo  =  floor((LuaFnGetMoney(sceneId,selfId)+GetMoneyJZ(sceneId,selfId))/50000)',
    '                local  SoDoi  =  DiemCo',
    '                if  ItemCo  <  SoDoi  then  SoDoi  =  ItemCo  end',
    '                if  TienCo  <  SoDoi  then  SoDoi  =  TienCo  end',
    '                if  SoDoi  <=  0  then',
    '                      x900033_NotifyTips(  sceneId,  selfId,  "' + vn(' Cần Tử Phủ Tinh Tủy và 50.000 kim tiền cho mỗi điểm muốn dời. ') + '"  )',
    '                      return',
    '                end',
    '                local  nDelJZ,  nDelMoney  =  LuaFnCostMoneyWithPriority(sceneId,  selfId,  SoDoi*50000)',
    '                if  nDelJZ  ==  -1  then',
    '                      x900033_NotifyTips(  sceneId,  selfId,  "' + vn(' Kim tiền khấu trừ thất bại. ') + '"  )',
    '                      return',
    '                end',
    '                LuaFnDelAvailableItem(sceneId,selfId,38002047,SoDoi)',
    '                for KLap = 1, SoDoi do',
    '                      local  NewPoint  =  random(1,9)',
    '                      if  NewPoint  ==  KillPoint  then',
    '                            if  KillPoint  <=  5  then  NewPoint  =  KillPoint  +  1  else  NewPoint  =  KillPoint  -  1  end',
    '                      end',
    '                      WuYiSX[KillPoint]  =  WuYiSX[KillPoint]  -  1',
    '                      WuYiSX[NewPoint]  =  WuYiSX[NewPoint]  +  1',
    '                end',
    '                SetMissionData(sceneId,selfId,WUYI_1,WuYiSX[0]*10^4+WuYiSX[1])',
    '                SetMissionData(sceneId,selfId,WUYI_2,WuYiSX[2]*10^4+WuYiSX[3])',
    '                SetMissionData(sceneId,selfId,WUYI_3,WuYiSX[4]*10^4+WuYiSX[5])',
    '                SetMissionData(sceneId,selfId,WUYI_4,WuYiSX[6]*10^4+WuYiSX[7])',
    '                SetMissionData(sceneId,selfId,WUYI_5,WuYiSX[8]*10^4+WuYiSX[9])',
    '                CallScriptFunction(892002,"AHa_ReMyBuff",sceneId,selfId)',
    '                LuaFnSendSpecificImpactToUnit(sceneId,  selfId,  selfId,  selfId,  148,  0)',
    '                x900033_NotifyTips(  sceneId,  selfId,  "' + vn(' Đã dời ') + '"..SoDoi.."' + vn(' điểm sang thuộc tính khác. ') + '"  )',
    '                for KI = 1, 9 do x900033_WUYI_Refresh1(sceneId,selfId,KI) end',
  ], 'xieziId==2 tam diem',
);

if (process.argv.includes('--ghi')) { fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI ' + F); }
else {
  console.log('\n(chay thu) ----- vung xieziId==1 sau sua:');
  const d = de(s).split('\n'); let a = d.findIndex((l) => l.includes('if  xieziId  ==  1  then'));
  console.log(d.slice(a, a + 30).map((l) => l.replace(/\r/, '')).join('\n'));
  console.log('\n----- vung xieziId==2 sau sua:');
  let b = d.findIndex((l) => l.includes('local  KillPoint  =  sxpot  +  1'));
  console.log(d.slice(b - 1, b + 48).map((l) => l.replace(/\r/, '')).join('\n'));
}
