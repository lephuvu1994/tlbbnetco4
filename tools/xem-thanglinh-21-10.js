// 21/10 (chu server hoi "thang linh co thuc su cong khong"): NPC Hoi Uc Thien Long (001113) them dong "Xem Thang Linh" (8891):
//  goi 892002 AHa_ReMyBuff (dem lai XIEZI_SL bang 391060 MsgBox33 + gan lai buff chi so), roi DOC TRUC TIEP buff dang gan
//  (LuaFnHaveImpactOfSpecificDataIndex tung ma trong dai) -> in: diem thang linh (so mon Vuong Quyen / Thien Dao), phan thang linh cong
//  (diem x10 moi chi so, diem x1000 Sinh luc), tong buff dang gan moi dai (moi nguon) + tran. Dai (ShuaXinClient.lua 523-552, 893-1080):
//  Cuong 13000-13699, Noi 13700-14399, The 14400-15599, Tri 15600-16299, Than 16300-16999 (+10 / don vi), Sinh luc 30200-30999 (+1000 / don vi).
// Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-xem-thanglinh-21-10.   node tools/xem-thanglinh-21-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script', 'obj', 'loulangucheng', 'oloulan_malan.lua');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const v = (t) => [...t.normalize('NFC')].map((ch) => { if (ch.charCodeAt(0) < 128) return ch; const b = VMAP[ch]; if (b === undefined) { console.log('LOI VISCII thieu ' + ch); loi++; return '?'; } return String.fromCharCode(b); }).join('');
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const eolTai = (s, i) => (s[s.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n');
const goc = fs.readFileSync(F, 'latin1'); let s = goc; let them = 0;
// 1. dong menu ngay sau dong "Nhap Giftcode"
{
  const i = s.indexOf(', 6, 8890 )'); if (i < 0) { console.log('LOI khong thay dong 8890'); process.exit(1); }
  const E = eolTai(s, i), het = s.indexOf('\n', i) + 1; const t = v('#G Xem Thăng Linh');
  s = s.slice(0, het) + '\t\tAddNumText( sceneId, x001113_g_scriptId, "' + t + '", 6, 8891 )   -- [NetCo4 21/10] tools/xem-thanglinh-21-10.js' + E + s.slice(het); them += cao(t);
}
// 2. nhanh 8891 ngay truoc nhanh 8890
{
  const a = '\tif key == 8890 then'; const i = s.indexOf(a); if (i < 0) { console.log('LOI khong thay nhanh 8890'); process.exit(1); }
  const E = eolTai(s, i);
  const L = [
    '\tif key == 8891 then   -- [NetCo4 21/10] xem thang linh + buff chi so DANG GAN (doc truc tiep)',
    '\t\tCallScriptFunction( 892002, "AHa_ReMyBuff", sceneId, selfId )',
    '\t\tlocal sl = GetMissionData( sceneId, selfId, XIEZI_SL )',
    '\t\tlocal d = mod( sl, 1000 )',
    '\t\tif d >= 400 then',
    '\t\t\td = 0',
    '\t\tend',
    '\t\tBeginEvent( sceneId )',
    '\t\t\tAddText( sceneId, "' + v('#YThăng Linh: #W') + '"..d.."' + v(' điểm (Vương Quyền ') + '"..mod( floor( sl / 1000 ), 100 ).."' + v(' món, Thiên Đạo ') + '"..floor( sl / 100000 ).."' + v(' món)') + '" )',
    '\t\t\tAddText( sceneId, "' + v('Thăng linh cộng: #G+') + '"..( d * 10 ).."#W' + v(' Cường / Nội / Thể / Trí / Thân, #G+') + '"..( d * 1000 ).."#W' + v(' Sinh lực') + '" )',
    '\t\t\tAddText( sceneId, "' + v('#YBuff đang gắn (mọi nguồn cộng lại):') + '" )',
    '\t\t\tAddText( sceneId, "' + v('Cường lực +') + '"..x001113_TLBuff( sceneId, selfId, 13000, 13699 ) * 10 .."' + v(' / Nội lực +') + '"..x001113_TLBuff( sceneId, selfId, 13700, 14399 ) * 10 .."' + v(' / Thể lực +') + '"..x001113_TLBuff( sceneId, selfId, 14400, 15599 ) * 10 )',
    '\t\t\tAddText( sceneId, "' + v('Trí lực +') + '"..x001113_TLBuff( sceneId, selfId, 15600, 16299 ) * 10 .."' + v(' / Thân pháp +') + '"..x001113_TLBuff( sceneId, selfId, 16300, 16999 ) * 10 .."' + v(' / Sinh lực +') + '"..x001113_TLBuff( sceneId, selfId, 30200, 30999 ) * 1000 )',
    '\t\t\tAddText( sceneId, "' + v('#cA0A0A0Trần mỗi chỉ số: 6.990 (Thể lực 11.990), Sinh lực 799.000 - vượt trần thì phần dư không tính') + '" )',
    '\t\tEndEvent( sceneId )',
    '\t\tDispatchEventList( sceneId, selfId, targetId )',
    '\t\treturn',
    '\tend',
  ];
  s = s.slice(0, i) + L.join(E) + E + s.slice(i);
  them += cao(v('#YThăng Linh: #W') + v(' điểm (Vương Quyền ') + v(' món, Thiên Đạo ') + v(' món)') + v('Thăng linh cộng: #G+') + v(' Cường / Nội / Thể / Trí / Thân, #G+') + v(' Sinh lực') +
    v('#YBuff đang gắn (mọi nguồn cộng lại):') + v('Cường lực +') + v(' / Nội lực +') + v(' / Thể lực +') + v('Trí lực +') + v(' / Thân pháp +') + v(' / Sinh lực +') +
    v('#cA0A0A0Trần mỗi chỉ số: 6.990 (Thể lực 11.990), Sinh lực 799.000 - vượt trần thì phần dư không tính'));
}
// 3. ham tim buff dang gan trong dai: cuoi file
{
  const E = '\r\n';
  s = s.replace(/(\r?\n)*$/, '') + E + E + [
    '-- [NetCo4 21/10] so don vi buff dang gan trong dai [a+1, b] (0 = khong co) - tools/xem-thanglinh-21-10.js',
    'function x001113_TLBuff( sceneId, selfId, a, b )',
    '\tfor i = a + 1, b do',
    '\t\tif LuaFnHaveImpactOfSpecificDataIndex( sceneId, selfId, i ) == 1 then',
    '\t\t\treturn i - a',
    '\t\tend',
    '\tend',
    '\treturn 0',
    'end',
  ].join(E) + E;
}
if (cao(s) !== cao(goc) + them) { console.log('LOI lech byte', cao(s) - cao(goc), them); loi++; }
if (loi) process.exit(1);
console.log('oloulan_malan.lua: them "Xem Thang Linh" (8891)');
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
fs.writeFileSync(F, s, 'latin1'); console.log('DA GHI');
