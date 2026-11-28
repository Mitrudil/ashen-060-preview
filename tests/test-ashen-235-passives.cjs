const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const api=require('../js/ashen-235-artifact-passives.js');
const engine=require('../js/ashen-060-bonuses.js');
const adapter=require('../js/ashen-060-equipment-preview.js');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/ashen-060-katalog.json'),'utf8'));
const equip={right:'gun',head:'helmet'};
const items=[{uid:'gun',id:'pistol',socketCapacity:2,socketedArtifacts:['Płytka Bastionu']},
{uid:'helmet',id:'cap',socketCapacity:1,socketedArtifacts:['Membrana Schronu']}];
const result=api.calculate(equip,items,catalog,engine,adapter);
assert.equal(result.totals.armor,2); // broń 2
assert.equal(result.totals.hp,4);
assert.equal(result.active.length,2);
assert.equal(result.warnings.length,0);
const duplicate=api.calculate({right:'gun',left:'gun'},[items[0]],catalog,engine,adapter);
assert.equal(duplicate.totals.armor,2); // ten sam egzemplarz liczony raz
const noSocket=api.calculate({right:'gun'},[{...items[0],socketCapacity:0,socketedArtifacts:[]}],catalog,engine,adapter);
assert.equal(noSocket.active.length,0);
const invalid=api.calculate({right:'gun'},[{...items[0],socketedArtifacts:['Nieznany artefakt']}],catalog,engine,adapter);
assert.equal(invalid.active.length,0); assert.equal(invalid.warnings.length,1);
const conditional=api.calculate({right:'gun'},[{...items[0],socketedArtifacts:['Iskra Tempa']}],catalog,engine,adapter);
assert.equal(conditional.active.length,0);
assert.equal(conditional.pending.length,1);
console.log('OK: efekty pasywne, brak duplikacji, brak gniazd, błędna obsada, warunki odroczone');
