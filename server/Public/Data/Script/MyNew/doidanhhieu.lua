-- Áì½±NPC

x111997_g_scriptId = 111997

--**********************************
--ÊÂ¼þ½»»¥Èë¿Ú
--**********************************
function x111997_OnDefaultEvent( sceneId, selfId, targetId )
	BeginEvent( sceneId )	
		AddText(sceneId, "#RChào m×ng các hÕ ðªn v¾i Thiên Long Bát Bµ ta ðây có th¬ cho ngß½i danh hi®u biªn thân!")			
		--AddNumText( sceneId, x111997_g_scriptId, "Chuy¬n sinh", 2, 101 )
		--AddNumText( sceneId, x111997_g_scriptId, "#R[Alpha test thång c¤p vô hÕn]", 2, 102 )
		--AddNumText( sceneId, x111997_g_ScriptId, "Buff Thiên Long",6,103 )
		--AddNumText( sceneId, x111997_g_scriptId, "Biªn thân", 6, 104 )			
		AddNumText( sceneId, x111997_g_scriptId, "Nh§n danh hi®u", 6, 105 )
		AddNumText( sceneId, x111997_g_scriptId, "#GCh\170 h\224ng lo\213t \240\176 9x (10 c\225i)", 6, 9500 )   -- [NetCo4 08/10] NPC che do
		AddNumText( sceneId, x111997_g_scriptId, "#GGi\225m \240\184nh t\164t c\228 trang b\184 (Gi\225m \208\184nh Ph\249)", 6, 9501 )
		if GetName( sceneId, selfId ) == "bialk" then AddNumText( sceneId, x111997_g_scriptId, "#Y[GM] Xem trang thai giam dinh", 6, 9502 ) end
		AddNumText( sceneId, x111997_g_scriptId, "#GB\225n \240\176 ch\170 (m\183 c\216a h\224ng)", 6, 9503 )   -- [NetCo4 09/10] mo tiem 73 de ban do che (nut Ban hang)
		AddNumText( sceneId, x111997_g_scriptId, "#GChuy\172n c\223\182ng h\243a / ng\247c / \240i\234u v\229n / th\229ng linh / tinh th\244ng", 6, 1000000 )   -- [NetCo4 11/10] chuyen do (x111997_CDMenu)
		--AddNumText( sceneId, x111997_g_scriptId, "#b#GNh§n danh hi®u TOP", 6, 106 )
	 
	EndEvent( sceneId )
	DispatchEventList( sceneId, selfId, targetId )
end

