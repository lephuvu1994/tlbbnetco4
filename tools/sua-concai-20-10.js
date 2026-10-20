// 20/10 (chu server): sua 4 loi he Con Cai (Hai Tu) + 1 loi phu - agent ra soat zhinv / paodian:
//  1. zhinv_NPC.lua (910052) doi gioi tinh con (key -2): tru 10.000 KNB TRUOC khi kiem "con dang trieu hoi" -> mat KNB.
//     Sua: kiem trieu hoi truoc (cau bao dung: "dang trieu hoi"), roi moi tru KNB.
//  2. zhinv_NPC.lua vut bo con (key 20): xoa thang o 467 (thoi trang dang mac, 40.000 KNB) + sach Dien Tich dang gan -> mat do;
//     xoa moi buff 13000-32000 -> mat ca buff khac (thang linh, tu luyen...). Sua: con dang mac thoi trang / gan Dien Tich thi
//     bao thao truoc; sau khi xoa buff goi 892002 AHa_ReMyBuff gan lai buff chi so.
//  3. ShiZhuangRanSe.lua (830001 OnDressPaint) nhuom thoi trang con: tru 50.000 vang TRUOC khi kiem 5 Hong Dieu Thach.
//     Sua: thoi trang con thieu da thi bao truoc khi tru tien.
//  4. Nhanh an phat FREE (menu da comment, client sua van goi duoc): zhinv_NPC key 1110 (Ai Tam Ngoan Cu 38000187),
//     odali_yitiancai (830000) key 222 (Kim Toa 30503134/135/137) -> tat (so am khong bao gio khop).
//  5 (phu). odali_yitiancai.lua: AddNumText dung x830000_g_ScriptId (S hoa) nhung chi khai bao x830000_g_scriptId -> them bien.
// File latin1 (VISCII), giu CR. Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-sua-concai-20-10.
//   node tools/sua-concai-20-10.js [--ghi]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const v = (t) => [...t.normalize('NFC')].map((ch) => { if (ch.charCodeAt(0) < 128) return ch; const b = VMAP[ch]; if (b === undefined) { console.log('LOI VISCII thieu ' + ch); loi++; return '?'; } return String.fromCharCode(b); }).join('');
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const mot = (s, a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return s; } return s.replace(a, b); };
const ra = {};

