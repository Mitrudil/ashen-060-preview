/* ASHEN 235: rzeczywiste, bezwarunkowe premie osadzonych artefaktów.
 * Bez zmian zapisów, PvP i bez efektów warunkowych / ekonomicznych.
 */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen235ArtifactPassives=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const PASSIVE=Object.freeze({
  'armor|flat':'armor', 'hp|flat':'hp', 'accuracy|flat':'accuracy',
  'dodge|flat':'dodge', 'endurance|flat':'end'
 });
 function calculate(equip,inventory,catalog,engine,adapter){
  const totals={armor:0,hp:0,accuracy:0,dodge:0,end:0},active=[],pending=[],warnings=[];
  if(!catalog||!engine||!adapter)return {totals,active,pending,warnings:['Moduł artefaktów niedostępny']};
  const byId=new Map((inventory||[]).filter(x=>x&&x.uid).map(x=>[x.uid,x]));
  const items={};const seen=new Set();
  for(const [slot,uid] of Object.entries(equip||{})){
   if(!uid||seen.has(uid))continue;
   const item=byId.get(uid),category=adapter.categoryOfGameSlot(slot);
   if(!item||!category||!Number.isInteger(item.socketCapacity)||item.socketCapacity<1)continue;
   const assigned=item.socketedArtifacts;
   if(!Array.isArray(assigned)||!assigned.length)continue;
   seen.add(uid);
   items[category]={id:item.id,socketCapacity:item.socketCapacity,socketedArtifacts:[...assigned]};
  }
  if(!Object.keys(items).length)return {totals,active,pending,warnings};
  let result;
  try {result=engine.compute({items},catalog)}catch(err){
   warnings.push('Nieprawidłowa obsada artefaktów: '+String(err?.message||err));
   return {totals,active,pending,warnings};
  }
  for(const mod of result.modifiers.filter(m=>m.source==='artifact')){
   const key=mod.stat_key+'|'+mod.operation;
   const passiveKey=PASSIVE[key];
   const entry={slot:mod.slot_id,sourceId:mod.source_item_id,key:mod.stat_key,operation:mod.operation,value:mod.value,condition:mod.activation_condition||''};
   if(passiveKey&&!entry.condition){totals[passiveKey]+=entry.value;active.push(entry)}
   else pending.push(entry);
  }
  return {totals,active,pending,warnings};
 }
 return Object.freeze({calculate,PASSIVE});
});
