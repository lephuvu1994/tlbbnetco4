-- LÕc Dß½ng NPC
-- tr¥n phu chi 
-- bình thß¶ng 

-- chân v¯n s¯ 
x890088_g_scriptId  =  890088

-- møc tiêu NPC
x890088_g_name	 =" Ð©p Zai "

-- có sñ ki®n ID li®t bi¬u   { kªt bái , giäi tr× kªt bái , cßÞng chª giäi tr× kªt bái }
x890088_g_RelationEventList={}
x890088_g_zhenyuandata  =  {MD_ZHENYUANMISS1,MD_ZHENYUANMISS2,MD_ZHENYUANMISS3,MD_ZHENYUANMISS4,MD_ZHENYUANMISS5,MD_ZHENYUANMISS6}
--**********************************
-- sñ ki®n ðóng h² nh§p kh¦u 
--**********************************


function  x890088_Tips(  sceneId,  selfId,  str  )
	 BeginEvent(  sceneId  )
	 	 AddText(  sceneId,  str  )
	 EndEvent(  sceneId  )
	 DispatchMissionTips(  sceneId,  selfId  )
end


function  x890088_OnDefaultEvent(  sceneId,  selfId,targetId  )
	 BeginEvent(sceneId)
	 	 AddText(sceneId,"    #{ZBSX_130625_41}")
		 AddText(sceneId,"    #cFF0000 Lßu ý: hãy t¦y tinh thông và lña ch÷n thuµc tính tinh thông cho phù hþp trß¾c khi nâng c¤p tinh thông, s¨ không th¬ thay ð±i thuµc tính tinh thông c¤p 10")	 
	 	 --AddText(sceneId," #ef12345#YChÑc Nång tÕm chßa m·")	
		--local ID = LuaFnGetGUID( sceneId, selfId )
		--if ID == 1010000044  or	ID == 1010000003  	then		 
	 	 AddNumText(  sceneId,  x890088_g_scriptId,  " Lò Ly Höa ",  6,  1  )
		 AddNumText(  sceneId,  x890088_g_scriptId,  " Hþp Kim Tinh ThÕch ",  6,  2  )
	 	 AddNumText(  sceneId,  x890088_g_scriptId,  " Tinh Thông - T¦y Luy®n Trang B¸ ",  6,  3  )
	 	 AddNumText(  sceneId,  x890088_g_scriptId,  " Thång C¤p Tinh Tông ",  6,  4  )
		 AddNumText(  sceneId,  x890088_g_scriptId,  " Th\229ng C\164p Tinh Th\244ng Nhanh ",  6,  7  )
	 	 AddNumText(  sceneId,  x890088_g_scriptId,  " Di Chuy¬n Tinh Thông ",  6,  5  )
	 	 --AddNumText(  sceneId,  x890088_g_scriptId,  " Phân Giäi Trang B¸ ",  6,  6  )
		 		--end
	 EndEvent(sceneId)
	 DispatchEventList(sceneId,selfId,targetId)
end

