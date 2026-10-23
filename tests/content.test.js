import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES} from '../courses/index.js';

const allowed=new Set(['text','list','note','table','diagram','code','lab','visual']);
test('four courses remain available; Git has the expanded curriculum',()=>{
 assert.deepEqual(COURSES.map(c=>c.id),['git','docker','pytest','mlflow']);
 assert.equal(COURSES.find(c=>c.id==='git').curriculumVersion,2);
 assert.equal(COURSES.find(c=>c.id==='git').pages.length,39);
 assert.equal(COURSES.reduce((sum,c)=>sum+c.pages.length,0),77);
});
for(const course of COURSES){
 test(course.name+': unique pages, quiz at the end and valid questions',()=>{
  assert.ok(course.pages.length>=10);
  assert.equal(new Set(course.pages.map(p=>p.id)).size,course.pages.length);
  assert.equal(course.pages.at(-1).id,'quiz');
  assert.equal(course.quiz.length,course.id==='git'?15:10);
  assert.ok(course.outcomes.length>=3);
  for(const p of course.pages){
   assert.ok(p.title&&p.goal&&p.lead&&p.minutes);
   assert.ok(p.id==='quiz'||p.blocks.length>=2,p.id+' needs substantive content');
   p.blocks.forEach(b=>{assert.ok(allowed.has(b.type));if(b.type==='code')assert.ok(b.source);if(b.type==='diagram')assert.ok(b.nodes.length>=2);if(b.type==='visual')assert.ok(b.items.length>=2);});
  }
  for(const q of course.quiz){assert.ok(q.prompt.length>5);assert.ok(q.choices.length>=3);assert.ok(q.answer>=0&&q.answer<q.choices.length);assert.ok(q.reason);}
 });
}
test('all courses follow the same eight chapters in order',()=>{
 for(const c of COURSES){
  assert.deepEqual([...new Set(c.pages.map(p=>p.stage))],[1,2,3,4,5,6,7,8], c.name);
  for(let i=1;i<c.pages.length;i++)assert.ok(c.pages[i].stage>=c.pages[i-1].stage,c.name);
 }
});
test('first page is course-wide goal and every Git chapter contains a diagram',()=>{
 for(const c of COURSES)assert.equal(c.pages[0].stage,1);
 const git=COURSES[0];
 for(const page of git.pages.filter(p=>p.id!=='quiz'))assert.ok(page.blocks.some(b=>['visual','diagram','lab'].includes(b.type)) || page.id==='goal',page.id+' missing visual aid');
});
test('each course includes a browser-only hands-on simulation',()=>{
 const labs=COURSES.map(c=>[...new Set(c.pages.flatMap(p=>p.blocks.filter(b=>b.type==='lab').map(b=>b.kind)))]);
 assert.deepEqual(labs,[['git'],['docker'],['pytest'],['mlflow']]);
});


test('all 77 pages have exactly one authored takeaway in declarative voice',()=>{
 const all=COURSES.flatMap(c=>c.pages.map(p=>({course:c.id,...p})));
 assert.equal(all.length,77);
 for(const p of all){
  assert.ok(typeof p.takeaway==='string'&&p.takeaway.length>12,`${p.course}/${p.id} needs takeaway`);
  assert.doesNotMatch(p.takeaway,/(?:です|ます|ません)(?:[。！？]|$)/,`${p.course}/${p.id} non-declarative takeaway`);
  const plain=p.takeaway.replace(/\*\*/g,'');
  assert.ok(plain.length<95,`${p.course}/${p.id} takeaway too long`);
 }
});

test('displayed explanatory content is declarative and code samples are unchanged',()=>{
 for(const c of COURSES){
  for(const p of c.pages){
   for(const b of p.blocks){
    for(const key of ['body','caption','footer','description']){
     if(typeof b[key]==='string')assert.doesNotMatch(b[key],/(?:です|ます|ません)[。！？]/,`${c.id}/${p.id}:${key}`);
    }
   }
  }
 }
});
