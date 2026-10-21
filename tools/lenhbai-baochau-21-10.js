// 21/10 (chu server: Lenh Bai cong co dung khong): ShuaXinClient.lua x892002_LPbuffa doc chuoi nguoi che Lenh Bai (o 109)
//  "LP" + 4 Bao Chau (chu a-t + cap) + 3 Mo rong thuoc tinh (chu + cap) + ky nang bi dong. Truoc:
//   - moi Bao Chau cong (cap x 2) DON VI vao dai buff bat ke loai -> lech tooltip client (SuperToolTip DisplayLPInfo):
//     Huyet / Cuong / Noi / The / Tri chi 20%, Than 40%, thuoc tinh cong 60%, khang 40%, Chinh xac 50%, Noi / Ngoai cong 80%, Ne 80%.
//   - 3 o Mo rong luon +1 cap vao Huyet / The luc / Chinh xac (bo qua chu + cap that cua o).
//  Sau: don vi = floor(cap x gia tri tooltip moi cap / gia tri 1 don vi dai), Mo rong cong dung chu + cap.
//   a Huyet 10000/cap (dai 1000), b-e Cuong/Noi/The/Tri 100 (10), f Than 50 (10), g-j Bang/Hoa/Huyen/Doc cong 50 (15),
//   k-n khang 20 (4), o/p Noi/Ngoai cong 500 (200), q/r Noi/Ngoai thu 200 (100), s Chinh xac 400 (100), t Ne tranh 200 (80).
//  Phan tinh thong (xs2, ll2...) cong them nhu cu.
// Lua -> cap-nhat.sh, KHONG can restart (buff gan lai khi dang nhap / doi ban do). Rollback: tag truoc-lenhbai-baochau-21-10.
//   node tools/lenhbai-baochau-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'MyLua', 'ShuaXinClient.lua');
const goc = fs.readFileSync(F, 'latin1');
const i = goc.indexOf('    if LPe ~= "0" then');
const rt = goc.indexOf('\treturn tonumber(LPA)*2+xs2', i);
const j = goc.indexOf('\n', rt) + 1;
if (i < 0 || rt < 0 || rt - i > 400) { console.log('LOI khong thay khoi mo rong / return'); process.exit(1); }
const E = goc[j - 2] === '\r' ? '\r\n' : '\n';
const cu = goc.slice(i, j);
if (!/tonumber\(LPh\)\s*$/.test(cu.trim())) { console.log('LOI return khong ket thuc bang LPh'); process.exit(1); }
const L = [
  '    -- [NetCo4 21/10] Mo rong thuoc tinh: cong DUNG chu + cap cua tung o (truoc luon +1 vao Huyet / The luc / Chinh xac) - tools/lenhbai-baochau-21-10.js',
  '    local LV = { a=tonumber(LPA), b=tonumber(LPB), c=tonumber(LPC), d=tonumber(LPD), e=tonumber(LPE), f=tonumber(LPF), g=tonumber(LPG), h=tonumber(LPH), i=tonumber(LPI), j=tonumber(LPJ),',
  '                 k=tonumber(LPK), l=tonumber(LPL), m=tonumber(LPM), n=tonumber(LPN), o=tonumber(LPO), p=tonumber(LPP), q=tonumber(LPQ), r=tonumber(LPR), s=tonumber(LPS), t=tonumber(LPT) }',
  '    local _, _, me0, me1, mf0, mf1, mg0, mg1 = strfind( lpstring, "LP%w%d%w%d%w%d%w%d(%w)(%d)(%w)(%d)(%w)(%d)" )',
  '    if me0 ~= nil and LV[me0] ~= nil then LV[me0] = LV[me0] + tonumber(me1) end',
  '    if mf0 ~= nil and LV[mf0] ~= nil then LV[mf0] = LV[mf0] + tonumber(mf1) end',
  '    if mg0 ~= nil and LV[mg0] ~= nil then LV[mg0] = LV[mg0] + tonumber(mg1) end',
  '    LPA, LPB, LPC, LPD, LPE, LPF, LPG, LPH, LPI, LPJ = LV.a, LV.b, LV.c, LV.d, LV.e, LV.f, LV.g, LV.h, LV.i, LV.j',
  '    LPK, LPL, LPM, LPN, LPO, LPP, LPQ, LPR, LPS, LPT = LV.k, LV.l, LV.m, LV.n, LV.o, LV.p, LV.q, LV.r, LV.s, LV.t',
  '\tend',
  '\t-- [NetCo4 21/10] don vi dai buff = cap x gia tri tooltip moi cap / gia tri 1 don vi dai (truoc: cap x 2 cho moi loai)',
  '\treturn floor(tonumber(LPA)*10)+xs2, floor(tonumber(LPB)*10)+ll2, floor(tonumber(LPC)*10)+lq2, floor(tonumber(LPD)*10)+tl2, floor(tonumber(LPE)*10)+dl2, floor(tonumber(LPF)*5)+sf2,',
  '\t\tfloor(tonumber(LPG)*50/15)+bg2, floor(tonumber(LPH)*50/15)+hg2, floor(tonumber(LPI)*50/15)+xg2, floor(tonumber(LPJ)*50/15)+dg2,',
  '\t\tfloor(tonumber(LPK)*5), floor(tonumber(LPL)*5), floor(tonumber(LPM)*5), floor(tonumber(LPN)*5),',
  '\t\tfloor(tonumber(LPO)*500/200)+ng2, floor(tonumber(LPP)*500/200)+wg2, floor(tonumber(LPQ)*2)+nf2, floor(tonumber(LPR)*2)+wf2, floor(tonumber(LPS)*4)+mz2, floor(tonumber(LPT)*200/80)+sb2, tonumber(LPh)',
];
// khoi cu: "if LPe..." (3 if) + "end" (dong if xse) + return. Thay ca khoi.
const s = goc.slice(0, i) + L.join(E) + E + goc.slice(j);
console.log('ShuaXinClient.lua: Lenh Bai Bao Chau / Mo rong cong dung tooltip');
console.log('--- khoi cu ---\n' + cu.replace(/\r/g, ''));
if (!process.argv.includes('--ghi')) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
