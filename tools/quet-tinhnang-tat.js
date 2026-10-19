// 19/10: chay: node tools/quet-tinhnang-tat.js "$(pwd)" ket-qua.json  (chi doc; ket qua tom tat o docs/TINH-NANG-BI-TAT.md)
// Quet tinh nang GM cu tat: (1) --AddNumText (muc menu bi comment) (2) cau bao "chua mo / tam dong / bao tri..." (3) ham su kien return ngay.
// Chi doc. argv: repo, file out.json
const fs = require('fs'), path = require('path');
const R = process.argv[2], OUT = process.argv[3];
const S = R + '/server/Public/Data/Script';
const M = JSON.parse(fs.readFileSync(R + '/tools/viscii-map.json', 'utf8'));
const rev = {}; for (const [k, v] of Object.entries(M)) rev[v] = k;
const dv = (s) => s.replace(/\\(\d{3})/g, (a, b) => rev[+b] || a).split('').map((c) => { const n = c.charCodeAt(0); return n > 127 && rev[n] ? rev[n] : c; }).join('');
// Script.dat: duong dan -> id
const sid = {};
for (const l of fs.readFileSync(R + '/server/Public/Data/Script.dat', 'latin1').split(/\r?\n/)) { const m = l.match(/^(\d+)=(.+)$/); if (m) sid[m[2].trim().replace(/\\/g, '/').toLowerCase()] = m[1]; }
// NPC dung script_id (scene ini) -> dem so diem dat
const dung = {};
for (const f of fs.readdirSync(R + '/server/Public/Scene')) {
  if (!/\.ini$/i.test(f)) continue;
  for (const m of fs.readFileSync(R + '/server/Public/Scene/' + f, 'latin1').matchAll(/^script_id=(\d+)/gm)) { (dung[m[1]] = dung[m[1]] || new Set()).add(f.replace(/_(monster|npc)\.ini$/i, '')); }
}
const KW = /(chưa mở|chưa được mở|tạm (thời )?(đóng|ngừng|chưa|không)|bảo trì|đã đóng|đã tắt|không mở|ngừng (hoạt động|mở)|chức năng (này )?(đang|chưa|tạm)|đang (bảo trì|cập nhật|nâng cấp)|sắp mở|coming soon|tạm khóa)/i;
const out = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.lua$/i.test(e.name)) quet(p); } };
function quet(p) {
  const rel = '/' + path.relative(S, p).replace(/\\/g, '/');
  const id = sid[rel.toLowerCase()] || '';
  const t = fs.readFileSync(p, 'latin1'); const L = t.split(/\r?\n/);
  const hit = { file: rel, id, npc: id && dung[id] ? [...dung[id]].slice(0, 4).join(',') : '', menu: [], bao: [], chan: [] };
  L.forEach((l, i) => {
    if (/NetCo4/i.test(l)) return;
    const m = l.match(/^\s*--+\s*AddNumText\s*\([^,]*,[^,]*,\s*"([^"]*)"\s*,\s*\d+\s*,\s*(\d+)/);
    if (m) { const tx = dv(m[1]).replace(/#[a-zA-Z]|#c[0-9A-Fa-f]{6}|#\{[^}]*\}/g, '').trim(); if (tx) hit.menu.push(i + 1 + ': ' + tx + ' [' + m[2] + ']'); }
    if (!/^\s*--/.test(l)) { const s = l.match(/"([^"]{3,})"/g); if (s) for (const x of s) { const d = dv(x); if (KW.test(d)) hit.bao.push(i + 1 + ': ' + d.slice(0, 110)); } }
    const f = l.match(/^\s*function\s+(x\d+_(OnDefaultEvent|OnEventRequest|OnEnumerate|OnActivateOnce|OnConditionCheck|OnUse)\b)/);
    if (f) { for (let j = i + 1; j < Math.min(i + 6, L.length); j++) { const s = L[j].trim(); if (!s || s.startsWith('--')) continue; if (/^return\b/.test(s) && !/^return\s+1\b/.test(s)) hit.chan.push(i + 1 + ': ' + f[1] + ' -> ' + s.slice(0, 40)); break; } }
  });
  if (hit.menu.length || hit.bao.length || hit.chan.length) out.push(hit);
}
walk(S);
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
const npc = out.filter((h) => h.npc);
console.log('file co dau hieu:', out.length, '| trong do NPC dang dat tren ban do:', npc.length);
console.log('muc menu bi comment:', out.reduce((a, h) => a + h.menu.length, 0), '| cau bao chua mo/tam dong:', out.reduce((a, h) => a + h.bao.length, 0), '| ham su kien return ngay:', out.reduce((a, h) => a + h.chan.length, 0));
