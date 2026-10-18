// 18/10 (chu server): Sao Nguyen (MyLua/jingtong) + thao ngoc. LAM TREN LOCAL TRUOC (nhanh local, server test), on moi gop main.
//  (1) ShopTable ke 153: Cao cap Bao Thach Trich Tru Phu cap 9 (30900044) 98 -> 100 KNB (chu server: thao tung vien 100 KNB). Phu nay thao ngoc MOI CAP, GIU NGUYEN cap,
//      ngoc thao ra bi khoa (buoc dinh) vao nhan vat -> "100 KNB / vien" bang giao dien thao ngoc san co (SplitGem, click tung vien).
//      (Thao het 1 nut KHONG lam duoc: engine khong co ham Lua go ngoc; UI thao nhieu vien goi x701614_RemoveGemFromContainer khong ton tai.)
//  (2) jingtongnpc.lua 890088 muc 2 "Hop Kim Tinh Thach": hop TOAN BO manh 20700053 (2 manh -> 1 vien 20700055) 1 lan bam.
//      Nhan tung vien truoc (TryRecieveItem), tui day thi dung; chi tru 2 x so vien da nhan.
//  (3) jingtongClient.lua 890087 shengji: sau moi lan thang cap thanh cong gui UI 201107281 + vi tri trang bi
//      (EquipEducation_Update.lua nap lai mon vao bang, khoi van do ra). CAN THU tren client (handler client dung arg1).
//  (4) jingtongnpc.lua: muc moi 7 "Thang Cap Tinh Thong Nhanh": chon trang bi Tinh Thong trong tui -> chon dong -> xem truoc -> xac nhan:
//      len thang so cap toi da du nguyen lieu (gia giu nhu shengji: dong k ton k x 8 Kim Tinh Thach + 60 vang / cap, tran cap 10).
// Lua co hieu luc ngay; ShopTable can restart. Rollback: tag truoc-tinhthong-nhanh-18-10
const fs = require('fs');
const R = __dirname + '/../server/';
const MAP = JSON.parse(fs.readFileSync(__dirname + '/viscii-map.json', 'utf8'));
const vn = (s) => [...s.normalize('NFC')].map((c) => (c.charCodeAt(0) < 128 ? c : '\\' + MAP[c])).join('');
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
function va(f, fn, themHi) {
  const p = R + f, t = fs.readFileSync(p, 'latin1'), o = fn(t);
  if (o === t) throw new Error(f + ': khong doi');
  const bo = typeof themHi === 'function' ? themHi() : (themHi || 0);   // so byte VISCII cua doan cu bi go (chu moi viet escape \ddd)
  if (hi(o) !== hi(t) - bo) throw new Error(f + ': so byte > 0x7f lech ' + hi(t) + ' -> ' + hi(o) + ' (bo ' + bo + ')');
  fs.writeFileSync(p, o, 'latin1'); console.log('da sua ' + f);
}
function mot(t, a, b) { const n = t.split(a).length - 1; if (n !== 1) throw new Error('"' + a.slice(0, 60) + '" khop ' + n); return t.replace(a, b); }

// (1) shop
va('Public/Config/ShopTable.txt', (t) => {
  const L = t.split('\n'); let n = 0;
  for (let i = 0; i < L.length; i++) if (L[i].startsWith('153\t') && L[i].includes('\t30900044\t1\t-1\t98\t')) { L[i] = L[i].replace('\t30900044\t1\t-1\t98\t', '\t30900044\t1\t-1\t100\t'); n++; }
  if (n !== 1) throw new Error('ke 153 / 30900044 gia 98 khop ' + n);
  return L.join('\n');
});

