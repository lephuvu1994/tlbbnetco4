// 19/10 (chu server): Vong quay may man - bo qua Hon Bang Chau (20309101-110) thay bang 5 o:
//   cap 1 x50, cap 2 x20, cap 3 x10, cap 4 x5, cap 5 x1 (trong so 150 moi o nhu cac o cu). Bo o cap 7 (vo dung).
// Giu nguyen gia / so lan quay / bat-tat / moi mon khac. Luu qua API cong SUPER (/api/vq/save), sao luu cau hinh truoc.
// Chay tren VPS: node /tmp/vq-hbc-19-10.js [--ghi]   (khong --ghi = chi xem)
const fs = require('fs');
const env = fs.readFileSync('/opt/minigame/BotDoMin/.env', 'utf8');
const pw = (env.match(/^PANEL_SUPER_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');
const B = 'http://127.0.0.1:1508', GHI = process.argv.includes('--ghi');
const MOI = [[20309101, 50], [20309102, 20], [20309103, 10], [20309104, 5], [20309105, 1]];
const laHBC = (id) => id >= 20309101 && id <= 20309110;
(async () => {
  const lg = await (await fetch(B + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).json();
  if (!lg.token) throw new Error('dang nhap that bai');
  const H = { Authorization: 'Bearer ' + lg.token, 'Content-Type': 'application/json' };
  const st = await (await fetch(B + '/api/vq/cfg', { method: 'POST', headers: H, body: '{}' })).json();
  if (!st.ok || !Array.isArray(st.pool)) throw new Error('khong doc duoc cau hinh: ' + JSON.stringify(st).slice(0, 200));
  if (st.cfg.macDinh) throw new Error('dang dung bo qua mac dinh - dung lai, kiem tra tay');
  const bk = '/opt/tlbb-backup/vq-cfg-truoc-hbc-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
  fs.writeFileSync(bk, JSON.stringify(st, null, 1)); console.log('sao luu:', bk);
  const cu = st.pool.filter((x) => laHBC(x.id));
  console.log('cfg:', JSON.stringify(st.cfg), '| tong mon:', st.pool.length, '| HBC cu:', cu.map((x) => x.id + ' x' + x.sl + ' w' + x.w + (x.off ? ' TAT' : '')).join(', '));
  const w = cu.length ? cu[0].w : 150, viTri = st.pool.findIndex((x) => laHBC(x.id));
  const giu = st.pool.filter((x) => !laHBC(x.id)).map((x) => ({ id: x.id, sl: x.sl, w: x.w, off: !!x.off }));
  const them = MOI.map(([id, sl]) => ({ id, sl, w, off: false }));
  const pool = viTri < 0 ? giu.concat(them) : giu.slice(0, viTri).concat(them, giu.slice(viTri));
  console.log('HBC moi:', them.map((x) => x.id + ' x' + x.sl + ' w' + x.w).join(', '), '| tong mon moi:', pool.length);
  if (!GHI) return console.log('(chay thu, them --ghi de luu)');
  const r = await (await fetch(B + '/api/vq/save', { method: 'POST', headers: H, body: JSON.stringify({ on: st.cfg.on, gia: st.cfg.gia, max: st.cfg.max, pool }) })).json();
  if (!r.ok) throw new Error('luu loi: ' + r.error);
  console.log('DA LUU. HBC tren vong quay:', r.pool.filter((x) => laHBC(x.id)).map((x) => x.ten + ' x' + x.sl + ' (w' + x.w + ')').join(' | '), '| tong mon:', r.pool.length);
})().catch((e) => { console.error('LOI', e.message); process.exit(1); });
