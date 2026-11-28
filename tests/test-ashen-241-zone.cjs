'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const base=path.join(__dirname,'..'),ctx={window:{},Date,Math};
vm.runInNewContext(fs.readFileSync(path.join(base,'js/ashen-zone-239.js'),'utf8'),ctx);
const z=ctx.window.AshenZone239,stats={per:15,dex:15,int:15,end:15};
function ready(won=true){const s=z.initial();for(let i=0;i<4;i++)z.pick(s,i%3,stats,()=>.1);z.setCombat(s,{won,enemy:'Test',lines:['r1']});return s}
for(let choice=0;choice<3;choice++){
 const s=ready();z.pick(s,choice,stats,()=>0);const h=s.history[4];
 assert.equal(s.status,'finished');assert.equal(h.option,choice);assert(h.artifactSignal.detected===true);
 assert(h.artifactSignal.chanceAtDecision>.0);assert(h.artifactSignal.chanceAtDecision<1);
 assert(z.ending(s).text.includes('wykrył możliwy ślad'));
 assert(z.html(s).includes('Nie przyznano przedmiotu'));
 const restored=JSON.parse(JSON.stringify(s));assert.equal(restored.history[4].artifactSignal.detected,true);
 assert.throws(()=>z.pick(restored,choice,stats,()=>1));
 const loss=ready(false);z.pick(loss,choice,stats,()=>.999);assert.equal(loss.history[4].artifactSignal.detected,false);
 assert(z.ending(loss).text.includes('nie potwierdził obecności'));
}
assert(!z.scenes[4].choices[0][0].includes('wydobyć przedmiot'));
const h=fs.readFileSync(path.join(base,'index.html'),'utf8');
assert(h.includes('Build 242'));assert(h.includes('ashen-zone-239.js?v=242'));
console.log('PASS 241: all 3 final choices can reveal artifact signal; fail result possible; no loot; persisted; no rerolls');
