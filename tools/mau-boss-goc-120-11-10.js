// 11/10 (chu server): "tat ca mau boss ve mac dinh, Sat Tinh co config vai con cho ve mac dinh het, xong + 20% mau goc (gio ai cung manh)".
//  Boss = 4.247 dong da6cce6 da giam mau (cot 19 HP / 59 MaxHP, dem tu 0). Mac dinh = ban dau 651afc2 (= da6cce6~1).
//  -> HP / MaxHP = floor(goc x 1,2) cho moi boss do, BAT KE gia tri hien (90% goc, Sat Tinh 36%, hay sua tay).
//  Sat Tinh 11 DataID (b47b8be / 55fbe1f giam cong x0,7): cong ngoai 15, noi 17, 4 he 30/33/36/39, MaxAtt 55, MaxMag 57 ve DUNG goc.
//  Dong khong phai boss khong dung. Can restart (bang Public/Config). Rollback tag truoc-mau-boss-120-11-10.
//   node tools/mau-boss-goc-120-11-10.js [--ghi]     (chay o goc repo)
const { execSync } = require('child_process'); const fs = require('fs');
const GHI = process.argv.includes('--ghi');
const P = 'server/Public/Config/MonsterAttrExTable.txt';
const rd = (r) => execSync('git show ' + r + ':' + P, { maxBuffer: 1e9, encoding: 'latin1' }).split(/\r?\n/);
const map = (L) => { const m = {}; for (const l of L) { const c = l.split('\t'); if (/^\d+$/.test(c[0])) m[c[0]] = c; } return m; };
const G = map(rd('651afc2')), R = map(rd('da6cce6'));
const BOSS = new Set(Object.keys(G).filter((id) => R[id] && (G[id][19] !== R[id][19] || G[id][59] !== R[id][59])));
const SAT = ['13447', '13456', '13465', '13474', '13483', '13492', '13501', '13510', '13519', '13528', '13537'];
const CONG = [15, 17, 30, 33, 36, 39, 55, 57];
const nhan = (v) => String(Math.floor((+v * 12) / 10));
const raw = fs.readFileSync(P, 'latin1');
let o = 0, d = 0; const la = []; const muc = {}; const thay = new Set();
const out = raw.split('\n').map((l) => {
  const cr = l.endsWith('\r') ? '\r' : ''; const c = l.replace(/\r$/, '').split('\t'); const id = c[0];
  if (!BOSS.has(id) && !SAT.includes(id)) return l;
  const g = G[id]; if (!g) return l; let ch = false;
  const dat = (k, v) => { if (c[k] !== v) { c[k] = v; o++; ch = true; } };
  for (const k of [19, 59]) {
    if (!(+g[k] > 0)) continue;
    const hs = (+c[k] / +g[k]).toFixed(2); muc[hs] = (muc[hs] || 0) + 1;
    if (!['0.90', '0.36'].includes(hs) && la.length < 40) la.push(id + '@' + k + ' ' + c[k] + '/' + g[k] + ' (' + hs + ')');
    dat(k, nhan(g[k]));
  }
  if (SAT.includes(id)) for (const k of CONG) dat(k, g[k]);
  if (ch) { d++; thay.add(id); }
  return ch ? c.join('\t') + cr : l;
}).join('\n');
console.log('boss (da6cce6):', BOSS.size, '| Sat Tinh co trong boss:', SAT.filter((x) => BOSS.has(x)).length + '/11');
console.log('he so hien / goc (so o):', Object.entries(muc).sort((a, b) => b[1] - a[1]).map(([h, n]) => h + ':' + n).join('  '));
console.log('o khac 90% / 36% (toi da 40):', la.join(' | ') || '-');
console.log('doi', o, 'o /', d, 'dong; byte', raw.length, '->', out.length);
for (const id of SAT) console.log('  Sat Tinh', id, 'HP', (G[id] || [])[19], '->', nhan((G[id] || [])[19] || 0));
if (GHI) { fs.writeFileSync(P, out, 'latin1'); console.log('DA GHI'); } else console.log('(thu - them --ghi)');
