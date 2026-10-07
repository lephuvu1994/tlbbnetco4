// 07/10 (chủ server): ĐỘI BOT 6 "người giả" - thử ở VÔ LƯỢNG SƠN (wuliang_monster.ini, scene 6/73/74; lúc đầu định Hậu Hoa Viên newbie_2): 1 Nga My + 2 Cái Bang + 1 Tiêu Dao + 2 Thiếu Lâm.
// Là quái (MonsterAttrExTable) đội tên người, đứng 1 cụm, đánh người chơi tới gần, gọi nhau; Nga My hồi máu đồng đội qua Lua AI
// (NetCo4/botdoi.lua, 950002, kiểu ai_hadaba.lua). Không exp, không rơi đồ (ID không có trong MonsterDropBoxs), chết 3 phút mọc lại (ini).
// 07/10 khuya: mã MỚI 64601-64606 bị TÀNG HÌNH (client tự tra ngoại hình theo bảng quái RIÊNG của client, không có mã mới -> không vẽ,
// nhưng vẫn đánh chết người chơi). Đổi sang 6 DataID CÓ SẴN trong game gốc, không ai dùng (không ini / script / drop / bảng nhiệm vụ),
// mặc đồ đúng phái: 2068 Nga My Lâu La 89, 2048 Cái Bang Lâu La 89, 2198 Đệ tử Cái Bang 85, 2108 Tiêu Dao Lâu La 89, 2028 Thiếu Lâm Lâu La 89,
// 2178 Đệ tử Thiếu Lâm 85. Ghi đè chỉ số các dòng đó (giữ ngoại hình 44-50 + giới tính của chính dòng), xóa dòng 64601-64606 cũ.
// Sinh ra / sửa: 6 dòng MonsterAttrExTable (ghi đè tại chỗ), 6 điểm trong Public/Scene/<INI> (đổi hằng INI + GOC để dời đội; ini cũ được dọn),
// đăng ký Script.dat 950002 + AIScript.dat 346-349, viết 4 file .ai. Chạy lại = cập nhật dòng/điểm (idempotent).
// Chỉ số là ƯỚC LƯỢNG (chưa có số đo người chơi) -> chỉnh trong bảng BOT rồi chạy lại; trong game GM gõ !!RELOADMONSTERATTR (không cần restart).
// Lần đầu CẦN restart (ini + .ai + Script.dat). node tools/botdoi-07-10.js [--ghi]
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'server');
const ghi = process.argv.includes('--ghi');
const VM = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8'));
const viscii = (s) => [...s].map((c) => { const b = c.charCodeAt(0); if (b < 128) return c; if (!(c in VM)) throw new Error('VISCII thieu ky tu ' + c); return String.fromCharCode(VM[c]); }).join('');

