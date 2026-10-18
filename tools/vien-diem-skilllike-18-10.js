// 18/10: viet lai script 300068 (obj/item/Runhundan.lua, vien +5 diem 30103041) theo luong "skill-like" giong Tien Dan 333007 /
// Hoan Dong Dan 300100: OnConditionCheck (LuaFnVerifyUsedItem + dung ma) -> OnDeplete (LuaFnDepletingUsedItem = tru DUNG 1 vien
// trong o chong) -> OnActivateOnce (+5 diem tu do). Ban cu dung OnDefaultEvent + EraseItem(o tui) = xoa CA O -> khi cho chong 250
// (tools/vien-diem-chong-18-10.js) dung 1 vien se mat ca chong. Giu nguyen cau bao VISCII "... 5 diem tiem nang." cua ban cu.
// Lua, can cap-nhat (khong restart cho rieng file nay; ItemRule/chong can RESTART). Rollback: tag truoc-vien-diem-chong-18-10
const fs = require('fs');
const p = __dirname + '/../server/Public/Data/Script/obj/item/Runhundan.lua';
const t = fs.readFileSync(p, 'latin1');
if (!/EraseItem/.test(t)) throw new Error('khong thay EraseItem (da chay roi?)');
const m = t.match(/AddText\( sceneId, ("[^"\n]* 5 [^"\n]*") \)/);
if (!m) throw new Error('khong thay cau bao " 5 "');
const msg = m[1];
const o = [
  '-- 300068 Vien +5 diem tiem nang tu do (NetCo4 18/10). Vat pham 30103041 Thuong Lang Bach Loc Hoan, chi admin phat.',
  '-- Luong skill-like (giong Tien Dan 333007): OnDeplete tru dung 1 vien trong o chong.',
  '',
  'x300068_g_scriptId = 300068',
  'x300068_g_ItemId = 30103041',
  'x300068_g_Diem = 5',
  '',
  'function x300068_OnDefaultEvent( sceneId, selfId, bagIndex )',
  'end',
  '',
  'function x300068_IsSkillLikeScript( sceneId, selfId )',
  '\treturn 1',
  'end',
  '',
  'function x300068_CancelImpacts( sceneId, selfId )',
  '\treturn 0',
  'end',
  '',
  'function x300068_OnConditionCheck( sceneId, selfId )',
  '\tif LuaFnVerifyUsedItem( sceneId, selfId ) ~= 1 then',
  '\t\treturn 0',
  '\tend',
  '\tif LuaFnGetItemIndexOfUsedItem( sceneId, selfId ) ~= x300068_g_ItemId then',
  '\t\treturn 0',
  '\tend',
  '\treturn 1',
  'end',
  '',
  'function x300068_OnDeplete( sceneId, selfId )',
  '\tif LuaFnDepletingUsedItem( sceneId, selfId ) > 0 then',
  '\t\treturn 1',
  '\tend',
  '\treturn 0',
  'end',
  '',
  'function x300068_OnActivateOnce( sceneId, selfId )',
  '\tlocal RemainPoint = GetPlayerRemainPoints( sceneId, selfId )',
  '\tSetPlayerRemainPoints( sceneId, selfId, RemainPoint + x300068_g_Diem )',
  '\tAuditRunHunDan( sceneId, selfId, x300068_g_ItemId )',
  '\tBeginEvent( sceneId )',
  '\t\tAddText( sceneId, ' + msg + ' )',
  '\tEndEvent( sceneId )',
  '\tDispatchMissionTips( sceneId, selfId )',
  '\treturn 1',
  'end',
  '',
  'function x300068_OnActivateEachTick( sceneId, selfId )',
  '\treturn 1',
  'end',
  '',
].join('\n');
fs.writeFileSync(p, o, 'latin1');
console.log('da viet lai Runhundan.lua (skill-like), cau bao giu ' + [...msg].filter((c) => c.charCodeAt(0) > 127).length + ' byte VISCII');
