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
// Build 251 — druga pełna historia Martwego Lasu; decyzje są rozstrzygane i zapisywane jak w pierwszej.
const otherStory={id:'dom-pod-korzeniami',title:'Dom pod korzeniami',scenes:[
 {name:'Okno pośród pni',text:['Na zachodnim skraju Martwego Lasu Rezonator zatrzymuje skan na częstotliwości ludzkiego szeptu. W miejscu wskazanym przez urządzenie nie powinno być żadnego budynku. Tymczasem między grubymi pniami migocze pojedyncze okno, a na szybie powoli pojawia się napis: „Spóźniłeś się”.','Dom stoi tak nisko, że mech obrasta dach. Korzenie przerastają drzwi, lecz z wnętrza wydobywa się ciepło. Co kilka minut jeden z pni odwraca się ku domowi jak człowiek nasłuchujący rozmowy.'],choices:[['Odczytaj rytm migającego okna','Światło układa się w mapę dawnego traktu i zdradza położenie piwnicy.','Migotanie zakłóca Rezonator; zapisujesz jedynie urwany fragment wiadomości.','wiedza'],['Obejdź dom wzdłuż suchych korzeni','Odnajdujesz szczelinę prowadzącą do schowka pod gankiem.','Ziemia osuwa się pod butami i pozostawia wyraźny ślad twojej obecności.','ostroznosc'],['Odpowiedz na napis na szybie','Za szkłem pojawia się cień, który wskazuje boczne wejście.','Cień powtarza twoje słowa z opóźnieniem; ktoś w środku wie, że przyszedłeś.','ryzyko']]},
 {name:'Pokój nakryty do kolacji',text:['Drzwi ustępują bez trzasku. W izbie stoi stół nakryty dla pięciu osób. Na talerzach leży świeży popiół, a zegar na ścianie odmierza sekundy tylko wtedy, gdy odwracasz głowę. Pod sufitem zwisają korzenie podobne do żył.','Przy ostatnim krześle leży dziennik opiekuna stacji pomiarowej. Ktoś wielokrotnie podkreślił zdanie: „Dom nie zatrzymuje ludzi. Zatrzymuje ostatnią myśl przed ich wyjściem”. Na piętrze słychać przesuwanie mebli.'],choices:[['Przeczytaj dziennik i porównaj daty','Odkrywasz, że zapis ostatniej ewakuacji pochodzi z przyszłości.','Kartki zmieniają kolejność; tracisz część wskazówek, zanim zdążysz je zanotować.','wiedza'],['Zbadaj podłogę przy pustym krześle','Między deskami znajdujesz przewód prowadzący pod ziemię.','Przewód wydaje impuls, który na chwilę zakłóca pomiary.','pomiar'],['Wejdź po schodach za odgłosem','Na piętrze widzisz przejście do zamkniętego pokoju obserwacji.','Kroki milkną nagle, a schody prowadzą cię z powrotem do tej samej izby.','ryzyko']]},
 {name:'Szklarnią w dół',text:['Za ścianą domu odkrywasz szklarnię, choć wszystkie szyby znajdują się pod ziemią. Rośliny rosną korzeniami ku górze; w ich splątanych włóknach migają drobne metalowe fragmenty. Z głębi dociera jednostajny szum urządzeń, które dawno powinny utracić zasilanie.','Na ścianie wyryto trzy znaki. Pierwszy odpowiada impulsowi Rezonatora, drugi układa się w kształt otwartych drzwi, trzeci przypomina dłoń z sześcioma palcami. Każdy kolejny krok wzmacnia drżenie podłoża.'],choices:[['Porównaj znaki z dziennikiem','Rozpoznajesz sekwencję sygnału i możesz osłabić pole przed zejściem.','Znak zmienia kształt w połowie odczytu, wprowadzając cię w błąd.','wiedza'],['Zbuduj ekran z metalowej ramy','Osłona uspokaja Rezonator i chroni część odczytów.','Rama przyciąga wyładowanie; zakłócenie zwraca uwagę czegoś w ciemności.','pomiar'],['Przejdź między roślinami bez światła','Udaje ci się dotrzeć do drzwi serwisowych bez poruszenia korzeni.','Potykasz się o ukryty przewód, a szkło nad głową rozbrzmiewa jak dzwon.','ostroznosc']]},
 {name:'Ogrodnik bez twarzy',text:['Za drzwiami serwisowymi otwiera się pusta kotłownia. W piecu pali się zimne światło, a na ścianach wiszą fotografie mieszkańców domu — na każdej twarze są zamazane. Pośrodku pomieszczenia stoi postać w ciężkim fartuchu, z twarzą zasłoniętą warstwą wilgotnej kory.','Ogrodnik bierze do ręki stary sekator. Nie grozi ci i nie odpowiada, ale gdy robisz krok, rośliny za tobą napinają się jak druty. Rezonator ostrzega przed nagłym skokiem energii. Walka jest nieunikniona.'],choices:[['Zajmij stanowisko za piecem','Osłona i spokojne podejście osłabiają pierwsze uderzenie przeciwnika.','Ogrodnik zna drogę za piecem i wyprzedza twój ruch.','ostroznosc'],['Przesteruj lampę w kotłowni','Nagły błysk przerywa połączenie Ogrodnika z korzeniami.','Lampa gaśnie, a przeciwnik odnajduje cię w ciemności.','pomiar'],['Oderwij wiązkę korzeni i zaatakuj','Odcinasz część roślin, zanim przeciwnik zdąży je poruszyć.','Korzenie zaciągają się na twoim sprzęcie i spowalniają pierwsze ruchy.','ryzyko']]},
 {name:'Serce domu',text:['W głębi kotłowni znajdujesz schody pod fundamenty. Tam, gdzie powinien być zbiornik wody, unosi się bryła czarnego szkła oplatana żywymi korzeniami. W środku drga drobny metaliczny punkt, jakby ktoś zamknął gwiazdę w nasieniu.','Na chwilę słyszysz głosy ludzi ze zdjęć. Każdy mówi innym tonem, ale wszystkie wypowiadają jedno zdanie: „Wynieś to, co ocalało”. Rezonator nie potrafi odróżnić artefaktu od odbicia pola. Możesz podjąć ryzyko, zabezpieczyć dokumentację albo badać sygnał podczas wycofywania się.'],choices:[['Przebij osłonę i zbadaj rdzeń','Otwierasz wąską szczelinę i Rezonator utrwala niezwykły sygnał.','Szczelina zamyka się, gdy próbujesz sięgnąć głębiej; pozostaje jedynie zapis pola.','ryzyko'],['Zabezpiecz dziennik i próbki','Łączysz odczyty z kotłowni z dokumentacją domu, odkrywając nowy trop.','Dokumenty ulegają częściowemu zniszczeniu, lecz ostatnie skanowanie trwa dalej.','wiedza'],['Wycofaj się powoli, skanując korzenie','Przy wyjściu odnajdujesz bezpieczny kanał sygnału i ślad możliwego znaleziska.','Dom zamyka przejścia jedno po drugim, ale docierasz do lasu z zapisanym pomiarem.','ostroznosc']]}]};
