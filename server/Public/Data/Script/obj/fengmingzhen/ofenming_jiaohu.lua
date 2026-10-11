-- phßþng minh NPC
-- tiêu h± 
-- trang b¸ thång linh 
x044800_g_scriptId  =  044800
--**********************************
-- sñ ki®n ðóng h² nh§p kh¦u 
--**********************************
function  x044800_OnDefaultEvent(  sceneId,  selfId,targetId  )
      local  myLevel  =  GetLevel(sceneId,  selfId)
      if  myLevel  <  85  then
                BeginEvent(sceneId)
	 	 AddText(sceneId,  "        c¤p b§c cüa ngß½i th¤p h½n 85 c¤p , không th¬ sØ døng trang b¸ thång linh chÑc nång .")
	 EndEvent(sceneId)
	 DispatchEventList(sceneId,selfId,targetId)
            return
      end

	 BeginEvent(sceneId)
	 	 AddText(sceneId,"        #W Vß½ng Quy«n Võng Thª , Thiên ÐÕo Phúc Phän , CØu Ðïnh Giáng Thª , TØ Vi Khäi Hoàn . #r        #W Th¶i bu±i loÕn thª , anh hùng nhß các hÕ nên c¥n có sÑc mÕnh cüa Vß½ng Quy«n - Thiên ÐÕo m¾i có th¬ hi®u l®nh thiên hÕ, nªu mu¯n chï c¥n có ")
	 	 AddText(sceneId,"        #W#G TØ Vi Linh Phách #W , ta s¨ giúp ngß½i lên c¤p Trang B¸ #cFF0000Vß½ng Quy«n- Thiên ÐÕo #W  , tung hoành thiên hÕ , ngang d÷c ð¤t tr¶i ! ")
	 	 AddText(sceneId," #ef12345#YTØ Vi Linh Phách r¾t tÕi Túc C¥u và Tam Th¥n Äo Cänh, rß½ng Tam Th¥n Äo Cänh")	
	 	 AddNumText(  sceneId,  x044800_g_ScriptId,  " #cFF0000Thång Linh Vß½ng Quy«n ",6,1)
		 AddNumText(  sceneId,  x044800_g_ScriptId,  " #cFF0000Vuong Quy«n tiªn c¤p Thiên ÐÕo ",6,3)
	 	 AddNumText(  sceneId,  x044800_g_ScriptId,  " #cFF0000Thång Linh Thiên ÐÕo ",6,2)
	 	 AddNumText(  sceneId,  x044800_g_ScriptId,  " #GThång Linh Di D¶i ",6,4)
	 	 AddNumText(  sceneId,  x044800_g_scriptId,  " #GTh\229ng Linh nhanh (ch\247n \240\176 1 l\165n, ch\239 b\164m)",6,50000)   -- [NetCo4 11/10] x044800_TLNhanh
	 EndEvent(sceneId)
	 DispatchEventList(sceneId,selfId,targetId)
end
--**********************************
-- sñ ki®n li®t bi¬u ch÷n trúng hÕng nh¤t 
--**********************************
function  x044800_OnEventRequest(  sceneId,  selfId,  targetId,  eventId)
	if GetNumText() >= 50000 then   -- [NetCo4 11/10] Thang Linh nhanh
		x044800_TLNhanh( sceneId, selfId, targetId, GetNumText() )
		return
	end

	 if  GetNumText()  ==  1  then
	       BeginUICommand(sceneId)
	             UICommand_AddInt(sceneId,targetId);
	             EndUICommand(sceneId  )
	       DispatchUICommand(sceneId,selfId,  201708093)
                      return
                end

	 if  GetNumText()  ==  2  then
	       BeginUICommand(sceneId)
	             UICommand_AddInt(sceneId,targetId);
	             EndUICommand(sceneId  )
	       DispatchUICommand(sceneId,selfId,  201708097)
                      return
                end

	 if  GetNumText()  ==  3  then
	       BeginUICommand(sceneId)
	             UICommand_AddInt(sceneId,targetId);
	             EndUICommand(sceneId  )
	       DispatchUICommand(sceneId,selfId,  20170526)
                      return
                end

	 if  GetNumText()  ==  4  then
	       BeginUICommand(sceneId)
	             UICommand_AddInt(sceneId,targetId);
                            UICommand_AddInt(  sceneId,8)
	             EndUICommand(sceneId  )
	       DispatchUICommand(sceneId,selfId,  20090721    )
                      return
                end


	 if  GetNumText()  >=  5  then
	       BeginEvent(sceneId)
	 	 AddText(sceneId,"        này chÑc nång h§u kÏ m· ra , t§n tình mong ðþi ! ")
	       EndEvent(sceneId)
	       DispatchEventList(sceneId,selfId,targetId)
                      return
                end
end

--**********************************
-- [NetCo4 11/10] THANG LINH NHANH (tools/thanglinh-nhanh-11-10.js): chon mon 1 lan, bam nut lien tuc. Goi x391060_MsgBox32Goc (xian1z.lua).
--**********************************
x044800_g_TLPhach = 30600084