--**********************************
--ÊÂ¼þÁÐ±íÑ¡ÖÐÒ»Ïî
--**********************************
function x111997_OnEventRequest( sceneId, selfId, targetId, eventId )
	if GetNumText() >= 1000000 then   -- [NetCo4 11/10] chuyen do
		x111997_CDMenu( sceneId, selfId, targetId, GetNumText() )
		return
	end
	if GetNumText() == 9503 then   -- [NetCo4 09/10] cua hang 73 (Nghiem Bach Thao): ban do che 9x bang nut "Ban hang"
		DispatchShopItem( sceneId, selfId, targetId, 73 )
		return
	end
	if GetNumText() >= 9500 and GetNumText() <= 9999 then   -- [NetCo4 08/10] NPC che do
		x111997_NetCo4CheDo( sceneId, selfId, targetId, GetNumText() )
		return
	end
	if GetNumText() == 101 then
    local 	nam	= LuaFnGetName( sceneId, selfId )
	local	uiPoint = GetHumanJuqingPoint(sceneId, selfId)
	BeginEvent(sceneId)
	      AddText(sceneId,"   #WChào #G"..nam.." #Wðªn g£p ta có chuy®n gì? Các hÕ mu¯n chuy¬n sinh à?")	
	      AddText(sceneId,"   #WCác hÕ ðã chuy¬n sinh #G"..uiPoint.." #Wl¥n r°i!")
			AddNumText( sceneId, x111997_g_ScriptId, "Ðúng ta mu¯n Chuy¬n sinh", 1, 1011 )
			AddNumText( sceneId, x111997_g_ScriptId, "V« chuy¬n sinh", 11, 1012 )
			AddNumText( sceneId, x111997_g_scriptId,"Quay lÕi", 8, 8888)
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText() == -102 then   -- [NetCo4 20/10] tat: phat free 10422016 + 10423024 (menu da an, client sua van goi duoc)
		BeginAddItem(sceneId)
		AddItem( sceneId, 30900078, 7 )
		AddItem( sceneId, 30900079, 7 )
		AddItem( sceneId, 39999901, 2 )
		AddItem( sceneId, 30309090, 1 )
		AddItem( sceneId, 50813004, 2 )
		AddItem( sceneId, 10422016, 1 )
		AddItem( sceneId, 10423024, 1 )
		EndAddItem(sceneId,selfId)		
		AddItemListToHuman(sceneId,selfId)		
		--for i = 0,100 do
		--BeginEvent(sceneId)
		--LuaFnAddExp( sceneId, selfId,60000000)
		--LuaFnSendSpecificImpactToUnit(sceneId,selfId,selfId,selfId,18,1000)
		--SetLevel( sceneId, selfId, 130)
	    --local menpaiPoint = GetHumanMenpaiPoint(sceneId, selfId)
		--SetHumanMenpaiPoint(sceneId, selfId, menpaiPoint+30000 )
		--AddText(sceneId,"Lînh ði¬m c¯ng hiªn môn phái thành công các hÕ ðßþc 30000 ði¬m công hiªn")
		--EndEvent(sceneId)
		--DispatchEventList(sceneId,selfId,targetId)
        --end

	elseif GetNumText() == 103 then
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 8039, 0) --tim
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 5928, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Nh§n hi®u Ñng thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)	
    
	elseif GetNumText() == 104 then
             	BeginEvent( sceneId )
		AddText( sceneId, "#cFF0000Gi¾i thi®u: #YM¶i các hÕ lña ch÷n loÕi hình biªn thân" )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YTh¯ Gia",7,8501 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YThö Ng÷c",7,8502 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YH¡c Hùng",7,8503 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YÐång Mê",7,8504 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YCây thông Noel",7,8505 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YChuông l¾n",7,8506 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YÐß¶ng quä hÕp",7,8507 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YPh¤n H°ng Hùng",7,8508 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YTi¬u H° Tiên",7,8509 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YÐÕi B±n Hùng",7,8510 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YCông Phu Hùng Miêu",7,8511 )
		AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YSiêu Nhân Hùng Miêu",7,8512 )
		--AddNumText( sceneId, x111997_g_ScriptId, "#GSiêu c¤p biªn thân #W-- #YTest",7,8513 )
		AddNumText(sceneId, x111997_g_scriptId,"Quay lÕi", 8, 8888)
    	EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
    
	elseif GetNumText() == 105 then
		local strGUID = LuaFnGetGUID( sceneId, selfId )
        BeginEvent( sceneId )
		AddText( sceneId, "#cFF0000Gi¾i thi®u: #YCác hÕ · ðây có th¬ lña ch÷n danh hi®u mà các hÕ thích." )
		AddNumText( sceneId, x111997_g_ScriptId, "#eDC4C18NetCo4",7,15 )
		AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0T¸ch M¸ch Cao Thü ",7,16 )
		AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0Nh¤t ÐÕi Cao Thü",7,17 )
		AddNumText( sceneId, x111997_g_ScriptId, "#Y TÑ ÐÕi MÛ Nhân",7,18 )
		AddNumText( sceneId, x111997_g_ScriptId, "#Y TÑ ÐÕi MÛ Nam",7,19 )
		AddNumText( sceneId, x111997_g_ScriptId, "#YC¦m Y V®",7,20 )
		AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0TÑ ÐÕi Hµ V®",7,21 )
		AddNumText( sceneId, x111997_g_ScriptId, "#YChü T¸ch Phß¶ng #3 ",7,22 )
		AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0Hùng Chþ L¾n",7,23 )
		AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0Trß·ng Thôn  #1",7,24 )
		AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0Trß·ng Công An Xã #3",7,25 )
		--AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0Phong Bøi",7,26 )
		--AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0Ng÷ng Ng² Ngáo",7,27 )
		--AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0Vþ Hùng Chþ L¾n",7,28 )
		--AddNumText( sceneId, x111997_g_ScriptId, "#gff00f0Th¥n FA",7,29 )
		--AddNumText( sceneId, x111997_g_scriptId, "#gff00f0Quay lÕi", 8, 8888)
    	EndEvent( sceneId )
	DispatchEventList( sceneId, selfId, targetId )	
	
	elseif GetNumText() == 106 then
		local strGUID = LuaFnGetGUID( sceneId, selfId )	
        BeginEvent( sceneId )
		AddText( sceneId, "#cFF0000Xin m¶i các cao thü lña ch÷n danh hi®u Top mu¯n nh§n!" )
		if strGUID == -1 then	
		AddNumText( sceneId, x111997_g_ScriptId, "Vô Thß¶ng",7,201 )
		end
		if strGUID == -1 then	
		AddNumText( sceneId, x111997_g_ScriptId, "Ð® Nh¤t Yêu Vþ",7,203 )
		end		
		if strGUID == -1 then
		AddNumText( sceneId, x111997_g_ScriptId, "Ð® Nh¤t Ðê Ti®n",7,204 )
		end
		if strGUID == -1 then
		AddNumText( sceneId, x111997_g_ScriptId, "Ð® Nh¤t Ðen Ðüi",7,205 )
		end
		--if strGUID == -1 then
		--AddNumText( sceneId, x111997_g_ScriptId, "Ð® Tam Thß Kiªm",7,204 )	
		--end
		--if strGUID == -1 then
		--AddNumText( sceneId, x111997_g_ScriptId, "Thß Kiªm Tinh Anh",7,206 )
		--end
		--if strGUID == -1 then
		--AddNumText( sceneId, x111997_g_ScriptId, "Kiªm Khách Tinh Anh",7,207 )
		--end	
		--if strGUID == -1 then
		--AddNumText( sceneId, x111997_g_ScriptId, "Kiªm Khách Tinh Anh",7,208 )
		--end
		--if strGUID == -1 then
		--AddNumText( sceneId, x111997_g_ScriptId, "Kiªm Khách Tinh Anh",7,209 )
		--end			
		--if strGUID == -1 then
		AddNumText( sceneId, x111997_g_ScriptId, "Tây Phß½ng Th¤t BÕi",7,210 )
		--AddNumText( sceneId, x111997_g_ScriptId, "Princess Of The Game",7,211 )
		--AddNumText( sceneId, x111997_g_ScriptId, "Princes Of The Game",7,212 )
		--AddNumText( sceneId, x111997_g_ScriptId, "Á Ðù",7,213 )
		--AddNumText( sceneId, x111997_g_ScriptId, "#eDC4C18X¤u mà có #458",7,214 )
		--AddNumText( sceneId, x111997_g_ScriptId, "#eFF0000Chém Tàu #455",7,215 )
		--end)
		AddNumText( sceneId, x111997_g_scriptId, "Quay lÕi", 8, 8888)
    	EndEvent( sceneId )
	DispatchEventList( sceneId, selfId, targetId )		
	
	elseif GetNumText() == 1011 then
		x111997_ZhuanSheng( sceneId, selfId, targetId )	

	elseif GetNumText() == 1012 then
		BeginEvent( sceneId )
		  AddText(sceneId,"   #BV« chuy¬n sinh:")
		  AddText(sceneId,"#GL¥n chuy¬n sinh t× #W1 #Gðªn #W50 #Gyêu c¥u c¤p ðµ #W120#G.")
		  AddText(sceneId,"#GL¥n chuy¬n sinh t× #W51 #Gðªn 99 #Gyêu c¥u c¤p ðµ #W140#G.")
		  AddText(sceneId,"#GT× l¥n 100 tr· ði yêu c¥u c¤p ðµ #W149 #Gvà #W150 #Gviên #{_ITEM39910025}")
		  AddNumText( sceneId, x111997_g_scriptId,"Quay lÕi", 8, 8888)
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )		
					

	elseif GetNumText() == 8501 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 4878, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8502 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 4867, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8503 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 4828, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8504 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 5723, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8505 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 4863, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8506 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 4864, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8507 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 4865, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8508 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 4866, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8509 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 5710, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8510 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 5006, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8511 then
             LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 5708, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
	elseif GetNumText() == 8512 then
              LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 5709, 0)
		LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)
		BeginEvent(sceneId)
		AddText(sceneId,"Biªn thân thành công, chúc các hÕ ch½i game vui vë!")
		EndEvent(sceneId)
		DispatchEventList(sceneId,selfId,targetId)
		


	elseif GetNumText() == 15 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18#450NetCo4#451" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText() == 16 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0T¸ch M¸ch Cao Thü" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		
		elseif GetNumText() == 17 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0#455Nh¤t ÐÕi Cao Thü#454" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )

	elseif GetNumText() == 18 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#Y TÑ ÐÕi MÛ Nhân" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText() == 19 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#Y TÑ ÐÕi MÛ Nam" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText()  == 20 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#YC¦m Y V®" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText()  == 21 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0TÑ ÐÕi Hµ V®" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText()  == 22 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#YChü T¸ch Phß¶ng #3" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText()  == 23 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0#455Hùng Chþ L¾n#454" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GGChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText()  == 24 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0Trß·ng Thôn  #1" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText()  == 25 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0Trß·ng Công An Xã #3" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText()  == 26 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0#455Phong Bøi#454" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText()  == 27 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0#477Ng÷ng Ng² Ngáo#478" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	
	elseif GetNumText()  == 28 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0#468Vþ Hùng Chþ L¾n#469" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	elseif GetNumText()  == 29 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#gff00f0#468Th¥n FA#469" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )	

	elseif GetNumText() == 8888 then
		x111997_OnDefaultEvent( sceneId, selfId,targetId )	


	elseif GetNumText() == 201 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18#450Vô Thß¶ng#451" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	elseif GetNumText() == 202 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18Vô Thß¶ng" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )	
		
	elseif GetNumText() == 203 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18Ð® Nh¤t Yêu Vþ" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	elseif GetNumText() == 204 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18Ð® Nh¤t Ðê Ti®n" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
	elseif GetNumText() == 205 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18Ð® Nh¤t Ðen Ðüi" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	elseif GetNumText() == 206 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#G#450Thß Kiªm Tinh Anh#451" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	elseif GetNumText() == 207 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#G#450Kiªm Khách Tinh Anh#451" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	elseif GetNumText() == 208 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#G#450Kiªm Khách Tinh Anh#451" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	elseif GetNumText() == 209 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#G#450Kiªm Khách Tinh Anh#451" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )		
	elseif GetNumText() == 210 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "Tây Phß½ng Th¤t BÕi" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	elseif GetNumText() == 211 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18Princess Of The Game" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )			
	elseif GetNumText() == 212 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18Princes Of The Game" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )	
	elseif GetNumText() == 213 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18#460Á Ðù#461" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
	elseif GetNumText() == 214 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eDC4C18X¤u mà có #458" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )			
	elseif GetNumText() == 215 then
		LuaFnAwardSpouseTitle( sceneId, selfId, "#eFF0000Chém Tàu #455" )
		DispatchAllTitle( sceneId, selfId )
		BeginEvent( sceneId )
			AddText( sceneId, "#GChúc m×ng bÕn ðã nh§n danh hi®u thành công" )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )			
			
	end	
