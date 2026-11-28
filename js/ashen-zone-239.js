/* ASHEN 239 — fabularny prototyp Strefy Anomalii. Test bez nagród, limitu i SQL. */
(function(root){
'use strict';
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const scenes=[
 {name:'Głos, którego nie powinno być',text:['Martwy Las nie przypomina miejsca, które umarło. Przypomina miejsce, które czeka. Między drzewami pozbawionymi kory Rezonator wybija trzy krótkie impulsy i jeden długi. Ten sam rytm odzywa się w wyłączonym radiu. Głos mówi: „Wracaj. Jeszcze mamy czas”.', 'Przy drodze stoi pochylony znak, którego litery przestały istnieć. Za nim znajdują się trzy przejścia: linia techniczna, osmalony dukt i ścieżka wprost ku głosowi.'],choices:[['Podążaj linią techniczną','Słupy elektryczne prowadzą cię ku dawnej radiostacji.', 'Przewody zaczynają drgać. Czujesz zapach ozonu i tracisz orientację.','wiedza'],['Zbadaj osmalony dukt','W popiele znajdujesz ostrzeżenie pozostawione przez poprzednich wędrowców.','Ślady prowadzą w koło, mimo że przez cały czas szedłeś prosto.','ostroznosc'],['Idź w stronę głosu','Odkrywasz nieznany sygnał, który będzie można porównać w schronie.','Głos wypowiada twoje imię. Z każdą odpowiedzią las staje się ciemniejszy.','ryzyko']]},
 {name:'Obozowisko, w którym płonie ogień',text:['Polana otwiera się nagle. Pod zwisającymi gałęziami stoją trzy stare namioty. Z paleniska unosi się dym, choć popiół porasta mech. Na blaszanym stole leży zegarek wskazujący godzinę, której nie ma w twoim urządzeniu.','W notatniku, zabezpieczonym drutem, ktoś narysował schron numer siedem. Pod spodem dopisał: „Przestaliśmy słyszeć ich głosy, kiedy nauczyli się mówić naszymi”. Radio budzi się krótkim trzaskiem.'],choices:[['Przeszukaj dokumentację','Odnajdujesz mapę schronu i notatkę o bocznym wejściu.','Ktoś celowo pozostawił fałszywy plan. Dopiero pomiary mogą wykazać błąd.','wiedza'],['Sprawdź sprzęt pomiarowy','Kalibrujesz Rezonator według starych odczytów.','Urządzenie traci na chwilę synchronizację, a w słuchawkach słychać kroki.','pomiar'],['Obserwuj obóz z ukrycia','Widzisz sylwetkę, która znika, kiedy mrugasz. Odkrywasz bezpieczniejszą trasę.','Po długiej obserwacji nie znajdujesz niczego pewnego.','ostroznosc']]},
 {name:'Woda pamięta',text:['Ścieżka kończy się przy płytkim rozlewisku. Betonowa wieżyczka odbija się w wodzie pod nieprawdopodobnym kątem. Twoje odbicie podnosi rękę kilka sekund przed tobą.','Po drugiej stronie stoi milcząca sylwetka w ciężkim płaszczu. Rezonator piszczy coraz szybciej. Schron znajduje się już blisko, lecz to, co oddziela cię od wejścia, nie jest zwykłą wodą.'],choices:[['Zbadaj odbicie','Rozpoznajesz rytm anomalii. Potrafisz przewidzieć, kiedy osłabnie.','Odbicie pokazuje obcą twarz. Przez chwilę nie potrafisz przypomnieć sobie drogi.','wiedza'],['Podążaj za światełkiem','Docierasz do pozycji, z której widać wejście do schronu.','Światło okazuje się przynętą. Ktoś obserwuje twoje podejście.','ryzyko'],['Zbuduj prowizoryczne przejście','Docierasz na drugi brzeg, omijając najgroźniejsze pole.','Hałas zdradza twoje położenie przeciwnikowi.','ostroznosc']]},
 {name:'Drzwi, które pamiętają twój głos',text:['Na ścianie schronu numer siedem zachował się pomarańczowy pas farby. Pod nim wydrapano ostrzeżenie: „Nie odpowiadaj, kiedy zawołają cię po imieniu”.','Ze środka dobiegają ciężkie kroki. W radiu słyszysz własny głos: „Dobrze, że wróciłeś”. Skrzydło drzwi powoli porusza się w ciemności. Nie masz już czasu na wycofanie się niezauważonym.'],choices:[['Zajmij osłonę i przygotuj zasadzkę','Zyskujesz pozycję osłoniętą przed pierwszym atakiem.','Przeciwnik odkrywa zasadzkę i atakuje z boku.','ostroznosc'],['Zakłóć sygnał Rezonatorem','Zakłócenie na moment dezorientuje przeciwnika.','Nieoczekiwany impuls ujawnia twoją pozycję.','pomiar'],['Wtargnij, zanim wróg się przygotuje','Zdobywasz inicjatywę i dostrzegasz komorę nasłuchową.','Wróg czekał za drzwiami i był gotowy do starcia.','ryzyko']]},
 {name:'Sygnał w szklanej klatce',text:['W środku komory unosi się maleńki, ciemny przedmiot. Światło, które odbija, nie przypomina żadnego koloru widzianego na powierzchni. Wokół niego krążą niewyraźne sylwetki. Jedna odwraca głowę i mówi: „Przyniosłeś głos, którego nam brakowało”.','Rezonator pokazuje sprzeczne wyniki: obecność przedmiotu, brak przedmiotu, obecność przedmiotu. Czujesz, jak powietrze gęstnieje. Jeżeli zdecydujesz się działać, masz tylko kilka chwil.'],choices:[['Zbadaj centrum anomalii','Docierasz do wnętrza pola i zapisujesz serię nieznanych impulsów.','Przedmiot rozmywa się tuż przed dłonią. Pozostaje jedynie zapis zakłócenia.','ryzyko'],['Zabezpiecz pomiary i dokumentację','Zapisujesz szczegóły niestabilnego pola — to mogą być cenne wskazówki.','Szum niszczy część odczytów, lecz skanowanie nie zostaje przerwane.','wiedza'],['Wycofaj się, prowadząc pomiary','Przy odwrocie Rezonator kontynuuje skanowanie — nie musisz dotykać centrum anomalii, by odnaleźć ślad.','Mgła zaciera znaki, które pozostawiłeś, lecz docierasz do granicy Strefy.','ostroznosc']]}];
const regions=['Martwy Las','Złamany Wiadukt','Serce Anomalii'];
function initial(){return {version:1,story:'ostatni-sygnal',region:0,scene:0,status:'playing',history:[],combat:null,startedAt:Date.now(),finishedAt:null};}
function pick(session,option,stats,random=Math.random){
 if(!session||session.status!=='playing'||session.history.length!==session.scene||!Number.isInteger(option)||option<0||option>2||session.scene>=5)throw Error('Nieprawidłowy etap lub wybór.');
 const scene=scenes[session.scene],c=scene.choices[option],stat=c[3]==='wiedza'?'per':c[3]==='pomiar'?'int':c[3]==='ostroznosc'?'dex':'end';
 const chance=Math.max(.2,Math.min(.8,.50+(Math.min(50,Number(stats?.[stat])||5)-5)*.006+(session.history.filter(h=>h.good).length)*.025));
 const good=random()<chance;
 const outcome={scene:session.scene,option,good,category:c[3],text:c[good?1:2],chanceAtDecision:chance};
 // Wszystkie trzy decyzje finałowe pozwalają wykryć ślad artefaktu.
 // Wynik jest losowany jeden raz i zapisany razem z decyzją. To podgląd fabularny,
 // a nie przyznanie przedmiotu — ekonomia Strefy pozostaje wyłączona w trybie testowym.
 if(session.scene===4){
  const prior=session.history;
  const clues=prior.filter(h=>h.good&&(h.category==='wiedza'||h.category==='pomiar')).length;
  const hazards=prior.filter(h=>!h.good).length;
  const victory=session.combat?.won===true;
  const routeBonus=[.07,.04,.02][option];
  const signalChance=Math.max(.08,Math.min(.65,.23+routeBonus+clues*.025-hazards*.012+(victory?.045:-.035)));
  outcome.artifactSignal={detected:random()<signalChance,chanceAtDecision:signalChance,choice:option};
 }
 session.history.push(outcome);session.scene++;
 if(session.scene===4)session.status='combat_pending';
 else if(session.scene===5){session.status='finished';session.finishedAt=Date.now();}
 return outcome;
}
// ASHEN 240 — skutki wyborów i walka zależna od przebiegu, bez osobnego silnika PvE.
function consequences(session){
 const history=Array.isArray(session?.history)?session.history:[];
 const score={wiedza:0,pomiar:0,ostroznosc:0,ryzyko:0};
 for(const row of history){if(!row||!Object.hasOwn(score,row.category))continue;score[row.category]+=row.good?2:-1;}
 const clues=history.filter(h=>h?.good&&(h.category==='wiedza'||h.category==='pomiar')).length;
 const danger=history.filter(h=>h?.good===false).length+history.filter(h=>h?.category==='ryzyko').length;
 return {score,clues,danger,good:history.filter(h=>h?.good).length};
}
function encounter(session){
 if(!session||!Array.isArray(session.history)||session.history.length<4)throw Error('Nie zakończono czterech decyzji.');
 const c=consequences(session);
 const approaches=['Nasłuchujący','Zbieracz Echa','Bagienny Tropiciel'];
 const last=session.history[3];
 const index=(c.good+(session.history[2]?.option||0))%approaches.length;
 const defense=last?.category==='ostroznosc'&&last.good?-.12:0;
 const disruption=last?.category==='pomiar'&&last.good?-.12:0;
 const ambush=last?.category==='ryzyko'&&!last.good?.15:0;
 const dangerScale=Math.max(.82,Math.min(1.23,1+(c.danger-c.clues)*.035+defense+disruption+ambush));
 return {name:approaches[index],dangerScale,clues:c.clues,danger:c.danger,advantage:dangerScale<.97?'Przygotowanie osłabia przeciwnika.':dangerScale>1.06?'Niebezpieczne podejście wzmacnia przeciwnika.':'Walka na równych warunkach.'};
}
function ending(session){
 const c=consequences(session);
 const final=session.history?.[4];
 if(!final)return {title:'Historia jeszcze trwa',text:''};
 const detected=final.artifactSignal?.detected===true;
 const endings=[
  {title:'Dotyk niemożliwego',text:'Dotarłeś do centrum pola. Przy szczelinie między pulsami pojawił się ślad czegoś, czego nie da się opisać zwykłymi pomiarami.'},
  {title:'Archiwum utraconych głosów',text:'Uratowane zapisy pozwalają odtworzyć część eksperymentu. Niektóre odczyty wskazują, że źródło anomalii mogło zmienić położenie.'},
  {title:'Powrót przez milczący las',text:'Wycofałeś się, zachowując siły i szczegóły drogi. Rezonator zanotował sygnał jeszcze przed opuszczeniem schronu.'}
 ];
 const selected=endings[final.option]||endings[0];
 const aftermath=detected?'Rezonator wykrył możliwy ślad artefaktu. To wynik fabularnej próby, nie fizyczny łup.':'Rezonator nie potwierdził obecności artefaktu. Nie oznacza to, że wybrana droga była błędna.';
 const combatNote=session.combat?.won===false?'Porażka w walce utrudniła poszukiwania, ale udało ci się wydostać z komory. ':'';
 const clueNote=c.clues>=2?'Zebrane wcześniej wskazówki pomogły ci zinterpretować sygnał. ':'';
 return {title:selected.title,text:combatNote+selected.text+' '+clueNote+aftermath};
}
function setCombat(session,result){
 if(!session||session.status!=='combat_pending'||session.scene!==4||session.combat)throw Error('Walka została już rozstrzygnięta.');
 session.combat={won:!!result.won,enemy:result.enemy||'Nieznany przeciwnik',lines:(result.lines||[]).slice(0,200),report:result.damageSummary||null,advantage:result.advantage||''};
 session.status='playing';
 // Porażka krytyczna nie jest jeszcze zdefiniowana; etap 5 pozostaje możliwy po każdej porażce.
 return session;
}
function html(session){
 if(!session)return `<section class="section ashen-zone-239"><div class="tag">STREFA ANOMALII · TEST FABULARNY</div><h2>◈ Rezonator</h2><p class="muted">Urządzenie namierzyło sygnał w Martwym Lesie. Prototyp pięciu decyzji bez nagród, limitu 72 godzin i zmian w stanie ekwipunku.</p><div class="panel"><h3>Martwy Las — Ostatni sygnał</h3><p>Wśród martwych drzew pracuje nadajnik, który nie powinien już istnieć. Pięć decyzji, jedna walka, kilka możliwych konsekwencji.</p><button class="primary" data-zone-start="1">Rozpocznij historię (test)</button></div><div class="panel muted"><strong>Później:</strong> ${regions.slice(1).map(esc).join(' · ')}. Nieaktywne do czasu przygotowania historii.</div></section>`;
 const n=session.status==='combat_pending'?3:Math.min(4,session.scene),scene=scenes[n],done=session.status==='finished';
 const records=session.history.map((h,i)=>`<details><summary>${i+1}. ${esc(scenes[i].name)} — ${String.fromCharCode(65+h.option)}</summary><p>${esc(scenes[i].choices[h.option][0])}</p><p class="muted">${esc(h.text)}</p></details>`).join('');
 const progress=Array.from({length:5},(_,i)=>`<span class="ashen-zone-step ${i<session.history.length?'done':i===session.scene?'current':''}"></span>`).join('');
 const effects=consequences(session);const battle=session.status==='combat_pending'?encounter(session):null;
 const trail=`<div class="small muted">Ślady: ${effects.clues} · Zagrożenia: ${effects.danger} · Wyniki decyzji zapisane</div>`;
 const combat=session.combat?`<details class="panel" ${session.status==='combat_pending'?'':'open'}><summary>⚔ Raport walki — ${esc(session.combat.enemy)} · ${session.combat.won?'ZWYCIĘSTWO':'PORAŻKA'}</summary>${session.combat.lines.map(x=>`<div class="small report">${esc(x)}</div>`).join('')}</details>`:'';
 if(done){const epilogue=ending(session);return `<section class="section ashen-zone-239"><div class="tag">MARTWY LAS · HISTORIA ZAKOŃCZONA</div><h2>Ostatni sygnał</h2><div class="ashen-zone-steps">${progress}</div><div class="panel"><h3>${esc(epilogue.title)}</h3><p>${esc(epilogue.text)}</p><p>${esc(session.history[4]?.text||'')}</p><p>Gdy zbliżasz się do granicy lasu, radio odzywa się po raz ostatni: „Wracaj”. Rezonator na chwilę milknie.</p><strong>Próba fabularna: ${(session.history[4]?.artifactSignal?.detected?'wykryto ślad artefaktu':'nie wykryto śladu artefaktu')}. Nie przyznano przedmiotu ani innych nagród; odliczanie nadal wyłączone.</strong></div>${trail}${combat}<h3>Podjęte decyzje</h3>${records}<button data-zone-reset="1">Powtórz historię testową</button></section>`;}
 return `<section class="section ashen-zone-239"><div class="tag">STREFA ANOMALII · MARTWY LAS · TEST</div><h2>Ostatni sygnał</h2><div class="ashen-zone-steps">${progress}</div><div class="small muted">Scena ${n+1}/5 · Wybory są zapisywane, wynik losowany tylko raz.</div><div class="panel ashen-zone-narrative"><h3>${esc(scene.name)}</h3>${scene.text.map(x=>`<p>${esc(x)}</p>`).join('')}${session.history.length?`<p class="small muted">Wcześniejszy ślad: ${esc(session.history[session.history.length-1].text)}</p>`:''}</div>${session.status==='combat_pending'?`<div class="panel"><h3>⚔ Obowiązkowe starcie</h3><p>Twoja ostatnia decyzja prowadzi do walki w istniejącym silniku PvE. Wynik będzie zapisany i nie zmieni się po odświeżeniu.</p><p class="small muted">${esc(battle.advantage)} — przeciwnik: ${esc(battle.name)}</p><button class="primary" data-zone-fight="1">Rozpocznij walkę</button></div>`: `<div class="panel"><h3>Co robisz?</h3><div class="ashen-zone-choices">${scene.choices.map((c,i)=>`<button data-zone-choice="${i}"><strong>${String.fromCharCode(65+i)}.</strong> ${esc(c[0])}</button>`).join('')}</div></div>`}${trail}${combat}${session.history.length?`<details><summary>Historia wcześniejszych wyborów (${session.history.length})</summary>${records}</details>`:''}<p class="small muted">Tryb demonstracyjny: bez dropu, cooldownu i blokady wyposażenia. W docelowej Strefie wszystkie te mechaniki muszą być egzekwowane na serwerze.</p></section>`;
}
root.AshenZone239=Object.freeze({initial,pick,setCombat,html,scenes,consequences,encounter,ending});
})(window);
