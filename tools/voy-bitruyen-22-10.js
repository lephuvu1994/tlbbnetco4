// 22/10 (chu server: "ok duoc"): Bi truyen Vo Y - MOI QUYEN CHO RIENG (truoc: 1 o WUYI_SKILL_ITEM = 480 khoa CHUNG; quyen 2/3/4 hoac 5 ra
// la khoa ca quyen 1 trong 5 phut -> hoc them quyen = thiet). Gio:
//   quyen 1 (Dau Chi Thu, 1601-1603)  -> WUYI_SKILL_ITEM (480), 20 giay (nhu goc)
//   quyen 2 (Tuc Chi Thu, 1604-1606)  -> MD 444, 300 giay
//   quyen 3 (Hanh Chi Thu, 1607-1609) -> MD 445, 300 giay
//   quyen 4 (Phuoc Chi Thu, 1610-1612)-> MD 446, 300 giay (Thong Minh tu phat o XinFa888 cung xet 446)
//   quyen 5 (Tuyet Chi Thu, chieu tu bam 943-945): da co hoi chieu 5 phut cua engine (CoolDown 205) -> KHONG khoa quyen 1-4 nua.
// MD 444/445/446: quet toan bo Lua + client - khong noi nao dung lam MissionData (444-446 chi la ma nhiem vu / cong thuc).
// SuangHaia.lua x899039_WuYiCheck: chi boc trong cac quyen DA HOC va DA HET CHO (trong so cu 3/1/1/1).
// WuYi_Skill.lua: + sua quyen 5 doc nham cap quyen 4 (floor(mod(DE,10^6)/10^4)) -> mod(DE,100); "if >= 1613/1614/1615" lien tiep
// (1615 gui 3 lan, 1614 gui 2 lan) -> tach dung tung ID.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-voy-bitruyen-22-10.   node tools/voy-bitruyen-22-10.js [--ghi]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script');
const F1 = path.join(S, 'MyLua', 'chuanci', 'SuangHaia.lua');
const F2 = path.join(S, 'MyNew', 'Skill', 'WuYi_Skill.lua');
const F3 = path.join(S, 'MyNew', 'Skill', 'XinFa888.lua');
let loi = 0;
const sua = (F, ds) => {
    let s = fs.readFileSync(F, 'latin1');
    const E = s.includes('\r\n') ? '\r\n' : '\n';
    for (const [a, b, ten] of ds) {
        const A = a.split('\n').join(E), B = b.split('\n').join(E);
        const n = s.split(A).length - 1;
        if (n !== 1) { console.log('LOI ' + path.basename(F) + ' ' + ten + ': ' + n + ' cho'); loi++; continue; }
        s = s.replace(A, B);
    }
    return s;
};

// 1. SuangHaia.lua
const s1 = sua(F1, [
    ['        if GetMissionData(sceneId,selfId,WUYI_SKILL_ITEM) > LuaFnGetCurrentTime() then\n           return\n        end\n',
     '        -- [NetCo4 22/10] moi quyen cho rieng (truoc: 1 o WUYI_SKILL_ITEM khoa chung) - tools/voy-bitruyen-22-10.js\n' +
     '        local bayGio = LuaFnGetCurrentTime()\n', 'bo khoa chung'],
    ['        if WY_Book_1_skill >= 1 and WY_Book_1_skill <= 3 then\n',
     '        if WY_Book_1_skill >= 1 and WY_Book_1_skill <= 3 and GetMissionData(sceneId,selfId,WUYI_SKILL_ITEM) <= bayGio then\n', 'quyen 1'],
    ['        if WY_Book_2_skill >= 4 and WY_Book_2_skill <= 6 then\n',
     '        if WY_Book_2_skill >= 4 and WY_Book_2_skill <= 6 and GetMissionData(sceneId,selfId,444) <= bayGio then\n', 'quyen 2'],
    ['        if WY_Book_3_skill >= 7 and WY_Book_3_skill <= 9 then\n',
     '        if WY_Book_3_skill >= 7 and WY_Book_3_skill <= 9 and GetMissionData(sceneId,selfId,445) <= bayGio then\n', 'quyen 3'],
    ['        if WY_Book_4_skill == 10 or WY_Book_4_skill == 11 then\n',
     '        if (WY_Book_4_skill == 10 or WY_Book_4_skill == 11) and GetMissionData(sceneId,selfId,446) <= bayGio then\n', 'quyen 4'],
]);