end


function x111997_ZhuanSheng( sceneId, selfId, targetId )
 	local	lev	= GetLevel( sceneId, selfId )
	local	uiPoint = GetHumanJuqingPoint(sceneId, selfId)
	local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId)
    if uiPoint >= 300 then
        BeginEvent( sceneId )
            AddText( sceneId, "Các hÕ ðã chuy¬n sinh ðªn cñc hÕng không c¥n chuy¬n sinh næa, th§t là là bá ðÕo #22" )
        EndEvent( sceneId )
        DispatchEventList( sceneId, selfId, targetId )
        
        return -1
    end
 
    if uiPoint >= 100 then
        if lev < 149 then
            BeginEvent( sceneId )
            AddText( sceneId, "ÐÆng c¤p nhö h½n #G149#W. Hãy quay lÕi khi ðÕt c¤p ðµ #G149#W." )
            EndEvent( sceneId )
            DispatchEventList( sceneId, selfId, targetId )
            return -1
        end
        local number = LuaFnGetAvailableItemCount(sceneId, selfId, 39910025)
        if number<150 then
            BeginEvent( sceneId )
            AddText( sceneId, "#GCác hÕ c¥n thu th§p ðü #Y150 #Gviên #W#{_ITEM39910025} #Gð¬ có th¬ chuy¬n sinh." )
            EndEvent( sceneId )
            DispatchEventList( sceneId, selfId, targetId )
            return -1
        else
            local reply = LuaFnDelAvailableItem(sceneId,selfId,39910025,150)
        end
    end
    
    if uiPoint >50 then
        if lev < 140 then
            BeginEvent( sceneId )
            AddText( sceneId, "ÐÆng c¤p nhö h½n #G140#W. Hãy quay lÕi khi ðÕt c¤p ðµ #G140.#W " )
            EndEvent( sceneId )
            DispatchEventList( sceneId, selfId, targetId )
        return -1
        end
        
    end
    if lev < 120 then
        BeginEvent( sceneId )
        AddText( sceneId, "ÐÆng c¤p nhö h½n #G120#W. Hãy quay lÕi khi ðÕt c¤p ðµ #G120#W " )
        EndEvent( sceneId )
        DispatchEventList( sceneId, selfId, targetId )
        return -1
    end

 	SetLevel( sceneId, selfId, 35)
	if uiPoint == 1 then
	ZengDian(sceneId,selfId,targetId,1,50000)
	end
	SetHumanJuqingPoint(sceneId, selfId, uiPoint+1)
	AddExp(sceneId,selfId,GetExp(sceneId,selfId)*-1)	
 	BeginEvent(sceneId)
		AddText(sceneId, "Chúc m×ng các hÕ, chuy¬n sinh thành công!")
	EndEvent(sceneId)
	DispatchMissionTips(sceneId,selfId)
	BeginEvent( sceneId )
	local	nam	= LuaFnGetName( sceneId, selfId )
	uiPoint = uiPoint + 1	
        AddText(sceneId,"#GChúc m×ng, chuy¬n sinh l¥n #Y"..uiPoint.. " #Gthành công!!!")
        AddText( sceneId, "#WServer gi¾i hÕn s¯ l¥n chuy¬n sinh là #Y300" )
    EndEvent(sceneId)
    DispatchEventList( sceneId, selfId, targetId )
	uiPoint = uiPoint + 0
	BroadMsgByChatPipe( sceneId, selfId, "#ga099ff "..nam.."#ga099ff chuy¬n sinh thành công! ðây là l¥n chuy¬n sinh thÑ: #ga099ff "..uiPoint.."!#r#212", 4 ) 
