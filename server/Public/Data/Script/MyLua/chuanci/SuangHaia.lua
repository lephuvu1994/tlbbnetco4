--技能
x899039_g_scriptId = 899039
x899039_g_sh = 500
x899039_g_jm = 501
x899039_g_WWDW = {15,30,45,90,150,180,195,210,270,360}
x899039_g_WuYiSkill_ID = {931,932,933,934,935,936,937,938,939,940,941,942}
--**********************************************************************************
function x899039_OnImpactFadeOut( sceneId, selfId, impactId )
	local targetId = LuaFnGetTargetObjID(sceneId, selfId)
	local objType = GetCharacterType( sceneId, targetId )
	local menpai = GetMenPai( sceneId, selfId )

        if LuaFnIsObjValid(sceneId, targetId) ~= 1 then
           return
        end

	if GetMissionData( sceneId, selfId, MF_GetNewUserCard8) ~= targetId then
	   SetMissionData( sceneId, selfId, MF_GetNewUserCard8,targetId)
	end

	if impactId == 1110 or impactId == 10475 then
	   LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, 338, 0 )
	end

	if GetHp( sceneId, selfId ) == 0  or GetHp( sceneId, targetId ) == 0 or selfId == targetId or (LuaFnUnitIsEnemy(sceneId, selfId, targetId) ~= 1 )  then
	   return
	end

	local sanhai = ( GetMissionData( sceneId, selfId, x899039_g_sh ) - GetMissionData( sceneId, targetId, x899039_g_jm ) )
	if GetHp( sceneId, selfId ) == 0  or GetHp( sceneId, targetId ) == 0 or selfId == targetId or (LuaFnUnitIsEnemy(sceneId, selfId, targetId) ~= 1 )  then
	   return
	end
	if sanhai <=0  then
	   return	
	end
	if LuaFnIsUnbreakable(sceneId,targetId) >= 1 then--目标处于无敌状态
           x899039_NotifyTip( sceneId, selfId, "M\248c ti\234u \240ang \183 tr\213ng th\225i v\244 \240\184ch" )
	   return
	end

        local wwdj = mod((GetMissionData(sceneId, selfId, XZ_LANSEDIAOWEN)),100)
        if wwdj >= 1 and wwdj <= 10  then
	   LuaFnSetDamage(sceneId, selfId, targetId, x899039_g_WWDW[wwdj])
           --x899039_NotifyTip( sceneId, selfId, "调试成功，检测到您有忘无雕纹"..wwdj.."级，为您增加攻击伤害"..x899039_g_WWDW[wwdj].."点" )
        end

	if objType == 1 then --objType等于1是人，objType等于2是怪，objType等于3是宠	
	   local sjsanhai = floor(sanhai/1)
           if sjsanhai > 0 then
	      LuaFnSetDamage(sceneId, selfId, targetId, floor(sjsanhai))
	   end

	elseif objType == 3 then
	local jianxue = floor((GetMissionData( sceneId, selfId, x899039_g_sh ))/2 )
           if jianxue > 0 then
	      LuaFnSetDamage(sceneId, selfId, targetId,jianxue) 
	   end

	elseif objType == 2  then
	local asaqt = GetMissionData( sceneId, selfId, x899039_g_sh )
	local sunm = random(asaqt-41,asaqt)
	local jianxue = floor(sunm/5 ) +2 --怪
           if jianxue > 0 then
	      LuaFnSetDamage(sceneId, selfId, targetId,jianxue) 
           end
	end

        x899039_WuYiCheck(sceneId, selfId)
end


