// 17/10 (chu server): them DU 24 Yeu Quyet tam phap cuoi (2 cuon x 12 phai: 30308112-30308133 + Quy Coc 30308139/30308140)
// vao MOI dong tui boss dang co Yeu Quyet (30307200-30308140). Giu nguyen ID cu, so luong, KNB, tran ngay, luot.
// Luu qua API cong SUPER (mat khau doc tu .env, khong in). Sao luu cau hinh truoc vao /opt/tlbb-backup.
// Chay tren VPS: node /tmp/tb-them-yq.js [--ghi]   (khong --ghi = chi xem)
const fs = require('fs');
const env = fs.readFileSync('/opt/minigame/BotDoMin/.env', 'utf8');
const pw = (env.match(/^PANEL_SUPER_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');
const B = 'http://127.0.0.1:1508';
const GHI = process.argv.includes('--ghi');
const YQ_CUOI = []; for (let i = 30308112; i <= 30308133; i++) YQ_CUOI.push(i); YQ_CUOI.push(30308139, 30308140);
const laYQ = (x) => x >= 30307200 && x <= 30308140;
(async () => {
  const lg = await (await fetch(B + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).json();
  if (!lg.token) throw new Error('dang nhap that bai');
  const H = { Authorization: 'Bearer ' + lg.token, 'Content-Type': 'application/json' };
  const st = await (await fetch(B + '/api/tuiboss/cfg', { headers: H })).json();
  const bk = '/opt/tlbb-backup/tuiboss-cfg-truoc-yqcuoi-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
  fs.writeFileSync(bk, JSON.stringify(st, null, 1)); console.log('sao luu:', bk);
  for (const h of st.ds) {
    let doi = 0;
    const mon = h.mon.map((m) => {
      if (!m.ids.some(laYQ)) return { ids: m.ids, min: m.min, max: m.max };
      const them = YQ_CUOI.filter((x) => !m.ids.includes(x));
      doi += them.length;
      return { ids: m.ids.concat(them), min: m.min, max: m.max };
    });
    if (!doi) continue;
    console.log(h.hd.padEnd(10), h.ten, '| them', doi, 'cuon | dong YQ moi:', mon.filter((m) => m.ids.some(laYQ)).map((m) => m.ids.length + ' ID, sl ' + m.min + '-' + m.max).join(' ; '));
    if (!GHI) continue;
    const r = await (await fetch(B + '/api/tuiboss/save', { method: 'POST', headers: H, body: JSON.stringify({ hd: h.hd, on: h.on, knb: h.knb, ngay: h.ngay, luot: h.luot, mon }) })).json();
    console.log('   ->', r.ok ? 'OK' : 'LOI ' + r.error);
  }
})().catch((e) => { console.error('LOI', e.message); process.exit(1); });
