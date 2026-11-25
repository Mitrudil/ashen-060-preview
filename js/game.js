/* ASHEN — JEDNA GRA. Kanoniczny PvE i ekwipunek 0.6.
   Legacy is reference only; multiplayer remains gated until tested. */
(function(root){'use strict';
 const required=['Ashen060Playable172','Ashen060BaseCatalog','Ashen060Quality','Ashen060Bonuses','Ashen060Core171','Ashen060Combat176'];
 const missing=required.filter(x=>!root[x]);const target=document.getElementById('ashen-060-root');
 if(missing.length){target.textContent='Brakuje zależności silnika 0.6: '+missing.join(', ');return;}
 const api=root.Ashen060Playable172.create(root.Ashen060BaseCatalog,root.Ashen060Quality,root.Ashen060Bonuses,root.Ashen060Core171,root.Ashen060Combat176,root.Ashen060Effects177,root.Ashen060Catalog,root.Ashen060SetDrops178,root.Ashen060Artifacts179);
 const KEY='ashen-v06-main-175'; // stable canonical save key; do NOT rename
 const RESTORE_KEY='ashen-v06-main-restore-190';
 const BINDING_KEY='ashen-v06-beta-account-binding-182';
 function checkpoint(){
  const current=localStorage.getItem(KEY);
  if(!current)return;
  // Never discard a playable save if the recovery slot cannot be written.
  localStorage.setItem(RESTORE_KEY,current);
 }
 function unbindAccount(){localStorage.removeItem(BINDING_KEY)}
 function restoreAvailable(){return !!localStorage.getItem(RESTORE_KEY)}
 const SLOT={right:'Prawa ręka',left:'Lewa ręka',head:'Głowa',outer:'Pancerz / kurtka',shirt:'Koszulka',pants:'Spodnie',boots:'Buty',hands:'Rękawice',extra:'Akcesorium I',extra2:'Akcesorium II',extra3:'Akcesorium III'};
 const ATTR={str:'Siła',dex:'Zręczność',end:'Wytrzymałość',per:'Percepcja',int:'Inteligencja',cha:'Charyzma'};
 const LOC={ruins:['Ruiny osiedla','./assets/missions/ruins.webp','Pierwsze ślady życia po Upadku.'],hospital:['Stary szpital','./assets/missions/hospital.webp','Zardzewiałe sale i opuszczony sprzęt.'],outpost:['Posterunek wojskowy','./assets/missions/outpost.webp','Niebezpieczne pozostałości dawnych umocnień.']};
 let player,tab='character',report=null,notice='',showCreation=false,inventoryFilter='all';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function load(){
  try{
   const raw=localStorage.getItem(KEY);
   if(!raw){showCreation=true;player=null;return;}
   player=api.importJson(raw);showCreation=false;
  }catch(err){showCreation=true;player=null;notice='Nie można wczytać zapisu postaci. Poprzedni zapis zachowano; użyj eksportu z kopii, jeśli jest potrzebny.';}
 }
 function newCharacter(name,gender,origin){
  if(typeof name!=='string'||name.trim().length<2||name.trim().length>24)throw Error('Imię powinno mieć od 2 do 24 znaków.');
  if(!['male','female'].includes(gender)||!['scout','fighter','tech'].includes(origin))throw Error('Nieprawidłowe dane postaci.');
  const base=api.fresh(), bonus={scout:{dex:2,per:1},fighter:{str:2,end:1},tech:{int:2,per:1}}[origin];
  const attrs={...base.character.attrs};for(const [k,v] of Object.entries(bonus))attrs[k]+=v;
  return api.addStarter({...base,name:name.trim(),gender,origin,character:{...base.character,attrs}});
 }
 function creation(){return `<div class="a173-shell"><header class="a173-head"><div><div class="a173-brand">ASHEN</div><div class="a173-sub">KRONIKI UPADKU · WERSJA 0.6</div></div></header><main class="a173-content"><div class="a173-hero"><span class="a173-eyebrow">SCHRON 17</span><h1>Stwórz Wędrowca</h1><p>Jedna postać, nowy ekwipunek i walki. Zapis testowy tej wersji jest niezależny od starej gry.</p></div><section class="a173-panel"><h2>Początek historii</h2>${notice?`<p role="alert">${esc(notice)}</p>`:''}<form id="ashen-060-create"><p><label>Imię postaci <input name="hero" maxlength="24" minlength="2" value="Wędrowiec" required></label></p><p><label>Płeć <select name="gender"><option value="male">Mężczyzna</option><option value="female">Kobieta</option></select></label></p><p><label>Archetyp <select name="origin"><option value="scout">Zwiadowca / Zwiadowczyni</option><option value="fighter">Wojownik / Wojowniczka</option><option value="tech">Technik / Techniczka</option></select></label></p><button class="a173-button" type="submit">Rozpocznij przygodę</button></form></section></main></div>`}
 
 function persist(){api.audit(player);localStorage.setItem(KEY,api.exportJson(player))}
 function itemName(uid){const item=player.character.inventory.find(x=>x.uid===uid);return item?api.getBase(item.baseId)?.name||item.baseId:null}
 function equipmentArt(base){
  if(!base)return null;
  const id=base.legacyId;
  if(!id||!/^[a-z0-9-]+$/.test(id))return null;
  const candidates={
   hand1:'weapons',hand2:'weapons',head:'head',outer:'armor',shirt:'shirts',pants:'pants',boots:'boots',hands:'hands',extra:'accessories'
  };
  const category=candidates[base.gameSlot];
  if(!category)return null;
  // White-list only assets actually present in the historical ASHEN library.
  const known={
   weapons:'baton carbine cleaver crossbow crowbar deserteagle flame hammer harpoon hatchet knife lmg machete pipe pistol rail revolver rifle saber shotgun sledge smg sniper wrench',
   head:'cap commanderhelm helmet hood mask maskhelm',
   armor:'coat exosuit hazmat jacket kevlar leather military riot sentinel vest',
   shirts:'armorshirt scoutshirt techshirt thermal tshirt',
   pants:'cargo jeans kevlarpants radiopants scoutpants',
   boots:'combatboots hazboots silentboots sneakers workboots',
   hands:'fingerless gloves kevlarbracers leathergloves scoutbracers steelbracers tacticalgloves workgloves zerobracers',
   accessories:'badge bandana bracelet compass dustglasses goggles injector module neckwarmer nightgoggles radio scarf scope'
  };
  return known[category].split(' ').includes(id)?`./assets/items/${category}/${id}.webp`:null;
 }
 function equipmentIcon(item){
  if(!item)return '<span class="a191-empty-slot" aria-hidden="true">＋</span>';
  const base=api.getBase(item.baseId),art=equipmentArt(base);
  return art?`<img class="a191-item-picture" src="${art}" alt="">`:'<span class="a191-empty-slot" aria-hidden="true">▣</span>';
 }
 function itemByUid(uid){return player.character.inventory.find(x=>x.uid===uid)||null}

 function itemChoices(item){const base=api.getBase(item.baseId);if(base.gameSlot==='hand1')return ['right','left'];if(base.gameSlot==='hand2')return ['right'];if(base.gameSlot==='extra')return ['extra','extra2','extra3'];return [base.gameSlot]}
 function statMarkup(){const s=api.core.summary(player.character);return `<div class="a173-stats"><div class="a173-stat"><b>${s.armor}</b><span>Pancerz</span></div><div class="a173-stat"><b>${s.attackCount}</b><span>Liczba ataków</span></div><div class="a173-stat"><b>${s.damageMin}–${s.damageMax}</b><span>Obrażenia</span></div></div><div class="a173-attrs">${Object.entries(ATTR).map(([k,v])=>`<span>${v}: <b>${s.attrs[k]}</b></span>`).join('')}</div>`}
 function character(){return `<div class="a173-hero a191-character-hero"><span class="a173-eyebrow">SEKTOR 17 · WĘDROWIEC</span><h1>${esc(player.name)}</h1><p>Postać używa nowego silnika ASHEN 0.6. Wyposażenie, statystyki i walki korzystają z jednego katalogu 100 baz przedmiotów.</p></div><div class="a173-columns"><section class="a173-panel"><h2>Postać</h2><div class="a173-character"><div class="a191-survivor-stage"><img class="a173-figure" src="./assets/characters/${esc(player.origin||'scout')}-${esc(player.gender||'male')==='female'?'f':'m'}-full.png" alt="Sylwetka postaci Wędrowca"><div class="a191-survivor-shadow" aria-hidden="true"></div></div><div><h3>Ocalały · poziom ${player.character.level}</h3><p class="a173-badge">Doświadczenie: ${player.xp} PD · kolejny poziom od ${player.character.level<50?api.xpThreshold(player.character.level+1)+' PD':'MAX'} · ${player.character.inventory.length} przedmiotów</p>${statMarkup()}<p class="a173-badge">Wolne punkty atrybutów: <b>${player.attributePoints}</b></p><div class="a173-tools">${Object.entries(ATTR).map(([key,name])=>`<button class="a173-button secondary" data-add-attr="${key}" ${player.attributePoints<=0?'disabled':''}>+1 ${name}</button>`).join('')}</div></div></div></section><section class="a173-panel"><h2>Przygotowanie do wyprawy</h2><p class="a173-list">Aktywna broń: <b>${esc(itemName(player.character.equip.right)||'Brak')}</b><br>Druga ręka: <b>${esc(itemName(player.character.equip.left)||'Pusta')}</b><br>Wykonane wyprawy: <b>${player.fights.length}</b></p><div class="a173-tools"><button class="a173-button" data-view="missions">Wyrusz na wyprawę</button><button class="a173-button secondary" data-view="inventory">Zmień wyposażenie</button></div></section></div>`}
 function missionProgress(area){
  const reports=player.fights.filter(r=>r.area===area),wins=reports.filter(r=>r.won);
  const last=reports.length?reports[reports.length-1]:null;
  return {attempts:reports.length,wins:wins.length,last};
 }
 function missions(){
  const total=player.fights.length,wins=player.fights.filter(r=>r.won).length;
  return `<div class="a173-hero a193-mission-hero"><span class="a173-eyebrow">WYPRAWY · PUSTKOWIA</span><h1>Po drugiej stronie schronu</h1><p>Trzy lokacje, każda z własnym przeciwnikiem i szansą na łup. Wybierz miejsce ekspedycji — walka odbywa się automatycznie, a wynik zapisuje się na tej samej postaci.</p></div>
  <section class="a173-panel a193-expedition-overview" aria-label="Historia wypraw"><h2>Dziennik wędrowca</h2><div class="a193-expedition-stats"><div><span>Wszystkie wyprawy</span><strong>${total}</strong></div><div><span>Wygrane walki</span><strong>${wins}</strong></div><div><span>Przegrane walki</span><strong>${total-wins}</strong></div><div><span>Poziom wędrowca</span><strong>${player.character.level}</strong></div></div><p class="a193-history-note">Statystyki pochodzą z zapisanej historii postaci. Przechowywanych jest maksymalnie 50 ostatnich walk.</p></section>
  <section class="a173-panel"><h2>Mapa wypraw</h2><div class="a173-locs a193-mission-grid">${Object.entries(LOC).map(([id,[name,img,desc]])=>{
   const stats=missionProgress(id),enemy=api.AREAS[id];
   return `<article class="a173-loc a193-mission-card"><div class="a193-mission-image"><img src="${img}" alt="${esc(name)}" loading="lazy"><span class="a193-location-tag">${esc(name)}</span></div><div class="a173-loc-body"><p>${esc(desc)}</p><div class="a193-enemy"><span>Przeciwnik</span><strong>${esc(enemy.name)}</strong></div><div class="a193-enemy-details"><span>PŻ przeciwnika: <b>${Number(enemy.hp)||0}</b></span><span>Pancerz: <b>${Number(enemy.armor)||0}</b></span></div><div class="a193-location-history"><span>Wyprawy: <b>${stats.attempts}</b></span><span>Wygrane: <b>${stats.wins}</b></span></div>${stats.last?`<p class="a193-last-outcome">Ostatnia próba: <strong>${stats.last.won?'zwycięstwo':'porażka'}</strong></p>`:'<p class="a193-last-outcome">Nieodkryta lokacja — brak historii walk.</p>'}<button class="a173-button a193-depart" data-fight="${id}" aria-label="Rozpocznij wyprawę: ${esc(name)}">Wyrusz do lokacji</button></div></article>`;
  }).join('')}</div></section>${lastReport()}`;
 }
 function lastReport(){if(!report)return `<section class="a173-panel"><h2>Ostatnia walka</h2><p class="a173-empty">Nie rozegrano jeszcze walki w tej sesji. Historia zapisanych raportów jest dostępna w zakładce Raporty.</p></section>`;return reportHtml(report,'Ostatnia walka')}
 function reportHtml(r,label){
  const rounds=Array.isArray(r.rounds)?r.rounds:[];
  return `<section class="a173-panel a192-battle-report"><div class="a192-report-title"><h2>${esc(label)}</h2><span class="a192-battle-result ${r.won?'victory':'defeat'}">${r.won?'ZWYCIĘSTWO':'PORAŻKA'}</span></div><div class="a192-battle-summary"><div><span>Przeciwnik</span><strong>${esc(r.enemy)}</strong></div><div><span>Zadane obrażenia</span><strong>${Number(r.damage)||0}</strong></div><div><span>Liczba rund</span><strong>${rounds.length}</strong></div></div>${r.lootBaseId?`<p class="a173-badge">Łup: <strong>${esc(api.getBase(r.lootBaseId)?.name||r.lootBaseId)}</strong></p>`:''}${r.artifactName?`<p class="a173-badge">Artefakt: <strong>${esc(r.artifactName)}</strong></p>`:''}<details class="a192-round-details"><summary>Historia starcia · ${rounds.length} rund</summary><div class="a192-round-grid">${rounds.map(x=>`<div class="a192-combat-round"><div><b>Runda ${Number(x.turn)||0}</b><span>PŻ: ${Number(x.heroHp)||0}</span></div><div class="a192-round-numbers"><span class="damage">Zadano ${Number(x.damage)||0}</span><span class="taken">Otrzymano ${Number(x.taken)||0}</span><span>Krytyczne ${Number(x.criticalHits)||0}</span><span>Przebicia ${Number(x.penetratingHits)||0}</span></div></div>`).join('')}</div></details></section>`;
 }
 function artifactControls(item){
  const actions=[],mounted=item.socketedArtifacts||[],capacity=item.socketCapacity||0;
  const slots=capacity?`<div class="a180-sockets" role="group" aria-label="Gniazda artefaktów ${mounted.length} z ${capacity}">${Array.from({length:capacity},(_,index)=>{
   const name=mounted[index];return `<span class="a180-socket ${name?'filled':'empty'}" title="${esc(name||'Puste gniazdo')}" aria-label="${esc(name||'Puste gniazdo')}">${name?'◆':'◇'}</span>`;
  }).join('')}</div>`:'<small>Brak gniazd artefaktów</small>';
  if(mounted.length<capacity){
   const effects=root.Ashen060Catalog.artifact_effects;
   const family=name=>effects.find(e=>e.artifact===name)?.family;
   for(const art of player.artifacts||[]){
    if(api.artifacts.compatible(art.name,item)&&!mounted.some(name=>family(name)===family(art.name)))
     actions.push(`<button class="a173-button secondary" data-socket-art="${esc(art.uid)}" data-item="${esc(item.uid)}">Osadź: ${esc(art.name)}</button>`);
   }
  }
  for(let index=0;index<mounted.length;index++)
   actions.push(`<button class="a173-button secondary" data-extract-art="${esc(item.uid)}" data-index="${index}">Wyjmij: ${esc(mounted[index])}</button>`);
  return `<div class="a180-socket-section">${slots}${capacity?`<small>${mounted.length} / ${capacity} zajętych gniazd</small>`:''}${actions.length?`<div class="a173-itemactions">${actions.join('')}</div>`:''}</div>`;
 }
 function equipmentSlotCard(slot){
  const uid=player.character.equip[slot],item=itemByUid(uid),base=item&&api.getBase(item.baseId);
  const rarity=item?Math.max(0,Math.min(4,Number(item.rarity)||0)):0;
  return `<div class="a192-equip-slot ${item?'filled':'vacant'} a192-rarity-${rarity}" data-equip-slot="${esc(slot)}"><span class="a192-equip-label">${esc(SLOT[slot])}</span><div class="a192-equip-icon">${equipmentIcon(item)}</div><span class="a192-equip-name" title="${esc(base?.name||'Puste miejsce')}">${esc(base?.name||'Puste miejsce')}</span>${item?`<button class="a192-unequip" title="Zdejmij ${esc(base?.name||'przedmiot')}" data-unequip="${esc(slot)}">×</button>`:''}</div>`;
 }
 function inventory(){
  const equipped=new Set(Object.values(player.character.equip).filter(Boolean));
  const bag=player.character.inventory.slice().sort((a,b)=>(Number(b.rarity)||0)-(Number(a.rarity)||0)||String(a.uid).localeCompare(String(b.uid)));
  const filtered=bag.filter(x=>inventoryFilter==='all'||(inventoryFilter==='unequipped'&&!equipped.has(x.uid))||(inventoryFilter==='equipped'&&equipped.has(x.uid)));
  const left=['head','outer','shirt','hands','pants','boots'],right=['right','left','extra','extra2','extra3'];
  const qualityLabels=['Zwykły','Rzadki','Epicki','Legendarny','Mityczny'];
  return `<div class="a173-hero a192-equip-hero"><span class="a173-eyebrow">ZBROJOWNIA · ASHEN 0.6</span><h1>Wyposażenie Wędrowca</h1><p>11 slotów wyposażenia, plecak i artefakty. Wszystkie operacje wykonuje ten sam silnik 0.6; nie powstaje osobny system przedmiotów.</p></div>
  <div class="a192-armory"><section class="a173-panel a192-equip-panel"><h2>Założone wyposażenie <small>${equipped.size} / ${api.SLOTS.length}</small></h2><div class="a192-loadout"><div class="a192-slot-column">${left.map(equipmentSlotCard).join('')}</div><div class="a192-figure-stage"><img src="./assets/characters/${esc(player.origin||'scout')}-${player.gender==='female'?'f':'m'}-full.png" alt="Postać w zbrojowni"><p>${esc(player.name)} · poziom ${player.character.level}</p></div><div class="a192-slot-column">${right.map(equipmentSlotCard).join('')}</div></div><div class="a192-armory-summary">${statMarkup()}</div></section>
  <section class="a173-panel a192-bag-panel"><h2>Plecak <small>${bag.length} przedmiotów</small></h2><div class="a192-bag-tabs" role="group" aria-label="Filtr ekwipunku">${[['all','Wszystkie'],['unequipped','W plecaku'],['equipped','Założone']].map(([value,label])=>`<button class="a173-button secondary ${inventoryFilter===value?'selected':''}" data-bag-filter="${value}" aria-pressed="${inventoryFilter===value}">${label}</button>`).join('')}</div><p class="a192-bag-hint">Sortowanie: od najwyższej jakości. Filtr nie zmienia zapisanych przedmiotów.</p><div class="a192-bag-scroll">${filtered.map(item=>{const b=api.getBase(item.baseId),rarity=Math.max(0,Math.min(4,Number(item.rarity)||0));return `<article class="a173-itemrow a192-bag-item a192-rarity-${rarity}"><div class="a173-icon a191-art-icon">${equipmentIcon(item)}</div><div class="a173-itemmeta"><strong>${esc(b?.name||item.baseId)}</strong><small><span class="a192-quality">${qualityLabels[rarity]}</span> · ${esc(b?.category||'Przedmiot')}${item.setFamily?' · Zestaw: '+esc(item.setFamily):''}${equipped.has(item.uid)?' · <b>Założony</b>':''}</small>${artifactControls(item)}</div><div class="a173-itemactions">${itemChoices(item).map(slot=>`<button class="a173-button secondary" data-equip="${esc(item.uid)}" data-slot="${esc(slot)}">${esc(SLOT[slot])}</button>`).join('')}</div></article>`}).join('')||'<p class="a173-empty">Brak przedmiotów w tym widoku.</p>'}</div></section></div>
  <section class="a173-panel"><h2>Torba artefaktów · ${(player.artifacts||[]).length}</h2>${(player.artifacts||[]).length?`<div class="a180-art-bag">${player.artifacts.map(a=>`<div class="a180-art-bag-item"><span class="a180-art-glyph">◆</span><div><strong>${esc(a.name)}</strong><small>Osadzanie: w zgodnym wolnym gnieździe przedmiotu.</small></div></div>`).join('')}</div>`:'<p class="a173-empty">Brak artefaktów — możesz zdobyć je na wyprawach.</p>'}</section>`;
 }
 function reports(){return `<div class="a173-hero"><span class="a173-eyebrow">DZIENNIK · WYPRAWY</span><h1>Raporty walk</h1><p>Przebieg walki automatycznej, obrażenia i zdobyte przedmioty.</p></div>${player.fights.length?player.fights.slice().reverse().slice(0,15).map((r,i)=>reportHtml(r,`Raport #${player.fights.length-i}`)).join(''):'<section class="a173-panel"><p class="a173-empty">Brak rozegranych walk.</p></section>'}`}
 function settings(){return `<div class="a173-hero"><span class="a173-eyebrow">ZAPIS · POSTAĆ</span><h1>Bezpieczeństwo postępu</h1><p>Postać jest zapisywana lokalnie. Multiplayer i synchronizacja chmury będą dostępne po bezpiecznym podłączeniu; postęp z obecnej rozgrywki pozostaje oddzielny od starszej gry.</p></div><section class="a173-panel"><h2>Zapis lokalny</h2><p class="a173-badge">Postać: ${esc(player.name)} · wersja zapisu: ${player.revision}</p><div class="a173-tools"><button class="a173-button" data-export>Eksportuj zapis JSON</button><button class="a173-button secondary" data-reset>Nowa postać lokalna</button>${restoreAvailable()?`<button class="a173-button secondary" data-restore>Przywróć poprzedni zapis</button>`:''}<label class="a173-button secondary" for="a173-import">Importuj zapis JSON</label><input type="file" id="a173-import" accept=".json,application/json" hidden></div></section>`}
 const BUNKER_ROOMS=[
  ['storage','Magazyn','Miejsce przechowywania zapasów'],
  ['bedroom','Sypialnia','Odpoczynek ocalałych'],
  ['workshop','Warsztat','Prace nad wyposażeniem'],
  ['sanctuary','Legowisko','Przestrzeń towarzyszy'],
  ['garage','Garaż','Pojazdy i transport'],
  ['infirmary','Ambulatorium','Punkt medyczny']
 ];
 function bunker(){return `<div class="a173-hero a191-bunker-hero"><span class="a173-eyebrow">KRYJÓWKA · ODZYSKANA OPRAWA</span><h1>Schron ocalałych</h1><p>Odzyskano wszystkie grafiki pomieszczeń i poziomów 1–5. Na tym ekranie wyświetlamy poziom 1, ale <strong>budowanie i bonusy kryjówki nie są jeszcze podłączone do silnika 0.6.</strong></p></div><div class="a191-room-grid">${BUNKER_ROOMS.map(([id,name,description])=>`<article class="a191-room"><img src="./assets/bunker/rooms/${id}-level1.webp" loading="lazy" alt="${esc(name)}"><div><strong>${esc(name)}</strong><span>Podgląd grafiki · poziom 1</span><p>${esc(description)}</p></div></article>`).join('')}</div>`}
 function collectionPreview(type){
  const companions=type==='companions';
  const entries=companions?[
   ['companion-dog-1.webp','Pies'],['companion-cat-1.webp','Kot'],['companion-raven-1.webp','Kruk'],['companion-boar-1.webp','Dzik']
  ]:[['vehicle-bike-1.webp','Rower'],['vehicle-motorbike-1.webp','Motocykl'],['vehicle-buggy-1.webp','Buggy'],['vehicle-car-1.webp','Samochód'],['vehicle-van-1.webp','Furgonetka'],['vehicle-truck-1.webp','Ciężarówka']];
  return `<div class="a173-hero"><span class="a173-eyebrow">ODZYSKANE GRAFIKI · PODGLĄD</span><h1>${companions?'Towarzysze':'Transport'}</h1><p>To zachowane zasoby graficzne starego ASHEN. <strong>Wybieranie, odblokowywanie i bonusy nie są jeszcze dostępne w silniku 0.6.</strong> Nie zmieniamy zapisu postaci.</p></div><div class="a191-roster-grid">${entries.map(([filename,name])=>`<article class="a191-roster"><img src="./assets/rosters/${filename}" loading="lazy" alt="${esc(name)}"><strong>${esc(name)}</strong><small>Podgląd zasobu</small></article>`).join('')}</div>`;
 }
 const VIEWS={character,missions,inventory,reports,bunker,companions:()=>collectionPreview('companions'),transport:()=>collectionPreview('transport'),settings};
 function render(){if(showCreation||!player){target.innerHTML=creation();return;}const app=api.core.summary(player.character);target.innerHTML=`<div class="a173-shell"><header class="a173-head"><div><div class="a173-brand">ASHEN</div><div class="a173-sub">KRONIKI UPADKU · ROZWÓJ 0.6</div></div><span class="a173-status">GRA LOKALNA · ZAPIS W PRZEGLĄDARCE</span></header><div class="a173-grid"><aside class="a173-side"><strong>${esc(player.name)}</strong><p>Poziom ${player.character.level} · ${player.xp} PD<br>Pancerz ${app.armor} · ${app.attackCount} ataków</p><nav>${[['character','♙ Postać'],['inventory','▣ Ekwipunek'],['missions','⌖ Wyprawy'],['reports','☷ Raporty'],['bunker','⌂ Kryjówka · podgląd'],['companions','♞ Towarzysze · podgląd'],['transport','◈ Transport · podgląd'],['settings','⚙ Zapis postaci']].map(([k,v])=>`<button data-view="${k}" class="${k===tab?'selected':''}">${v}</button>`).join('')}</nav></aside><main class="a173-content"><div class="a173-alert">ASHEN 0.6 · odzyskiwanie pełnego wyglądu. Walka, ekwipunek i zapis korzystają z jednego silnika; kryjówka, towarzysze i transport to na razie podglądy grafik.</div>${notice?`<div class="a173-note" role="alert">${esc(notice)}</div>`:''}${VIEWS[tab]()}<footer class="a173-footer">ASHEN — Kroniki Upadku · jedna rozwijana gra · zapis lokalny</footer></main></div></div>`}
 function mutate(fn){try{const before=player;const result=fn();if(result)player=result;persist();notice='';render()}catch(e){notice='Nie wykonano operacji: '+(e.code||e.message);render()}}
 target.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.view&&VIEWS[d.view]){tab=d.view;notice='';render();return}if(d.bagFilter&&['all','unequipped','equipped'].includes(d.bagFilter)){inventoryFilter=d.bagFilter;render();return}if(d.fight)mutate(()=>{const result=api.fight(player,d.fight);report=result.report;return result.player});else if(d.addAttr)mutate(()=>api.upgradeAttribute(player,d.addAttr));else if(d.equip)mutate(()=>api.equip(player,d.equip,d.slot));else if(d.unequip)mutate(()=>api.unequip(player,d.unequip));else if(d.socketArt)mutate(()=>api.socketArtifact(player,d.socketArt,d.item));else if(d.extractArt)mutate(()=>api.extractArtifact(player,d.extractArt,Number(d.index)));else if(b.hasAttribute('data-reset')){if(root.confirm('Rozpocząć nową postać? Obecny zapis zostanie zachowany w punkcie przywracania (jedna kopia).')){try{checkpoint();localStorage.removeItem(KEY);unbindAccount();report=null;player=null;showCreation=true;notice='';render()}catch(err){notice='Nie udało się zabezpieczyć dotychczasowej postaci: '+err.message;render()}}}else if(b.hasAttribute('data-restore')){if(root.confirm('Przywrócić poprzednią postać? Bieżący zapis zostanie zastąpiony.')){try{const raw=localStorage.getItem(RESTORE_KEY);if(!raw)throw Error('Brak kopii.');const restored=api.importJson(raw);api.audit(restored);if(player)checkpoint();localStorage.setItem(KEY,api.exportJson(restored));unbindAccount();player=restored;showCreation=false;report=null;tab='character';notice='Przywrócono lokalną postać z punktu przywracania.';render()}catch(err){notice='Nie można przywrócić postaci: '+err.message;render()}}}else if(b.hasAttribute('data-export')){const blob=new Blob([api.exportJson(player)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ashen-060-zapis.json';a.click();root.setTimeout(()=>URL.revokeObjectURL(url),1000)}});
 target.addEventListener('change',async e=>{if(e.target.id!=='a173-import')return;const f=e.target.files?.[0];if(!f)return;try{const input=await f.text();const imported=api.importJson(input);api.audit(imported);checkpoint();localStorage.setItem(KEY,api.exportJson(imported));unbindAccount();player=imported;showCreation=false;report=null;tab='character';notice='Zaimportowano lokalny zapis. Poprzedni zachowano do przywrócenia.';render()}catch(err){notice='Niepoprawny plik zapisu: '+err.message;render()}});
 target.addEventListener('submit',e=>{
  if(e.target.id!=='ashen-060-create')return;
  e.preventDefault();
  const f=e.target;
  try{const created=newCharacter(f.elements.hero.value,f.elements.gender.value,f.elements.origin.value);checkpoint();player=created;showCreation=false;persist();unbindAccount();notice='';render();}
  catch(err){notice=err.message||'Nie udało się utworzyć postaci.';render();}
 });
 load();render();root.ASHEN_060_MAIN={
 getState:()=>player?JSON.parse(api.exportJson(player)):null,
 getTab:()=>tab,isCreation:()=>showCreation,
 importState:(state)=>{const imported=api.importJson(JSON.stringify(state));api.audit(imported);checkpoint();player=imported;showCreation=false;report=null;tab='character';persist();notice='Wczytano postać z chmury Beta. Poprzedni zapis pozostaje do przywrócenia.';render();return true}
};
})(window);
