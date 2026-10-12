// 12/10 (chu server): LICH BOSS cho mod panel (thong bao boss trong game da tat) - boss nao ra o ban do nao, toa do, gio ra.
//  Doc moi script DANG DUNG (Script.dat) co bang x<id>_g_AllBoss[<scene>] = { {ID=, PosX=, PosY=, Title=}, ... } + gio trong OnCharacterTimer
//  (nHour==H and nMinute==M). Chi lay script co quai/NPC trong Public/Scene/*.ini goi toi (script_id=<id>, scripttimer>0) = dang chay that.
//  Ten quai: MonsterAttrExTable cot 1 (VISCII) + cap cot 3. Ten ban do: SceneInfo.ini.
//   node tools/lich-boss.js [file ra]     (mac dinh ../bialk/BotDoMin/lichboss.json)
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..', 'server');
const OUT = process.argv[2] || path.join(__dirname, '..', '..', 'bialk', 'BotDoMin', 'lichboss.json');
const vis = JSON.parse(fs.readFileSync(path.join(__dirname, 'viscii-map.json'), 'utf8')); const rv = {}; for (const k in vis) rv[vis[k]] = k;
const dec = (s) => [...Buffer.from(s, 'latin1')].map((c) => (c < 128 ? String.fromCharCode(c) : rv[c] || '?')).join('').replace(/\\(\d{3})/g, (m, d) => rv[+d] || '?');
const lines = (f) => fs.readFileSync(path.join(R, f), 'latin1').split(/\r?\n/);
const TEN_MAP_SUA = { 'Huyết Chiến Nhõn Cụa Quan': 'Huyết Chiến Nhạn Môn Quan', 'Thái Hoàng ThầN Vực': 'Thái Hoàng Thần Vực' };

const MA = {}; for (const l of lines('Public/Config/MonsterAttrExTable.txt')) { const c = l.split('\t'); if (/^\d+$/.test(c[0])) MA[c[0]] = { ten: dec(c[1] || '').trim(), cap: +c[3] || 0 }; }
const MAP = {}; { let cur = null;
  for (const l0 of lines('Public/Config/SceneInfo.ini')) { const l = l0.replace(/;.*$/, '').trim(); const m = l.match(/^\[scene(\d+)\]$/); if (m) { cur = m[1]; continue; }
    const kv = l.match(/^name=(.*)$/); if (cur && kv) { const t = dec(kv[1]).trim(); MAP[cur] = TEN_MAP_SUA[t] || t; } } }
const SD = new Map(); for (const l of lines('Public/Data/Script.dat')) { const m = l.match(/^0*(\d+)=(.+)$/); if (m) SD.set(m[1], m[2].trim().split('\\').join('/').replace(/^\//, '')); }

// script dang duoc quai / NPC trong ini goi (co scripttimer)
const chay = new Map();   // scriptId -> [ini]
for (const f of fs.readdirSync(path.join(R, 'Public/Scene')).filter((x) => /\.ini$/i.test(x))) {
  const s = fs.readFileSync(path.join(R, 'Public/Scene', f), 'latin1').split(/\r?\n/);
  let sid = null, tm = 0;
  const xong = () => { if (sid && tm > 0) { if (!chay.has(sid)) chay.set(sid, []); chay.get(sid).push(f); } sid = null; tm = 0; };
  for (const l0 of s) { const l = l0.replace(/;.*$/, '').trim(); if (/^\[/.test(l)) { xong(); continue; }
    let m = l.match(/^script_id\s*=\s*(\d+)/i); if (m) sid = String(+m[1]); m = l.match(/^scripttimer\s*=\s*(\d+)/i); if (m) tm = +m[1]; }
  xong();
}

const ds = [];
for (const [id, rel] of SD) {
  const p = path.join(R, 'Public/Data/Script', rel); if (!fs.existsSync(p)) continue;
  const raw = fs.readFileSync(p, 'latin1'); if (!new RegExp('x0*' + id + '_g_AllBoss\\s*\\[').test(raw)) continue;
  const L = raw.split(/\r?\n/).filter((l) => !/^\s*--/.test(l));
  const src = L.join('\n');
  // gio: trong OnCharacterTimer
  const a = src.indexOf('_OnCharacterTimer'); const b = a < 0 ? -1 : src.indexOf('\nend', a);
  const tim = a < 0 ? '' : src.slice(a, b < 0 ? undefined : b);
  // chi lay dieu kien "if ... then" ma ngay sau la goi tao boss (bo gio thong bao khac nhu Thong Thien Thap); bo gio 24 (khong bao gio dung)
  const gio = [];
  for (const m of tim.matchAll(/if\b([^\n]*nHour[^\n]*)\bthen\b[^\n]*\n([^\n]*\n?[^\n]*)/g)) {
    if (!/CreateMonster|Create\w*Boss/.test(m[2])) continue;
    for (const t of m[1].matchAll(/nHour\s*==\s*0*(\d+)\s+and\s+nMinute\s*==\s*0*(\d+)/g)) if (+t[1] < 24) gio.push(String(+t[1]).padStart(2, '0') + ':' + String(+t[2]).padStart(2, '0'));
  }
  // boss theo ban do
  for (const m of src.matchAll(/_g_AllBoss\s*\[\s*(\d+)\s*\]\s*=\s*\{([\s\S]*?)\n\s*\}/g)) {
    const scene = m[1];
    const boss = [...m[2].matchAll(/ID\s*=\s*(\d+)\s*,[^}]*?Title\s*=\s*"([^"]*)"\s*,\s*PosX\s*=\s*(\d+)\s*,\s*PosY\s*=\s*(\d+)/g)]
      .map((x) => ({ id: +x[1], ten: (MA[x[1]] || {}).ten || '#' + x[1], cap: (MA[x[1]] || {}).cap || 0, danhHieu: dec(x[2]).trim(), x: +x[3], y: +x[4] }));
    if (!boss.length) continue;
    ds.push({ script: +id, file: rel, scene: +scene, banDo: MAP[scene] || 'Bản đồ ' + scene, gio: [...new Set(gio)].sort(), dangChay: chay.has(id), ini: chay.get(id) || [], boss });
  }
}
ds.sort((x, y) => (y.dangChay - x.dangChay) || x.scene - y.scene);
for (const d of ds) console.log((d.dangChay ? 'CHAY ' : 'tat  ') + d.script, d.banDo, '(' + d.scene + ')', d.gio.join(' ') || '(khong ro gio)', '|', d.boss.length, 'boss:', [...new Set(d.boss.map((b) => b.ten))].join(', ').slice(0, 90));
fs.writeFileSync(OUT, JSON.stringify({ taoLuc: new Date().toISOString(), nguon: 'tools/lich-boss.js (repo game)', ds }, null, 1));
console.log('ghi', OUT, ds.length, 'nhom');