// (2) + (4) NPC
const NPC = 'Public/Data/Script/MyLua/jingtong/jingtongnpc.lua';
let boHi2 = 0;
{
  const t0 = fs.readFileSync(R + NPC, 'latin1');
  const nl = t0.includes('\r\n') ? '\r\n' : '\n';
  const J = (a) => a.join(nl);
  va(NPC, (t) => {
    // muc 7 trong menu
    const m5 = t.match(/[^\n]*AddNumText\(\s*sceneId,\s*x890088_g_scriptId,[^\n]*,\s*6,\s*5\s*\)[^\n]*\n/);
    if (!m5) throw new Error('khong thay muc 5');
    t = t.replace(m5[0], m5[0] + '\t\t AddNumText(  sceneId,  x890088_g_scriptId,  "' + vn(' Thăng Cấp Tinh Thông Nhanh ') + '",  6,  7  )' + nl);
    // vao OnEventRequest: muc 7 / 1000+ xu ly truoc
    t = mot(t, 'function  x890088_OnEventRequest(  sceneId,  selfId,  targetId,  eventId  )' + nl,
      'function  x890088_OnEventRequest(  sceneId,  selfId,  targetId,  eventId  )' + nl +
      '\tif x890088_TTNhanh( sceneId, selfId, targetId, GetNumText() ) == 1 then' + nl + '\t\treturn' + nl + '\tend' + nl);
    // muc 2: hop toan bo
    const a = t.indexOf('if  GetNumText()  ==  2  then'), b = t.indexOf('if  GetNumText()  ==  3  then');
    if (a < 0 || b < a) throw new Error('khong thay khoi muc 2');
    const moi = J([
      'if  GetNumText()  ==  2  then',
      '\t\t-- [NetCo4 18/10] hop TOAN BO manh 20700053 (2 manh -> 1 vien 20700055) 1 lan bam; tui day thi dung, chi tru manh cua vien da nhan',
      '\t\tlocal n = floor( LuaFnGetAvailableItemCount( sceneId, selfId, 20700053 ) / 2 )',
      '\t\tif n < 1 then',
      '\t\t\tx890088_Tips( sceneId, selfId, "' + vn(' Không đủ 2 cái Kim Tinh Thạch Toái Phiến ') + '" )',
      '\t\t\treturn',
      '\t\tend',
      '\t\tlocal k = 0',
      '\t\twhile k < n do',
      '\t\t\tlocal r = TryRecieveItem( sceneId, selfId, 20700055, 1 )',
      '\t\t\tif r == nil or r < 0 then',
      '\t\t\t\tbreak',
      '\t\t\tend',
      '\t\t\tk = k + 1',
      '\t\tend',
      '\t\tif k > 0 then',
      '\t\t\tLuaFnDelAvailableItem( sceneId, selfId, 20700053, k * 2 )',
      '\t\tend',
      '\t\tif k < n then',
      '\t\t\tx890088_Tips( sceneId, selfId, "' + vn('Túi nguyên liệu đầy: đã hợp ') + '"..k.."/"..n.."' + vn(' Kim Tinh Thạch') + '" )',
      '\t\telse',
      '\t\t\tx890088_Tips( sceneId, selfId, "' + vn('Đã hợp ') + '"..k.."' + vn(' Kim Tinh Thạch từ ') + '"..( k * 2 ).."' + vn(' mảnh') + '" )',
      '\t\tend',
      '\t\treturn',
      '\t end',
      '\t ']);
    boHi2 = hi(t.slice(a, b));
    t = t.slice(0, a) + moi + t.slice(b);
    // ham TTNhanh cuoi file
    const TB = (s) => '"' + vn(s) + '"';
    t = t.replace(/\s*$/, '') + nl + nl + J([
      '--**********************************',
      '-- [NetCo4 18/10] Thang Cap Tinh Thong Nhanh (muc 7): chon trang bi -> chon dong -> xem truoc -> xac nhan, len thang so cap',
      '-- toi da du nguyen lieu. Gia giong x890087_shengji: dong k ton k x 8 Kim Tinh Thach (20700055) + 60 vang / cap, tran cap 10.',
      '-- GetNumText: 7 = danh sach; 1000+o tui = chon dong; 2000+o*10+dong = xem truoc; 3000+o*10+dong = lam. Kiem lai het luc lam.',
      '--**********************************',
      'x890088_g_TTDa = 20700055',
      'x890088_g_TTVang = 600000',
      '',
      'function x890088_TTDoc( sceneId, selfId, b )',
      '\tlocal id = LuaFnGetItemTableIndexByIndex( sceneId, selfId, b )',
      '\tif id == nil or id <= 0 then',
      '\t\treturn nil',
      '\tend',
      '\tlocal _, nm = LuaFnGetItemCreator( sceneId, selfId, b )',
      '\tif nm == nil then',
      '\t\treturn nil',
      '\tend',
      '\tlocal s, e, A, B, C = strfind( nm, "&JT%w%w(%d%d)%w%w(%d%d)%w%w(%d%d)" )',
      '\tif s == nil then',
      '\t\treturn nil',
      '\tend',
      '\treturn nm, s, { tonumber( A ), tonumber( B ), tonumber( C ) }, id',
      'end',
      '',
      'function x890088_TTNhanh( sceneId, selfId, targetId, n )',
      '\tif n == 7 then',
      '\t\tBeginEvent( sceneId )',
      '\t\tAddText( sceneId, ' + TB('Chọn trang bị Tinh Thông trong túi. Mỗi cấp: dòng 1 tốn 8, dòng 2 tốn 16, dòng 3 tốn 24 Kim Tinh Thạch + 60 vàng. Tối đa cấp 10.') + ' )',
      '\t\tlocal co = 0',
      '\t\tfor b = 0, 29 do',
      '\t\t\tlocal nm, s, lv, id = x890088_TTDoc( sceneId, selfId, b )',
      '\t\t\tif nm ~= nil then',
      '\t\t\t\tco = co + 1',
      '\t\t\t\tAddNumText( sceneId, x890088_g_scriptId, GetItemName( sceneId, id ).." ("..lv[1].."/"..lv[2].."/"..lv[3]..")", 6, 1000 + b )',
      '\t\t\tend',
      '\t\tend',
      '\t\tif co == 0 then',
      '\t\t\tAddText( sceneId, ' + TB('Trong túi không có trang bị Tinh Thông.') + ' )',
      '\t\tend',
      '\t\tEndEvent( sceneId )',
      '\t\tDispatchEventList( sceneId, selfId, targetId )',
      '\t\treturn 1',
      '\tend',
      '\tif n >= 1000 and n < 1030 then',
      '\t\tlocal b = n - 1000',
      '\t\tlocal nm, s, lv, id = x890088_TTDoc( sceneId, selfId, b )',
      '\t\tif nm == nil then',
      '\t\t\tx890088_Tips( sceneId, selfId, ' + TB('Không còn thấy trang bị Tinh Thông ở ô đó.') + ' )',
      '\t\t\treturn 1',
      '\t\tend',
      '\t\tBeginEvent( sceneId )',
      '\t\tAddText( sceneId, GetItemName( sceneId, id )..' + TB(': chọn dòng thuộc tính cần thăng cấp.') + ' )',
      '\t\tfor k = 1, 3 do',
      '\t\t\tAddNumText( sceneId, x890088_g_scriptId, ' + TB('Dòng ') + '..k..' + TB(' - cấp ') + '..lv[k], 6, 2000 + b * 10 + k )',
      '\t\tend',
      '\t\tEndEvent( sceneId )',
      '\t\tDispatchEventList( sceneId, selfId, targetId )',
      '\t\treturn 1',
      '\tend',
      '\tif n >= 2000 and n < 4000 then',
      '\t\tlocal x = n - 2000',
      '\t\tlocal lam = 0',
      '\t\tif x >= 1000 then',
      '\t\t\tx = x - 1000',
      '\t\t\tlam = 1',
      '\t\tend',
      '\t\tlocal b = floor( x / 10 )',
      '\t\tlocal k = x - b * 10',
      '\t\tif b > 29 or k < 1 or k > 3 then',
      '\t\t\treturn 1',
      '\t\tend',
      '\t\tlocal nm, s, lv, id = x890088_TTDoc( sceneId, selfId, b )',
      '\t\tif nm == nil then',
      '\t\t\tx890088_Tips( sceneId, selfId, ' + TB('Không còn thấy trang bị Tinh Thông ở ô đó.') + ' )',
      '\t\t\treturn 1',
      '\t\tend',
      '\t\tif lv[k] >= 10 then',
      '\t\t\tx890088_Tips( sceneId, selfId, ' + TB('Dòng này đã cấp 10 (tối đa).') + ' )',
      '\t\t\treturn 1',
      '\t\tend',
      '\t\tlocal moi = k * 8',
      '\t\tlocal c = 10 - lv[k]',
      '\t\tlocal theoDa = floor( LuaFnGetAvailableItemCount( sceneId, selfId, x890088_g_TTDa ) / moi )',
      '\t\tlocal theoVang = floor( GetMoney( sceneId, selfId ) / x890088_g_TTVang )',
      '\t\tif theoDa < c then',
      '\t\t\tc = theoDa',
      '\t\tend',
      '\t\tif theoVang < c then',
      '\t\t\tc = theoVang',
      '\t\tend',
      '\t\tif c < 1 then',
      '\t\t\tx890088_Tips( sceneId, selfId, ' + TB('Không đủ: mỗi cấp dòng ') + '..k..' + TB(' cần ') + '..moi..' + TB(' Kim Tinh Thạch + 60 vàng.') + ' )',
      '\t\t\treturn 1',
      '\t\tend',
      '\t\tif lam == 0 then',
      '\t\t\tBeginEvent( sceneId )',
      '\t\t\tAddText( sceneId, GetItemName( sceneId, id )..' + TB(' - dòng ') + '..k..' + TB(': cấp ') + '..lv[k]..' + TB(' lên cấp ') + '..( lv[k] + c )..' + TB('. Tốn ') + '..( c * moi )..' + TB(' Kim Tinh Thạch + ') + '..( c * 60 )..' + TB(' vàng.') + ' )',
      '\t\t\tAddNumText( sceneId, x890088_g_scriptId, ' + TB('Xác nhận thăng ') + '..c..' + TB(' cấp') + ', 6, 3000 + b * 10 + k )',
      '\t\t\tEndEvent( sceneId )',
      '\t\t\tDispatchEventList( sceneId, selfId, targetId )',
      '\t\t\treturn 1',
      '\t\tend',
      '\t\tif CostMoney( sceneId, selfId, c * x890088_g_TTVang ) == -1 then',
      '\t\t\tx890088_Tips( sceneId, selfId, ' + TB('Không đủ vàng.') + ' )',
      '\t\t\treturn 1',
      '\t\tend',
      '\t\tif LuaFnDelAvailableItem( sceneId, selfId, x890088_g_TTDa, c * moi ) ~= 1 then',
      '\t\t\tAddMoney( sceneId, selfId, c * x890088_g_TTVang )',
      '\t\t\tx890088_Tips( sceneId, selfId, ' + TB('Trừ Kim Tinh Thạch thất bại, đã hoàn vàng.') + ' )',
      '\t\t\treturn 1',
      '\t\tend',
      '\t\tlocal p = s + 5 + ( k - 1 ) * 4',
      '\t\tlocal nm2 = strsub( nm, 1, p - 1 )..format( "%02d", lv[k] + c )..strsub( nm, p + 2 )',
      '\t\tLuaFnSetItemCreator( sceneId, selfId, b, nm2 )',
      '\t\tLuaFnRefreshItemInfo( sceneId, selfId, b )',
      '\t\tx890088_Tips( sceneId, selfId, ' + TB('Thăng cấp Tinh Thông thành công: dòng ') + '..k..' + TB(' lên cấp ') + '..( lv[k] + c ) )',
      '\t\tLuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, 150, 0 )',
      '\t\treturn 1',
      '\tend',
      '\treturn 0',
      'end',
      '']);
    return t;
  }, () => boHi2);
}

