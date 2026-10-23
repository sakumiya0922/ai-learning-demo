import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
test('chapter-based TOC and roadmap are rendered',()=>{
 const app=read('app/main.js');
 assert.match(app,/function stageGroups\(/);
 assert.match(app,/function stageMap\(/);
 assert.match(app,/class="chapter-group/);
 assert.match(app,/class="roadmap-grid"/);
});
test('page goals and redundant lesson-record notice are absent from lessons',()=>{
 const app=read('app/main.js');
 const lesson=app.split('function lesson(')[1].split('function labState(')[0];
 assert.doesNotMatch(lesson,/learning-goal/);
 assert.doesNotMatch(lesson,/学習記録/);
});
test('navigation is separate from the scrolling content frame',()=>{
 const app=read('app/main.js');
 const lesson=app.split('function lesson(')[1].split('function labState(')[0];
 assert.match(lesson,/lesson-surface/);
 assert.match(lesson,/lesson-toolbar/);
 assert.ok(lesson.indexOf('lesson-toolbar')>lesson.indexOf('</article>'));
 assert.match(read('assets/styles.css'),/\.lesson-frame \.lesson-surface\{[^}]*overflow-y:auto/);
 assert.match(read('assets/styles.css'),/\.chapter-list\{[^}]*overflow-y:auto/);
});