--**********************************
-- sñ ki®n li®t bi¬u ch÷n trúng hÕng nh¤t 
--**********************************
function  x890088_OnEventRequest(  sceneId,  selfId,  targetId,  eventId  )
	if x890088_TTNhanh( sceneId, selfId, targetId, GetNumText() ) == 1 then
		return
	end
	 local  nDayCount  =  GetMissionData(  sceneId,  selfId,  MF_TW_SCHOOLUNIFORM_JOIN  )
	 local  nCount  =  GetLowWord(  nDayCount  )
	 local  nDayCount1  =  GetMissionData(  sceneId,  selfId,  MF_TW_EXPDAN10  )
	 local  nCount1  =  GetLowWord(  nDayCount1  )	 
	 
	 	 
	 
	 
	 
	 
	 
	 if  GetNumText()  ==  1  then
        BeginUICommand(  sceneId  )
        UICommand_AddInt(  sceneId,  targetId  )
	 UICommand_AddInt(  sceneId,  1  )
	 UICommand_AddInt(  sceneId,  (5-nCount))
	 UICommand_AddInt(  sceneId,(5-nCount1))
        EndUICommand(  sceneId  )
        DispatchUICommand(  sceneId,  selfId,    890174)
	 return
	 end
	 
	 
	 
	 if  GetNumText()  ==  2  then
		-- [NetCo4 18/10] hop TOAN BO manh 20700053 (2 manh -> 1 vien 20700055) 1 lan bam; tui day thi dung, chi tru manh cua vien da nhan
		local n = floor( LuaFnGetAvailableItemCount( sceneId, selfId, 20700053 ) / 2 )
		if n < 1 then
			x890088_Tips( sceneId, selfId, " Kh\244ng \240\252 2 c\225i Kim Tinh Th\213ch To\225i Phi\170n " )
			return
		end
		local k = 0
		while k < n do
			local r = TryRecieveItem( sceneId, selfId, 20700055, 1 )
			if r == nil or r < 0 then
				break
			end
			k = k + 1
		end
		if k > 0 then
			LuaFnDelAvailableItem( sceneId, selfId, 20700053, k * 2 )
		end
		if k < n then
			x890088_Tips( sceneId, selfId, "T\250i nguy\234n li\174u \240\165y: \240\227 h\254p "..k.."/"..n.." Kim Tinh Th\213ch" )
		else
			x890088_Tips( sceneId, selfId, "\208\227 h\254p "..k.." Kim Tinh Th\213ch t\215 "..( k * 2 ).." m\228nh" )
		end
		return
	 end
	 if  GetNumText()  ==  3  then
        BeginUICommand(  sceneId  )
        UICommand_AddInt(  sceneId,  targetId  )
        EndUICommand(  sceneId  )
        DispatchUICommand(  sceneId,  selfId,  20130604)
	 return
	 end	 
	 if  GetNumText()  ==  4  then
        BeginUICommand(  sceneId  )
        UICommand_AddInt(  sceneId,  targetId  )

        EndUICommand(  sceneId  )
        DispatchUICommand(  sceneId,  selfId,  20130528)
	 return
	 end	 
	 
	 if  GetNumText()  ==5  then
        BeginUICommand(  sceneId  )
        UICommand_AddInt(  sceneId,  targetId  )

        EndUICommand(  sceneId  )
        DispatchUICommand(  sceneId,  selfId,  20130628)
	 return
	 end	 
	 
	 	 if  GetNumText()  ==6  then
        BeginUICommand(  sceneId  )
        UICommand_AddInt(  sceneId,  targetId  )

        EndUICommand(  sceneId  )
        DispatchUICommand(  sceneId,  selfId,  20130522)
	 return
	 end	 	 
	 
end

--**********************************
--  
--**********************************

--**********************************
-- [NetCo4 18/10] Thang Cap Tinh Thong Nhanh (muc 7): chon trang bi -> chon dong -> xem truoc -> xac nhan, len thang so cap
-- toi da du nguyen lieu. Gia giong x890087_shengji: dong k ton k x 8 Kim Tinh Thach (20700055) + 60 vang / cap, tran cap 10.
-- GetNumText: 7 = danh sach; 1000+o tui = chon dong; 2000+o*10+dong = xem truoc; 3000+o*10+dong = lam. Kiem lai het luc lam.
--**********************************
x890088_g_TTDa = 20700055
x890088_g_TTVang = 600000

function x890088_TTDoc( sceneId, selfId, b )
	local id = LuaFnGetItemTableIndexByIndex( sceneId, selfId, b )
	if id == nil or id <= 0 then
		return nil
	end
	local _, nm = LuaFnGetItemCreator( sceneId, selfId, b )
	if nm == nil then
		return nil
	end
	local s, e, A, B, C = strfind( nm, "&JT%w%w(%d%d)%w%w(%d%d)%w%w(%d%d)" )
	if s == nil then
		return nil
	end
	return nm, s, { tonumber( A ), tonumber( B ), tonumber( C ) }, id
end

