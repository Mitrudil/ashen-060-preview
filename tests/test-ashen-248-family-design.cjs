const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/ashen-248-family-design.js'),'utf8'),ctx);const plan=ctx.window.Ashen248FamilyDesign;
const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/ashen-060-katalog.json'),'utf8'));
const families=[...new Set(catalog.artifact_effects.map(x=>x.family))];assert.equal(families.length,8);
assert.equal(Object.keys(plan).length,8);for(const family of families){const p=plan[family];assert(p, family);for(const key of ['specialization','description','tier3','tier6'])assert(p[key]?.length>8,family+':'+key);assert(/nieaktywne/i.test(p.status));}
const game=fs.readFileSync(path.join(__dirname,'../js/game.js'),'utf8');const index=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');assert(game.includes('Ashen248FamilyDesign?.[family]'));assert(game.includes('nieaktywne w walce'));assert(index.indexOf('ashen-248-family-design.js')<index.indexOf('./js/game.js'));
assert(!fs.readFileSync(path.join(__dirname,'../js/ashen-060-bonuses.js'),'utf8').includes('Ashen248FamilyDesign'));
console.log('PASS 248: 8 family proposals, UI connected, no battle effects');
