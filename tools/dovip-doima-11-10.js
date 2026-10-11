// 11/10 (chu server): do VIP doi sang ma CLIENT CHO TINH THONG (g_JTSupport_Item cua giao dien client - 26 ma chi-GM cu bi client chan
//  "Chi co trang bi cap 50+ moi co the Tinh Thong"). Chu server da thu 10 ma (giam dinh xong tinh thong duoc).
//  1. EquipBase: ma moi lay DUNG cau hinh dong co dinh cua ma VIP cu (cot 32-93 + 100: dong bat, quy tac 9, doan 4401-4426, so dong).
//     Ma cu GIU nguyen (do VIP da phat van dung chi so).
//  2. NPC doi VIP (MyNew/doitrunglau2.lua x111998_g_VipThu / VipCong): ma cu -> ma moi.
//  3. TAT MOI NGUON ma moi (chu server: "tat het moi nguon co the lach de che ra"):
//     - Server/Config/DropBoxContent.txt: bo ma khoi MOI hop (don trai, them -1 cuoi) - ca hop quai roi lan hop khong quai.
//     - obj/growpoint/gp_*.lua (diem dao bau): bo ma khoi danh sach idx.
//     - event/peifang/useability/g_fengren_*_use.lua (phoi phuong may): ma moi -> ma lien ke trong bang ChanPin (giu bang ty le tich luy).
//   Chua ai giu ma moi (DB 11/10). Web bot khong ban. Can cap-nhat + RESTART. Rollback tag truoc-dovip-doima-11-10.
//   node tools/dovip-doima-11-10.js [--ghi]
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'server');
const GHI = process.argv.includes('--ghi'); let loi = 0;
const doc = (f) => fs.readFileSync(path.join(R, f), 'latin1');
const ghiF = []; const ghi = (f, s, cu) => { if (s !== cu) ghiF.push([f, s]); };
const DOI = [
  ['10410081', '10210019'], ['10413082', '10213019'], ['10412079', '10212019'], ['10411087', '10211019'], ['10421077', '10221010'], ['10420021', '10215019'],
  ['10422120', '10222006'], ['10422119', '10222007'], ['10422118', '10222008'], ['10422117', '10222009'], ['10522000', '10222010'],
  ['10420079', '10220006'], ['10420078', '10220007'], ['10420077', '10220008'], ['10420076', '10220009'], ['10420075', '10220010'],
  ['10423045', '10223006'], ['10423044', '10223007'], ['10423043', '10223008'], ['10423042', '10223009'], ['10523000', '10223010'],
  ['10414044', '10214011'], ['10414043', '10214013'], ['10414042', '10214015'], ['10414041', '10214017'], ['10514000', '10214019'],
];
const MOI = new Set(DOI.map((x) => x[1]));

// 1. EquipBase
{
  const f = 'Public/Config/EquipBase.txt', goc = doc(f), L = goc.split('\n');
  const tim = (id) => L.findIndex((l) => l.startsWith(id + '\t'));
  for (const [cu, moi] of DOI) {
    const i = tim(cu), j = tim(moi); if (i < 0 || j < 0) { console.log('LOI EquipBase thieu', cu, moi); loi++; continue; }
    const a = L[i].replace(/\r$/, '').split('\t'), cr = L[j].endsWith('\r') ? '\r' : '', b = L[j].replace(/\r$/, '').split('\t');
    if (a[5] !== b[5]) { console.log('LOI vi tri khac', cu, a[5], moi, b[5]); loi++; continue; }
    if (+a[91] < 4401 || +a[91] > 4426 || a[90] !== '9') { console.log('LOI ma cu khong phai VIP', cu, a[90], a[91]); loi++; continue; }
    for (let k = 32; k <= 93; k++) b[k] = a[k];
    b[100] = a[100];
    L[j] = b.join('\t') + cr;
    console.log('  EquipBase', cu, '->', moi, 'vt', b[5], 'doan', b[91], 'dong', b[92]);
  }
  ghi(f, L.join('\n'), goc);
}

// 2. NPC
{
  const f = 'Public/Data/Script/MyNew/doitrunglau2.lua', goc = doc(f);
  const a = goc.indexOf('x111998_g_VipThu = {'), b = goc.indexOf('x111998_g_VipTT', a);
  if (a < 0 || b < 0) { console.log('LOI NPC: khong thay bang VIP'); loi++; } else {
    let v = goc.slice(a, b);
    for (const [cu, moi] of DOI) { const k = v.split(cu).length - 1; if (k !== 1) { console.log('LOI NPC ma', cu, k, 'lan'); loi++; } v = v.split(cu).join(moi); }
    ghi(f, goc.slice(0, a) + v + goc.slice(b), goc);
    console.log('  NPC: doi', DOI.length, 'ma trong bang VIP');
  }
}