// 2. WuYi_Skill.lua: cho rieng + quyen 5
const s2 = sua(F2, [
    ['              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,LuaFnGetCurrentTime()+20)\n',
     '              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,LuaFnGetCurrentTime()+20)   -- [NetCo4 22/10] quyen 1 cho rieng 20 giay\n', 'q1'],
    ['        if impactId >= 1604 and impactId <= 1606 then\n              WuYiSkill_Lev = floor(mod(GetMissionData(sceneId,selfId,WUYI_SKILL_BC),10^6)/10^4)\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,LuaFnGetCurrentTime()+300)\n',
     '        if impactId >= 1604 and impactId <= 1606 then\n              WuYiSkill_Lev = floor(mod(GetMissionData(sceneId,selfId,WUYI_SKILL_BC),10^6)/10^4)\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '              SetMissionData(sceneId,selfId,444,LuaFnGetCurrentTime()+300)   -- [NetCo4 22/10] quyen 2 cho rieng (MD 444)\n', 'q2'],
    ['        if impactId >= 1607 and impactId <= 1609 then\n              WuYiSkill_Lev = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_BC),100)\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,LuaFnGetCurrentTime()+300)\n',
     '        if impactId >= 1607 and impactId <= 1609 then\n              WuYiSkill_Lev = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_BC),100)\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '              SetMissionData(sceneId,selfId,445,LuaFnGetCurrentTime()+300)   -- [NetCo4 22/10] quyen 3 cho rieng (MD 445)\n', 'q3'],
    ['        if impactId >= 1610 and impactId <= 1612 then\n              WuYiSkill_Lev = floor(mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),10^6)/10^4)\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,LuaFnGetCurrentTime()+300)\n',
     '        if impactId >= 1610 and impactId <= 1612 then\n              WuYiSkill_Lev = floor(mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),10^6)/10^4)\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '              SetMissionData(sceneId,selfId,446,LuaFnGetCurrentTime()+300)   -- [NetCo4 22/10] quyen 4 cho rieng (MD 446)\n', 'q4'],
    ['        if impactId >= 1613 then\n              WuYiSkill_Lev = floor(mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),10^6)/10^4)\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,LuaFnGetCurrentTime()+300)\n        end\n',
     '        -- [NetCo4 22/10] quyen 5 (chieu tu bam, engine da hoi 5 phut): cap = mod(DE,100) (truoc doc nham cap quyen 4), dung tung ID\n' +
     '        -- (truoc "if >= 1613/1614/1615" lien tiep -> 1615 gui 3 lan), khong khoa quyen 1-4 nua\n' +
     '        if impactId == 1613 then\n              WuYiSkill_Lev = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),100)\n' +
     '\t      if x808243_g_WuYiSkill[13][WuYiSkill_Lev] ~= nil then LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[13][WuYiSkill_Lev], 0 ) end\n' +
     '        end\n', 'q5 1613'],
    ['        if impactId >= 1614 then\n              WuYiSkill_Lev = floor(mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),10^6)/10^4)\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, targetId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,LuaFnGetCurrentTime()+300)\n        end\n',
     '        if impactId == 1614 then\n              WuYiSkill_Lev = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),100)\n' +
     '\t      if x808243_g_WuYiSkill[14][WuYiSkill_Lev] ~= nil then\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, targetId, x808243_g_WuYiSkill[14][WuYiSkill_Lev], 0 )\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[14][WuYiSkill_Lev], 0 )\n' +
     '\t      end\n        end\n', 'q5 1614'],
    ['        if impactId >= 1615 then\n              WuYiSkill_Lev = floor(mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),10^6)/10^4)\n' +
     '\t      LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[impactId-1600][WuYiSkill_Lev], 0 )\n' +
     '              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,LuaFnGetCurrentTime()+300)\n        end\n',
     '        if impactId == 1615 then\n              WuYiSkill_Lev = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),100)\n' +
     '\t      if x808243_g_WuYiSkill[15][WuYiSkill_Lev] ~= nil then LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, x808243_g_WuYiSkill[15][WuYiSkill_Lev], 0 ) end\n' +
     '        end\n', 'q5 1615'],
]);

// 3. XinFa888.lua: Thong Minh (quyen 4) xet cho quyen 4
const s3 = sua(F3, [
    ['         if (GetMissionData(sceneId,selfId,WUYI_SKILL_ITEM) - LuaFnGetCurrentTime()) < 100 then\n',
     '         if (GetMissionData(sceneId,selfId,446) - LuaFnGetCurrentTime()) < 100 then   -- [NetCo4 22/10] quyen 4 cho rieng (MD 446)\n', 'thong minh'],
]);
if (loi) process.exit(1);
console.log('SuangHaia / WuYi_Skill / XinFa888: bi truyen Vo Y cho rieng tung quyen');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F1, s1, 'latin1'); fs.writeFileSync(F2, s2, 'latin1'); fs.writeFileSync(F3, s3, 'latin1'); console.log('DA GHI');
