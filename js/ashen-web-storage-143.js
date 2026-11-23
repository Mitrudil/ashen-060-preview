/* ASHEN 143: localStorage isolated from the production game (same-origin safe). */
(()=>{'use strict';
 const native=window.localStorage, ns='ashen-v060-web143:';
 const get=k=>native.getItem(ns+String(k));
 const all=()=>{let a=[];for(let i=0;i<native.length;i++){let k=native.key(i);if(k&&k.startsWith(ns))a.push(k.slice(ns.length))}return a};
 window.ASHEN_PREVIEW_STORAGE=Object.freeze({
 getItem:get,
 setItem:(k,v)=>native.setItem(ns+String(k),String(v)),
 removeItem:k=>native.removeItem(ns+String(k)),
 key:i=>all()[i]??null,
 get length(){return all().length},
 clear:()=>{for(const k of all())native.removeItem(ns+k)}
 });
})();
