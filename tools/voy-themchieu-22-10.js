// 22/10 (kiem bialk): bi truyen Vo Y quyen 1-4 tu phat bang cach cho client tu dung chieu 931-942 (SkillTemplate "can hoc truoc" = 1)
// -> thieu chieu trong danh sach thi KHONG BAO GIO phat. bialk hoc Thu Tam cap 10 (WUYI_SKILL_DE) nhung t_skill khong co 940
// (log 22/10: 931 tu phat 33 lan, 939 70 lan, 940 = 0). Nguoi khac du 5 chieu.
// Sua: ShuaXinClient x892002_AHa_ReMyBuff (dang nhap / doi ban do / thao tac Vo Y) them lai chieu quyen 1-4 da hoc ma thieu (HaveSkill < 0).
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-voy-themchieu-22-10.   node tools/voy-themchieu-22-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
let s = fs.readFileSync(F, 'latin1');
const E = s.includes('\r\n') ? '\r\n' : '\n';
const a = '\tDelSkill(sceneId, selfId, 943)' + E;
if (s.split(a).length !== 2) { console.log('LOI neo DelSkill 943'); process.exit(1); }
s = s.replace(a, [
    '\t-- [NetCo4 22/10] them lai chieu bi truyen quyen 1-4 da hoc ma thieu (tu phat can chieu da hoc) - tools/voy-themchieu-22-10.js',
    '\tlocal vyQ = { mod(GetMissionData(sceneId,selfId,WUYI_SKILL_A),10000), floor(GetMissionData(sceneId,selfId,WUYI_SKILL_BC)/10000), mod(GetMissionData(sceneId,selfId,WUYI_SKILL_BC),10000), floor(GetMissionData(sceneId,selfId,WUYI_SKILL_DE)/10000) }',
    '\tfor vyI = 1, 4 do',
    '\t\tlocal vySk = floor(vyQ[vyI]/100)',
    '\t\tif vySk >= 1 and vySk <= 12 and floor((vySk+2)/3) == vyI and mod(vyQ[vyI],100) >= 1 and HaveSkill(sceneId, selfId, 930+vySk) < 0 then',
    '\t\t\tAddSkill(sceneId, selfId, 930+vySk)',
    '\t\tend',
    '\tend',
    '',
].join(E) + a);
console.log('ShuaXinClient.lua: them lai chieu Vo Y quyen 1-4 thieu');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