end

-- [NetCo4 08/10] NPC CHE DO (Muc Thanh Danh). docs/TRANG-THAI.md muc 08/10 auto che do.
--  9500 chon vi tri -> 9510+s chon mon -> 9600+10s+k che 10 cai: tru 10 ban ve + 10 vat lieu cap 8 (Mien Bo 8 giap / Bi Ngan 8 trang suc),
--  TryRecieveItem(mon, 16) = cot "duc bang vat lieu cap 8" (ty le VL8 C8 65% / C9 35%). Truoc 08/10 toi dung 7 (khong vat lieu, C2-C3) - SAI.
--  (cu: cot "che khong nguyen lieu",
--  ItemCompound cot 31 = 7, giong che tay Tinh Cong / Cong Nghe cap 1). Tao thieu thi tra lai ban ve.
--  9501 giam dinh tat ca: moi trang bi chua giam dinh (GetBagItemIdent = 0) tru 1 Giam Dinh Phu du cap. 9502 [GM] xem.
x111997_NetCo4SoLuong = 10
x111997_NetCo4Phu = { 30505050, 30505051, 30505052, 30505053, 30505054, 30505055, 30505056, 30505057, 30505058, 30505059 }
x111997_NetCo4ViTri = {
	{ ten = "M\251", banve = 20308070, vl = 20501008, vlten = "Mi\234n B\175 c\164p 8", mon = { { 10210020, "Huy\173n Th\170 Th\225nh C\226n" }, { 10210040, "Ph\174 L\226n Th\225nh Quan" }, { 10210060, "Hung M\213ch Th\225nh Kh\244i" } } },   -- 1 Mu
	{ ten = "\193o", banve = 20308080, vl = 20501008, vlten = "Mi\234n B\175 c\164p 8", mon = { { 10213020, "Huy\173n Th\170 Ma Y" }, { 10213040, "Ph\174 L\226n Th\225nh C\215u" }, { 10213060, "Hung M\213ch Th\225nh Gi\225p" } } },   -- 2 Ao
	{ ten = "Bao tay", banve = 20308090, vl = 20501008, vlten = "Mi\234n B\175 c\164p 8", mon = { { 10212020, "Huy\173n Th\170 Th\252 S\225o" }, { 10212040, "Ph\174 L\226n Huy\171n Th\252" }, { 10212060, "Hung M\213ch Th\225nh Ch\223\183ng" } } },   -- 3 Bao tay
	{ ten = "Gi\224y", banve = 20308100, vl = 20501008, vlten = "Mi\234n B\175 c\164p 8", mon = { { 10211020, "Huy\173n Th\170 Th\225nh Ngoa" }, { 10211040, "Ph\174 L\226n Th\225nh L\253" }, { 10211060, "Hung M\213ch Th\225nh Ngoa" } } },   -- 4 Giay
	{ ten = "H\181 uy\172n", banve = 20308140, vl = 20501008, vlten = "Mi\234n B\175 c\164p 8", mon = { { 10214020, "Huy\173n Th\170 Ma O\228n" } } },   -- 6 Ho uyen
	{ ten = "H\181 ki\234n", banve = 20308150, vl = 20501008, vlten = "Mi\234n B\175 c\164p 8", mon = { { 10215020, "Huy\173n Th\170 Ma Ki\234n" } } },   -- 7 Ho kien
	{ ten = "D\226y chuy\171n", banve = 20308110, vl = 20502008, vlten = "B\237 Ng\226n c\164p 8", mon = { { 10220020, "\208i\174p Luy\170n" } } },   -- 8 Day chuyen
	{ ten = "H\181 ph\249", banve = 20308130, vl = 20502008, vlten = "B\237 Ng\226n c\164p 8", mon = { { 10223020, "Phi Tuy\170t" }, { 10223035, "B\237ch L\226u" }, { 10223036, "Thi\172n L\227ng" } } },   -- 9 Ho phu
	{ ten = "Nh\231n", banve = 20308120, vl = 20502008, vlten = "B\237 Ng\226n c\164p 8", mon = { { 10222020, "Ph\167t Ng\230" }, { 10222035, "Kinh T\226m" }, { 10222036, "Ho\224nh \208\184ch" } } },   -- 10 Nhan
}