// (3) shengji gui UI nap lai mon
const CL = 'Public/Data/Script/MyLua/jingtong/jingtongClient.lua';
va(CL, (t) => {
  const nl = t.includes('\r\n') ? '\r\n' : '\n';
  const a = t.indexOf('function x890087_shengji('), b = t.indexOf('\nfunction ', a + 10);
  if (a < 0 || b < 0) throw new Error('khong thay shengji');
  const goi = 'LuaFnRefreshItemInfo( sceneId, selfId, EQItem )';
  const than = t.slice(a, b);
  const n = than.split(goi).length - 1;
  if (n !== 3) throw new Error('shengji: RefreshItemInfo khop ' + n);
  const than2 = than.split(goi).join(goi + ' x890087_TTGiuMon( sceneId, selfId, EQItem )');
  return t.slice(0, a) + than2 + t.slice(b).replace(/\s*$/, '') + nl + nl + [
    '-- [NetCo4 18/10] sau khi thang cap Tinh Thong: bao client nap lai trang bi vao bang (UI 201107281, EquipEducation_Update.lua)',
    '-- de khoi van do ra moi lan. Client tu Clear() khi bam Thang cap; lenh nay toi sau nen nap lai duoc (can thu tren client).',
    'function x890087_TTGiuMon( sceneId, selfId, EQItem )',
    '\tBeginUICommand( sceneId )',
    '\t\tUICommand_AddInt( sceneId, EQItem )',
    '\tEndUICommand( sceneId )',
    '\tDispatchUICommand( sceneId, selfId, 201107281 )',
    'end',
    ''].join(nl);
});
