--×¢Òâ£º

--ÎïÆ·¼¼ÄÜµÄÂß¼­Ö»ÄÜÊ¹ÓÃ»ù´¡¼¼ÄÜºÍ½Å±¾À´ÊµÏÖ

--½Å±¾:

--ÒÔÏÂÊÇ½Å±¾ÑùÀý:


--obj_71.lua
------------------------------------------------------------------------------------------
--Ò»°ãÎïÆ·µÄÄ¬ÈÏ½Å±¾

--½Å±¾ºÅ
x390102_g_scriptId = 390102 --ÁÙÊ±Ð´Õâ¸ö,ÕæÕýÓÃµÄÊ±ºòÒ»¶¨Òª¸Ä.

--ÐèÒªµÄµÈ¼¶

--Ð§¹ûµÄID
x390102_g_Impact1 = 3003 --ÁÙÊ±Ð´Õâ¸ö
x390102_g_Impact2 = -1 --²»ÓÃ
x390102_g_SpecailObj = 94--

--**********************************
--ÊÂ¼þ½»»¥Èë¿Ú
--**********************************
function x390102_OnDefaultEvent( sceneId, selfId, bagIndex )
-- ²»ÐèÒªÕâ¸ö½Ó¿Ú£¬µ«Òª±£Áô¿Õº¯Êý
end

--**********************************
--Õâ¸öÎïÆ·µÄÊ¹ÓÃ¹ý³ÌÊÇ·ñÀàËÆÓÚ¼¼ÄÜ£º
--ÏµÍ³»áÔÚÖ´ÐÐ¿ªÊ¼Ê±¼ì²âÕâ¸öº¯ÊýµÄ·µ»ØÖµ£¬Èç¹û·µ»ØÊ§°ÜÔòºöÂÔºóÃæµÄÀàËÆ¼¼ÄÜµÄÖ´ÐÐ¡£
--·µ»Ø1£º¼¼ÄÜÀàËÆµÄÎïÆ·£¬¿ÉÒÔ¼ÌÐøÀàËÆ¼¼ÄÜµÄÖ´ÐÐ£»·µ»Ø0£ººöÂÔºóÃæµÄ²Ù×÷¡£
--**********************************
function x390102_IsSkillLikeScript( sceneId, selfId)
	return 1; --Õâ¸ö½Å±¾ÐèÒª¶¯×÷Ö§³Ö
end

--**********************************
--Ö±½ÓÈ¡ÏûÐ§¹û£º
--ÏµÍ³»áÖ±½Óµ÷ÓÃÕâ¸ö½Ó¿Ú£¬²¢¸ù¾ÝÕâ¸öº¯ÊýµÄ·µ»ØÖµÈ·¶¨ÒÔºóµÄÁ÷³ÌÊÇ·ñÖ´ÐÐ¡£
--·µ»Ø1£ºÒÑ¾­È¡Ïû¶ÔÓ¦Ð§¹û£¬²»ÔÙÖ´ÐÐºóÐø²Ù×÷£»·µ»Ø0£ºÃ»ÓÐ¼ì²âµ½Ïà¹ØÐ§¹û£¬¼ÌÐøÖ´ÐÐ¡£
--**********************************
function x390102_CancelImpacts( sceneId, selfId )
	return 0; --²»ÐèÒªÕâ¸ö½Ó¿Ú£¬µ«Òª±£Áô¿Õº¯Êý,²¢ÇÒÊ¼ÖÕ·µ»Ø0¡£
end