// ---- đội bot: tên hiển thị, phái, mẫu ngoại hình lấy từ quái "donor" (cột 44-50), file AI, chỉ số ----
//  Mẫu: 9546 Lý Thu Thủy (nữ), 13456 Ngô Dụng, 13537 Võ Tòng, 13465 Lộ Quân Dật, 11539 Hòa thượng, 13483 Quan Thắng.
//  hp / vlck / mpck / vlpn / ptpn / trung / ne / hieuy  (cột 19 / 15 / 17 / 16 / 18 / 23 / 24 / 25-26). 07/10: chủ server +300k máu mỗi con (240/300/220/380k -> 540/600/520/680k)
const BOT = [
  { id: 2068, ten: 'Chu Chỉ Nhược', phai: 'Nga My', donor: 2068, gioi: -1, ai: 349, x: 0, z: 0, hp: 540000, vlck: 6000, mpck: 26000, vlpn: 16000, ptpn: 20000, trung: 11000, ne: 2400, hieuy: 150 },
  { id: 2048, ten: 'Kiều Phong', phai: 'Cái Bang', donor: 2048, gioi: -1, ai: 347, x: 2, z: -1.5, hp: 600000, vlck: 36000, mpck: 6000, vlpn: 20000, ptpn: 14000, trung: 12000, ne: 2800, hieuy: 300 },
  { id: 2198, ten: 'Hồng Thất Công', phai: 'Cái Bang', donor: 2198, gioi: -1, ai: 347, x: -2, z: -1.5, hp: 600000, vlck: 36000, mpck: 6000, vlpn: 20000, ptpn: 14000, trung: 12000, ne: 2800, hieuy: 300 },
  { id: 2108, ten: 'Vô Nhai Tử', phai: 'Tiêu Dao', donor: 2108, gioi: -1, ai: 348, x: 0, z: 2, hp: 520000, vlck: 6000, mpck: 36000, vlpn: 14000, ptpn: 20000, trung: 11500, ne: 2600, hieuy: 250 },
  { id: 2028, ten: 'Huyền Từ', phai: 'Thiếu Lâm', donor: 2028, gioi: -1, ai: 346, x: 3, z: 1, hp: 680000, vlck: 28000, mpck: 6000, vlpn: 30000, ptpn: 22000, trung: 11000, ne: 2200, hieuy: 150 },
  { id: 2178, ten: 'Huyền Khổ', phai: 'Thiếu Lâm', donor: 2178, gioi: -1, ai: 346, x: -3, z: 1, hp: 680000, vlck: 28000, mpck: 6000, vlpn: 30000, ptpn: 22000, trung: 11000, ne: 2200, hieuy: 150 },
];
const HE = 5000;   // 07/10 chủ server: công băng / hỏa / huyền / độc mỗi hệ 5000 cho mọi bot (cột 30/33/36/39); thủ hệ giữ 60 như mẫu
// 07/10 khuya (thử trên server local): AI riêng số 33 thêm vào MonsterAITable.ini: chủ động, không đi lung tung, quét 10 m,
// KHÔNG XÍCH (AIPARAM3/6 rất lớn -> không bao giờ "bỏ đuổi, bất tử chạy về"), có Lua, gọi đồng bọn. Trước dùng 21 (đuổi 60 m rồi về).
const CAP = 89, MP = 60000, BASE_AI = 33, SCRIPT = 950002;
const AI_MOI = ['[AI33]', 'DESC=NetCo4 bot doi: chu dong, khong di lung tung, quet 10m, KHONG xich (khong bo duoi / bat tu chay ve), co Lua, goi dong bon',
  'AIPARAM0=1500', 'AIPARAM1=-1', 'AIPARAM2=0', 'AIPARAM3=9999999', 'AIPARAM4=10000', 'AIPARAM5=20000', 'AIPARAM6=9999999', 'AIPARAM7=10000', 'AIPARAM8=1', 'AIPARAM9=1', 'AIPARAM10=1'];
const HOI_SINH_MS = 180000, GROUP = 9502, TEMPLATE = '13465', SAU = '64563';
const INI = 'wuliang_monster.ini', GOC = { x: 176, z: 172 };   // vị trí đội = GOC + lệch (x, z) của từng bot; dời đội: đổi 2 hằng này
const INI_CU = ['newbie_2_monster.ini'];   // ini từng chứa bot -> dọn sạch khối bot

