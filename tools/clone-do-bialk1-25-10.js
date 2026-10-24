// 25/10 (chu server): chep 19 mon DANG MAC cua bialk (1010100017) sang biabiabia (acc bialk1, 1010100027, Thien Son) + doi:
//  - Ngoc Hoa -> Bang: 50702007 Thuan tinh hong (Hoa 7) -> 50702006 Thuan tinh lam (Bang 7); 50721307 Hong Minh (Hoa kep 7-7) -> 50721207 Lam Minh (Bang kep 7-7).
//    Ngoc nam o byte 2..17 cua p1..p17 (moi vien 4 byte LE). Chi thay dung 2 ma tren, khong dong vao byte khac.
//  - Dieu Van (&DW + 2 cap "ma2chu+cap2so"): hg->bg (Hoa cong), hj->bj (giam khang Hoa), hk->bk (khang Hoa), lt->ll (Noi luc -> Cuong luc).
//  - Tinh Thong (&JT + 3 cap "MA2CHU+cap2so"): HG->BG (Hoa cong -> Bang cong).
//  - Long Van "lwps" + 6 ky tu (bo qua, sx, he1, cap1, he2, cap2): he 2 (Hoa) -> 1 (Bang).
//  KHONG doi: dong Vo Hon (w/f Hoa -> q/d Bang da co san -> trung, phi), chi so goc Vo Hon (bitmask - can giai them), am khi, than khi (#S).
//  Ma do moi = 990000000 + o (dai rieng, game chi cap ~4,46 trieu) -> khong trung, khong can tat game. Nhan vat phai OFFLINE.
//    node tools/clone-do-bialk1-25-10.js <bialk-do.tsv> <ra.sql>
// TSV: pos itemtype p1..p17 HEX(creator) fixattr var visualid maxgemid dbversion (xem lenh SELECT trong docs/TRANG-THAI.md 25/10).
const fs = require('fs');
const [, , VAO, RA] = process.argv;
const NGUON = 1010100017, DICH = 1010100027, GOC = 990000000;
const NGOC = { 50702007: 50702006, 50721307: 50721207 };
const DW = { hg: 'bg', hj: 'bj', hk: 'bk', lt: 'll' };
const JT = { HG: 'BG' };
const sql = [];
const tom = [];
sql.push('-- clone do bialk -> biabiabia ' + new Date().toISOString());
sql.push('INSERT INTO t_iteminfo (charguid,guid,world,server,itemtype,pos,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15,p16,p17,creator,isvalid,dbversion,fixattr,var,visualid,maxgemid)');
// dbversion PHAI = t_char.dbversion cua nhan vat DICH: server chi nap dong "dbversion=%d" (giu cua nguon -> do vo hinh, 25/10)
sql.push(' SELECT ' + DICH + ',' + GOC + '+pos,world,server,itemtype,pos,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15,p16,p17,creator,isvalid,(SELECT dbversion FROM t_char WHERE charguid=' + DICH + '),fixattr,var,visualid,maxgemid');
sql.push(' FROM t_iteminfo WHERE charguid=' + NGUON + ' AND isvalid=1 AND pos BETWEEN 100 AND 118;');
for (const l of fs.readFileSync(VAO, 'utf8').trim().split('\n')) {
  const c = l.split('\t');
  const pos = c[0];
  const p = c.slice(2, 19).map(Number);
  const b = Buffer.alloc(68); p.forEach((v, i) => b.writeInt32LE(v, i * 4));
  const doi = [];
  for (let k = 0; k < 4; k++) {
    const o = 2 + k * 4, id = b.readUInt32LE(o);
    if (NGOC[id]) { b.writeUInt32LE(NGOC[id], o); doi.push('ngoc ' + id + '->' + NGOC[id]); }
  }
  const p2 = []; for (let i = 0; i < 17; i++) p2.push(b.readInt32LE(i * 4));
  const cr = Buffer.from(c[19], 'hex').toString('latin1');
  let cr2 = cr.replace(/&DW((?:[a-z]{2}\d\d){1,2})/, (m, g) => '&DW' + g.replace(/([a-z]{2})(\d\d)/g, (x, ma, cap) => (DW[ma] || ma) + cap));
  cr2 = cr2.replace(/&JT((?:[A-Z]{2}\d\d){1,3})/, (m, g) => '&JT' + g.replace(/([A-Z]{2})(\d\d)/g, (x, ma, cap) => (JT[ma] || ma) + cap));
  cr2 = cr2.replace(/lwps(\w)(\w)(\w)(\w)(\w)(\w)/, (m, a, sx, h1, c1, h2, c2) => 'lwps' + a + sx + (h1 === '2' ? '1' : h1) + c1 + (h2 === '2' ? '1' : h2) + c2);
  if (cr2 !== cr) doi.push('creator ' + JSON.stringify(cr) + ' -> ' + JSON.stringify(cr2));
  const set = [];
  p.forEach((v, i) => { if (p2[i] !== v) set.push('p' + (i + 1) + '=' + p2[i]); });
  if (cr2 !== cr) set.push('creator=UNHEX(\'' + Buffer.from(cr2, 'latin1').toString('hex').toUpperCase() + '\')');
  if (set.length) sql.push('UPDATE t_iteminfo SET ' + set.join(',') + ' WHERE charguid=' + DICH + ' AND guid=' + (GOC + Number(pos)) + ';');
  // ngoc trung loai sau khi doi (chi bao)
  const ids = []; for (let k = 0; k < 4; k++) { const id = b.readUInt32LE(2 + k * 4); if (id >= 50000000 && id < 51000000) ids.push(id); }
  const trung = ids.filter((x, i) => ids.indexOf(x) !== i);
  tom.push('o ' + pos + ' ' + c[1] + ': ' + (doi.length ? doi.join(' | ') : '(giu nguyen)') + (trung.length ? '  [ngoc trung: ' + trung.join(',') + ']' : ''));
}
fs.writeFileSync(RA, sql.join('\n') + '\n');
console.log(tom.join('\n'));
console.log('\n' + (sql.length - 4) + ' lenh UPDATE, ghi ' + RA);
