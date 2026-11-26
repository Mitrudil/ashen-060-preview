/* ASHEN 202: isolated technical character persistence. NO legacy keys are ever read or written. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Ashen060Sandbox202=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const KEY='ashen-060-preview-sandbox-character-v202';
 const FORMAT='ashen-060-sandbox-v202';
 const MAX_BYTES=1024*1024;
 const clone=obj=>JSON.parse(JSON.stringify(obj));
 function verify(record,api){
  if(!record||typeof record!=='object'||Array.isArray(record)||record.format!==FORMAT||record.version!==1)throw Error('INVALID_FORMAT');
  if(!Number.isInteger(record.counter)||record.counter<0||record.counter>100000000)throw Error('INVALID_COUNTER');
  const save=clone(record.save);api.audit(save);
  return {format:FORMAT,version:1,counter:record.counter,save};
 }
 function pack(save,counter,api){return verify({format:FORMAT,version:1,counter,save},api)}
 function read(storage,api){
  const raw=storage.getItem(KEY);if(raw===null)return null;
  if(raw.length>MAX_BYTES)throw Error('FILE_TOO_LARGE');
  return verify(JSON.parse(raw),api);
 }
 function write(storage,save,counter,api){
  const payload=JSON.stringify(pack(save,counter,api));if(payload.length>MAX_BYTES)throw Error('FILE_TOO_LARGE');
  storage.setItem(KEY,payload);return payload;
 }
 function fromJson(text,api){if(typeof text!=='string'||text.length>MAX_BYTES)throw Error('FILE_TOO_LARGE');return verify(JSON.parse(text),api)}
 function remove(storage){storage.removeItem(KEY)}
 return Object.freeze({KEY,FORMAT,pack,verify,read,write,fromJson,remove});
});
