const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const src=fs.readFileSync(require('node:path').join(__dirname,'../js/game.js'),'utf8');
const block=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i);assert(i>=0&&j>i);return src.slice(i,j)};
const catalog={artifact_effects:[{artifact:'Żar Bez Płomienia',slot_category:'broń'},{artifact:'Płytka Bastionu',slot_category:'broń'},{artifact:'Oko Martwej Strefy',slot_category:'broń'}]};
let records={
 inventory:[{uid:'legacy1',id:'ash_ember',rarity:3,prefix:'art_echo',suffix:'art_find'},{uid:'gun',id:'pistol',rarity:1,socketCapacity:2,socketedArtifacts:['Płytka Bastionu']}],
 equip:{extra:'legacy1',right:'gun'},artifactStock:undefined
};
let saved=0;
const ctx={state:records,window:{Ashen060Catalog:catalog,Ashen236SocketLab:{modify(inst,value,mode){if(mode==='install'){assert(inst.socketedArtifacts.length<inst.socketCapacity);return {...inst,socketedArtifacts:[...inst.socketedArtifacts,value]}}return {...inst,socketedArtifacts:inst.socketedArtifacts.filter((_,i)=>i!==value)}}}},structuredClone,attrs(){},heroDefense(){},save(){saved++},message:'',itemEquipDefaultSlot(){return 'right'},instance(uid){return records.inventory.find(x=>x.uid===uid)},def(inst){return inst&&({ash_ember:{artifact:true,name:'Żar bez płomienia'},pistol:{artifact:false,slot:'hand1'}})[inst.id]}};
vm.createContext(ctx);
vm.runInContext(block('function artifactCatalogName(name){','normalizeEquip();\nconst artifactPreMigrationSnapshot'),ctx);
assert.equal(vm.runInContext('reconcileArtifactStock()',ctx),true);
assert.equal(records.inventory.length,1);
assert.equal(records.equip.extra,null);
const legacy=records.artifactStock.find(x=>x.uid==='legacy-artifact:legacy1');
assert.equal(legacy.legacyItem.prefix,'art_echo');assert.equal(legacy.legacyItem.suffix,'art_find');
assert.equal(records.artifactStock.find(x=>x.migratedFrom236).socketItemUid,'gun');
assert.equal(vm.runInContext('reconcileArtifactStock()',ctx),false,'migration should be idempotent');
vm.runInContext(block('function changeSocketArtifact(uid,value,mode){','function item060PreviewPanel('),ctx);
assert.throws(()=>vm.runInContext('changeSocketArtifact("gun","not-owned","install")',ctx),/nie jest dostępny/);
vm.runInContext('changeSocketArtifact("gun",0,"remove")',ctx);
assert.equal(records.inventory[0].socketedArtifacts.length,0);
let migrated=records.artifactStock.find(x=>x.migratedFrom236);
assert.equal(migrated.socketItemUid,null);
vm.runInContext('changeSocketArtifact("gun","'+migrated.uid+'","install")',ctx);
assert.equal(migrated.socketItemUid,'gun');assert.equal(records.inventory[0].socketedArtifacts[0],'Płytka Bastionu');
assert.throws(()=>vm.runInContext('changeSocketArtifact("gun","'+migrated.uid+'","install")',ctx),/nie jest dostępny/);
assert.equal(records.inventory[0].socketedArtifacts.length,1);
console.log('PASS migration, idempotency, metadata, owned-only sockets, returns and duplicate protection. Saves:',saved);
