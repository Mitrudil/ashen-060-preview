/* ASHEN 197: purely diagnostic; never creates, imports or changes game items/saves. */
(function(root){
'use strict';
const EQUIPMENT_SLOTS=new Set(['right','left','head','outer','shirt','pants','boots','hands','extra','extra2','extra3']);
const SLOT_ALIASES=Object.freeze({weapon:'right',armor:'outer',accessory1:'head',accessory2:'extra',accessory:'extra'});
const WEAPONS=new Set(['palna_1h','palna_2h','biala_1h','biala_2h','dystansowa']);
const CATEGORY_SLOTS=Object.freeze({glowa:['head'],pancerz:['outer'],koszulka:['shirt'],spodnie:['pants'],buty:['boots'],rekawice:['hands'],akcesorium:['extra','extra2','extra3'],palna_1h:['right','left'],biala_1h:['right','left'],palna_2h:['right'],biala_2h:['right'],dystansowa:['right']});
const OPTIONAL_FIELDS=['prefix','suffix','upgrade','socketCapacity','socketedArtifacts','setId','artifactAffixesInitialized','locked'];
function snapshot(save,baseReport){
 if(!save||typeof save!=='object'||Array.isArray(save))throw Error('INVALID_SAVE');
 if(!baseReport||baseReport.schema!=='ashen-migration-preview-196'||!Array.isArray(baseReport.items))throw Error('INVALID_BASE_REPORT');
 const original=JSON.stringify(save),originalReport=JSON.stringify(baseReport);
 const inventory=Array.isArray(save.inventory)?save.inventory:[], equip=save.equip&&typeof save.equip==='object'&&!Array.isArray(save.equip)?save.equip:{};
 const records=inventory.map((old,i)=>{
   const mapped=baseReport.items[i]||{},issues=[];
   if(!old||typeof old!=='object'||Array.isArray(old))return {index:i,uid:null,legacyId:null,baseId:null,issues:['invalid_item'],safeToImport:false};
   if(mapped.status!=='candidate_requires_modern_modifiers')issues.push('base_mapping_or_quality_not_approved');
   for(const field of ['prefix','suffix'])if(Object.prototype.hasOwnProperty.call(old,field)&&old[field]!=null&&old[field]!==''){
     if(typeof old[field]!=='string')issues.push(field+'_invalid_type');
     else issues.push(field+'_requires_modifier_mapping');
   }
   if(Object.prototype.hasOwnProperty.call(old,'upgrade')){
     if(!Number.isInteger(old.upgrade)||old.upgrade<0||old.upgrade>5)issues.push('legacy_upgrade_out_of_range');
     else if(old.upgrade>0)issues.push('legacy_upgrade_requires_policy');
   }
   if(Object.prototype.hasOwnProperty.call(old,'socketCapacity')){
     if(!Number.isInteger(old.socketCapacity)||old.socketCapacity<0||old.socketCapacity>3)issues.push('socket_capacity_invalid');
     else issues.push('socket_capacity_requires_modern_validation');
   }
   if(Object.prototype.hasOwnProperty.call(old,'socketedArtifacts')){
     if(!Array.isArray(old.socketedArtifacts))issues.push('socketed_artifacts_invalid_type');
     else if(old.socketedArtifacts.length)issues.push('socketed_artifacts_require_identity_check');
     if(Number.isInteger(old.socketCapacity)&&Array.isArray(old.socketedArtifacts)&&old.socketedArtifacts.length>old.socketCapacity)issues.push('sockets_over_capacity');
   }
   if(old.setId!=null)issues.push('legacy_set_requires_validation');
   const unknown=Object.keys(old).filter(k=>!['uid','id','rarity',...OPTIONAL_FIELDS].includes(k));
   if(unknown.length)issues.push('unreviewed_properties');
   return {index:i,uid:old.uid??null,legacyId:old.id??null,baseId:mapped.modernBaseId||null,
      legacy:{prefix:old.prefix??null,suffix:old.suffix??null,upgrade:old.upgrade??null,socketCapacity:old.socketCapacity??null,
      socketedArtifactCount:Array.isArray(old.socketedArtifacts)?old.socketedArtifacts.length:null,setId:old.setId??null},
      unreviewedFields:unknown,issues,safeToImport:false};
 });
 const lookup=new Map();for(const rec of records){if(typeof rec.uid==='string'&&!lookup.has(rec.uid))lookup.set(rec.uid,rec);}
 const bySlot=new Map();const equipment=Object.entries(equip).filter(([,uid])=>uid!=null).map(([oldSlot,uid])=>{
  const slot=SLOT_ALIASES[oldSlot]||oldSlot; const rec=lookup.get(uid);const match=baseReport.items[rec?.index];
  const issues=[];
  if(!EQUIPMENT_SLOTS.has(slot))issues.push('unknown_slot');
  if(!rec)issues.push('missing_inventory_uid');
  if(rec&&match?.status!=='candidate_requires_modern_modifiers')issues.push('item_not_mappable');
  const category=match?.modernBaseId?baseReport.items[rec.index]?.legacyId:null;
  if(bySlot.has(slot))issues.push('multiple_items_target_same_slot');else bySlot.set(slot,uid);
  if(rec){const categoryRecord=baseReport.items[rec.index];const normalizedCategory=categoryRecord?.category||null;
    // The 196 report does not guarantee a trusted category, so never infer a compatible slot from a name.
    if(normalizedCategory&&CATEGORY_SLOTS[normalizedCategory]&&!CATEGORY_SLOTS[normalizedCategory].includes(slot))issues.push('category_slot_conflict');
  }
  return {oldSlot,targetSlot:slot,uid,legacyId:rec?.legacyId||null,issues,safeToImport:false};
 });
 const counts={};for(const r of records)for(const issue of r.issues)counts[issue]=(counts[issue]||0)+1;
 const blocked=records.filter(r=>r.issues.length).length;
 const result={schema:'ashen-197-migration-safety',readOnly:true,readyToImport:false,version:197,
    records,equipment,summary:{total:records.length,itemsWithWarnings:blocked,itemsWithoutDetectedWarnings:records.length-blocked,issueCounts:counts},
    guarantee:'No item may be imported from this diagnostic report. No legacy bonus, prefix, suffix, set, socket or upgrade was converted.',
    originalUnchanged:JSON.stringify(save)===original&&JSON.stringify(baseReport)===originalReport};
 return result;
}
function currentLocal(){
 const migration=root.ASHEN060MigrationPreview196;if(!migration||typeof migration.preview!=='function')return {readOnly:true,error:'LOAD_PREVIEW_196_FIRST'};
 const storage=root.localStorage;if(!storage)return {readOnly:true,error:'NO_STORAGE'};
 const active=storage.getItem('ashen-dev-active-v021')||'main';const key=active==='main'?'ashen-save-v010':'ashen-dev-slot-v021:'+active;
 const raw=storage.getItem(key);if(!raw)return {readOnly:true,saveFound:false,key};
 try{const data=JSON.parse(raw);return {...snapshot(data,migration.preview(data)),saveFound:true,key};}
 catch(e){return {readOnly:true,error:String(e),saveFound:true,key};}
}
root.ASHEN060MigrationSafety197=Object.freeze({snapshot,currentLocal,version:197});
})(typeof window!=='undefined'?window:globalThis);
