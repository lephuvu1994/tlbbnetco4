// 18/10 (chu server): Shop web (bot) - nhom "Chan Nguyen" + 19 Chan Nguyen bac 5 cap 1 (38501001-38519001), 60.000 KNB / vien.
// Chay tren VPS: node /tmp/shop-chan-nguyen.js          (chi xem se lam gi)
//                node /tmp/shop-chan-nguyen.js --ghi    (sao luu bang shop -> /opt/tlbb-backup, them nhom + mon, luu kem ver)
// Dang nhap cong SUPER bot nhu tb-cfg.js (mat khau doc tu .env, KHONG in). Mon da co trong shop thi bo qua (khong sua).
const fs = require('fs');
const GIA = 60000, NHOM = '💠 Chân Nguyên';
const MON = [
  ['38501001', 'Cường Lực'], ['38502001', 'Nội Lực'], ['38503001', 'Thể Lực'], ['38504001', 'Trí Lực'], ['38505001', 'Thân Pháp'],
  ['38506001', 'Huyết'], ['38507001', 'Khí Nộ'], ['38508001', 'Nội Công'], ['38509001', 'Ngoại Công'], ['38510001', 'Nội Thủ'],
  ['38511001', 'Ngoại Thủ'], ['38512001', 'Chính Xác'], ['38513001', 'Né Tránh'], ['38514001', 'Hội Công'], ['38515001', 'Hội Thủ'],
  ['38516001', 'Băng'], ['38517001', 'Hỏa'], ['38518001', 'Huyền'], ['38519001', 'Độc'],
];
const GHI = process.argv.includes('--ghi');
const env = fs.readFileSync('/opt/minigame/BotDoMin/.env', 'utf8');
const pw = (env.match(/^PANEL_SUPER_PASSWORD=(.*)$/m) || [])[1].trim().replace(/^['"]|['"]$/g, '');
const B = 'http://127.0.0.1:1508';
(async () => {
  const lg = await (await fetch(B + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })).json();
  if (!lg.token) throw new Error('dang nhap that bai');
  const H = { Authorization: 'Bearer ' + lg.token, 'Content-Type': 'application/json' };
  const post = async (p, b) => { const r = await fetch(B + p, { method: 'POST', headers: H, body: JSON.stringify(b) }); const j = await r.json(); if (!r.ok || j.ok === false) throw new Error(p + ': ' + (j.error || r.status)); return j; };
  const st = ((await (await fetch(B + '/api/state', { headers: H })).json()).state) || {};
  const items = Array.isArray(st.itemShop) ? st.itemShop : null, cats = Array.isArray(st.itemCats) ? st.itemCats : null;
  if (!items || !cats || st.itemShopVer === undefined) throw new Error('/api/state thieu itemShop / itemCats / itemShopVer');
  console.log('shop hien tai:', items.length, 'mon, ver', st.itemShopVer, '| nhom:', cats.map((c) => c.key + '=' + c.label).join(', '));
  // nhom co san ten "Chan Nguyen" (bo emoji / hoa thuong) thi dung luon - 18/10 shop da co g4 = "Chân Nguyên"
  const chuan = (s) => String(s || '').replace(/[^\p{L}\p{N} ]/gu, '').trim().toLowerCase();
  let nhom = cats.find((c) => chuan(c.label) === chuan(NHOM));
  const co = new Set(items.map((x) => String(x.id)));
  const them = MON.filter(([id]) => !co.has(id));
  console.log('nhom', NHOM, nhom ? 'DA CO (key ' + nhom.key + ')' : 'CHUA CO -> se tao');
  console.log('se them', them.length, 'mon (bo qua', MON.length - them.length, 'mon da co):', them.map(([id, t]) => id + ' ' + t).join(' | '));
  if (items.length + them.length > 300) console.log('vuot tran 300 mon -> se xoa', items.length + them.length - 300, 'mon dang an (Rac -> Tap hoa -> Ngoc)');
  if (!GHI) { console.log('-- chi xem. Chay lai voi --ghi de ghi.'); return; }
  const bk = '/opt/tlbb-backup/shop-web-truoc-chan-nguyen-' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + '.json';
  fs.writeFileSync(bk, JSON.stringify({ itemShop: items, itemCats: cats, ver: st.itemShopVer }, null, 1));
  console.log('sao luu:', bk);
  if (!nhom) {
    const r = await post('/api/itemcats/save', { cats: cats.map((c) => ({ key: c.key, label: c.label })).concat([{ label: NHOM }]) });
    const ds = r.cats || r.list || ((await (await fetch(B + '/api/state', { headers: H })).json()).state || {}).itemCats;
    nhom = (ds || []).find((c) => c.label === NHOM);
    if (!nhom) throw new Error('tao nhom xong nhung khong thay key');
    console.log('da tao nhom key', nhom.key);
  }
  // 18/10: bot cat shop o 300 mon (index.js .slice(0, 300), CAT IM) -> chu server chot: xoa mon dang AN de lay cho,
  // uu tien nhom Rac roi Tap hoa roi Ngoc (khong dung nhom Chan Nguyen / Yeu Quyet / Bi Tich). Da sao luu o tren.
  let goc = items;
  const du = goc.length + them.length - 300;
  if (du > 0) {
    const bo = [];
    for (const cat of ['rac', 'consume', 'ammo']) for (const x of goc) if (bo.length < du && x.off && x.cat === cat) bo.push(x);
    if (bo.length < du) throw new Error('khong du mon an de xoa (' + bo.length + '/' + du + ')');
    const boId = new Set(bo.map((x) => x));
    goc = goc.filter((x) => !boId.has(x));
    console.log('xoa', bo.length, 'mon dang an:', bo.map((x) => x.id + ' ' + x.name + ' [' + x.cat + ']').join(' | '));
  }
  const moi = goc.concat(them.map(([id, t]) => ({ id, name: 'CN-' + t + ' (bậc 5, cấp 1)', price: GIA, max: 999, img: '', cat: nhom.key, note: 'Chân Nguyên bậc 5 cấp 1', off: false })));
  const r = await post('/api/itemshop/save', { items: moi, ver: st.itemShopVer });
  console.log('da luu shop:', r.items.length, 'mon; nhom', nhom.key, 'co', r.items.filter((x) => x.cat === nhom.key).length, 'mon');
})().catch((e) => { console.error('LOI', e.message); process.exit(1); });
