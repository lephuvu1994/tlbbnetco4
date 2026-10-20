// 20/10 (chu server): Ghep Ngoc - them mon dich "ao 9 sao" (20 mau thoi trang 9 sao, mau 1 - nhuom trong game ra mau khac,
// mau nao cung 9 sao, TRANG-THAI 09-10/10) + "thu cuoi 9 sao" 10141214 (Huyen Tuyet Duong Da C9, CAN-BANG 07/10).
// Moi mon gia tri 2.000.000, thang nhan 1. Them vao dich.rieng (giu nguyen moi cau hinh khac). Qua API cong SUPER, sao luu truoc.
// Chay tren VPS: node /tmp/gn-ao9-thucuoi9.js [--ghi]   (khong --ghi = chi xem)
const fs = require('fs');
const env = fs.readFileSync('/opt/minigame/BotDoMin/.env', 'utf8');
const pw = (env.match(/^PANEL_SUPER_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');
const B = 'http://127.0.0.1:1508', GHI = process.argv.includes('--ghi');
const GIA = 2000000;
const AO9 = ['10553236', '10553281', '10553308', '10553326', '10553344', '10553353', '10553362', '10553371', '10553380', '10553389',
  '10553398', '10553407', '10553416', '10553425', '10553434', '10553443', '10553452', '10553461', '10553470', '10553479'];
const THU9 = ['10141214'];
(async () => {
  const lg = await (await fetch(B + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).json();
  if (!lg.token) throw new Error('dang nhap that bai');
  const H = { Authorization: 'Bearer ' + lg.token, 'Content-Type': 'application/json' };
  const st = await (await fetch(B + '/api/gn/cfg', { method: 'POST', headers: H, body: '{}' })).json();
  if (!st.ok || !st.cfg || !st.cfg.dich || !st.cfg.dich.rieng) throw new Error('khong doc duoc cau hinh Ghep Ngoc: ' + (st.error || ''));
  const cfg = st.cfg;
  const bk = '/opt/tlbb-backup/gn-cfg-truoc-ao9-thucuoi9-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
  fs.writeFileSync(bk, JSON.stringify(cfg, null, 1)); console.log('sao luu:', bk);
  const ten = new Map((st.dichTen || []).map((x) => [String(x.id), x.ten]));
  // ten mon tu kho do cua bot (tim theo ma) de kiem ma co that
  const tim = async (q) => (await (await fetch(B + '/api/gn/tim', { method: 'POST', headers: H, body: JSON.stringify({ q }) })).json()).items || [];
  let them = 0, sua = 0;
  for (const id of AO9.concat(THU9)) {
    const kq = (await tim(id)).find((x) => String(x.id) === id);
    if (!kq) throw new Error('khong thay ma ' + id + ' trong kho do game - DUNG, khong luu gi');
    const cu = cfg.dich.rieng[id];
    if (cu && cu.gia === GIA && cu.sl === 1 && !cu.off) { console.log('  da co', id, kq.ten); continue; }
    cu ? sua++ : them++;
    cfg.dich.rieng[id] = { gia: GIA, sl: 1, off: false };
    console.log('  ' + (cu ? 'sua ' : 'them') + ' ' + id + ' ' + (kq.ten || ten.get(id) || '?') + ' = ' + GIA.toLocaleString('vi-VN'));
  }
  console.log('them', them, '| sua', sua, '| tong mon dich rieng:', Object.keys(cfg.dich.rieng).length);
  if (!them && !sua) return console.log('khong co gi doi');
  if (!GHI) return console.log('(chay thu, them --ghi de luu)');
  const r = await (await fetch(B + '/api/gn/save', { method: 'POST', headers: H, body: JSON.stringify(cfg) })).json();
  if (!r.ok) throw new Error('luu loi: ' + r.error);
  const lai = await (await fetch(B + '/api/gn/cfg', { method: 'POST', headers: H, body: '{}' })).json();   // đọc lại từ server để kiểm
  const sau = (lai.cfg && lai.cfg.dich && lai.cfg.dich.rieng) || {};
  const thieu = AO9.concat(THU9).filter((id) => !(sau[id] && sau[id].gia === GIA));
  console.log('luu OK -', thieu.length ? 'THIEU ' + thieu.join(',') : 'du ' + (AO9.length + THU9.length) + ' mon gia ' + GIA.toLocaleString('vi-VN'));
})().catch((e) => { console.error('LOI', e.message); process.exit(1); });
