// Dat he so 4 thuoc tinh (Bang / Hoa / Huyen / Doc) cua 1 dong AttackTraits.txt (mac dinh dong 6 = Thien Long / Dai Ly).
// He so x 1.000.000 (vd 1.3 -> 1300000). Sua theo latin1 (ten GBK), giu CRLF. Can cap-nhat + RESTART game.
// Chay: node tools/thienlong-heso.js <he so, vd 1.3> [dong=6] [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Public/Config/AttackTraits.txt');
const a = process.argv.slice(2).filter(x => x !== '--ghi');
const hs = Number(a[0]), dong = a[1] || '6';
if (!(hs >= 0.5 && hs <= 3)) throw new Error('he so 0.5 - 3');
const v = String(Math.round(hs * 1000000));
const L = fs.readFileSync(F, 'latin1').split('\r\n');
const i = L.findIndex(l => l.split('\t')[0] === dong);
if (i < 0) throw new Error('khong co dong ' + dong);
const c = L[i].split('\t'); const cu = c.slice(5, 9).join(' ');
c[5] = c[6] = c[7] = c[8] = v; L[i] = c.join('\t');
console.log('dong ' + dong + ': ' + cu + ' -> ' + c.slice(5, 9).join(' '));
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, L.join('\r\n'), 'latin1'); console.log('DA GHI'); }
