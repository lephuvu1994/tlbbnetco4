// 18/10 (chu server): Tuyet Lang Ho (scene 179, Public/Scene/xuelanghu_monster.ini) quai thuong hoi sinh 75 giay -> 8 giay.
// 533 dong respawn_time=75000 -> 8000; 5 con lon 300000 (5 phut) GIU. Thap Khac Lap Ma Can (427) giu 5 giay (chu server chot).
// Kem: roithem bando 2 -> 0.5 (sua tren VPS). Ban do roi phieu -> do lai bang tools/vps/phieu-acc.py.
// Bang .ini -> can cap-nhat + RESTART. Chay: node tools/tuyetlangho-8giay-18-10.js. Rollback: tag truoc-tuyetlangho-8giay-18-10
const fs = require('fs');
const p = __dirname + '/../server/Public/Scene/xuelanghu_monster.ini';
const t = fs.readFileSync(p, 'latin1');
const n = (t.match(/^respawn_time=75000\r?$/gm) || []).length;
if (n !== 533) throw new Error('so dong respawn_time=75000 = ' + n + ', can 533 (da chay roi?)');
const o = t.replace(/^respawn_time=75000(\r?)$/gm, 'respawn_time=8000$1');
fs.writeFileSync(p, o, 'latin1');
console.log('da doi ' + n + ' dong 75000 -> 8000');
