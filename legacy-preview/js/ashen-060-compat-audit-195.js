/* ASHEN 195: diagnostics only. Never writes to storage or mutates player state. */
(function(root){
  'use strict';
  const STANDARD_SLOTS=['right','left','head','outer','shirt','pants','boots','hands','extra','extra2','extra3'];
  const OLD_SAVE_KEY='ashen-save-v010';
  const ACTIVE_PROFILE_KEY='ashen-dev-active-v021';
  const PROFILE_PREFIX='ashen-dev-slot-v021:';
  function inspect(raw){
    const original=raw&&typeof raw==='object'?raw:{};
    const equipment=original.equip&&typeof original.equip==='object'?original.equip:{};
    const inventory=Array.isArray(original.inventory)?original.inventory:[];
    const occupied=Object.entries(equipment).filter(([,uid])=>uid!==null&&uid!==undefined);
    const ids=new Set(inventory.map(x=>x&&x.uid).filter(x=>typeof x==='string'));
    const dangling=occupied.filter(([,uid])=>!ids.has(uid)).map(([slot,uid])=>({slot,uid}));
    const oldSlotKeys=Object.keys(equipment);
    const missingSlots=STANDARD_SLOTS.filter(s=>!(s in equipment));
    const extraSlots=oldSlotKeys.filter(s=>!STANDARD_SLOTS.includes(s));
    const legacyItems=inventory.filter(x=>x&&typeof x.id==='string'&&!x.modernId).length;
    return Object.freeze({
      readOnly:true,
      sourceSchema:original.equipmentSchema||'legacy',
      targetSchema:'ashen-v06',
      characterLevel:Number.isInteger(original.level)?original.level:null,
      inventoryCount:inventory.length,
      equipmentSlotsFound:oldSlotKeys,
      targetSlots:STANDARD_SLOTS.slice(),
      missingSlots,
      extraSlots,
      equippedCount:occupied.length,
      danglingEquipment:dangling,
      legacyItemIdsNeedingMapping:legacyItems,
      canDirectlyLoadInCore060:original.equipmentSchema==='ashen-v06'&&missingSlots.length===0&&dangling.length===0,
      requiresItemMigration:legacyItems>0,
      status:'DIAGNOSTYKA_TYLKO_ODCZYT_BEZ_MIGRACJI'
    });
  }
  function fromLocalStorage(){
    const active=root.localStorage.getItem(ACTIVE_PROFILE_KEY)||'main';
    const key=active==='main'?OLD_SAVE_KEY:PROFILE_PREFIX+active;
    const raw=root.localStorage.getItem(key);
    if(!raw)return {saveFound:false,activeProfile:active,key,readOnly:true};
    try{return {...inspect(JSON.parse(raw)),saveFound:true,activeProfile:active,key};}
    catch(e){return {saveFound:true,readOnly:true,parseError:String(e),activeProfile:active,key};}
  }
  root.ASHEN060Compatibility195=Object.freeze({inspect,fromLocalStorage,version:'195-readonly'});
})(typeof window!=='undefined'?window:globalThis);