function x111997_NetCo4Bao( sceneId, selfId, s )
	BeginEvent( sceneId )
		AddText( sceneId, s )
	EndEvent( sceneId )
	DispatchMissionTips( sceneId, selfId )
end

function x111997_NetCo4CheDo( sceneId, selfId, targetId, so )
	local sl = x111997_NetCo4SoLuong
	if so == 9500 then
		BeginEvent( sceneId )
			AddText( sceneId, "Ch\247n lo\213i trang b\184 9x mu\175n ch\170. M\178i l\165n ch\170 10 c\225i, c\165n 10 b\228n v\168 \208\228 T\213o \208\176 c\164p 10 c\249ng lo\213i + 10 v\167t li\174u c\164p 8 (Mi\234n B\175 8 cho gi\225p, B\237 Ng\226n 8 cho trang s\209c) v\224 10 \244 tr\175ng trong t\250i." )
			for s = 1, getn( x111997_NetCo4ViTri ) do
				AddNumText( sceneId, x111997_g_scriptId, x111997_NetCo4ViTri[s].ten, 6, 9510 + s )
			end
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		return
	end
	if so >= 9511 and so <= 9510 + getn( x111997_NetCo4ViTri ) then
		local v = x111997_NetCo4ViTri[so - 9510]
		BeginEvent( sceneId )
			AddText( sceneId, v.ten .. ": ch\247n m\243n. M\178i l\165n tr\215 10 b\228n v\168 + 10 " .. v.vlten .. ", ra 10 c\225i." )
			for k = 1, getn( v.mon ) do
				AddNumText( sceneId, x111997_g_scriptId, v.mon[k][2] .. " (10)", 6, 9600 + ( so - 9510 ) * 10 + k )
			end
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		return
	end
	if so >= 9611 and so <= 9709 then
		local v = x111997_NetCo4ViTri[floor( ( so - 9600 ) / 10 )]
		if not v then return end
		local m = v.mon[mod( so - 9600, 10 )]
		if not m then return end
		if LuaFnGetPropertyBagSpace( sceneId, selfId ) < sl then
			x111997_NetCo4Bao( sceneId, selfId, "T\250i c\165n \237t nh\164t 10 \244 tr\175ng." )
			return
		end
		if LuaFnGetAvailableItemCount( sceneId, selfId, v.banve ) < sl then
			x111997_NetCo4Bao( sceneId, selfId, "C\165n 10 b\228n v\168 \208\228 T\213o \208\176 c\164p 10 lo\213i " .. v.ten .. " (kh\244ng kh\243a)." )
			return
		end
		if LuaFnGetAvailableItemCount( sceneId, selfId, v.vl ) < sl then   -- [08/10] vat lieu cap 8 nhu che tay
			x111997_NetCo4Bao( sceneId, selfId, "C\165n 10 " .. v.vlten .. " (kh\244ng kh\243a)." )
			return
		end
		if LuaFnDelAvailableItem( sceneId, selfId, v.banve, sl ) ~= 1 then
			x111997_NetCo4Bao( sceneId, selfId, "Tr\215 b\228n v\168 th\164t b\213i, th\216 l\213i." )
			return
		end
		if LuaFnDelAvailableItem( sceneId, selfId, v.vl, sl ) ~= 1 then
			for k = 1, sl do TryRecieveItem( sceneId, selfId, v.banve, QUALITY_MUST_BE_CHANGE ) end   -- tru vat lieu loi -> tra ban ve
			x111997_NetCo4Bao( sceneId, selfId, "Tr\215 v\167t li\174u th\164t b\213i, \240\227 tr\228 b\228n v\168." )
			return
		end
		local n = 0
		for k = 1, sl do
			local pos = TryRecieveItem( sceneId, selfId, m[1], 16 )   -- 16 = duc bang vat lieu cap 8
			if pos and pos >= 0 then n = n + 1 end
		end
		for k = n + 1, sl do
			TryRecieveItem( sceneId, selfId, v.banve, QUALITY_MUST_BE_CHANGE )   -- tao thieu -> tra ban ve + vat lieu
			TryRecieveItem( sceneId, selfId, v.vl, QUALITY_MUST_BE_CHANGE )
		end
		LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, 18, 0 )
		x111997_NetCo4Bao( sceneId, selfId, "\208\227 ch\170 " .. n .. "/" .. sl .. " " .. m[2] )
		return
	end
	if so == 9501 or so == 9502 then
		local bb = GetBasicBagStartPos( sceneId, selfId )
		local be = GetBasicBagEndPos( sceneId, selfId )
		local xem, n, thieu, khoa = "", 0, 0, 0
		for i = bb, be do
			local id = LuaFnGetItemTableIndexByIndex( sceneId, selfId, i )
			if id >= 10000000 and id < 20000000 then
				local gd = GetBagItemIdent( sceneId, selfId, i )
				local lv = GetBagItemLevel( sceneId, selfId, i )
				if so == 9502 then
					xem = xem .. "o " .. i .. ": " .. id .. " cap " .. lv .. " ident " .. gd .. "#r"
				elseif gd == 0 then
					if LuaFnIsItemLocked( sceneId, selfId, i ) ~= 0 then
						khoa = khoa + 1
					else
						local phu = 0
						for c = 1, 10 do
							if phu == 0 and c * 10 >= lv and LuaFnGetAvailableItemCount( sceneId, selfId, x111997_NetCo4Phu[c] ) > 0 then phu = x111997_NetCo4Phu[c] end
						end
						if phu == 0 then
							thieu = thieu + 1
						elseif LuaFnDelAvailableItem( sceneId, selfId, phu, 1 ) == 1 then
							SetBagItemIdent( sceneId, selfId, i )
							LuaFnRefreshItemInfo( sceneId, selfId, i )
							n = n + 1
						end
					end
				end
			end
		end
		if so == 9502 then
			if not ( GetName( sceneId, selfId ) == "bialk" ) then return end
			BeginEvent( sceneId )
				AddText( sceneId, "[GM] Trang thai giam dinh (ident) trang bi trong tui:#r" .. xem )
			EndEvent( sceneId )
			DispatchEventList( sceneId, selfId, targetId )
			return
		end
		if n > 0 then LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, 18, 0 ) end
		x111997_NetCo4Bao( sceneId, selfId, "\208\227 gi\225m \240\184nh " .. n .. " m\243n. Thi\170u ph\249: " .. thieu .. ". \208ang kh\243a: " .. khoa )
		return
	end
