/* ASHEN 0.6 / stage 178: canonical set-family drops (no legacy IDs).
 * The 12% drop parameter is provisional and must be balanced before release.
 * Prefix/suffix effects are intentionally not invented.
 */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060SetDrops178=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const CLOTHES=new Set(['head','outer','shirt','pants','boots','hands']);
function groupForBase(base){if(!base||typeof base!=='object')return null;if(base.gameSlot==='extra')return 'Akcesoria';return CLOTHES.has(base.gameSlot)?'Odzież':null;}
function familiesForBase(base,catalog){const group=groupForBase(base);if(!group||!Array.isArray(catalog?.sets))return [];
 return catalog.sets.filter(s=>s.kind===group).map(s=>s.name);}
function validRoll(r){const v=Number(r);if(!Number.isFinite(v)||v<0||v>=1)throw Error('INVALID_SET_ROLL');return v;}
function assign(item,base,catalog,rng=Math.random,chance=0.12){
 if(!item||typeof item!=='object'||item.qualitySchema!=='ashen-v06')throw Error('INVALID_SET_ITEM');
 if(Object.hasOwn(item,'setFamily'))throw Error('SET_ALREADY_ASSIGNED');
 if(!Number.isFinite(chance)||chance<0||chance>1)throw Error('INVALID_SET_CHANCE');
 const families=familiesForBase(base,catalog);if(!families.length||!chance)return {...item};
 if(validRoll(rng())>=chance)return {...item};
 const family=families[Math.floor(validRoll(rng())*families.length)];return {...item,setFamily:family};
}
function validate(item,base,catalog){if(!Object.hasOwn(item,'setFamily'))return true;
 if(typeof item.setFamily!=='string'||!familiesForBase(base,catalog).includes(item.setFamily))throw Error('INVALID_SET_FAMILY');
 return true;}
return Object.freeze({assign,validate,familiesForBase,groupForBase,PROVISIONAL_CHANCE:0.12});
});
