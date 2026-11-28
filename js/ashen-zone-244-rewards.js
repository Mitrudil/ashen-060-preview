/* ASHEN 244 — lokalne nagrody Strefy. Bez SQL, bez wymuszania produkcyjnego cooldownu. */
(function(root){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function roll(session,options={},random=Math.random){
 if(!session||session.status!=='finished'||session.rewardSystemVersion!==244||session.testMode)throw Error('Nagroda jest dostępna tylko po ukończeniu prawdziwej przygody 244.');
 if(session.reward)return session.reward;
 const history=Array.isArray(session.history)?session.history:[];
 if(history.length!==5||!session.combat)throw Error('Historia lub walka nie została ukończona.');
 const names=Array.isArray(options.names)?options.names.filter(x=>typeof x==='string'&&x.trim()):[];
 const luck=clamp(Number(session.startLuck)||0,0,15); // zamrozone przy rozpoczeciu Strefy
 const clues=history.slice(0,4).filter(x=>x.good&&(x.category==='wiedza'||x.category==='pomiar')).length;
 const hazards=history.slice(0,4).filter(x=>x.good===false).length;
 const won=session.combat.won===true;
 const route=history[4]?.option;
 if(!Number.isInteger(route)||route<0||route>2)throw Error('Nieznany finał Strefy.');
 // Roboczy balans: wszystkie 3 wybory pozwalaja znalezc artefakt.
 const chance=clamp(.24 + clues*.025 - hazards*.012 + (won?.06:-.04) + luck*.006 + [.015,.010,.005][route],.06,.48);
 const found=names.length>0&&random()<chance;
 const artifactName=found?names[Math.floor(random()*names.length)]:null;
 const scrap=Math.max(0,Math.round((won?12:5)+clues*2-hazards+Math.floor(random()*7)));
 const reward={id:'zone244:'+String(session.startedAt)+':'+String(session.runId||''),scrap,artifactName,chance,won,source:'Martwy Las · Ostatni sygnał'};
 session.reward=reward; // nagroda zapisana razem z rozstrzygnieciem
 return reward;
}
// Build 246: nagrody etapowe oparte na ZAPISANYCH wynikach decyzji.
// Nie ponawiamy losowania, gdy gracz wraca do raportu.
const ZONE246_MATERIALS=Object.freeze(['czesci','elektronika','medical']);
function enrich(session){
 if(!session?.reward||session.testMode||session.status!=='finished')throw Error('Brak prawidłowej nagrody Strefy.');
 const r=session.reward;
 if(r.lootVersion===246)return r;
 const history=session.history;
 if(!Array.isArray(history)||history.length!==5||!session.combat)throw Error('Niekompletna przygoda.');
 const sceneFinds=history.map((h,i)=>{
  const good=h.good===true,choice=h.option;
  if(!Number.isInteger(choice)||choice<0||choice>2)throw Error('Nieprawidłowy zapis decyzji.');
  // Co scena inna rodzina znalezisk, ale zawsze z obecnych surowcow.
  const pool=['czesci','elektronika','medical','czesci','elektronika'];
  const material=pool[i];
  const amount=good?(i===4?4:2+(choice===1?1:0)):(i===4?1:(choice===2?1:0));
  return {scene:i+1,material,amount,scrap:good?3+i:1,good};
 });
 const materials={};let stageScrap=0;
 for(const row of sceneFinds){stageScrap+=row.scrap;if(row.amount)materials[row.material]=(materials[row.material]||0)+row.amount;}
 const battleXp=session.combat.won===true?55:15;
 const completionXp=30;
 Object.assign(r,{lootVersion:246,sceneFinds,materials,stageScrap,battleXp,completionXp,xp:battleXp+completionXp});
 return r;
}
function receipt(session){
 if(!session?.reward||session.testMode)return '';
 const r=session.reward;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const stage=r.lootVersion===246&&Array.isArray(r.sceneFinds)?`<h4>Znaleziska podczas pięciu etapów</h4><ol>${r.sceneFinds.map(x=>`<li>Scena ${x.scene}: ${x.scrap} złomu${x.amount?', '+x.amount+' '+escape(({'czesci':'części mechanicznych','elektronika':'elektroniki','medical':'zaopatrzenia medycznego'})[x.material]||x.material):' — bez dodatkowych materiałów'}</li>`).join('')}</ol><p>Za walkę: <strong>+${r.battleXp} PD</strong> · za ukończenie: <strong>+${r.completionXp} PD</strong></p><p><strong>Złom ze scen: +${r.stageScrap}</strong></p>${r.firstCompletion===true?'<p class="good"><strong>Pierwsze ukończenie tej historii:</strong> +15 złomu, +6 części mechanicznych, +80 PD (jednorazowo).</p>':''}`:'';
 return `<div class="panel ashen-zone-reward"><h3>✧ Znaleziska Strefy</h3>${stage}<p><strong>Złom: +${Number(r.scrap)||0}</strong></p><p>${r.artifactName?'Artefakt: <strong>'+escape(r.artifactName)+'</strong>':'Nie znaleziono artefaktu. Złom został zabezpieczony.'}</p><p class="small muted">${session.rewardClaimed?'Nagrody automatycznie zapisane w magazynie.':'Zapisywanie nagród…'} Kolejne otwarcie raportu nie losuje nagrody ponownie.</p></div>`;
}
root.AshenZone244Rewards=Object.freeze({roll,enrich,receipt});
})(window);
