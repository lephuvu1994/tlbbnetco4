// 19/10 (chu server): phai Thien Long (MenPai DaLi_T id 6 -> AttackTraits.txt dong 6 "大理") he so 4 thuoc tinh deu 1.25:
// Bang / Hoa / Doc 1170000 -> 1250000 (Huyen giu 1250000). Engine: CombatCore_T::*Damage x traitCoef (cot / 1.000.000).
// Sua theo latin1 (ten GBK), giu CRLF. Can cap-nhat + RESTART game (bang nap luc khoi dong). Chay: node tools/thienlong-4he-19-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Public/Config/AttackTraits.txt');
const s = fs.readFileSync(F, 'latin1'), L = s.split('\r\n');
const i = L.findIndex(l => l.split('\t')[0] === '6');
const c = L[i].split('\t');
if (c[5] !== '1170000' || c[6] !== '1170000' || c[7] !== '1250000' || c[8] !== '1170000') throw new Error('dong 6 khong dung nhu mong doi: ' + c.slice(3).join(' '));
c[5] = c[6] = c[8] = '1250000';
L[i] = c.join('\t');
console.log('dong 6 moi:', c.slice(3).join(' '));
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, L.join('\r\n'), 'latin1'); console.log('DA GHI'); }
