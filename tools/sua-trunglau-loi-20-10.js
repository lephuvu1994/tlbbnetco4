// 20/10: 3 loi tim thay khi ra soat chuc nang Trung Lau (agent doc client + server):
//  1. NHAN DOI DO - wuyazi85o.lua (895111) nang Chan (tepp 36) + tay Chan (tepp 23): tru nguyen lieu + TryRecieveItem mon MOI
//     TRUOC, roi x895111_SHANG_BAOS moi chuyen ngoc + xoa mon CU. SHANG_BAOS THOAT SOM (khong xoa mon cu) khi mon cu co ngoc
//     va tui nguyen lieu < 2 o + tui dao cu < 2 o (sau khi nhan mon moi). Cong vao chi doi >= 2 o dao cu -> con 1 -> giu ca 2 mon.
//     Sua: kiem dung dieu kien do TRUOC khi tru / phat (x895111_DuChoNgoc): co ngoc thi can >= 2 o nguyen lieu hoac >= 3 o dao cu.
//     Sau khi chay tool: them 1 lan kiem nua o DAU x895111_WuhunMagicUp (ngay sau kiem "< 2 o dao cu") de phu MOI nhanh tepp khac
//     (than khi... deu phat mon moi truoc roi SHANG_BAOS - 9 cho) - xem git diff commit nay. SHANG_BAOS ban sao trong file khac
//     (diaowen, longwennew, OnLogonStr, doidanhhieu, guigu, paodian) CHUA ra soat.
//  2. ShuaXinClient.lua (892002 AHa_ReMyBuff, buff theo mon dang mac): 10553113 -> 7509, 10553114 -> 7501 (hieu ung NGUOI CHOI,
//     cung nhom loai tru voi 7583 / 7587) -> doi 7583 / 7587 cho khop EquipBase (tools/trung-admin-20-10.js).
//  3. MyNew/doidanhhieu.lua (111997): nhanh GetNumText() == 102 phat FREE 10422016 + 10423024 + do khac, dong menu da comment
//     nhung nhanh van chay neu client sua gui so 102 -> tat (-102 khong bao gio khop).
// File latin1 (VISCII), giu CR. Lua -> cap-nhat.sh, KHONG can restart. Rollback: tag truoc-sua-trunglau-loi-20-10.
//   node tools/sua-trunglau-loi-20-10.js [--ghi]
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', 'server', 'Public', 'Data', 'Script');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const v = (t) => [...t.normalize('NFC')].map((ch) => { if (ch.charCodeAt(0) < 128) return ch; const b = VMAP[ch]; if (b === undefined) { console.log('LOI VISCII thieu ' + ch); loi++; return '?'; } return String.fromCharCode(b); }).join('');
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const eolTai = (s, i) => (s[s.indexOf('\n', i) - 1] === '\r' ? '\r\n' : '\n');
const mot = (s, a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { console.log('LOI ' + ten + ': ' + n + ' cho'); loi++; return s; } return s.replace(a, b); };
const ra = {};

// 1. wuyazi85o
{
  const f = 'MyLua/shenqinew/wuyazi85o.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1'); let s = goc;
  const msg = v('Trang bị có bảo thạch: cần trống 2 ô Nguyên Liệu hoặc 3 ô Đạo Cụ');
  // tepp 36: truoc dong kiem 250 Thien Dia Huyen Tinh
  const a36 = 'if LuaFnGetAvailableItemCount(sceneId, selfId, 39901012) < 250 then';
  const i36 = s.indexOf(a36); const E = eolTai(s, i36 < 0 ? 0 : i36);
  s = mot(s, a36, 'if x895111_DuChoNgoc( sceneId, selfId, equipitm ) ~= 1 then   -- [NetCo4 20/10] chong nhan doi do (tools/sua-trunglau-loi-20-10.js)' + E + 'return' + E + 'end' + E + a36, 'tepp36');
  // tepp 23: truoc CostCheak MoXueShi
  const a23 = '        local ret = x895111_CostCheak( sceneId, selfId, x895111_MoXueShi,1,1000000 ) ';
  s = mot(s, a23, '        if x895111_DuChoNgoc( sceneId, selfId, equipitm ) ~= 1 then   -- [NetCo4 20/10] chong nhan doi do' + E + '           return' + E + '        end' + E + a23, 'tepp23');
  // ham kiem: dat ngay truoc function x895111_SHANG_BAOS
  const aF = 'function x895111_SHANG_BAOS(sceneId, selfId,pos,pos1)';
  s = mot(s, aF, [
    '-- [NetCo4 20/10] SHANG_BAOS thoat som (KHONG xoa mon cu) khi mon cu co ngoc + tui nguyen lieu < 2 + tui dao cu < 2 SAU khi nhan mon moi',
    '-- -> kiem truoc khi tru nguyen lieu / phat mon moi (mon moi chiem 1 o dao cu => can >= 3 o dao cu neu tui nguyen lieu < 2).',
    'function x895111_DuChoNgoc( sceneId, selfId, pos )',
    '\tif GetGemEmbededCount( sceneId, selfId, pos ) > 0 and LuaFnGetMaterialBagSpace( sceneId, selfId ) < 2 and LuaFnGetPropertyBagSpace( sceneId, selfId ) < 3 then',
    '\t\tx895111_NotifyTips( sceneId, selfId, "' + msg + '" )',
    '\t\treturn 0',
    '\tend',
    '\treturn 1',
    'end',
    '',
  ].join(E) + E + aF, 'SHANG_BAOS');
  if (cao(s) !== cao(goc) + cao(msg)) { console.log('LOI lech byte wuyazi85o'); loi++; }
  ra[f] = s; console.log(f + ': x895111_DuChoNgoc truoc tepp 36 + tepp 23');
}
// 2. ShuaXinClient
{
  const f = 'MyLua/ShuaXinClient.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1'); let s = goc;
  s = mot(s, 'g_x892002_CC2[10553113]=7509', 'g_x892002_CC2[10553113]=7583', 'CC2 113');
  s = mot(s, 'g_x892002_CC3[10553114]=7501', 'g_x892002_CC3[10553114]=7587', 'CC3 114');
  if (cao(s) !== cao(goc)) { console.log('LOI lech byte ShuaXinClient'); loi++; }
  ra[f] = s; console.log(f + ': 10553113 -> 7583, 10553114 -> 7587');
}
// 3. doidanhhieu
{
  const f = 'MyNew/doidanhhieu.lua'; const goc = fs.readFileSync(path.join(S, f), 'latin1');
  const s = mot(goc, '\telseif GetNumText() == 102 then', '\telseif GetNumText() == -102 then   -- [NetCo4 20/10] tat: phat free 10422016 + 10423024 (menu da an, client sua van goi duoc)', 'doidanhhieu 102');
  ra[f] = s; console.log(f + ': tat nhanh 102');
}
if (loi) process.exit(1);
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
for (const [f, s] of Object.entries(ra)) fs.writeFileSync(path.join(S, f), s, 'latin1');
console.log('DA GHI');
