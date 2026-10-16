x402045_g_KillNum = 30

--**********************************
-- 足球死亡
--**********************************
function x402045_OnDie(sceneId, objId, killerId)
	-- [NetCo4 16/10] Tu Vi Linh Phach chuyen sang roithem.txt khoa tuccau (100%, chinh tren web) - bo RoiDo 30% cung o day de khoi roll 2 lan
	-- CallScriptFunction( 950001, "RoiDo", sceneId, objId, killerId, 30600084, 30 )   -- [NetCo4 02/10] moi qua tuc cau: Tu Vi Linh Phach 30% / nguoi (02/10: 50 -> 30 -> 20 -> 25 -> 30) (to doi o gan roll rieng). Boss Ton My My (402040) giu roi goc
	CallScriptFunction( 950001, "RoiCfg", sceneId, objId, killerId, "tuccau" )   -- [NetCo4 14/10] moi quai Tuc Cau: roi them theo roithem.txt khoa tuccau (Li Hoa 30%), chung voi boss
	
	local szName = GetName(sceneId, objId)

	if szName == "Song song y猲"  or
			szName == "Uy阯 呓ng qu鋓"  or
			szName == "V鈔 ngo読 phi陁"  or
			szName == "M鉵 thi阯 tinh"  or
			
			szName == "Song song y猲 y猲"  or
			szName == "Uy阯 呓ng qu鋓 qu鋓"  or
			szName == "V鈔 ngo読 phi陁 phi陁"     then
			
		local nKillNum = LuaFnGetCopySceneData_Param(sceneId, x402045_g_KillNum)
		nKillNum = nKillNum + 1
		local str = "秀 gi猼 ch猼 t鷆 c: " .. tostring(nKillNum) .. "/149"
		x402045_TipAllHuman(sceneId, str)
		LuaFnSetCopySceneData_Param(sceneId, x402045_g_KillNum, nKillNum)
	end
end

--**********************************
--提示所有副本内玩家
--**********************************
function x402045_TipAllHuman( sceneId, Str )
	-- 获得场景里头的所有人
	local nHumanNum = LuaFnGetCopyScene_HumanCount(sceneId)
	-- 没有人的场景，什么都不做
	if nHumanNum < 1 then
		return
	end
	for i=0, nHumanNum-1  do
		local PlayerId = LuaFnGetCopyScene_HumanObjId(sceneId, i)
		BeginEvent(sceneId)
			AddText(sceneId, Str)
		EndEvent(sceneId)
		DispatchMissionTips(sceneId, PlayerId)
	end
end

