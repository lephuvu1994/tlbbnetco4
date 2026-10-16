--´óÀíNPC
--½ğÎåÒ¯
--Ôª±¦ÉÌÈË

--**********************************
--ÊÂ¼ş½»»¥Èë¿Ú
--**********************************
--Kim ngû Gia--  
x002059_g_scriptId=002059  
x002059_g_Money=1  
x002059_g_ZengDian=2  
x002059_g_Str=3  
x002059_g_YuanBao=4  
x002059_g_MenpaiPoint=5 
x002059_g_ShopTableIndex = 226
x002059_g_ShopTableIndex1 = 227
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_OnDefaultEvent( sceneId, selfId,targetId )  
    BeginEvent(sceneId)  
        AddText(sceneId,"   Hành t¦u giang h° ğß½ng nhiên kë chÑc quy«n càng cao thì lÕi càng giàu có. Tøc ngæ có câu 'Có ti«n có th¬ ma sui quÖ khiªn'. Trong tay có Ngân Lßşng có th¬ làm r¤t nhi«u vi®c l¾n, ngß¶i ngß¶i ngßŞng mµ...")  
		        --if LuaFnGetGUID( sceneId, selfId ) == 1010000010     then
        --AddNumText(sceneId,x002059_g_ScriptId,"#gFF0FA0Chuy¬n ğ±i thành #g66ffffVàng #-02",4,x002059_g_Money) 
        AddNumText(sceneId,x002059_g_ScriptId,"#gFF0FA0Ğ±i l¤y #g66ffffĞi¬m Môn Phái",4,x002059_g_MenpaiPoint)     
        --AddNumText(sceneId,x002059_g_ScriptId,"#gFF0FA0Chuy¬n ğ±i thành #g66ffffĞi¬m T£ng",4,x002059_g_ZengDian)  
        --AddNumText(sceneId,x002059_g_ScriptId,"#gFF0FA0Chuy¬n ğ±i thành #g66ffffKim Nguyên Bäo",4,x002059_g_YuanBao) 
		
        --AddNumText(sceneId,x002059_g_ScriptId,"#gFF0FA0Liên quan ğ±i ngân lßşng",8,x002059_g_Str)  
		    AddNumText(sceneId,x001169_g_ScriptId,"Ti®m Vàng SJC",7,10000)	
			AddNumText(sceneId,x001169_g_ScriptId,"Ti®m ĞMP",7,20000)	
				--end
    EndEvent(sceneId)  
    DispatchEventList(sceneId,selfId,targetId)  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_OnEventRequest(sceneId,selfId,targetId,eventId)  
	-- [don-dep 16/10] chan handler an doi vang / diem -> KNB (310-342): menu da tat nhung handler con, goi duoc bang goi tin sua
	if GetNumText() >= 310 and GetNumText() <= 342 then
		return
	end
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "ti¬u muµi"  
    else   
        Sex = "ti¬u ğ®"  
    end 
	
	if	GetNumText() == 10000 then
		DispatchShopItem( sceneId, selfId,targetId, x002059_g_ShopTableIndex )
	end
		if	GetNumText() == 20000 then
		DispatchShopItem( sceneId, selfId,targetId, x002059_g_ShopTableIndex1 )
	end
    if    GetNumText() == x002059_g_MenpaiPoint    then  
        BeginEvent(sceneId)  
            AddText( sceneId, "   Lña ch÷n ti«n t® ho£c các loÕi ği¬m hoÕt ğµng ğ¬ chuy¬n ğ±i thành #YĞi­m Môn Phái" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #-02 ğ±i l¤y #g66ffffĞi¬m Môn Phái", 3, 41 ) 
            --AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m c¯ng hiªn Bang Hµi", 3, 42 ) 
            --AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m T£ng", 3, 43 ) 
            --AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffKim Nguyên Bäo", 3, 44 )             
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end  
    if    GetNumText() == 41    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YVàng #-02#W ğ¬ ğ±i l¤y #YĞi­m Môn Phái #Wcüa ta chßa v§y?")  
			AddText( sceneId, "#Y Luu ı: #WChï SØ døng #YVàng #cFF0000 không khóa#W m¾i #Wğ±i ğßşc #c00ffffĞi¬m Môn Phái#W!" )   
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i 1000 #-02 l¤y #gfff0f0 1000 #g66ffffĞi¬m Môn Phá", 3, 410 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i 10000 #-02 l¤y #gfff0f0 10000 #g66ffffĞi¬m Môn Phá", 3, 411 )  
            --AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i 100000 #-02 l¤y #gfff0f0 100000 #g66ffffĞi¬m Môn Phái", 3, 412 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == 42    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YĞi¬m c¯ng hiªn Bang Hµi #-02#W ğ¬ ğ±i l¤y #YĞi­m Môn Phái #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G1 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ±i ğßşc #G1 #YĞi­m Môn Phái#W!" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 1 #g66ffffĞi¬m Môn Phái", 3, 420 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 10 #g66ffffĞi¬m Môn Phái", 3, 421 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 100 #g66ffffĞi¬m Môn Phái", 3, 422 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == 43    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YĞi¬m T£ng #-02#W ğ¬ ğ±i l¤y #YĞi­m Môn Phái #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G1 #YĞi¬m T£ng #Wğ±i ğßşc #G10 #YĞi­m Môn Phái#W!" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 10 #g66ffffĞi¬m Môn Phái", 3, 430 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 100 #g66ffffĞi¬m Môn Phái", 3, 431 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 1000 #g66ffffĞi¬m Môn Phái", 3, 432 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == 44    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YKim Nguyên Bäo #-02#W ğ¬ ğ±i l¤y #YĞi­m Môn Phái #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G70 #YKim Nguyên Bäo #Wğ±i ğßşc #G1 #YĞi­m Môn Phái#W!" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 1 #g66ffffĞi¬m Môn Phái", 3, 440 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 10 #g66ffffĞi¬m Môn Phái", 3, 441 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 100 #g66ffffĞi¬m Môn Phái", 3, 442 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == x002059_g_Money    then  
        BeginEvent(sceneId)  
            AddText( sceneId, "   Lña ch÷n ti«n t® ho£c các loÕi ği¬m hoÕt ğµng ğ¬ chuy¬n ğ±i thành #YVàng #-02" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffVàng #-14", 3, 11 ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m Môn Phái", 3, 13 ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m c¯ng hiªn Bang Hµi", 3, 14 ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m T£ng", 3, 15 ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffKim Nguyên Bäo", 3, 12 )             
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end  
    if    GetNumText() == 11    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   G¥n ğây giang h° thß¶ng xuyên säy ra nhi«u vø cß¾p b¯c chém giªt lçn nhau, giæ bên mình #YVàng #-14 #Wlà cách t¯t nh¤t! Nªu nhß "..Sex.." khån khån mu¯n ğ±i, không mu¯n giæ bên mình s¯ #YVàng #-14 #Wnày, ğßşc thôi ta s¨ ğ±i!")  
            AddText(sceneId,"   Ta không làm không công ğâu nha, phäi hao t¯n mµt khoãng ti«n b°i dßŞng cho ta, "..Sex.." vçn mu¯n ğ±i?")  
            AddText( sceneId, "   Lãi xu¤t giao ğµng #G0.01#W%" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gffcc0000 #-02 #gfff0f099 #-03 99 #-04", 3, 110 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gffcc000#gfff0f09 #-02 99 #-03 90 #-04", 3, 111 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f099 #-02 99 #-03 00 #-04", 3, 112 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i hªt", 3, 113 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end  
    if    GetNumText() == 12    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YKim Nguyên Bäo#W ğ¬ ğ±i l¤y #YVàng #-02 #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G14 #YKim Nguyên Bäo #Wğ±i ğßşc #G1 #-02#W!" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 1 #-02", 3, 120 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 10 #-02", 3, 121 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 100 #-02", 3, 122 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end  
    if    GetNumText() == 13    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YĞi¬m Môn Phái#W ğ¬ ğ±i l¤y #YVàng #-02 #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G1 #YĞi¬m Môn Phái #Wğ±i ğßşc #G5 #-02#W!" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 5 #-02", 3, 130 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 50 #-02", 3, 131 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 500 #-02", 3, 132 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end  
    if    GetNumText() == 14    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YĞi¬m c¯ng hiªn Bang Hµi#W ğ¬ ğ±i l¤y #YVàng #-02 #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G1 #Y Ği¬m c¯ng hiªn Bang Hµi #Wğ±i ğßşc #G5 #-02#W!" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 5 #-02", 3, 140 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 50 #-02", 3, 141 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 500 #-02", 3, 142 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end  
    if    GetNumText() == 15    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YĞi¬m T£ng#W ğ¬ ğ±i l¤y #YVàng #-02 #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G1 #YĞi¬m T£ng #Wğ±i ğßşc #G50 #-02#W!" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 50 #-02", 3, 150 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 500 #-02", 3, 151 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 1000 #-02", 3, 152 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == x002059_g_ZengDian    then  
        BeginEvent(sceneId)  
            AddText( sceneId, "   Lña ch÷n ti«n t® ho£c các loÕi ği¬m hoÕt ğµng ğ¬ chuy¬n ğ±i thành #YĞi¬m T£ng" )   
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffVàng #-02", 3, 22 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m Môn Phái", 3, 24 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m c¯ng hiªn Bang Hµi", 3, 21 ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffKim Nguyên Bäo", 3, 23 )              
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end  
    if    GetNumText() == 21    then  
        BeginEvent(sceneId)  
            AddText( sceneId, "   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #Yği¬m c¯ng hiªn Bang Hµi#W ğ¬ ğ±i l¤y #YĞi¬m T£ng #Wcüa ta chßa v§y?" )  
            AddText( sceneId, "   SØ døng #G10 #YĞi¬m c¯ng hiªn Bang Hµi #W ğ±i ğßşc #G 1 #YĞi¬m T£ng#W!" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f01 #g66ffffĞi¬m T£ng", 3, 210 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f010 #g66ffffĞi¬m T£ng", 3, 211 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f0100 #g66ffffĞi¬m T£ng", 3, 212 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end  
    if    GetNumText() == 22    then  
        BeginEvent(sceneId)  
            AddText( sceneId, "   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YVàng #-02#W ğ¬ ğ±i l¤y #YĞi¬m T£ng #Wcüa ta chßa v§y?" )  
            AddText( sceneId, "   SØ døng #G50 #-02#W ğ±i ğßşc #G1 #YĞi¬m T£ng#W!" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f01 #g66ffffĞi¬m T£ng", 3, 220 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f010 #g66ffffĞi¬m T£ng", 3, 221 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f0100 #g66ffffĞi¬m T£ng", 3, 222 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end  
    if    GetNumText() == 23    then  
        BeginEvent(sceneId)  
            AddText( sceneId, "   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YKim Nguyên Bäo#W ğ¬ ğ±i l¤y #YĞi¬m T£ng #Wcüa ta chßa v§y?" )  
            AddText( sceneId, "   SØ døng #G700 #YKim Nguyên Bäo#W ğ±i ğßşc #G1 #YĞi¬m T£ng#W!" ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f01 #g66ffffĞi¬m T£ng", 3, 230 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f010 #g66ffffĞi¬m T£ng", 3, 231 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f0100 #g66ffffĞi¬m T£ng", 3, 232 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == 24    then  
        BeginEvent(sceneId)  
            AddText( sceneId, "   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YKim Nguyên Bäo#W ğ¬ ğ±i l¤y #YĞi¬m T£ng #Wcüa ta chßa v§y?" )  
            AddText( sceneId, "   SØ døng #G10 #YĞi¬m Môn Phái #W ğ±i ğßşc Phiªu #G 1 #YĞi¬m T£ng#W!" ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f01 #g66ffffĞi¬m T£ng", 3, 240 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f010 #g66ffffĞi¬m T£ng", 3, 241 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y Phiªu #gfff0f0100 #g66ffffĞi¬m T£ng", 3, 242 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end     
    if    GetNumText() == x002059_g_YuanBao    then  
        BeginEvent(sceneId)  
            AddText( sceneId, "   Lña ch÷n ti«n t® ho£c các loÕi ği¬m hoÕt ğµng ğ¬ chuy¬n ğ±i thành #YKim Nguyên Bäo" )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffVàng #-02", 3, 31 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m Môn Phái", 3, 32 ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m c¯ng hiªn Bang Hµi", 3, 33 ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Dùng #g66ffffĞi¬m T£ng", 3, 34 ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == 31    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YVàng#W #-02 ğ¬ ğ±i l¤y #YKim Nguyên Bäo #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G1 #Y#W ğ±i ğßşc #G14 #YKim Nguyên Bäo#W!" ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 14 #g66ffffKim Nguyên Bäo", 3, 310 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 140 #g66ffffKim Nguyên Bäo", 3, 311 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 1400 #g66ffffKim Nguyên Bäo", 3, 312 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == 32    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YĞi¬m Môn Phái#W ğ¬ ğ±i l¤y #YKim Nguyên Bäo #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G1 #YĞi¬m Môn Phái#W ğ±i ğßşc #G70 #YKim Nguyên Bäo#W!" ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 70 #g66ffffKim Nguyên Bäo", 3, 320 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 700 #g66ffffKim Nguyên Bäo", 3, 321 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 7000 #g66ffffKim Nguyên Bäo", 3, 322 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == 33    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YĞi¬m c¯ng hiªn Bang Hµi#W ğ¬ ğ±i l¤y #YKim Nguyên Bäo #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G1 #YĞi¬m c¯ng hiªn Bang Hµi#W ğ±i ğßşc #G70 #YKim Nguyên Bäo#W!" ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 70 #g66ffffKim Nguyên Bäo", 3, 330 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 700 #g66ffffKim Nguyên Bäo", 3, 331 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 7000 #g66ffffKim Nguyên Bäo", 3, 332 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == 34    then  
        BeginEvent(sceneId)  
            AddText(sceneId,"   Ta lúc nào cûng sÇn sàng, nhßng "..Sex.." ğã mang theo #YĞi¬m T£ng#W ğ¬ ğ±i l¤y #YKim Nguyên Bäo #Wcüa ta chßa v§y?")  
            AddText( sceneId, "   SØ døng #G1 #YĞi¬m T£ng#W ğ±i ğßşc #G700 #YKim Nguyên Bäo#W!" ) 
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 700 #g66ffffKim Nguyên Bäo", 3, 340 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 7000 #g66ffffKim Nguyên Bäo", 3, 341 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Ğ±i l¤y #gfff0f0 14000 #g66ffffKim Nguyên Bäo", 3, 342 )  
            AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )  
    end 
    if    GetNumText() == x002059_g_Str    then  
    BeginEvent(sceneId)  
        AddText(sceneId,"   Sàn giao d¸ch ti«n t® và các loÕi ği¬m hoÕt ğµng trao ğ±i nhß sau:")   
        AddText(sceneId," - Ğ¸nh giá #G1 #YĞi¬m T£ng #W hi®n tÕi nªu ğem trao ğ±i s¨ tß½ng ğß½ng #G10 #YĞi¬m c¯ng hiªn Bang Hµi#W ho£c #G10#Y Ği¬m Môn Phái#W ho£c #G50 #Y#-02 #Who£c #G700 #YKim Nguyên Bäo#W.")  
        AddText(sceneId," - Nªu trao ğ±i #YVàng #-02 #Wb¢ng #YVàng #-14#W s¨ có lãi xu¤t giao ğµng trong khoãng #G0.01#W%.") 
        AddText(sceneId," - #cff0000Lßu ı#W: s¨ ßu tiên tr× #YVàng #-14#W cho ğªn khi b¢ng #G0#W sau ğó s¨ tr× vào #YVàng #-02#W, khi ğ±i thành các loÕi ti«n t® và ği¬m hoÕt ğµng khác!") 
        AddNumText( sceneId, x002059_g_scriptId, "#gFF0FA0Quay lÕi trang ğ¥u", 8, 100 )  
    EndEvent(sceneId)  
    DispatchEventList(sceneId,selfId,targetId)  
    end  
    if GetNumText() == 110 or GetNumText() == 111 or GetNumText() == 112 or GetNumText() == 113 then  
        x002059_AddMoneyByMoneyJZ( sceneId, selfId );  
    end  
    if GetNumText() == 120 or GetNumText() == 121 or GetNumText() == 122 then  
        x002059_AddMoneyByYuanBao( sceneId, selfId );  
    end  
    if GetNumText() == 130 or GetNumText() == 131 or GetNumText() == 132 then  
        x002059_AddMoneyByMenpaiPoint( sceneId, selfId );  
    end 
    if GetNumText() == 140 or GetNumText() == 141 or GetNumText() == 142 then  
        x002059_AddMoneyByConTribPoint( sceneId, selfId );  
    end 
    if GetNumText() == 150 or GetNumText() == 151 or GetNumText() == 152 then  
        x002059_AddMoneyByZengDian( sceneId, selfId );  
    end 
    if GetNumText() == 210 or GetNumText() == 211 or GetNumText() == 212 then  
        x002059_AddZengDianByConTribPoint( sceneId, selfId );  
    end  
    if GetNumText() == 220 or GetNumText() == 221 or GetNumText() == 222 then  
        x002059_AddZengDianByMoney( sceneId, selfId );  
    end  
    if GetNumText() == 230 or GetNumText() == 231 or GetNumText() == 232 then  
        x002059_AddZengDianByYuanBao( sceneId, selfId );  
    end  
    if GetNumText() == 240 or GetNumText() == 241 or GetNumText() == 242 then  
        x002059_AddZengDianByMenpaiPoint( sceneId, selfId );  
    end 
    if GetNumText() == 310 or GetNumText() == 311 or GetNumText() == 312 then  
        x002059_AddYuanBaoByMoney( sceneId, selfId ); 
    end 
    if GetNumText() == 320 or GetNumText() == 321 or GetNumText() == 322 then  
        x002059_AddYuanBaoByMenpaiPoint( sceneId, selfId ); 
    end 
    if GetNumText() == 330 or GetNumText() == 331 or GetNumText() == 332 then  
        x002059_AddYuanBaoByConTribPoint( sceneId, selfId ); 
    end 
    if GetNumText() == 340 or GetNumText() == 341 or GetNumText() == 342 then  
        x002059_AddYuanBaoByZengDian( sceneId, selfId ); 
    end 
    if GetNumText() == 410 or GetNumText() == 411 or GetNumText() == 412 then  
        x002059_AddMenpaiPointoByMoney( sceneId, selfId ); 
    end 
    if GetNumText() == 420 or GetNumText() == 421 or GetNumText() == 422 then  
        x002059_AddMenpaiPointoByConTribPoint( sceneId, selfId ); 
    end 
    if GetNumText() == 430 or GetNumText() == 431 or GetNumText() == 432 then  
        x002059_AddMenpaiPointoByZengDian( sceneId, selfId ); 
    end 
    if GetNumText() == 440 or GetNumText() == 441 or GetNumText() == 442 then  
        x002059_AddMenpaiPointoByYuanBao( sceneId, selfId ); 
    end 
    if GetNumText() == 100 then  
        x002059_OnDefaultEvent( sceneId, selfId, targetId )  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddMoneyByMenpaiPoint( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end  
    if GetNumText() == 130 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if menpaipoint < 1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1 #YĞi¬m Môn Phái #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 50000)  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint-1)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G1 #YĞi¬m Môn Phái")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 131 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if menpaipoint < 10 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #YĞi¬m Môn Phái #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 500000)  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint-10)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G10 #YĞi¬m Môn Phái")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 132 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if menpaipoint < 100 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G100 #YĞi¬m Môn Phái #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 5000000)  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint-100)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G100 #YĞi¬m Môn Phái")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddMoneyByConTribPoint( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end  
    local guildid = GetHumanGuildID(sceneId, selfId)  
    if guildid == -1 then  
        BeginEvent( sceneId )  
            AddText(sceneId,"   Chßa gia nh§p Bang Hµi mà có ği¬m c¯ng hiªn ß!")  
        EndEvent( sceneId )  
        DispatchEventList( sceneId, selfId, targetId )  
        return 0; 
    elseif GetNumText() == 140 then  
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT);  
        if guildPoint < 1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 50000)  
        CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -1 ) 
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G1 #YĞi¬m c¯ng hiªn Bang Hµi")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 141 then  
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT);  
        if guildPoint < 10 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 500000)  
        CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -10 ) 
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G10 #YĞi¬m c¯ng hiªn Bang Hµi")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 142 then  
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT);  
        if guildPoint < 100 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G100 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 5000000)  
        CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -100 ) 
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G100 #YĞi¬m c¯ng hiªn Bang Hµi")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddYuanBaoByMoney( sceneId, selfId ) 
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end 
    if GetNumText() == 310 then  
        local nMoney = GetMoney (sceneId, selfId)  
        if nMoney < 10000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Th§t ğáng tiªt, "..Sex.." chßa ğü #G1 #-02#W, không th¬ ...")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 10000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            YuanBao(sceneId,selfId,targetId,1,14)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 1 #-02")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G14 #YKim Nguyên Bäo")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 311 then  
        local nMoney = GetMoney (sceneId, selfId)  
        if nMoney < 100000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Th§t ğáng tiªt, "..Sex.." chßa ğü #G10 #-02#W, xem lÕi s¯ ti«n cüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé!.")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 100000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            YuanBao(sceneId,selfId,targetId,1,140)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 10 #-02")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G140 #YKim Nguyên Bäo")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 312 then  
        local nMoney = GetMoney (sceneId, selfId)  
        if nMoney < 1000000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Th§t ğáng tiªt, "..Sex.." chßa ğü #G100 #-02#W, xem lÕi s¯ ti«n cüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé!.")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 1000000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            YuanBao(sceneId,selfId,targetId,1,1400)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 100 #-02")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G1400 #YKim Nguyên Bäo")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end 
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddYuanBaoByMenpaiPoint( sceneId, selfId ) 
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end 
    if GetNumText() == 320 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if menpaipoint < 1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1 #YĞi¬m Môn Phái #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            YuanBao(sceneId,selfId,targetId,1,70) 
            SetHumanMenpaiPoint(sceneId, selfId, menpaipoint-1)      
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 1 Ği¬m Môn Phái")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G70 #YKim Nguyên Bäo")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 321 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if menpaipoint < 10 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #YĞi¬m Môn Phái #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            YuanBao(sceneId,selfId,targetId,1,700)  
            SetHumanMenpaiPoint(sceneId, selfId, menpaipoint-10)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 10 Ği¬m Môn Phái")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G700 #YKim Nguyên Bäo")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 322 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if menpaipoint < 100 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G100 #YĞi¬m Môn Phái #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId ) 
        else   
            YuanBao(sceneId,selfId,targetId,1,7000)  
            SetHumanMenpaiPoint(sceneId, selfId, menpaipoint-100) 
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 100 Ği¬m Môn Phái")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G7000 #YKim Nguyên Bäo")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end 
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddYuanBaoByConTribPoint( sceneId, selfId ) 
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end 
    local guildid = GetHumanGuildID(sceneId, selfId)  
    if guildid == -1 then  
        BeginEvent( sceneId )  
            AddText(sceneId,"   Chßa gia nh§p Bang Hµi mà có ği¬m c¯ng hiªn ß!")  
        EndEvent( sceneId )  
        DispatchEventList( sceneId, selfId, targetId )  
        return 0;  
    elseif GetNumText() == 330 then  
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT); 
        if guildPoint < 1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            YuanBao(sceneId,selfId,targetId,1,70) 
            CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -1 )     
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 1 Ği¬m c¯ng hiªn Bang Hµi")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G70 #YKim Nguyên Bäo")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 331 then  
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT); 
        if guildPoint < 10 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            YuanBao(sceneId,selfId,targetId,1,700)  
            CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -10 ) 
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 10 Ği¬m c¯ng hiªn Bang Hµi")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G700 #YKim Nguyên Bäo")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 332 then  
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT); 
        if guildPoint < 100 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G100 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId ) 
        else   
            YuanBao(sceneId,selfId,targetId,1,7000)  
            CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -100 ) 
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 100 Ği¬m c¯ng hiªn Bang Hµi")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G7000 #YKim Nguyên Bäo")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end 
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddYuanBaoByZengDian( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end  
    if GetNumText() == 340 then  
        if ZengDian(sceneId,selfId,targetId,2,1) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1 #YĞi¬m T£ng #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        YuanBao(sceneId,selfId,targetId,1,700)   
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G1 #YĞi¬m T£ng")  
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G700 #YKim Nguyên Bäo") 
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 341 then  
        if ZengDian(sceneId,selfId,targetId,2,10) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #YĞi¬m T£ng #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        YuanBao(sceneId,selfId,targetId,1,7000)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G10 #YĞi¬m T£ng")  
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G7000 #YKim Nguyên Bäo") 
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 342 then  
        if ZengDian(sceneId,selfId,targetId,2,20) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G20 #YĞi¬m T£ng #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        YuanBao(sceneId,selfId,targetId,1,14000) 
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G20 #YĞi¬m T£ng")  
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G14000 #YKim Nguyên Bäo") 
        x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddMoneyByYuanBao( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end  
    if GetNumText() == 120 then  
        if YuanBao(sceneId,selfId,targetId,2,14) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G14 #YKim Nguyên Bäo #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 10000)   
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G14 #YKim Nguyên Bäo")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 121 then  
        if YuanBao(sceneId,selfId,targetId,2,140) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G140 #YKim Nguyên Bäo #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 100000)   
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G140 #YKim Nguyên Bäo")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 122 then  
        if YuanBao(sceneId,selfId,targetId,2,1400) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1400 #YKim Nguyên Bäo #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 1000000)   
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G1400 #YKim Nguyên Bäo")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddMoneyByZengDian( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end  
    if GetNumText() == 150 then  
        if ZengDian(sceneId,selfId,targetId,2,1) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1 #YĞi¬m T£ng #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 500000)   
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G1 #YĞi¬m T£ng")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 151 then  
        if ZengDian(sceneId,selfId,targetId,2,10) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #YĞi¬m T£ng #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 5000000)   
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G10 #YĞi¬m T£ng")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 152 then  
        if ZengDian(sceneId,selfId,targetId,2,20) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G20 #YĞi¬m T£ng #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        AddMoney( sceneId, selfId, 10000000)   
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G20 #YĞi¬m T£ng")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddMoneyByMoneyJZ( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end  
    if GetNumText() == 113 then  
        local nMoneyJZ = GetMoneyJZ (sceneId, selfId)  
        if nMoneyJZ <= 0 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không còn #YVàng #-14 #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, nMoneyJZ) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            AddMoney( sceneId, selfId, nMoneyJZ*0.9999 )  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t toàn bµ Vàng #-14")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 110 then   
        if GetMoneyJZ (sceneId, selfId) < 10000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1 #-14 #Wğ¬ ğ±i! xem lÕi #YVàng #-14 #Wcüa mình có th¬ ch÷n ğ±i hªt!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 10000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            AddMoney( sceneId, selfId, 10000*0.9999 )  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
            x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t 1 #-14")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 111 then  
        if GetMoneyJZ (sceneId, selfId) < 100000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #-14 #Wğ¬ ğ±i! xem lÕi #YVàng #-14 #Wcüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé, ho£c có th¬ ch÷n ğ±i hªt!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 100000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            AddMoney( sceneId, selfId, 100000*0.9999 )  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
            x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t 10 #-14")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 112 then  
        local nMoneyJZ = GetMoneyJZ (sceneId, selfId)  
        if nMoneyJZ < 1000000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G100 #-14 #Wğ¬ ğ±i! xem lÕi #YVàng #-14 #Wcüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé, ho£c có th¬ ch÷n ğ±i hªt!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 1000000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            AddMoney( sceneId, selfId, 1000000*0.9999 )  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t 100 #-14")  
            x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddZengDianByMenpaiPoint( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end  
    if GetNumText() == 240 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if menpaipoint < 10 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #YĞi¬m Môn Phái #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        ZengDian(sceneId,selfId,targetId,1,1) 
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint-10)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G10 #YĞi¬m Môn Phái") 
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G1 #YĞi¬m T£ng") 
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 241 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if menpaipoint < 100 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G100 #YĞi¬m Môn Phái #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        ZengDian(sceneId,selfId,targetId,1,10) 
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint-100)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G100 #YĞi¬m Môn Phái") 
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G10 #YĞi¬m T£ng")     
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 242 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if menpaipoint < 1000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1000 #YĞi¬m Môn Phái #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        ZengDian(sceneId,selfId,targetId,1,100) 
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint-1000)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G1000 #YĞi¬m Môn Phái") 
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G100 #YĞi¬m T£ng") 
        x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddZengDianByConTribPoint( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "ti¬u muµi"  
    else   
        Sex = "ti¬u ğ®"  
    end  
    local guildid = GetHumanGuildID(sceneId, selfId)  
    if guildid == -1 then  
        BeginEvent( sceneId )  
            AddText(sceneId,"   Chßa gia nh§p Bang Hµi mà có ği¬m c¯ng hiªn ß!")  
        EndEvent( sceneId )  
        DispatchEventList( sceneId, selfId, targetId )  
        return 0;  
    elseif  GetNumText() == 210 then  
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT);  
        if guildPoint < 10 then  
            BeginEvent(sceneId)  
                AddText( sceneId, "   #YĞi¬m c¯ng hiªn Bang Hµi#W cüa "..Sex.." chßa ğü #G10 #Wği¬m r°i, không th¬ ğ±i." )  
            EndEvent(sceneId)  
            DispatchEventList( sceneId, selfId, targetId )  
            return 0;  
        else  
            CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -10 )  
            ZengDian(sceneId,selfId,targetId,1,1)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 10 ği¬m c¯ng hiªn Bang Hµi")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G1 #YĞi¬m T£ng") 
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif  GetNumText() == 211 then  
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT);  
        if guildPoint < 100 then  
            BeginEvent(sceneId)  
                AddText( sceneId, "   #YĞi¬m c¯ng hiªn Bang Hµi#W cüa "..Sex.." chßa ğü #G100 #Wği¬m, xem lÕi ği¬m c¯ng hiªn cüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé!" )  
            EndEvent(sceneId)  
            DispatchEventList( sceneId, selfId, targetId )  
            return 0;  
        else  
            CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -100 )  
            ZengDian(sceneId,selfId,targetId,1,10)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 100 ği¬m c¯ng hiªn Bang Hµi")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G10 #YĞi¬m T£ng") 
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif  GetNumText() == 212 then  
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT);  
        if guildPoint < 1000 then  
            BeginEvent(sceneId)  
                AddText( sceneId, "   #YĞi¬m c¯ng hiªn Bang Hµi #Wcüa "..Sex.." chßa ğü #G1000 #Wği¬m, xem lÕi ği¬m c¯ng hiªn cüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé!" )  
            EndEvent(sceneId)  
            DispatchEventList( sceneId, selfId, targetId )  
            return 0;  
        else  
            CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -1000 )  
            ZengDian(sceneId,selfId,targetId,1,100)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 1000 ği¬m c¯ng hiªn Bang Hµi") 
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G100 #YĞi¬m T£ng") 
            x002059_CloseMe(sceneId, selfId)     
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddZengDianByMoney( sceneId, selfId, targetId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "ti¬u muµi"  
    else   
        Sex = "ti¬u ğ®"  
    end  
    if GetNumText() == 220 then  
        local nMoney = GetMoney (sceneId, selfId)  
        if nMoney < 500000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Th§t ğáng tiªt, "..Sex.." chßa ğü #G50 #-02#W, không th¬ ...")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 500000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
        EndEvent(sceneId)  
        DispatchEventList( sceneId, selfId, targetId )   
        else  
            ZengDian(sceneId,selfId,targetId,1,1)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 50 #-02")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G1 #YĞi¬m T£ng") 
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 221 then  
        local nMoney = GetMoney (sceneId, selfId)  
        if nMoney < 5000000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Th§t ğáng tiªt, "..Sex.." chßa ğü #G500 #-02#W, xem lÕi s¯ ti«n cüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé!.")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 5000000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            ZengDian(sceneId,selfId,targetId,1,10)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 500 #-02")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G10 #YĞi¬m T£ng") 
            x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 222 then  
        local nMoney = GetMoney (sceneId, selfId)  
        if nMoney < 50000000 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Th§t ğáng tiªt, "..Sex.." chßa ğü #G5000 #-02#W, xem lÕi s¯ ti«n cüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé!.")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 50000000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            ZengDian(sceneId,selfId,targetId,1,100)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 5000 #-02")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G100 #YĞi¬m T£ng") 
            x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddZengDianByYuanBao( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "ti¬u muµi"  
    else   
        Sex = "ti¬u ğ®"  
    end  
    if GetNumText() == 230 then  
        if YuanBao(sceneId,selfId,targetId,2,700) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G700 #YKim Nguyên Bäo #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        ZengDian(sceneId,selfId,targetId,1,1)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n dßşc #G1 #YĞi¬m T£ng")  
        x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği #G700 #YKim Nguyên Bäo")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 231 then  
        if YuanBao(sceneId,selfId,targetId,2,7000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G7000 #YKim Nguyên Bäo #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        ZengDian(sceneId,selfId,targetId,1,10)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n dßşc #G10 #YĞi¬m T£ng")  
        x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği #G7000 #YKim Nguyên Bäo")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 232 then  
        if YuanBao(sceneId,selfId,targetId,2,70000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G70000 #YKim Nguyên Bäo #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        ZengDian(sceneId,selfId,targetId,1,100)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n dßşc #G100 #YĞi¬m T£ng")  
        x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği #G70000 #YKim Nguyên Bäo") 
        x002059_CloseMe(sceneId, selfId)         
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddMenpaiPointoByConTribPoint( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "Cô nß½ng"  
    else   
        Sex = "Các hÕ"  
    end  
    local guildid = GetHumanGuildID(sceneId, selfId)  
    if guildid == -1 then  
        BeginEvent( sceneId )  
            AddText(sceneId,"   Chßa gia nh§p Bang Hµi mà có ği¬m c¯ng hiªn ß!")  
        EndEvent( sceneId )  
        DispatchEventList( sceneId, selfId, targetId )  
        return 0; 
    elseif GetNumText() == 420 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT);  
        if guildPoint < 1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+1)  
        CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -1 ) 
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G1 #YĞi¬m c¯ng hiªn Bang Hµi")  
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G1 #YĞi¬m Môn Phái") 
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 421 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT);  
        if guildPoint < 10 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+10)   
        CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -10 ) 
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G10 #YĞi¬m c¯ng hiªn Bang Hµi") 
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G10 #YĞi¬m Môn Phái")         
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 422 then 
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId)     
        local guildPoint = CityGetAttr(sceneId, selfId, GUILD_CONTRIB_POINT);  
        if guildPoint < 100 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G100 #YĞi¬m c¯ng hiªn Bang Hµi #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+100)   
        CityChangeAttr( sceneId, selfId, GUILD_CONTRIB_POINT, -100 ) 
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)  
        x002059_NotifyFailTips(sceneId,selfId,""..Sex.." ğã m¤t ği #G100 #YĞi¬m c¯ng hiªn Bang Hµi")  
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G100 #YĞi¬m Môn Phái") 
        x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end  
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddMenpaiPointoByMoney( sceneId, selfId, targetId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "ti¬u muµi"  
    else   
        Sex = "ti¬u ğ®"  
    end  
    if GetNumText() == 410 then  
        local layvang = CostMoney(sceneId,selfId,10000000) 
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
       if layvang == -1 then
            BeginEvent( sceneId )  
                AddText(sceneId,"   Th§t ğáng tiªt, "..Sex.." chßa ğü #G1000 #-02 #r#cFF0000(không khóa)#Wxem lÕi s¯ ti«n cüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé!.")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        --elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 10000000) == -1 then  --- tru luon ca vang khoa lan vang ko khoa
           -- BeginEvent( sceneId )  
                --AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else   
            SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+1000)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 1000 #-02")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G1000 #YĞi¬m Môn Phái") 
							local	 nam	 =  LuaFnGetName(  sceneId,  selfId  )
				BroadMsgByChatPipe(  sceneId,  selfId,  "#cFF0000 Kim Ngû Gia: #W Xin chúc m×ng #cFF0000 ["..nam.."] #G Ğã ğ±i 1000 #-02 ğ±i l¤y #c00ffff 1000 ĞMP",  4  )
            x002059_CloseMe(sceneId, selfId)
        end  
    elseif GetNumText() == 411 then  
        local layvang = CostMoney(sceneId,selfId,100000000) 
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
       if layvang == -1 then
            BeginEvent( sceneId )  
                AddText(sceneId,"   Th§t ğáng tiªt, "..Sex.." chßa ğü #G10000 #-02 #r#cFF0000(không khóa)#Wxem lÕi s¯ ti«n cüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé!.")    
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        --elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 100000000) == -1 then  
           --BeginEvent( sceneId )  
                --AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
            SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+10000)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 10000 #-02")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G10000 #YĞi¬m Môn Phái") 
							local	 nam	 =  LuaFnGetName(  sceneId,  selfId  )
				BroadMsgByChatPipe(  sceneId,  selfId,  "#cFF0000 Kim Ngû Gia: #W Xin chúc m×ng #cFF0000 ["..nam.."] #G Ğã ğ±i 10000 #-02 ğ±i l¤y #c00ffff 10000 ĞMP",  4  )
            x002059_CloseMe(sceneId, selfId)
        end  
    elseif GetNumText() == 412 then  
        local layvang = CostMoney(sceneId,selfId,1000000000) 
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
       if layvang == -1 then
            BeginEvent( sceneId )  
                AddText(sceneId,"   Th§t ğáng tiªt, "..Sex.." chßa ğü #G100000 #-02 #r#cFF0000(không khóa)#Wxem lÕi s¯ ti«n cüa mình có th¬ lña ch÷n mÑc ğ±i th¤p h½n ğßşc không nhé!.")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        --elseif LuaFnCostMoneyWithPriority (sceneId, selfId, 1000000000) == -1 then  
            --BeginEvent( sceneId )  
                --AddText(sceneId,"   Thao tác th¤t bÕi")  
            EndEvent( sceneId )  
            ispatchEventList( sceneId, selfId, targetId )  
        else  
            SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+100000)  
            LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
            x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği 100000 #-02")  
            x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n ğßşc #G100000 #YĞi¬m Môn Phái") 
							local	 nam	 =  LuaFnGetName(  sceneId,  selfId  )
				BroadMsgByChatPipe(  sceneId,  selfId,  "#cFF0000 Kim Ngû Gia: #W Xin chúc m×ng #cFF0000 ["..nam.."] #G Ğã ğ±i 100000 #-02 ğ±i l¤y #c00ffff 100000 ĞMP",  4  )
            x002059_CloseMe(sceneId, selfId) 
        end  
    end  
