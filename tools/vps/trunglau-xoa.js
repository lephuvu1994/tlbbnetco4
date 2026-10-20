// Go cau hinh Custom Trung Lau cua 1 hoac nhieu ma (ve chi so goc cua game) qua API cong SUPER (/api/gm/trunglau op xoa).
// 20/10: go 10553113 / 10553114 (ma admin cap, chu server custom rieng sau) - truoc do lo chep cau hinh su kien vao.
// Sao luu trunglau.json truoc. Hieu luc sau RESTART game. Chay tren VPS: node /tmp/trunglau-xoa.js <ma> [<ma>...] [--ghi]
const fs = require('fs');
const env = fs.readFileSync('/opt/minigame/BotDoMin/.env', 'utf8');
const pw = (env.match(/^PANEL_SUPER_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');
const B = 'http://127.0.0.1:1508', GHI = process.argv.includes('--ghi');
const CFG = '/opt/tlbb-root/home/tlbb/Server/txt/NetCo4Cfg/trunglau.json';
const ids = process.argv.slice(2).filter(x => /^\d{8}$/.test(x));
(async () => {
  if (!ids.length) throw new Error('chua chon ma');
  const cfg = JSON.parse(fs.readFileSync(CFG, 'utf8'));
  const bk = '/opt/tlbb-backup/trunglau-truoc-xoa-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
  fs.copyFileSync(CFG, bk); console.log('sao luu:', bk);
  for (const id of ids) console.log(id, cfg.mon[id] ? 'dang custom ' + cfg.mon[id].dong.length + ' dong -> go' : 'khong co custom (bo qua)');
  if (!GHI) return console.log('(chay thu, them --ghi de luu)');
  const lg = await (await fetch(B + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).json();
  if (!lg.token) throw new Error('dang nhap that bai');
  const H = { Authorization: 'Bearer ' + lg.token, 'Content-Type': 'application/json' };
  for (const id of ids) {
    if (!cfg.mon[id]) continue;
    const r = await (await fetch(B + '/api/gm/trunglau', { method: 'POST', headers: H, body: JSON.stringify({ op: 'xoa', id }) })).json();
    if (!r.ok) throw new Error(id + ': ' + (r.error || r.msg));
    console.log(id, 'OK:', String(r.msg || '').slice(0, 160));
  }
  const sau = JSON.parse(fs.readFileSync(CFG, 'utf8')).mon;
  console.log('ma con custom:', Object.keys(sau).sort().join(' '));
})().catch((e) => { console.error('LOI', e.message); process.exit(1); });
