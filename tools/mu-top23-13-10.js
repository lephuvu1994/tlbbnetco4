// 13/10 (chu server): 2 mu Giang Sinh nua cho TOP 2 / TOP 3 (Trung Lau Khoi 10410121 = top 1). Cung kieu dang Hoan Lac (hinh 287).
//   top 2 = 10410127 (cap 92), top 3 = 10410126 (cap 82). Dong / diem dat tren trang Custom Trung Lau (panel/trunglau.py IDS -> doan 4528 / 4529).
//  1. EquipBase: giong cach lap 10410121 (tools/trunglau-khoi-09-10.js) - 9 sao (quy tac 9), doan 100 (goc), 11 dong (them Gioi han SL cot 32),
//     hieu ung than khi rieng. Doan goc 102 / 92 (theo cap) -> 100 nhu 10410121 (bo dong game co giong het; so that = doan rieng). Giu cap / phong thu / do ben cua mu (tooltip client doc bang client).
//  2. StandardImpact 7581 / 7582 = chep 7580 (logic 88, danh trung 100% kich hoat, nhom loai tru rieng), he so sat thuong (cot 40,
//     "伤害修正率，填100相当于将伤害放大到2倍") 10 -> 9 (top 2, +9%) / 7 (top 3, +7%). Icon buff 755 giu nguyen (chu client ghi "10%").
// File latin1, giu CR. Rollback: tag truoc-mu-top23-13-10.   node tools/mu-top23-13-10.js [--ghi]
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'server'); const GHI = process.argv.includes('--ghi'); let loi = 0;
const doc = (f) => fs.readFileSync(path.join(R, f), 'latin1'); const ghi = (f, s) => { if (GHI && !loi) fs.writeFileSync(path.join(R, f), s, 'latin1'); };
const MU = [['10410127', '7581', '9'], ['10410126', '7582', '7']];   // 13/10 ban 2: 7582 doi tiep 7 -> 8 (scratchpad mu/sua-ban2.js) - tool nay chi dung lap lan dau
const dem = (s) => { let c = 0; for (let i = 0; i < s.length; i++) if (s.charCodeAt(i) > 127) c++; return c; };

// 1. EquipBase
{
  const f = 'Public/Config/EquipBase.txt'; const goc = doc(f); const L = goc.split('\n');
  for (const [id, hu] of MU) {
    const i = L.findIndex((l) => l.startsWith(id + '\t'));
    if (i < 0) { console.log('LOI EquipBase: khong co ' + id); loi++; continue; }
    const cr = L[i].endsWith('\r') ? '\r' : ''; const c = L[i].replace(/\r$/, '').split('\t');
    if (c[5] !== '1' || c[90] !== '5' || c[19] !== '-1') { console.log('LOI EquipBase: dong ' + id + ' khong nhu mong doi', c[5], c[90], c[19], c[91]); loi++; continue; }
    Object.assign(c, { 19: hu, 32: '1', 90: '9', 91: '100', 92: '11', 93: '11' });
    L[i] = c.join('\t') + cr;
    console.log('EquipBase ' + id + ': 9 sao, 11 dong, hieu ung ' + hu + ', cap ' + c[11]);
  }
  const moi = L.join('\n');
  if (dem(moi) !== dem(goc)) { console.log('LOI EquipBase: lech byte'); loi++; }
  ghi(f, moi);
}
// 2. StandardImpact 7581 / 7582 (chep 7580, chen ngay sau 7580 - kiem thu tu tang dan)
{
  const f = 'Server/Config/StandardImpact.txt'; const goc = doc(f); const L = goc.split('\n');
  const id = (l) => (/^\d+\t/.test(l) ? +l.split('\t')[0] : NaN);
  const i0 = L.findIndex((l) => id(l) === 7580);
  if (i0 < 0) { console.log('LOI: khong co 7580'); loi++; }
  for (const [, hu] of MU) if (L.some((l) => id(l) === +hu)) { console.log('LOI: ' + hu + ' da co'); loi++; }
  const cr = L[i0].endsWith('\r') ? '\r' : ''; const c0 = L[i0].replace(/\r$/, '').split('\t');
  if (c0[2] !== '88' || c0[7] !== '7580' || c0[40] !== '10') { console.log('LOI: 7580 khac mong doi', c0[2], c0[7], c0[40]); loi++; }
  let sau = i0 + 1; while (sau < L.length && isNaN(id(L[sau])) && L[sau].trim() !== '') sau++;
  if (!loi && !(id(L[sau]) > 7582 || L[sau].trim() === '')) { console.log('LOI: dong sau 7580 la ' + id(L[sau])); loi++; }
  const them = MU.map(([, hu, hs]) => { const c = c0.slice(); c[0] = hu; c[7] = hu; c[40] = hs; return c.join('\t') + cr; });
  L.splice(i0 + 1, 0, ...them);
  const moi = L.join('\n');
  if (dem(moi) !== dem(goc) + 2 * dem(c0.join('	'))) { console.log('LOI StandardImpact: lech byte'); loi++; }
  console.log('StandardImpact: them ' + MU.map(([, hu, hs]) => hu + ' (+' + hs + '% sat thuong)').join(', ') + ' ngay sau 7580');
  ghi(f, moi);
}
console.log(loi ? 'CO LOI - khong ghi' : GHI ? 'DA GHI' : 'chay thu OK (them --ghi de ghi)'); process.exit(loi ? 1 : 0);
