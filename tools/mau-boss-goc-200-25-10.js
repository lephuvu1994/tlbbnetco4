// 25/10 (chu server): mau boss = 200% GOC (truoc: 120% goc tu 11/10, tools/mau-boss-goc-120-11-10.js). Chi boss, quai thuong giu nguyen.
//  Boss = 4.247 dong da6cce6 da giam mau (cot 19 HP / 59 MaxHP khi tu len cap theo to doi, dem tu 0). Goc = 651afc2 (= da6cce6~1).
//  -> HP / MaxHP = floor(goc x 2) cho moi boss do, BAT KE gia tri hien. Kiem: o dang dung 120% goc (in ra o lech), tran int32.
//  Can cap-nhat + RESTART (bang Public/Config). Rollback tag truoc-mau-boss-200-25-10.
//   node tools/mau-boss-goc-200-25-10.js [--ghi]     (chay o goc repo)
const { execSync } = require('child_process'); const fs = require('fs');
const GHI = process.argv.includes('--ghi');
const P = 'server/Public/Config/MonsterAttrExTable.txt';
const rd = (r) => execSync('git show ' + r + ':' + P, { maxBuffer: 1e9, encoding: 'latin1' }).split(/\r?\n/);
const map = (L) => { const m = {}; for (const l of L) { const c = l.split('\t'); if (/^\d+$/.test(c[0])) m[c[0]] = c; } return m; };
const G = map(rd('651afc2')), R = map(rd('da6cce6'));
const BOSS = new Set(Object.keys(G).filter((id) => R[id] && (G[id][19] !== R[id][19] || G[id][59] !== R[id][59])));
const nhan = (v) => String(Math.floor(+v * 2));
const raw = fs.readFileSync(P, 'latin1');
let o = 0, d = 0, lon = 0; const la = []; const muc = {};
const out = raw.split('\n').map((l) => {
  const cr = l.endsWith('\r') ? '\r' : ''; const c = l.replace(/\r$/, '').split('\t'); const id = c[0];
  if (!BOSS.has(id)) return l;
  const g = G[id]; if (!g) return l; let ch = false;
  for (const k of [19, 59]) {
    if (!(+g[k] > 0)) continue;
    const hs = (+c[k] / +g[k]).toFixed(2); muc[hs] = (muc[hs] || 0) + 1;
    if (!['1.20', '2.00'].includes(hs) && la.length < 40) la.push(id + '@' + k + ' ' + c[k] + '/' + g[k] + ' (' + hs + ')');
    const v = nhan(g[k]);
    if (+v > 2147483647) { lon++; continue; }
    if (c[k] !== v) { c[k] = v; o++; ch = true; }
  }
  if (ch) d++;
  return ch ? c.join('\t') + cr : l;
}).join('\n');
console.log('boss (da6cce6):', BOSS.size);
console.log('he so hien / goc (so o):', Object.entries(muc).sort((a, b) => b[1] - a[1]).map(([h, n]) => h + ':' + n).join('  '));
console.log('o khac 120% (toi da 40):', la.join(' | ') || '-');
console.log('doi', o, 'o /', d, 'dong; vuot int32 bo qua', lon, '; byte', raw.length, '->', out.length);
if (GHI) { fs.writeFileSync(P, out, 'latin1'); console.log('DA GHI'); } else console.log('(thu - them --ghi)');