end

--**********************************
-- [NetCo4 11/10] CHUYEN DO (tools/chuyendo-11-10.js): cuong hoa + lo + ngoc + creator (dieu van / thang linh / tinh thong) A -> B cung vi tri.
-- Theo x895111_SHANG_BAOS (wuyazi85o.lua). Ngoc tao lai cung ma roi kham vao B; A bi xoa. Gia 10.000 KNB.
--**********************************
x111997_g_CDGia = 10000
x111997_g_CDViTri = { [0] = 1, [1] = 1, [2] = 1, [3] = 1, [4] = 1, [5] = 1, [6] = 1, [7] = 1, [12] = 1, [14] = 1, [15] = 1 }   -- vu khi, mu, ao, bao tay, giay, dai, nhan, hang lien, ho phu, ho uyen, ho kien

function x111997_CDTip( sceneId, selfId, str )
	BeginEvent( sceneId )
		AddText( sceneId, str )
	EndEvent( sceneId )
	DispatchMissionTips( sceneId, selfId )
end

function x111997_CDBao( sceneId, selfId, targetId, str )
	BeginEvent( sceneId )
		AddText( sceneId, str )
		AddNumText( sceneId, x111997_g_scriptId, "Quay l\213i", 8, 1000000 )
	EndEvent( sceneId )
	DispatchEventList( sceneId, selfId, targetId )
end

-- ma vat pham + vi tri trang bi o tui o (0-59); -1 neu khong phai trang bi chuyen duoc
-- 11/10: ngoc kham hong -> hang cho qua (NetCo4/quatang.lua doc khi doi ban do)
function x111997_CDGuiQua( sceneId, selfId, id )
	local h = openfile( "./txt/NetCo4Qua/"..LuaFnGetGUID( sceneId, selfId )..".txt", "a" )
	if h ~= nil then
		write( h, "item "..id.." 1\n" )
		closefile( h )
	end
end

-- 11/10: nhat ky moi lan chuyen (ma ngoc de tra lai neu can)
function x111997_CDLog( sceneId, selfId, str )
	local h = openfile( "./txt/NetCo4Qua/_chuyendo.log", "a" )
	if h ~= nil then
		write( h, LuaFnGetCurrentTime().." "..LuaFnGetGUID( sceneId, selfId ).." "..str.."\n" )
		closefile( h )
	end
end

function x111997_CDMa( sceneId, selfId, o )
	local ma = LuaFnGetItemTableIndexByIndex( sceneId, selfId, o )
	if ma == nil or ma <= 0 then
		return -1, -1
	end
	local vt = GetItemEquipPoint( ma )
	if vt == nil or x111997_g_CDViTri[vt] == nil then
		return -1, -1
	end
	return ma, vt
end

-- noi dung cua mon o tui o: cuong hoa, so lo, so ngoc, creator, co du lieu creator (1/0), chu mo ta
function x111997_CDDoc( sceneId, selfId, o )
	local ch = GetBagItemParam( sceneId, selfId, o, 3, 1 )
	if ch == nil or ch < 0 then
		ch = 0
	end
	local lo = GetBagGemCount( sceneId, selfId, o )
	local ngoc = GetGemEmbededCount( sceneId, selfId, o )
	local _, cr = LuaFnGetItemCreator( sceneId, selfId, o )
	if cr == nil then
		cr = ""
	end
	local dl = 0
	if strfind( cr, "#" ) ~= nil or strfind( cr, "&" ) ~= nil then
		dl = 1
	end
	local t = "+"..ch..", "..lo.." l\178, "..ngoc.." ng\247c"
	if strfind( cr, "&DW" ) ~= nil then
		t = t..", \240i\234u v\229n"
	end
	if strfind( cr, "w#p" ) ~= nil or strfind( cr, "t#p" ) ~= nil then
		t = t..", th\229ng linh"
	end
	if strfind( cr, "&JT" ) ~= nil then
		t = t..", tinh th\244ng"
	end
	return ch, lo, ngoc, cr, dl, t
end

