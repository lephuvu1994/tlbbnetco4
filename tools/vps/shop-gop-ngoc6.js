// 20/10 (chu server): Shop web (user portal) - gop nhom "💎 Ngoc 6 Cong" (key ammo) + "💎 Ngoc 6 Thu" (key material)
// thanh 1 nhom "💎 Ngoc 6" (giu key ammo; moi mon material -> ammo; xoa nhom material). Han mua 2 nhom giong nhau
// (server / theo tung mon / 400) va dem theo MON nen gop khong doi han. Qua API cong SUPER, sao luu truoc.
// Chay tren VPS: node /tmp/shop-gop-ngoc6.js [--ghi]   (khong --ghi = chi xem)
const fs = require('fs');
const env = fs.readFileSync('/opt/minigame/BotDoMin/.env', 'utf8');
const pw = (env.match(/^PANEL_SUPER_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');
const B = 'http://127.0.0.1:1508', GHI = process.argv.includes('--ghi');
const TU = 'material', VE = 'ammo', TEN = '💎 Ngọc 6';
(async () => {
  const lg = await (await fetch(B + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).json();
  if (!lg.token) throw new Error('dang nhap that bai');
  const H = { Authorization: 'Bearer ' + lg.token, 'Content-Type': 'application/json' };
  const st = await (await fetch(B + '/api/state', { method: 'POST', headers: H, body: '{}' })).json();
  const S = st.state || st;
  const items = S.itemShop, cats = S.itemCats, ver = S.itemShopVer;
  if (!Array.isArray(items) || !Array.isArray(cats) || !ver) throw new Error('khong doc duoc shop / nhom / ver');
  const bk = '/opt/tlbb-backup/shop-truoc-gop-ngoc6-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
  fs.writeFileSync(bk, JSON.stringify({ items, cats, ver }, null, 1)); console.log('sao luu:', bk);
  const nTu = items.filter(x => x.cat === TU).length, nVe = items.filter(x => x.cat === VE).length;
  console.log('mon:', items.length, '| ' + VE + ':', nVe, '| ' + TU + ':', nTu, '| nhom:', cats.map(c => c.key + '=' + c.label).join(' ; '));
  if (!cats.some(c => c.key === VE)) throw new Error('khong co nhom ' + VE);
  const items2 = items.map(x => ({ id: x.id, name: x.name, price: x.price, max: x.max, img: x.img, cat: x.cat === TU ? VE : x.cat, note: x.note, off: !!x.off }));
  const cats2 = cats.filter(c => c.key !== TU).map(c => ({ key: c.key, label: c.key === VE ? TEN : c.label }));
  console.log('sau: ' + VE + ' =', items2.filter(x => x.cat === VE).length, 'mon, ten "' + TEN + '" | nhom con lai:', cats2.length);
  if (!GHI) return console.log('(chay thu, them --ghi de luu)');
  const r1 = await (await fetch(B + '/api/itemshop/save', { method: 'POST', headers: H, body: JSON.stringify({ items: items2, ver }) })).json();
  if (!r1.ok) throw new Error('luu shop loi: ' + r1.error);
  console.log('luu shop OK:', r1.items.length, 'mon, ' + TU + ' con', r1.items.filter(x => x.cat === TU).length);
  const r2 = await (await fetch(B + '/api/itemcats/save', { method: 'POST', headers: H, body: JSON.stringify({ cats: cats2 }) })).json();
  if (!r2.ok) throw new Error('luu nhom loi: ' + r2.error);
  console.log('luu nhom OK:', JSON.stringify(r2).slice(0, 300));
})().catch((e) => { console.error('LOI', e.message); process.exit(1); });
