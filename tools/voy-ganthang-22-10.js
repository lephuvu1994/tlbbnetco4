// 22/10 (chu server danh theo doi, log bialk): bi truyen Vo Y quyen 1-4 tu phat = server bao CLIENT tu dung chieu 931-942 (UI 2014092002 "ski13"),
// chieu xong hieu ung 1601-1612 het -> WuYi_Skill.lua (808243) moi gan buff + ghi thoi gian cho, NHUNG bo qua neu muc tieu luc do da chet /
// khong hop le. Quai Thap Ma Can chet nhanh -> phan lon lan ra chieu KHONG co buff, khong ghi thoi gian cho -> server bao dung chieu lien tuc
// (log 11:57-11:58: 931 moi 5-10 giay thay vi 20, 936 Bat Khuat 4 lan / 36 giay thay vi 5 phut). Con can chieu da hoc (bialk thieu 940).
// Sua: x899039_WuYiCheck (SuangHaia.lua) GAN THANG buff cho minh (hieu ung = 1450 + (chieu-1)*10 + cap - 1, bang x808243_g_WuYiSkill)
// + ghi thoi gian cho rieng ngay (q1 480 +20s, q2/q3/q4 MD 444/445/446 +300s) - khong qua client, khong can muc tieu song.
// Thien Quan (2, sat thuong truc tiep) gan len muc tieu con song (goc gan len chinh minh). Quyen 5 da gan thang tu truoc (voy-tramphong-*).
// Thong Minh (12) van tu phat o XinFa888 nhu cu. Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-voy-ganthang-22-10.
//   node tools/voy-ganthang-22-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'chuanci', 'SuangHaia.lua');
let s = fs.readFileSync(F, 'latin1');
const E = s.includes('\r\n') ? '\r\n' : '\n';
const cu = ['        if skillnum ~= 0 then',
    '           BeginUICommand(sceneId)',
    '\t     UICommand_AddInt(sceneId,x899039_g_WuYiSkill_ID[skillnum])',
    '\t     UICommand_AddString(sceneId,"ski13")',
    '\t     EndUICommand(sceneId)',
    '           DispatchUICommand(sceneId,selfId,2014092002)',
    '        end', ''].join(E);
if (s.split(cu).length !== 2) { console.log('LOI neo dispatch'); process.exit(1); }
const moi = ['        -- [NetCo4 22/10] server gan THANG buff + ghi thoi gian cho ngay (truoc: client tu dung chieu, quai chet nhanh = mat buff) - tools/voy-ganthang-22-10.js',
    '        if skillnum ~= 0 then',
    '           local vyQ = floor((skillnum + 2) / 3)',
    '           local vyLv = 0',
    '           if vyQ == 1 then',
    '              vyLv = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_A),100)',
    '           elseif vyQ == 2 then',
    '              vyLv = mod(floor(GetMissionData(sceneId,selfId,WUYI_SKILL_BC)/10000),100)',
    '           elseif vyQ == 3 then',
    '              vyLv = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_BC),100)',
    '           else',
    '              vyLv = mod(floor(GetMissionData(sceneId,selfId,WUYI_SKILL_DE)/10000),100)',
    '           end',
    '           if vyLv < 1 or vyLv > 10 then',
    '              return',
    '           end',
    '           local hu = 1450 + (skillnum - 1) * 10 + vyLv - 1',
    '           if skillnum == 2 then',
    '              local tg = LuaFnGetTargetObjID(sceneId, selfId)',
    '              if tg ~= nil and tg >= 0 and tg ~= selfId and LuaFnIsObjValid(sceneId, tg) == 1 and GetHp(sceneId, tg) > 0 then',
    '                 LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, tg, hu, 0 )',
    '              end',
    '           else',
    '              LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, hu, 0 )',
    '           end',
    '           if vyQ == 1 then',
    '              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,bayGio+20)',
    '           elseif vyQ == 2 then',
    '              SetMissionData(sceneId,selfId,444,bayGio+300)',
    '           elseif vyQ == 3 then',
    '              SetMissionData(sceneId,selfId,445,bayGio+300)',
    '           else',
    '              SetMissionData(sceneId,selfId,446,bayGio+300)',
    '           end',
    '        end', ''].join(E);
s = s.replace(cu, moi);
console.log('SuangHaia.lua: bi truyen quyen 1-4 gan thang buff');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
