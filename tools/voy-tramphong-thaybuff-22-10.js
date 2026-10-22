// 22/10 (chu server: "van do khi buff tu hien"): client do vi CHINH BUFF Tram Phong (1570-1579, logic 92) chu khong chi dong tac chieu.
// Sua:
//  1. SuangHaia.lua quyen 5 tu phat: Tram Phong (13) gan buff BAT QUY cung cap (1490 + cap - 1: +5..+50% cong / chinh xac / hoi tam,
//     5 giay, logic 56 - client chay binh thuong nhu Huyet Sat). Song Sinh / Boi Thuy giu nguyen.
//  2. Go nut chieu quyen 5 (943 Tram Phong, 944 Song Sinh, 945 Boi Thuy) - bam la client do (dong tac + buff 1579):
//     ShuaXinClient x892002_AHa_ReMyBuff DelSkill 3 chieu (dang nhap / doi ban do / thao tac Vo Y); shenqichongxi khong AddSkill 13-15 nua.
//     Quyen 5 van hoc / len cap / tinh diem nhu cu (luu o WUYI_SKILL_DE), hieu ung tu phat 5 phut / lan.
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-voy-tramphong-buff-22-10.   node tools/voy-tramphong-thaybuff-22-10.js [--ghi]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script');
const ds = [
    [path.join(S, 'MyLua', 'chuanci', 'SuangHaia.lua'), [
        ['           local hu = 1570 + (WY_Book_5_skill - 13) * 10 + WY_Book_5_lev - 1\n',
         '           local hu = 1570 + (WY_Book_5_skill - 13) * 10 + WY_Book_5_lev - 1\n' +
         '           if WY_Book_5_skill == 13 then\n' +
         '              hu = 1490 + WY_Book_5_lev - 1   -- [NetCo4 22/10] Tram Phong: buff 1570-1579 lam client do -> dung buff Bat Quy cung cap\n' +
         '           end\n', 'tram phong -> bat quy']]],
    [path.join(S, 'MyLua', 'ShuaXinClient.lua'), [
        ['function x892002_AHa_ReMyBuff(sceneId, selfId)',
         'function x892002_AHa_ReMyBuff(sceneId, selfId)\n' +
         '\t-- [NetCo4 22/10] go nut chieu Vo Y quyen 5 (bam la client do), hieu ung da tu phat o SuangHaia - tools/voy-tramphong-thaybuff-22-10.js\n' +
         '\tDelSkill(sceneId, selfId, 943)\n\tDelSkill(sceneId, selfId, 944)\n\tDelSkill(sceneId, selfId, 945)', 'del skill']]],
    [path.join(S, 'MyLua', 'shenqinew', 'shenqichongxi.lua'), [
        ['                            AddSkill(sceneId,  selfId,TianFuSkill_ID[skillId])\n',
         '                            if  skillId  <  13  then   -- [NetCo4 22/10] quyen 5 khong them nut (bam la client do), tu phat o SuangHaia\n' +
         '                            AddSkill(sceneId,  selfId,TianFuSkill_ID[skillId])\n' +
         '                            end\n', 'add skill']]],
];
let loi = 0; const out = [];
for (const [F, ps] of ds) {
    let s = fs.readFileSync(F, 'latin1');
    const E = s.includes('\r\n') ? '\r\n' : '\n';
    for (const [a, b, ten] of ps) {
        const A = a.split('\n').join(E), B = b.split('\n').join(E);
        const n = s.split(A).length - 1;
        if (n !== 1) { console.log('LOI ' + path.basename(F) + ' ' + ten + ': ' + n + ' cho'); loi++; continue; }
        s = s.replace(A, B);
    }
    out.push([F, s]);
}
if (loi) process.exit(1);
console.log('SuangHaia / ShuaXinClient / shenqichongxi: Tram Phong -> Bat Quy, go nut 943-945');
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
for (const [F, s] of out) fs.writeFileSync(F, s, 'latin1');
console.log('DA GHI');
