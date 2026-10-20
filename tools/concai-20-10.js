// 20/10 (chu server): CON CAI (script 910052 MyNew/zhinv/zhinv_NPC.lua + InfantUPLV.lua 890631 + InfantUPBK.lua 890546)
// 1. Tay ky nang con (NPC Truong Ton Ba Ba / Moc Tu Tu Tu, Giac Linh Chau 31001476 + 5 vang): admin chon LOAI duoc ra
//    (panel -> ./txt/NetCo4Cfg/concaikn.txt, 8 so 0/1 = loai 1..8 Khang Bang/Hoa/Huyen/Doc, Giam khang Bang/Hoa/Huyen/Doc).
//    Khong file / ca 8 bat / ca 8 tat = random 8 loai nhu goc. Ap ca lan tao ky nang dau (con cap 31) va moi lan tay.
// 2. Hop thanh Dien Tich: 2 cuon Cam (bac 4) giong nhau -> 1 cuon Cam NGAU NHIEN trong 24 cuon (dung mo ta client, 100%).
//    Truoc day server chan bac 4 ("dien tich khong cach nao nua tien hanh hop thanh").
// 3. Va loi:
//    a) Nang ky nang con o cap 9: truoc tru Ngo Linh Chau + 5 vang roi moi loi script (SKEdt_RT[9] nil) -> chan truoc khi tru.
//    b) Nut "Doi" sau khi tay: ghi de CAP ky nang bang du lieu cu (neu da nang cap sau lan tay) + khong xoa lan tay -> lay LOAI
//       tu lan tay, giu CAP hien tai, xoa lan tay da dung (MD 456 = 0).
//    c) Goi 892002 "checkallsuxing" (KHONG ton tai) -> chi so con chi cap nhat khi doi ban do; doi sang 892002 AHa_ReMyBuff
//       (ham dung luc doi ban do, huy roi gan lai buff - goi luc nao cung an toan).
//    d) InfantUPLV: con cap 118 du exp dung Tan Hiet -> vong lap doc bang cap 120 (nil) loi script, mat vat pham -> chan o cap 119.
// Lua, khong restart. Chay: node tools/concai-20-10.js. Rollback: tag truoc-concai-20-10
const fs = require('fs');
const R = __dirname + '/../server/Public/Data/Script/MyNew/zhinv/';
const M = JSON.parse(fs.readFileSync(__dirname + '/viscii-map.json', 'utf8'));
const vn = (s) => [...s].map((c) => { if (c.charCodeAt(0) < 128) return c; if (M[c] === undefined) throw new Error('khong ma hoa duoc ' + c); return String.fromCharCode(M[c]); }).join('');
const NL = '\r\n';
const doc = (f) => fs.readFileSync(R + f, 'latin1');
const ghi = (f, t) => fs.writeFileSync(R + f, t, 'latin1');
const mot = (t, a, b, ten) => { if (t.split(a).length !== 2) throw new Error('khong thay dung 1 lan: ' + ten); return t.replace(a, b); };

// ---------- zhinv_NPC.lua ----------
let z = doc('zhinv_NPC.lua');
if (z.includes('NetCo4_KnRand')) throw new Error('zhinv_NPC.lua da va roi');
if ((z.match(/random\(8\)/g) || []).length !== 5) throw new Error('so cho random(8) khac 5');
z = z.split('(random(8))').join('(x910052_NetCo4_KnRand())');               // 4 cho tao ky nang dau
z = mot(z, 'skTPTB[w]  =  random(8)', 'skTPTB[w]  =  x910052_NetCo4_KnRand()   -- NetCo4 20/10: loai do admin bat', 'random tay');
// ham doc cau hinh: dat truoc RefereshNewInfantSkill
const ham = [
  '-- NetCo4 20/10: admin chon LOAI ky nang con duoc ra khi tay (panel -> ./txt/NetCo4Cfg/concaikn.txt, 1 dong 8 so 0/1 = loai 1..8:',
  '-- Khang Bang / Hoa / Huyen / Doc, Giam khang Bang / Hoa / Huyen / Doc). Khong file / bat ca 8 / tat ca 8 -> random 8 loai nhu goc.',
  'x910052_NetCo4_KnFile = "./txt/NetCo4Cfg/concaikn.txt"',
  'function x910052_NetCo4_KnLoai()',
  '\tlocal ds = {}',
  '\tlocal h = openfile( x910052_NetCo4_KnFile, "r" )',
  '\tif h ~= nil then',
  '\t\tlocal line = read( h, "*l" )',
  '\t\tclosefile( h )',
  '\t\tif line ~= nil then',
  '\t\t\tlocal p = 1',
  '\t\t\tfor t = 1, 8 do',
  '\t\t\t\tlocal _, e, c = strfind( line, "([01])", p )',
  '\t\t\t\tif c == nil then',
  '\t\t\t\t\tbreak',
  '\t\t\t\tend',
  '\t\t\t\tif c == "1" then',
  '\t\t\t\t\ttinsert( ds, t )',
  '\t\t\t\tend',
  '\t\t\t\tp = e + 1',
  '\t\t\tend',
  '\t\tend',
  '\tend',
  '\tif getn( ds ) == 0 then',
  '\t\tds = { 1, 2, 3, 4, 5, 6, 7, 8 }',
  '\tend',
  '\treturn ds',
  'end',
  'function x910052_NetCo4_KnRand()',
  '\tlocal ds = x910052_NetCo4_KnLoai()',
  '\treturn ds[ random( getn( ds ) ) ]',
  'end',
  '',
  '',
].join(NL);
z = mot(z, 'function  x910052_RefereshNewInfantSkill(', ham + 'function  x910052_RefereshNewInfantSkill(', 'RefereshNewInfantSkill');
// nut Doi: lay LOAI tu lan tay, giu CAP hien tai, xoa lan tay
z = mot(z, '\t SetMissionData(sceneId,selfId,x910052_SKData,nweskd)' + NL,
  '\t -- NetCo4 20/10: lay LOAI tu lan tay, giu CAP hien tai (nang cap sau khi tay khong bi ghi de), xoa lan tay da dung' + NL +
  '\t local tay8 = format("%08d", nweskd)' + NL +
  '\t local hien8 = format("%08d", skdata)' + NL +
  '\t local ghep = ""' + NL +
  '\t for q = 1, 4 do' + NL +
  '\t \t ghep = ghep .. strsub(tay8, q*2-1, q*2-1) .. strsub(hien8, q*2, q*2)' + NL +
  '\t end' + NL +
  '\t nweskd = tonumber(ghep)' + NL +
  '\t SetMissionData(sceneId,selfId,x910052_NSkNData,0)' + NL +
  '\t SetMissionData(sceneId,selfId,x910052_SKData,nweskd)' + NL, 'SetMissionData nweskd');
