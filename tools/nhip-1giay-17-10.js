// 17/10 (chu server): Ky Cuoc / Tuc Cau / Lau Lan Tam Bao ra 1 dot quai MOI 1 GIAY. Cho dau giu nguyen.
//   Ky Cuoc 401001 (thuong) + 401002 (nhanh): intervalTickCount 3 (nhanh 3/2) -> 1 (tick 1 giay) => 200 quan co trong ~200 giay.
//   Tuc Cau 402040: qua nho nCurTime-nPreTime >= 3 -> >= 1; 3 lan ra qua lon (buoc 24/54/124) cho 3 giay x3 -> 1 giay x3.
//     Dem nguoc dau (buoc 0-4, >= 2) GIU.
//   Lau Lan Tam Bao 808039: tick 5 giay -> 1 giay (dot nhanh nhat cu = 1 tick = 5 giay). Doi lai moi hang so tinh theo tick:
//     LimitTotalHoldTime 720 -> 3600 (van 60 phut), StartTickCount 2 -> 10 (cho dau van 10 giay), CloseTick 6 -> 30 (van 30 giay),
//     speed 3 -> 1, nghi sau dot 30 van 30 giay (tickCount+30-1), dem nguoc nghi / roi pho ban chi bao moi 5 giay (khoi spam),
//     boss ra sau 15 giay khi giet du (num == 4 -> 16). NoUserTime tinh bang giay, khong doi.
// Chay: node tools/nhip-1giay-17-10.js   (sua tai cho, kiem so byte > 0x7f khong doi). Rollback: tag truoc-nhip-1giay-17-10
const fs = require('fs');
const S = 'C:/Users/Bia/tlbbnetco4/server/Public/Data/Script/';
function va(f, cap) {
  const p = S + f; let t = fs.readFileSync(p, 'latin1');
  const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
  const hi0 = hi(t);
  for (const [cu, moi, soLan] of cap) {
    const k = t.split(cu).length - 1;
    if (k !== (soLan || 1)) throw new Error(f + ': moc "' + cu.slice(0, 70) + '" xuat hien ' + k + ' lan (can ' + (soLan || 1) + ')');
    t = t.split(cu).join(moi);
  }
  if (hi(t) !== hi0) throw new Error(f + ': byte > 0x7f doi');
  fs.writeFileSync(p, t, 'latin1'); console.log('ok', f);
}
va('event/fuben/efuben_1_zhenlong_huodong.lua', [
  ['intervalTickCount=3}', 'intervalTickCount=1}', 5],
  ['x401001_g_createMonsterIntervalInfoList = {', 'x401001_g_createMonsterIntervalInfoList = {   -- [NetCo4 17/10] moi quan co 1 giay (05/10: 3 giay; goc 9/8/7/6/5)'],
]);
va('event/fuben/efuben_1_zhenlong2_huodong.lua', [
  ['intervalTickCount=3}', 'intervalTickCount=1}', 3],
  ['intervalTickCount=2}', 'intervalTickCount=1}', 2],
  ['x401002_g_createMonsterIntervalInfoList = {', 'x401002_g_createMonsterIntervalInfoList = {   -- [NetCo4 17/10] moi quan co 1 giay (goc 3/3/3/2/2)'],
]);
va('event/fuben/efuben_cuju.lua', [
  ['and nCurTime-nPreTime >= 3)', 'and nCurTime-nPreTime >= 1)', 4],
  ['if nCurTime-nStep_1_T >= 3 then', 'if nCurTime-nStep_1_T >= 1 then   -- [NetCo4 17/10] 3 -> 1 giay', 3],
  ['(nStep>=5   and nStep<24  and nCurTime-nPreTime >= 1) or', '(nStep>=5   and nStep<24  and nCurTime-nPreTime >= 1) or   -- [NetCo4 17/10] moi qua 1 giay (05/10: 3; goc 15/12/10/5)'],
]);
va('event/huodong/seek_treasure.lua', [
  ['x808039_g_TickTime = 5\t', 'x808039_g_TickTime = 1   -- [NetCo4 17/10] 5 -> 1 giay (ra 1 dot / giay); hang so tick ben duoi nhan 5\t'],
  ['x808039_g_LimitTotalHoldTime = 720 ', 'x808039_g_LimitTotalHoldTime = 3600 '],
  ['x808039_g_StartTickCount = 2 ', 'x808039_g_StartTickCount = 10 '],
  ['x808039_g_CloseTick = 6\t', 'x808039_g_CloseTick = 30\t'],
  ['speed = 3 }', 'speed = 1 }', 5],
  ['{ from = 1, to = 10, speed = 1 },   -- [NetCo4 06/10] moi dot 15 giay (goc 8/7/6/5/4 tick)', '{ from = 1, to = 10, speed = 1 },   -- [NetCo4 17/10] moi dot 1 giay (06/10: 15 giay; goc 8/7/6/5/4 tick x 5 giay)'],
  ['tickCount+6-3 );   -- [NetCo4 06/10] nghi 30 giay', 'tickCount+30-1 );   -- [NetCo4 17/10] tick 1 giay, van nghi 30 giay. [06/10] nghi 30 giay'],
  ['local diffCount = oldFlushMonsterTime+3 - tickCount;   -- [NetCo4 06/10] khop speed 3', 'local diffCount = oldFlushMonsterTime+1 - tickCount;   -- [NetCo4 17/10] khop speed 1'],
  ['if diffCount <= 6 and diffCount >= 1 then', 'if diffCount <= 30 and diffCount >= 1 and mod( diffCount, 5 ) == 0 then   -- [NetCo4 17/10] bao moi 5 giay'],
  ['elseif leaveTickCount < x808039_g_CloseTick then', 'elseif leaveTickCount < x808039_g_CloseTick and mod( x808039_g_CloseTick - leaveTickCount, 5 ) == 0 then   -- [NetCo4 17/10] bao moi 5 giay'],
  ['if num == 4 then', 'if num == 16 then   -- [NetCo4 17/10] tick 1 giay: van 15 giay sau khi giet du moi ra boss (cu num == 4, tick 5 giay)'],
]);