// ---- 4 file .ai ----
// 07/10 khuya: SAI cũ - .ai gọi chiêu theo mã SkillTemplate; mã chiêu NGƯỜI CHƠI đòi vũ khí + tâm pháp -> quái không dùng được, chỉ đánh
// thường ("đánh như vô phái"). Đổi sang CHIÊU QUÁI (boss gốc đang dùng, có hiệu ứng, không đòi gì). Mọi bot: máu < 50% tự trị liệu (582),
// máu < 25% chạy về đồng đội gần nhất (AIS_ToFlee(1), tối đa 2 lần / trận) -> hồi xong AI tự lao lên đánh lại.
const S = (id, pct, pri) => `if(AIS_GetAIState()=SATTACK&AIS_Rand()<${pct}&AIS_IsCanSkill(${id})=1){AIS_ToSkill(${id});AIS_SetTimes(-1);AIS_SetPRI(${pri});};`;
const CHUNG = [
  'if(AIS_GetHP()<25&AIS_GetAIState()=SATTACK){AIS_ToFlee(1);AIS_SetTimes(2);AIS_SetPRI(60);};',
  'if(AIS_GetHP()<50&AIS_IsCanSkill(582)=1){AIS_ToSkill(582);AIS_SetTimes(-1);AIS_SetPRI(55);};',
];
const AI = {
  // Thiếu Lâm: Trí Mệnh Đả Kích, Bài Sơn Đảo Hải (AoE 5m), Chấn Địa Công Kích (AoE), Phệ Huyết (khiêu khích), Thạch Phu (tự buff khi < 70%)
  346: { ten: 'Thieu Lam', dong: [S(591, 50, 33), S(592, 35, 35), S(562, 25, 35), S(580, 20, 34), 'if(AIS_GetHP()<70&AIS_IsCanSkill(585)=1){AIS_ToSkill(585);AIS_SetTimes(-1);AIS_SetPRI(50);};', ...CHUNG] },
  // Cái Bang: Thống Kích, Trảm Kích, Liệt Trảo Cuồng Kích, Lợi Nha Bào Hao (AoE 5m), Thú Vương Nộ Hống (AoE khống chế 9m), Hư Huyễn Trảm (khống chế)
  347: { ten: 'Cai Bang', dong: [S(614, 60, 33), S(612, 45, 34), S(588, 35, 35), S(590, 25, 35), S(603, 15, 36), S(600, 15, 36), ...CHUNG] },
  // Tiêu Dao: Hàn Băng Chú, Cuồng Lôi Thiên Lao (AoE 9m), Băng Thiên Tuyết Địa (AoE 9m), Đại Tuyết Băng (AoE khống chế 9m), Như Mộng Huyễn Tượng (khống chế)
  348: { ten: 'Tieu Dao', dong: [S(553, 60, 33), S(615, 35, 35), S(627, 25, 35), S(602, 20, 36), S(599, 15, 36), ...CHUNG] },
  // Nga My: Liệt Hỏa Chú, Trớ Chú, Liệt Diễm Luyện Ngục (AoE 9m), Tâm Ma Tất Hiện (khống chế); tự hồi Linh Chi Cửu Chuyển < 60%; hồi đồng đội do Lua
  349: { ten: 'Nga My', dong: [S(554, 60, 33), S(616, 40, 34), S(610, 20, 35), S(598, 15, 36), 'if(AIS_GetHP()<60&AIS_IsCanSkill(589)=1){AIS_ToSkill(589);AIS_SetTimes(-1);AIS_SetPRI(56);};', ...CHUNG] },
};
const aiText = (n) => ['; NetCo4 07/10: bot doi - ' + AI[n].ten + ' (chieu QUAI co hieu ung; tri lieu < 50%, chay ve dong doi < 25%). Hoi mau dong doi: NetCo4/botdoi.lua', '[common]', '[commonend]', '[skill]',
  '0:if(AIS_IsCanSkill(0)=1){AIS_ToSkill(0);AIS_SetTimes(-1);AIS_SetPRI(30);};', ...AI[n].dong.map((d, i) => (i + 1) + ':' + d), '[skillend]', '[beskill]', '[beskillend]', '[damage]', '[damageend]', '[dead]', '[deadend]', ''].join('\r\n');

const cnt = (s, re) => (s.match(re) || []).length;
const doi = [];
function luu(f, cu, moi) { if (cu === moi) return; doi.push(path.relative(R, f) + ' (' + cnt(cu, /\n/g) + ' -> ' + cnt(moi, /\n/g) + ' dong)'); if (ghi) fs.writeFileSync(f, moi, 'latin1'); }

