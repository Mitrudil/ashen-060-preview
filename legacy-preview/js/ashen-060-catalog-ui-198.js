/* ASHEN 198: read-only catalog panel within the original visual UI.
   No character storage access, no mutations, no equipment calls. */
(function(root){
'use strict';
const doc=root.document;
if(!doc)return;
const api=root.Ashen060BaseCatalog;
if(!api||typeof api.entries!=='function')return;
const items=api.entries();
if(items.length!==100) return;
const categoryNames={palna_1h:'Broń palna 1-ręczna',palna_2h:'Broń palna 2-ręczna',biala_1h:'Broń biała 1-ręczna',biala_2h:'Broń biała 2-ręczna',dystansowa:'Broń dystansowa',glowa:'Głowa',pancerz:'Pancerz',koszulka:'Koszulki',spodnie:'Spodnie',buty:'Buty',rekawice:'Rękawice',akcesorium:'Akcesoria'};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=doc.createElement('style');css.textContent=`
#ashen-catalog-launch-198{position:fixed;right:16px;bottom:16px;z-index:2147483000;border:1px solid #a17d4a;border-radius:10px;padding:12px 17px;background:#242c2d;color:#e6d6b9;box-shadow:0 6px 24px #000a;font-weight:700;cursor:pointer}
#ashen-catalog-overlay-198{position:fixed;inset:0;z-index:2147483001;background:#070d0edc;padding:3vh 3vw;box-sizing:border-box;display:none;color:#e6e0d1;font:14px/1.5 system-ui,sans-serif}
#ashen-catalog-overlay-198.visible{display:block}
#ashen-catalog-panel-198{height:100%;max-width:1120px;margin:auto;border:1px solid #826b4b;background:linear-gradient(160deg,#25302f,#111a1c 55%);border-radius:13px;box-shadow:0 0 55px #000b;display:flex;flex-direction:column;overflow:hidden}
#ashen-catalog-panel-198 header{padding:17px 22px;border-bottom:1px solid #6b5d40;display:flex;justify-content:space-between;gap:12px;align-items:center}
#ashen-catalog-panel-198 h2{margin:0;color:#dcc293;font:700 24px Georgia,serif}
#ashen-catalog-panel-198 .ashen-198-muted{color:#b9b8ac;font-size:12px}
#ashen-catalog-panel-198 button,#ashen-catalog-panel-198 input,#ashen-catalog-panel-198 select{color:#eee1c8;background:#253030;border:1px solid #655a45;border-radius:6px;padding:9px}
#ashen-catalog-panel-198 button{cursor:pointer}
#ashen-catalog-panel-198 .ashen-198-filters{padding:14px 22px;display:flex;gap:10px;flex-wrap:wrap;border-bottom:1px solid #4c4b3f}
#ashen-catalog-panel-198 input{flex:1;min-width:180px}
#ashen-catalog-panel-198 .ashen-198-list{padding:12px 22px;overflow:auto;flex:1}
#ashen-catalog-panel-198 .ashen-198-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(225px,1fr));gap:10px}
#ashen-catalog-panel-198 article{padding:12px;background:#1f2929;border:1px solid #4f554b;border-radius:9px}
#ashen-catalog-panel-198 article h3{font-size:16px;color:#e3d0a4;margin:0 0 6px}
#ashen-catalog-panel-198 article p{margin:4px 0}
#ashen-catalog-panel-198 .ashen-198-stat{font-weight:700;color:#b8d9cb}
#ashen-catalog-panel-198 footer{padding:10px 22px;border-top:1px solid #4b4d44;color:#b8b7ae;font-size:12px}
`;doc.head.appendChild(css);
const launch=doc.createElement('button');launch.id='ashen-catalog-launch-198';launch.type='button';launch.textContent='Katalog 0.6 · 100 baz';doc.body.appendChild(launch);
const overlay=doc.createElement('section');overlay.id='ashen-catalog-overlay-198';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Katalog przedmiotów ASHEN 0.6');overlay.innerHTML=`<div id="ashen-catalog-panel-198"><header><div><h2>Katalog wyposażenia 0.6</h2><div class="ashen-198-muted">100 zatwierdzonych baz do integracji · podgląd tylko do odczytu</div></div><button type="button" id="ashen-catalog-close-198">Zamknij ✕</button></header><div class="ashen-198-filters"><input id="ashen-catalog-search-198" aria-label="Szukaj przedmiotów" placeholder="Szukaj przedmiotu lub identyfikatora…"/><select id="ashen-catalog-category-198" aria-label="Rodzaj wyposażenia"><option value="">Wszystkie kategorie</option>${Object.keys(categoryNames).map(k=>`<option value="${esc(k)}">${esc(categoryNames[k])}</option>`).join('')}</select><span id="ashen-catalog-count-198" aria-live="polite"></span></div><div class="ashen-198-list"><div class="ashen-198-grid" id="ashen-catalog-results-198"></div></div><footer>Ten katalog nie zmienia postaci, plecaka ani zapisów. Statystyki są danymi bazowymi 0.6; przedmioty nie są jeszcze podłączone do starej rozgrywki.</footer></div>`;doc.body.appendChild(overlay);
const input=overlay.querySelector('#ashen-catalog-search-198'),select=overlay.querySelector('#ashen-catalog-category-198');
const result=overlay.querySelector('#ashen-catalog-results-198'),count=overlay.querySelector('#ashen-catalog-count-198');
const fmt=it=>{
 const weapon=Number.isFinite(it.baseAttacks)&&Number.isFinite(it.minDamage)&&Number.isFinite(it.maxDamage);
 const effects=Array.isArray(it.baseEffects)?it.baseEffects.map(e=>`${esc(e.key)}: ${esc(e.value)}`).join(' · '):'';
 return `<article><h3>${esc(it.name)}</h3><p class="ashen-198-muted">${esc(it.modernId)} · ${esc(categoryNames[it.category]||it.category)}</p><p>Wymagania: poziom ${esc(it.requiredLevel)} · ${esc(it.requiredAttribute)} ${esc(it.requiredValue)}</p><p class="ashen-198-stat">${weapon?`${esc(it.baseAttacks)} at. · obrażenia ${esc(it.minDamage)}–${esc(it.maxDamage)}`:effects||'Brak parametrów ofensywnych'}</p><p class="ashen-198-muted">${it.matchStatus==='exact'?'Odpowiednik w starszym katalogu':'Nowa baza 0.6'}</p></article>`;
};
function render(){const q=input.value.trim().toLocaleLowerCase('pl'),c=select.value;const visible=items.filter(it=>(!c||it.category===c)&&(!q||`${it.name} ${it.modernId} ${it.category}`.toLocaleLowerCase('pl').includes(q)));count.textContent=`${visible.length} / 100`;result.innerHTML=visible.map(fmt).join('')||'<p>Nie znaleziono przedmiotów.</p>';}
function open(){render();overlay.classList.add('visible');input.focus();}
function close(){overlay.classList.remove('visible');launch.focus();}
launch.addEventListener('click',open);overlay.querySelector('#ashen-catalog-close-198').addEventListener('click',close);
overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('visible'))close();});
input.addEventListener('input',render);select.addEventListener('change',render);
root.ASHEN060CatalogUI198=Object.freeze({version:'198',count:items.length,readOnly:true,open,close});
})(typeof window!=='undefined'?window:globalThis);
