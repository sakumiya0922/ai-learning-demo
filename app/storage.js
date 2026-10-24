/** Browser-only learning records. Preserve the original IndexedDB database and non-Git course progress. */
const NAME='ai-learning-portfolio';
const VERSION=1;
const EVENT_STORE='events';
const STATE_STORE='state';
const APP_KEY='dev-tool-courses-v1';
const GIT_CURRICULUM_VERSION=2;
let database=null;
let memoryState=null;
let memoryEvents=[];
let persistent=false;

export function isPersistent(){return persistent;}
function reqResult(request){return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
function openDb(){return new Promise((resolve,reject)=>{
 const req=indexedDB.open(NAME,VERSION);
 req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(EVENT_STORE))db.createObjectStore(EVENT_STORE,{keyPath:'id',autoIncrement:true});if(!db.objectStoreNames.contains(STATE_STORE))db.createObjectStore(STATE_STORE,{keyPath:'key'});};
 req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
 req.onblocked=()=>reject(new Error('IndexedDBが別のタブで使用されています'));
});}
const initial=()=>({alias:'',completed:{},quizAttempts:{},labs:{},courseRevisions:{git:GIT_CURRICULUM_VERSION},archivedCourseProgress:{}});

function migrateLegacyGitProgress(saved,state){
 // Old Git quizzes use different questions. Never evaluate those answers against the new quiz.
 if(!saved || saved.courseRevisions?.git===GIT_CURRICULUM_VERSION)return false;
 const completed=saved.completed?.git||{};
 const attempts=saved.quizAttempts?.git||[];
 const previousLab=saved.labs?.git||null;
 const hadHistory=Object.keys(completed).length>0 || attempts.length>0 || previousLab!==null;
 if(hadHistory){
  state.archivedCourseProgress={...(state.archivedCourseProgress||{}),gitV1:{completed,quizAttempts:attempts,lab:previousLab,archivedAt:new Date().toISOString()}};
 }
 state.completed={...state.completed,git:{}};
 state.quizAttempts={...state.quizAttempts,git:[]};
 state.labs={...state.labs};delete state.labs.git;
 state.courseRevisions={...(state.courseRevisions||{}),git:GIT_CURRICULUM_VERSION};
 return true;
}

export async function loadApp(){
 if(memoryState)return memoryState;
 try{
  if(!('indexedDB' in window))throw new Error('IndexedDB非対応');
  database=await openDb();persistent=true;
  const tx=database.transaction(STATE_STORE,'readonly');
  const row=await reqResult(tx.objectStore(STATE_STORE).get(APP_KEY));
  const saved=row?.value||null;
  memoryState={...initial(),...(saved||{})};
  if(migrateLegacyGitProgress(saved,memoryState)){
   await reqResult(database.transaction(STATE_STORE,'readwrite').objectStore(STATE_STORE).put({key:APP_KEY,value:memoryState}));
  }
 }catch(e){console.warn('Browser storage unavailable, using temporary memory:',e);memoryState=initial();persistent=false;}
 return memoryState;
}
export async function saveApp(state){
 memoryState=state;
 if(!database)return;
 try{await reqResult(database.transaction(STATE_STORE,'readwrite').objectStore(STATE_STORE).put({key:APP_KEY,value:state}));}
 catch(e){console.warn('Learning progress could not be saved',e);persistent=false;}
}
export async function addEvent(type,detail={}){
 const row={type,detail,at:new Date().toISOString()};memoryEvents.push(row);
 if(!database)return;
 try{await reqResult(database.transaction(EVENT_STORE,'readwrite').objectStore(EVENT_STORE).add(row));}
 catch(e){console.warn('Learning event could not be saved',e);persistent=false;}
}
export async function getEvents(){
 if(!database)return memoryEvents.slice();
 try{return await reqResult(database.transaction(EVENT_STORE,'readonly').objectStore(EVENT_STORE).getAll());}
 catch(e){console.warn(e);return memoryEvents.slice();}
}
export async function clearLearning(){
 memoryState=initial();memoryEvents=[];
 if(!database)return memoryState;
 // Never wipe the original Python demo's IndexedDB records or unrelated store keys.
 await saveApp(memoryState);await addEvent('learning-reset',{});
 return memoryState;
}
export async function exportLearning(state){
 const events=await getEvents();
 const data={format:'neural-daylight-dev-courses',version:2,exportedAt:new Date().toISOString(),profile:{alias:state.alias},completed:state.completed,quizAttempts:state.quizAttempts,labs:state.labs,demos:state.demos||{},courseRevisions:state.courseRevisions,archivedCourseProgress:state.archivedCourseProgress,events:events.filter(x=>['page-completed','quiz-submitted','lab-action','demo-action','learning-reset'].includes(x.type))};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='neural-daylight-learning-records.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