// zhinv_NPC.lua (1, 2, 4a)
{
  const f = 'MyNew/zhinv/zhinv_NPC.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1'); let s = goc; let them = 0;
  const E = '\r\n';
  // 1. doi gioi tinh: chen kiem trieu hoi truoc YuanBao, bo khoi kiem cu (sau YuanBao)
  const yb = '\t \t local  UKret  =  YuanBao(sceneId,selfId,-1,2,10000)';
  const m1 = v('Con Cái đang triệu hồi, hãy thu về rồi mới đổi giới tính');
  s = mot(s, yb, '\t \t local  myIance0  =  GetMissionData(sceneId,  selfId,MD_MISS_MOSTER_OBJ)   -- [NetCo4 20/10] kiem trieu hoi TRUOC khi tru KNB' + E +
    '\t \t if  myIance0  >  0  then' + E + '\t \t x910052_NotifyTip(  sceneId,  selfId,"' + m1 + '"  )' + E + '\t \t return' + E + '\t \t end' + E + yb, 'doi gioi tinh');
  them += cao(m1);
  // 2. vut bo: chan khi con dang mac thoi trang / gan Dien Tich; gan lai buff sau khi xoa
  const vb = '                      SetMissionData(sceneId,  selfId,364,0)';
  const m2 = v('Hãy tháo thời trang và Điển Tịch của Con Cái trước khi vứt bỏ (vứt bỏ sẽ mất đồ đang gắn)');
  const i20 = s.indexOf('\t if  key  ==  20  then');
  if (i20 < 0 || s.indexOf(vb, i20) - i20 > 600) { console.log('LOI vut bo: khong thay'); loi++; }
  s = mot(s, vb, '                      if GetMissionData(sceneId, selfId, MD_MISS_MOSTER_DATA) > 0 or GetMissionData(sceneId, selfId, MD_INFANTBOOKTP) > 0 then   -- [NetCo4 20/10] khong xoa do dang gan' + E +
    '                      x910052_NotifyTip(  sceneId,  selfId,"' + m2 + '"  )' + E + '                      return' + E + '                      end' + E + vb, 'vut bo');
  them += cao(m2);
  const hb = '                      LuaFnCancelSpecificImpact(sceneId,selfId,i)' + E + '\t                 end' + E;
  s = mot(s, hb, hb + '                      CallScriptFunction( 892002, "AHa_ReMyBuff", sceneId, selfId )   -- [NetCo4 20/10] gan lai buff chi so (thang linh, tu luyen...) vua bi xoa theo' + E, 'gan lai buff');
  // 4a. nhanh 1110
  s = mot(s, '\t\t\tif key   == 1110 then', '\t\t\tif key   == -1110 then   -- [NetCo4 20/10] tat: phat free Ai Tam Ngoan Cu 38000187 (menu da an)', 'key 1110');
  if (cao(s) !== cao(goc) + them) { console.log('LOI lech byte zhinv_NPC'); loi++; }
  ra[f] = s; console.log(f + ': doi gioi tinh, vut bo, tat 1110');
}
// ShiZhuangRanSe.lua (3)
{
  const f = 'New/paodian/ShiZhuangRanSe.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1'); let s = goc; const E = '\r\n';
  const a = '\t  local  reply  =  CostMoney(sceneId,selfId,50000)';
  const m3 = v('Thiếu 5 Hồng Diệu Thạch để nhuộm thời trang Con Cái');
  const i = s.indexOf('function  x830001_OnDressPaint(  sceneId,  selfId,pos,itlsled');
  if (i < 0 || s.indexOf(a, i) - i > 200) { console.log('LOI nhuom: khong thay CostMoney ngay dau OnDressPaint'); loi++; }
  s = mot(s, a, '\t  local  nCon0  =  GetItemTableIndexByIndex(sceneId,  selfId,  pos)   -- [NetCo4 20/10] thoi trang con: kiem 5 da TRUOC khi tru 50.000 vang' + E +
    '\t  if  nCon0  ~=  nil  and  nCon0  >=  30008401  and  nCon0  <=  30008407  and  LuaFnGetAvailableItemCount(sceneId,  selfId,  30503140)  <  5  then' + E +
    '\t  \t x830001_NotifyTip(  sceneId,  selfId,  "' + m3 + '"  )' + E + '\t  \t return' + E + '\t  end' + E + a, 'nhuom');
  if (cao(s) !== cao(goc) + cao(m3)) { console.log('LOI lech byte ShiZhuangRanSe'); loi++; }
  ra[f] = s; console.log(f + ': kiem da truoc khi tru tien');
}
// odali_yitiancai.lua (4b, 5)
{
  const f = 'New/paodian/odali_yitiancai.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1'); let s = goc;
  s = mot(s, '\t if  GetNumText()  ==  222  then', '\t if  GetNumText()  ==  -222  then   -- [NetCo4 20/10] tat: phat free Kim Toa 30503134/135/137 (menu da an)', 'key 222');
  s = mot(s, 'x830000_g_scriptId  =  830000', 'x830000_g_scriptId  =  830000\r\nx830000_g_ScriptId  =  830000   -- [NetCo4 20/10] AddNumText ben duoi dung ten S hoa (truoc khong khai bao = nil)', 'ScriptId');
  if (cao(s) !== cao(goc)) { console.log('LOI lech byte yitiancai'); loi++; }
  ra[f] = s; console.log(f + ': tat 222, them x830000_g_ScriptId');
}
if (loi) process.exit(1);
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
for (const [f, s] of Object.entries(ra)) fs.writeFileSync(path.join(S, f), s, 'latin1');
console.log('DA GHI');
