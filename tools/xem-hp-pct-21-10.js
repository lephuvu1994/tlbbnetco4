// 21/10: NPC Hoi Uc Thien Long "Xem Thang Linh" (oloulan_malan.lua 8891) in them buff % Sinh luc DANG GAN de kiem Long Van:
//  - Long Van (ShuaXinClient xxxxassx 31400-31429, logic 12 MAX_HP sua ti le, 3% / don vi; engine nhan % x GetBaseMaxHP = Sinh luc goc tu
//    The luc + cap) - chu server thao Long Van +9 ("Huyet +27") chi mat 67k thay vi ~250k -> nghi buff khong gan.
//  - Am khi "phap bao them Sinh luc %" 32400 (+10%, 30 phut, kich hoat khi dung am khi).
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-xem-hp-pct-21-10.   node tools/xem-hp-pct-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'obj', 'loulangucheng', 'oloulan_malan.lua');
const GHI = process.argv.includes('--ghi');
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const v = (t) => [...t.normalize('NFC')].map((ch) => (ch.charCodeAt(0) < 128 ? ch : String.fromCharCode(VMAP[ch]))).join('');
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const goc = fs.readFileSync(F, 'latin1');
const a = v('#cA0A0A0Trần mỗi chỉ số');
const i = goc.indexOf('\t\t\tAddText( sceneId, "' + a); if (i < 0) { console.log('LOI khong thay dong Tran'); process.exit(1); }
const E = goc[goc.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n';
const t1 = v('% Sinh lực đang gắn: Long Văn +'), t2 = v('% / Ám khí (30 phút) '), t3 = v('+10%'), t4 = v('không có');
const dong = '\t\t\tlocal amk = "' + t4 + '"' + E + '\t\t\tif LuaFnHaveImpactOfSpecificDataIndex( sceneId, selfId, 32400 ) == 1 then' + E + '\t\t\t\tamk = "' + t3 + '"' + E + '\t\t\tend' + E +
  '\t\t\tAddText( sceneId, "' + t1 + '"..( x001113_TLBuff( sceneId, selfId, 31400, 31429 ) * 3 ).."' + t2 + '"..amk )   -- [NetCo4 21/10] tools/xem-hp-pct-21-10.js' + E;
const s = goc.slice(0, i) + dong + goc.slice(i);
if (cao(s) !== cao(goc) + cao(t1 + t2 + t4) + cao(t3)) { console.log('LOI lech byte'); process.exit(1); }
console.log('oloulan_malan.lua: them dong % Sinh luc dang gan');
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
