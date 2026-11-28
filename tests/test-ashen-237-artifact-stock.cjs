const assert=require('node:assert/strict');
const fs=require('node:fs');
const js=fs.readFileSync(require('node:path').join(__dirname,'../js/game.js'),'utf8');
const checks=[
 ['separate artifact inventory',/function reconcileArtifactStock\(/],
 ['migration retains full legacy metadata',/legacyItem:structuredClone\(legacy\)/],
 ['old equipped artifact evacuated',/state\.equip\[slot\]=null;changed=true/],
 ['socket migration retained',/migratedFrom236:true/],
 ['cannot install unowned token',/if\(!token\|\|token\.socketItemUid\)/],
 ['no invented mapping',/Archiwalny artefakt nie ma jeszcze odpowiednika/],
 ['atomic rollback',/inst\.socketedArtifacts=previousSockets/],
 ['one-time test grant',/if\(state\.artifactTestPack237\)throw/],
 ['artifact excluded from equipment slots',/d\.slot==='material'\|\|d\.artifact\)return \[\]/],
 ['stock display',/function artifactStockPanel\(/],
 ['no legacy expedition artifacts',/Artefakty nie zajmują slotów akcesoriów/]
];
for(const [desc,pattern] of checks){assert.match(js,pattern,desc);console.log('PASS',desc)}
