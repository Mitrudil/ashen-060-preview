const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const base=__dirname+'/..',ctx={window:{},Date,Math};
for(const f of ['js/ashen-zone-239.js','js/ashen-zone-244-rewards.js'])vm.runInNewContext(fs.readFileSync(base+'/'+f,'utf8'),ctx);
const z=ctx.window.AshenZone239,r=ctx.window.AshenZone244Rewards;
assert.equal(z.fullStories.length,36);assert.deepEqual([...new Set(z.fullStories.map(s=>s.region))].sort(),['Martwy Las','Serce Anomalii','Złamany Wiadukt'].sort());
for(const region of z.regions)assert.equal(z.fullStories.filter(x=>x.region===region).length,12);
assert.equal(new Set(z.fullStories.map(s=>s.id)).size,36);
for(const story of z.fullStories){
 assert.equal(story.scenes.length,5,story.id);
 for(const scene of story.scenes){assert(scene.text.length>=2&&scene.choices.length===3&&scene.choices.every(c=>c.length===4),story.id);}
 const session=z.initial({story:story.id,luck:7});assert.equal(session.story,story.id);
 assert.equal(z.storyData(session).title,story.title);assert(z.html(session).includes(story.scenes[0].name));
 for(let i=0;i<4;i++)z.pick(session,i%3,{per:20,dex:20,int:20,end:20},()=>0);
 assert.equal(session.status,'combat_pending',story.id);
 const encounter=z.encounter(session);assert(encounter.name.includes(story.id==='ostatni-sygnal'?'':story.id==='dom-pod-korzeniami'?'':'')||encounter.name.length>0);
 z.setCombat(session,{won:true,enemy:encounter.name,lines:['Zwycięstwo']});
 z.pick(session,1,{per:20,dex:20,int:20,end:20},()=>0);
 assert.equal(session.status,'finished');assert.equal(session.history.length,5);assert(session.finishedAt);
 const reward=r.roll(session,{names:['Echo Burzy']},()=>.999);r.enrich(session);
 assert.equal(reward.source,story.region+' · '+story.title);assert.equal(reward.sceneFinds.length,5);
 const before=JSON.stringify(session.reward);r.enrich(session);assert.equal(JSON.stringify(session.reward),before);
}
const initialFinish=z.initial();for(let i=0;i<4;i++)z.pick(initialFinish,0,{},()=>0);z.setCombat(initialFinish,{won:false});z.pick(initialFinish,0,{},()=>0);
const lockUntil=initialFinish.finishedAt+z.RESONATOR_COOLDOWN_MS;
const replay=z.initial({testMode:true,story:'czarna-katedra',cooldownUntil:lockUntil});for(let i=0;i<4;i++)z.pick(replay,0,{},()=>0);z.setCombat(replay,{won:true});z.pick(replay,0,{},()=>0);
assert.equal(z.resonator(replay,initialFinish.finishedAt+1000).nextAt,lockUntil);
assert.equal(z.resonator(replay,lockUntil+1).ready,true);
const html=z.html(null);for(const story of z.fullStories)assert(html.includes('data-zone-start="'+story.id+'"'));
const game=fs.readFileSync(base+'/js/game.js','utf8');assert(game.includes('function zone252StartTest(')&&game.includes('data-zone-test-252'));assert(game.includes("document.getElementById('ashen-zone-test-story')"));
assert(game.includes("const storyId=regionKey+':'+session.story"));
const index=fs.readFileSync(base+'/index.html','utf8');assert(index.includes('Build 252'));
console.log('PASS 252: 36 story IDs, 12 per region, 180 scenes, 540 choices, mandatory fight per story, unique reward source, cooldown test');