--**********************************
--Ìõ¼þ¼ì²âÈë¿Ú£º
--ÏµÍ³»áÔÚ¼¼ÄÜ¼ì²âµÄÊ±¼äµãµ÷ÓÃÕâ¸ö½Ó¿Ú£¬²¢¸ù¾ÝÕâ¸öº¯ÊýµÄ·µ»ØÖµÈ·¶¨ÒÔºóµÄÁ÷³ÌÊÇ·ñÖ´ÐÐ¡£
--·µ»Ø1£ºÌõ¼þ¼ì²âÍ¨¹ý£¬¿ÉÒÔ¼ÌÐøÖ´ÐÐ£»·µ»Ø0£ºÌõ¼þ¼ì²âÊ§°Ü£¬ÖÐ¶ÏºóÐøÖ´ÐÐ¡£
--**********************************
-- [NetCo4 15/10] Cong Luc Dan chinh tren web admin: Server/txt/NetCo4Cfg/congluc.txt = "<moi vien> <tran>" (panel GM - Cai dat toan server).
-- Doc moi lan can dan (hieu luc ngay, khong restart). Khong co file / so sai = 100 / 99999 nhu goc.
function x390102_CauHinh()
	local a, b = 100, 99999
	local h = openfile( "./txt/NetCo4Cfg/congluc.txt", "r" )
	if h == nil then
		return a, b
	end
	local s = read( h, "*l" )
	closefile( h )
	local _, _, x, y = strfind( s or "", "^%s*(%d+)%s+(%d+)" )
	x = tonumber( x or "" )
	y = tonumber( y or "" )
	if x ~= nil and x >= 1 and x <= 10000000 then a = x end
	if y ~= nil and y >= 100 and y <= 99999999 then b = y end
	return a, b
end

function x390102_OnConditionCheck( sceneId, selfId )
	--Ð£ÑéÊ¹ÓÃµÄÎïÆ·
	if(1~=LuaFnVerifyUsedItem(sceneId, selfId)) then
		return 0
	end
	local _, tran = x390102_CauHinh()	-- [NetCo4 15/10] da cham tran thi khong cho can (truoc: mat vien ma khong duoc gi)
	if GetMissionData( sceneId, selfId, XIULIAN_GONGLI ) >= tran then
		BeginEvent( sceneId )
			AddText( sceneId, "C\244ng l\241c \240\227 \240\213t t\175i \240a "..tran )
		EndEvent( sceneId )
		DispatchMissionTips( sceneId, selfId )
		return 0
	end
	
	local nDayCount = GetMissionData( sceneId, selfId, XIULIAN_GONG_CS )
	local nLastDay = GetHighWord( nDayCount )
	local nCount = GetLowWord( nDayCount )
	local nToday = GetDayTime()
	if nDayCount == -1 then
--		x889061_NotifyTip( sceneId, selfId, "GetMissionDataË÷ÒýÔ½½ç£¬Çë¼ì²éScriptGlobal.lua")
	return 0
	--elseif nLastDay == nToday and nCount >= 30 then
		--BeginEvent( sceneId )						
			--AddText( sceneId, "Ã¿ÌìÖ»ÄÜÊ¹ÓÃ30´Î" )
		--EndEvent( sceneId )
	--DispatchMissionTips( sceneId, selfId )
		--return 0
	else
			return 1;
	end
 --²»ÐèÒªÈÎºÎÌõ¼þ£¬²¢ÇÒÊ¼ÖÕ·µ»Ø1¡£
end

--**********************************
--ÏûºÄ¼ì²â¼°´¦ÀíÈë¿Ú£º
--ÏµÍ³»áÔÚ¼¼ÄÜÏûºÄµÄÊ±¼äµãµ÷ÓÃÕâ¸ö½Ó¿Ú£¬²¢¸ù¾ÝÕâ¸öº¯ÊýµÄ·µ»ØÖµÈ·¶¨ÒÔºóµÄÁ÷³ÌÊÇ·ñÖ´ÐÐ¡£
--·µ»Ø1£ºÏûºÄ´¦ÀíÍ¨¹ý£¬¿ÉÒÔ¼ÌÐøÖ´ÐÐ£»·µ»Ø0£ºÏûºÄ¼ì²âÊ§°Ü£¬ÖÐ¶ÏºóÐøÖ´ÐÐ¡£
--×¢Òâ£ºÕâ²»¹â¸ºÔðÏûºÄµÄ¼ì²âÒ²¸ºÔðÏûºÄµÄÖ´ÐÐ¡£
--**********************************
function x390102_OnDeplete( sceneId, selfId )
	if(0<LuaFnDepletingUsedItem(sceneId, selfId)) then
		return 1;
	end
	return 0;
