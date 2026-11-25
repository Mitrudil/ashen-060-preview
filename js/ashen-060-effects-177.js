/* ASHEN 0.6 stage 177 — active static modifiers from equipped artifacts and set X/Y.
 * Prefix/suffix catalog and event-based Z remain intentionally unimplemented.
 * Pure calculation: no modifications to save or Supabase.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Effects177=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const SLOT={right:'weapon_main',left:'weapon_off',head:'head',outer:'jacket',shirt:'shirt',pants:'pants',boots:'boots',hands:'gloves',extra:'accessory1',extra2:'accessory2',extra3:'accessory3'};
const ATTRIBUTE={strength:'str',agility:'dex',endurance:'end',perception:'per',intelligence:'int',charisma:'cha'};
function create(catalog,bonuses){
 if(!catalog||!Array.isArray(catalog.sets)||!Array.isArray(catalog.artifact_effects)||!bonuses||typeof bonuses.compute!=='function')throw Error('MISSING_EFFECT_CATALOG');
 function resolve(save){
  const byUid=new Map(save.inventory.map(item=>[item.uid,item])); const items={};
  for(const [slot,mapped] of Object.entries(SLOT)){
   const uid=save.equip[slot]; const item=uid?byUid.get(uid):null;
   if(uid&&!item)throw Error('INVALID_EQUIPPED_UID');
   items[mapped]=item?{...item,id:item.uid}:null;
  }
  const result=bonuses.compute({items,setPolicy:'auto-v20'},catalog);
  const attrs={},raw={armor:0,hpFlat:0,hpPercent:0,damagePercent:0,critPoints:0,penetrationPoints:0,extraAttacks:0,accuracy:0,dodge:0,initiative:0};
  const deferred=[];
  for(const m of result.modifiers){
   // A conditional artifact must not give an unconditional stat bonus.
   if(m.source==='artifact'&&m.activation_condition){deferred.push(m);continue;}
   if(m.operation==='conditional'){deferred.push(m);continue;}
   if(m.operation==='flat'&&ATTRIBUTE[m.stat_key]){const key=ATTRIBUTE[m.stat_key];attrs[key]=(attrs[key]||0)+m.value;continue;}
   const key=m.stat_key+'|'+m.operation;
   const target={'armor|flat':'armor','hp|flat':'hpFlat','hp|percent':'hpPercent','damage|percent':'damagePercent',
    'critChance|percentage_points':'critPoints','penetration|flat':'penetrationPoints','extraAttacks|extra_attacks':'extraAttacks',
    'accuracy|flat':'accuracy','dodge|flat':'dodge','initiative|flat':'initiative'}[key];
   if(target){raw[target]+=m.value;continue;}
   // Effects not in the simplified PvE formula are retained, not silently applied.
   deferred.push(m);
  }
  // X/Y round only at the boundary exposed to the battle engine.
  for(const k of Object.keys(attrs))attrs[k]=Math.round(attrs[k]);
  raw.extraAttacks=Math.max(0,Math.trunc(raw.extraAttacks));
  return {...raw,attrs,sets:result.setDetails,signals:result.signals,deferred,modifiers:result.modifiers};
 }
 return Object.freeze({resolve,catalog});
}
return Object.freeze({create,SLOT});
});
