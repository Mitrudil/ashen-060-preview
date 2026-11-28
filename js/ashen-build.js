/* Jedno zrodlo informacji o wersji gry i etapie przebudowy. */
(function(root){
'use strict';
const info=Object.freeze({gameVersion:'0.5.4.1',targetVersion:'0.6.0',modernDropsEnabled:false,stage:47,build:247,release:'247',label:'przebudowa 0.6.0 · etap 55'});
root.ASHEN_BUILD=info;
document.title=`ASHEN — Kroniki Upadku | Build ${info.build} · silnik v${info.gameVersion}`;
})(window);
