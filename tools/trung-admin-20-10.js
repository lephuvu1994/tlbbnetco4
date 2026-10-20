// 20/10 (chu server): TRUNG LAU ADMIN - chi admin phat / gift code, giao dich duoc (nhu 10422016 / 10423024), custom rieng.
//   Gioi admin: 10553113 = ban thuong, 10422018 = ban "Chan" gia (ten game van "Trung Lau Gioi", chi so manh hon)
//   Ngoc admin: 10553114 = ban thuong, 10423025 = ban Chan that ("Chan-Trung Lau Ngoc", da custom rieng tu 14/10)
//   10423026 (Ngoc cu khoa) bo khong dung: chi admin / gift code, khong nang.
//  1. EquipBase cot 7 (ItemRule) 3 -> 1 cho 4 ma admin: giao dich duoc, mac vao KHONG khoa (chi khoa khi dap vat pham co dinh).
//     Cot 19 (hieu ung than khi) tach rieng: 10553113 7509 -> 7583, 10422018 5952 -> 7585, 10553114 7501 -> 7587 (10423025 da rieng 5965).
//  2. StandardImpact 7583-7588 = chep 7509/7510, 5952/5954, 7501/7502 (hieu ung + hieu ung con), chen sau 7582 (dong sau la 7917).
//     Giu nguyen nhom loai tru (cot 7) nhu ban goc -> deo cung luc nhan nguoi choi + nhan admin van khong cong don (nhu truoc).
//  3. Chan nguon ra / duong nang:
//     - wuyazi85o.lua (895111, nang Chan o Tuyet Phi Phi): 10553113 / 10553114 / 10422018 / 10423026 khong nang duoc.
//     - ShopTable.txt ke 213 (Chi Ton Cua Hang, client khong co tab mo): 10553113 / 10553114 -> o trong (0).
//     - New/sanshen/boss1-3.lua: danh sach chonglouItem chi dung cho LOA bao (dong roi do da comment) -> bo 113 / 114.
//     - obj/dali/odali_zhufugui.lua: x002102_g_ChongLou (code chet, random(10000) >= 10001) -> bo 113 / 114.
//     Da kiem 20/10: database.json bot (shop web, Ruong Ich Ky, vong quay) khong co 4 ma; Trade.lua / DBShop.lua / 0,1wuyazi85o.lua khong nam trong Script.dat.
// File latin1 (VISCII/GBK), giu CR. Hieu luc sau cap-nhat.sh + restart game. Rollback: tag truoc-trung-admin-20-10.
//   node tools/trung-admin-20-10.js [--ghi]
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'server'); const GHI = process.argv.includes('--ghi'); let loi = 0;
const doc = (f) => fs.readFileSync(path.join(R, f), 'latin1');
const cao = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };
const ra = {};   // f -> noi dung moi
const bao = (m) => { console.log('LOI ' + m); loi++; };
const mot = (s, a, b, ten) => { const n = s.split(a).length - 1; if (n !== 1) { bao(ten + ': ' + n + ' cho'); return s; } return s.replace(a, b); };
const VMAP = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const viscii = (t) => [...t.normalize('NFC')].map((ch) => { if (ch.charCodeAt(0) < 128) return ch; const b = VMAP[ch]; if (b === undefined) { bao('VISCII thieu ' + ch); return '?'; } return String.fromCharCode(b); }).join('');

