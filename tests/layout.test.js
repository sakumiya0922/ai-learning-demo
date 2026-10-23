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


test('all pages show one prominent conclusion before their detailed parts',()=>{
 const app=read('app/main.js');
 const lesson=app.split('function lesson(')[1].split('function labState(')[0];
 assert.match(lesson,/lesson-conclusion/);
 assert.match(lesson,/このページの結論/);
 assert.ok(lesson.indexOf('takeaway')<lesson.indexOf('blockHtml}</div></article>'));
 assert.match(app,/lesson-part-number/);
 assert.match(app,/PART /);
});

test('consistent navigation labels and borderless toolbar',()=>{
 const app=read('app/main.js');
 const lesson=app.split('function lesson(')[1].split('function labState(')[0];
 assert.match(lesson,/前のページへ/);
 assert.match(lesson,/次のページへ/);
 assert.doesNotMatch(lesson,/学習済みにして次へ|講座一覧へ →|採点する →/);
 const css=read('assets/styles.css');
 assert.match(css,/lesson-frame \.lesson-toolbar\{[^}]*border:0/);
 assert.match(css,/toolbar-buttons\{[^}]*justify-content:space-between/);
});

test('left and right arrow navigation avoids form controls and page overrun',()=>{
 const app=read('app/main.js');
 assert.match(app,/function navigateWithArrow\(event\)/);
 assert.match(app,/document.addEventListener\('keydown',navigateWithArrow\)/);
 assert.match(app,/input, textarea, select/);
 assert.match(app,/event.key==='ArrowLeft'&&index>0/);
 assert.match(app,/event.key==='ArrowRight'&&index<current.course.pages.length-1/);
});
