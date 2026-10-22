// 22/10 (chu server: Tram Phong bam xong nhan vat do ~10 giay, tat auto van bi): loi o CLIENT (dong tac chieu 943/945 "ngam chu" 1248/1247 -
// log server: dung 943 luc 11:40:16, 9 giay sau client khong gui lenh danh nao, server khong tu choi gi; hieu ung 1579 logic 92 chi OnDamage).
// Ne: quyen 5 (Tuyet Chi Thu: Tram Phong / Song Sinh / Boi Thuy) TU PHAT nhu quyen 1-4, server gan THANG hieu ung (khong qua chieu
// client -> khong co dong tac) - trong so 1, cho rieng 300 giay o MD 455 (quet Lua + client: 455 chi la ma nhiem vu, khong la MissionData).
// Hieu ung = 1570 + (chieu-13)*10 + cap - 1 (bang x808243_g_WuYiSkill[13..15]); Song Sinh gan ca muc tieu + minh nhu goc.
// Nguoi choi KHONG bam chieu Tram Phong tren thanh phim tat nua (bam van do vi client).
// MyLua/chuanci/SuangHaia.lua x899039_WuYiCheck. Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-voy-tramphong-22-10.
//   node tools/voy-tramphong-tuphat-22-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'chuanci', 'SuangHaia.lua');
let s = fs.readFileSync(F, 'latin1'); let loi = 0;
const E = s.includes('\r\n') ? '\r\n' : '\n';
const mot = (a, b, ten) => { a = a.split('\n').join(E); b = b.split('\n').join(E); const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return; } s = s.replace(a, b); };
mot('        local TickStep = w1 + w2 + w3 + w4\n',
    '        -- [NetCo4 22/10] quyen 5 (Tuyet Chi Thu) tu phat, server gan thang hieu ung (bam chieu bi do o client) - tools/voy-tramphong-tuphat-22-10.js\n' +
    '        local B5 = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),10000)\n' +
    '        local WY_Book_5_skill = floor(B5/100)\n' +
    '        local WY_Book_5_lev = mod(B5,100)\n' +
    '        local w5 = 0\n' +
    '        if WY_Book_5_skill >= 13 and WY_Book_5_skill <= 15 and WY_Book_5_lev >= 1 and WY_Book_5_lev <= 10 and GetMissionData(sceneId,selfId,455) <= bayGio then\n' +
    '           w5 = 1\n' +
    '        end\n' +
    '        local TickStep = w1 + w2 + w3 + w4 + w5\n', 'TickStep');
mot('        else\n           skillnum = WY_Book_4_skill\n        end\n',
    '        elseif TickStep <= w1 + w2 + w3 + w4 then\n           skillnum = WY_Book_4_skill\n' +
    '        else\n' +
    '           local hu = 1570 + (WY_Book_5_skill - 13) * 10 + WY_Book_5_lev - 1\n' +
    '           if WY_Book_5_skill == 14 then\n' +
    '              local tg = LuaFnGetTargetObjID(sceneId, selfId)\n' +
    '              if tg ~= nil and tg >= 0 and tg ~= selfId and LuaFnIsObjValid(sceneId, tg) == 1 then\n' +
    '                 LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, tg, hu, 0 )\n' +
    '              end\n' +
    '           end\n' +
    '           LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, hu, 0 )\n' +
    '           SetMissionData(sceneId,selfId,455,bayGio+300)\n' +
    '           return\n' +
    '        end\n', 'else quyen 4');
if (loi) process.exit(1);
console.log('SuangHaia.lua: quyen 5 tu phat (MD 455, 300 giay)');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
