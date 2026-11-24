/* ASHEN Preview 154 — miękki profil lokalizacji zwykłych łupów.
   Nie zmienia jakości, wymagań, źródłowej puli, unikatów ani serwera. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen060LocationPool154=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const settings=Object.freeze({ruins:{target:1},hospital:{target:4},outpost:{target:8}});
 function adapt(pool,locId,rules){
  if(!Array.isArray(pool)||!rules||typeof rules.isModernId!=='function'||typeof rules.requirements!=='function')throw Error('Brak puli lub reguł katalogu.');
  if(!Object.prototype.hasOwnProperty.call(settings,locId))return pool.map(x=>({...x}));
  const target=settings[locId].target;
  return pool.map(x=>{
   if(!x||typeof x.id!=='string'||!Number.isFinite(x.w)||x.w<=0)throw Error('Nieprawidłowa waga łupu.');
   if(!rules.isModernId(x.id))return {...x};
   // Odzyskanie katalogowego progu poziomu bez uzależnienia od atrybutów.
   // Zamiast zgadywać z ID, odczytujemy jawne wymaganie z walidatora.
   const full={str:1e6,dex:1e6,end:1e6,per:1e6,int:1e6,cha:1e6};
   const req=rules.requirements(x.id,1000,full);
   if(!req.ok||!Number.isFinite(req.level))throw Error('Nieznane wymagania '+x.id);
   const delta=req.level-target;
   let factor=1;
   if(delta>4)factor=.20;
   else if(delta>2)factor=.50;
   else if(delta>=-2)factor=1.15;
   else if(locId==='outpost')factor=.75;
   return {...x,w:x.w*factor};
  });
 }
 return Object.freeze({adapt,settings});
});
