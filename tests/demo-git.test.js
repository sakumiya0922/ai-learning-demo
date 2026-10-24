// Compare selected teaching states with actual Git in an isolated temp folder.
// No user repository, configuration, network, or credentials are used.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createDemo,stepDemo} from '../app/demo-state.js';
const hasGit=spawnSync('git',['--version']).status===0;
function fixture(t){
 const dir=mkdtempSync(join(tmpdir(),'neural-demo-test-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));
 const run=(...args)=>{const p=spawnSync('git',args,{cwd:dir,encoding:'utf8',env:{...process.env,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null',GIT_AUTHOR_NAME:'Demo',GIT_AUTHOR_EMAIL:'demo@example.invalid',GIT_COMMITTER_NAME:'Demo',GIT_COMMITTER_EMAIL:'demo@example.invalid'}});assert.equal(p.status,0,p.stderr);return p.stdout.trim();};
 run('init','-q');run('symbolic-ref','HEAD','refs/heads/main');
 const write=n=>writeFileSync(join(dir,'train.py'),`window = ${n}\n`);
 write(7);run('add','train.py');run('commit','-qm','A');
 return {dir,run,write};
}
test('real Git agrees: commit after a second edit saves only the index',{skip:!hasGit},t=>{
 const f=fixture(t);let s=createDemo('staging');
 f.write(14);s=stepDemo(s,'edit');f.run('add','train.py');s=stepDemo(s,'add');f.write(28);s=stepDemo(s,'edit');f.run('commit','-qm','B');s=stepDemo(s,'commit');
 assert.equal(f.run('show','HEAD:train.py'),`window = ${s.commits.at(-1).value}`);
 assert.equal(f.run('show',':train.py'),`window = ${s.index}`);
 assert.equal(readFileSync(join(f.dir,'train.py'),'utf8').trim(),`window = ${s.work}`);
});
test('real Git agrees: plain restore reads the index',{skip:!hasGit},t=>{
 const f=fixture(t);f.write(14);f.run('add','train.py');f.write(28);f.run('restore','train.py');assert.equal(readFileSync(join(f.dir,'train.py'),'utf8').trim(),'window = 14');
});
test('real Git agrees: fast-forward creates no new commit',{skip:!hasGit},t=>{
 const f=fixture(t);f.run('switch','-c','feature');f.write(14);f.run('add','train.py');f.run('commit','-qm','B');f.run('switch','main');f.run('merge','--ff-only','feature');assert.equal(f.run('rev-list','--count','HEAD'),'2');
});
test('real Git agrees: gitignore leaves tracked files stageable',{skip:!hasGit},t=>{
 const f=fixture(t);writeFileSync(join(f.dir,'.gitignore'),'train.py\n.env\n');writeFileSync(join(f.dir,'.env'),'demo only\n');f.write(14);f.run('add','.');const files=f.run('diff','--cached','--name-only');assert.ok(files.includes('train.py'));assert.ok(!files.split('\n').includes('.env'));
});
