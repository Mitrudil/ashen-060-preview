/* ASHEN 206: explicit offline profile snapshot -> isolated test character.
 * Copies ONLY name, level, six attributes; never imports items, never accesses storage. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060ProfileAdapter206=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const MAX_BYTES=2*1024*1024;
 const keys=['str','dex','end','per','int','cha'];
 function normalize(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||!Array.isArray(raw.inventory)||!raw.equip||typeof raw.equip!=='object'||Array.isArray(raw.equip))throw Error('INVALID_LEGACY_PROFILE');
  const name=typeof raw.name==='string'?raw.name.trim():'';
  if(name.length<2||name.length>60)throw Error('INVALID_NAME');
  if(!Number.isInteger(raw.level)||raw.level<1||raw.level>1000)throw Error('INVALID_LEVEL');
  if(!raw.attrs||typeof raw.attrs!=='object'||keys.some(k=>!Number.isInteger(raw.attrs[k])||raw.attrs[k]<0||raw.attrs[k]>1000))throw Error('INVALID_ATTRS');
  return Object.freeze({name,level:raw.level,attrs:Object.freeze(Object.fromEntries(keys.map(k=>[k,raw.attrs[k]]))),legacyItems:raw.inventory.length});
 }
 function fromJson(text){if(typeof text!=='string'||text.length>MAX_BYTES)throw Error('FILE_TOO_LARGE');return normalize(JSON.parse(text));}
 function buildTestSave(profile,coreApi){
  const p=normalize({name:profile.name,level:profile.level,attrs:profile.attrs,inventory:[],equip:{}});
  const save=coreApi.newSave({level:p.level,attrs:p.attrs});
  save.testProfileName=p.name;save.testProfileSource='explicit-json-206';
  coreApi.audit(save);
  return save;
 }
 return Object.freeze({MAX_BYTES,normalize,fromJson,buildTestSave});
});