end

--**********************************
--Ö»»áÖ´ÐÐÒ»´ÎÈë¿Ú£º
--¾ÛÆøºÍË²·¢¼¼ÄÜ»áÔÚÏûºÄÍê³Éºóµ÷ÓÃÕâ¸ö½Ó¿Ú£¨¾ÛÆø½áÊø²¢ÇÒ¸÷ÖÖÌõ¼þ¶¼Âú×ãµÄÊ±ºò£©£¬¶øÒýµ¼
--¼¼ÄÜÒ²»áÔÚÏûºÄÍê³Éºóµ÷ÓÃÕâ¸ö½Ó¿Ú£¨¼¼ÄÜµÄÒ»¿ªÊ¼£¬ÏûºÄ³É¹¦Ö´ÐÐÖ®ºó£©¡£
--·µ»Ø1£º´¦Àí³É¹¦£»·µ»Ø0£º´¦ÀíÊ§°Ü¡£
--×¢£ºÕâÀïÊÇ¼¼ÄÜÉúÐ§Ò»´ÎµÄÈë¿Ú
--**********************************
function x390102_OnActivateOnce( sceneId, selfId )
	local gongli=GetMissionData( sceneId, selfId, XIULIAN_GONGLI )
	local num, tran = x390102_CauHinh()	-- [NetCo4 15/10] tu web admin (congluc.txt), mac dinh 100 / 99999 nhu goc	--ÕâÀïÊÇÕâ¸öÎïÆ·¼Ó¹¦Á¦µÄÊýÖµ
	local total=gongli+num
	if total>tran then	--Õâ¸öÊÇ¿ØÖÆ¹¦Á¦µÄ×î´óÖµÎª100
		total=tran
	end
	if total<gongli then	-- [NetCo4 15/10] tran ha thap hon cong luc dang co: giu nguyen, khong ep ve tran
		total=gongli
	end
	SetMissionData(sceneId, selfId, XIULIAN_GONGLI, total);
	CallScriptFunction( 390101, "ReturnAttr", sceneId, selfId )	--·²ÊÇÐÞ¸Äµ½ÐÞÁ¶ÊôÐÔµÄ£¬¶¼Òª¼ÓÉÏÕâÒ»ÐÐ£¬ÈÃ¿Í»§¶ËµÄÏÔÊ¾Í¬²½
	BeginEvent( sceneId )
		AddText( sceneId, "Công Lñc cüa các hÕ +"..(total-gongli) )
	EndEvent( sceneId )
	DispatchMissionTips( sceneId, selfId )
	
	
	local nDayCount = GetMissionData( sceneId, selfId, XIULIAN_GONG_CS )
	local nLastDay = GetHighWord( nDayCount )
	local nCount = GetLowWord( nDayCount )
	local nToday = GetDayTime()
			--¸üÐÂ´ÎÊý
			local nData = 0
			if nLastDay ~= nToday then
				nData = SetHighWord( nData, nToday )
				nData = SetLowWord( nData, 1 )
			else
				nData = SetHighWord( nData, nToday )
				nData = SetLowWord( nData, nCount + 1 )
			end
			SetMissionData( sceneId, selfId, XIULIAN_GONG_CS, nData )
			
			
	return 1;
end

--**********************************
--Òýµ¼ÐÄÌø´¦ÀíÈë¿Ú£º
--Òýµ¼¼¼ÄÜ»áÔÚÃ¿´ÎÐÄÌø½áÊøÊ±µ÷ÓÃÕâ¸ö½Ó¿Ú¡£
--·µ»Ø£º1¼ÌÐøÏÂ´ÎÐÄÌø£»0£ºÖÐ¶ÏÒýµ¼¡£
--×¢£ºÕâÀïÊÇ¼¼ÄÜÉúÐ§Ò»´ÎµÄÈë¿Ú
--**********************************
function x390102_OnActivateEachTick( sceneId, selfId)
	return 1; --²»ÊÇÒýµ¼ÐÔ½Å±¾, Ö»±£Áô¿Õº¯Êý.
end
