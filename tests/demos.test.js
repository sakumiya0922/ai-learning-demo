import test from 'node:test';
import assert from 'node:assert/strict';
import {createDemo,stepDemo,allowedFiles} from '../app/demo-state.js';
import {renderDemo} from '../app/demo-view.js';
import {DEMO_MAP,demoFor} from '../courses/demo-map.js';
import {COURSES} from '../courses/index.js';
const apply=(s,...ops)=>ops.reduce((st,op)=>Array.isArray(op)?stepDemo(st,...op):stepDemo(st,op),s);

test('init separates folder, repository, untracked file, index and first commit',()=>{
 let s=createDemo('init');s=stepDemo(s,'commit');assert.equal(s.phase,0);
 for(const [i,action] of ['mkdir','init','file','add','commit'].entries()){s=stepDemo(s,action);assert.equal(s.phase,i+1);}
});
test('add captures a snapshot; editing again does not change the index',()=>{
 const s=apply(createDemo('staging'),'edit','add','edit');
 assert.equal(s.work,28);assert.equal(s.index,14);assert.equal(s.commits.at(-1).value,7);
});
test('commit saves the index and preserves post-add edits',()=>{
 const s=apply(createDemo('staging'),'edit','add','edit','commit');
 assert.equal(s.commits.at(-1).value,14);assert.equal(s.index,14);assert.equal(s.work,28);
});
test('empty commit is not generated',()=>assert.equal(stepDemo(createDemo('staging'),'commit').commits.length,1));
test('restore --staged keeps the working file',()=>{
 const s=apply(createDemo('staging'),'edit','add','unstage');assert.equal(s.index,7);assert.equal(s.work,14);
});
test('plain restore uses the index, not always HEAD',()=>{
 const s=apply(createDemo('staging'),'edit','add','edit','restore');assert.equal(s.work,14);assert.equal(s.commits.at(-1).value,7);
});
test('branch commits move only the current branch',()=>{
 const s=apply(createDemo('branch'),'create','commit');assert.equal(s.refs.main,'B');assert.equal(s.refs.feature,'C');assert.equal(s.current,'feature');
});
test('fast-forward moves the reference without an extra commit',()=>{
 const s=apply(createDemo('branch'),'create','commit','switch-main','merge');assert.equal(s.refs.main,'C');assert.equal(s.commits.length,3);
});
test('diverged branches reject ff-only integration',()=>{
 const s=apply(createDemo('branch'),'create','commit','switch-main','commit','merge');assert.equal(s.refs.main,'D');assert.equal(s.refs.feature,'C');assert.match(s.message,/早送り不可/);
});
test('conflict cannot complete until resolution and add',()=>{
 let s=apply(createDemo('conflict'),'merge','commit');assert.equal(s.phase,1);
 s=apply(s,'resolve-28','commit');assert.equal(s.phase,2);
 s=apply(s,'add','commit');assert.equal(s.phase,4);assert.equal(s.resolution,28);
});
test('commit stays local until push',()=>{
 let s=stepDemo(createDemo('remote'),'local-commit');assert.equal(s.local,'B');assert.equal(s.remote,'A');assert.equal(s.tracking,'A');
 s=stepDemo(s,'push');assert.equal(s.remote,'B');assert.equal(s.tracking,'B');
});
test('fetch only updates the remote tracking reference',()=>{
 const s=apply(createDemo('remote'),'remote-commit','fetch');assert.equal(s.local,'A');assert.equal(s.remote,'B');assert.equal(s.tracking,'B');
});
test('pull ff-only advances local main and working snapshot',()=>{
 const s=apply(createDemo('remote'),'remote-commit','pull');assert.equal(s.local,'B');assert.equal(s.tracking,'B');
});
test('divergence cannot overwrite remote history',()=>{
 const s=apply(createDemo('remote'),'local-commit','remote-commit','push');assert.equal(s.local,'B');assert.equal(s.remote,'C');assert.match(s.message,/拒否/);
 const after=stepDemo(s,'pull');assert.equal(after.local,'B');assert.equal(after.tracking,'C');assert.match(after.message,/統合を停止/);
});
test('historical viewing is read-only; restore and commit are separate',()=>{
 let s=stepDemo(createDemo('history'),'select','A');assert.equal(s.work,28);
 s=stepDemo(s,'restore');assert.equal(s.work,7);assert.equal(s.commits.length,3);
 s=stepDemo(s,'commit');assert.equal(s.commits.length,4);assert.equal(s.commits.at(-1).value,7);
});
test('revert appends a commit and retains the reverted commit',()=>{
 const s=stepDemo(createDemo('history'),'revert');assert.equal(s.commits.length,4);assert.equal(s.work,14);assert.equal(s.commits[2].value,28);
});
test('gitignore does not exclude a tracked file',()=>{
 let s=createDemo('ignore');assert.ok(allowedFiles(s).includes('settings.json'));assert.ok(!allowedFiles(s).includes('.env'));
 s=stepDemo(s,'add');assert.deepEqual(s.staged,['train.py','settings.json']);
});
test('adding an ignore rule does not unstage an already added file',()=>{
 let s=apply(createDemo('ignore'),['toggle','env'],'add',['toggle','env'],'add');assert.ok(s.rules.env);assert.ok(s.staged.includes('.env'));
});
test('Run IDs change while Git version stays fixed for parameter-only changes',()=>{
 const s=apply(createDemo('experiment'),'run',['lr','0.001'],'run');assert.equal(s.runs.length,2);assert.equal(s.runs[0].code,s.runs[1].code);assert.notEqual(s.runs[0].id,s.runs[1].id);
});
test('new code version applies only to future runs',()=>{
 const s=apply(createDemo('experiment'),'run','code','run');assert.equal(s.runs[0].code,'A');assert.equal(s.runs[1].code,'B');
});
test('container stop keeps data, remove clears container-only files',()=>{
 let s=apply(createDemo('docker'),'mount','build','run','save','stop');assert.ok(s.container);assert.ok(s.inside);assert.ok(!s.running);
 s=stepDemo(s,'remove');assert.ok(!s.inside);assert.ok(s.image);
});
test('mounted files survive container removal and a new container',()=>{
 const s=apply(createDemo('docker'),'build','run','save','remove','run');assert.ok(s.outside);assert.ok(s.container);assert.ok(s.running);
});
test('boundary test detects a bug and passes after a fix',()=>{
 let s=apply(createDemo('pytest'),['case','boundary'],'run');assert.equal(s.result.actual,-33);assert.equal(s.result.pass,false);
 s=apply(s,'fix','run');assert.equal(s.result.actual,0);assert.equal(s.result.pass,true);
});
test('replenishment rounds up rather than truncating a fractional prediction',()=>{
 const s=apply(createDemo('pytest'),['case','fraction'],'run');assert.equal(s.result.actual,26);assert.ok(s.result.pass);
});
test('the reducer is immutable and reset stays local to its demo',()=>{
 const first=createDemo('staging'),next=stepDemo(first,'edit');assert.equal(first.work,7);assert.equal(next.work,14);assert.deepEqual(stepDemo(next,'reset'),first);
});
test('all mapped demos exist and render without decorative labels',()=>{
 let count=0;const kinds=new Set();
 for(const [cid,pages] of Object.entries(DEMO_MAP)){
  const course=COURSES.find(c=>c.id===cid);
  for(const [pid,config] of Object.entries(pages)){
   assert.ok(course.pages.some(p=>p.id===pid),`${cid}/${pid}`);
   const html=renderDemo(createDemo(config.kind),config);
   assert.match(html,/data-action="demo"/);assert.doesNotMatch(html,/PART \d|VISUAL GUIDE/);assert.match(html,/実コマンドは実行しない/);
   count++;kinds.add(config.kind);
  }
 }
 assert.equal(count,48);assert.equal(kinds.size,12);
 assert.equal(demoFor('git','three-areas-concept-continue-1').kind,'staging');
});