// nang ky nang cap 9: chan truoc khi tru
z = mot(z, '\t local  SKEdt_RT  =  x910052_SKEdt_RT[nsklv]' + NL,
  '\t if  nsklv  >=  9  or  x910052_SKEdt_RT[nsklv]  ==  nil  then   -- NetCo4 20/10: cap 9 = toi da (truoc mat Ngo Linh Chau + 5 vang roi loi)' + NL +
  '\t \t x910052_NotifyTip(sceneId,  selfId,"' + vn(' Kỹ năng này đã đạt cấp tối đa (cấp 9) ') + '")' + NL +
  '\t \t return' + NL +
  '\t end' + NL +
  '\t local  SKEdt_RT  =  x910052_SKEdt_RT[nsklv]' + NL, 'SKEdt_RT');
// hop thanh Dien Tich Cam
z = mot(z, 'if  type1  <  1  or  type1  >=  4  or  type1  ==  nil  then', 'if  type1  <  1  or  type1  >  4  or  type1  ==  nil  then   -- NetCo4 20/10: cho hop bac 4 (Cam)', 'type1 >= 4');
z = mot(z, '\t local  DJgiveID  =  itemId1  +  1' + NL,
  '\t local  DJgiveID  =  itemId1  +  1' + NL +
  '\t if  type1  ==  4  then   -- NetCo4 20/10: 2 Dien Tich Cam giong nhau -> 1 Dien Tich Cam ngau nhien (24 cuon), dung mo ta client' + NL +
  '\t \t DJgiveID  =  31001000  +  random(4)*100  +  random(6)*10  +  4' + NL +
  '\t end' + NL, 'DJgiveID');
// checkallsuxing (khong ton tai) -> AHa_ReMyBuff
const nCs = (z.match(/"checkallsuxing"/g) || []).length;
if (nCs !== 4) throw new Error('zhinv: checkallsuxing ' + nCs + ' cho (can 4)');
z = z.split('"checkallsuxing"').join('"AHa_ReMyBuff"');
ghi('zhinv_NPC.lua', z);

// ---------- InfantUPBK.lua ----------
let b = doc('InfantUPBK.lua');
b = mot(b, 'CallScriptFunction( 892002, "checkallsuxing", sceneId, selfId )', 'CallScriptFunction( 892002, "AHa_ReMyBuff", sceneId, selfId )   -- NetCo4 20/10: checkallsuxing khong ton tai', 'UPBK checkallsuxing');
ghi('InfantUPBK.lua', b);

// ---------- InfantUPLV.lua ----------
let l = doc('InfantUPLV.lua');
l = mot(l, 'while  Infantexpn  >=  x890631_Infant_UPLVTB[IFANTLV1_tpdd]  do',
  'while  x890631_Infant_UPLVTB[IFANTLV1_tpdd]  ~=  nil  and  IFANTLV1_tpdd  <  119  and  Infantexpn  >=  x890631_Infant_UPLVTB[IFANTLV1_tpdd]  do   -- NetCo4 20/10: dung o cap 119 (bang cap 120 nil)', 'UPLV while');
ghi('InfantUPLV.lua', l);
console.log('da va 3 file con cai');