// 3a. DropBoxContent
{
  const f = 'Server/Config/DropBoxContent.txt', goc = doc(f); let n = 0; const hop = [];
  const out = goc.split('\n').map((l) => {
    const cr = l.endsWith('\r') ? '\r' : ''; const c = l.replace(/\r$/, '').split('\t'); if (!/^\d+$/.test(c[0])) return l;
    const cap = []; for (let i = 4; i + 1 < c.length; i += 2) cap.push([c[i], c[i + 1]]);
    const giu = cap.filter((p) => !MOI.has(p[0])); const bo = cap.length - giu.length; if (!bo) return l;
    n += bo; hop.push(c[0] + '(-' + bo + ')');
    if (!giu.some((p) => /^\d{8}$/.test(p[0]))) { console.log('LOI hop rong sau khi bo:', c[0]); loi++; }
    while (giu.length < cap.length) giu.push(['-1', '-1']);
    giu.forEach((p, k) => { c[4 + 2 * k] = p[0]; c[5 + 2 * k] = p[1]; });
    return c.join('\t') + cr;
  }).join('\n');
  console.log('  DropBoxContent: bo', n, 'o trong', hop.length, 'hop:', hop.join(' '));
  ghi(f, out, goc);
}

// 3b. growpoint
{
  const d = 'Public/Data/Script/obj/growpoint';
  for (const ten of fs.readdirSync(path.join(R, d)).filter((x) => /\.lua$/i.test(x))) {
    const f = d + '/' + ten, goc = doc(f); if (![...MOI].some((id) => goc.includes(id))) continue;
    let s = goc, n = 0;
    s = s.replace(/idx\s*=\s*\{[^}]*\}/g, (blk) => {
      if (!(blk.match(/\d{8}/g) || []).some((id) => MOI.has(id))) return blk;
      let moi = blk.replace(/(\s*)(\d{8})\s*,/g, (m, sp, id) => (MOI.has(id) ? (n++, '') : m));
      // nhom chi toan ma moi (deu odd = 0, gan nhu khong chon) -> giu 1 ma do thuong de getn(idx) khong ve 0
      if (!/\d{8}/.test(moi)) { moi = moi.replace(/\{/, '{ 10200010,'); console.log('  growpoint', ten, 'nhom rong -> giu cho 10200010'); }
      return moi;
    });
    const con = [...MOI].filter((id) => s.includes(id)); if (con.length) { console.log('LOI growpoint con ma', f, con.join(',')); loi++; }
    console.log('  growpoint', ten, 'bo', n);
    ghi(f, s, goc);
  }
}

// 3c. phoi phuong may
{
  const d = 'Public/Data/Script/event/peifang/useability';
  for (const ten of fs.readdirSync(path.join(R, d)).filter((x) => /\.lua$/i.test(x))) {
    const f = d + '/' + ten, goc = doc(f); if (![...MOI].some((id) => goc.includes(id))) continue;
    const ids = [...goc.matchAll(/\{ID = (\d{8}), Odds = \d+\}/g)].map((m) => m[1]);
    let s = goc;
    for (const id of ids.filter((x) => MOI.has(x))) {
      const i = ids.indexOf(id); const thay = ids.slice(0, i).reverse().concat(ids.slice(i + 1)).find((x) => !MOI.has(x));
      if (!thay) { console.log('LOI phoi phuong khong co ma thay', f, id); loi++; continue; }
      s = s.replace('{ID = ' + id + ', Odds', '{ID = ' + thay + ', Odds');
      console.log('  phoi phuong', ten, id, '->', thay);
    }
    const con = [...MOI].filter((id) => s.includes(id)); if (con.length) { console.log('LOI phoi phuong con ma', f, con.join(',')); loi++; }
    ghi(f, s, goc);
  }
}

// 3d. con sot? (ngoai danh sach Tinh Thong cua jingtongClient.lua va NPC VIP)
{
  const sot = []; const S = path.join(R, 'Public/Data/Script');
  const quet = (dd) => { for (const e of fs.readdirSync(dd, { withFileTypes: true })) { const p = path.join(dd, e.name); if (e.isDirectory()) quet(p); else if (/\.lua$/i.test(e.name)) {
    const rel = path.relative(R, p).replace(/\\/g, '/'); const g = ghiF.find((x) => x[0] === rel); const s = g ? g[1] : fs.readFileSync(p, 'latin1');
    if (/jingtong\/jingtongClient\.lua$|MyNew\/doitrunglau2\.lua$/.test(rel)) continue;
    for (const id of MOI) if (s.includes(id)) sot.push(rel + ':' + id); } } };
  quet(S);
  for (const f of ['Public/Config/ShopTable.txt', 'Public/Config/ItemCompound.txt']) { const s = doc(f); for (const id of MOI) if (s.includes(id)) sot.push(f + ':' + id); }
  for (const f of fs.readdirSync(path.join(R, 'Server/Config')).filter((x) => /^boxdroplist/i.test(x))) { const s = doc('Server/Config/' + f); for (const id of MOI) if (s.includes(id)) sot.push(f + ':' + id); }
  if (sot.length) { console.log('LOI con nguon:', sot.join(' ')); loi++; } else console.log('  quet lai: khong con nguon nao');
}

if (loi) { console.log('CO ' + loi + ' LOI - khong ghi'); process.exit(1); }
if (GHI) { for (const [f, s] of ghiF) fs.writeFileSync(path.join(R, f), s, 'latin1'); console.log('DA GHI', ghiF.length, 'file'); }
else console.log('(thu - them --ghi) se ghi', ghiF.length, 'file');
