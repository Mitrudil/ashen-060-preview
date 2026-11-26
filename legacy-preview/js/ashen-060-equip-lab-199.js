/* ASHEN 199: real 0.6 loot/equip/unequip in volatile isolated test save.
   Uses ONLY the isolated sandbox key for a disposable test character. Never accesses legacy save keys, cookies, Supabase or network. */
(function(root){
'use strict';
const doc=root.document;
const core=root.Ashen060Core171, cat=root.Ashen060BaseCatalog, quality=root.Ashen060Quality, bonuses=root.Ashen060Bonuses;
if(!doc||!core||!cat||!quality||!bonuses)return;
const api=core.create(cat,quality,bonuses);
const sourceItems=cat.entries();
const lookup=new Map(sourceItems.map(x=>[x.modernId,x]));
const knownImages={"tshirt":"assets/items/shirts/tshirt.webp","thermal":"assets/items/shirts/thermal.webp","armorshirt":"assets/items/shirts/armorshirt.webp","scoutshirt":"assets/items/shirts/scoutshirt.webp","techshirt":"assets/items/shirts/techshirt.webp","combatboots":"assets/items/boots/combatboots.webp","hazboots":"assets/items/boots/hazboots.webp","sneakers":"assets/items/boots/sneakers.webp","silentboots":"assets/items/boots/silentboots.webp","workboots":"assets/items/boots/workboots.webp","smg":"assets/items/weapons/smg.webp","flame":"assets/items/weapons/flame.webp","pipe":"assets/items/weapons/pipe.webp","machete":"assets/items/weapons/machete.webp","sledge":"assets/items/weapons/sledge.webp","crowbar":"assets/items/weapons/crowbar.webp","rifle":"assets/items/weapons/rifle.webp","wrench":"assets/items/weapons/wrench.webp","deserteagle":"assets/items/weapons/deserteagle.webp","rail":"assets/items/weapons/rail.webp","shotgun":"assets/items/weapons/shotgun.webp","hatchet":"assets/items/weapons/hatchet.webp","lmg":"assets/items/weapons/lmg.webp","pistol":"assets/items/weapons/pistol.webp","sniper":"assets/items/weapons/sniper.webp","carbine":"assets/items/weapons/carbine.webp","crossbow":"assets/items/weapons/crossbow.webp","harpoon":"assets/items/weapons/harpoon.webp","cleaver":"assets/items/weapons/cleaver.webp","revolver":"assets/items/weapons/revolver.webp","saber":"assets/items/weapons/saber.webp","baton":"assets/items/weapons/baton.webp","knife":"assets/items/weapons/knife.webp","hammer":"assets/items/weapons/hammer.webp","fingerless":"assets/items/hands/fingerless.webp","steelbracers":"assets/items/hands/steelbracers.webp","scoutbracers":"assets/items/hands/scoutbracers.webp","zerobracers":"assets/items/hands/zerobracers.webp","gloves":"assets/items/hands/gloves.webp","workgloves":"assets/items/hands/workgloves.webp","leathergloves":"assets/items/hands/leathergloves.webp","tacticalgloves":"assets/items/hands/tacticalgloves.webp","kevlarbracers":"assets/items/hands/kevlarbracers.webp","jeans":"assets/items/pants/jeans.webp","cargo":"assets/items/pants/cargo.webp","scoutpants":"assets/items/pants/scoutpants.webp","kevlarpants":"assets/items/pants/kevlarpants.webp","radiopants":"assets/items/pants/radiopants.webp","maskhelm":"assets/items/head/maskhelm.webp","cap":"assets/items/head/cap.webp","commanderhelm":"assets/items/head/commanderhelm.webp","hood":"assets/items/head/hood.webp","helmet":"assets/items/head/helmet.webp","mask":"assets/items/head/mask.webp","riot":"assets/items/armor/riot.webp","hazmat":"assets/items/armor/hazmat.webp","leather":"assets/items/armor/leather.webp","military":"assets/items/armor/military.webp","sentinel":"assets/items/armor/sentinel.webp","vest":"assets/items/armor/vest.webp","kevlar":"assets/items/armor/kevlar.webp","exosuit":"assets/items/armor/exosuit.webp","coat":"assets/items/armor/coat.webp","jacket":"assets/items/armor/jacket.webp","scrap":"assets/items/materials/scrap.webp","chemicals":"assets/items/materials/chemicals.webp","circuits":"assets/items/materials/circuits.webp","fuel":"assets/items/materials/fuel.webp","parts":"assets/items/materials/parts.webp","scope":"assets/items/accessories/scope.webp","neckwarmer":"assets/items/accessories/neckwarmer.webp","bracelet":"assets/items/accessories/bracelet.webp","nightgoggles":"assets/items/accessories/nightgoggles.webp","scarf":"assets/items/accessories/scarf.webp","goggles":"assets/items/accessories/goggles.webp","bandana":"assets/items/accessories/bandana.webp","dustglasses":"assets/items/accessories/dustglasses.webp","radio":"assets/items/accessories/radio.webp","injector":"assets/items/accessories/injector.webp","compass":"assets/items/accessories/compass.webp","module":"assets/items/accessories/module.webp","badge":"assets/items/accessories/badge.webp"};
function illustration(base){const key=String(base?.legacyId||'');return Object.prototype.hasOwnProperty.call(knownImages,key)?'./'+knownImages[key]:null;}
let bagQuery='', bagFilter='all';
let level=1;
let save=api.newSave({level,attrs:{str:5,dex:5,end:5,per:5,int:5,cha:5}});
let counter=0;
const vault=root.Ashen060Sandbox202;
const safeStore=(()=>{try{return root.localStorage||null}catch{return null}})();
let undoRecord=null;
let persistStatus='';
function persist(){
 if(!safeStore||!vault){persistStatus='Zapis lokalny niedostępny';return false}
 try{vault.write(safeStore,save,counter,api);persistStatus='Stan testowy zapisany lokalnie';return true}
 catch(e){persistStatus='Błąd zapisu: '+e.message;return false}
}
function commit(next,nextCounter){
 const previous={save,counter};save=next;counter=nextCounter;
 if(!persist()){save=previous.save;counter=previous.counter;return false}
 undoRecord=previous;return true;
}

const htmlSafe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slots={palna_1h:['right','left'],biala_1h:['right','left'],palna_2h:['right'],biala_2h:['right'],dystansowa:['right'],glowa:['head'],pancerz:['outer'],koszulka:['shirt'],spodnie:['pants'],buty:['boots'],rekawice:['hands'],akcesorium:['extra','extra2','extra3']};
const labels={right:'Prawa ręka',left:'Lewa ręka',head:'Głowa',outer:'Pancerz',shirt:'Koszulka',pants:'Spodnie',boots:'Buty',hands:'Rękawice',extra:'Akcesorium 1',extra2:'Akcesorium 2',extra3:'Akcesorium 3'};
const style=doc.createElement('style');style.textContent=`
#ashen-equip-lab-launch-199{position:fixed;right:16px;bottom:72px;z-index:2147483000;border:1px solid #7b9c90;border-radius:10px;padding:12px 17px;background:#152b29;color:#d5f3e7;box-shadow:0 5px 22px #0009;font-weight:700;cursor:pointer}
#ashen-equip-lab-overlay-199{display:none;position:fixed;inset:0;z-index:2147483003;padding:3vh 3vw;box-sizing:border-box;background:#080d0de8;color:#e6dfce;font:14px/1.5 system-ui,sans-serif}
#ashen-equip-lab-overlay-199.visible{display:block}
#ashen-equip-lab-panel-199{max-width:980px;height:100%;overflow:auto;margin:auto;padding:22px;box-sizing:border-box;background:linear-gradient(155deg,#293632,#111a1d 65%);border:1px solid #a48654;border-radius:12px}
#ashen-equip-lab-panel-199 h2{color:#e8cf9d;margin:0 0 7px;font:700 25px Georgia,serif}
#ashen-equip-lab-panel-199 button,#ashen-equip-lab-panel-199 select{background:#253532;color:#eee5cc;border:1px solid #927b55;border-radius:6px;padding:9px;cursor:pointer}
#ashen-equip-lab-panel-199 .lab-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:14px 0}
#ashen-equip-lab-panel-199 .lab-row label{display:grid;gap:5px}
#ashen-equip-lab-panel-199 .lab-status{padding:10px;background:#18302a;border:1px solid #49675e;border-radius:8px}
#ashen-equip-lab-panel-199 .lab-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:8px;margin:12px 0}
#ashen-equip-lab-panel-199 .lab-slot{border:1px solid #576056;padding:10px;background:#1b2728;border-radius:8px;min-height:45px}
#ashen-equip-lab-panel-199 .lab-slot small{display:block;color:#a7aaa2}
#ashen-equip-lab-panel-199 .lab-note{color:#c5c0b0;font-size:12px}
#ashen-equip-native-200{margin:14px 0;border:1px solid #90764e;border-radius:10px;padding:14px 18px;background:linear-gradient(115deg,#252e2a,#152024);color:#e9ddc3}
#ashen-equip-native-200 .native-actions{display:flex;gap:8px;flex-wrap:wrap;margin:9px 0}
#ashen-equip-native-200 button{background:#3a493d;border:1px solid #a18b60;border-radius:6px;color:#f1e9d3;padding:8px 12px;cursor:pointer}
#ashen-equip-native-200 .native-summary{color:#ded1ad;font-size:13px}
#ashen-equip-native-200 .native-warning{color:#e3ad81;font-size:12px}
#ashen-equip-native-200 .native-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:9px;margin:12px 0}
#ashen-equip-native-200 .native-slot{background:#151f22;border:1px solid #53635f;padding:10px;border-radius:8px;min-height:88px;display:flex;flex-direction:column;gap:5px}
#ashen-equip-native-200 .native-slot strong{color:#d3b985;font-size:12px}
#ashen-equip-native-200 .native-slot span{font-size:13px;overflow-wrap:anywhere;flex:1}
#ashen-equip-native-200 .native-slot button{font-size:12px;padding:5px 8px}
#ashen-equip-native-200 .native-form{display:flex;flex-wrap:wrap;align-items:end;gap:9px}
#ashen-equip-native-200 .native-form label{display:grid;gap:3px;flex:1;min-width:180px;font-size:12px}
#ashen-equip-native-200 select{width:100%;min-width:0;padding:8px;border:1px solid #90764e;border-radius:6px;background:#192729;color:#e9ddc3}
#ashen-equip-native-200 .native-bag{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:7px;margin:12px 0}
#ashen-equip-native-200 .native-bag-item{display:flex;flex-direction:column;justify-content:space-between;gap:7px;padding:9px;border:1px solid #53635f;background:#131e20;border-radius:6px}
#ashen-equip-native-200 .native-bag-item small{color:#b4a58c}
#ashen-equip-native-200 .native-bag-toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:end;margin:12px 0}
#ashen-equip-native-200 .native-bag-toolbar label{display:grid;gap:4px;flex:1;min-width:140px;font-size:12px}
#ashen-equip-native-200 .native-bag-toolbar input,#ashen-equip-native-200 .native-bag-toolbar select{border:1px solid #90764e;border-radius:6px;padding:8px;background:#192729;color:#e9ddc3}
#ashen-equip-native-200 .native-bag-item .native-bag-info{display:flex;align-items:center;gap:10px}
#ashen-equip-native-200 .native-bag-item img{width:64px;height:64px;object-fit:contain;flex:0 0 64px;border:1px solid #46544c;border-radius:6px;background:#0d171a}
#ashen-equip-native-200 .native-bag-count{font-size:12px;color:#d4be91}
#ashen-equip-native-200 .native-bag-item[data-worn="yes"]{border-color:#ae9566}
#ashen-equip-native-200 .native-result{margin-top:9px;padding:7px 10px;background:#1b302b;border-radius:6px;min-height:22px;font-size:12px}

`;doc.head.appendChild(style);
const launch=doc.createElement('button');launch.id='ashen-equip-lab-launch-199';launch.type='button';launch.textContent='⚙ Próba wyposażenia 0.6';doc.body.appendChild(launch);
const overlay=doc.createElement('section');overlay.id='ashen-equip-lab-overlay-199';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-label','Próba wyposażenia 0.6');overlay.setAttribute('aria-modal','true');
overlay.innerHTML=`<div id="ashen-equip-lab-panel-199"><div class="lab-row" style="justify-content:space-between"><div><h2>Próba wyposażenia — silnik 0.6</h2><div class="lab-note">Funkcje loot → equip → unequip na oddzielnej postaci testowej 0.6, z osobnym zapisem lokalnym.</div></div><button id="ashen-equip-lab-close-199" type="button">Zamknij ✕</button></div><div class="lab-row"><label>Postać testowa<select id="ashen-equip-lab-level-199"><option value="1">Poziom 1 · atrybuty 5</option><option value="50">Poziom 50 · atrybuty 99 (kontrola sprzętu)</option></select></label><label>Przedmiot z pełnego katalogu 100 baz<select id="ashen-equip-lab-base-199"></select></label><label>Docelowy slot<select id="ashen-equip-lab-slot-199"></select></label><button type="button" id="ashen-equip-lab-wear-199">Wylosuj i załóż (0.6)</button><button type="button" id="ashen-equip-lab-reset-199">Reset próby</button><button type="button" data-vault-202="undo">Cofnij ostatnią zmianę</button><button type="button" data-vault-202="export">Eksport JSON</button><button type="button" data-vault-202="import">Import JSON</button><input id="ashen-vault-file-202" type="file" accept=".json,application/json" hidden></div><p id="ashen-equip-lab-message-199" class="lab-status" aria-live="polite">Wybierz przedmiot i sprawdź reguły zakładania.</p><div id="ashen-equip-lab-gear-199" class="lab-grid"></div><p id="ashen-equip-lab-summary-199"></p><p class="lab-note"><strong>Bezpieczeństwo:</strong> techniczna postać testowa jest zapisywana wyłącznie w osobnym kluczu tej przeglądarki, z eksportem i importem JSON. Reset kasuje wyłącznie tę próbę. Nie dotyka profilu Mitrudil, starego ekwipunku, zapisów przeglądarki ani Supabase. To pierwszy pomost wykonawczy, nie migracja konta.</p></div>`;doc.body.appendChild(overlay);
const el=id=>overlay.querySelector('#'+id);
const baseSelect=el('ashen-equip-lab-base-199'), slotSelect=el('ashen-equip-lab-slot-199');
baseSelect.innerHTML=sourceItems.map(x=>`<option value="${htmlSafe(x.modernId)}">${htmlSafe(x.name)} · ${htmlSafe(x.modernId)}</option>`).join('');
function populateSlots(){const b=lookup.get(baseSelect.value);slotSelect.innerHTML=(slots[b?.category]||[]).map(x=>`<option value="${x}">${labels[x]}</option>`).join('')}
function summary(){const sum=api.summary(save);const index=new Map(save.inventory.map(x=>[x.uid,x]));
 el('ashen-equip-lab-gear-199').innerHTML=core.SLOTS.map(slot=>{const uid=save.equip[slot],obj=index.get(uid),base=obj?lookup.get(obj.baseId):null;return `<div class="lab-slot"><small>${labels[slot]}</small>${base?htmlSafe(base.name):'— pusty —'}${uid?`<div><button type="button" data-lab-remove="${slot}">Zdejmij</button></div>`:''}</div>`}).join('');
 el('ashen-equip-lab-summary-199').textContent=`Przedmiotów w próbnym plecaku: ${save.inventory.length} · Założonych: ${api.audit(save).equipped} · Ataki: ${sum.attackCount} · Obrażenia: ${sum.damageMin}–${sum.damageMax} · Pancerz: ${sum.armor}`;
 updateNativeSummary();
}

function syncTrialLevel(){
 const select=el('ashen-equip-lab-level-199');
 const existing=select.querySelector('[data-imported-level]');if(existing)existing.remove();
 if(![1,50].includes(save.level)){
  const option=doc.createElement('option');option.dataset.importedLevel='yes';option.value=String(save.level);option.textContent=`Poziom ${save.level} · kopia z JSON`;select.appendChild(option);
 }
 select.value=String(save.level);
}
function notify(msg){el('ashen-equip-lab-message-199').textContent=msg}
function reset(){
 const selectedLevel=Number(el('ashen-equip-lab-level-199').value);
 const next=api.newSave({level:selectedLevel,attrs:Object.fromEntries(['str','dex','end','per','int','cha'].map(k=>[k,selectedLevel===50?99:5]))});
 if(commit(next,0)){level=selectedLevel;notify('Zresetowano wyłącznie techniczną postać 0.6. Można cofnąć ostatnią zmianę.');}
 else notify(persistStatus+'. Operacja anulowana.');
 summary()
}
function wear(){const baseId=baseSelect.value,slot=slotSelect.value,base=lookup.get(baseId);try{
 // Transaction: neither a failed loot nor a failed equip becomes the current test save.
 const nextCounter=counter+1;
 const drawn=api.loot(save,baseId,'ruins','demo-202-'+nextCounter,()=>0,()=>.99);
 const next=api.equip(drawn.save,drawn.item.uid,slot);
 notify(commit(next,nextCounter)?'Założono: '+base.name+' → '+labels[slot]+'. Zapisano postać testową.':persistStatus+'. Operacja anulowana.');
 }catch(e){notify('Silnik 0.6 zablokował operację: '+(e.code||e.message)+'. Próbny plecak nie został zmieniony.')}summary()}
function remove(slot){try{const next=api.unequip(save,slot);notify(commit(next,counter)?'Zdjęto przedmiot z: '+labels[slot]:persistStatus+'. Operacja anulowana.');summary()}catch(e){notify('Błąd zdejmowania: '+(e.code||e.message))}}
// ASHEN 200: native entry point within ORIGINAL inventory screen.
// One single volatile 0.6 test save is shared with the stage-199 lab; never copied to legacy state.
let nativeHost=null;
function updateNativeSummary(){
 if(!nativeHost || !nativeHost.isConnected)return;
 const node=nativeHost.querySelector('.native-summary');
 if(!node)return;
 const sum=api.summary(save);
 node.textContent=`${save.testProfileName?"Profil testowy "+save.testProfileName:"Postać techniczna"}: poziom ${level} · Przedmioty ${save.inventory.length} · Założone ${api.audit(save).equipped}/11 · Ataki ${sum.attackCount} · Obrażenia ${sum.damageMin}–${sum.damageMax} · Pancerz ${sum.armor}`;
 const bag=nativeHost.querySelector('.native-bag');
 if(bag){
  const worn=new Set(Object.values(save.equip).filter(Boolean));
  const visible=save.inventory.filter(item=>{
   const base=lookup.get(item.baseId),isWorn=worn.has(item.uid);
   const search=(base?.name||item.baseId).toLocaleLowerCase('pl');
   return (!bagQuery||search.includes(bagQuery))&&(bagFilter==='all'||(bagFilter==='worn'?isWorn:bagFilter==='bag'?!isWorn:base?.category===bagFilter));
  });
  const bagCount=nativeHost.querySelector('.native-bag-count');
  if(bagCount)bagCount.textContent=`Widoczne: ${visible.length} z ${save.inventory.length} egzemplarzy`;
  bag.innerHTML=visible.length?visible.map(item=>{
   const base=lookup.get(item.baseId),isWorn=worn.has(item.uid),img=illustration(base);
   const picture=img?`<img src="${htmlSafe(img)}" alt="" loading="lazy">`:'';
   return `<div class="native-bag-item" data-worn="${isWorn?'yes':'no'}"><div class="native-bag-info">${picture}<span><strong>${htmlSafe(base?.name||item.baseId)}</strong><br><small>${htmlSafe(item.rarity||'Zwykły')} · ${isWorn?'Założony':'W plecaku'} · ${htmlSafe(item.uid)}</small></span></div><button type="button" data-native-204-pick="${htmlSafe(item.uid)}">Wybierz egzemplarz</button></div>`;
  }).join(''):'<p class="native-warning">Brak przedmiotów spełniających filtr. Wyczyść wyszukiwanie lub dodaj przedmiot.</p>';
 }
 const bagSelect=nativeHost.querySelector('[data-native-204-uid]');
 if(bagSelect){const prior=bagSelect.value;bagSelect.innerHTML=save.inventory.map(item=>{
  const base=lookup.get(item.baseId);
  return `<option value="${htmlSafe(item.uid)}">${htmlSafe(base?.name||item.baseId)} · ${htmlSafe(item.uid)}</option>`;
 }).join('');if(save.inventory.some(x=>x.uid===prior))bagSelect.value=prior;refreshBagSlots(nativeHost)}
 const grid=nativeHost.querySelector('.native-grid');
 if(grid){const items=new Map(save.inventory.map(x=>[x.uid,x]));grid.innerHTML=core.SLOTS.map(slot=>{
  const obj=items.get(save.equip[slot]);const base=obj?lookup.get(obj.baseId):null;
  return `<div class="native-slot"><strong>${htmlSafe(labels[slot])}</strong><span>${base?htmlSafe(base.name):'— pusty —'}</span>${obj?`<button type="button" data-native-201-remove="${htmlSafe(slot)}">Zdejmij</button>`:''}</div>`;
 }).join('')}
}
function openTrial(){overlay.classList.add('visible');summary()}
function mountNative(){
 const legacyInventory=doc.querySelector('.inventory-premium-intro');
 if(!legacyInventory){nativeHost=null;return}
 if(legacyInventory.querySelector('#ashen-equip-native-200'))return;
 const native=doc.createElement('aside');native.id='ashen-equip-native-200';
 native.innerHTML=`<strong>Mechanika wyposażenia 0.6 · przy oryginalnym ekwipunku</strong>
 <div class="native-summary" aria-live="polite"></div>
 <div class="native-grid" aria-label="Sloty postaci testowej 0.6"></div>
 <div class="native-form"><label>Przedmiot bazowy<select data-native-201-base></select></label><label>Slot<select data-native-201-slot></select></label><button type="button" data-native-201-equip>Wylosuj i załóż</button></div>
 <div class="native-form"><button type="button" data-native-204-loot>Dodaj wybraną bazę do plecaka</button><label>Egzemplarz z plecaka<select data-native-204-uid></select></label><label>Slot dla wybranego egzemplarza<select data-native-204-slot></select></label><button type="button" data-native-204-wear>Załóż z plecaka</button></div>
 <div class="native-bag-toolbar"><label>Wyszukaj w plecaku<input data-native-205-query type="search" placeholder="Nazwa przedmiotu" autocomplete="off"></label><label>Filtr plecaka<select data-native-205-filter><option value="all">Wszystkie</option><option value="bag">W plecaku</option><option value="worn">Założone</option><option value="palna_1h">Broń palna 1H</option><option value="palna_2h">Broń palna 2H</option><option value="biala_1h">Broń biała 1H</option><option value="biala_2h">Broń biała 2H</option><option value="dystansowa">Broń dystansowa</option><option value="glowa">Głowa</option><option value="pancerz">Pancerz</option><option value="koszulka">Koszulka</option><option value="spodnie">Spodnie</option><option value="buty">Buty</option><option value="rekawice">Rękawice</option><option value="akcesorium">Akcesoria</option></select></label><span class="native-bag-count" aria-live="polite"></span></div>
 <div class="native-bag" aria-label="Plecak postaci testowej 0.6"></div>
 <div class="native-result" role="status" aria-live="polite">Wybierz przedmiot. Zmiany dotyczą wyłącznie próby.</div>
 <div class="native-actions"><button type="button" data-profile-206="choose">Wczytaj profil testowy z JSON</button><input data-profile-206-file type="file" accept=".json,application/json" hidden></div>
 <div class="native-actions"><button type="button" data-inventory-207="choose">Skopiuj zgodne zwykłe przedmioty ze starego JSON do plecaka testowego</button><input data-inventory-207-file type="file" accept=".json,application/json" hidden></div>
 <div class="native-warning">Wyłącznie czyste zwykłe bazy, bez modyfikatorów i bez automatycznego zakładania. Zablokowane pozycje zostaną wymienione w raporcie. To nie jest przeniesienie właściwego ekwipunku.</div>
 <div class="native-warning">Kopia testowa przejmie tylko nazwę, poziom i sześć atrybutów z wybranego pliku. Ekwipunek, postępy, PvP i konto NIE będą przeniesione. Bieżący techniczny plecak zostanie zastąpiony po potwierdzeniu.</div>
 <div class="native-actions"><button type="button" data-native-200="open">Otwórz szczegółową próbę</button><button type="button" data-vault-202="undo">Cofnij</button><button type="button" data-vault-202="export">Eksport JSON</button><button type="button" data-vault-202="import">Import JSON</button><button type="button" data-native-200="reset">Wyzeruj próbę 0.6</button></div>
 <div class="native-warning">Oddzielna postać próbna z osobnym lokalnym zapisem 0.6. To NIE jest ekwipunek Mitrudila ani migracja. Żadne przedmioty nie przechodzą jeszcze do starego zapisu.</div>`;
 legacyInventory.appendChild(native);nativeHost=native;
 const sel=native.querySelector('[data-native-201-base]');sel.innerHTML=sourceItems.map(x=>`<option value="${htmlSafe(x.modernId)}">${htmlSafe(x.name)}</option>`).join('');
 function refreshNativeSlots(){const base=lookup.get(sel.value);native.querySelector('[data-native-201-slot]').innerHTML=(slots[base?.category]||[]).map(x=>`<option value="${x}">${htmlSafe(labels[x])}</option>`).join('')}
 sel.addEventListener('change',refreshNativeSlots);refreshNativeSlots();
 native.querySelector('[data-inventory-207-file]').addEventListener('change',async e=>{
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  try{
   if(!root.Ashen060InventoryCopy207)throw Error('MISSING_COPY_MODULE');
   if(file.size>2*1024*1024)throw Error('FILE_TOO_LARGE');
   const raw=JSON.parse(await file.text());
   const plan=root.Ashen060InventoryCopy207.plan(raw,cat);
   const reasons=plan.blocked.slice(0,12).map(x=>`#${x.index+1} (${x.legacyId||'?'}) — ${x.reason}`).join('\n');
   const message=`Rozpoznano ${plan.allowed.length}/${plan.total} bezpiecznych, zwykłych baz. Pominiętych: ${plan.blocked.length}.\n${reasons}${plan.blocked.length>12?'\n…':''}\n\nSkopiować wyłącznie zgodne bazy do TECHNICZNEGO plecaka? Stary JSON, stare zapisy i Supabase nie zostaną zmienione. Kopia NIE zachowuje starych bonusów ani gniazd.`;
   if(!plan.allowed.length){notify(message);return}
   if(!root.confirm(message)){notify('Kopiowanie przedmiotów anulowano.');return}
   const result=root.Ashen060InventoryCopy207.apply(save,plan,api);
   if(!commit(result.save,counter))throw Error('SAVE_FAILED: '+persistStatus);
   notify(`Skopiowano ${result.copied.length} czystych baz do plecaka testowego. Pominięto ${plan.blocked.length} niepewnych pozycji. Można cofnąć ostatnią operację.`);
   summary();
  }catch(error){notify('Nie skopiowano przedmiotów: '+error.message+'. Poprzedni stan pozostał bez zmian.')}
 });
 native.querySelector('[data-profile-206-file]').addEventListener('change',async e=>{
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  try{
   if(!root.Ashen060ProfileAdapter206)throw Error('MISSING_ADAPTER');
   if(file.size>root.Ashen060ProfileAdapter206.MAX_BYTES)throw Error('FILE_TOO_LARGE');
   const profile=root.Ashen060ProfileAdapter206.fromJson(await file.text());
   const ok=root.confirm(`Utworzyć techniczną kopię profilu „${profile.name}”, poziom ${profile.level}?\nZastąpi to WYŁĄCZNIE dotychczasową postać testową 0.6 (${save.inventory.length} przedmiotów). Stary zapis i plik JSON pozostaną bez zmian. Nie przenosimy ekwipunku ani postępów.`);
   if(!ok){notify('Import profilu testowego anulowano.');return}
   const next=root.Ashen060ProfileAdapter206.buildTestSave(profile,api);
   if(!commit(next,0))throw Error('SAVE_FAILED: '+persistStatus);
   level=save.level;syncTrialLevel();notify('Utworzono kopię testową profilu '+profile.name+'. Przeniesiono tylko poziom i atrybuty. Ostatnią zmianę można cofnąć.');summary();
  }catch(e){notify('Nie wczytano profilu: '+e.message+'. Dotychczasowy stan pozostał bez zmian.')}
 });
 native.querySelector('[data-native-204-uid]').addEventListener('change',()=>refreshBagSlots(native));
 native.querySelector('[data-native-205-query]').addEventListener('input',e=>{bagQuery=e.target.value.trim().toLocaleLowerCase('pl');updateNativeSummary()});
 native.querySelector('[data-native-205-filter]').addEventListener('change',e=>{bagFilter=e.target.value;updateNativeSummary()});
 updateNativeSummary();
}
function refreshBagSlots(host){
 const uid=host?.querySelector('[data-native-204-uid]')?.value;
 const item=save.inventory.find(x=>x.uid===uid);
 const choice=host?.querySelector('[data-native-204-slot]');if(!choice)return;
 const old=choice.value;
 choice.innerHTML=(slots[lookup.get(item?.baseId)?.category]||[]).map(slot=>`<option value="${slot}">${htmlSafe(labels[slot])}</option>`).join('');
 if([...choice.options].some(o=>o.value===old))choice.value=old;
}
function addToBag(baseId){
 try{
  const nextCounter=counter+1;
  const drawn=api.loot(save,baseId,'ruins','demo-204-'+nextCounter,()=>0,()=>.99);
  notify(commit(drawn.save,nextCounter)?'Dodano egzemplarz do plecaka 0.6. Można go założyć i zdjąć bez ponownego losowania.':persistStatus+'. Operacja anulowana.');
 }catch(e){notify('Błąd dodawania przedmiotu: '+(e.code||e.message))}summary();
}
function wearFromBag(uid,slot){
 try{
  const next=api.equip(save,uid,slot);
  notify(commit(next,counter)?'Założono istniejący przedmiot z plecaka do slotu '+labels[slot]+'.':'Nie udało się zapisać zmiany: '+persistStatus);
 }catch(e){notify('Silnik 0.6 odrzucił założenie: '+(e.code||e.message)+'. Niczego nie zmieniono.')}summary();
}
doc.addEventListener('click',e=>{
 const inventoryChoose=e.target.closest?.('[data-inventory-207="choose"]');
 if(inventoryChoose&&nativeHost?.contains(inventoryChoose)){nativeHost.querySelector('[data-inventory-207-file]').click();return}
 const choose=e.target.closest?.('[data-profile-206="choose"]');
 if(choose&&nativeHost?.contains(choose)){nativeHost.querySelector('[data-profile-206-file]').click();return}
 const newLoot=e.target.closest?.('[data-native-204-loot]');
 if(newLoot&&nativeHost?.contains(newLoot)){
  addToBag(nativeHost.querySelector('[data-native-201-base]').value);
  nativeHost.querySelector('.native-result').textContent=el('ashen-equip-lab-message-199').textContent;return;
 }
 const newWear=e.target.closest?.('[data-native-204-wear]');
 if(newWear&&nativeHost?.contains(newWear)){
  wearFromBag(nativeHost.querySelector('[data-native-204-uid]').value,nativeHost.querySelector('[data-native-204-slot]').value);
  nativeHost.querySelector('.native-result').textContent=el('ashen-equip-lab-message-199').textContent;return;
 }
 const picked=e.target.closest?.('[data-native-204-pick]');
 if(picked&&nativeHost?.contains(picked)){
  const sel=nativeHost.querySelector('[data-native-204-uid]');sel.value=picked.dataset.native204Pick;refreshBagSlots(nativeHost);return;
 }
 const equipBtn=e.target.closest?.('[data-native-201-equip]');
 if(equipBtn && nativeHost?.contains(equipBtn)){
  const selected=nativeHost.querySelector('[data-native-201-base]').value;
  const selectedSlot=nativeHost.querySelector('[data-native-201-slot]').value;
  baseSelect.value=selected;populateSlots();slotSelect.value=selectedSlot;
  wear();nativeHost.querySelector('.native-result').textContent=el('ashen-equip-lab-message-199').textContent;return;
 }
 const removeBtn=e.target.closest?.('[data-native-201-remove]');
 if(removeBtn && nativeHost?.contains(removeBtn)){
  remove(removeBtn.dataset.native201Remove);nativeHost.querySelector('.native-result').textContent=el('ashen-equip-lab-message-199').textContent;return;
 }
 const trigger=e.target.closest?.('[data-native-200]');if(!trigger)return;
 if(trigger.dataset.native200==='open')openTrial();
 if(trigger.dataset.native200==='reset'){reset();updateNativeSummary();nativeHost.querySelector('.native-result').textContent=el('ashen-equip-lab-message-199').textContent}
});
const appRoot=doc.querySelector('#app');
if(appRoot){const observer=new MutationObserver(()=>mountNative());observer.observe(appRoot,{subtree:true,childList:true});}
mountNative();

async function importFile(file){
 if(!file)return;
 try{
  if(file.size>1024*1024)throw Error('FILE_TOO_LARGE');
  const record=vault.fromJson(await file.text(),api);
  if(!commit(record.save,record.counter))throw Error(persistStatus);
  level=save.level;syncTrialLevel();
  notify('Zaimportowano wyłącznie techniczną postać 0.6. Ostatnią zmianę można cofnąć.');summary();
 }catch(e){notify('Import odrzucony: '+(e.code||e.message)+'. Poprzedni stan zachowano.')}
}
function exportFile(){
 try{
  const raw=JSON.stringify(vault.pack(save,counter,api),null,2);
  const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));
  const link=doc.createElement('a');link.href=url;link.download='ashen-060-testowa-postac-202.json';doc.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  notify('Wyeksportowano stan technicznej postaci 0.6. Nie jest to zapis Mitrudila.');
 }catch(e){notify('Eksport nieudany: '+e.message)}
}
doc.addEventListener('click',e=>{
 const button=e.target.closest?.('[data-vault-202]');if(!button)return;
 const action=button.dataset.vault202;
 if(action==='export')exportFile();
 if(action==='import')el('ashen-vault-file-202').click();
 if(action==='undo'){
  if(!undoRecord){notify('Brak poprzedniej operacji do cofnięcia.');return}
  const old=undoRecord,now={save,counter};save=old.save;counter=old.counter;
  if(persist()){undoRecord=now;level=save.level;syncTrialLevel();notify('Cofnięto ostatnią operację postaci testowej.');}
  else{save=now.save;counter=now.counter;notify(persistStatus+'. Nie cofnięto operacji.')}
  summary();
 }
});
el('ashen-vault-file-202').addEventListener('change',e=>{const f=e.target.files?.[0];e.target.value='';importFile(f)});
// Never read any old-game save keys. Only the explicit new sandbox key.
try{
 const loaded=safeStore&&vault?vault.read(safeStore,api):null;
 if(loaded){save=loaded.save;counter=loaded.counter;level=save.level;syncTrialLevel();notify('Wczytano zapisaną techniczną postać 0.6.');}
 else{persist();notify('Utworzono osobną postać testową 0.6.');}
}catch(e){notify('Nie udało się odczytać stanu próby: '+e.message+'. Oryginalny zapis nie został dotknięty.');}
summary();
launch.addEventListener('click',()=>{overlay.classList.add('visible');summary()});
el('ashen-equip-lab-close-199').addEventListener('click',()=>overlay.classList.remove('visible'));
el('ashen-equip-lab-level-199').addEventListener('change',reset);
el('ashen-equip-lab-reset-199').addEventListener('click',reset);
baseSelect.addEventListener('change',populateSlots);
el('ashen-equip-lab-wear-199').addEventListener('click',wear);
overlay.addEventListener('click',e=>{const b=e.target.closest('[data-lab-remove]');if(b)remove(b.dataset.labRemove);else if(e.target===overlay)overlay.classList.remove('visible')});
doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('visible'))overlay.classList.remove('visible')});
populateSlots();summary();
root.Ashen060EquipLab199=Object.freeze({testOnly:true,core:'171',catalogCount:sourceItems.length,integratedInventory:true,nativeEquip201:true,sandboxSave202:true,backpackManagement204:true,backpackVisual205:true,explicitTestProfile206:true});
})(typeof window!=='undefined'?window:globalThis);
