// 25/10 (chu server): am khi "phap bao them Sinh luc %" (impact 32400 法宝加血上限%, logic 12, 30 phut) 10% -> 20%.
// Engine Obj_Human::GetMaxHP: Mau toi da = mau goc (The luc + cap) + mau cong thang (do, buff...) + mau goc x % buff.
// % chi nhan vao MAU GOC -> nhan vat 3 trieu mau (goc ~1,5 trieu) chi duoc +150k thay vi 300k. Gap doi % de ~10% tong mau o nhan vat do full.
// Server/Config/StandardImpact.txt (file engine nap), cot 64 = gia tri "MAX_HP修正率". GBK, sua theo byte latin1.
// Can cap-nhat + RESTART. Rollback: tag truoc-amkhi-mau-25-10.
//   node tools/amkhi-mau-25-10.js [--ghi]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '../server/Server/Config/StandardImpact.txt');
const ID = '32400', COT = 64, CU = '10', MOI = '20';
const s = fs.readFileSync(F).toString('latin1');
const E = s.includes('\r\n') ? '\r\n' : '\n';
const L = s.split(E);
const i = L.findIndex((l) => l.split('\t')[0] === ID);
if (i < 0) { console.log('LOI khong co dong ' + ID); process.exit(1); }
const c = L[i].split('\t');
const ten = new TextDecoder('gbk').decode(Buffer.from(c[COT - 1], 'latin1'));
if (ten !== 'MAX_HP修正率' || ![CU, MOI].includes(c[COT])) { console.log('LOI cot ' + (COT - 1) + ' = ' + ten + ', gia tri ' + c[COT] + ', mong MAX_HP修正率 = ' + CU); process.exit(1); }
console.log('impact ' + ID + ': MAX_HP修正率 ' + c[COT] + '% -> ' + MOI + '%');
c[COT] = MOI;
L[i] = c.join('\t');
if (process.argv.includes('--ghi')) { fs.writeFileSync(F, Buffer.from(L.join(E), 'latin1')); console.log('DA GHI ' + F); }
else console.log('(chay thu, them --ghi de luu)');
