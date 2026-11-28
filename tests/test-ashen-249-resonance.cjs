const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const S=require('../js/ashen-249-resonance.js');
const cat=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/ashen-060-katalog.json'),'utf8'));
const families=[...new Set(cat.artifact_effects.map(x=>x.family))];assert.equal(families.length,8);assert.equal(Object.keys(S.catalog).length,8);
for(const fam of families){
 const names=[...new Set(cat.artifact_effects.filter(x=>x.family===fam).map(x=>x.artifact))];assert.equal(names.length,6);
 const a=S.evaluate(fam,[]),b=S.evaluate(fam,names.slice(0,2)),c=S.evaluate(fam,[...names.slice(0,3),names[0]]),d=S.evaluate(fam,names.slice(0,6));
 assert.equal(a.tier,0);assert.equal(b.tier,0);assert.equal(c.tier,3);assert.equal(c.count,3);assert.equal(d.tier,6);assert.equal(d.count,6);
 for(const val of [...S.catalog[fam].at3,...S.catalog[fam].at6])assert(Number.isInteger(val.value)&&val.value>0);
 assert.notDeepEqual(c.bonuses,d.bonuses);assert(c.simulated&&d.simulated);
}
assert.throws(()=>S.evaluate('nieznana',[]));
const code=fs.readFileSync(path.join(__dirname,'../js/game.js'),'utf8');const index=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');assert(code.includes('Symulacja aktualnego wyposażenia'));assert(code.includes('nieaktywne w walce'));assert(index.indexOf('ashen-249-resonance.js')<index.indexOf('./js/game.js'));
const bonusCode=fs.readFileSync(path.join(__dirname,'../js/ashen-060-bonuses.js'),'utf8');assert(!bonusCode.includes('Ashen249Resonance'));
console.log('PASS 249: tier 0/3/6, unique names, 8 families, preview only, no double stack');
