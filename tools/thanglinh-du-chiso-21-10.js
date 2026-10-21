// 21/10 (chu server: "thang linh + cho hop ly, chi so chua cong thi fix cho cong dung"):
//  Truoc: ShuaXinClient.lua (892002) chi cong diem thang linh (wq_sld = X, Vuong Quyen N = N, Thien Dao N = 10+N, tren do dang mac) vao
//  Cuong / Noi / The / Tri / Than (+10 / diem) + Sinh luc (+1000 / diem). Tooltip client (SuperToolTip.lua sldjbsx1/2/5) VAN HIEN cong
//  Chinh xac +44, Ne tranh +20, Hoi cong +1, Noi / Ngoai thu +44 moi cap tren tung mon -> server khong cong (chi so ao).
//  Sau (moi diem X, cong vao dai buff co san, tran dai giu nguyen - dung chung moi nguon):
//    Chinh xac +44 (dai 29600, 100 / don vi), Ne tranh +20 (31000, 80), Ngoai thu +44 / Noi thu +44 (28800 / 29200, 100),
//    Hoi cong +1 (30000, 3 / don vi), Hoi thu +1 (30100, 2), Bang / Hoa / Huyen / Doc cong +10 (17000 / 18050 / 19100 / 20150, 15).
//    KHONG cong khang (khang tru thang % sat thuong thuoc tinh - cong nhieu = mien nhiem). Lam tron xuong theo don vi dai.
//  Max 18 mon Thien Dao 9 = 342 diem: Chinh xac +15.000, Ne +6.800, Ngoai / Noi thu +15.000, Hoi cong +297 (tran dai), Hoi thu +198 (tran dai),
//  moi thuoc tinh cong +3.420.
//  + NPC Hoi Uc Thien Long "Xem Thang Linh" (oloulan_malan.lua) in them dong cac chi so nay.
// Lua -> cap-nhat.sh, KHONG can restart (buff gan lai khi dang nhap / doi ban do). Rollback: tag truoc-thanglinh-du-chiso-21-10.
//   node tools/thanglinh-du-chiso-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const v = (t) => [...t.normalize('NFC')].map((ch) => { if (ch.charCodeAt(0) < 128) return ch; const b = VMAP[ch]; if (b === undefined) { console.log('LOI VISCII thieu ' + ch); loi++; return '?'; } return String.fromCharCode(b); }).join('');
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const eolTai = (s, i) => (s[s.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n');
const ra = {};
// 1. ShuaXinClient
{
  const f = 'MyLua/ShuaXinClient.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1');
  const a = '\tshuxinghuifang=shuxinghuifang+GetZHENy[15]+InfantBUFF[15]';
  const i = goc.indexOf(a); if (i < 0 || goc.indexOf(a, i + 1) >= 0) { console.log('LOI ShuaXinClient: neo huifang'); process.exit(1); }
  const E = eolTai(goc, i), het = goc.indexOf('\n', i) + 1;
  const L = [
    '\t-- [NetCo4 21/10] thang linh cong them (tools/thanglinh-du-chiso-21-10.js): truoc chi 5 chi so + Sinh luc, tooltip client hien them',
    '\t-- Chinh xac / Ne / Hoi cong / Noi-Ngoai thu nhung server khong cong. Moi diem: Chinh xac +44, Ne +20, Ngoai / Noi thu +44, Hoi cong +1,',
    '\t-- Hoi thu +1, Bang / Hoa / Huyen / Doc cong +10. Khong cong khang. Tran dai giu nguyen (dung chung moi nguon).',
    '\tif wq_sld > 0 then',
    '\t\tmingzhongbuff = mingzhongbuff + floor( wq_sld * 44 / 100 )   -- 1 don vi = 100 chinh xac',
    '\t\tshuxingshanbi = shuxingshanbi + floor( wq_sld / 4 )   -- 1 don vi = 80 ne tranh',
    '\t\tshuxingwaifang = shuxingwaifang + floor( wq_sld * 44 / 100 )   -- 1 don vi = 100 ngoai thu',
    '\t\tshuxingneifang = shuxingneifang + floor( wq_sld * 44 / 100 )   -- 1 don vi = 100 noi thu',
    '\t\tshuxinghuixin = shuxinghuixin + floor( wq_sld / 3 )   -- 1 don vi = 3 hoi cong',
    '\t\tshuxinghuifang = shuxinghuifang + floor( wq_sld / 2 )   -- 1 don vi = 2 hoi thu',
    '\t\tlocal tlTT = floor( wq_sld * 2 / 3 )   -- 1 don vi = 15 thuoc tinh cong -> +10 / diem',
    '\t\tshuxingtable1 = shuxingtable1 + tlTT',
    '\t\tshuxingtable2 = shuxingtable2 + tlTT',
    '\t\tshuxingtable3 = shuxingtable3 + tlTT',
    '\t\tshuxingtable4 = shuxingtable4 + tlTT',
    '\tend',
  ];
  const s = goc.slice(0, het) + L.join(E) + E + goc.slice(het);
  if (cao(s) !== cao(goc)) { console.log('LOI lech byte ShuaXinClient'); loi++; }
  ra[f] = s; console.log(f + ': thang linh cong Chinh xac / Ne / Noi-Ngoai thu / Hoi cong / Hoi thu / 4 thuoc tinh');
}
// 2. NPC Xem Thang Linh: them 1 dong
{
  const f = 'obj/loulangucheng/oloulan_malan.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1');
  const a = '\t\t\tAddText( sceneId, "' + v('#YBuff đang gắn (mọi nguồn cộng lại):') + '" )';
  const i = goc.indexOf(a); if (i < 0) { console.log('LOI malan: khong thay dong Buff dang gan'); process.exit(1); }
  const E = eolTai(goc, i);
  const t1 = v('Thăng linh cộng thêm: Chính xác +'), t2 = v(' / Né tránh +'), t3 = v(' / Ngoại + Nội thủ +'), t4 = v(' / Hội công +'), t5 = v(' / Hội thủ +'), t6 = v(' / Băng Hỏa Huyền Độc công +');
  const dong = '\t\t\tAddText( sceneId, "' + t1 + '"..( floor( d * 44 / 100 ) * 100 ).."' + t2 + '"..( floor( d / 4 ) * 80 ).."' + t3 + '"..( floor( d * 44 / 100 ) * 100 ).."' + t4 + '"..( floor( d / 3 ) * 3 ).."' + t5 + '"..( floor( d / 2 ) * 2 ).."' + t6 + '"..( floor( d * 2 / 3 ) * 15 ) )';
  const s = goc.slice(0, i) + dong + E + goc.slice(i);
  if (cao(s) !== cao(goc) + cao(t1 + t2 + t3 + t4 + t5 + t6)) { console.log('LOI lech byte malan'); loi++; }
  ra[f] = s; console.log(f + ': Xem Thang Linh them dong chi so phu');
}
if (loi) process.exit(1);
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
for (const [f, s] of Object.entries(ra)) fs.writeFileSync(path.join(S, f), s, 'latin1');
console.log('DA GHI');