-- cap Vuong Quyen (w#p) / Thien Dao (t#p) trong chuoi creator
function x044800_TLDoc( sceneId, selfId, o )
	local _, cr = LuaFnGetItemCreator( sceneId, selfId, o )
	if cr == nil then
		cr = ""
	end
	local vq, td = 0, 0
	local a = strfind( cr, "w#p" )
	if a ~= nil then
		vq = tonumber( strsub( cr, a + 3, a + 3 ) )
	end
	local b = strfind( cr, "t#p" )
	if b ~= nil then
		td = tonumber( strsub( cr, b + 3, b + 3 ) )
	end
	if vq == nil then
		vq = 0
	end
	if td == nil then
		td = 0
	end
	return vq, td
end

-- ma trang bi o tui o (0-59), -1 neu khong phai
function x044800_TLMa( sceneId, selfId, o )
	if o < 0 or o > 59 then
		return -1
	end
	local ma = LuaFnGetItemTableIndexByIndex( sceneId, selfId, o )
	if ma == nil or ma < 10000010 or ma >= 10957019 then
		return -1
	end
	return ma
end

function x044800_TLBang( sceneId, selfId, targetId, o, ma )
	local vq, td = x044800_TLDoc( sceneId, selfId, o )
	local co = LuaFnGetAvailableItemCount( sceneId, selfId, x044800_g_TLPhach )
	local m = o * 1000 + mod( ma, 1000 )
	BeginEvent( sceneId )
		AddText( sceneId, "#{_ITEM"..ma.."}" )
		if vq < 9 then
			AddText( sceneId, "#YV\223\189ng Quy\171n#W: c\164p "..vq.."/9 - l\165n t\190i c\165n #G"..( 20 * vq + 1 ).."#W T\216 Vi Linh Ph\225ch + 5 v\224ng" )
		else
			AddText( sceneId, "#YV\223\189ng Quy\171n#W: 9/9 (t\175i \240a)" )
		end
		if td < 1 then
			AddText( sceneId, "#YThi\234n \208\213o#W: ch\223a ti\170n c\164p (V\223\189ng Quy\171n 9 r\176i ch\247n m\248c V\223\189ng Quy\171n ti\170n c\164p Thi\234n \208\213o)" )
		elseif td < 9 then
			AddText( sceneId, "#YThi\234n \208\213o#W: c\164p "..td.."/9 - l\165n t\190i c\165n #G"..( 10 * td + 100 ).."#W T\216 Vi Linh Ph\225ch + 5 v\224ng" )
		else
			AddText( sceneId, "#YThi\234n \208\213o#W: 9/9 (t\175i \240a)" )
		end
		AddText( sceneId, "T\216 Vi Linh Ph\225ch \240ang c\243: #G"..co )
		if vq < 9 then
			AddNumText( sceneId, x044800_g_scriptId, "#cFF0000Th\229ng Linh V\223\189ng Quy\171n", 6, 300000 + m )
		end
		if td >= 1 and td < 9 then
			AddNumText( sceneId, x044800_g_scriptId, "#cFF0000Th\229ng Linh Thi\234n \208\213o", 6, 400000 + m )
		end
		AddNumText( sceneId, x044800_g_scriptId, "Ch\247n m\243n kh\225c", 8, 50000 )
	EndEvent( sceneId )
	DispatchEventList( sceneId, selfId, targetId )
end

function x044800_TLNhanh( sceneId, selfId, targetId, n )
	if n == 50000 then
		BeginEvent( sceneId )
			AddText( sceneId, "#YTh\229ng Linh nhanh#W: ch\247n trang b\184 trong t\250i (\208\213o c\248) 1 l\165n, sau \240\243 ch\239 c\165n b\164m n\250t Th\229ng Linh li\234n t\248c." )
			local k = 0
			for o = 0, 59 do
				local ma = x044800_TLMa( sceneId, selfId, o )
				if ma > 0 and k < 20 then
					local vq, td = x044800_TLDoc( sceneId, selfId, o )
					k = k + 1
					AddText( sceneId, k..". #{_ITEM"..ma.."} #W(VQ "..vq.."/9, TD "..td.."/9)" )
					AddNumText( sceneId, x044800_g_scriptId, "Ch\247n m\243n s\175 "..k, 6, 60000 + o * 1000 + mod( ma, 1000 ) )
				end
			end
			if k == 0 then
				AddText( sceneId, "#RTrong t\250i kh\244ng c\243 trang b\184." )
			end
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		return
	end
	local kieu = 0
	local m = n - 60000
	if n >= 300000 then
		kieu = floor( n / 100000 ) - 2
		m = mod( n, 100000 )
	end
	local o = floor( m / 1000 )
	local ma = x044800_TLMa( sceneId, selfId, o )
	if ma <= 0 or mod( ma, 1000 ) ~= mod( m, 1000 ) then
		BeginEvent( sceneId )
			AddText( sceneId, "#RT\250i \240\227 thay \240\177i, ch\247n l\213i." )
			AddNumText( sceneId, x044800_g_scriptId, "Ch\247n l\213i", 8, 50000 )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		return
	end
	if kieu == 1 or kieu == 2 then
		CallScriptFunction( 391060, "MsgBox32Goc", sceneId, selfId, o, kieu * 100 )
	end
	x044800_TLBang( sceneId, selfId, targetId, o, ma )
end
