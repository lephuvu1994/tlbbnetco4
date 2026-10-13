
-- [NetCo4 13/10] He so Vo Y: Server/txt/NetCo4Cfg/voy.txt = "<moi noi> <ban do train>" (panel GM - Cai dat toan server, 1-100).
-- Doc moi lan quai chet (hieu luc ngay). Khong co file / so sai = 4 moi noi, 12 them o Vo Luong Son (6 / 73 / 74) + Thap Khac Lap Ma Can (427).
function x999998_HeSo()
	local a, b = 4, 12
	local h = openfile( "./txt/NetCo4Cfg/voy.txt", "r" )
	if h == nil then
		return a, b
	end
	local s = read( h, "*l" )
	closefile( h )
	local _, _, x, y = strfind( s or "", "^%s*(%d+)%s+(%d+)" )
	x = tonumber( x or "" )
	y = tonumber( y or "" )
	if x ~= nil and x >= 1 and x <= 100 then a = x end
	if y ~= nil and y >= 1 and y <= 100 then b = y end
	return a, b
end
function x999998_OnDie( sceneId, selfId, killerId )
	if LuaFnIsObjValid( sceneId, killerId ) ~= 1  then
		return
	end
        local GuaiLev = GetLevel(sceneId, selfId) --怪物等级
        local VoyA, VoyB = x999998_HeSo()   -- [NetCo4 13/10] he so tu web admin (voy.txt); mac dinh 4 / 12 (30/09: x4, 09/10 + 11/10: x12 ban do train)
        local Neixi = (770 + GuaiLev*10) * VoyA  -- goc: 770 + GuaiLev*10
        if sceneId == 6 or sceneId == 73 or sceneId == 74 or sceneId == 427 then Neixi = Neixi * VoyB end   -- [11/10] + 427 Thap Khac Lap Ma Can (goi tu roimap 950001)   -- [NetCo4 09/10] Vo Luong Son tong x48 noi tuc (chu server; 05/10 la x3 = tong x12): 37.440-41.760/con; noi khac giu x4
	---宠物则获取其主人的名字
	local playerID = killerId
	local objType = GetCharacterType( sceneId, killerId )
	if objType == 3 then
		playerID = GetPetCreator( sceneId, killerId )
	end

	if LuaFnHasTeam(sceneId,playerID) == 1  then
		local nPlayerNum = GetNearTeamCount(sceneId,playerID)
		if nPlayerNum >=1 then
			for i=0, nPlayerNum-1  do
				local nPlayerId = GetNearTeamMember(sceneId,playerID, i)
                                CallScriptFunction(2015,"WuyiExpUp",sceneId,nPlayerId,Neixi)


			end
		end
        else
        CallScriptFunction(2015,"WuyiExpUp",sceneId,playerID,Neixi)
	end
end
