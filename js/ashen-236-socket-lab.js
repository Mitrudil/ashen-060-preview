/* ASHEN 236: testowe osadzanie efektów katalogowych (bez kosztów, bez PvP). */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen236SocketLab=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function modify(item,name,mode,slot,catalog,engine,adapter){
  if(!item||!Number.isInteger(item.socketCapacity)||item.socketCapacity<1||item.socketCapacity>3)throw Error('Przedmiot nie ma obsługiwanych gniazd artefaktów.');
  const mapped=adapter?.categoryOfGameSlot(slot),category=engine?.SLOT_CATEGORY?.[mapped];
  if(!category)throw Error('Nieobsługiwany slot tego przedmiotu.');
  const before=Array.isArray(item.socketedArtifacts)?item.socketedArtifacts:[];
  if(before.length>item.socketCapacity)throw Error('Uszkodzona obsada gniazd.');
  let after;
  if(mode==='install'){
   if(before.length>=item.socketCapacity)throw Error('Wszystkie gniazda są zajęte.');
   if(typeof name!=='string'||!catalog?.artifact_effects?.some(e=>e.artifact===name&&e.slot_category===category))throw Error('Artefakt nie pasuje do tego rodzaju przedmiotu.');
   after=[...before,name];
  }else if(mode==='remove'){
   const idx=Number(name);
   if(!Number.isInteger(idx)||idx<0||idx>=before.length)throw Error('Nie znaleziono osadzonego artefaktu.');
   after=before.filter((_,i)=>i!==idx);
  }else throw Error('Nieznana operacja.');
  const next={...item,socketedArtifacts:after};
  // Silnik 0.6 sprawdza duplikaty, rodziny i zgodność z kategorią slotu.
  engine.compute({items:{[mapped]:{id:next.id,socketCapacity:next.socketCapacity,socketedArtifacts:after}}},catalog);
  return next;
 }
 return Object.freeze({modify});
});
