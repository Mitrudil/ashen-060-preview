/* ASHEN 0.6 / 172 — isolated canonical PvE loop. No legacy items or Supabase. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Playable172=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const AREAS=Object.freeze({ruins:{name:'Ruiny osiedla',hp:45,armor:1,attack:7,defeatXp:12},hospital:{name:'Stary szpital',hp:78,armor:3,attack:11,defeatXp:20},outpost:{name:'Posterunek wojskowy',hp:114,armor:5,attack:16,defeatXp:35}});
const SLOTS=['right','left','head','outer','shirt','pants','boots','hands','extra','extra2','extra3'];
function error(code){const e=Error('ASHEN 0.6: '+code);e.code=code;throw e}
function create(catalog,quality,bonuses,coreModule,combatModule,effectsModule=null,effectCatalog=null,setDropsModule=null,artifactModule=null){
 if(!combatModule||typeof combatModule.hit!=='function')error('MISSING_COMBAT_176');
 const effects=effectsModule?.create(effectCatalog,bonuses)||null;
 const core=coreModule.create(catalog,quality,bonuses,effects,setDropsModule),bases=catalog.entries();
 const artifacts=artifactModule?artifactModule.create(effectCatalog,core):null;
 const byId=new Map(bases.map(b=>[b.modernId,b]));
 const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
 function fresh(){return {schema:'ashen-v06-playable-172',name:'Wędrowiec',character:core.newSave(),xp:0,attributePoints:0,fights:[],artifacts:[],revision:0};}
 function xpThreshold(level){if(!Number.isInteger(level)||level<1)error('INVALID_LEVEL');return 50*level*(level-1)/2;}
 function levelForXp(xp){let level=1;while(level<50&&xp>=xpThreshold(level+1))level++;return level;}
 function upgradeAttribute(p,attr){audit(p);if(!['str','dex','end','per','int','cha'].includes(attr))error('UNKNOWN_ATTRIBUTE');if(p.attributePoints<=0)error('NO_ATTRIBUTE_POINTS');const next={...p,attributePoints:p.attributePoints-1,revision:p.revision+1,character:{...p.character,attrs:{...p.character.attrs,[attr]:p.character.attrs[attr]+1}}};audit(next);return next;}
 function audit(p){if(!p||p.schema!=='ashen-v06-playable-172'||!p.character||!Number.isSafeInteger(p.xp)||p.xp<0||!Array.isArray(p.fights)||p.fights.length>100||!Number.isSafeInteger(p.revision)||p.revision<0||!Number.isSafeInteger(p.attributePoints)||p.attributePoints<0||p.character.level!==levelForXp(p.xp))error('INVALID_PLAYER');core.audit(p.character);if(artifacts)artifacts.audit(p);return true;}
 function eligible(p){audit(p);return bases.filter(b=>p.character.level>=b.requiredLevel&&p.character.attrs[b.requiredAttribute]>=b.requiredValue);}
 function reward(p,area,random=Math.random){const options=eligible(p);if(!options.length)error('NO_ELIGIBLE_LOOT');const idx=Math.min(options.length-1,Math.floor(clamp(random(),0,.999999)*options.length));const uid='v06-'+((globalThis.crypto&&typeof globalThis.crypto.randomUUID==='function')?globalThis.crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));const result=core.loot(p.character,options[idx].modernId,area,uid,Math.random,Math.random,random);const out={...p,character:result.save,revision:p.revision+1};audit(out);return {player:out,item:result.item};}
 function addStarter(p){audit(p);const b=bases.find(x=>x.category==='biala_1h'&&x.requiredLevel<=1&&x.requiredValue<=p.character.attrs[x.requiredAttribute]);if(!b)error('NO_STARTER');let r=core.loot(p.character,b.modernId,'ruins','starter-172',()=>0,()=>0);let character=core.equip(r.save,'starter-172','right');const out={...p,character,revision:p.revision+1};audit(out);return out;}
 function equip(p,uid,slot){audit(p);const out={...p,character:core.equip(p.character,uid,slot),revision:p.revision+1};audit(out);return out;}
 function unequip(p,slot){audit(p);const out={...p,character:core.unequip(p.character,slot),revision:p.revision+1};audit(out);return out;}
 function fight(p,area,random=Math.random){audit(p);if(!Object.hasOwn(AREAS,area))error('UNKNOWN_AREA');const enemy=AREAS[area],snap=core.summary(p.character);const heroHp=Math.max(1,Math.round((65+snap.attrs.end*5+p.character.level*7+(snap.maxHpBonusFlat||0))*(1+(snap.maxHpBonusPercent||0)/100)));
 let hp=heroHp,foe=enemy.hp,rounds=[],won=false;
 for(let turn=1;turn<=20;turn++){
  let damage=0,criticalHits=0,penetratingHits=0;for(const attack of snap.attacks){const result=combatModule.hit(attack,enemy.armor,random);damage+=result.damage;if(result.critical)criticalHits++;if(result.penetrationPct>0)penetratingHits++;}
  // The unarmed fallback prevents a deadlock for freshly created characters.
  if(!snap.attacks.length)damage=Math.max(1,2+Math.floor(p.character.attrs.str/3)-enemy.armor);
  foe=Math.max(0,foe-damage);let taken=0;
  if(foe>0){taken=Math.max(1,enemy.attack-Math.floor(snap.armor/3));hp=Math.max(0,hp-taken);}
  rounds.push({turn,damage,taken,heroHp:hp,enemyHp:foe,criticalHits,penetratingHits});if(foe<=0){won=true;break;}if(hp<=0)break;
 }
 let next={...p,revision:p.revision+1},item=null,artifactDrop=null;
 if(won){const gain=reward(next,area,random);next=gain.player;item=gain.item;if(artifacts){const rolled=artifacts.roll(next,random);next=rolled.player;artifactDrop=rolled.artifact;}const xp=next.xp+enemy.defeatXp,level=levelForXp(xp),gained=level-next.character.level;next={...next,xp,attributePoints:next.attributePoints+Math.max(0,gained)*3,character:{...next.character,level}};}
 const report={area,won,rounds,damage:rounds.reduce((s,r)=>s+r.damage,0),lootUid:item?.uid||null,lootBaseId:item?.baseId||null,enemy:enemy.name,artifactName:artifactDrop?.name||null};
 next={...next,fights:[...next.fights.slice(-49),report]};audit(next);return {player:next,report,item};
 }
 function exportJson(p){audit(p);return JSON.stringify(p,null,2)}
 function importJson(s){let p;try{p=JSON.parse(s)}catch{error('INVALID_JSON')}audit(p);return p}
 return Object.freeze({core,artifacts,awardArtifact:(p,name,id)=>artifacts.award(p,name,id),socketArtifact:(p,id,item)=>artifacts.socket(p,id,item),extractArtifact:(p,item,index)=>artifacts.extract(p,item,index),AREAS,SLOTS,fresh,audit,addStarter,eligible,reward,equip,unequip,fight,upgradeAttribute,xpThreshold,levelForXp,exportJson,importJson,getBase:id=>byId.get(id)});
}
return Object.freeze({create});
});
