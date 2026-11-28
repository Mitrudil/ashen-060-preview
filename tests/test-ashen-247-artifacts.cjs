const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const B=require('../js/ashen-060-bonuses.js');
const C=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/ashen-060-katalog.json'),'utf8'));

const names=[...new Set(C.artifact_effects.map(x=>x.artifact))];const families=[...new Set(C.artifact_effects.map(x=>x.family))];
assert.equal(names.length,48);assert.equal(families.length,8);assert.equal(C.artifact_effects.length,384);
for(const family of families){const n=[...new Set(C.artifact_effects.filter(x=>x.family===family).map(x=>x.artifact))];assert.equal(n.length,6,family)}
for(const name of names){const effects=C.artifact_effects.filter(x=>x.artifact===name);assert.equal(effects.length,8,name);assert.equal(new Set(effects.map(x=>x.slot_category)).size,8,name);for(const x of effects)assert(Number.isFinite(Number(x.value)),name)}
const crypto=require('node:crypto');assert.equal(crypto.createHash('sha256').update(JSON.stringify(C.artifact_effects.slice(0,128))).digest('hex'),'31f19997a7243f45f1d52ababacd8fe988313f4c51ff2090205ae0740cdaea7a');
for(const name of names)for(const slot of Object.keys(B.SLOT_CATEGORY)){
 const cat=B.SLOT_CATEGORY[slot],item={id:'a',socketCapacity:1,socketedArtifacts:[name]};
 const res=B.compute({items:{[slot]:item}},C);assert.equal(res.modifiers.filter(x=>x.source==='artifact').length,1,name+' '+slot);
}
assert(!C.artifact_effects.some(x=>x.prefix||x.suffix));
console.log('PASS 247: 48 artefacts, 8 families, 384 effects, old 16 preserved, each slot computes, no affixes');
