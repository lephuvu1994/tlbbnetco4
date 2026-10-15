--第八本心法技能  蝎子制作QQ-718805400

x808241_g_scriptId = 808241
--**********************************************************************************
function x808241_OnImpactFadeOut( sceneId, selfId, impactId )
	local targetId = LuaFnGetTargetObjID(sceneId, selfId)
	local objType = GetCharacterType( sceneId, targetId )
	local mymenpai = GetMenPai( sceneId, selfId )

        if LuaFnIsObjValid(sceneId, targetId) ~= 1 then
           return
        end

        --特殊情况
	if GetHp( sceneId, selfId ) == 0  or GetHp( sceneId, targetId ) == 0 or selfId == targetId or (LuaFnUnitIsEnemy(sceneId, selfId, targetId) ~= 1 )  then
	   x808241_NotifyTip( sceneId, selfId, "Kh\244ng th\172 t\164n c\244ng m\248c ti\234u n\224y")
	   return
	end
	if LuaFnIsUnbreakable(sceneId,targetId) >= 1 then
	   x808241_NotifyTip( sceneId, selfId, "M\248c ti\234u \240ang \183 tr\213ng th\225i v\244 \240\184ch")
	   return
	end

     if impactId == 258 then
        if objType == 1 then   --对方是人	
           local AA = ( GetMissionData(sceneId,selfId,481) - GetMissionData(sceneId,targetId,481) )
           local BB = ( GetMissionData(sceneId,selfId,482) - GetMissionData(sceneId,targetId,482) )
           local CC = ( GetMissionData(sceneId,selfId,483) - GetMissionData(sceneId,targetId,483) )
           local DD = ( GetMissionData(sceneId,selfId,484) - GetMissionData(sceneId,targetId,484) )
           local sanhai = floor((120+AA+BB+CC+DD)/15)
	   if sanhai <= 0 then
		x808241_NotifyTip( sceneId, selfId, "Tu luy\174n c\252a \240\175i ph\223\189ng cao h\189n b\213n qu\225 nhi\171u, kh\175ng ch\170 v\244 hi\174u")
	      return	
           end
	   if sanhai >= 24 then
	      sanhai = 24	
           end

	   LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, targetId, 1369+sanhai, 0 )
        end

        if objType == 2 or objType == 3 then   --对方是怪或宠
	   LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, targetId, 1376, 0 )
        end

      if floor(GetMissionData(sceneId,selfId,WUYI_SKILL_DE)/10^6) == 12 then
         if (GetMissionData(sceneId,selfId,WUYI_SKILL_ITEM) - LuaFnGetCurrentTime()) < 100 then
            local WuYi_TongMing = random(9)
            if WuYi_TongMing < 5 then
               BeginUICommand(sceneId)
	         UICommand_AddInt(sceneId,942)
	         UICommand_AddString(sceneId,"ski13")
	         EndUICommand(sceneId)
               DispatchUICommand(sceneId,selfId,2014092002)
            end
         end
      end
   end


     if impactId == 257 then
       if objType == 1 then   --对方是人
           local AA = GetMissionData(sceneId,selfId,481) - GetMissionData(sceneId,targetId,481)
           local BB = GetMissionData(sceneId,selfId,482) - GetMissionData(sceneId,targetId,482)
           local CC = GetMissionData(sceneId,selfId,483) - GetMissionData(sceneId,targetId,483)
           local DD = GetMissionData(sceneId,selfId,484) - GetMissionData(sceneId,targetId,484)
           local sanhai = floor((120+AA+BB+CC+DD)/24)
	    if sanhai <= 0 then
		x808241_NotifyTip( sceneId, selfId, "Tu luy\174n c\252a \240\175i ph\223\189ng cao h\189n b\213n qu\225 nhi\171u, s\225t th\223\189ng v\244 hi\174u")
	       return	
            end
	    if sanhai >= 15 then
	      sanhai = 15	
            end
	    --LuaFnSetDamage(sceneId, selfId, targetId, sanhai*150)

            if mymenpai == 3 or mymenpai == 4 or mymenpai == 5 or mymenpai == 8 or mymenpai == 10 or mymenpai == 11 or mymenpai == 12 then
	       LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, targetId, 32016+sanhai, 0 )
            else
	       LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, targetId, 32000+sanhai, 0 )
            end
      end

        if objType == 2 or objType == 3 then   --对方是怪或宠
            if mymenpai == 3 or mymenpai == 4 or mymenpai == 5 or mymenpai == 8 or mymenpai == 10 or mymenpai == 11 or mymenpai == 12 then
	       LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, targetId, 32031, 0 )
            else
	       LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, targetId, 32015, 0 )
            end
        end
    end
end


--**********************************
--醒目提示
--**********************************
function x808241_NotifyTip( sceneId, selfId, Msg )
	BeginEvent( sceneId )
		AddText( sceneId, Msg )
	EndEvent( sceneId )
	DispatchMissionTips( sceneId, selfId )
end
