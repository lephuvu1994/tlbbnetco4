-- NetCo4 07/10: Lua AI cua DOI BOT 6 "nguoi gia" o Hau Hoa Vien (scene 62/82/182). Script 950002, gan qua script_id trong
-- Public/Scene/newbie_2_monster.ini; base_ai 21 (co Lua ext) -> engine goi OnInit / OnHeartBeat / OnEnterCombat / OnLeaveCombat / OnDie.
-- Danh dam, goi dong bon, hoi mau ban than: file .ai 346-349. File nay chi lo viec AI thuong KHONG lam duoc:
--   Nga My (2068) moi nhip tim dong doi (quai ID trong x950002_g_Bot) mau thap nhat -> cast Thanh Tam Pho Thien Chu (SkillData 2008, bac 12)
--   len dong doi do; >= 2 dong doi duoi nguong nhom -> Phat Quang Pho Chieu (1792, hoi nhom 7m) len ban than.
-- Khung copy tu event/bingshen/ai_hadaba.lua (boss Bang Than). Toan ASCII. Sinh bang tools/botdoi-07-10.js (bang, ini, .ai).
-- Nga My: cast chieu QUAI tri lieu (hieu ung) + SetHp cong mau that cho dong doi (quai khong cast chieu than thien len quai khac duoc).

x950002_g_ScriptId = 950002

-- 07/10 khuya: ma moi 64601-64606 bi TANG HINH (client khong co trong bang quai cua no) -> dung DataID co san, mac do dung phai:
-- 2068 Nga My, 2048 + 2198 Cai Bang, 2108 Tieu Dao, 2028 + 2178 Thieu Lam (xem tools/botdoi-07-10.js)
x950002_g_Bot = { 2068, 2048, 2198, 2108, 2028, 2178 }
x950002_g_SoBot = 6
x950002_g_NgaMy = 2068

-- 07/10 khuya: chieu NGUOI CHOI (2008 / 1792) quai khong dung duoc (doi vu khi + tam phap) -> dung chieu QUAI tri lieu de co hieu ung
-- (594 Bach Thao Tien Lo, 589 Linh Chi Cuu Chuyen - chi hoi ban than) + cong mau THAT cho dong doi bang SetHp.
x950002_g_HoiDon = 422         -- Thanh Tam Pho Thien Chu (chieu Nga My that, ma mau) nham vao dong doi
x950002_g_HoiNhom = 406        -- Phat Quang Pho Chieu (chieu Nga My that, hoi nhom quanh minh)
x950002_g_PhanDon = 0.15       -- hoi don: +15% mau toi da cua dong doi yeu nhat
x950002_g_PhanNhom = 0.10      -- hoi nhom: +10% mau toi da cho moi bot duoi nguong nhom
x950002_g_NguongDon = 0.65     -- dong doi duoi 65% mau -> hoi don
x950002_g_NguongNhom = 0.5     -- >= 2 dong doi duoi 50% -> hoi nhom
x950002_g_CD_Hoi = 3000        -- ms giua 2 lan hoi
x950002_g_CD_Nghi = 1000       -- ms quet lai khi khong ai can hoi

-- o nho cua MonsterAI (int): 1 = CD hoi mau con lai (ms)
x950002_IDX_CD = 1

function x950002_LaBot( dataId )
	local i
	for i = 1, x950002_g_SoBot do
		if x950002_g_Bot[i] == dataId then
			return 1
		end
	end
	return 0
end

function x950002_OnInit( sceneId, selfId )
	MonsterAI_SetIntParamByIndex( sceneId, selfId, x950002_IDX_CD, 0 )
end

function x950002_OnEnterCombat( sceneId, selfId, enemyId )
end

function x950002_OnLeaveCombat( sceneId, selfId )
	MonsterAI_SetIntParamByIndex( sceneId, selfId, x950002_IDX_CD, 0 )
end

function x950002_OnKillCharacter( sceneId, selfId, targetId )
end

function x950002_OnDie( sceneId, selfId, killerId )
	MonsterAI_SetIntParamByIndex( sceneId, selfId, x950002_IDX_CD, 0 )
end

-- tim dong doi (bot khac, con song) mau thap nhat; tra ve objId, ti le mau, so dong doi duoi nguong nhom
function x950002_TimYeuNhat( sceneId, selfId )
	local best = -1
	local bestP = 2
	local soYeu = 0
	local n = GetMonsterCount( sceneId )
	local i
	for i = 0, n - 1 do
		local id = GetMonsterObjID( sceneId, i )
		if id ~= -1 and x950002_LaBot( GetMonsterDataID( sceneId, id ) ) == 1 and LuaFnIsCharacterLiving( sceneId, id ) == 1 then
			local mx = GetMaxHp( sceneId, id )
			if mx > 0 then
				local p = GetHp( sceneId, id ) / mx
				if p < bestP then
					bestP = p
					best = id
				end
				if p < x950002_g_NguongNhom then
					soYeu = soYeu + 1
				end
			end
		end
	end
	return best, bestP, soYeu
end

-- cong phan * mau toi da cho 1 bot (khong vuot toi da)
function x950002_CongMau( sceneId, id, phan )
	local mx = GetMaxHp( sceneId, id )
	local hp = GetHp( sceneId, id ) + floor( mx * phan )
	if hp > mx then
		hp = mx
	end
	SetHp( sceneId, id, hp )
end

-- hoi nhom: moi bot con song duoi nguong nhom +PhanNhom
function x950002_HoiNhom( sceneId )
	local n = GetMonsterCount( sceneId )
	local i
	for i = 0, n - 1 do
		local id = GetMonsterObjID( sceneId, i )
		if id ~= -1 and x950002_LaBot( GetMonsterDataID( sceneId, id ) ) == 1 and LuaFnIsCharacterLiving( sceneId, id ) == 1 then
			local mx = GetMaxHp( sceneId, id )
			if mx > 0 and GetHp( sceneId, id ) / mx < x950002_g_NguongNhom then
				x950002_CongMau( sceneId, id, x950002_g_PhanNhom )
			end
		end
	end
end

function x950002_OnHeartBeat( sceneId, selfId, nTick )
	if LuaFnIsCharacterLiving( sceneId, selfId ) ~= 1 then
		return
	end
	if GetMonsterDataID( sceneId, selfId ) ~= x950002_g_NgaMy then
		return
	end
	local cd = MonsterAI_GetIntParamByIndex( sceneId, selfId, x950002_IDX_CD )
	if cd > nTick then
		MonsterAI_SetIntParamByIndex( sceneId, selfId, x950002_IDX_CD, cd - nTick )
		return
	end
	local best, bestP, soYeu = x950002_TimYeuNhat( sceneId, selfId )
	if best == -1 or bestP >= x950002_g_NguongDon then
		MonsterAI_SetIntParamByIndex( sceneId, selfId, x950002_IDX_CD, x950002_g_CD_Nghi )
		return
	end
	local x, z = GetWorldPos( sceneId, selfId )
	if soYeu >= 2 then
		LuaFnUnitUseSkill( sceneId, selfId, x950002_g_HoiNhom, selfId, x, z, 0, 1 )
		x950002_HoiNhom( sceneId )
	else
		LuaFnUnitUseSkill( sceneId, selfId, x950002_g_HoiDon, best, x, z, 0, 1 )
		x950002_CongMau( sceneId, best, x950002_g_PhanDon )
	end
	MonsterAI_SetIntParamByIndex( sceneId, selfId, x950002_IDX_CD, x950002_g_CD_Hoi )
end
