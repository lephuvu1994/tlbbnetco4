// 20/10 (chu server): "cho nam chung" - ban Thuong cua Gioi / Ngoc cung 1 bo dong + diem nhu ma su kien:
//   Gioi: 10422016 (su kien, giao dich duoc) -> 10553101 (doi NPC, khoa khi mac) + 10553113 (shop ke 213, khoa)
//   Ngoc: 10423024 (su kien, giao dich duoc) -> 10553102 (doi NPC, khoa khi mac) + 10553114 (shop ke 213, khoa)
// Hieu ung da chung tu truoc (hu 5952/5953 rate 2, 5954/5955 dur 5000 = ban moi 2% / 5 giay). Ban Chan 10553104 / 10553105 KHONG dung.
// Qua API cong SUPER (/api/gm/trunglau op mon), sao luu trunglau.json truoc. Hieu luc sau RESTART game.
// Chay tren VPS: node /tmp/trunglau-chung.js [--ghi]
const fs = require('fs');
const env = fs.readFileSync('/opt/minigame/BotDoMin/.env', 'utf8');
const pw = (env.match(/^PANEL_SUPER_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');
const B = 'http://127.0.0.1:1508', GHI = process.argv.includes('--ghi');
const CFG = '/opt/tlbb-root/home/tlbb/Server/txt/NetCo4Cfg/trunglau.json';
const CHEP = { '10422016': ['10553101', '10553113'], '10423024': ['10553102', '10553114'] };
(async () => {
  const cfg = JSON.parse(fs.readFileSync(CFG, 'utf8'));
  const bk = '/opt/tlbb-backup/trunglau-truoc-chung-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
  fs.copyFileSync(CFG, bk); console.log('sao luu:', bk);
  const lg = await (await fetch(B + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).json();
  if (!lg.token) throw new Error('dang nhap that bai');
  const H = { Authorization: 'Bearer ' + lg.token, 'Content-Type': 'application/json' };
  for (const [goc, dich] of Object.entries(CHEP)) {
    const m = cfg.mon[goc];
    if (!m) throw new Error('ma goc ' + goc + ' chua co cau hinh');
    for (const id of dich) {
      const cu = cfg.mon[id];
      console.log(goc, '->', id, '| dong', m.dong.length, (m.so ? 'so ' + m.so.join('-') : 'ra du'), '| truoc:', cu ? cu.dong.length + ' dong custom' : 'chua custom (chi so goc 13 dong)');
      if (!GHI) continue;
      const r = await (await fetch(B + '/api/gm/trunglau', { method: 'POST', headers: H, body: JSON.stringify({ op: 'mon', id, dong: m.dong, diem: m.diem, so: m.so }) })).json();
      if (!r.ok) throw new Error(id + ': ' + (r.error || r.msg));
      console.log('   OK:', String(r.msg || '').slice(0, 160));
    }
  }
  if (!GHI) return console.log('(chay thu, them --ghi de luu)');
  const sau = JSON.parse(fs.readFileSync(CFG, 'utf8')).mon;
  for (const [goc, dich] of Object.entries(CHEP)) for (const id of dich)
    console.log('kiem', id, JSON.stringify(sau[id].dong) === JSON.stringify(sau[goc].dong) && JSON.stringify(sau[id].diem) === JSON.stringify(sau[goc].diem) ? 'GIONG ' + goc : 'KHAC!');
})().catch((e) => { console.error('LOI', e.message); process.exit(1); });
