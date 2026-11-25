/* ASHEN 0.6 / stage 171 — one canonical item engine, zero legacy item IDs.
 * Candidate only: the old game engine still requires a separate replacement.
 * Accepts the canonical 100-base catalog and the modern quality/bonuses APIs.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Core171=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const SLOTS=Object.freeze(['right','left','head','outer','shirt','pants','boots','hands','extra','extra2','extra3']);
const NON_HAND=Object.freeze({head:'head',outer:'outer',shirt:'shirt',pants:'pants',boots:'boots',hands:'hands',extra:'extra',extra2:'extra',extra3:'extra'});
const WEAPONS=new Set(['palna_1h','biala_1h','palna_2h','biala_2h','dystansowa']);
function fail(code){const e=new Error('ASHEN 0.6: '+code);e.code=code;throw e}
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function apiFor(catalog,quality,bonuses,effects=null,setDrops=null){
 if(!catalog||typeof catalog.entries!=='function'||!quality||typeof quality.createNewDrop!=='function'||!bonuses||typeof bonuses.createLootItem!=='function')fail('MISSING_DEPENDENCY');
 const bases=catalog.entries();if(bases.length!==100||new Set(bases.map(x=>x.modernId)).size!==100)fail('INVALID_CATALOG');
 const byId=new Map(bases.map(x=>[x.modernId,x]));
 const getBase=id=>byId.get(id)||fail('UNKNOWN_BASE');
 const empty=()=>Object.fromEntries(SLOTS.map(s=>[s,null]));
 function newSave(character={}){
  return {equipmentSchema:'ashen-v06',level:Number.isInteger(character.level)&&character.level>=1?character.level:1,
   attrs:{str:5,dex:5,end:5,per:5,int:5,cha:5,...(character.attrs||{})},inventory:[],equip:empty()};
 }
 function audit(save){
  if(!save||save.equipmentSchema!=='ashen-v06'||!Array.isArray(save.inventory)||!save.equip||typeof save.equip!=='object'||Array.isArray(save.equip)||!Number.isInteger(save.level)||save.level<1)fail('INVALID_SAVE');
  if(!save.attrs||['str','dex','end','per','int','cha'].some(k=>!Number.isFinite(save.attrs[k])||save.attrs[k]<0))fail('INVALID_ATTRS');
  if(Object.keys(save.equip).some(k=>!SLOTS.includes(k)))fail('UNKNOWN_SLOT');
  const uids=new Set(),index=new Map();
  for(const item of save.inventory){
   if(!item||typeof item.uid!=='string'||!item.uid||uids.has(item.uid)||typeof item.baseId!=='string')fail('INVALID_ITEM_UID');
   if(own(item,'id')||own(item,'legacyId'))fail('LEGACY_ITEM_FIELD');
   const base=getBase(item.baseId);
   try{quality.validateModern(item);bonuses.validateItem(item,effects?.catalog);if(setDrops)setDrops.validate(item,base,effects?.catalog)}catch{fail('INVALID_MODERN_ITEM')}
   if(item.socketedArtifacts?.length && new Set(item.socketedArtifacts).size!==item.socketedArtifacts.length)fail('DUPLICATED_ARTIFACT');
   uids.add(item.uid);index.set(item.uid,item);
  }
  const equipped=new Set();
  for(const slot of SLOTS){
   const uid=save.equip[slot];if(uid===null||uid===undefined)continue;
   if(typeof uid!=='string'||!index.has(uid)||equipped.has(uid))fail('INVALID_EQUIPMENT');
   equipped.add(uid);
   const base=getBase(index.get(uid).baseId);
   if(WEAPONS.has(base.category)){
    if(slot!=='right'&&slot!=='left')fail('WRONG_HAND_SLOT');
    if(base.category.endsWith('_2h')||base.category==='dystansowa'){
     if(slot!=='right'||save.equip.left!=null)fail('TWO_HAND_CONFLICT');
    }
   }else if(NON_HAND[slot]!==base.gameSlot && !(base.gameSlot==='extra'&&NON_HAND[slot]==='extra'))fail('WRONG_EQUIP_SLOT');
   if(save.level<base.requiredLevel||save.attrs[base.requiredAttribute]<base.requiredValue)fail('REQUIREMENTS_NOT_MET');
  }
  if(effects)try{effects.resolve(save)}catch{fail('INVALID_EQUIPMENT_EFFECTS')}
  return {items:uids.size,equipped:equipped.size,modern:true};
 }
 function loot(save,baseId,pool,uid,rngQuality=Math.random,rngSockets=Math.random,rngSet=Math.random){
  audit(save);getBase(baseId);
  if(typeof uid!=='string'||!uid||save.inventory.some(x=>x.uid===uid))fail('INVALID_ITEM_UID');
  const basic=quality.createNewDrop({uid,baseId},pool,bonuses,rngQuality,rngSockets);
  const item=setDrops?setDrops.assign(basic,getBase(baseId),effects?.catalog,rngSet):basic;
  const next={...save,inventory:[...save.inventory,item]};audit(next);return {save:next,item};
 }
 function equip(save,uid,slot){
  audit(save);if(!SLOTS.includes(slot))fail('UNKNOWN_SLOT');
  const inst=save.inventory.find(i=>i.uid===uid);if(!inst)fail('NOT_OWNED');
  const base=getBase(inst.baseId);
  if(save.level<base.requiredLevel||save.attrs[base.requiredAttribute]<base.requiredValue)fail('REQUIREMENTS_NOT_MET');
  const isWeapon=WEAPONS.has(base.category),twoHand=isWeapon&&(base.category.endsWith('_2h')||base.category==='dystansowa');
  if(isWeapon?(!['right','left'].includes(slot)||(twoHand&&slot!=='right')):NON_HAND[slot]!==base.gameSlot)fail('WRONG_EQUIP_SLOT');
  const next={...save,equip:{...save.equip}};
  for(const s of SLOTS)if(next.equip[s]===uid)next.equip[s]=null;
  if(twoHand)next.equip.left=null;
  if(slot==='left'&&next.equip.right){const main=getBase(save.inventory.find(i=>i.uid===next.equip.right).baseId);if(main.category.endsWith('_2h')||main.category==='dystansowa')next.equip.right=null;}
  next.equip[slot]=uid;audit(next);return next;
 }
 function unequip(save,slot){audit(save);if(!SLOTS.includes(slot))fail('UNKNOWN_SLOT');const next={...save,equip:{...save.equip,[slot]:null}};audit(next);return next;}
 function summary(save){audit(save);
  const index=new Map(save.inventory.map(x=>[x.uid,x]));const attrs={...save.attrs};let armor=0;const attacks=[];
  const extra=effects?effects.resolve(save):null;
  for(const slot of SLOTS){const uid=save.equip[slot];if(!uid)continue;
   const item=index.get(uid),base=getBase(item.baseId),m=quality.MULTIPLIERS[item.rarity];
   if(WEAPONS.has(base.category)){
    const power=slot==='left'?.8:1;
    for(let a=0;a<base.baseAttacks;a++)attacks.push({uid,hand:slot,min:Math.max(1,Math.round(base.minDamage*m*power)),max:Math.max(1,Math.round(base.maxDamage*m*power)),critChancePp:base.critChanceBonusPp||0,penetrationPct:base.penetrationPct||0});
   }else for(const effect of base.baseEffects||[]){
    if(effect.key==='armorFlat')armor+=Math.max(0,Math.round(effect.value*m));
    else if(own(attrs,effect.key))attrs[effect.key]+=Math.round(effect.value*m);
   }
  }
  if(extra){
   for(const [k,v] of Object.entries(extra.attrs))attrs[k]=(attrs[k]||0)+v;
   armor=Math.max(0,Math.round(armor+extra.armor));
   const percent=Math.max(-90,extra.damagePercent);
   for(const a of attacks){
    a.min=Math.max(1,Math.round(a.min*(1+percent/100)));
    a.max=Math.max(a.min,Math.round(a.max*(1+percent/100)));
    a.critChancePp=Math.max(0,Math.min(100,a.critChancePp+extra.critPoints));
    a.penetrationPct=Math.max(0,Math.min(100,a.penetrationPct+extra.penetrationPoints));
   }
   if(extra.extraAttacks>0&&attacks.length){
    const main=attacks.find(a=>a.hand==='right')||attacks[0];
    for(let i=0;i<extra.extraAttacks;i++)attacks.push({...main,bonusAttack:true});
   }
  }
  return {attrs,armor,attacks,attackCount:attacks.length,damageMin:attacks.reduce((s,a)=>s+a.min,0),damageMax:attacks.reduce((s,a)=>s+a.max,0),
   maxHpBonusPercent:extra?.hpPercent||0,maxHpBonusFlat:extra?.hpFlat||0,effects:extra};
 }
 return Object.freeze({newSave,audit,loot,equip,unequip,summary,getBase,catalogSize:bases.length});
}
return Object.freeze({create:apiFor,SLOTS});
});
