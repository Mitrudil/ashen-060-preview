/* ASHEN 203 — read-only legacy profile inspection. No localStorage, no migrations, no network. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060ProfilePreview203=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MAX_BYTES=2*1024*1024;
 const OWN=['name','level','xp','exp','class','archetype','gender','attrs','attributes','stats','inventory','equip','equipmentSchema'];
 const SLOTS=['right','left','head','outer','shirt','pants','boots','hands','extra','extra2','extra3'];
 const safeCopy=value=>JSON.parse(JSON.stringify(value));
 function preview(raw,migrator){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('INVALID_PROFILE');
  if(!Array.isArray(raw.inventory)||!raw.equip||typeof raw.equip!=='object'||Array.isArray(raw.equip))throw Error('MISSING_LEGACY_INVENTORY_OR_EQUIP');
  if(!migrator||typeof migrator.preview!=='function')throw Error('MISSING_MIGRATOR_196');
  const original=JSON.stringify(raw);
  if(original.length>MAX_BYTES)throw Error('FILE_TOO_LARGE');
  const mapping=migrator.preview(safeCopy(raw));
  const fields={};for(const k of OWN){if(Object.prototype.hasOwnProperty.call(raw,k)&&k!=='inventory'&&k!=='equip')fields[k]=safeCopy(raw[k]);}
  const issues=mapping.items.filter(x=>x.status!=='candidate_requires_modern_modifiers').map(x=>({index:x.index,legacyId:x.legacyId||null,status:x.status}));
  const equipmentIssues=mapping.equipment.filter(x=>x.status!=='candidate_only').map(x=>({slot:x.oldSlot,status:x.status}));
  const unknownFields=Object.keys(raw).filter(k=>!OWN.includes(k));
  return {format:'ashen-profile-inspection-203',readOnly:true,readyToImport:false,
   character:fields,unknownFields,inventoryCount:raw.inventory.length,equippedCount:mapping.equipment.length,
   recognizedBases:mapping.items.filter(x=>x.modernBaseId).length,unrecognizedBases:mapping.items.filter(x=>!x.modernBaseId).length,
   itemIssues:issues,equipmentIssues,missingTargetSlots:SLOTS.filter(x=>!(x in raw.equip)),
   itemMapping:mapping.items.map(x=>({legacyId:x.legacyId,modernBaseId:x.modernBaseId,uid:x.uid,status:x.status})),
   warning:'Wyłącznie raport. NIE jest zapisem gry 0.6. Nie importować jako postać.',
   unchanged:JSON.stringify(raw)===original};
 }
 function fromJson(content,migrator){if(typeof content!=='string'||content.length>MAX_BYTES)throw Error('FILE_TOO_LARGE');return preview(JSON.parse(content),migrator)}
 return Object.freeze({preview,fromJson,MAX_BYTES});
});
