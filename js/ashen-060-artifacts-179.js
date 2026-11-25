/* ASHEN 0.6 stage 179 — owned artifact pouch, socket/extract, PvE drops.
   Offline candidate. Generated objects are NOT server-authoritative. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Artifacts179=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const DROP_CHANCE_PROVISIONAL=.10; // not an approved final balance decision
const SLOT_CATEGORY={right:'broń',left:'broń',head:'nakrycie głowy',outer:'kurtka',shirt:'koszulka',pants:'spodnie',boots:'buty',hands:'rękawice',extra:'akcesorium',extra2:'akcesorium',extra3:'akcesorium'};
function err(code){const e=Error('ASHEN 0.6: '+code);e.code=code;throw e;}
function uid(){return 'art-v06-'+(typeof globalThis!=='undefined'&&globalThis.crypto?.randomUUID?globalThis.crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));}
function create(catalog,core){
 if(!catalog||!Array.isArray(catalog.artifact_effects)||!core?.getBase)err('MISSING_ARTIFACT_CATALOG');
 const definitions=new Map();
 for(const effect of catalog.artifact_effects){if(!definitions.has(effect.artifact))definitions.set(effect.artifact,effect.family);}
 const names=[...definitions.keys()].sort();
 function category(item){const base=core.getBase(item.baseId);return base.gameSlot==='hand1'||base.gameSlot==='hand2'?'broń':({outer:'kurtka',shirt:'koszulka',pants:'spodnie',boots:'buty',head:'nakrycie głowy',hands:'rękawice',extra:'akcesorium'})[base.gameSlot];}
 function compatible(name,item){const cat=category(item);return catalog.artifact_effects.some(e=>e.artifact===name&&e.slot_category===cat);}
 function audit(p){
  if(!p||typeof p!=='object'||!p.character||!Array.isArray(p.character.inventory))err('INVALID_PLAYER');
  const bag=p.artifacts===undefined?[]:p.artifacts;
  if(!Array.isArray(bag))err('INVALID_ARTIFACT_BAG');
  const ids=new Set();
  for(const entry of bag){if(!entry||typeof entry.uid!=='string'||!entry.uid||typeof entry.name!=='string'||!definitions.has(entry.name)||ids.has(entry.uid))err('INVALID_ARTIFACT_BAG');ids.add(entry.uid);}
  for(const item of p.character.inventory){
   const mounted=item.socketedArtifacts||[],mountedIds=item.socketedArtifactUids;
   if(!Array.isArray(mounted))err('INVALID_SOCKET_CONTENT');
   if(!Number.isInteger(item.socketCapacity)||item.socketCapacity<0||item.socketCapacity>3||mounted.length>item.socketCapacity)err('INVALID_SOCKET_CAPACITY');
   if(mounted.length>0&&(!Array.isArray(mountedIds)||mountedIds.length!==mounted.length))err('INVALID_SOCKET_IDENTITIES');
   if(mountedIds!==undefined&&(!Array.isArray(mountedIds)||mountedIds.length!==mounted.length))err('INVALID_SOCKET_IDENTITIES');
   if(mounted.length===0&&Array.isArray(mountedIds)&&mountedIds.length!==0)err('INVALID_SOCKET_IDENTITIES');
   const families=new Set();
   for(let i=0;i<mounted.length;i++){
    const name=mounted[i],family=definitions.get(name);
    if(!family||!compatible(name,item)||families.has(family))err('INVALID_SOCKET_CONTENT');
    families.add(family);
    if(mountedIds){const id=mountedIds[i];if(typeof id!=='string'||!id||ids.has(id))err('DUPLICATE_ARTIFACT_UID');ids.add(id);}
   }
  }
  return true;
 }
 function award(p,name,id=uid()){
  audit(p);if(!definitions.has(name))err('UNKNOWN_ARTIFACT');
  const next={...p,artifacts:[...(p.artifacts||[]),{uid:id,name}],revision:p.revision+1};audit(next);return next;
 }
 function socket(p,artifactId,itemId){
  audit(p);const entry=(p.artifacts||[]).find(x=>x.uid===artifactId);
  const item=p.character.inventory.find(x=>x.uid===itemId);
  if(!entry)err('ARTIFACT_NOT_OWNED');if(!item)err('ITEM_NOT_OWNED');
  if(!compatible(entry.name,item))err('ARTIFACT_SLOT_MISMATCH');
  const existing=item.socketedArtifacts||[];
  if(existing.length>=item.socketCapacity)err('NO_EMPTY_SOCKETS');
  if(existing.some(name=>definitions.get(name)===definitions.get(entry.name)))err('ARTIFACT_FAMILY_DUPLICATE');
  const updated={...item,socketedArtifacts:[...existing,entry.name],socketedArtifactUids:[...(item.socketedArtifactUids||[]),entry.uid]};
  const next={...p,artifacts:p.artifacts.filter(x=>x.uid!==artifactId),character:{...p.character,inventory:p.character.inventory.map(x=>x.uid===itemId?updated:x)},revision:p.revision+1};audit(next);core.audit(next.character);return next;
 }
 function extract(p,itemId,index){
  audit(p);const item=p.character.inventory.find(x=>x.uid===itemId);
  if(!item)err('ITEM_NOT_OWNED');if(!Number.isInteger(index)||index<0||index>=(item.socketedArtifacts||[]).length)err('INVALID_SOCKET_INDEX');
  const name=item.socketedArtifacts[index],id=item.socketedArtifactUids[index];
  const updated={...item,socketedArtifacts:item.socketedArtifacts.filter((_,i)=>i!==index),socketedArtifactUids:item.socketedArtifactUids.filter((_,i)=>i!==index)};
  const next={...p,artifacts:[...(p.artifacts||[]),{uid:id,name}],character:{...p.character,inventory:p.character.inventory.map(x=>x.uid===itemId?updated:x)},revision:p.revision+1};audit(next);core.audit(next.character);return next;
 }
 function roll(p,rng=Math.random){audit(p);const r=rng();if(!Number.isFinite(r)||r<0||r>=1)err('INVALID_RNG');if(r>=DROP_CHANCE_PROVISIONAL)return {player:p,artifact:null};const pick=rng();if(!Number.isFinite(pick)||pick<0||pick>=1)err('INVALID_RNG');const name=names[Math.floor(pick*names.length)];const updated=award(p,name);return {player:updated,artifact:updated.artifacts[updated.artifacts.length-1]};}
 return Object.freeze({audit,award,socket,extract,roll,compatible,names,DROP_CHANCE_PROVISIONAL});
}
return Object.freeze({create,SLOT_CATEGORY,DROP_CHANCE_PROVISIONAL});
});
