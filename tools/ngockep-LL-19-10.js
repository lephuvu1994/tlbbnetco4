// 19/10 (chu server): ngoc kep Minh Tinh Thach - cong thuc goc ra SAI cap.
// Client (giao dien Bao Thach Trac Khac): "hieu qua cong cua Minh Tinh Thach = Thuan Tinh Linh Thach dung de khac + 1 cap", Thuan Tinh
// khong duoc cao hon cap Minh Thach. GemInfo khop: L-x cong = Thuan Tinh cap x+1 (7-1 = 23 = TT2, 7-6 = 230 = TT7, 7-7 = 290).
// Bang Gem_ZuoKeFenLi.lua (290205) lai cho Minh Thach L + Thuan Tinh L -> L-1 (bo 4 vien TT7 230 cong ra 23 cong).
// Sua: dong goc (ngoc chinh = Minh Thach L 50L2100c, ngoc phu = Thuan Tinh L cung mau 50L0200(4+c)) -> ket qua L-L (50L21c0L).
// Giu nguyen cac dong nang dan L-x -> L-(x+1) (vien L-x da lo ghep van len tiep duoc).
// Lua, can cap-nhat, khong restart. Chay: node tools/ngockep-LL-19-10.js. Rollback: tag truoc-ngockep-LL-19-10
const fs = require('fs');
const R = __dirname + '/../server/';
const p = R + 'Public/Data/Script/MyLua/mingjingshi/Gem_ZuoKeFenLi.lua';
const t = fs.readFileSync(p, 'latin1');
const gem = new Set(fs.readFileSync(R + 'Public/Config/GemInfo.txt', 'latin1').split('\n').map((l) => l.split('\t')[0]));
const khoi = (n) => { const i = t.indexOf('x290205_g_' + n + ' = {'); const j = t.indexOf('\n}', i); if (i < 0 || j < 0) throw new Error('khong thay ' + n); return [i, j]; };
const so = (n) => { const [i, j] = khoi(n); return [...t.slice(i, j).matchAll(/\b\d{8}\b/g)].map((m) => ({ v: m[0], at: i + m.index })); };
const A = so('ypgydg1'), B = so('xgbuqv1'), C = so('uttr1');
if (A.length !== 168 || B.length !== 168 || C.length !== 168) throw new Error('so dong ' + A.length + '/' + B.length + '/' + C.length);
const doi = [];
for (let k = 0; k < 168; k++) {
  const a = A[k].v, b = B[k].v, c = C[k].v;
  const m = a.match(/^50(\d)2100([1-4])$/);            // Minh Thach cap L mau c
  if (!m) continue;
  const L = m[1], mau = m[2];
  if (+L >= 8) continue;   // cap 8: Minh Thach 8 / Thuan Tinh 8 / Minh Tinh 8-x KHONG co trong GemInfo -> dong chet, bo qua
  if (b !== '50' + L + '0200' + (4 + +mau)) throw new Error('dong ' + (k + 1) + ': ngoc phu ' + b + ' khong phai Thuan Tinh cap ' + L + ' cung mau');
  if (c !== '50' + L + '21' + mau + '01') throw new Error('dong ' + (k + 1) + ': ket qua ' + c + ' khong phai ' + L + '-1 (da chay roi?)');
  const moi = '50' + L + '21' + mau + '0' + L;
  if (!gem.has(moi)) throw new Error('khong co ma ' + moi + ' trong GemInfo');
  doi.push({ at: C[k].at, cu: c, moi });
}
if (!doi.length) throw new Error('khong co dong goc nao');
let o = t;
for (const d of doi.sort((x, y) => y.at - x.at)) o = o.slice(0, d.at) + d.moi + o.slice(d.at + 8);
const hi = (s) => [...s].filter((x) => x.charCodeAt(0) > 127).length;
if (hi(o) !== hi(t) || o.length !== t.length) throw new Error('byte lech');
fs.writeFileSync(p, o, 'latin1');
console.log('doi ' + doi.length + ' dong goc: ' + doi.reverse().map((d) => d.cu + '->' + d.moi).join(' '));
