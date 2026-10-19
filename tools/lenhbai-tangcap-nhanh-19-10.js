// 19/10 (chu server): Tu Tuong Bao Chau (Lenh Bai, script 880001 x880001_RL_SetRs idx 3 = "Tang cap Bao Chau").
// Goc: moi lan bam chi len 1 cap. Sua: bam 1 lan = len lien toi cap 9 (tran goc "> 8 thi Du") hoac toi khi het Phi Thuy Tam Tinh / vang.
// Gia moi cap GIU NHU GOC: cap L -> L+1 ton L vien Phi Thuy Tam Tinh (38001021) + 100000 (10 vang). Tru 1 lan tong so.
// Them: o chua kham (cap 0) bi chan. Client khong doi (chi gui idx 3 + o 0..3). Lua, khong restart.
// Chay: node tools/lenhbai-tangcap-nhanh-19-10.js. Rollback: tag truoc-lenhbai-nhanh-19-10
const fs = require('fs');
const R = __dirname + '/../';
const p = R + 'server/Public/Data/Script/MyLua/lingpai/LingPaiui.lua';
const M = JSON.parse(fs.readFileSync(R + 'tools/viscii-map.json', 'utf8'));
const vn = (s) => [...s].map((c) => { if (c.charCodeAt(0) < 128) return c; if (M[c] === undefined) throw new Error('khong ma hoa duoc ' + c); return String.fromCharCode(M[c]); }).join('');
const t = fs.readFileSync(p, 'latin1');
if (t.includes('NetCo4 19/10: bam Thang cap')) throw new Error('da va roi');
const L = t.split('\n');
// khoi can thay: tu "if  bq  ==  1  then" (sau check "if  bq  ==0  then  return  end") cua nhanh idx 3 toi "end" truoc 2 dong trong + "end" + "if  idx  ==  4"
const i3 = L.findIndex((l) => /^if\s+idx\s+==3\s+then/.test(l));
const i4 = L.findIndex((l) => /^if\s+idx\s+==\s+4\s+then/.test(l));
if (i3 < 0 || i4 < 0 || i4 < i3) throw new Error('khong thay nhanh idx 3/4');
let a = -1;
for (let i = i3; i < i4; i++) if (/^if\s+bq\s+==\s+1\s+then/.test(L[i])) { a = i; break; }
let b = -1;
for (let i = i4 - 1; i > a; i--) if (/^end\s*$/.test(L[i].replace(/\t/g, ' '))) { b = i; break; }   // "end" dong ham idx 3
let c = -1;
for (let i = b - 1; i > a; i--) if (/^end/.test(L[i])) { c = i; break; }   // "end" dong "if bq == 1"
if (a < 0 || c < 0) throw new Error('khong thay khoi bq==1');
const khoi = L.slice(a, c + 1).join('\n');
if (!khoi.includes('x880001_LPQXX') || (khoi.match(/LuaFnDelAvailableItem/g) || []).length !== 4 || !khoi.includes('LuaFnSetItemCreator')) throw new Error('khoi khong dung nhu ban goc');
const tb = (s) => 'x880001_NotifyTips(  sceneId,  selfId,  ' + s + '  )';
const moi = [
  'if  bq  ==  1  then',
  '-- NetCo4 19/10: bam Thang cap 1 lan = len lien toi cap 9 hoac toi khi het Phi Thuy Tam Tinh / vang.',
  '-- Gia moi cap nhu goc: cap L -> L+1 ton L Phi Thuy Tam Tinh + 100000. Ban goc: tag truoc-lenhbai-nhanh-19-10',
  'local  a,b,c,d  =  x880001_LPQXX(sceneId,selfId,Lingpai1)',
  'if  arg2  ==  nil  or  arg2  <  0  or  arg2  >  3  then  return  end',
  'local  dsc  =  {a,b,c,d}',
  'local  cap  =  dsc[arg2+1]',
  'if  cap  ==  nil  or  cap  <  1  then',
  tb('"' + vn(' Ô này chưa khảm Bảo Châu ') + '"'),
  'return',
  'end',
  'if  cap  >  8  then',
  tb('"' + vn(' Đủ ') + '"'),
  'return',
  'end',
  'local  co  =  LuaFnGetAvailableItemCount(sceneId,  selfId,  38001021)',
  'local  len  =  cap',
  'local  ton  =  0',
  'while  len  <=  8  and  co  >=  ton  +  len  and  nMoneySelf  >=  100000*(len-cap+1)  do',
  '\tton  =  ton  +  len',
  '\tlen  =  len  +  1',
  'end',
  'if  len  ==  cap  then',
  'if  co  <  cap  then',
  tb('"' + vn(' Nhà ngươi phải có ') + '"..cap.."' + vn(' Phỉ Thúy Tâm Tinh ta mới có thể giúp ngươi thăng cấp ') + '"'),
  'end',
  'return',
  'end',
  'if  LuaFnDelAvailableItem(sceneId,  selfId,  38001021,  ton)  ==  0  then',
  tb('"' + vn(' Nhà ngươi phải có ') + '"..ton.."' + vn(' Phỉ Thúy Tâm Tinh ta mới có thể giúp ngươi thăng cấp ') + '"'),
  'return',
  'end',
  'local  vt  =  2*arg2+1',
  'friendName  =gsub(Lingpai1,"(LP"..strrep("%w",vt)..")%d("..strrep("%w",15-vt)..")","%1"..(len).."%2")',
  'LuaFnCostMoneyWithPriority(  sceneId,  selfId,  100000*(len-cap)  );',
  'LuaFnSetItemCreator(  sceneId,  selfId,  arg1,  friendName  )',
  'LuaFnRefreshItemInfo(  sceneId,  selfId,  arg1  )',
  tb('"' + vn(' Cường hóa thành công: cấp ') + '"..cap.."' + vn(' lên cấp ') + '"..len.."' + vn(', tiêu hao ') + '"..ton.."' + vn(' Phỉ Thúy Tâm Tinh và ') + '"..(10*(len-cap)).."' + vn(' vàng ') + '"'),
  'LuaFnSendSpecificImpactToUnit(sceneId,  selfId,  selfId,  selfId,18,  0)',
  'end',
];
const o = L.slice(0, a).concat(moi, L.slice(c + 1)).join('\n');
fs.writeFileSync(p, o, 'latin1');
console.log('thay dong ' + (a + 1) + '-' + (c + 1) + ' (' + (c - a + 1) + ' dong) bang ' + moi.length + ' dong');
