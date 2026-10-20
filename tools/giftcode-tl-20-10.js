// 20/10 (chu server): GIFTCODE TRONG GAME - ban dung (thay tools/giftcode-20-10.js).
//  Client (NewbieCardActivation.lua trong goi client) KIEM TRUOC khi gui: UI 2004 chi nhan ma bat dau 't'/'s' thuong roi gui
//  sang BILLING (khong toi Lua) -> chet. UI 20170431: ma DUNG 8 ky tu, 2 ky tu dau "TL" (byte 84, 76) -> client gui 6 ky tu
//  con lai (byte) toi 999999 x999999_XuKaJiHuo2(sceneId, selfId, a..f) (CDK.lua, truoc do de trong). Ma = "TL" + 6 ky tu.
//  1. obj/loulangucheng/oloulan_malan.lua (NPC Hoi Uc Thien Long): "Nhap Giftcode" mo UI 20170431 (thay 2004).
//  2. CDK/CDK.lua: x999999_XuKaJiHuo2 -> ghep ma "TL"..6 ky tu (thuong -> hoa) -> x999999_GCNhap (kiem ma / han / luot /
//     tai khoan, ghi da dung, qua -> NetCo4Qua roi 950000 NhanQua). File giftcode*.txt nhu tools/giftcode-20-10.js.
//  3. event/prize/eprize.lua: tra ve ban goc (tag truoc-giftcode-thu-20-10) - OpenCard khong bao gio duoc goi.
//  Chi sua Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-giftcode-tl-20-10.   node tools/giftcode-tl-20-10.js [--ghi]
const fs = require('fs'), path = require('path'), cp = require('child_process');
const REPO = path.join(__dirname, '..'), S = path.join(REPO, 'server', 'Public', 'Data', 'Script');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
// chu Viet -> escape VISCII thap phan 3 so (file CDK.lua chi ASCII, nhu quatang.lua)
const esc = (t) => [...t.normalize('NFC')].map((ch) => { const c = ch.charCodeAt(0); if (c < 128) return ch === '"' ? '\\"' : ch; const b = VMAP[ch]; if (b === undefined) { console.log('LOI VISCII thieu ' + ch); loi++; return '?'; } return '\\' + String(b).padStart(3, '0'); }).join('');
const T = (t) => '"' + esc(t) + '"';
const ra = {};

