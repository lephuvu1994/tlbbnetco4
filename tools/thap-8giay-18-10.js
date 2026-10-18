// 18/10 (chu server): Thap Khac Lap Ma Can (scene 427, Public/Scene/takelamagan_monster.ini) quai hoi sinh 5 giay -> 8 giay.
// Ly do: hoang01-05 AFK dem 17-18/10 o day ~1.500 quai/gio/acc (Sa Mac Da Nhan 11440 / Linh Cau 11442), ~70% so phieu
// 1.000 KNB (tools/vps/phieu-acc.py). Doi tat ca 90 dong respawn_time=5000 -> 8000. Kem: roithem bando 2 -> 0.5 (sua tren VPS).
// Bang .ini -> can cap-nhat + RESTART. Chay: node tools/thap-8giay-18-10.js. Rollback: tag truoc-thap-8giay-18-10
const fs = require('fs');
const p = __dirname + '/../server/Public/Scene/takelamagan_monster.ini';
const t = fs.readFileSync(p, 'latin1');
const n = (t.match(/^respawn_time=5000\r?$/gm) || []).length;
if (n !== 90) throw new Error('so dong respawn_time=5000 = ' + n + ', can 90 (da chay roi?)');
const o = t.replace(/^respawn_time=5000(\r?)$/gm, 'respawn_time=8000$1');
fs.writeFileSync(p, o, 'latin1');
console.log('da doi ' + n + ' dong 5000 -> 8000');