// 1. EquipBase
{
  const f = 'Public/Config/EquipBase.txt'; const goc = doc(f); const L = goc.split('\n');
  const DOI = [['10553113', '3', '7509', '7583'], ['10422018', '3', '5952', '7585'], ['10553114', '3', '7501', '7587'], ['10423025', '3', '5965', null]];
  for (const [id, rule, hu, huMoi] of DOI) {
    const i = L.findIndex((l) => l.startsWith(id + '\t'));
    if (i < 0) { bao('EquipBase khong co ' + id); continue; }
    const cr = L[i].endsWith('\r') ? '\r' : ''; const c = L[i].replace(/\r$/, '').split('\t');
    if (c[7] !== rule || c[19] !== hu) { bao('EquipBase ' + id + ' khac mong doi: rule ' + c[7] + ' hu ' + c[19]); continue; }
    c[7] = '1'; if (huMoi) c[19] = huMoi;
    L[i] = c.join('\t') + cr;
    console.log('EquipBase ' + id + ': rule 3 -> 1 (giao dich duoc)' + (huMoi ? ', hieu ung ' + hu + ' -> ' + huMoi : ''));
  }
  const moi = L.join('\n'); if (cao(moi) !== cao(goc)) bao('EquipBase lech byte');
  ra[f] = moi;
}
// 2. StandardImpact 7583-7588
{
  const f = 'Server/Config/StandardImpact.txt'; const goc = doc(f); const L = goc.split('\n');
  const id = (l) => (/^\d+\t/.test(l) ? +l.split('\t')[0] : NaN);
  const dong = (h) => L.find((l) => id(l) === h);
  const CHEP = [[7509, 7510, 7583, 7584], [5952, 5954, 7585, 7586], [7501, 7502, 7587, 7588]];
  for (const [, , a, b] of CHEP) for (const x of [a, b]) if (dong(x)) bao('StandardImpact da co ' + x);
  const i0 = L.findIndex((l) => id(l) === 7582);
  if (i0 < 0 || id(L[i0 + 1]) !== 7917) bao('StandardImpact: dong sau 7582 khong phai 7917');
  const them = [];
  for (const [p, s, p2, s2] of CHEP) {
    const lp = dong(p), ls = dong(s); if (!lp || !ls) { bao('thieu ' + p + '/' + s); continue; }
    const cr = lp.endsWith('\r') ? '\r' : '';
    const cp = lp.replace(/\r$/, '').split('\t'), cs = ls.replace(/\r$/, '').split('\t');
    if (cp[2] !== '88' || cs[2] !== '14') bao('logic ' + p + '/' + s + ' la ' + cp[2] + '/' + cs[2]);
    const k = cp.findIndex((x, j) => j > 0 && x === String(s)); if (k < 0) { bao(p + ' khong tro toi ' + s); continue; }
    if (cp.filter((x) => x === String(s)).length !== 1) bao(p + ': ' + s + ' xuat hien nhieu lan');
    cp[0] = String(p2); cp[k] = String(s2); cs[0] = String(s2);
    them.push(cp.join('\t') + cr, cs.join('\t') + cr);
    console.log('StandardImpact ' + p2 + ' = chep ' + p + ' (hieu ung con ' + s2 + ' = chep ' + s + ')');
  }
  L.splice(i0 + 1, 0, ...them);
  const moi = L.join('\n');
  if (cao(moi) !== cao(goc) + them.reduce((t, l) => t + cao(l), 0)) bao('StandardImpact lech byte');
  ra[f] = moi;
}
// 3a. wuyazi85o.lua - chan nang
{
  const f = 'Public/Data/Script/MyLua/shenqinew/wuyazi85o.lua'; const goc = doc(f);
  const neo = '      if whz ~= 10553100 and whz ~= 10553101 and whz ~= 10553102 and whz ~= 10553106';
  const msg = viscii('Trùng Lâu admin không nâng lên Chân được');
  const chen = '      if whz == 10553113 or whz == 10553114 or whz == 10422018 or whz == 10423026 then   -- [NetCo4 20/10] Trung Lau admin (chi admin / gift code): khong nang\r\n' +
    '         x895111_NotifyTips( sceneId, selfId, "' + msg + '" )\r\n         return\r\n      end\r\n';
  const moi = mot(goc, neo, chen + neo, 'wuyazi85o neo');
  if (cao(moi) !== cao(goc) + cao(msg)) bao('wuyazi85o lech byte');
  ra[f] = moi; console.log('wuyazi85o.lua: chan nang 10553113 / 10553114 / 10422018 / 10423026');
}
// 3b. ShopTable ke 213
{
  const f = 'Public/Config/ShopTable.txt'; const goc = doc(f); const L = goc.split('\n');
  const i = L.findIndex((l) => l.startsWith('213\t'));
  if (i < 0) bao('ShopTable khong co 213');
  else {
    let l = L[i];
    for (const id of ['10553113', '10553114']) l = mot(l, '\t' + id + '\t1\t1\t200000\t100\t', '\t0\t1\t1\t200000\t100\t', 'ShopTable 213 ' + id);
    L[i] = l; console.log('ShopTable 213: 10553113 / 10553114 -> o trong');
  }
  const moi = L.join('\n'); if (cao(moi) !== cao(goc)) bao('ShopTable lech byte');
  ra[f] = moi;
}
// 3c. boss Tam Than (loa bao) + Chu Phu Quy (code chet)
for (const b of ['boss1', 'boss2', 'boss3']) {
  const f = 'Public/Data/Script/New/sanshen/' + b + '.lua'; const goc = doc(f);
  ra[f] = mot(goc, '{10553112,10553113,10553114}', '{10553112,10553112,10553112}', b);
  if (cao(ra[f]) !== cao(goc)) bao(b + ' lech byte');
  console.log(b + '.lua: chonglouItem bo 113 / 114');
}
{
  const f = 'Public/Data/Script/obj/dali/odali_zhufugui.lua'; const goc = doc(f);
  ra[f] = mot(goc, '{10553106,10553108,10553110,10553112,10553113,10553114}', '{10553106,10553108,10553110,10553112,10553106,10553108}', 'zhufugui');
  if (cao(ra[f]) !== cao(goc)) bao('zhufugui lech byte');
  console.log('odali_zhufugui.lua: x002102_g_ChongLou bo 113 / 114');
}

if (loi) { console.log(loi + ' LOI - khong ghi'); process.exit(1); }
if (!GHI) { console.log('(chay thu, them --ghi de luu)'); process.exit(0); }
for (const [f, s] of Object.entries(ra)) fs.writeFileSync(path.join(R, f), s, 'latin1');
console.log('DA GHI ' + Object.keys(ra).length + ' file');