// 1. NPC
{
  const f = 'obj/loulangucheng/oloulan_malan.lua'; let s = fs.readFileSync(path.join(S, f), 'latin1');
  const a = '\t\tDispatchUICommand( sceneId, selfId, 2004 )', b = '\t\tDispatchUICommand( sceneId, selfId, 20170431 )   -- [NetCo4 20/10] UI nhap ma "TL" + 6 ky tu -> 999999 XuKaJiHuo2 (2004 di Billing, khong dung duoc)';
  const i = s.indexOf('if key == 8890 then'); const j = s.indexOf(a, i);
  if (i < 0 || j < 0 || j - i > 400) { console.log('LOI NPC: khong thay DispatchUICommand 2004 trong nhanh 8890'); loi++; } else s = s.slice(0, j) + b + s.slice(j + a.length);
  s = s.replace('-- [NetCo4 20/10] giftcode: mo cua so nhap ma (UI 2004) -> client goi 888899 x888899_OpenCard(card)', '-- [NetCo4 20/10] giftcode: mo cua so nhap ma (UI 20170431) -> client goi 999999 x999999_XuKaJiHuo2 (CDK.lua)');
  ra[f] = s; console.log(f + ': UI 2004 -> 20170431');
}
// 2. eprize ve ban goc
{
  const f = 'event/prize/eprize.lua';
  ra[f] = cp.execSync('git show truoc-giftcode-thu-20-10:server/Public/Data/Script/' + f, { cwd: REPO, maxBuffer: 64 << 20 }).toString('latin1');
  console.log(f + ': ve ban goc (truoc-giftcode-thu-20-10)');
}
// 3. CDK.lua
{
  const f = 'CDK/CDK.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1');
  const stub = 'function x999999_XuKaJiHuo2( sceneId, selfId ) end\n';
  if (goc.split(stub).length !== 2) { console.log('LOI CDK: khong thay stub XuKaJiHuo2'); loi++; }
  const kt = [];
  for (let c = 48; c <= 57; c++) kt.push('[' + c + ']="' + String.fromCharCode(c) + '"');
  for (let c = 65; c <= 90; c++) kt.push('[' + c + ']="' + String.fromCharCode(c) + '"');
  for (let c = 97; c <= 122; c++) kt.push('[' + c + ']="' + String.fromCharCode(c - 32) + '"');
  const L = [
    '-- [NetCo4 20/10] GIFTCODE (tools/giftcode-tl-20-10.js). Client UI 20170431 (NPC Hoi Uc Thien Long > Nhap Giftcode): ma 8 ky tu "TL" + 6,',
    '-- client tu kiem "TL" roi gui 6 ky tu con lai (ma byte) vao day. Bot BotDoMin giftcode.js ghi giftcode.txt + giftcode-acc.txt, doc giftcode-dung.txt:',
    '--   giftcode.txt      CODE|hetHan|tongLuot|item <id> <n>;knb <n>;vang <n>;diemtang <n>   (hetHan epoch, 0 = khong het; tongLuot 0 = khong gioi han)',
    '--   giftcode-acc.txt  <guid> <tai khoan>          giftcode-dung.txt  CODE|tai khoan|guid|epoch (ghi them)',
    'x999999_g_GCKyTu = { ' + kt.join(', ') + ' }',
    'x999999_g_GCLoai = { item=1, knb=1, vang=1, diemtang=1 }',
    '',
    'function x999999_XuKaJiHuo2( sceneId, selfId, a, b, c, d, e, f )',
    '\tlocal ma = "TL"',
    '\tlocal ds = { a, b, c, d, e, f }',
    '\tfor i = 1, 6 do',
    '\t\tlocal k = x999999_g_GCKyTu[ tonumber( ds[i] or 0 ) or 0 ]',
    '\t\tif k == nil then',
    '\t\t\tx999999_GCTip( sceneId, selfId, ' + T('Mã chỉ gồm chữ và số: TL + 6 ký tự') + ' )',
    '\t\t\treturn',
    '\t\tend',
    '\t\tma = ma..k',
    '\tend',
    '\tx999999_GCNhap( sceneId, selfId, ma )',
    'end',
    '',
    'function x999999_GCTip( sceneId, selfId, msg )',
    '\tBeginEvent( sceneId )',
    '\t\tAddText( sceneId, msg )',
    '\tEndEvent( sceneId )',
    '\tDispatchMissionTips( sceneId, selfId )',
    'end',
    '',
    'function x999999_GCDoc( ten )',
    '\tlocal ds = {}',
    '\tlocal h = openfile( x999999_g_Dir..ten, "r" )',
    '\tif h == nil then',
    '\t\treturn ds',
    '\tend',
    '\tlocal line = read( h, "*l" )',
    '\twhile line do',
    '\t\ttinsert( ds, line )',
    '\t\tline = read( h, "*l" )',
    '\tend',
    '\tclosefile( h )',
    '\treturn ds',
    'end',
    '',
    'function x999999_GCNhap( sceneId, selfId, ma )',
    '\tlocal ds = x999999_GCDoc( "giftcode.txt" )',
    '\tlocal hetHan = nil',
    '\tlocal tong = 0',
    '\tlocal qua = ""',
    '\tfor i = 1, getn( ds ) do',
    '\t\tlocal s, e, c, hh, tl, q = strfind( ds[i], "^([^|]+)|(%d+)|(%d+)|(.*)$" )',
    '\t\tif c == ma then',
    '\t\t\thetHan = tonumber( hh )',
    '\t\t\ttong = tonumber( tl )',
    '\t\t\tqua = q',
    '\t\t\tbreak',
    '\t\tend',
    '\tend',
    '\tif hetHan == nil then',
    '\t\tx999999_GCTip( sceneId, selfId, ' + T('Mã không tồn tại: ') + '..ma )',
    '\t\treturn',
    '\tend',
    '\tlocal now = LuaFnGetCurrentTime()',
    '\tif hetHan > 0 and now > hetHan then',
    '\t\tx999999_GCTip( sceneId, selfId, ' + T('Mã đã hết hạn') + ' )',
    '\t\treturn',
    '\tend',
    '\tlocal gs = LuaFnGetGUID( sceneId, selfId )..""',
    '\tlocal acc = nil',
    '\tlocal dsa = x999999_GCDoc( "giftcode-acc.txt" )',
    '\tfor i = 1, getn( dsa ) do',
    '\t\tlocal s, e, g, a = strfind( dsa[i], "^(%d+) (%S+)" )',
    '\t\tif g == gs then',
    '\t\t\tacc = a',
    '\t\t\tbreak',
    '\t\tend',
    '\tend',
    '\tif acc == nil then',
    '\t\tx999999_GCTip( sceneId, selfId, ' + T('Nhân vật mới, thử lại sau 1 phút') + ' )',
    '\t\treturn',
    '\tend',
    '\tlocal dung = x999999_GCDoc( "giftcode-dung.txt" )',
    '\tlocal n = 0',
    '\tfor i = 1, getn( dung ) do',
    '\t\tlocal s, e, c, a = strfind( dung[i], "^([^|]+)|([^|]+)|" )',
    '\t\tif c == ma then',
    '\t\t\tn = n + 1',
    '\t\t\tif a == acc then',
    '\t\t\t\tx999999_GCTip( sceneId, selfId, ' + T('Tài khoản của bạn đã dùng mã này rồi') + ' )',
    '\t\t\t\treturn',
    '\t\t\tend',
    '\t\tend',
    '\tend',
    '\tif tong > 0 and n >= tong then',
    '\t\tx999999_GCTip( sceneId, selfId, ' + T('Mã đã hết lượt sử dụng') + ' )',
    '\t\treturn',
    '\tend',
    '\t-- ghi DA DUNG truoc khi phat (loi giua chung thi mat qua, khong nhan 2 lan)',
    '\tlocal h = openfile( x999999_g_Dir.."giftcode-dung.txt", "a" )',
    '\tif h == nil then',
    '\t\tx999999_GCTip( sceneId, selfId, ' + T('Lỗi hệ thống, báo admin') + ' )',
    '\t\treturn',
    '\tend',
    '\twrite( h, ma.."|"..acc.."|"..gs.."|"..now.."\\n" )',
    '\tclosefile( h )',
    '\t-- qua -> hang doi NetCo4Qua (quatang.lua 950000) roi phat ngay; tui day thi phan con lai nhan o lan doi ban do sau',
    '\tlocal hq = openfile( "./txt/NetCo4Qua/"..gs..".txt", "a" )',
    '\tif hq == nil then',
    '\t\tx999999_GCTip( sceneId, selfId, ' + T('Lỗi hệ thống, báo admin') + ' )',
    '\t\treturn',
    '\tend',
    '\twrite( hq, "\\n" )',
    '\tlocal q = qua..";"',
    '\tlocal s, e, mot = strfind( q, "^([^;]*);" )',
    '\twhile s do',
    '\t\tlocal s2, e2, k = strfind( mot, "^(%a+) %d" )',
    '\t\tif k and x999999_g_GCLoai[k] then',
    '\t\t\twrite( hq, mot.."\\n" )',
    '\t\tend',
    '\t\tq = strsub( q, e + 1 )',
    '\t\ts, e, mot = strfind( q, "^([^;]*);" )',
    '\tend',
    '\tclosefile( hq )',
    '\tx999999_GCTip( sceneId, selfId, ' + T('Nhập giftcode thành công: ') + '..ma )',
    '\tCallScriptFunction( 950000, "NhanQua", sceneId, selfId )',
    'end',
  ];
  const s = goc.replace(stub, L.join('\n') + '\n');
  if (/[^\x00-\x7f]/.test(s)) { console.log('LOI CDK: co ky tu ngoai ASCII'); loi++; }
  ra[f] = s; console.log(f + ': XuKaJiHuo2 -> giftcode');
}
if (loi) process.exit(1);
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
for (const [f, s] of Object.entries(ra)) fs.writeFileSync(path.join(S, f), s, 'latin1');
console.log('DA GHI');
