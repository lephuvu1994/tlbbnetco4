// 19/10 (chu server): va 3 loi cua Lenh Bai (script 880001 x880001_RL_SetRs, goi duoc thang tu packet - AllowableScriptFunc).
// (1) Khong kiem loai vat pham: idx 1 "len cap Vuong Lenh" lay ma o tui +1 -> phieu KNB 39910001 thanh 39910002;
//     idx 6 "danh nat" nhan MOI mon (rac quai -> 2 Phi Thuy Tam Tinh); UI doi ky nang Lenh Bai cung gui idx 6 -> dap nat Lenh Bai.
//     Sua: idx 1-4 chi nhan Lenh Bai 10158001-10158005, idx 2 vien kham phai la Bao Chau, idx 6 chi nhan Bao Chau 38001000-38001019 (dung nhu client).
// (2) idx 6 xoa do TRUOC khi kiem tien, xoa 2 lan (lan 2 co the trung o vua nhan Phi Thuy). Sua: kiem tien + tui truoc, xoa 1 lan roi moi cong.
// (3) idx 4 thao Bao Chau cap L tra 2L Phi Thuy; nang 1->L ton L(L-1)/2, ma Bao Chau dap nat = 2 -> thao cap 2/3 loi hon dap nat.
//     Sua: tra min(2L, 2 + L(L-1)/2) (chi doi cap 2: 4->3, cap 3: 6->5; cap 1 va >= 4 giu nguyen). Them: tui day thi khong thao (goc: mat Phi Thuy).
// Lua, khong restart. Chay: node tools/lenhbai-va-loi-19-10.js. Rollback: tag truoc-lenhbai-valoi-19-10
const fs = require('fs');
const R = __dirname + '/../';
const p = R + 'server/Public/Data/Script/MyLua/lingpai/LingPaiui.lua';
const M = JSON.parse(fs.readFileSync(R + 'tools/viscii-map.json', 'utf8'));
const vn = (s) => [...s].map((c) => { if (c.charCodeAt(0) < 128) return c; if (M[c] === undefined) throw new Error('khong ma hoa duoc ' + c); return String.fromCharCode(M[c]); }).join('');
let t = fs.readFileSync(p, 'latin1');
if (t.includes('NetCo4_TraPT')) throw new Error('da va roi');
const tb = (s) => 'x880001_NotifyTips(  sceneId,  selfId,  "' + vn(s) + '"  )';
const mot = (re, moi, ten) => { const m = typeof re === 'string' ? (t.includes(re) ? [re] : null) : t.match(re); if (!m || t.split(m[0]).length !== 2) throw new Error('khong thay (dung 1 lan): ' + ten); t = t.replace(m[0], typeof moi === 'function' ? moi(m) : moi); };

// (1) chan loai vat pham ngay dau ham
mot(/local  itmidx  =  LuaFnGetItemTableIndexByIndex\(  sceneId,  selfId,  arg2\)\n/, (m) => m[0] + [
  '-- NetCo4 19/10: chan vat pham sai loai (goc khong kiem: phieu KNB 39910001 -> 39910002, dap nat do bat ky ra Phi Thuy, dap nat ca Lenh Bai)',
  'if  idx  >=  1  and  idx  <=  4  and  (  eqidx  <  10158001  or  eqidx  >  10158005  )  then',
  tb(' Chỉ có thể đặt Lệnh Bài vào '),
  'return',
  'end',
  'if  idx  ==  2  and  x880001_g_Bz[itmidx]  ==  nil  then',
  tb(' Chỉ có thể khảm Bảo Châu '),
  'return',
  'end',
  'if  idx  ==  6  and  (  eqidx  <  38001000  or  eqidx  >  38001019  )  then',
  tb(' Chỉ có thể phá vỡ Bảo Châu '),
  'return',
  'end',
  '',
].join('\n'), 'itmidx');

// (3) thao: 4 khoi tra Phi Thuy
for (const v of ['a', 'b', 'c', 'd']) {
  mot('BeginAddItem(sceneId)\nAddItem(  sceneId,38001021,  ' + v + '*2  )  \nEndAddItem(sceneId,selfId)\nAddItemListToHuman(sceneId,selfId)  \n',
    'if  x880001_NetCo4_TraPT(  sceneId,  selfId,  ' + v + '  )  ~=  1  then  return  end   -- NetCo4 19/10 (goc: tra ' + v + '*2)\n', 'thao ' + v);
}