end 
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddMenpaiPointoByZengDian( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "ti¬u muµi"  
    else   
        Sex = "ti¬u ğ®"  
    end  
    if GetNumText() == 430 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if ZengDian(sceneId,selfId,targetId,2,1) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G1 #YĞi¬m T£ng #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+10)     
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n dßşc #G10 #YĞi¬m Môn Phái")  
        x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği #G1 #YĞi¬m T£ng")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 431 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if ZengDian(sceneId,selfId,targetId,2,10) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G10 #YĞi¬m T£ng #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+100)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n dßşc #G100 #YĞi¬m Môn Phái")  
        x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği #G10 #YĞi¬m T£ng")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 432 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if ZengDian(sceneId,selfId,targetId,2,100) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G100 #YĞi¬m T£ng #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+1000) 
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n dßşc #G1000 #YĞi¬m Môn Phái")  
        x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği #G100 #YĞi¬m T£ng") 
        x002059_CloseMe(sceneId, selfId)         
        end  
    end  
end 
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_AddMenpaiPointoByYuanBao( sceneId, selfId )  
    local Sex = GetSex(sceneId,selfId)  
    if Sex == 0 then  
        Sex = "ti¬u muµi"  
    else   
        Sex = "ti¬u ğ®"  
    end  
    if GetNumText() == 440 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if YuanBao(sceneId,selfId,targetId,2,70) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G70 #YKim Nguyên Bäo #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+1)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n dßşc #G1 #YĞi¬m Môn Phái")  
        x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği #G70 #YKim Nguyên Bäo")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 441 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if YuanBao(sceneId,selfId,targetId,2,700) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G700 #YKim Nguyên Bäo #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+10)  
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n dßşc #G10 #YĞi¬m Môn Phái")  
        x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği #G700 #YKim Nguyên Bäo")  
        x002059_CloseMe(sceneId, selfId) 
        end  
    elseif GetNumText() == 442 then  
        local menpaipoint = GetHumanMenpaiPoint(sceneId, selfId) 
        if YuanBao(sceneId,selfId,targetId,2,7000) == -1 then  
            BeginEvent( sceneId )  
                AddText(sceneId,"   Không ğü #G7000 #YKim Nguyên Bäo #Wğ¬ ğ±i!")  
            EndEvent( sceneId )  
            DispatchEventList( sceneId, selfId, targetId )  
        else  
        SetHumanMenpaiPoint(sceneId, selfId, menpaipoint+100) 
        LuaFnSendSpecificImpactToUnit(sceneId, selfId, selfId, selfId, 18, 0)   
        x002059_NotifyFailTips(sceneId,selfId,"Xin chúc m×ng "..Sex.." ğã nh§n dßşc #G100 #YĞi¬m Môn Phái")  
        x002059_NotifyFailTips(sceneId,selfId,"Ğã m¤t ği #G7000 #YKim Nguyên Bäo") 
        x002059_CloseMe(sceneId, selfId)         
        end  
    end  
end 
------------------------------------------------------------------------  
------------------------------------------------------------------------  
function x002059_NotifyFailTips(sceneId,selfId,Tip)  
    BeginEvent(sceneId)  
        AddText(sceneId,Tip)  
    EndEvent(sceneId)  
    DispatchMissionTips(sceneId,selfId)  
end   
------------------------------------------------------------------------  
------------------------------------------------------------------------ 
function x002059_CloseMe(sceneId, selfId) 
    BeginUICommand(sceneId) 
    EndUICommand(sceneId) 
    DispatchUICommand(sceneId,selfId, 1000) 
end  