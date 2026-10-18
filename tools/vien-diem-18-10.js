// 18/10 (chu server): vien +5 diem tiem nang tu do (o "Diem" bang thuoc tinh), CHI admin phat qua panel, khong tran.
// Muon Thuong Lang Bach Loc Hoan 30103041 (class 3, client da cho chuot phai, khong ban / khong roi o dau):
//   (1) Public/Config/CommonItem.txt dong 30103041 cot 14 (script) 333016 -> 300068.
//   (2) Script 300068 obj/item/Runhundan.lua (Nhuan Hon Dan goc, ma 30900078 KHONG ton tai trong CommonItem):
//       g_ItemId -> 30103041; +35 -> +5; bo chan "1 lan / ngay" (hong: ghi 5 roi kiem > 10) va bo
//       SetMissionData(MD_EX_HUMAN_QIANNENG_SUBJOIN) (engine cong them tiem nang moi lan len cap theo bien nay).
// Tooltip client giu mo ta goc (khong sua duoc tu server). CommonItem = bang .txt -> can cap-nhat + RESTART.
// Chay: node tools/vien-diem-18-10.js. Rollback: tag truoc-vien-diem-18-10
const fs = require('fs');
const R = __dirname + '/../server/';
const hi = (s) => [...s].filter((c) => c.charCodeAt(0) > 127).length;
function va(f, fn) {
  const p = R + f, t = fs.readFileSync(p, 'latin1'), o = fn(t);
  if (o === t) throw new Error(f + ': khong doi gi (da chay roi?)');
  if (hi(o) !== hi(t)) throw new Error(f + ': so byte > 0x7f thay doi');
  fs.writeFileSync(p, o, 'latin1'); console.log('da sua ' + f);
}
function thay(t, a, b) { const n = t.split(a).length - 1; if (n !== 1) throw new Error('"' + a + '" khop ' + n + ' lan'); return t.replace(a, b); }

va('Public/Config/CommonItem.txt', (t) => {
  let n = 0;
  const o = t.split('\n').map((l) => {
    const p = l.split('\t');
    if (p[0] !== '30103041') return l;
    if (p[13] !== '333016') throw new Error('cot 14 cua 30103041 = ' + p[13]);
    n++; p[13] = '300068'; return p.join('\t');
  }).join('\n');
  if (n !== 1) throw new Error('dong 30103041 khop ' + n);
  return o;
});

va('Public/Data/Script/obj/item/Runhundan.lua', (t) => {
  t = thay(t, 'x300068_g_ItemId = 30900078', 'x300068_g_ItemId = 30103041');
  t = thay(t, 'RemainPoint = RemainPoint + 35', 'RemainPoint = RemainPoint + 5');
  t = thay(t, ' 35 ', ' 5 ');
  t = thay(t, 'if( Runhundan_Point > 10 ) then', 'if( 1 == 0 ) then');
  t = thay(t, 'SetMissionData( sceneId, selfId, MD_EX_HUMAN_QIANNENG_SUBJOIN, 5 )', '-- (18/10) bo: engine dung bien nay cong tiem nang moi lan len cap');
  return t;
});
