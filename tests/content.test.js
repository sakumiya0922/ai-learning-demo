import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES} from '../courses/index.js';

const allowed=new Set(['text','list','note','table','diagram','code','lab','visual']);
test('four courses remain available; Git has the expanded curriculum',()=>{
 assert.deepEqual(COURSES.map(c=>c.id),['git','docker','pytest','mlflow']);
 assert.equal(COURSES.find(c=>c.id==='git').curriculumVersion,2);
 assert.equal(COURSES.find(c=>c.id==='git').pages.length,42);
 assert.equal(COURSES.reduce((sum,c)=>sum+c.pages.length,0),81);
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
   assert.ok(p.id==='quiz'||p.blocks.length>=2||(p.id.includes('-continue-')&&p.blocks.length>=1),p.id+' needs substantive content');
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
 for(const page of git.pages.filter(p=>p.id!=='quiz'))assert.ok(page.blocks.length>=1,page.id+' has no explanation');
});
test('each course includes a browser-only hands-on simulation',()=>{
 const labs=COURSES.map(c=>[...new Set(c.pages.flatMap(p=>p.blocks.filter(b=>b.type==='lab').map(b=>b.kind)))]);
 assert.deepEqual(labs,[['git'],['docker'],['pytest'],['mlflow']]);
});


test('all 81 pages have exactly one authored takeaway in declarative voice',()=>{
 const all=COURSES.flatMap(c=>c.pages.map(p=>({course:c.id,...p})));
 assert.equal(all.length,81);
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

test('every explanation page has one conclusion and no more than three meaningful parts',()=>{
 for(const c of COURSES){
  for(const p of c.pages.filter(p=>p.id!=='quiz')){
   assert.ok(p.parts.length>=1&&p.parts.length<=3,`${c.id}/${p.id} parts: ${p.parts.length}`);
   assert.deepEqual(p.parts.flat(),p.blocks,`${c.id}/${p.id}: content lost during part grouping`);
   assert.ok(p.parts.every(part=>part.some(b=>b.title)),`${c.id}/${p.id}: missing part title`);
  }
 }
});
test('no awkward automatic conjugation in displayed materials',()=>{
 for(const c of COURSES){
  for(const p of c.pages){
   for(const txt of [p.lead,p.takeaway,...p.blocks.flatMap(b=>[b.title,b.body,b.caption,b.footer,b.description]).filter(Boolean)]){
    if(!txt)continue;
    assert.doesNotMatch(txt,/構いない|扱いる|できることだ|登録されました/,`${c.id}/${p.id}: ${txt}`);
   }
  }
 }
});
