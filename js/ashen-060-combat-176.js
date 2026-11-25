/* ASHEN 0.6 — etap 176. Canonical weapon-base critical and penetration PvE.
   Candidate formulas pending balancing; no legacy IDs, no network side effects. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Combat176=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function roll(rng){const v=Number(rng());if(!Number.isFinite(v)||v<0||v>=1)throw Error('INVALID_RNG');return v}
function hit(attack,enemyArmor,rng=Math.random){
 if(!attack||!Number.isInteger(attack.min)||!Number.isInteger(attack.max)||attack.min<1||attack.max<attack.min||!Number.isFinite(enemyArmor)||enemyArmor<0)throw Error('INVALID_COMBAT_INPUT');
 const criticalChance=clamp(Number(attack.critChancePp||0),0,100);
 const penetration=clamp(Number(attack.penetrationPct||0),0,100);
 if(!Number.isFinite(criticalChance)||!Number.isFinite(penetration))throw Error('INVALID_COMBAT_BONUS');
 const raw=attack.min+Math.floor(roll(rng)*(attack.max-attack.min+1));
 const crit=criticalChance>0&&roll(rng)<criticalChance/100;
 const amplified=crit?Math.round(raw*1.5):raw; // temporary candidate 0.6 critical multiplier
 const effectiveArmor=Math.max(0,Math.floor(enemyArmor*(1-penetration/100)));
 return {damage:Math.max(1,amplified-effectiveArmor),critical:crit,penetrationPct:penetration,effectiveArmor,raw};
}
return Object.freeze({hit});
});
