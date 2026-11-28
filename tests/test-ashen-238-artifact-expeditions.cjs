const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(require('path').join(__dirname,'../js/game.js'),'utf8');
const extract=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i);assert(i>=0&&j>i,a+' not found');return src.slice(i,j)};
const catalog={artifact_effects:[{artifact:'Płytka Bastionu'},{artifact:'Płytka Bastionu'},{artifact:'Oko Martwej Strefy'}]};
let now=100;const ctx={window:{Ashen060Catalog:catalog},Math:Object.create(Math),Date:{now:()=>now++},state:{artifactStock:[]},ARTIFACT_PREFIX_SETS:{art_fortunate:{luck:4,explore:0,bonus:{end:2}}},ARTIFACT_SUFFIX_SETS:{art_find:{luck:2,explore:0,bonus:{per:1}}},instance:uid=>ctx._equipment[uid],_equipment:{},console};
ctx.Math.random=()=>0.5;
vm.createContext(ctx);
vm.runInContext(extract('const EXPEDITION_ARTIFACT_CHANCE=','function pickLoot('),ctx);
assert.equal(vm.runInContext('rollExpeditionArtifact({id:"ruins"},()=>0.9)',ctx),null,'No drop on failed roll');
assert.equal(ctx.state.artifactStock.length,0);
let i=0;const rolls=[0.0,0.0];
let award=vm.runInContext('rollExpeditionArtifact({id:"outpost"},()=>'+ '0.0'+')',ctx);
assert.equal(award.name,'Płytka Bastionu');assert.equal(ctx.state.artifactStock.length,1);
assert.equal(ctx.state.artifactStock[0].socketItemUid,null);
assert.equal(vm.runInContext('rollExpeditionArtifact({id:"other"},()=>0)',ctx),null);
// Rezonans bez pojedynczego zakładanego akcesorium: liczymy osadzenia w założonej broni/odzieży.
vm.runInContext(extract('function resonanceResults(){','function resonanceBonuses(){'),ctx);
ctx.state.equip={right:'gun',outer:'coat',pants:'pants'};
ctx._equipment={gun:{uid:'gun',socketArtifactUids:['a','b','a']},coat:{uid:'coat',socketArtifactUids:['c']},pants:{uid:'pants',socketArtifactUids:[]}};
ctx.state.artifactStock=[
 {uid:'a',socketItemUid:'gun',legacyItem:{prefix:'art_fortunate',suffix:'art_find'}},
 {uid:'b',socketItemUid:'gun',legacyItem:{prefix:'art_fortunate'}},
 {uid:'c',socketItemUid:'coat',legacyItem:{prefix:'art_fortunate'}},
 {uid:'d',socketItemUid:null,legacyItem:{prefix:'art_fortunate',suffix:'art_find'}}
];
let result=vm.runInContext('resonanceResults()',ctx);
assert.equal(result.find(x=>x.kind==='prefix').count,3);
assert.equal(result.find(x=>x.kind==='prefix').active,true);
assert.equal(result.find(x=>x.kind==='suffix').count,1);
ctx.state.equip.outer=null;
result=vm.runInContext('resonanceResults()',ctx);
assert.equal(result.find(x=>x.kind==='prefix').count,2);
assert.equal(result.find(x=>x.kind==='prefix').active,false);
console.log('PASS Build 238: artifact drop chance, stock, unique resonance, equipped-only');
