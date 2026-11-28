/* ASHEN 250 — aktywacja rezonansu wyłącznie w lokalnych walkach PvE 0.6.
 * Ścisły zakres: brak zmian w PvP, Strefie łupów, Supabase i liczbie ataków.
 * Wartości: katalog propozycji Build 249, nadal robocze.
 */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen250PveResonance=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const empty=()=>({damagePct:0,accuracy:0,penetration:0,perception:0,endurance:0,dodge:0,armor:0,hp:0});
 const norm=s=>String(s||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function snapshot(stock,equippedIds,catalog,simulator){
  const namesByFamily=new Map(),index=new Map();
  for(const entry of (catalog||[]))if(entry?.artifact&&entry?.family)index.set(norm(entry.artifact),{name:entry.artifact,family:entry.family});
  const worn=new Set((equippedIds||[]).filter(Boolean));
  for(const token of (stock||[])){
   if(!token?.socketItemUid||!worn.has(token.socketItemUid))continue;
   const entry=index.get(norm(token.name));if(!entry)continue;
   if(!namesByFamily.has(entry.family))namesByFamily.set(entry.family,new Set());
   namesByFamily.get(entry.family).add(entry.name);
  }
  const tiers={};
  for(const [family,names] of namesByFamily){
   const tier=names.size>=6?6:names.size>=3?3:0;
   if(tier&&simulator?.catalog?.[family])tiers[family]=tier;
  }
  return Object.freeze({...tiers});
 }
 function activeValue(tiers,simulator,family,stat){
  const tier=tiers?.[family];if(!tier)return 0;
  const config=simulator?.catalog?.[family];if(!config)return 0;
  const list=tier===6?config.at6:config.at3;
  const entry=list.find(e=>e.stat===stat);return Number(entry?.value)||0;
 }
 function defense(tiers,simulator,weaponTypes=[]){
  const b=empty();
  b.armor=activeValue(tiers,simulator,'Osłonowy','Pancerz');
  b.hp=activeValue(tiers,simulator,'Osłonowy','Maks. PŻ');
  b.accuracy=activeValue(tiers,simulator,'Anomalny','Celność');
  b.dodge=activeValue(tiers,simulator,'Anomalny','Unik');
  if(weaponTypes.includes('firearm1'))b.dodge+=activeValue(tiers,simulator,'Refleksyjny','Unik');
  if(weaponTypes.includes('melee2')){
   b.endurance=activeValue(tiers,simulator,'Żelazny','Wytrzymałość');
   b.hp+=b.endurance*10; // podstawowa przeliczalność PŻ za wytrzymałość
  }
  return b;
 }
 function weapon(tiers,simulator,type){
  const b=empty();
  if(type==='melee1'){
   b.damagePct=activeValue(tiers,simulator,'Niszczycielski','Obrażenia broni');
   b.accuracy=activeValue(tiers,simulator,'Niszczycielski','Celność');
  } else if(type==='melee2'){
   b.damagePct=activeValue(tiers,simulator,'Żelazny','Obrażenia broni');
  } else if(type==='firearm1'){
   b.accuracy=activeValue(tiers,simulator,'Refleksyjny','Celność');
  } else if(type==='firearm2'){
   b.accuracy=activeValue(tiers,simulator,'Techniczny','Celność');
   b.penetration=activeValue(tiers,simulator,'Techniczny','Przebicie pancerza');
  } else if(type==='nonfire'){
   b.accuracy=activeValue(tiers,simulator,'Tropicielski','Celność');
   b.perception=activeValue(tiers,simulator,'Tropicielski','Percepcja');
  }
  // Nomadyczny pozostaje poza walką: jego efekty łupów/Szczęścia wymagają
  // oddzielnego testu balansu i snapshotu ekwipunku z momentu rozpoczęcia wyprawy.
  return b;
 }
 return Object.freeze({snapshot,defense,weapon});
});