function storyData(session){return session?.story===otherStory.id?otherStory:{id:'ostatni-sygnal',title:'Ostatni sygnał',scenes};}
function storyChoiceButtons(action,base){return `<button class="primary" ${action}="ostatni-sygnal">Ostatni sygnał</button><button ${action}="dom-pod-korzeniami">Dom pod korzeniami</button>`;}
const regions=['Martwy Las','Złamany Wiadukt','Serce Anomalii'];
const RESONATOR_COOLDOWN_MS=72*60*60*1000;
// Wersja lokalna do testow. Docelowy serwer powinien narzucac cooldown i rozliczac nagrody.
function resonator(session,now=Date.now()){
 const completed=session?.status==='finished'&&Number.isFinite(session?.finishedAt);
 const nextAt=completed?session.finishedAt+RESONATOR_COOLDOWN_MS:null;
 const remaining=completed?Math.max(0,nextAt-now):0;
 return {ready:!session||(completed&&remaining===0),active:!!session&&!completed,nextAt,remaining};
}
function cooldownLabel(ms){
 const seconds=Math.ceil(Math.max(0,ms)/1000);
 const d=Math.floor(seconds/86400),h=Math.floor(seconds%86400/3600),m=Math.floor(seconds%3600/60);
 return `${d} d ${h} godz. ${m} min`;
}
function resonatorPanel(session,now=Date.now()){
 const r=resonator(session,now);
 if(r.active)return `<div class="panel ashen-zone-resonator"><h3>◉ REZONATOR · AKTYWNA EKSPEDYCJA</h3><p class="small muted">Sygnał został ustalony. Rezonator pozostaje zajęty do zakończenia pięciu scen.</p></div>`;
 if(r.ready)return `<div class="panel ashen-zone-resonator"><h3>◉ REZONATOR · GOTOWY</h3><p class="small muted">Wykryto okno aktywności anomalnej. Możesz rozpocząć następną przygodę.</p></div>`;
 const pct=Math.max(0,Math.min(100,Math.floor((1-r.remaining/RESONATOR_COOLDOWN_MS)*100)));
 return `<div class="panel ashen-zone-resonator" data-resonator-regenerating="1"><h3>◉ REZONATOR · REGENERACJA</h3><p>Wracasz wyczerpany ze Strefy. Odpoczywasz, odzyskujesz siły, a Rezonator ponownie skanuje obszar w poszukiwaniu stabilnego sygnału.</p><div class="ashen-zone-recharge" role="progressbar" aria-label="Postęp regeneracji" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div><p><strong class="ashen-zone-remaining">Pozostało: ${cooldownLabel(r.remaining)}</strong></p><p class="small muted">Nowe wejście pozostanie dostępne po upływie czasu. Nie musisz logować się o określonej godzinie. Licznik jest na razie lokalny i testowy.</p></div>`;
}
function initial(options={}){const selected=options.story==='dom-pod-korzeniami'?otherStory.id:'ostatni-sygnal';return {version:1,rewardSystemVersion:244,testMode:options.testMode===true,startLuck:Math.max(0,Math.min(15,Number(options.luck)||0)),runId:Math.random().toString(36).slice(2),story:selected,region:0,scene:0,status:'playing',history:[],combat:null,startedAt:Date.now(),finishedAt:null};}
function pick(session,option,stats,random=Math.random){
 if(!session||session.status!=='playing'||session.history.length!==session.scene||!Number.isInteger(option)||option<0||option>2||session.scene>=5)throw Error('Nieprawidłowy etap lub wybór.');
 const scene=storyData(session).scenes[session.scene],c=scene.choices[option],stat=c[3]==='wiedza'?'per':c[3]==='pomiar'?'int':c[3]==='ostroznosc'?'dex':'end';
 const chance=Math.max(.2,Math.min(.8,.50+(Math.min(50,Number(stats?.[stat])||5)-5)*.006+(session.history.filter(h=>h.good).length)*.025));
 const good=random()<chance;
 const outcome={scene:session.scene,option,good,category:c[3],text:c[good?1:2],chanceAtDecision:chance};
 // Wszystkie trzy decyzje finałowe pozwalają wykryć ślad artefaktu.
 // Wynik jest losowany jeden raz i zapisany razem z decyzją. To podgląd fabularny,
 // a nie osobne przyznanie przedmiotu — fizyczny łup jest rozliczany tylko po zakończeniu opowieści.
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
 const approaches=session.story===otherStory.id?['Ogrodnik bez twarzy','Strażnik Szklarni','Korzeniowy Opiekun']:['Nasłuchujący','Zbieracz Echa','Bagienny Tropiciel'];
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
 const endings=session.story===otherStory.id?[
  {title:'Pęknięcie w czarnym szkle',text:'Dotarłeś do serca domu i poruszyłeś rdzeń, którego nie zdołały zniszczyć korzenie.'},
  {title:'Dziennik tych, którzy zostali',text:'Uratowane zapisy mieszkańców odsłoniły kolejne ślady anomalii w Martwym Lesie.'},
  {title:'Dom, który milknie za plecami',text:'Opuściłeś budynek ze skanami korzeni, zanim zamknął za tobą wszystkie przejścia.'}
 ]:[
  {title:'Dotyk niemożliwego',text:'Dotarłeś do centrum pola. Przy szczelinie między pulsami pojawił się ślad czegoś, czego nie da się opisać zwykłymi pomiarami.'},
  {title:'Archiwum utraconych głosów',text:'Uratowane zapisy pozwalają odtworzyć część eksperymentu. Niektóre odczyty wskazują, że źródło anomalii mogło zmienić położenie.'},
  {title:'Powrót przez milczący las',text:'Wycofałeś się, zachowując siły i szczegóły drogi. Rezonator zanotował sygnał jeszcze przed opuszczeniem schronu.'}
 ];
 const selected=endings[final.option]||endings[0];
 const aftermath=session.reward?(session.reward.artifactName?'Udało ci się zabezpieczyć artefakt podczas odwrotu.':'Rezonator nie potwierdził artefaktu w zabezpieczonych znaleziskach.'):(detected?'Rezonator wykrył możliwy ślad artefaktu. To wynik fabularnej próby, nie fizyczny łup.':'Rezonator nie potwierdził obecności artefaktu. Nie oznacza to, że wybrana droga była błędna.');
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
 if(!session)return `<section class="section ashen-zone-239"><div class="tag">STREFA ANOMALII · MARTWY LAS</div><h2>◈ Rezonator</h2>${resonatorPanel(null)}<p class="muted">Wybierz jedną z dwóch historii. Każda ma pięć scen, trzy wybory na scenę i obowiązkową walkę. Lokalna regeneracja: 72 godziny po ukończeniu.</p><div class="panel"><h3>Historie Martwego Lasu</h3><div class="ashen-zone-choices">${storyChoiceButtons('data-zone-start')}</div></div><div class="panel muted"><strong>Następne regiony:</strong> ${regions.slice(1).map(esc).join(' · ')}</div></section>`;
 const selectedStory=storyData(session),storyScenes=selectedStory.scenes;
 const n=session.status==='combat_pending'?3:Math.min(4,session.scene),scene=storyScenes[n],done=session.status==='finished';
 const records=session.history.map((h,i)=>`<details><summary>${i+1}. ${esc(storyScenes[i].name)} — ${String.fromCharCode(65+h.option)}</summary><p>${esc(storyScenes[i].choices[h.option][0])}</p><p class="muted">${esc(h.text)}</p></details>`).join('');
 const progress=Array.from({length:5},(_,i)=>`<span class="ashen-zone-step ${i<session.history.length?'done':i===session.scene?'current':''}"></span>`).join('');
 const effects=consequences(session);const battle=session.status==='combat_pending'?encounter(session):null;
 const trail=`<div class="small muted">Ślady: ${effects.clues} · Zagrożenia: ${effects.danger} · Wyniki decyzji zapisane</div>`;
 const combat=session.combat?`<details class="panel" ${session.status==='combat_pending'?'':'open'}><summary>⚔ Raport walki — ${esc(session.combat.enemy)} · ${session.combat.won?'ZWYCIĘSTWO':'PORAŻKA'}</summary>${session.combat.lines.map(x=>`<div class="small report">${esc(x)}</div>`).join('')}</details>`:'';
 if(done){const epilogue=ending(session),r=resonator(session),receipt=root.AshenZone244Rewards?.receipt(session)||'';return `<section class="section ashen-zone-239"><div class="tag">MARTWY LAS · HISTORIA ZAKOŃCZONA</div><h2>${esc(selectedStory.title)}</h2>${resonatorPanel(session)}<div class="ashen-zone-steps">${progress}</div><div class="panel"><h3>${esc(epilogue.title)}</h3><p>${esc(epilogue.text)}</p><p>${esc(session.history[4]?.text||'')}</p><p>${session.story===otherStory.id?'Za tobą dom znika między korzeniami. Z wnętrza raz jeszcze dobiega głuche uderzenie zegara, po czym Rezonator milknie.':'Gdy zbliżasz się do granicy lasu, radio odzywa się po raz ostatni: „Wracaj”. Rezonator na chwilę milknie.'}</p><strong>${session.reward?'Wynik eksploracji rozstrzygnięty i zapisany.':session.testMode?'Powtórka testowa — bez nagród.':'Archiwalna przygoda sprzed nagród Build 244 — bez ponownego losowania.'}</strong></div>${receipt}${trail}${combat}<h3>Podjęte decyzje</h3>${records}${r.ready?`<div class="panel"><h3>Wybierz następną historię</h3>${storyChoiceButtons('data-zone-start')}</div>`:''}<details><summary>Testowanie bez oczekiwania</summary><p class="small muted">Powtórka bez nagród i bez czekania 72 godzin. To funkcja testowa, nie część docelowej ekonomii.</p><button data-zone-reset="1">Powtórz historię (test, bez limitu)</button></details></section>`;}
 return `<section class="section ashen-zone-239"><div class="tag">STREFA ANOMALII · MARTWY LAS · TEST</div><h2>${esc(selectedStory.title)}</h2><div class="ashen-zone-steps">${progress}</div><div class="small muted">Scena ${n+1}/5 · Wybory są zapisywane, wynik losowany tylko raz.</div><div class="panel ashen-zone-narrative"><h3>${esc(scene.name)}</h3>${scene.text.map(x=>`<p>${esc(x)}</p>`).join('')}${session.history.length?`<p class="small muted">Wcześniejszy ślad: ${esc(session.history[session.history.length-1].text)}</p>`:''}</div>${session.status==='combat_pending'?`<div class="panel"><h3>⚔ Obowiązkowe starcie</h3><p>Twoja ostatnia decyzja prowadzi do walki w istniejącym silniku PvE. Wynik będzie zapisany i nie zmieni się po odświeżeniu.</p><p class="small muted">${esc(battle.advantage)} — przeciwnik: ${esc(battle.name)}</p><button class="primary" data-zone-fight="1">Rozpocznij walkę</button></div>`: `<div class="panel"><h3>Co robisz?</h3><div class="ashen-zone-choices">${scene.choices.map((c,i)=>`<button data-zone-choice="${i}"><strong>${String.fromCharCode(65+i)}.</strong> ${esc(c[0])}</button>`).join('')}</div></div>`}${trail}${combat}${session.history.length?`<details><summary>Historia wcześniejszych wyborów (${session.history.length})</summary>${records}</details>`:''}<p class="small muted">Tryb lokalny: nagrody są zapisywane, cooldown pozostaje lokalny; blokada ekwipunku i rozliczenia serwerowe wymagają dalszej integracji. W docelowej Strefie wszystkie te mechaniki muszą być egzekwowane na serwerze.</p></section>`;
}
root.AshenZone239=Object.freeze({initial,pick,setCombat,html,scenes,consequences,encounter,ending,resonator,cooldownLabel,RESONATOR_COOLDOWN_MS,otherStory,storyData});
})(window);
