-- 300068 Vien +10 diem (25/10: 5 -> 10, chu server) tiem nang tu do (NetCo4 18/10). Vat pham 30103041 Thuong Lang Bach Loc Hoan, chi admin phat.
-- Luong skill-like (giong Tien Dan 333007): OnDeplete tru dung 1 vien trong o chong; 25/10 OnActivateOnce an not phan con lai trong tui.

x300068_g_scriptId = 300068
x300068_g_ItemId = 30103041
x300068_g_Diem = 10

function x300068_OnDefaultEvent( sceneId, selfId, bagIndex )
end

function x300068_IsSkillLikeScript( sceneId, selfId )
	return 1
end

function x300068_CancelImpacts( sceneId, selfId )
	return 0
end

function x300068_OnConditionCheck( sceneId, selfId )
	if LuaFnVerifyUsedItem( sceneId, selfId ) ~= 1 then
		return 0
	end
	if LuaFnGetItemIndexOfUsedItem( sceneId, selfId ) ~= x300068_g_ItemId then
		return 0
	end
	return 1
end

function x300068_OnDeplete( sceneId, selfId )
	if LuaFnDepletingUsedItem( sceneId, selfId ) > 0 then
		return 1
	end
	return 0
end

function x300068_OnActivateOnce( sceneId, selfId )
	-- [NetCo4 25/10] chu server: chuot phai 1 vien = an HET vien cung loai trong tui (nhu Duoc Tran 889904). OnDeplete da tru 1 vien.
	local so = 1
	local conlai = LuaFnGetAvailableItemCount( sceneId, selfId, x300068_g_ItemId )
	if conlai ~= nil and conlai > 0 and LuaFnDelAvailableItem( sceneId, selfId, x300068_g_ItemId, conlai ) == 1 then
		so = 1 + conlai
	end
	local RemainPoint = GetPlayerRemainPoints( sceneId, selfId )
	SetPlayerRemainPoints( sceneId, selfId, RemainPoint + x300068_g_Diem * so )
	AuditRunHunDan( sceneId, selfId, x300068_g_ItemId )
	BeginEvent( sceneId )
		AddText( sceneId, "Các hÕ ðã dùng "..so.." viên, nh§n ðßþc "..( x300068_g_Diem * so ).." ði¬m tìm nång." )
	EndEvent( sceneId )
	DispatchMissionTips( sceneId, selfId )
	return 1
end

function x300068_OnActivateEachTick( sceneId, selfId )
	return 1
end
