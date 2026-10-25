// 25/10 (chu server, can lai sau mau-boss-goc-200-25-10.js): mau boss theo CAP cua dong quai (cot 3):
//   cap >= 100 -> 200% goc;  cap <= 99 -> 120% goc (nhu 11/10).
//  Pho ban chon bac quai (DataID rieng, cap ghi san) theo cap trung binh to doi -> to < 100 gap bac duoi 100 (120%), to 100+ gap bac 100+ (200%).
//  Boss = 4.247 dong da6cce6 da giam mau (cot 19 HP / 59 MaxHP). Goc = 651afc2. 120% dung cong thuc cu floor(goc x 12 / 10) -> khop tung so 11/10.
//  Can cap-nhat + RESTART (bang Public/Config). Rollback tag truoc-mau-boss-theo-cap-25-10.
//   node tools/mau-boss-theo-cap-25-10.js [--ghi]     (chay o goc repo)
const { execSync } = require('child_process'); const fs = require('fs');
const GHI = process.argv.includes('--ghi');
const P = 'server/Public/Config/MonsterAttrExTable.txt';
const rd = (r) => execSync('git show ' + r + ':' + P, { maxBuffer: 1e9, encoding: 'latin1' }).split(/\r?\n/);
const map = (L) => { const m = {}; for (const l of L) { const c = l.split('\t'); if (/^\d+$/.test(c[0])) m[c[0]] = c; } return m; };
const G = map(rd('651afc2')), R = map(rd('da6cce6'));
const BOSS = new Set(Object.keys(G).filter((id) => R[id] && (G[id][19] !== R[id][19] || G[id][59] !== R[id][59])));
const nhan = (v, cao) => String(cao ? Math.floor(+v * 2) : Math.floor((+v * 12) / 10));
const raw = fs.readFileSync(P, 'latin1');
let o = 0, d = 0; const muc = { cao: {}, thap: {} }; let nCao = 0, nThap = 0;
const out = raw.split('\n').map((l) => {
  const cr = l.endsWith('\r') ? '\r' : ''; const c = l.replace(/\r$/, '').split('\t'); const id = c[0];
  if (!BOSS.has(id)) return l;
  const g = G[id]; if (!g) return l;
  const cao = +c[3] >= 100; cao ? nCao++ : nThap++;
  let ch = false;
  for (const k of [19, 59]) {
    if (!(+g[k] > 0)) continue;
    const v = nhan(g[k], cao);
    if (c[k] !== v) { c[k] = v; o++; ch = true; }
    const hs = (+v / +g[k]).toFixed(2); const m = cao ? muc.cao : muc.thap; m[hs] = (m[hs] || 0) + 1;
  }
  if (ch) d++;
  return ch ? c.join('\t') + cr : l;
}).join('\n');
const tt = (m) => Object.entries(m).sort((a, b) => b[1] - a[1]).map(([h, n]) => h + ':' + n).join(' ');
console.log('boss cap >= 100:', nCao, '(he so sau:', tt(muc.cao) + ') | cap <= 99:', nThap, '(he so sau:', tt(muc.thap) + ')');
console.log('doi', o, 'o /', d, 'dong; byte', raw.length, '->', out.length);
if (GHI) { fs.writeFileSync(P, out, 'latin1'); console.log('DA GHI'); } else console.log('(thu - them --ghi)');
