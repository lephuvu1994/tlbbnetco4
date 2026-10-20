// 20/10 (chu server): GIFTCODE TRONG GAME (thay ban thu tools/giftcode-thu-20-10.js).
//  Nguoi choi: NPC "Hoi Uc Thien Long" (001113) > "Nhap Giftcode" -> cua so "Kich hoat the" (UI 2004) -> client goi
//  888899 x888899_OpenCard(card) -> x888899_GCNhap: kiem ma + han + luot + tai khoan, ghi da dung, dua qua vao hang doi
//  NetCo4Qua/<GUID>.txt roi goi 950000 NhanQua -> qua vao tui NGAY (tui day: phan con lai nhan o lan doi ban do sau).
//  File (Server/txt/NetCo4Web/, bot BotDoMin giftcode.js ghi / doc):
//    giftcode.txt       CODE|hetHan(epoch, 0 = khong het)|tongLuot(0 = khong gioi han)|item <id> <n>;knb <n>;vang <n>;diemtang <n>
//    giftcode-acc.txt   <guid> <tai khoan>   (bot lam moi moi 60 giay; nhan vat moi chua co -> bao thu lai sau 1 phut)
//    giftcode-dung.txt  CODE|tai khoan|guid|epoch   (Lua ghi them; moi tai khoan 1 lan / ma, dem tong luot)
//  Chi sua Lua -> hieu luc sau cap-nhat.sh, KHONG can restart game. Rollback: tag truoc-giftcode-20-10.
//  node tools/giftcode-20-10.js [--ghi]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const v = (t) => [...t.normalize('NFC')].map((ch) => { if (ch.charCodeAt(0) < 128) return ch; const b = VMAP[ch]; if (b === undefined) { console.log('LOI VISCII thieu ' + ch); loi++; return '?'; } return String.fromCharCode(b); }).join('');
const eolTai = (s, i) => (s[s.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n');
const ra = {};

// 1. NPC: bo chu "(thu)"
{
  const f = 'obj/loulangucheng/oloulan_malan.lua'; let s = fs.readFileSync(path.join(S, f), 'latin1');
  const a = '"' + v('#G Nhập Giftcode (thử)') + '", 6, 8890 )   -- [NetCo4 20/10] thu nhap giftcode (tools/giftcode-thu-20-10.js)';
  const b = '"' + v('#G Nhập Giftcode') + '", 6, 8890 )   -- [NetCo4 20/10] giftcode (tools/giftcode-20-10.js)';
  if (s.split(a).length !== 2) { console.log('LOI NPC: khong thay dong thu'); loi++; } else s = s.replace(a, b);
  s = s.replace('-- [NetCo4 20/10] THU giftcode: mo cua so nhap ma (UI 2004)', '-- [NetCo4 20/10] giftcode: mo cua so nhap ma (UI 2004)');
  ra[f] = s; console.log(f + ': dong "Nhap Giftcode"');
}
// 2. eprize.lua: OpenCard -> GCNhap + ham giftcode cuoi file
{
  const f = 'event/prize/eprize.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1');
  const i0 = goc.indexOf('\t -- [NetCo4 20/10] THU giftcode (tools/giftcode-thu-20-10.js)');
  const i1 = i0 < 0 ? -1 : goc.indexOf('\t if  1  then  return  end', i0);
  if (i0 < 0 || i1 < 0 || i1 - i0 > 1200) { console.log('LOI eprize: khong thay khoi thu'); loi++; process.exit(1); }
  const E = eolTai(goc, i0);
  let s = goc.slice(0, i0) + '\t -- [NetCo4 20/10] GIFTCODE (tools/giftcode-20-10.js): khong goi Billing, ma do bot quan ly' + E +
    '\t x888899_GCNhap( sceneId, selfId, card )' + E + goc.slice(i1);
  const T = (t) => '"' + v(t) + '"';
  const hoa = 'abcdefghijklmnopqrstuvwxyz'.split('').map((c) => c + '="' + c.toUpperCase() + '"').join(', ');
  const lua = [
    '',
    '--**********************************',
    '-- [NetCo4 20/10] GIFTCODE trong game (tools/giftcode-20-10.js). Bot BotDoMin giftcode.js ghi giftcode.txt + giftcode-acc.txt, doc giftcode-dung.txt.',
    '--   giftcode.txt      CODE|hetHan|tongLuot|item <id> <n>;knb <n>;vang <n>;diemtang <n>   (hetHan epoch, 0 = khong het; tongLuot 0 = khong gioi han)',
    '--   giftcode-acc.txt  <guid> <tai khoan>          giftcode-dung.txt  CODE|tai khoan|guid|epoch (ghi them)',
    '--**********************************',
    'x888899_g_GCDir = "./txt/NetCo4Web/"',
    'x888899_g_GCHoa = { ' + hoa + ' }',
    'x888899_g_GCLoai = { item=1, knb=1, vang=1, diemtang=1 }',
    '',
    'function x888899_GCTip( sceneId, selfId, msg )',
    '\tBeginEvent( sceneId )',
    '\t\tAddText( sceneId, msg )',
    '\tEndEvent( sceneId )',
    '\tDispatchMissionTips( sceneId, selfId )',
    'end',
    '',
    'function x888899_GCDoc( ten )',
    '\tlocal ds = {}',
    '\tlocal h = openfile( x888899_g_GCDir..ten, "r" )',
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
    'function x888899_GCNhap( sceneId, selfId, card )',
    '\t-- chuan hoa: bo ky tu la, chu thuong -> hoa',
    '\tlocal ma = ""',
    '\tfor i = 1, strlen( card ) do',
    '\t\tlocal c = strsub( card, i, i )',
    '\t\tif x888899_g_GCHoa[c] then',
    '\t\t\tc = x888899_g_GCHoa[c]',
    '\t\tend',
    '\t\tif strfind( c, "^[%w%-]$" ) then',
    '\t\t\tma = ma..c',
    '\t\tend',
    '\tend',
    '\tif strlen( ma ) < 4 or strlen( ma ) > 24 then',
    '\t\tx888899_GCTip( sceneId, selfId, ' + T('Mã không hợp lệ') + ' )',
    '\t\treturn',
    '\tend',
    '\tlocal ds = x888899_GCDoc( "giftcode.txt" )',
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
    '\t\tx888899_GCTip( sceneId, selfId, ' + T('Mã không tồn tại') + ' )',
    '\t\treturn',
    '\tend',
    '\tlocal now = LuaFnGetCurrentTime()',
    '\tif hetHan > 0 and now > hetHan then',
    '\t\tx888899_GCTip( sceneId, selfId, ' + T('Mã đã hết hạn') + ' )',
    '\t\treturn',
    '\tend',
    '\tlocal gs = LuaFnGetGUID( sceneId, selfId )..""',
    '\tlocal acc = nil',
    '\tlocal dsa = x888899_GCDoc( "giftcode-acc.txt" )',
    '\tfor i = 1, getn( dsa ) do',
    '\t\tlocal s, e, g, a = strfind( dsa[i], "^(%d+) (%S+)" )',
    '\t\tif g == gs then',
    '\t\t\tacc = a',
    '\t\t\tbreak',
    '\t\tend',
    '\tend',
    '\tif acc == nil then',
    '\t\tx888899_GCTip( sceneId, selfId, ' + T('Nhân vật mới, thử lại sau 1 phút') + ' )',
    '\t\treturn',
    '\tend',
    '\tlocal dung = x888899_GCDoc( "giftcode-dung.txt" )',
    '\tlocal n = 0',
    '\tfor i = 1, getn( dung ) do',
    '\t\tlocal s, e, c, a = strfind( dung[i], "^([^|]+)|([^|]+)|" )',
    '\t\tif c == ma then',
    '\t\t\tn = n + 1',
    '\t\t\tif a == acc then',
    '\t\t\t\tx888899_GCTip( sceneId, selfId, ' + T('Tài khoản của bạn đã dùng mã này rồi') + ' )',
    '\t\t\t\treturn',
    '\t\t\tend',
    '\t\tend',
    '\tend',
    '\tif tong > 0 and n >= tong then',
    '\t\tx888899_GCTip( sceneId, selfId, ' + T('Mã đã hết lượt sử dụng') + ' )',
    '\t\treturn',
    '\tend',
    '\t-- ghi DA DUNG truoc khi phat (loi giua chung thi mat qua, khong nhan 2 lan)',
    '\tlocal h = openfile( x888899_g_GCDir.."giftcode-dung.txt", "a" )',
    '\tif h == nil then',
    '\t\tx888899_GCTip( sceneId, selfId, ' + T('Lỗi hệ thống, báo admin') + ' )',
    '\t\treturn',
    '\tend',
    '\twrite( h, ma.."|"..acc.."|"..gs.."|"..now.."\\n" )',
    '\tclosefile( h )',
    '\t-- qua -> hang doi NetCo4Qua (quatang.lua 950000) roi phat ngay',
    '\tlocal hq = openfile( "./txt/NetCo4Qua/"..gs..".txt", "a" )',
    '\tif hq == nil then',
    '\t\tx888899_GCTip( sceneId, selfId, ' + T('Lỗi hệ thống, báo admin') + ' )',
    '\t\treturn',
    '\tend',
    '\twrite( hq, "\\n" )',
    '\tlocal q = qua..";"',
    '\tlocal s, e, mot = strfind( q, "^([^;]*);" )',
    '\twhile s do',
    '\t\tlocal s2, e2, k = strfind( mot, "^(%a+) %d" )',
    '\t\tif k and x888899_g_GCLoai[k] then',
    '\t\t\twrite( hq, mot.."\\n" )',
    '\t\tend',
    '\t\tq = strsub( q, e + 1 )',
    '\t\ts, e, mot = strfind( q, "^([^;]*);" )',
    '\tend',
    '\tclosefile( hq )',
    '\tx888899_GCTip( sceneId, selfId, ' + T('Nhập giftcode thành công: ') + '..ma )',
    '\tCallScriptFunction( 950000, "NhanQua", sceneId, selfId )',
    'end',
    '',
  ].join(E);
  s = s.replace(/(\r?\n)*$/, '') + E + lua;
  ra[f] = s; console.log(f + ': OpenCard -> x888899_GCNhap + ham giftcode');
}
if (loi) process.exit(1);
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
for (const [f, s] of Object.entries(ra)) fs.writeFileSync(path.join(S, f), s, 'latin1');
console.log('DA GHI');
