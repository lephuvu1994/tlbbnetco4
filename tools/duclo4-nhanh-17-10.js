// 17/10 (chu server): NPC Quach Kien An (Lac Duong, obj/luoyang/oluoyang_penghuaiyu.lua 000110) - nut "Duc lo 4 nhanh".
// Giong "Duc Nhanh 3 lo" (2010): quet tui. Mon nao DUNG 3 lo -> duc lo 4, 2000 KNB / mon (tru truoc, duc that bai thi hoan).
// Khong tinh tien: mon chua du 3 lo (phai duc 3 lo truoc), mon da 4 lo, mon khoa mat khau.
// Loai trang bi: 0-7, 11-15, 17 (Am Khi). Bo 8 Toa Ky / 9 Lenh Bai / 10 Vo Hon / 18 Long Van (da co nut Free 2021), 16 Thoi Trang.
// Menu 2022 = xem truoc (dem mon + so KNB), 2023 = xac nhan duc. Rollback: tag truoc-duclo4-nhanh-17-10
const fs = require('fs');
const REPO = __dirname + '/../';
const MAP = JSON.parse(fs.readFileSync(REPO + 'tools/viscii-map.json', 'utf8'));
const vn = (s) => [...s.normalize('NFC')].map((c) => (c.charCodeAt(0) < 128 ? c : '\\' + MAP[c])).join('');
const p = REPO + 'server/Public/Data/Script/obj/luoyang/oluoyang_penghuaiyu.lua';
let t = fs.readFileSync(p, 'latin1');
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
const hi0 = hi(t);
const crlf = (s) => s.split('\r\n').join('\n').split('\n').join('\r\n');
function chen(moc, them, truoc) {
  const k = t.split(moc).length - 1;
  if (k !== 1) throw new Error('moc "' + moc.slice(0, 60) + '" xuat hien ' + k + ' lan');
  t = truoc ? t.replace(moc, crlf(them) + moc) : t.replace(moc, moc + crlf(them));
}
// 1) nut trong menu Xuong Trang Bi, ngay sau nut Free 2021 (moc = phan ASCII cuoi dong 2021 + CRLF)
chen('(Free)",  6,  2021  )   -- [NetCo4 08/10] bat lai, Long Van + Vo Hon + Lenh Bai + Toa Ky (khong Am Khi)\r\n',
  '\t\t AddNumText(  sceneId,  x000110_g_scriptId,  "' + vn('#G Đục lỗ 4 nhanh (2000 KNB / món đủ 3 lỗ)') + '",  6,  2022  )   -- [NetCo4 17/10] tools/duclo4-nhanh-17-10.js\n');
// 2) xu ly 2022 / 2023, dat truoc khoi 2021
chen('\t if  GetNumText()==  2021  then',
  '\tif  GetNumText()  ==  2022  then   -- [NetCo4 17/10] Duc lo 4 nhanh: xem truoc\n' +
  '\t\tx000110_Lo4Xem(  sceneId,  selfId,  targetId  )\n' +
  '\t\treturn\n' +
  '\tend\n' +
  '\tif  GetNumText()  ==  2023  then   -- [NetCo4 17/10] Duc lo 4 nhanh: xac nhan\n' +
  '\t\tx000110_Lo4Duc(  sceneId,  selfId,  targetId  )\n' +
  '\t\treturn\n' +
  '\tend\n', true);
