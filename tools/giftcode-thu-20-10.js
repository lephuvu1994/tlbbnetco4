// 20/10 (chu server): THU nhap giftcode TRONG GAME (chua phat qua).
//  1. obj/loulangucheng/oloulan_malan.lua (001113, NPC "Hoi Uc Thien Long" Dai Ly 160,174 / Lac Duong 208,325): them dong
//     "Nhap Giftcode (thu)" (8890) -> DispatchUICommand 2004 = cua so nhap "the Tai Phu" goc cua client (nhu odali_youxituiguang.lua).
//  2. event/prize/eprize.lua (888899) x888899_OpenCard(card): client gui CHUOI nguoi choi go ve day (ban goc chuyen sang Billing).
//     Ban thu: KHONG goi Billing, chi bao lai "Server nhan duoc ma: [..] dai N ky tu" + ghi ./txt/NetCo4Web/giftcode-thu.log.
//  Muc dich: biet cua so 2004 con trong client khong, client co chan dinh dang / do dai khong, engine co goi OpenCard khong.
//  Chi sua Lua -> hieu luc sau cap-nhat.sh, KHONG can restart game. Rollback: tag truoc-giftcode-thu-20-10.
//  node tools/giftcode-thu-20-10.js [--ghi]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const v = (t) => [...t.normalize('NFC')].map((ch) => { if (ch.charCodeAt(0) < 128) return ch; const b = VMAP[ch]; if (b === undefined) { console.log('LOI VISCII thieu ' + ch); loi++; return '?'; } return String.fromCharCode(b); }).join('');
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const eolTai = (s, i) => (s[s.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n');   // kieu xuong dong cua dong chua vi tri i (file tron CRLF / LF)
const ra = {};

// 1. NPC Hoi Uc Thien Long
{
  const f = 'obj/loulangucheng/oloulan_malan.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1'); let s = goc;
  const i15 = s.indexOf(', 6, 15000 )'), fn = s.indexOf('function x001113_OnEventRequest');
  if (i15 < 0 || i15 > fn) { console.log('LOI khong thay dong BUFF 15000 trong OnDefaultEvent'); loi++; }
  else {
    const E = eolTai(s, i15), het = s.indexOf('\n', i15) + 1;
    s = s.slice(0, het) + '\t\tAddNumText( sceneId, x001113_g_scriptId, "' + v('#G Nhập Giftcode (thử)') + '", 6, 8890 )   -- [NetCo4 20/10] thu nhap giftcode (tools/giftcode-thu-20-10.js)' + E + s.slice(het);
  }
  const ik = s.indexOf('\tlocal key = GetNumText()');
  if (ik < 0 || s.indexOf('\tlocal key = GetNumText()', ik + 1) >= 0) { console.log('LOI neo GetNumText'); loi++; }
  else {
    const E = eolTai(s, ik), het = s.indexOf('\n', ik) + 1;
    s = s.slice(0, het) +
      ['\tif key == 8890 then   -- [NetCo4 20/10] THU giftcode: mo cua so nhap ma (UI 2004) -> client goi 888899 x888899_OpenCard(card)',
        '\t\tBeginUICommand( sceneId )', '\t\t\tUICommand_AddInt( sceneId, targetId )', '\t\tEndUICommand( sceneId )',
        '\t\tDispatchUICommand( sceneId, selfId, 2004 )', '\t\treturn', '\tend'].join(E) + E + s.slice(het);
  }
  if (cao(s) !== cao(goc) + cao(v('#G Nhập Giftcode (thử)'))) { console.log('LOI lech byte malan'); loi++; }
  ra[f] = s; console.log(f + ': them dong 8890 + mo UI 2004');
}
// 2. eprize OpenCard
{
  const f = 'event/prize/eprize.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1');
  const i = goc.indexOf('function  x888899_OpenCard(sceneId,selfId,card)');
  const a2 = i < 0 ? -1 : goc.indexOf('\t if  nil  ==  card  then  return  end', i);
  if (i < 0 || a2 < 0 || a2 - i > 60) { console.log('LOI neo OpenCard'); loi++; process.exit(1); }
  const E = eolTai(goc, a2), het = goc.indexOf('\n', a2) + 1;
  const msg1 = v('Server nhận được mã: ['), msg2 = v('] dài '), msg3 = v(' ký tự');
  const chen = ['\t -- [NetCo4 20/10] THU giftcode (tools/giftcode-thu-20-10.js): bao lai chuoi nhan duoc + ghi log, KHONG goi Billing',
    '\t BeginEvent( sceneId )', '\t \t AddText( sceneId, "' + msg1 + '" .. card .. "' + msg2 + '" .. strlen( card ) .. "' + msg3 + '" )', '\t EndEvent( sceneId )',
    '\t DispatchMissionTips( sceneId, selfId )',
    '\t local  h  =  openfile( "./txt/NetCo4Web/giftcode-thu.log", "a" )',
    '\t if  h  then',
    '\t \t write( h, LuaFnGetCurrentTime() .. "\\t" .. LuaFnGetGUID( sceneId, selfId ) .. "\\t" .. GetName( sceneId, selfId ) .. "\\t" .. card .. "\\n" )',
    '\t \t closefile( h )', '\t end', '\t if  1  then  return  end'].join(E) + E;
  const s = goc.slice(0, het) + chen + goc.slice(het);
  if (cao(s) !== cao(goc) + cao(msg1 + msg2 + msg3)) { console.log('LOI lech byte eprize'); loi++; }
  ra[f] = s; console.log(f + ': OpenCard -> bao lai chuoi + log');
}
if (loi) process.exit(1);
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
for (const [f, s] of Object.entries(ra)) fs.writeFileSync(path.join(S, f), s, 'latin1');
console.log('DA GHI');
