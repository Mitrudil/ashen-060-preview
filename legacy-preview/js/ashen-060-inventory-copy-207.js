/* ASHEN 207 — copy-only import of unmodified COMMON legacy bases into isolated v06 bag.
   No legacy saves/storage/network access. Never imports equipped state or any modifier. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060InventoryCopy207=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MAX_ITEMS=500;
 const SAFE_KEYS=new Set(['uid','id','rarity']);
 function plan(raw,catalog){
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||!Array.isArray(raw.inventory)||raw.inventory.length>MAX_ITEMS)throw Error('INVALID_LEGACY_INVENTORY');
  const map=new Map(catalog.entries().filter(x=>typeof x.legacyId==='string'&&x.legacyId).map(x=>[x.legacyId,x.modernId]));
  const seen=new Set(),allowed=[],blocked=[];
  raw.inventory.forEach((item,index)=>{
   let reason=null;
   if(!item||typeof item!=='object'||Array.isArray(item))reason='Nieprawidłowy przedmiot';
   else if(typeof item.uid!=='string'||!item.uid||seen.has(item.uid))reason='Brak lub duplikat UID';
   else if(!map.has(item.id))reason='Brak potwierdzonego odpowiednika bazy';
   else if(item.rarity!==0)reason='Stara jakość inna niż Zwykły';
   else if(Object.keys(item).some(k=>!SAFE_KEYS.has(k)))reason='Dodatkowe pola lub modyfikatory — wymagana weryfikacja';
   if(item&&typeof item.uid==='string')seen.add(item.uid);
   if(reason)blocked.push({index,legacyId:typeof item?.id==='string'?item.id:null,reason});
   else allowed.push({index,uid:item.uid,legacyId:item.id,baseId:map.get(item.id)});
  });
  return {schema:'ashen-inventory-copy-207',allowed,blocked,total:raw.inventory.length,warning:'Przenosimy tylko czyste zwykłe bazy, do plecaka TESTOWEGO. Jakość, statystyki i gniazda są generowane od nowa przez 0.6. Bez wyposażania.'};
 }
 function apply(testSave,planResult,engine){
  if(!planResult||planResult.schema!=='ashen-inventory-copy-207')throw Error('INVALID_PLAN');
  let next=structuredCloneSafe(testSave);engine.audit(next);
  const existing=new Set(next.inventory.map(x=>x.uid));
  const copied=[];
  for(const entry of planResult.allowed){
   const uid='copy207-'+entry.index+'-'+entry.uid;
   if(existing.has(uid))throw Error('DUPLICATE_TEST_UID');
   const result=engine.loot(next,entry.baseId,'ruins',uid,()=>0,()=>0.999);
   if(result.item.rarity!==0)throw Error('QUALITY_NOT_COMMON');
   next=result.save;existing.add(uid);copied.push({legacyUid:entry.uid,testUid:uid,baseId:entry.baseId});
  }
  engine.audit(next);return {save:next,copied};
 }
 function structuredCloneSafe(x){return JSON.parse(JSON.stringify(x));}
 return Object.freeze({plan,apply,MAX_ITEMS});
});