--**********************************
--武意技能启动
--**********************************
function x899039_WuYiCheck(sceneId, selfId)

        local WY_Book_1_skill = floor(mod(GetMissionData(sceneId,selfId,WUYI_SKILL_A),10^4)/100)
        local WY_Book_2_skill = floor(GetMissionData(sceneId,selfId,WUYI_SKILL_BC)/10^6)
        local WY_Book_3_skill = floor(mod(GetMissionData(sceneId,selfId,WUYI_SKILL_BC),10^4)/100)
        local WY_Book_4_skill = floor(GetMissionData(sceneId,selfId,WUYI_SKILL_DE)/10^6)

        -- [NetCo4 22/10] moi quyen cho rieng (truoc: 1 o WUYI_SKILL_ITEM khoa chung) - tools/voy-bitruyen-22-10.js
        local bayGio = LuaFnGetCurrentTime()

        -- [NetCo4 15/10] Chi chon trong cac cuon DA HOC, giu trong so cu (cuon 1 = 3, cuon 2/3/4 = 1).
        -- Ban cu: trung cuon trong thi gan lai TickStep nhung khong xet lai -> mat luot (hoc it cuon = it ra chieu).
        -- Cuon 4 chi tu phat 10/11 (12 Thong Minh tu phat o XinFa888); cuon 5 (13-15) la chieu tu bam, khong tu phat.
        local skillnum = 0
        local w1, w2, w3, w4 = 0, 0, 0, 0
        if WY_Book_1_skill >= 1 and WY_Book_1_skill <= 3 and GetMissionData(sceneId,selfId,WUYI_SKILL_ITEM) <= bayGio then
           w1 = 3
        end
        if WY_Book_2_skill >= 4 and WY_Book_2_skill <= 6 and GetMissionData(sceneId,selfId,444) <= bayGio then
           w2 = 1
        end
        if WY_Book_3_skill >= 7 and WY_Book_3_skill <= 9 and GetMissionData(sceneId,selfId,445) <= bayGio then
           w3 = 1
        end
        if (WY_Book_4_skill == 10 or WY_Book_4_skill == 11) and GetMissionData(sceneId,selfId,446) <= bayGio then
           w4 = 1
        end
        -- [NetCo4 22/10] quyen 5 (Tuyet Chi Thu) tu phat, server gan thang hieu ung (bam chieu bi do o client) - tools/voy-tramphong-tuphat-22-10.js
        local B5 = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_DE),10000)
        local WY_Book_5_skill = floor(B5/100)
        local WY_Book_5_lev = mod(B5,100)
        local w5 = 0
        if WY_Book_5_skill >= 13 and WY_Book_5_skill <= 15 and WY_Book_5_lev >= 1 and WY_Book_5_lev <= 10 and GetMissionData(sceneId,selfId,455) <= bayGio then
           w5 = 1
        end
        local TickStep = w1 + w2 + w3 + w4 + w5
        if TickStep <= 0 then
           return
        end
        TickStep = random(TickStep)
        if TickStep <= w1 then
           skillnum = WY_Book_1_skill
        elseif TickStep <= w1 + w2 then
           skillnum = WY_Book_2_skill
        elseif TickStep <= w1 + w2 + w3 then
           skillnum = WY_Book_3_skill
        elseif TickStep <= w1 + w2 + w3 + w4 then
           skillnum = WY_Book_4_skill
        else
           local hu = 1570 + (WY_Book_5_skill - 13) * 10 + WY_Book_5_lev - 1
           if WY_Book_5_skill == 13 then
              hu = 1490 + WY_Book_5_lev - 1   -- [NetCo4 22/10] Tram Phong: buff 1570-1579 lam client do -> dung buff Bat Quy cung cap
           end
           if WY_Book_5_skill == 14 then
              local tg = LuaFnGetTargetObjID(sceneId, selfId)
              if tg ~= nil and tg >= 0 and tg ~= selfId and LuaFnIsObjValid(sceneId, tg) == 1 then
                 LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, tg, hu, 0 )
              end
           end
           LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, hu, 0 )
           SetMissionData(sceneId,selfId,455,bayGio+300)
           return
        end

        -- [NetCo4 22/10] server gan THANG buff + ghi thoi gian cho ngay (truoc: client tu dung chieu, quai chet nhanh = mat buff) - tools/voy-ganthang-22-10.js
        if skillnum ~= 0 then
           local vyQ = floor((skillnum + 2) / 3)
           local vyLv = 0
           if vyQ == 1 then
              vyLv = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_A),100)
           elseif vyQ == 2 then
              vyLv = mod(floor(GetMissionData(sceneId,selfId,WUYI_SKILL_BC)/10000),100)
           elseif vyQ == 3 then
              vyLv = mod(GetMissionData(sceneId,selfId,WUYI_SKILL_BC),100)
           else
              vyLv = mod(floor(GetMissionData(sceneId,selfId,WUYI_SKILL_DE)/10000),100)
           end
           if vyLv < 1 or vyLv > 10 then
              return
           end
           local hu = 1450 + (skillnum - 1) * 10 + vyLv - 1
           if skillnum == 2 then
              local tg = LuaFnGetTargetObjID(sceneId, selfId)
              if tg ~= nil and tg >= 0 and tg ~= selfId and LuaFnIsObjValid(sceneId, tg) == 1 and GetHp(sceneId, tg) > 0 then
                 LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, tg, hu, 0 )
              end
           else
              LuaFnSendSpecificImpactToUnit( sceneId, selfId, selfId, selfId, hu, 0 )
           end
           if vyQ == 1 then
              SetMissionData(sceneId,selfId,WUYI_SKILL_ITEM,bayGio+20)
           elseif vyQ == 2 then
              SetMissionData(sceneId,selfId,444,bayGio+300)
           elseif vyQ == 3 then
              SetMissionData(sceneId,selfId,445,bayGio+300)
           else
              SetMissionData(sceneId,selfId,446,bayGio+300)
           end
        end

end

--**********************************
--醒目提示
--**********************************
function x899039_NotifyTip( sceneId, selfId, Msg )
	BeginEvent( sceneId )
		AddText( sceneId, Msg )
	EndEvent( sceneId )
	DispatchMissionTips( sceneId, selfId )
end
