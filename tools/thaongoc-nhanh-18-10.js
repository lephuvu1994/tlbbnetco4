// 18/10 (chu server): NPC Quach Kien An (Lac Duong, obj/luoyang/oluoyang_penghuaiyu.lua 000110) - "Thao ngoc nhanh (100 KNB / vien)".
// Engine KHONG co ham Lua go ngoc (chi goi client CGRemoveGem -> Obj_Human::RemoveGem), nen NPC lam phan con lai:
//   2030 xem truoc: dem ngoc dang kham tren moi trang bi trong tui (GetGemEmbededCount, bo mon khoa mat khau), so bua
//        Cao cap Bao Thach Trich Tru Phu cap 9 (30900044: thao moi cap, GIU NGUYEN cap, ngoc bi khoa) dang co -> thieu bao nhieu, bao nhieu KNB.
//   2031 xac nhan: moi la tru 100 KNB truoc -> TryRecieveItem + khoa (LuaFnItemBind); nhan hut thi hoan KNB la do; gioi han theo o trong
//        (bua KHONG chong - engine xoa ca o bua khi thao). Xong mo bang thao ngoc (UI 27, nhu muc "Thao Go Bao Thach" 3) -> click tung vien.
// Lua, can cap-nhat, khong restart. Chay: node tools/thaongoc-nhanh-18-10.js. Rollback: tag truoc-thaongoc-nhanh-18-10
const fs = require('fs');
const p = __dirname + '/../server/Public/Data/Script/obj/luoyang/oluoyang_penghuaiyu.lua';
const MAP = JSON.parse(fs.readFileSync(__dirname + '/viscii-map.json', 'utf8'));
const vn = (s) => [...s.normalize('NFC')].map((c) => (c.charCodeAt(0) < 128 ? c : '\\' + MAP[c])).join('');
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
let t = fs.readFileSync(p, 'latin1');
const t0 = t, nl = t.includes('\r\n') ? '\r\n' : '\n';
if (t.includes('x000110_ThaoXem')) throw new Error('da chay roi');
const Q = (s) => '"' + vn(s) + '"';

