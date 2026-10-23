import test from 'node:test';
import assert from 'node:assert/strict';
import {loadApp,isPersistent} from '../app/storage.js';

test('Git v1 progress is safely archived when migrating to v2',async()=>{
 const old={alias:'Local user',completed:{git:{why:true,quiz:true},docker:{intro:true}},quizAttempts:{git:[{score:100,answers:[0]}],docker:[{score:80}]},labs:{git:{working:true},docker:{running:true}}};
 let stored={key:'dev-tool-courses-v1',value:old};
 const makeRequest=(result)=>{const req={result};queueMicrotask(()=>req.onsuccess?.());return req;};
 const db={transaction:()=>({objectStore:()=>({get:()=>makeRequest(stored),put:(row)=>{stored=row;return makeRequest(row);}})})};
 globalThis.window={indexedDB:true};
 globalThis.indexedDB={open:()=>makeRequest(db)};
 const current=await loadApp();
 assert.equal(isPersistent(),true);
 assert.equal(current.alias,'Local user');
 assert.deepEqual(current.completed.git,{});
 assert.deepEqual(current.quizAttempts.git,[]);
 assert.equal(current.labs.git,undefined);
 assert.deepEqual(current.completed.docker,{intro:true});
 assert.equal(current.quizAttempts.docker[0].score,80);
 assert.equal(current.courseRevisions.git,2);
 assert.equal(current.archivedCourseProgress.gitV1.quizAttempts[0].score,100);
 assert.equal(stored.value.courseRevisions.git,2);
});