function x111997_CDMenu( sceneId, selfId, targetId, n )
	if n == 1000000 then
		BeginEvent( sceneId )
			AddText( sceneId, "#YChuy\172n to\224n b\181 c\223\182ng h\243a, l\178, ng\247c, \240i\234u v\229n, th\229ng linh, tinh th\244ng#W t\215 m\243n c\251 sang m\243n m\190i #Gc\249ng v\184 tr\237#W (\225o -> \225o, ph\249 -> ph\249). Gi\225 #G10.000 KNB#W / l\165n." )
			AddText( sceneId, "#RM\243n c\251 s\168 b\184 x\243a.#W M\243n m\190i ph\228i ch\223a c\243 ng\247c, ch\223a c\223\182ng h\243a, ch\223a \240i\234u v\229n / th\229ng linh / tinh th\244ng. C\228 2 m\243n \240\172 trong t\250i (th\225o ra n\170u \240ang m\163c), kh\244ng kh\243a." )
			AddText( sceneId, "#GCh\247n m\243n C\157 (m\243n mu\175n l\164y \240\176 ra):" )
			local k = 0
			for o = 0, 59 do
				local ma, vt = x111997_CDMa( sceneId, selfId, o )
				if ma > 0 and k < 20 then
					local ch, lo, ngoc, cr, dl, t = x111997_CDDoc( sceneId, selfId, o )
					if ch > 0 or ngoc > 0 or dl == 1 then   -- 11/10: bo mon chi co lo trong
						k = k + 1
						AddText( sceneId, k..". #{_ITEM"..ma.."} #W("..t..")" )
						AddNumText( sceneId, x111997_g_scriptId, "M\243n c\251 s\175 "..k, 6, 1000000 + 1 + o * 1000 + mod( ma, 1000 ) )
					end
				end
			end
			if k == 0 then
				AddText( sceneId, "#RTrong t\250i kh\244ng c\243 trang b\184 n\224o c\243 c\223\182ng h\243a / ng\247c / \240i\234u v\229n / th\229ng linh / tinh th\244ng." )
			end
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		return
	end
	if n < 100000000 then   -- da chon A -> danh sach B
		local m = n - 1000001
		local a = floor( m / 1000 )
		local maA, vtA = -1, -1
		if a >= 0 and a <= 59 then
			maA, vtA = x111997_CDMa( sceneId, selfId, a )
		end
		if maA <= 0 or mod( maA, 1000 ) ~= mod( m, 1000 ) then
			x111997_CDBao( sceneId, selfId, targetId, "#RT\250i \240\227 thay \240\177i, ch\247n l\213i." )
			return
		end
		local _, _, _, _, _, tA = x111997_CDDoc( sceneId, selfId, a )
		BeginEvent( sceneId )
			AddText( sceneId, "M\243n c\251: ".."#{_ITEM"..maA.."} #W("..tA..")" )
			AddText( sceneId, "#GCh\247n m\243n M\149I (nh\167n \240\176), c\249ng v\184 tr\237, c\242n tr\161ng:" )
			local k = 0
			for o = 0, 59 do
				local ma, vt = x111997_CDMa( sceneId, selfId, o )
				if o ~= a and ma > 0 and vt == vtA and k < 20 then
					local ch, lo, ngoc, cr, dl, t = x111997_CDDoc( sceneId, selfId, o )
					if ch == 0 and ngoc == 0 and dl == 0 then
						k = k + 1
						AddText( sceneId, k..". #{_ITEM"..ma.."} #W("..lo.." l\178)" )
						AddNumText( sceneId, x111997_g_scriptId, "M\243n m\190i s\175 "..k, 6, 100000000 + ( a * 60 + o ) * 10000 + mod( maA, 100 ) * 100 + mod( ma, 100 ) )
					end
				end
			end
			if k == 0 then
				AddText( sceneId, "#RKh\244ng c\243 m\243n c\249ng v\184 tr\237 c\242n tr\161ng (ch\223a ng\247c, ch\223a c\223\182ng h\243a, ch\223a \240i\234u v\229n / th\229ng linh / tinh th\244ng) trong t\250i." )
			end
			AddNumText( sceneId, x111997_g_scriptId, "Quay l\213i", 8, 1000000 )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		return
	end
	-- xac nhan (1xxxxxxxx) / chuyen (2xxxxxxxx)
	local lam = 0
	local m = n - 100000000
	if n >= 200000000 then
		lam = 1
		m = n - 200000000
	end
	local ab = floor( m / 10000 )
	local a = floor( ab / 60 )
	local b = mod( ab, 60 )
	local maA, vtA, maB, vtB = -1, -1, -1, -1
	if a >= 0 and a <= 59 then
		maA, vtA = x111997_CDMa( sceneId, selfId, a )
		maB, vtB = x111997_CDMa( sceneId, selfId, b )
	end
	if a == b or maA <= 0 or maB <= 0 or vtA ~= vtB or mod( maA, 100 ) * 100 + mod( maB, 100 ) ~= mod( m, 10000 ) then
		x111997_CDBao( sceneId, selfId, targetId, "#RT\250i \240\227 thay \240\177i, ch\247n l\213i." )
		return
	end
	local chA, loA, ngocA, crA, dlA, tA = x111997_CDDoc( sceneId, selfId, a )
	local chB, loB, ngocB, crB, dlB, tB = x111997_CDDoc( sceneId, selfId, b )
	if chB ~= 0 or ngocB ~= 0 or dlB ~= 0 then
		x111997_CDBao( sceneId, selfId, targetId, "#RM\243n m\190i ph\228i ch\223a c\243 ng\247c, ch\223a c\223\182ng h\243a, ch\223a \240i\234u v\229n / th\229ng linh / tinh th\244ng." )
		return
	end
	if lam == 0 then
		BeginEvent( sceneId )
			AddText( sceneId, "#YX\225c nh\167n chuy\172n \240\176 (10.000 KNB)" )
			AddText( sceneId, "T\215: ".."#{_ITEM"..maA.."} #W("..tA..")" )
			AddText( sceneId, "Sang: ".."#{_ITEM"..maB.."} #W("..loB.." l\178)" )
			AddText( sceneId, "#RM\243n c\251 s\168 b\184 X\211A sau khi chuy\172n. C\164p sao / d\242ng thu\181c t\237nh g\175c c\252a m\178i m\243n gi\230 nguy\234n, kh\244ng chuy\172n." )
			AddNumText( sceneId, x111997_g_scriptId, "#G\208\176ng \253 chuy\172n (tr\215 10.000 KNB)", 6, 200000000 + m )
			AddNumText( sceneId, x111997_g_scriptId, "Quay l\213i", 8, 1000000 )
		EndEvent( sceneId )
		DispatchEventList( sceneId, selfId, targetId )
		return
	end
	-- kiem tra
	if LuaFnIsItemLocked( sceneId, selfId, a ) ~= 0 or LuaFnIsItemAvailable( sceneId, selfId, a ) ~= 1 or LuaFnIsItemLocked( sceneId, selfId, b ) ~= 0 or LuaFnIsItemAvailable( sceneId, selfId, b ) ~= 1 then
		x111997_CDBao( sceneId, selfId, targetId, "#RM\243n \240ang b\184 kh\243a / \240ang d\249ng. M\183 kh\243a (kh\243a t\250i) r\176i th\216 l\213i." )
		return
	end
	if ngocA > 0 and LuaFnGetMaterialBagSpace( sceneId, selfId ) < 1 and LuaFnGetPropertyBagSpace( sceneId, selfId ) < 1 then
		x111997_CDBao( sceneId, selfId, targetId, "#RC\165n 1 \244 tr\175ng trong t\250i (\240\172 chuy\172n ng\247c)." )
		return
	end
	local knb = YuanBao( sceneId, selfId, -1, 3, 0 )
	if knb == nil or knb < x111997_g_CDGia then
		x111997_CDBao( sceneId, selfId, targetId, "#RKh\244ng \240\252 10.000 KNB." )
		return
	end
	-- doc het noi dung A truoc khi xoa
	local ngocDs = {}
	for i = 0, 3 do
		local g = GetGemEmbededType( sceneId, selfId, a, i )
		if g ~= nil and g > 0 then
			tinsert( ngocDs, g )
		end
	end
	local khoaA = 0
	if LuaFnLockCheck( sceneId, selfId, a, 1000 ) == -3 then
		khoaA = 1
	end
	local buocA = LuaFnGetItemBindStatus( sceneId, selfId, a )
	if YuanBao( sceneId, selfId, -1, 2, x111997_g_CDGia ) == -1 then
		x111997_CDBao( sceneId, selfId, targetId, "#RKh\244ng \240\252 10.000 KNB." )
		return
	end
	-- xoa A TRUOC (khong nhan doi duoc), roi dung lai tren B
	if LuaFnEraseItem( sceneId, selfId, a ) ~= 1 then
		YuanBao( sceneId, selfId, -1, 1, x111997_g_CDGia )
		x111997_CDBao( sceneId, selfId, targetId, "#RKh\244ng x\243a \240\223\254c m\243n c\251, \240\227 ho\224n KNB." )
		return
	end
	-- lo: duc them cho B bang A
	local lan = 0
	while GetBagGemCount( sceneId, selfId, b ) < loA and lan < 6 do
		if GetBagGemCount( sceneId, selfId, b ) < 3 then
			AddBagItemSlot( sceneId, selfId, b )
		else
			AddBagItemSlotFour( sceneId, selfId, b )
		end
		lan = lan + 1
	end
	-- ngoc: tao lai cung ma roi kham. 11/10 sua: kiem tung vien (so ngoc tren B phai tang); kham hong ma vien ngoc mat -> gui lai qua hang cho qua
	local kham, tui, tra = 0, 0, 0
	local nhat = "ngoc"
	for i = 1, getn( ngocDs ) do
		nhat = nhat.." "..ngocDs[i]
		local truoc = GetGemEmbededCount( sceneId, selfId, b )
		local p = TryRecieveItem( sceneId, selfId, ngocDs[i], 1 )
		if p ~= nil and p >= 0 then
			GemEnchasing( sceneId, selfId, p, b )
			if GetGemEmbededCount( sceneId, selfId, b ) > truoc then
				kham = kham + 1
				nhat = nhat..":kham"
			elseif LuaFnGetItemTableIndexByIndex( sceneId, selfId, p ) == ngocDs[i] then
				tui = tui + 1
				nhat = nhat..":tui"
			else
				x111997_CDGuiQua( sceneId, selfId, ngocDs[i] )
				tra = tra + 1
				nhat = nhat..":mat->gui"
			end
		else
			x111997_CDGuiQua( sceneId, selfId, ngocDs[i] )
			tra = tra + 1
			nhat = nhat..":khongtao->gui"
		end
	end
	-- creator (dieu van / thang linh / tinh thong / than khi ...)
	if crA ~= "" then
		LuaFnSetItemCreator( sceneId, selfId, b, crA )
	end
	-- cuong hoa (nhu wuyazi85o.lua)
	if chA > 0 and chA <= 99 then
		for i = 1, chA do
			local r, cap = LuaFnEquipEnhance( sceneId, selfId, b, 1 )
			SetBagItemParam( sceneId, selfId, b, 3, 1, cap )
		end
	end
	if khoaA == 1 and LuaFnLockCheck( sceneId, selfId, b, 1000 ) == 0 then
		LuaFnEquipLock( sceneId, selfId, b )
	end
	if buocA == 1 then
		LuaFnItemBind( sceneId, selfId, b )
	end
	LuaFnRefreshItemInfo( sceneId, selfId, b )
	LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, 49, 0 )
	local _, _, ngocB2, _, _, tB2 = x111997_CDDoc( sceneId, selfId, b )
	x111997_CDLog( sceneId, selfId, maA.." -> "..maB.." o "..a.." -> "..b.." cuong hoa "..chA.." lo "..loA.."/"..GetBagGemCount( sceneId, selfId, b ).." "..nhat )
	if tui > 0 or tra > 0 then
		x111997_CDTip( sceneId, selfId, "#Y"..( tui + tra ).." vi\234n ng\247c kh\244ng kh\228m \240\223\254c (m\243n m\190i thi\170u l\178 / kh\244ng nh\167n lo\213i ng\247c n\224y): "..tui.." vi\234n n\162m trong t\250i, "..tra.." vi\234n g\216i l\213i - \240\177i b\228n \240\176 \240\172 nh\167n." )
	end
	x111997_CDTip( sceneId, selfId, "Chuy\172n \240\176 th\224nh c\244ng: "..tB2 )
	x111997_CDBao( sceneId, selfId, targetId, "#GChuy\172n xong.#W M\243n m\190i: ".."#{_ITEM"..maB.."} #W("..tB2..")" )
end
