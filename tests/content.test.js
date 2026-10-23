import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES} from '../src/courses/index.js';

const allowed=new Set(['text','list','note','table','diagram','code','lab']);
test('four complete courses',()=>{
 assert.deepEqual(COURSES.map(c=>c.id),['git','docker','pytest','mlflow']);
 assert.equal(COURSES.reduce((sum,c)=>sum+c.pages.length,0),48);
});
for(const course of COURSES){
 test(course.name+': unique pages, quiz at the end, ten valid questions',()=>{
  assert.ok(course.pages.length>=10);
  assert.equal(new Set(course.pages.map(p=>p.id)).size,course.pages.length);
  assert.equal(course.pages.at(-1).id,'quiz');
  assert.equal(course.quiz.length,10);
  assert.ok(course.outcomes.length>=3);
  for(const p of course.pages){
   assert.ok(p.title&&p.goal&&p.lead&&p.minutes);
   assert.ok(p.id==='quiz'||p.blocks.length>=2, p.id+' needs substantive content');
   p.blocks.forEach(b=>{assert.ok(allowed.has(b.type));if(b.type==='code')assert.ok(b.source);if(b.type==='diagram')assert.ok(b.nodes.length>=2);});
  }
  for(const q of course.quiz){assert.ok(q.prompt.length>5);assert.ok(q.choices.length>=3);assert.ok(q.answer>=0&&q.answer<q.choices.length);assert.ok(q.reason);}
 });
}
test('each course has hands-on simulation',()=>{
 const labs=COURSES.map(c=>c.pages.flatMap(p=>p.blocks.filter(b=>b.type==='lab').map(b=>b.kind)));
 assert.deepEqual(labs,[['git'],['docker'],['pytest'],['mlflow']]);
});
