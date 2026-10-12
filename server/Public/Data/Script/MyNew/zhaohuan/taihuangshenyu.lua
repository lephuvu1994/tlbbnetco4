--½Å±¾ºÅ
x100123_g_scriptId = 100123

x100123_g_AllBoss = {508}
--##18ÊÇ³¡¾°ID£¬²Î¿¼SceneInfo.ini

--##ÕâÀïÊÇÏµÍ³¹«¸æ£¬¸ù¾Ý·Ö×éID·¢²¼¹«¸æ£¬Í¬Ò»×éBOSSÖ»·¢²¼Ò»´Î
x100123_g_BossSysMsgByGroupID={}
x100123_g_BossSysMsgByGroupID[1]={Msg="#cFF0000T¥n Hoàng Th¥n Vñc: #cff99ffNgû Hành Tôn Giä giáng lâm Th¥n Vñc, thñc lñc phi phàm! Ai dám ðªn chiêm ngßÞng?#r#YT÷a ðµ [91,193][120,218][229,127][206,92][160,160]",isSended=0}
x100123_g_AllBoss[508]=
{	
	{ ID=42106, GroupId=1, Title="ÎåÐÐ×ðÕß", PosX=91,  PosY=193, BaseAI=21, ExtAIScript=255, ScriptID=100123 },
	{ ID=42107, GroupId=1, Title="ÎåÐÐ×ðÕß", PosX=120,  PosY=218, BaseAI=21, ExtAIScript=255, ScriptID=100123 },
	{ ID=42110, GroupId=1, Title="ÎåÐÐ×ðÕß", PosX=229,  PosY=127, BaseAI=21, ExtAIScript=255, ScriptID=100123 },
	{ ID=42109, GroupId=1, Title="ÎåÐÐ×ðÕß", PosX=206,  PosY=92, BaseAI=21, ExtAIScript=255, ScriptID=100123 },
	{ ID=42108, GroupId=1, Title="ÎåÐÐ×ðÕß", PosX=160,  PosY=160, BaseAI=21, ExtAIScript=255, ScriptID=100123 },
}

--##³¡¾°µØÍ¼Òª¼ÓÒ»¸öNPC£¬À´´¥·¢½Å±¾,Èçyannan_monster.ini£¬scripttimerÊÇ½Å±¾»Øµ÷Ê±¼ä£¬60000Îª60Ãëµ÷ÓÃÒ»´Î½Å±¾
-- [monster142]
-- guid=9913082
-- type=0
-- pos_x=0
-- pos_z=0
-- dir=27
-- script_id=100123
-- respawn_time=1800000
-- base_ai=3
-- scripttimer=60000		
-- group_id=-1
-- team_id=-1
-- patrol_id=-1
-- shop0=-1
-- shop1=-1
-- shop2=-1
-- shop3=-1
-- ReputationID=-1
--**********************************
--Ë¢¹ÖÂß¼­
--**********************************
function x100123_OnCharacterTimer( sceneId, objId, dataId, uTime )
	local nHour	 = GetHour()--Ð¡Ê±
	local nMinute = GetMinute()--·ÖÖÓ
	
	if sceneId==508 then	--##Ðþº£01:20 04:20 07:20 10:20 13:20 16:20 19:20 22:20 
		if (nHour==01 and nMinute==45) or (nHour==05 and nMinute==45) or (nHour==09 and nMinute==45) or (nHour==13 and nMinute==45) or (nHour==17 and nMinute==45) or (nHour==21 and nMinute==45)  then --##21µã°ëºÍ12µã°ëË¢ÑãÄÏµÄ¹Ö
			x100123_CreateMonster( sceneId )	--Ë¢¹Ö
		end
	end
	--AddGlobalCountNews( sceneId, nMinute )
	--È¡ÏûÊ±ÖÓ
	--SetCharacterTimer( sceneId, objId, 0 )
end

--**********************************
--Ë¢BOSS
--**********************************
function x100123_CreateMonster( sceneId )
	--##ÖØÖÃ¹«¸æ±êÊ¶
	--for j,msgData in x100123_g_BossSysMsgByGroupID do 
	--	msgData.isSended=0
	--end
	--Ë¢¹ÖÇ°Èç¹û¹Ö´æÔÚµÄ»°È«²¿Çå¿Õ£¬ÔÙË¢
	for i,data in x100123_g_AllBoss[sceneId] do
		local nMonsterNum = GetMonsterCount(sceneId)
		for i=0, nMonsterNum-1 do
			local MonsterId = GetMonsterObjID(sceneId,i)
			local MosDataID = GetMonsterDataID( sceneId, MonsterId )
			if MosDataID == data.ID then
				--Çå¹Ö
				LuaFnDeleteMonster(sceneId, MonsterId)
			end		
		end
	end
	--Ë¢¹Ö
	for i,data in x100123_g_AllBoss[sceneId] do
		local MstId = LuaFnCreateMonster(sceneId, data.ID, data.PosX, data.PosY, data.BaseAI, data.ExtAIScript, data.ScriptID )
		SetCharacterTitle(sceneId, MstId, data.Title)
		--x100123_SysMsg( sceneId, data.GroupId )
		
		
		
	end
	
	AddGlobalCountNews( sceneId, x100123_g_BossSysMsgByGroupID[1].Msg )

end

--**********************************
--ÏµÍ³¹«¸æ
--**********************************
function x100123_SysMsg( sceneId, groupId )
	if x100123_g_BossSysMsgByGroupID[groupId].isSended==0 then
		--BroadMsgByChatPipe( sceneId, 0, x100123_g_BossSysMsgByGroupID[groupId].Msg, 4 )
		AddGlobalCountNews( sceneId, x100123_g_BossSysMsgByGroupID[groupId].Msg )
		x100123_g_BossSysMsgByGroupID[groupId].isSended=1
	end
end

--**********************************
--¶Ô»°´°¿ÚÐÅÏ¢ÌáÊ¾
--**********************************
function x100123_MsgBox( sceneId, selfId, msg )
	BeginEvent( sceneId )
		AddText( sceneId, msg )
	EndEvent( sceneId )
	DispatchEventList( sceneId, selfId, -1 )
end


--**********************************
--ÐÑÄ¿ÌáÊ¾
--**********************************
function x100123_NotifyTip( sceneId, selfId, Msg )
	BeginEvent( sceneId )
		AddText( sceneId, Msg )
	EndEvent( sceneId )
	DispatchMissionTips( sceneId, selfId )
end

--**********************************
--¹Ø±Õ¶Ô»°¿ò
--**********************************
function x100123_CloseMe(sceneId, selfId)
	BeginUICommand(sceneId)
	EndUICommand(sceneId)
	DispatchUICommand(sceneId,selfId, 1000)
end