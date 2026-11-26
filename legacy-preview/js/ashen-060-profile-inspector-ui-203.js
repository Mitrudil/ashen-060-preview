/* ASHEN 203: optional report for explicitly supplied JSON file, never reads/writes game save */
(function(root){'use strict';
 const doc=root.document,api=root.Ashen060ProfilePreview203,migrator=root.ASHEN060MigrationPreview196;
 if(!doc||!api||!migrator)return;
 const btn=doc.createElement('button');btn.type='button';btn.textContent='Raport zgodności profilu 0.6';btn.style.cssText='position:fixed;right:16px;bottom:15px;z-index:2147482999;background:#213630;color:#efe2c8;border:1px solid #94784d;padding:9px 13px;border-radius:8px;cursor:pointer';
 const input=doc.createElement('input');input.type='file';input.accept='.json,application/json';input.hidden=true;
 const panel=doc.createElement('section');panel.hidden=true;panel.style.cssText='position:fixed;inset:5vh 5vw;z-index:2147483100;overflow:auto;background:#111c1f;color:#e8dfcc;border:2px solid #94784d;border-radius:12px;padding:24px;font:14px/1.6 system-ui,sans-serif;box-shadow:0 0 0 100vmax #000c';
 panel.innerHTML='<button type="button" data-close style="float:right">Zamknij ✕</button><h2>Raport zgodności starego profilu z 0.6</h2><p>Wskaż wyeksportowany plik JSON. Raport zostanie utworzony wyłącznie w pamięci, bez importowania postaci lub modyfikowania zapisów.</p><pre data-result style="white-space:pre-wrap;overflow-wrap:anywhere"></pre><button type="button" data-download hidden>Pobierz raport JSON</button>';
 doc.body.append(btn,input,panel);
 let result=null;btn.addEventListener('click',()=>input.click());panel.querySelector('[data-close]').addEventListener('click',()=>{panel.hidden=true});
 input.addEventListener('change',async()=>{const file=input.files&&input.files[0];input.value='';if(!file)return;panel.hidden=false;result=null;panel.querySelector('[data-download]').hidden=true;
 try{if(file.size>api.MAX_BYTES)throw Error('FILE_TOO_LARGE');const contents=await file.text();result=api.fromJson(contents,migrator);
 const lines=['Postać: '+String(result.character.name||'(brak nazwy)'), 'Poziom: '+String(result.character.level??'?'),
 'Przedmioty: '+result.inventoryCount,'Rozpoznane bazy: '+result.recognizedBases,'Nierozpoznane bazy: '+result.unrecognizedBases,
 'Założone przedmioty: '+result.equippedCount,'Problemy z przedmiotami: '+result.itemIssues.length,
 'Problemy w slotach: '+result.equipmentIssues.length,'Brakujące sloty: '+result.missingTargetSlots.join(', '),
 'Inne pola wymagające osobnej analizy: '+result.unknownFields.join(', '),
 '', 'UWAGA: To raport, nie migracja. Żadne dane postaci nie zostały zapisane.'];
 panel.querySelector('[data-result]').textContent=lines.join('\n');panel.querySelector('[data-download]').hidden=false;
 }catch(err){panel.querySelector('[data-result]').textContent='Nie można przygotować raportu: '+err.message+'. Stary zapis nie został zmieniony.'}
 });
 panel.querySelector('[data-download]').addEventListener('click',()=>{if(!result)return;const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));const a=doc.createElement('a');a.href=url;a.download='ASHEN_203_RAPORT_ZGODNOSCI.json';a.click();URL.revokeObjectURL(url)});
})(typeof window!=='undefined'?window:globalThis);
