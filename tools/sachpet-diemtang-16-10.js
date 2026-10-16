// 16/10: sach ky nang tran thu (ke 102, 133, 134) tra bang Diem Tang (cot 7 = 6), giu nguyen con so gia;
// go Cong Sinh 30402035 (ke 133) va Cao cap Cong Sinh 30402036 (ke 134): don cac o sau len, o cuoi de trong.
// Sua theo latin1, giu CRLF. Chay: node tools/sachpet-diemtang-16-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Public/Config/ShopTable.txt');
const raw = fs.readFileSync(F, 'latin1'), EOL = raw.includes('\r\n') ? '\r\n' : '\n', L = raw.split(EOL);
const GO = { '133': '30402035', '134': '30402036' };
for (const ke of ['102', '133', '134']) {
  const idx = L.findIndex(l => l.split('\t')[0] === ke); if (idx < 0) throw new Error('khong co ke ' + ke);
  const c = L[idx].split('\t'), n = c.length;
  console.log(`ke ${ke}: tien ${c[7]} -> 6`); c[7] = '6';
  if (GO[ke]) {
    const nO = Math.floor((n - 25) / 6), o = [];
    for (let k = 0; k < nO; k++) o.push(c.slice(25 + k * 6, 31 + k * 6));
    const hit = o.map((x, k) => x[0] === GO[ke] ? k : -1).filter(k => k >= 0);
    if (hit.length !== 1) throw new Error(`ke ${ke} co ${hit.length} o ${GO[ke]}`);
    const bo = o.splice(hit[0], 1)[0]; o.push(['', '', '', '', '', '']);
    console.log(`ke ${ke}: go o ${hit[0] + 1} = ${bo.join(',')}`);
    for (let k = 0; k < nO; k++) for (let j = 0; j < 6; j++) c[25 + k * 6 + j] = o[k][j];
  }
  if (c.length !== n) throw new Error('lech so cot'); L[idx] = c.join('\t');
}
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, L.join(EOL), 'latin1'); console.log('DA GHI'); }
