/* ASHEN offline tester 108: usuń wyłącznie osierocony lock przewijania.
   Modale areny nadal blokują tło zgodnie z założeniem. */
(()=>{'use strict';
 const modalPresent=()=>!!document.querySelector('.arena-report-overlay,.ashen-online-report-overlay,.ashen-expedition-report-overlay');
 const unlock=()=>{
   if(document.body?.classList.contains('arena-report-modal-open')&&!modalPresent())
      document.body.classList.remove('arena-report-modal-open');
 };
 document.addEventListener('DOMContentLoaded',()=>{
   unlock();
   const app=document.getElementById('app');
   if(app){new MutationObserver(unlock).observe(app,{childList:true,subtree:false});}
 });
})();