// (a) menu Xuong Bao Thach (17): ngay duoi "Thao Go Bao Thach" (6, 3)
const m3 = t.match(/[^\n]*AddNumText\(\s*sceneId,\s*x000110_g_scriptId,\s*"[^"\n]*",\s*6,\s*3\s*\)[^\n]*\n/);
if (!m3) throw new Error('khong thay muc Thao Go Bao Thach (6, 3)');
if (t.split(m3[0]).length !== 2) throw new Error('muc (6, 3) khop nhieu lan');
t = t.replace(m3[0], m3[0] + '\t\t AddNumText(  sceneId,  x000110_g_scriptId,  ' + Q('#G Tháo ngọc nhanh (100 KNB / viên, giữ nguyên cấp)') + ',  6,  2030  )   -- [NetCo4 18/10] tools/thaongoc-nhanh-18-10.js' + nl);

// (b) re nhanh 2030 / 2031 ngay truoc nhanh 2022
const k = '\tif  GetNumText()  ==  2022  then';
if (t.split(k).length !== 2) throw new Error('khong thay nhanh 2022');
t = t.replace(k, [
  '\tif  GetNumText()  ==  2030  then   -- [NetCo4 18/10] Thao ngoc nhanh: xem truoc',
  '\t\tx000110_ThaoXem(  sceneId,  selfId,  targetId  )',
  '\t\treturn',
  '\tend',
  '\tif  GetNumText()  ==  2031  then   -- [NetCo4 18/10] Thao ngoc nhanh: tru KNB, phat bua, mo bang thao ngoc',
  '\t\tx000110_ThaoLam(  sceneId,  selfId,  targetId  )',
  '\t\treturn',
  '\tend',
  ''].join(nl) + k);

// (c) ham cuoi file
t = t.replace(/\s*$/, '') + nl + nl + [
  '--**********************************',
  '-- [NetCo4 18/10] Thao ngoc nhanh (100 KNB / vien): NPC tinh so ngoc, ban du bua Cao cap Trich Tru Phu cap 9 (30900044, thao moi cap',
  '-- GIU NGUYEN cap, ngoc bi khoa), roi mo bang thao ngoc (UI 27). Engine khong cho Lua go ngoc -> nguoi choi click thao tung vien.',
  '--**********************************',
  'x000110_g_ThaoBua = 30900044',
  'x000110_g_ThaoGia = 100',
  '',
  '-- so ngoc dang kham tren moi trang bi trong tui (bo mon khoa mat khau)',
  'function x000110_ThaoDem( sceneId, selfId )',
  '\tlocal ngoc, mon = 0, 0',
  '\tlocal bagbegin = GetBasicBagStartPos( sceneId, selfId )',
  '\tlocal bagend = GetBasicBagEndPos( sceneId, selfId )',
  '\tfor i = bagbegin, bagend do',
  '\t\tif LuaFnGetItemTableIndexByIndex( sceneId, selfId, i ) > 0 and LuaFnGetBagEquipType( sceneId, selfId, i ) ~= -1',
  '\t\t   and LuaFnIsItemLocked( sceneId, selfId, i ) == 0 then',
  '\t\t\tlocal n = GetGemEmbededCount( sceneId, selfId, i )',
  '\t\t\tif n ~= nil and n > 0 then',
  '\t\t\t\tngoc = ngoc + n',
  '\t\t\t\tmon = mon + 1',
  '\t\t\tend',
  '\t\tend',
  '\tend',
  '\treturn ngoc, mon',
  'end',
  '',
  'function x000110_ThaoXem( sceneId, selfId, targetId )',
  '\tlocal ngoc, mon = x000110_ThaoDem( sceneId, selfId )',
  '\tlocal co = LuaFnGetAvailableItemCount( sceneId, selfId, x000110_g_ThaoBua )',
  '\tlocal thieu = ngoc - co',
  '\tif thieu < 0 then',
  '\t\tthieu = 0',
  '\tend',
  '\tlocal o = LuaFnGetPropertyBagSpace( sceneId, selfId )',
  '\tlocal lan = thieu',
  '\tif lan > o then',
  '\t\tlan = o',
  '\tend',
  '\tBeginEvent( sceneId )',
  '\t\tAddText( sceneId, ' + Q('#YTháo ngọc nhanh#W: mỗi viên 1 lá Cao cấp Bảo Thạch Trích Trừ Phù cấp 9 (#G100 KNB#W) - tháo mọi cấp, ngọc #Ggiữ nguyên cấp#W và bị khóa vào nhân vật.') + ' )',
  '\t\tAddText( sceneId, format( ' + Q('Ngọc đang khảm trên trang bị trong túi: #G%d#W viên (%d món). Bùa đang có: #G%d#W lá.') + ', ngoc, mon, co ) )',
  '\t\tif lan > 0 then',
  '\t\t\tif lan < thieu then',
  '\t\t\t\tAddText( sceneId, format( ' + Q('Thiếu %d lá nhưng túi đạo cụ chỉ còn %d ô trống: lần này nhận %d lá, tháo xong bấm lại.') + ', thieu, o, lan ) )',
  '\t\t\tend',
  '\t\t\tAddText( sceneId, format( ' + Q('KNB hiện có: #G%d') + ', YuanBao( sceneId, selfId, -1, 3, 0 ) ) )',
  '\t\t\tAddNumText( sceneId, x000110_g_scriptId, format( ' + Q('#cFF0000Xác nhận: trả %d KNB nhận %d bùa + mở bảng tháo ngọc') + ', lan * x000110_g_ThaoGia, lan ), 6, 2031 )',
  '\t\telseif ngoc > 0 and thieu == 0 then',
  '\t\t\tAddNumText( sceneId, x000110_g_scriptId, ' + Q('Đã đủ bùa - mở bảng tháo ngọc') + ', 6, 3 )',
  '\t\telseif ngoc > 0 then',
  '\t\t\tAddText( sceneId, ' + Q('Túi đạo cụ hết ô trống, dọn bớt rồi bấm lại.') + ' )',
  '\t\telse',
  '\t\t\tAddText( sceneId, ' + Q('Không có trang bị nào trong túi đang khảm ngọc (món khóa mật khẩu không tính).') + ' )',
  '\t\tend',
  '\tEndEvent( sceneId )',
  '\tDispatchEventList( sceneId, selfId, targetId )',
  'end',
  '',
  '-- moi la: tru KNB truoc, nhan + khoa bua; nhan hut thi hoan KNB la do. Xong mo bang thao ngoc.',
  'function x000110_ThaoLam( sceneId, selfId, targetId )',
  '\tlocal ngoc, mon = x000110_ThaoDem( sceneId, selfId )',
  '\tlocal thieu = ngoc - LuaFnGetAvailableItemCount( sceneId, selfId, x000110_g_ThaoBua )',
  '\tlocal o = LuaFnGetPropertyBagSpace( sceneId, selfId )',
  '\tif thieu > o then',
  '\t\tthieu = o',
  '\tend',
  '\tlocal nhan, hetknb = 0, 0',
  '\tlocal k = 0',
  '\twhile k < thieu do',
  '\t\tk = k + 1',
  '\t\tif YuanBao( sceneId, selfId, -1, 3, 0 ) < x000110_g_ThaoGia then',
  '\t\t\thetknb = 1',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tif YuanBao( sceneId, selfId, -1, 2, x000110_g_ThaoGia ) ~= 0 then',
  '\t\t\thetknb = 1',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tlocal pos = TryRecieveItem( sceneId, selfId, x000110_g_ThaoBua, 1 )',
  '\t\tif pos == nil or pos < 0 then',
  '\t\t\tYuanBao( sceneId, selfId, -1, 1, x000110_g_ThaoGia )',
  '\t\t\tbreak',
  '\t\tend',
  '\t\tLuaFnItemBind( sceneId, selfId, pos )',
  '\t\tnhan = nhan + 1',
  '\tend',
  '\tlocal msg = format( ' + Q('Đã nhận %d bùa tháo ngọc (%d KNB).') + ', nhan, nhan * x000110_g_ThaoGia )',
  '\tif hetknb == 1 then',
  '\t\tmsg = msg .. ' + Q(' Không đủ KNB cho số còn lại.') + '',
  '\tend',
  '\tx000110_NotifyTip( sceneId, selfId, msg )',
  '\tBeginUICommand( sceneId )',
  '\t\tUICommand_AddInt( sceneId, targetId )',
  '\tEndUICommand( sceneId )',
  '\tDispatchUICommand( sceneId, selfId, 27 )',
  'end',
  ''].join(nl);
if (hi(t) !== hi(t0)) throw new Error('so byte > 0x7f lech');
fs.writeFileSync(p, t, 'latin1');
console.log('da them Thao ngoc nhanh (2030/2031) vao Quach Kien An');