// 3) ham moi cuoi file
const ham = [
  '',
  '-- [NetCo4 17/10] DUC LO 4 NHANH (tools/duclo4-nhanh-17-10.js). Quet tui: mon DUNG 3 lo -> lo 4, x000110_g_Lo4Gia KNB / mon.',
  '-- Khong tinh tien mon chua du 3 lo / da 4 lo / khoa mat khau. Loai 8, 9, 10, 18 da co nut Free 2021; 16 Thoi Trang bo.',
  'x000110_g_Lo4Gia = 2000',
  'x000110_g_Lo4Loai = { 0, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 17 }',
  '',
  '-- 1 = mon thuoc loai duoc duc lo 4 nhanh',
  'function x000110_Lo4LoaiDung( sceneId, selfId, i )',
  '\tlocal EquipType = LuaFnGetBagEquipType( sceneId, selfId, i )',
  '\tfor j, loai in x000110_g_Lo4Loai do',
  '\t\tif loai == EquipType then',
  '\t\t\treturn 1',
  '\t\tend',
  '\tend',
  '\treturn 0',
  'end',
  '',
  '-- dem: du (dung 3 lo, se duc), chua (duoi 3 lo), roi (da 4 lo), khoa (khoa mat khau)',
  'function x000110_Lo4Dem( sceneId, selfId )',
  '\tlocal du, chua, roi, khoa = 0, 0, 0, 0',
  '\tlocal bagbegin = GetBasicBagStartPos( sceneId, selfId )',
  '\tlocal bagend = GetBasicBagEndPos( sceneId, selfId )',
  '\tfor i = bagbegin, bagend do',
  '\t\tif LuaFnGetItemTableIndexByIndex( sceneId, selfId, i ) > 0 and x000110_Lo4LoaiDung( sceneId, selfId, i ) == 1 then',
  '\t\t\tlocal n = GetBagGemCount( sceneId, selfId, i )',
  '\t\t\tif LuaFnIsItemLocked( sceneId, selfId, i ) ~= 0 then',
  '\t\t\t\tkhoa = khoa + 1',
  '\t\t\telseif n == 3 then',
  '\t\t\t\tdu = du + 1',
  '\t\t\telseif n >= 4 then',
  '\t\t\t\troi = roi + 1',
  '\t\t\telse',
  '\t\t\t\tchua = chua + 1',
  '\t\t\tend',
  '\t\tend',
  '\tend',
  '\treturn du, chua, roi, khoa',
  'end',
  '',
  'function x000110_Lo4Xem( sceneId, selfId, targetId )',
  '\tlocal du, chua, roi, khoa = x000110_Lo4Dem( sceneId, selfId )',
  '\tlocal knb = YuanBao( sceneId, selfId, -1, 3, 0 )',
  '\tBeginEvent( sceneId )',
  '\t\tAddText( sceneId, format( "' + vn('#YĐục lỗ 4 nhanh#W: món trong túi đã đủ 3 lỗ được đục lỗ 4, mỗi món #G%d#W KNB.') + '", x000110_g_Lo4Gia ) )',
  '\t\tAddText( sceneId, format( "' + vn('Đủ 3 lỗ (sẽ đục): #G%d#W món = #G%d#W KNB') + '", du, du * x000110_g_Lo4Gia ) )',
  '\t\tAddText( sceneId, format( "' + vn('Không tốn: chưa đủ 3 lỗ %d món (dùng Đục Nhanh 3 lỗ trước), đã 4 lỗ %d món, đang khóa %d món') + '", chua, roi, khoa ) )',
  '\t\tAddText( sceneId, format( "' + vn('KNB hiện có: #G%d') + '", knb ) )',
  '\t\tif du > 0 then',
  '\t\t\tAddNumText( sceneId, x000110_g_scriptId, format( "' + vn('#cFF0000Xác nhận đục lỗ 4 cho %d món (%d KNB)') + '", du, du * x000110_g_Lo4Gia ), 6, 2023 )',
  '\t\tend',
  '\tEndEvent( sceneId )',
  '\tDispatchEventList( sceneId, selfId, targetId )',
  'end',
  '',
  '-- tru KNB truoc tung mon; duc xong kiem lai so lo, khong len 4 thi hoan KNB',
  'function x000110_Lo4Duc( sceneId, selfId, targetId )',
  '\tlocal xong, thieu = 0, 0',
  '\tlocal bagbegin = GetBasicBagStartPos( sceneId, selfId )',
  '\tlocal bagend = GetBasicBagEndPos( sceneId, selfId )',
  '\tfor i = bagbegin, bagend do',
  '\t\tif LuaFnGetItemTableIndexByIndex( sceneId, selfId, i ) > 0 and x000110_Lo4LoaiDung( sceneId, selfId, i ) == 1',
  '\t\t   and LuaFnIsItemLocked( sceneId, selfId, i ) == 0 and GetBagGemCount( sceneId, selfId, i ) == 3 then',
  '\t\t\tif YuanBao( sceneId, selfId, -1, 3, 0 ) < x000110_g_Lo4Gia then',
  '\t\t\t\tthieu = thieu + 1',
  '\t\t\telseif YuanBao( sceneId, selfId, -1, 2, x000110_g_Lo4Gia ) == 0 then',
  '\t\t\t\tAddBagItemSlotFour( sceneId, selfId, i )',
  '\t\t\t\tif GetBagGemCount( sceneId, selfId, i ) >= 4 then',
  '\t\t\t\t\txong = xong + 1',
  '\t\t\t\telse',
  '\t\t\t\t\tYuanBao( sceneId, selfId, -1, 1, x000110_g_Lo4Gia )',
  '\t\t\t\tend',
  '\t\t\tend',
  '\t\tend',
  '\tend',
  '\tlocal msg = format( "' + vn('Đục lỗ 4 thành công %d món, tốn %d KNB.') + '", xong, xong * x000110_g_Lo4Gia )',
  '\tif thieu > 0 then',
  '\t\tmsg = msg .. format( "' + vn(' Không đủ KNB cho %d món.') + '", thieu )',
  '\tend',
  '\tx000110_NotifyTip( sceneId, selfId, msg )',
  '\tif xong > 0 then',
  '\t\tLuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, 18, 0 )',
  '\tend',
  '\tx000110_Lo4Xem( sceneId, selfId, targetId )',
  'end',
  '',
].join('\n');
if (!t.endsWith('\n')) t += '\r\n';
t += crlf(ham);
if (hi(t) !== hi0) throw new Error('byte > 0x7f doi');
fs.writeFileSync(p, t, 'latin1'); console.log('ok');
