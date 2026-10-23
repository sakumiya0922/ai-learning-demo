import test from 'node:test';
import assert from 'node:assert/strict';
import {COURSES} from '../courses/index.js';

const allowed=new Set(['text','list','note','table','diagram','code','lab']);
test('four courses remain available; Git has the expanded curriculum',()=>{
 assert.deepEqual(COURSES.map(c=>c.id),['git','docker','pytest','mlflow']);
 assert.equal(COURSES.find(c=>c.id==='git').curriculumVersion,2);
 assert.equal(COURSES.find(c=>c.id==='git').pages.length,39);
 assert.equal(COURSES.reduce((sum,c)=>sum+c.pages.length,0),74);
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
   p.blocks.forEach(b=>{assert.ok(allowed.has(b.type));if(b.type==='code')assert.ok(b.source);if(b.type==='diagram')assert.ok(b.nodes.length>=2);});
  }
  for(const q of course.quiz){assert.ok(q.prompt.length>5);assert.ok(q.choices.length>=3);assert.ok(q.answer>=0&&q.answer<q.choices.length);assert.ok(q.reason);}
 });
}
test('Git curriculum uses eight stages in order',()=>{
 const git=COURSES[0];
 assert.deepEqual([...new Set(git.pages.map(p=>p.stage))],[1,2,3,4,5,6,7,8]);
 for(let i=1;i<git.pages.length;i++)assert.ok(git.pages[i].stage>=git.pages[i-1].stage);
});
test('each course includes a browser-only hands-on simulation',()=>{
 const labs=COURSES.map(c=>[...new Set(c.pages.flatMap(p=>p.blocks.filter(b=>b.type==='lab').map(b=>b.kind)))]);
 assert.deepEqual(labs,[['git'],['docker'],['pytest'],['mlflow']]);
});
