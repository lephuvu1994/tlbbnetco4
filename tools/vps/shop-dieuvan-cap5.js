// 20/10 (chu server): Shop web nhom "Dieu Van cap 1" (key g3, 12 mon) -> ban san CAP 5:
//   ma cap 1 (3011xxx1) -> cap 5 (+4), ten "cap 1" -> "cap 5",
//   gia = gia cap 1 + Kim Tam Ti de cuong hoa 1->5 x 95 KNB.
// Kim Tam Ti cuong hoa dieu van (MyLua/diaowen/aHaDiaoWenSys_1.lua x809272_DWQianghua needCailiao = {2,9,50,87,...}):
//   1->2: 2, 2->3: 9, 3->4: 50, 4->5: 87 => 148 vien x 95 = 14.060 KNB.
// Khac mon cap 5 len do ra dung dieu van cap 5 (DWShike: cllevel = mod(ma, 10)).
// Qua API cong SUPER (/api/itemshop/save kem ver), sao luu truoc. Chay tren VPS: node /tmp/shop-dieuvan-cap5.js [--ghi]
const fs = require('fs');
const env = fs.readFileSync('/opt/minigame/BotDoMin/.env', 'utf8');
const pw = (env.match(/^PANEL_SUPER_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');
const B = 'http://127.0.0.1:1508', GHI = process.argv.includes('--ghi');
const KTT = 2 + 9 + 50 + 87, GIA_KTT = 95, THEM = KTT * GIA_KTT;
(async () => {
  const lg = await (await fetch(B + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).json();
  if (!lg.token) throw new Error('dang nhap that bai');
  const H = { Authorization: 'Bearer ' + lg.token, 'Content-Type': 'application/json' };
  const st = await (await fetch(B + '/api/state', { method: 'POST', headers: H, body: '{}' })).json();
  const S = st.state || st, items = S.itemShop, ver = S.itemShopVer;
  if (!Array.isArray(items) || !ver) throw new Error('khong doc duoc shop / ver');
  const gi = await (await fetch(B + '/api/gameitems', { method: 'POST', headers: H, body: '{}' })).json();
  const ten = new Map((gi.items || []).map(x => [String(x.id), x.n]));
  const bk = '/opt/tlbb-backup/shop-truoc-dieuvan-cap5-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json';
  fs.writeFileSync(bk, JSON.stringify({ items, ver }, null, 1)); console.log('sao luu:', bk, '| KTT 1->5 =', KTT, 'vien x', GIA_KTT, '=', THEM);
  const ids = new Set(items.map(x => String(x.id)));
  let doi = 0;
  const items2 = items.map(x => {
    const o = { id: x.id, name: x.name, price: x.price, max: x.max, img: x.img, cat: x.cat, note: x.note, off: !!x.off };
    if (x.cat !== 'g3' || !/^3011\d{3}1$/.test(String(x.id))) return o;
    const moi = String(Number(x.id) + 4);
    if (!ten.has(moi)) throw new Error('ma ' + moi + ' khong co trong danh muc game');
    if (ids.has(moi)) throw new Error('ma ' + moi + ' da co trong shop');
    o.id = moi; o.name = String(x.name).replace(/cấp 1\b/, 'cấp 5'); o.price = Number(x.price) + THEM; doi++;
    console.log(x.id, '->', moi, '|', x.name, '->', o.name, '|', x.price, '->', o.price, '| game:', ten.get(moi));
    return o;
  });
  if (doi !== 12) throw new Error('doi ' + doi + ' mon (can 12)');
  if (!GHI) return console.log('(chay thu, them --ghi de luu)');
  const r = await (await fetch(B + '/api/itemshop/save', { method: 'POST', headers: H, body: JSON.stringify({ items: items2, ver }) })).json();
  if (!r.ok) throw new Error('luu loi: ' + r.error);
  console.log('DA LUU:', r.items.length, 'mon; g3:', r.items.filter(x => x.cat === 'g3').map(x => x.id + '=' + x.price).join(' '));
  // ten nhom "Dieu Van cap 1" -> "Dieu Van cap 5" (giu key g3, giu thu tu + ten cac nhom khac)
  const cats = (S.itemCats || []).map(c => ({ key: c.key, label: c.key === 'g3' ? String(c.label).replace(/cấp 1\b/, 'cấp 5') : c.label }));
  const r2 = await (await fetch(B + '/api/itemcats/save', { method: 'POST', headers: H, body: JSON.stringify({ cats }) })).json();
  if (!r2.ok) throw new Error('luu ten nhom loi: ' + r2.error);
  console.log('ten nhom g3:', (r2.cats || []).filter(c => c.key === 'g3').map(c => c.label).join(''));
})().catch((e) => { console.error('LOI', e.message); process.exit(1); });
