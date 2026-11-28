'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),ctx={window:{},Date,Math};
for(const f of ['js/ashen-zone-239.js','js/ashen-zone-244-rewards.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
const z=ctx.window.AshenZone239,r=ctx.window.AshenZone244Rewards;
const stats={per:16,dex:16,int:16,end:16};
const names=['Płytka Bastionu','Echo Burzy','Moduł Celownika'];
function completed(choice=0,mode=false){
 const s=z.initial({luck:12,testMode:mode});
 for(let i=0;i<4;i++)z.pick(s,i%3,stats,()=>.1);
 z.setCombat(s,{won:true,enemy:'Nasłuchujący',lines:[]});z.pick(s,choice,stats,()=>.1);
 return s;
}
for(let choice=0;choice<3;choice++){
 const s=completed(choice);const reward=r.roll(s,{names},()=>0);
 assert.equal(reward.artifactName,names[0]);assert.equal(reward.id.startsWith('zone244:'),true);
 assert.equal(r.roll(s,{names},()=>1),reward);assert.equal(s.reward.artifactName,names[0]);
 assert(r.receipt(s).includes(names[0]));
 assert.throws(()=>z.pick(s,choice,stats,()=>1));
 const other=completed(choice);const empty=r.roll(other,{names},()=>.999);
 assert.equal(empty.artifactName,null);assert(empty.scrap>=0);
}
assert.throws(()=>r.roll(completed(0,true),{names},()=>0));
const noArtifact=r.roll(completed(0),{names},()=>.999);assert(r.receipt({reward:noArtifact}).includes('Nie znaleziono artefaktu'));
const old=completed();delete old.rewardSystemVersion;assert.throws(()=>r.roll(old,{names},()=>0));
// Evaluate the actual payout function with simulated storage: double execution may not grant a second item.
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const a=game.indexOf('function zone244Claim(session){'),b=game.indexOf('function zone244Reconcile(){',a);
assert(a>0&&b>a);
const memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
const state={scrap:10,artifactStock:[],zoneRewardClaimIds:[]};let sessionWrites=0;
const context={state,KEY:'test-char',localStorage:storage,devActiveId:()=> 'other',devProfileSaveKey:()=> 'never',artifactCatalogName:n=>names.includes(n)?n:null,window:{ASHEN_ONLINE:{localChanged(){}}},zone239Write:s=>{sessionWrites++;storage.setItem('test-zone',JSON.stringify(s));},Error,JSON,Number,Math,Array,String};
vm.runInNewContext(game.slice(a,b),context);
const s=completed();r.roll(s,{names},()=>0);
context.zone244Claim(s);assert.equal(context.state.artifactStock.length,1);const after=context.state.scrap;
context.zone244Claim(s);assert.equal(context.state.artifactStock.length,1);assert.equal(context.state.scrap,after);
const restored=JSON.parse(JSON.stringify(s));restored.rewardClaimed=false;
context.zone244Claim(restored);assert.equal(context.state.scrap,after);assert.equal(restored.rewardClaimed,true);
assert.equal(sessionWrites,2);assert.equal(JSON.parse(memory.get('test-char')).artifactStock.length,1);
// Deployment / regression invariants
assert(game.includes('zone244Reconcile()'));
assert(game.includes('initial({testMode:true,luck:explorationStats().luck})'));
assert(game.includes('initial({luck:explorationStats().luck})'));
assert(game.includes('zone239Write(session);if(session.reward)zone244Claim(session)'));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('Build 245')&&html.indexOf('ashen-zone-244-rewards.js')<html.indexOf('game.js?v=245'));
console.log('PASS 244: 3 finales, random chance & duplicates, one-time reward, inventory stock, restore and test-mode no rewards');
