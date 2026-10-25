// 25/10 (chu server): sat thuong (cong) boss theo CAP dong quai (cot 3): cap >= 100 -> 150% goc; cap <= 99 -> 110% goc.
//  Cung 4.247 boss nhu tools/mau-boss-theo-cap-25-10.js (mau 200% / 120%). Goc = 651afc2 (truoc ngay 25/10 moi o cong boss = goc).
//  8 cot cong (dem tu 0, nhu tools/sattinh-nerf-06-10.js): 15 cong ngoai, 17 cong noi, 30/33/36/39 cong 4 he, 55 MaxAtt, 57 MaxMag.
//  KHONG doi: sat thuong co dinh trong impact chieu boss (vd Bang Xi 2868 Tinh La Ky Bo 50.556) - bang StandardImpact rieng.
//  Can cap-nhat + RESTART (bang Public/Config). Rollback tag truoc-cong-boss-theo-cap-25-10.
//   node tools/cong-boss-theo-cap-25-10.js [--ghi]     (chay o goc repo)
const { execSync } = require('child_process'); const fs = require('fs');
const GHI = process.argv.includes('--ghi');
const P = 'server/Public/Config/MonsterAttrExTable.txt';
const rd = (r) => execSync('git show ' + r + ':' + P, { maxBuffer: 1e9, encoding: 'latin1' }).split(/\r?\n/);
const map = (L) => { const m = {}; for (const l of L) { const c = l.split('\t'); if (/^\d+$/.test(c[0])) m[c[0]] = c; } return m; };
const G = map(rd('651afc2')), R = map(rd('da6cce6'));
const BOSS = new Set(Object.keys(G).filter((id) => R[id] && (G[id][19] !== R[id][19] || G[id][59] !== R[id][59])));
const CONG = [15, 17, 30, 33, 36, 39, 55, 57];
const nhan = (v, cao) => String(Math.floor((+v * (cao ? 15 : 11)) / 10));
const raw = fs.readFileSync(P, 'latin1');
let o = 0, d = 0, nCao = 0, nThap = 0, lechGoc = 0;
const out = raw.split('\n').map((l) => {
  const cr = l.endsWith('\r') ? '\r' : ''; const c = l.replace(/\r$/, '').split('\t'); const id = c[0];
  if (!BOSS.has(id)) return l;
  const g = G[id]; if (!g) return l;
  const cao = +c[3] >= 100; cao ? nCao++ : nThap++;
  let ch = false;
  for (const k of CONG) {
    if (c[k] !== g[k] && c[k] !== nhan(g[k], cao)) lechGoc++;   // o da bi sua khac goc truoc khi chay (bao, van dat theo goc)
    const v = nhan(g[k], cao);
    if (c[k] !== v) { c[k] = v; o++; ch = true; }
  }
  if (ch) d++;
  return ch ? c.join('\t') + cr : l;
}).join('\n');
console.log('boss cap >= 100 (x1,5):', nCao, '| cap <= 99 (x1,1):', nThap, '| o khac goc truoc khi chay:', lechGoc);
console.log('doi', o, 'o /', d, 'dong; byte', raw.length, '->', out.length);
if (GHI) { fs.writeFileSync(P, out, 'latin1'); console.log('DA GHI'); } else console.log('(thu - them --ghi)');
