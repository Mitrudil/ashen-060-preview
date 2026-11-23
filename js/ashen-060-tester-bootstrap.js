/* ASHEN 0.6.0 — izolowany rozruch TESTERA, wyłącznie lokalny. */
(()=>{'use strict';
const ACTIVE='ashen-dev-active-v021',PROFILES='ashen-dev-profiles-v021',PREFIX='ashen-dev-slot-v021:',TEST='test-060-sandbox';
const fresh=()=>({version:1,created:false,gender:'male',origin:'scout',dominantHand:'right',name:'Wędrowiec',level:1,xp:0,points:5,attrs:{str:5,dex:5,end:5,per:5,int:5,cha:5},hp:110,energy:100,lastRegen:Date.now(),scrap:0,credits:0,cores:0,schematics:0,workshopTestGranted:false,factionTestPackGranted:false,furniture:{bed:0,table:0,nightstand:0},rooms:{bedroom:1,storage:1,workshop:1},materials:{tkanina:0,skora:0,tworzywo:0,elektronika:0,czesci:0,food:0,water:0,medical:0},inventory:[{uid:'starter-knife',id:'knife',rarity:0},{uid:'starter-jacket',id:'jacket',rarity:0}],equip:{right:'starter-knife',left:null,shirt:null,pants:null,boots:null,outer:'starter-jacket',head:null,extra:null},mission:null,reports:[],arena:{highest:0,attempts:{},victories:{},losses:{},draws:{},history:[]},battles:0,wins:0,companion:null,companionLevels:{},ownedCompanions:[],companionExperience:{},vehicle:'foot',vehicleUpgrades:{},vehicleSelectedStages:{},ownedVehicles:[],vehicleModules:{}});
try {
 let list;try{list=JSON.parse(window.ASHEN_PREVIEW_STORAGE.getItem(PROFILES)||'null')}catch{list=null}
 if(!Array.isArray(list)||!list.length)list=[{id:'main',label:'Główna postać'}];
 if(!list.some(p=>p.id===TEST)){
   if(list.length>=5){
     throw Error('Wszystkie pięć slotów zajęte. Eksportuj i usuń jeden zbędny profil testowy w standardowej grze, potem uruchom tę paczkę ponownie.');
   }else{
     window.ASHEN_PREVIEW_STORAGE.setItem(PREFIX+TEST,JSON.stringify(fresh()));
     list.push({id:TEST,label:'Tester 0.6'});
     window.ASHEN_PREVIEW_STORAGE.setItem(PROFILES,JSON.stringify(list));
     window.ASHEN_PREVIEW_STORAGE.setItem(ACTIVE,TEST);
     window.ASHEN_TESTER_ACTIVE_ID=TEST;
   }
 }else{
   if(window.ASHEN_PREVIEW_STORAGE.getItem(PREFIX+TEST)===null)window.ASHEN_PREVIEW_STORAGE.setItem(PREFIX+TEST,JSON.stringify(fresh()));
   window.ASHEN_PREVIEW_STORAGE.setItem(ACTIVE,TEST);
   window.ASHEN_TESTER_ACTIVE_ID=TEST;
 }
 window.ASHEN_PREVIEW_STORAGE.setItem('ashen-active-page','character');
}catch(err){window.ASHEN_TESTER_BOOT_ERROR=String(err.message||err);}
})();