function x890088_TTNhanh( sceneId, selfId, targetId, n )
	if n == 7 then
		BeginEvent( sceneId )
		AddText( sceneId, "Ch\247n trang b\184 Tinh Th\244ng trong t\250i. M\178i c\164p: d\242ng 1 t\175n 8, d\242ng 2 t\175n 16, d\242ng 3 t\175n 24 Kim Tinh Th\213ch + 60 v\224ng. T\175i \240a c\164p 10." )
		local co = 0
		for b = 0, 29 do
			local nm, s, lv, id = x890088_TTDoc( sceneId, selfId, b )
			if nm ~= nil then
				co = co + 1
				AddNumText( sceneId, x890088_g_scriptId, GetItemName( sceneId, id ).." ("..lv[1].."/"..lv[2].."/"..lv[3]..")", 6, 1000 + b )
			end
		end
		if co == 0 then
			AddText( sceneId, "Trong t\250i kh\244ng c\243 trang b\184 Tinh Th\244ng." )
		end
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		return 1
	end
	if n >= 1000 and n < 1030 then
		local b = n - 1000
		local nm, s, lv, id = x890088_TTDoc( sceneId, selfId, b )
		if nm == nil then
			x890088_Tips( sceneId, selfId, "Kh\244ng c\242n th\164y trang b\184 Tinh Th\244ng \183 \244 \240\243." )
			return 1
		end
		BeginEvent( sceneId )
		AddText( sceneId, GetItemName( sceneId, id )..": ch\247n d\242ng thu\181c t\237nh c\165n th\229ng c\164p." )
		for k = 1, 3 do
			AddNumText( sceneId, x890088_g_scriptId, "D\242ng "..k.." - c\164p "..lv[k], 6, 2000 + b * 10 + k )
		end
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		return 1
	end
	if n >= 2000 and n < 4000 then
		local x = n - 2000
		local lam = 0
		if x >= 1000 then
			x = x - 1000
			lam = 1
		end
		local b = floor( x / 10 )
		local k = x - b * 10
		if b > 29 or k < 1 or k > 3 then
			return 1
		end
		local nm, s, lv, id = x890088_TTDoc( sceneId, selfId, b )
		if nm == nil then
			x890088_Tips( sceneId, selfId, "Kh\244ng c\242n th\164y trang b\184 Tinh Th\244ng \183 \244 \240\243." )
			return 1
		end
		if lv[k] >= 10 then
			x890088_Tips( sceneId, selfId, "D\242ng n\224y \240\227 c\164p 10 (t\175i \240a)." )
			return 1
		end
		local moi = k * 8
		local c = 10 - lv[k]
		local theoDa = floor( LuaFnGetAvailableItemCount( sceneId, selfId, x890088_g_TTDa ) / moi )
		local theoVang = floor( GetMoney( sceneId, selfId ) / x890088_g_TTVang )
		if theoDa < c then
			c = theoDa
		end
		if theoVang < c then
			c = theoVang
		end
		if c < 1 then
			x890088_Tips( sceneId, selfId, "Kh\244ng \240\252: m\178i c\164p d\242ng "..k.." c\165n "..moi.." Kim Tinh Th\213ch + 60 v\224ng." )
			return 1
		end
		if lam == 0 then
			BeginEvent( sceneId )
			AddText( sceneId, GetItemName( sceneId, id ).." - d\242ng "..k..": c\164p "..lv[k].." l\234n c\164p "..( lv[k] + c )..". T\175n "..( c * moi ).." Kim Tinh Th\213ch + "..( c * 60 ).." v\224ng." )
			AddNumText( sceneId, x890088_g_scriptId, "X\225c nh\167n th\229ng "..c.." c\164p", 6, 3000 + b * 10 + k )
			EndEvent( sceneId )
			DispatchEventList( sceneId, selfId, targetId )
			return 1
		end
		if CostMoney( sceneId, selfId, c * x890088_g_TTVang ) == -1 then
			x890088_Tips( sceneId, selfId, "Kh\244ng \240\252 v\224ng." )
			return 1
		end
		if LuaFnDelAvailableItem( sceneId, selfId, x890088_g_TTDa, c * moi ) ~= 1 then
			AddMoney( sceneId, selfId, c * x890088_g_TTVang )
			x890088_Tips( sceneId, selfId, "Tr\215 Kim Tinh Th\213ch th\164t b\213i, \240\227 ho\224n v\224ng." )
			return 1
		end
		local p = s + 5 + ( k - 1 ) * 4
		local nm2 = strsub( nm, 1, p - 1 )..format( "%02d", lv[k] + c )..strsub( nm, p + 2 )
		LuaFnSetItemCreator( sceneId, selfId, b, nm2 )
		LuaFnRefreshItemInfo( sceneId, selfId, b )
		x890088_Tips( sceneId, selfId, "Th\229ng c\164p Tinh Th\244ng th\224nh c\244ng: d\242ng "..k.." l\234n c\164p "..( lv[k] + c ) )
		LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, 150, 0 )
		return 1
	end
	return 0
end