// (2) danh nat: viet lai ca khoi
mot(/if  idx  ==  6  then[^\n]*\n[\s\S]*?BroadMsgByChatPipe\(  sceneId,  selfId,  str,  4  \)\nend\n/, (m) => {
  if (!m[0].includes('TryRecieveItem(  sceneId,  selfId,38001021,  1)') || (m[0].match(/LuaFnEraseItem/g) || []).length !== 2) throw new Error('khoi idx 6 khong nhu ban goc');
  const bc = m[0].match(/local  str  =  format\([^\n]*/)[0];
  if (!bc.includes('#{_INFOMSG%s2}')) throw new Error('cau thong bao idx 6 khac ban goc');
  return [
    'if  idx  ==  6  then      -- NetCo4 19/10: dap nat Bao Chau -> 2 Phi Thuy Tam Tinh. Kiem tien + tui TRUOC, xoa 1 lan (goc xoa truoc, xoa 2 lan)',
    'if  GetMoneyJZ(sceneId,selfId)  +  GetMoney(sceneId,selfId)  <  100000  then',
    'x880001_NotifyTips(  sceneId,  selfId,    "#G ' + vn('Vàng không đủ') + ' ! "  )',
    'return',
    'end',
    'local  transfer1  =  GetBagItemTransfer(sceneId,selfId,arg1)',
    'BeginAddItem(sceneId)',
    'AddItem(  sceneId,38001021,  2  )',
    'if  EndAddItem(sceneId,selfId)  <=  0  then',
    tb(' Tay nải không đủ chỗ trống '),
    'return',
    'end',
    'local  xoa  =  LuaFnEraseItem(  sceneId,  selfId,  arg1)',
    'if  xoa  ==  nil  or  xoa  <=  0  then',
    'return',
    'end',
    'AddItemListToHuman(sceneId,selfId)',
    'LuaFnCostMoneyWithPriority(  sceneId,  selfId,  100000  );',
    tb(' Phân giải thành công '),
    'LuaFnSendSpecificImpactToUnit(sceneId,  selfId,  selfId,  selfId,18,  0)',
    'local  str  =  format(  "#ccc33cc ' + vn('Chúc mừng ') + '".."#{_INFOUSR%s}#c66ccff ' + vn('đã đem') + ' #{_INFOMSG%s1} ' + vn('phân giải thành 2 Phỉ Thúy Tâm Tinh') + '#H",  GetName(sceneId,selfId),transfer1  )',
    'BroadMsgByChatPipe(  sceneId,  selfId,  str,  4  )',
    'end',
    '',
  ].join('\n');
}, 'idx 6');

// ham tra Phi Thuy khi thao (dat truoc RL_SetRs)
mot(/function  x880001_RL_SetRs\(/, (m) => [
  '-- NetCo4 19/10: thao Bao Chau cap L tra min(2L, 2 + L(L-1)/2) Phi Thuy Tam Tinh: khong bao gio loi hon dap nat (2) + so da ton nang 1->L.',
  '-- Goc tra 2L (cap 2: 4, cap 3: 6). Tui day -> bao, tra ve nil, KHONG thao (goc van thao + tru tien ma khong cong do).',
  'function  x880001_NetCo4_TraPT(  sceneId,  selfId,  lv  )',
  'local  n  =  2*lv',
  'local  tran  =  2  +  lv*(lv-1)/2',
  'if  tran  <  n  then  n  =  tran  end',
  'BeginAddItem(sceneId)',
  'AddItem(  sceneId,38001021,  n  )',
  'if  EndAddItem(sceneId,selfId)  <=  0  then',
  tb(' Tay nải không đủ chỗ trống '),
  'return  nil',
  'end',
  'AddItemListToHuman(sceneId,selfId)',
  'return  1',
  'end',
  '',
  m[0],
].join('\n'), 'RL_SetRs');

fs.writeFileSync(p, t, 'latin1');
console.log('da va ' + p);