// 1) MonsterAttrExTable
{
  const F = path.join(R, 'Public/Config/MonsterAttrExTable.txt');
  const raw = fs.readFileSync(F, 'latin1'); const L = raw.split('\n');
  const tim = (id) => L.findIndex((l) => l.startsWith(id + '\t'));
  const tpl = L[tim(TEMPLATE)]; if (!tpl) throw new Error('khong thay dong mau ' + TEMPLATE);
  const cr = tpl.endsWith('\r');
  const dongCua = (b) => {
    const c = (cr ? tpl.slice(0, -1) : tpl).split('\t');
    const d = L[tim(b.donor)]; if (!d) throw new Error('khong thay donor ' + b.donor);
    const dc = d.replace(/\r$/, '').split('\t');
    c[0] = String(b.id); c[1] = viscii(b.ten); c[2] = b.gioi >= 0 ? String(b.gioi) : dc[2]; c[3] = String(CAP); c[4] = '0'; c[7] = String(BASE_AI); c[8] = '-1'; c[9] = '9'; c[14] = '0';
    c[15] = String(b.vlck); c[16] = String(b.vlpn); c[17] = String(b.mpck); c[18] = String(b.ptpn); c[19] = String(b.hp); c[20] = String(MP); c[21] = '0'; c[22] = '0';
    c[30] = String(HE); c[33] = String(HE); c[36] = String(HE); c[39] = String(HE);
    c[23] = String(b.trung); c[24] = String(b.ne); c[25] = String(b.hieuy); c[26] = String(b.hieuy); c[27] = '3500'; c[28] = '800';
    for (let k = 44; k <= 50; k++) c[k] = dc[k];   // ngoại hình, hiện tên, hướng, cao tên, cỡ chọn, bóng, chân dung
    c[53] = String(CAP); c[54] = '0'; c[55] = String(b.vlck); c[56] = String(b.vlpn); c[57] = String(b.mpck); c[58] = String(b.ptpn); c[59] = String(b.hp);
    c[60] = '0'; c[61] = '28'; c[62] = '10'; c[63] = '0'; c[65] = '2'; c[66] = '1';
    return c.join('\t') + (cr ? '\r' : '');
  };
  // xóa dòng mã mới cũ 64601-64606 (tàng hình) nếu còn
  for (let i = L.length - 1; i >= 0; i--) if (/^6460[1-6]\t/.test(L[i])) { console.log('xoa dong cu', L[i].split('\t')[0]); L.splice(i, 1); }
  const rows = BOT.map(dongCua);
  const co = BOT.map((b) => tim(b.id));
  if (co.every((i) => i >= 0)) { co.forEach((i, k) => { L[i] = rows[k]; }); }
  else if (co.every((i) => i < 0)) { const i = tim(SAU); if (i < 0) throw new Error('khong thay ' + SAU); const sau = L[i + 1].split('\t')[0]; if (/^\d+$/.test(sau) && +sau < 64606) throw new Error('dong sau ' + SAU + ' la ' + sau); L.splice(i + 1, 0, ...rows); }
  else throw new Error('bang dang co 1 phan bot - kiem tay');
  for (const b of BOT) console.log(b.id, b.ten, '|', b.phai, '| HP', b.hp, 'VLCK', b.vlck, 'MPCK', b.mpck, 'VLPN', b.vlpn, 'PTPN', b.ptpn, '| mau', L[tim(b.id)].split('\t')[44]);
  const out = L.join('\n');
  const dem = (s) => cnt(s, /[\x80-\xff]/g);
  console.log('MonsterAttrExTable byte>127', dem(raw), '->', dem(out), '(them', dem(out) - dem(raw), 'cua ten VISCII) CR', cnt(raw, /\r/g), '->', cnt(out, /\r/g));
  luu(F, raw, out);
}
// 2) ini bản đồ: dọn khối bot khỏi ini cũ, rồi ghi vào INI
const reBot = (nl) => new RegExp('(' + nl + ')?\\[monster\\d+\\]' + nl + 'guid=950002\\d+' + nl + '(?:(?!\\[monster)[^\\n]*' + nl + ')*', 'g');
for (const ten of INI_CU) {
  const F = path.join(R, 'Public/Scene/' + ten); if (!fs.existsSync(F)) continue;
  const raw = fs.readFileSync(F, 'latin1'); const nl = raw.includes('\r\n') ? '\r\n' : '\n';
  let t2 = raw.replace(reBot(nl), ''); if (t2 === raw) continue;
  t2 = t2.replace(/\s*$/, '') + nl; const dem = (t2.match(/^\[monster\d+\]/gm) || []).length; t2 = t2.replace(/monstercount=\d+/, 'monstercount=' + dem);
  console.log('don bot khoi ' + ten + ' -> monstercount=' + dem); luu(F, raw, t2);
}
{
  const F = path.join(R, 'Public/Scene/' + INI);
  const raw = fs.readFileSync(F, 'latin1'); const nl = raw.includes('\r\n') ? '\r\n' : '\n';
  let t = raw;
  // guid cố định theo bot (95000201–06) để lần chạy sau nhận ra khối cũ (reBot) - KHÔNG tính theo số khối k
  const khoi = (b, k, i) => ['[monster' + k + ']', 'guid=' + (95000201 + i), 'type=' + b.id, 'name=' + viscii(b.ten), 'title=', 'pos_x=' + (GOC.x + b.x), 'pos_z=' + (GOC.z + b.z), 'dir=27', 'script_id=' + SCRIPT, 'respawn_time=' + HOI_SINH_MS,
    'group_id=' + GROUP, 'team_id=' + GROUP, 'base_ai=' + BASE_AI, 'ai_file=' + b.ai, 'patrol_id=-1', 'shop0=-1', 'shop1=-1', 'shop2=-1', 'shop3=-1', 'ReputationID=-1', ''].join(nl);
  // bỏ khối bot cũ (nếu có) rồi nối lại từ đầu -> chạy lại là cập nhật
  t = t.replace(reBot(nl), '');
  t = t.replace(/\s*$/, '') + nl;
  const dem0 = (t.match(/^\[monster\d+\]/gm) || []).length;
  const blocks = BOT.map((b, i) => khoi(b, dem0 + i, i)).join(nl);
  t = t + nl + blocks;
  t = t.replace(/monstercount=\d+/, 'monstercount=' + (dem0 + BOT.length));
  if ((t.match(/^\[monster\d+\]/gm) || []).length !== dem0 + BOT.length) throw new Error('dem khoi ini sai');
  console.log('ini: ' + dem0 + ' diem co san + ' + BOT.length + ' bot, monstercount=' + (dem0 + BOT.length) + ', doi quanh (' + GOC.x + ', ' + GOC.z + ') trong ' + INI);
  luu(F, raw, t);
}
// 3) Script.dat + AIScript.dat
{
  const F = path.join(R, 'Public/Data/Script.dat'); const raw = fs.readFileSync(F, 'latin1');
  const dong = SCRIPT + '=\\NetCo4\\botdoi.lua';
  if (!raw.includes(dong)) luu(F, raw, raw.replace(/\s*$/, '') + '\r\n' + dong + '\r\n'); else console.log('Script.dat da co ' + SCRIPT);
  const F2 = path.join(R, 'Public/Data/AIScript.dat'); const raw2 = fs.readFileSync(F2, 'latin1');
  let t2 = raw2.replace(/\s*$/, '') + '\r\n';
  for (const n of Object.keys(AI)) { const d = n + '=script' + n + '.ai =NetCo4 bot ' + AI[n].ten; if (!raw2.includes(n + '=script' + n + '.ai')) t2 += d + '\r\n'; }
  if (t2 !== raw2) luu(F2, raw2, t2); else console.log('AIScript.dat da co 346-349');
}
// 3b) MonsterAITable.ini: thêm [AI33] (AINUMBER 33 -> 34), chạy lại = cập nhật khối
{
  const F = path.join(R, 'Public/Config/MonsterAITable.ini'); const raw = fs.readFileSync(F, 'latin1');
  let t3 = raw.replace(/\r?\n\[AI33\][\s\S]*$/, '');
  t3 = t3.replace(/\s*$/, '') + '\r\n\r\n' + AI_MOI.join('\r\n') + '\r\n';
  t3 = t3.replace(/AINUMBER=\d+/, 'AINUMBER=34');
  luu(F, raw, t3);
}
// 4) .ai
for (const n of Object.keys(AI)) {
  const F = path.join(R, 'Public/Data/AIScript/script' + n + '.ai');
  const cu = fs.existsSync(F) ? fs.readFileSync(F, 'latin1') : '';
  if (cu && !cu.includes('NetCo4 07/10: bot doi')) throw new Error('script' + n + '.ai da ton tai va KHONG phai cua bot');
  luu(F, cu, aiText(n));
}
console.log(doi.length ? (ghi ? 'DA GHI:\n  ' : 'SE DOI:\n  ') + doi.join('\n  ') : 'khong co gi doi');
if (!fs.existsSync(path.join(R, 'Public/Data/Script/NetCo4/botdoi.lua'))) console.log('CHU Y: chua co NetCo4/botdoi.lua');
