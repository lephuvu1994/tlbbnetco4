// Chi doc: dang nhap cong SUPER bot (mat khau doc tu .env, KHONG in), lay cau hinh tui boss, in cac mon co Yeu Quyet (30307200-30308140).
// Chay tren VPS: node /tmp/tb-cfg.js [luu-file.json]
const fs = require('fs');
const env = fs.readFileSync('/opt/minigame/BotDoMin/.env', 'utf8');
const pw = (env.match(/^PANEL_SUPER_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');
const B = 'http://127.0.0.1:1508';
(async () => {
  const lg = await (await fetch(B + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).json();
  if (!lg.token) throw new Error('dang nhap that bai');
  const st = await (await fetch(B + '/api/tuiboss/cfg', { headers: { Authorization: 'Bearer ' + lg.token } })).json();
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(st, null, 1));
  const laYQ = (x) => x >= 30307200 && x <= 30308140;
  const cfg = st.cfg || st.hd || st;
  console.log('khoa state:', Object.keys(st).join(','));
  for (const [hd, v] of Object.entries(cfg)) {
    if (!v || !Array.isArray(v.mon)) continue;
    v.mon.forEach((m, i) => {
      const ids = Array.isArray(m[0]) ? m[0] : [m[0]];
      const yq = ids.filter(laYQ);
      if (yq.length) console.log(hd, v.ten || '', 'mon#' + i, 'so ID', ids.length, 'YQ', yq.length, 'sl', JSON.stringify(m[1]), '| co 139/140:', ids.includes(30308139), ids.includes(30308140), '| thieu tien:', [30308112,30308113,30308114,30308115,30308116,30308117,30308118,30308119,30308120,30308121,30308122,30308123,30308124,30308125,30308126,30308127,30308128,30308129,30308130,30308131,30308132,30308133,30308139,30308140].filter((x) => !ids.includes(x)).join(','));
    });
  }
})().catch((e) => { console.error('LOI', e.message); process.exit(1); });
