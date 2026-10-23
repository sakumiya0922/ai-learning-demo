import {COURSES,getCourse} from './courses/index.js';
import {loadApp,saveApp,addEvent,getEvents,exportLearning,clearLearning,isPersistent} from './storage.js';

const root=document.getElementById('app');
let state=null;
let currentQuizMode={};
let stopNetwork=()=>{};
let toastTimeout;
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
function rich(x){return esc(x).replace(/`([^`]+)`/g,'<code class="inline-code">$1</code>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');}
function progressFor(course){const done=state.completed[course.id]||{};return course.pages.filter(p=>done[p.id]).length;}
function overall(){return {done:COURSES.reduce((n,c)=>n+progressFor(c),0),total:COURSES.reduce((n,c)=>n+c.pages.length,0)};}
function bestQuiz(course){const attempts=state.quizAttempts[course.id]||[];return attempts.length?Math.max(...attempts.map(a=>a.score)):null;}
function latestQuiz(course){const attempts=state.quizAttempts[course.id]||[];return attempts.at(-1)||null;}
function nextPage(course){return course.pages.find(p=>!state.completed[course.id]?.[p.id])||course.pages.at(-1);}
function route(){
 if(!state?.alias)return {view:'welcome'};
 const s=decodeURIComponent(location.hash.replace(/^#\/?/,'')).split('/');
 if(s[0]==='course'){const c=getCourse(s[1]);if(c){const p=c.pages.find(x=>x.id===s[2])||nextPage(c);return {view:'lesson',course:c,page:p};}}
 return {view:'dashboard'};
}
function navigate(path){if(location.hash==='#/'+path){render();window.scrollTo({top:0,behavior:'instant'});}else location.hash='#/'+path;}
function icon(c){return `<span class="course-icon ${esc(c.id)}" aria-hidden="true">${esc(c.symbol)}</span>`;}
function header(){return `<header class="site-top"><div class="site-top-inner"><a class="logo" href="#/dashboard" aria-label="学習ポータルへ"><span class="logo-mark">◈</span><span>Neural <em>Daylight</em></span></a><div class="top-actions"><span class="user-chip" title="ローカル学習者">${esc(state.alias)}</span><button class="btn compact ghost" data-action="export">記録を出力 ↗</button><button class="btn compact soft" data-action="logout">入口へ</button></div></div></header>`;}
function footer(){return `<footer class="bottom-footer">© 2026 Neural Daylight · 学習用ポートフォリオデモ。学習履歴はこのブラウザのIndexedDBに保存され、端末間で自動同期されません。<br>Git・Docker・pytest・MLflowは各プロジェクトの商標です。この教材は独立した解説・シミュレーションであり、公式教材ではありません。</footer>`;}
function welcome(){return `<div class="welcome"><canvas class="network-canvas" id="networkCanvas" aria-hidden="true"></canvas><header class="header"><span class="logo"><span class="logo-mark">◈</span><span>Neural <em>Daylight</em></span></span><span class="pill green">AI ENGINEERING · LEARNING SPACE</span></header><main class="welcome-main"><section class="welcome-copy"><div class="eyebrow">THE DEVELOPER'S LEARNING SPACE</div><h1>学ぶ技術を、<br><em>使える知識</em>へ。</h1><p>機械学習開発を支える4つの技術を、仕組みから理解する。読むだけで終わらない、図解と疑似操作で進むWeb教材。</p><div class="welcome-chips"><span>⑂ Git</span><span>▣ Docker</span><span>✓ pytest</span><span>◈ MLflow</span></div></section><section class="welcome-panel"><div class="welcome-badge">WELCOME TO THE LAB</div><h2>学習をはじめる</h2><p class="subtitle">学習者名を入力すると、専用の学習ポータルを開きます。パスワードやアカウント登録は必要ありません。</p><form id="enter-form"><label class="label" for="learnerName">学習者名（この端末内の表示名）</label><input class="field" type="text" id="learnerName" maxlength="30" placeholder="例：Learner" value="${esc(state?.alias||'')}" autocomplete="off"><div style="height:17px"></div><button type="submit" class="btn primary wide">学習ポータルを開く <span aria-hidden="true">→</span></button></form><p class="welcome-disclaimer">これは学習記録のローカル体験画面です。本人認証やサーバーへのログインは行いません。入力した名前と学習履歴はこのブラウザに保存されます。</p></section></main><div class="welcome-footer">A hands-on learning portfolio · GitHub Pages</div></div>`;}
function dashboard(){
 const {done,total}=overall();const percent=Math.round(done/total*100);const passed=COURSES.filter(c=>(bestQuiz(c)||0)>=70).length;
 const rows=COURSES.map(c=>{const d=progressFor(c),pct=Math.round(d/c.pages.length*100),best=bestQuiz(c),complete=pct===100;return `<article class="course-card card"><div class="course-head">${icon(c)}<span class="pill ${complete?'green':d?'':'gray'}">${complete?'修了':d?'学習中':'未開始'}</span></div><div><div class="eyebrow">COURSE ${c.label}</div><h3>${esc(c.name)}</h3></div><p>${esc(c.description)}</p><div class="progress" role="progressbar" aria-label="${esc(c.name)}の進捗" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div><div class="course-bottom"><div class="course-meta"><span>${d} / ${c.pages.length} ページ</span><span>約${c.minutes}分</span>${best!==null?`<span>最高 ${best}%</span>`:''}</div><button class="btn soft compact" data-action="open-course" data-course="${c.id}">${d?'続きを学ぶ':'学習を始める'} →</button></div></article>`;}).join('');
 return `<div class="frame">${header()}<main class="container"><div class="crumb"><span>学習ポータル</span><span>›</span><span>ダッシュボード</span></div><div class="dash-hero"><section class="dash-hero-main"><div class="eyebrow">YOUR LEARNING JOURNEY</div><h1>おかえりなさい、<br>${esc(state.alias)} さん。</h1><p>Git・Docker・pytest・MLflowを体系的に学びます。各講座はページ単位で進み、最後の理解度テストで成果を確認できます。</p><button class="btn primary" data-action="open-course" data-course="${COURSES.find(c=>progressFor(c)<c.pages.length)?.id||'git'}">${done?'学習を再開':'最初の講座へ'} →</button></section><section class="dash-summary card"><div class="eyebrow">LEARNING PROGRESS</div><div class="summary-row"><strong class="big">${percent}%</strong><span class="pill ${percent===100?'green':''}">${done} / ${total} ページ</span></div><div class="progress" role="progressbar" aria-label="全体進捗" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${percent}%"></span></div><div class="summary-row"><span class="metric-label">理解度テスト合格</span><strong>${passed} / 4 講座</strong></div><span class="tiny">ページ完了とテスト結果はブラウザに記録されます。</span></section></div><div class="section-bar"><div><div class="eyebrow">COURSE LIBRARY</div><h2>学習カリキュラム</h2></div><span class="pill">4講座 · ${total}ページ · 40問</span></div><div class="course-grid">${rows}</div><div class="dash-overview"><section class="overview-card card"><h3>この教材で身につくこと</h3><div class="over-list"><div class="over-item">◈ <b>Git</b>：コードの変更を追跡する</div><div class="over-item">◈ <b>Docker</b>：実行環境を再現する</div><div class="over-item">◈ <b>pytest</b>：コードの動作を検証する</div><div class="over-item">◈ <b>MLflow</b>：実験条件・評価指標・モデルを記録する</div></div></section><section class="overview-card card"><h3>学習履歴について</h3><p class="muted" style="font-size:12px;line-height:1.9">このサイトはGitHub Pagesで動作しています。学習状況はブラウザのIndexedDBに保存され、サーバー側で個人別の成績を集計する仕組みはありません。</p><div class="course-links"><button class="btn compact soft" data-action="export">学習記録をJSONで出力</button><button class="btn compact danger" data-action="clear">この教材の記録をリセット</button></div><p class="tiny">${isPersistent()?'現在の保存状態：IndexedDBを利用中':'現在の保存状態：ブラウザ内の一時メモリ（永続化不可）'}</p></section></div></main>${footer()}</div>`;
}
function renderBlock(block,index,course,page){
 const hdr=block.title?`<h3>${rich(block.title)}</h3>`:'';
 if(block.type==='text')return `<section class="lesson-section">${hdr}<p>${rich(block.body)}</p></section>`;
 if(block.type==='list')return `<section class="lesson-section">${hdr}<ul class="bullet-items">${block.items.map(item=>`<li>${rich(item)}</li>`).join('')}</ul></section>`;
 if(block.type==='code')return `<section class="lesson-section">${hdr}<div class="code-card"><div class="code-bar"><span>${esc(block.lang||'text')} · 実行例</span><button type="button" data-action="copy" data-copy-id="source-${index}" aria-label="コードをコピー">コピー</button></div><pre><code id="source-${index}">${esc(block.source)}</code></pre></div>${block.caption?`<div class="code-help">${rich(block.caption)}</div>`:''}</section>`;
 if(block.type==='note')return `<section class="lesson-section"><div class="note ${block.level==='warn'?'warn':block.level==='good'?'good':''}"><strong>${rich(block.title)}</strong><div>${rich(block.body)}</div></div></section>`;
 if(block.type==='table')return `<section class="lesson-section">${hdr}<div style="overflow-x:auto"><table class="explain-table"><thead><tr>${block.headers.map(x=>`<th scope="col">${rich(x)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(r=>`<tr>${r.map(v=>`<td>${rich(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
 if(block.type==='diagram')return `<section class="lesson-section"><div class="diagram-card"><div class="diagram-title">${rich(block.title)}</div><div class="diagram-lanes">${block.nodes.map((n,i)=>`${i?'<span class="diagram-arrow" aria-hidden="true">→</span>':''}<div class="diagram-node"><strong>${rich(n[0])}</strong><span>${rich(n[1])}</span></div>`).join('')}</div>${block.footer?`<p class="diagram-note">${rich(block.footer)}</p>`:''}</div></section>`;
 if(block.type==='lab')return `<section class="lesson-section"><div class="lab-card"><div class="lab-tag">INTERACTIVE LAB · 疑似操作</div><div class="lab-header"><h4>${rich(block.title)}</h4></div><p class="lab-description">${rich(block.description)}</p><div id="lab-${block.kind}" data-lab-root="${block.kind}">${renderLab(block.kind)}</div><p class="lab-caution">※ ブラウザ内のシミュレーションです。実際のGit・Docker・pytest・MLflowコマンドは実行しません。</p></div></section>`;
 return '';
}
function scoreAsLabel(c){const n=bestQuiz(c);return n===null?'未受験':`最高 ${n}%`;}
function lesson(course,page){
 const pos=course.pages.findIndex(x=>x.id===page.id),last=pos===course.pages.length-1,done=progressFor(course),pct=Math.round(done/course.pages.length*100),completed=!!state.completed[course.id]?.[page.id];
 const side=course.pages.map((p,i)=>`<button class="${p.id===page.id?'current':''}" data-action="go" data-course="${course.id}" data-page="${p.id}" ${p.id===page.id?'aria-current="page"':''}><span class="n ${state.completed[course.id]?.[p.id]?'done':''}">${state.completed[course.id]?.[p.id]?'✓':String(i+1).padStart(2,'0')}</span><span>${esc(p.title)}</span></button>`).join('');
 const blockHtml=last?renderQuiz(course):page.blocks.map((b,i)=>renderBlock(b,i,course,page)).join('');
 const bottom=last?`<div class="lesson-bottom"><button class="btn" data-action="go" data-course="${course.id}" data-page="${course.pages[pos-1].id}">← 前のページ</button><button class="btn soft" data-action="dashboard">講座一覧に戻る ↗</button></div>`:`<div class="lesson-bottom"><button class="btn" data-action="go" data-course="${course.id}" data-page="${course.pages[Math.max(0,pos-1)].id}" ${pos===0?'disabled':''}>← 前のページ</button><button class="btn primary" data-action="complete" data-course="${course.id}" data-page="${page.id}">${completed?'次のページへ':'学習済みにして次へ'} →</button></div>`;
 return `<div class="frame">${header()}<div class="lesson-layout"><aside class="lesson-aside"><div class="eyebrow">COURSE ${course.label}</div><div class="lesson-aside-title">${esc(course.name)}</div><div class="progress" role="progressbar" aria-label="講座進捗" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div><span class="small">${done} / ${course.pages.length} ページ · ${scoreAsLabel(course)}</span><nav class="lesson-nav" aria-label="${esc(course.name)}のページ一覧">${side}</nav></aside><main class="lesson-main"><div class="crumb"><button data-action="dashboard">学習ポータル</button><span>›</span><span>${esc(course.name)}</span><span>›</span><span>${pos+1} / ${course.pages.length}</span></div><div class="mobile-lesson-menu"><label for="pageSelect" class="label">ページを選択（${done} / ${course.pages.length} 完了）</label><select id="pageSelect" data-course="${course.id}" aria-label="ページ選択">${course.pages.map((p,i)=>`<option value="${esc(p.id)}" ${p.id===page.id?'selected':''}>${String(i+1).padStart(2,'0')}. ${esc(p.title)}${state.completed[course.id]?.[p.id]?' ✓':''}</option>`).join('')}</select></div><div class="lesson-topline"><span class="pill">LESSON ${String(pos+1).padStart(2,'0')} / ${course.pages.length}</span><span class="tiny">読了目安 約${page.minutes}分 ${completed?' · ✓ 学習済み':''}</span></div><article class="lesson-surface"><div class="eyebrow">${esc(course.tagline)}</div><h1 class="lesson-title">${esc(page.title)}</h1><p class="lesson-lead">${rich(page.lead)}</p><div class="learning-goal"><span class="icon" aria-hidden="true">◉</span><div><strong>このページの到達目標</strong><p>${rich(page.goal)}</p></div></div>${blockHtml}${bottom}</article><div class="note" style="margin-top:19px"><strong>学習記録</strong><div>ページ完了・テスト結果はこの端末のブラウザに保存されます。教材内のコマンドや疑似操作は、実際の開発環境の変更を伴いません。</div></div></main></div>${footer()}</div>`;
}
function labState(kind){
 state.labs??={};
 if(!state.labs[kind]){
  state.labs[kind]=kind==='git'?{working:false,staged:false,commits:0,log:'まず「ファイルを編集」を選んでください。'}:kind==='docker'?{image:false,running:false,model:false,log:'まず「docker build」を選んでください。'}:kind==='pytest'?{log:'入力と期待値を指定し、「テストを実行」を押してください。'}:{runs:[],log:'学習率を指定してRunを追加してください。'};
 }
 return state.labs[kind];
}
function renderLab(kind){
 const s=labState(kind);
 if(kind==='git')return `<div class="lab-buttons"><button class="lab-btn" data-action="lab" data-lab="git" data-op="edit">編集する</button><button class="lab-btn" data-action="lab" data-lab="git" data-op="add" ${!s.working?'disabled':''}>git add</button><button class="lab-btn" data-action="lab" data-lab="git" data-op="commit" ${!s.staged?'disabled':''}>git commit</button><button class="lab-btn" data-action="lab" data-lab="git" data-op="reset">リセット</button></div><div class="lab-output" aria-live="polite">${esc(s.log)}\n作業中の変更：${s.working?'あり':'なし'} ／ ステージ済み：${s.staged?'あり':'なし'} ／ コミット数：${s.commits}</div>`;
 if(kind==='docker')return `<div class="lab-buttons"><button class="lab-btn" data-action="lab" data-lab="docker" data-op="build">docker build</button><button class="lab-btn" data-action="lab" data-lab="docker" data-op="run" ${!s.image||s.running?'disabled':''}>docker run</button><button class="lab-btn" data-action="lab" data-lab="docker" data-op="write" ${!s.running?'disabled':''}>モデルを保存</button><button class="lab-btn" data-action="lab" data-lab="docker" data-op="remove" ${!s.running?'disabled':''}>コンテナ削除</button><button class="lab-btn" data-action="lab" data-lab="docker" data-op="reset">リセット</button></div><div class="lab-output" aria-live="polite">${esc(s.log)}\nイメージ：${s.image?'あり':'なし'} ／ コンテナ：${s.running?'起動':'なし'} ／ ホストのmodel.pkl：${s.model?'あり':'なし'}</div>`;
 if(kind==='pytest')return `<div class="lab-buttons" style="align-items:end"><label class="small">予測数<input class="field" style="max-width:110px;margin-top:4px" type="number" data-lab-input="pred" value="20"></label><label class="small">安全在庫<input class="field" style="max-width:110px;margin-top:4px" type="number" data-lab-input="safety" value="10"></label><label class="small">現在庫<input class="field" style="max-width:110px;margin-top:4px" type="number" data-lab-input="stock" value="5"></label><label class="small">期待結果<input class="field" style="max-width:110px;margin-top:4px" type="number" data-lab-input="expected" value="25"></label><button class="lab-btn" data-action="lab" data-lab="pytest" data-op="test">▶ テスト実行</button></div><div class="lab-output" aria-live="polite">${esc(s.log)}</div>`;
 if(kind==='mlflow')return `<div class="lab-buttons" style="align-items:end"><label class="small">learning_rate<select class="field" style="width:145px;margin-top:4px" data-lab-input="lr"><option value="0.01">0.01</option><option value="0.001">0.001</option><option value="0.0001">0.0001</option></select></label><button class="lab-btn" data-action="lab" data-lab="mlflow" data-op="run">疑似Runを追加</button><button class="lab-btn" data-action="lab" data-lab="mlflow" data-op="reset">リセット</button></div><div class="lab-output" aria-live="polite">${esc(s.log)}${s.runs.length?'\n\nRun ID      学習率      Accuracy      Git\n'+s.runs.map(r=>`${r.id.padEnd(11)} ${r.lr.padEnd(11)} ${(r.acc*100).toFixed(0).padStart(3)}%          abc123`).join('\n'):''}</div>`;
 return '';
}
function renderQuiz(course){
 const attempt=latestQuiz(course);const show=attempt&&currentQuizMode[course.id]!=='retake';
 if(show){return `<section class="lesson-section"><div class="quiz-result"><div class="eyebrow">YOUR RESULT</div><strong>${attempt.score}%</strong><p>${attempt.score>=70?'合格です。講座の到達目標をひと通り確認できました。':'合格目安は70%以上です。解説を確認してから再挑戦できます。'}</p><span class="small">${esc(new Date(attempt.at).toLocaleString('ja-JP'))} · 正解 ${attempt.correct} / ${course.quiz.length} 問</span></div><div class="quiz-form">${course.quiz.map((q,i)=>`<section class="quiz-question"><div class="quiz-index">QUESTION ${String(i+1).padStart(2,'0')}</div><h3>${rich(q.prompt)}</h3>${q.choices.map((s,j)=>`<div class="quiz-option ${j===q.answer?'correct':j===attempt.answers[i]?'wrong':''}"><span>${j===q.answer?'✓':j===attempt.answers[i]?'×':'・'}</span>${rich(s)}</div>`).join('')}<p class="quiz-feedback">${attempt.answers[i]===q.answer?'正解':'不正解'} · ${rich(q.reason)}</p></section>`).join('')}</div><div class="lesson-bottom"><button class="btn" data-action="retake" data-course="${course.id}">もう一度挑戦</button><button class="btn primary" data-action="dashboard">講座一覧に戻る ↗</button></div></section>`;}
 return `<form id="quiz-form" class="quiz-form" data-course="${course.id}"><p class="note">全${course.quiz.length}問。すべての問題を回答してから「採点する」を押してください。採点結果・解説は最後にまとめて表示します。</p>${course.quiz.map((q,i)=>`<fieldset class="quiz-question" style="min-width:0"><legend class="quiz-index">QUESTION ${String(i+1).padStart(2,'0')}</legend><h3 id="question-${i}">${rich(q.prompt)}</h3>${q.choices.map((choice,j)=>`<label class="quiz-option"><input type="radio" name="q-${i}" value="${j}" aria-describedby="question-${i}"><span>${rich(choice)}</span></label>`).join('')}</fieldset>`).join('')}<button class="btn primary wide" type="submit">採点する · 回答を記録</button></form>`;
}
function showToast(message){let el=document.getElementById('toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';el.setAttribute('role','status');document.body.append(el);}el.textContent=message;el.hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>{el.hidden=true;},3600);}
function render(){stopNetwork();const r=route();document.title=r.view==='lesson'?`${r.page.title} | ${r.course.name} · Neural Daylight`:r.view==='welcome'?'Neural Daylight | 機械学習開発を学ぶ':'学習ポータル | Neural Daylight';root.innerHTML=r.view==='welcome'?welcome():r.view==='lesson'?lesson(r.course,r.page):dashboard();if(r.view==='welcome')stopNetwork=startNetwork();}
async function handleLab(button){
 const kind=button.dataset.lab,op=button.dataset.op,s=labState(kind);
 if(kind==='git'){
  if(op==='edit'){s.working=true;s.log='train.pyを変更しました。まだステージされていません。';}
  if(op==='add'){s.working=false;s.staged=true;s.log='git add → 変更をステージングへ追加しました。';}
  if(op==='commit'){s.staged=false;s.commits++;s.log=`git commit → コミット #${s.commits} を記録しました。`;}
  if(op==='reset')state.labs.git={working:false,staged:false,commits:0,log:'初期状態へ戻しました。'};
 }else if(kind==='docker'){
  if(op==='build'){s.image=true;s.log='docker build → イメージを作成しました。';}
  if(op==='run'){s.running=true;s.log='docker run → コンテナを起動しました。';}
  if(op==='write'){s.model=true;s.log='モデルを保存 → ホストにマウントしたartifacts/へmodel.pklを保存しました。';}
  if(op==='remove'){s.running=false;s.log='コンテナ削除 → コンテナは消えましたが、マウント先のモデルは残ります。';}
  if(op==='reset')state.labs.docker={image:false,running:false,model:false,log:'初期状態へ戻しました。'};
 }else if(kind==='pytest'){
  const n=name=>Number(document.querySelector(`[data-lab-input="${name}"]`)?.value);
  const value=Math.max(0,Math.trunc(n('pred')+n('safety')-n('stock'))),exp=n('expected');
  s.log=(value===exp?'PASS ✓':'FAIL ×')+`\n入力: predicted=${n('pred')}, safety=${n('safety')}, inventory=${n('stock')}\n実測値: ${value} / 期待値: ${exp}`;
 }else if(kind==='mlflow'){
  if(op==='reset')state.labs.mlflow={runs:[],log:'実験をリセットしました。'};
  if(op==='run'){
   const lr=document.querySelector('[data-lab-input="lr"]')?.value||'0.01';
   const score=lr==='0.001'?0.84:lr==='0.01'?0.72:0.79;
   const id=`DEMO-${String(s.runs.length+1).padStart(3,'0')}`;
   s.runs.push({id,lr,acc:score});s.log=`${id} を記録しました。疑似モデルのAccuracyは${Math.round(score*100)}%。\n（教材用の固定値であり、実際の機械学習は行っていません）`;
  }
 }
 await saveApp(state);await addEvent('lab-action',{kind,op});const el=document.getElementById('lab-'+kind);if(el)el.innerHTML=renderLab(kind);
}
root.addEventListener('click',async e=>{
 const target=e.target.closest('[data-action]');if(!target)return;
 const action=target.dataset.action,course=getCourse(target.dataset.course);
 if(action==='dashboard'){navigate('dashboard');return;}
 if(action==='open-course'&&course){navigate('course/'+course.id+'/'+nextPage(course).id);return;}
 if(action==='go'&&course){navigate('course/'+course.id+'/'+target.dataset.page);return;}
 if(action==='complete'&&course){state.completed[course.id]??={};state.completed[course.id][target.dataset.page]=true;await saveApp(state);await addEvent('page-completed',{course:course.id,page:target.dataset.page});const i=course.pages.findIndex(p=>p.id===target.dataset.page);const next=course.pages[i+1];next?navigate('course/'+course.id+'/'+next.id):navigate('dashboard');return;}
 if(action==='copy'){const el=document.getElementById(target.dataset.copyId);if(!el)return;try{await navigator.clipboard.writeText(el.textContent);showToast('コードをコピーしました。');}catch(err){showToast('コピーできませんでした。コードを選択してコピーしてください。');}return;}
 if(action==='lab'){await handleLab(target);return;}
 if(action==='export'){await exportLearning(state);showToast('学習記録をJSONで出力しました。');return;}
 if(action==='logout'){state.alias='';await saveApp(state);navigate('welcome');return;}
 if(action==='retake'&&course){currentQuizMode[course.id]='retake';render();window.scrollTo({top:0,behavior:'instant'});return;}
 if(action==='clear'){if(!confirm('4講座の進捗・テスト結果・疑似操作の記録をリセットしますか？（以前のPythonデモの履歴は維持します）'))return;const a=state.alias;state=await clearLearning();state.alias=a;await saveApp(state);showToast('学習状況をリセットしました。');render();return;}
});
root.addEventListener('change',e=>{const el=e.target;if(el.id==='pageSelect'){const c=getCourse(el.dataset.course);if(c)navigate('course/'+c.id+'/'+el.value);}});
root.addEventListener('submit',async e=>{
 if(e.target.id==='enter-form'){e.preventDefault();const alias=document.getElementById('learnerName').value.trim().slice(0,30)||'Learner';state.alias=alias;await saveApp(state);navigate('dashboard');return;}
 if(e.target.id==='quiz-form'){
  e.preventDefault();const c=getCourse(e.target.dataset.course);if(!c)return;
  const form=new FormData(e.target),answers=c.quiz.map((q,i)=>form.get('q-'+i));
  if(answers.some(v=>v===null)){showToast('全ての問題に回答してから採点してください。');return;}
  const parsed=answers.map(Number);const correct=c.quiz.reduce((n,q,i)=>n+(parsed[i]===q.answer?1:0),0);const score=Math.round(correct/c.quiz.length*100);
  const attempt={at:new Date().toISOString(),answers:parsed,correct,score};state.quizAttempts[c.id]??=[];state.quizAttempts[c.id].push(attempt);
  if(score>=70){state.completed[c.id]??={};state.completed[c.id].quiz=true;}
  currentQuizMode[c.id]='result';await saveApp(state);await addEvent('quiz-submitted',{course:c.id,score,correct,total:c.quiz.length});render();window.scrollTo({top:0,behavior:'instant'});showToast(score>=70?`${c.name}講座：合格！ ${score}%`:`${c.name}講座：${score}% · 解説を確認してください`);
 }
});
window.addEventListener('hashchange',()=>{render();window.scrollTo({top:0,behavior:'instant'});});
function startNetwork(){
 const canvas=document.getElementById('networkCanvas');if(!canvas)return()=>{};
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return()=>{};
 const ctx=canvas.getContext('2d');if(!ctx)return()=>{};
 let raf,active=true,frame=0,w=0,h=0,pts=[];
 function size(){const b=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);w=Math.max(1,b.width);h=Math.max(1,b.height);canvas.width=Math.ceil(w*d);canvas.height=Math.ceil(h*d);ctx.setTransform(d,0,0,d,0,0);const count=Math.min(78,Math.max(34,Math.round(w*h/17000)));pts=Array.from({length:count},(_,i)=>({x:(.05+Math.random()*.9)*w,y:(.03+Math.random()*.92)*h,z:Math.random(),phase:Math.random()*6.3,speed:Math.random()*.6+.3}));}
 size();window.addEventListener('resize',size,{passive:true});
 function paint(){if(!active)return;ctx.clearRect(0,0,w,h);const t=frame++*.003;for(let i=0;i<pts.length;i++){const p=pts[i],x=p.x+Math.sin(t*p.speed+p.phase)*14,y=p.y+Math.cos(t*.67+p.phase)*12;for(let j=i+1;j<pts.length;j++){const q=pts[j],qx=q.x+Math.sin(t*q.speed+q.phase)*14,qy=q.y+Math.cos(t*.67+q.phase)*12,dist=Math.hypot(x-qx,y-qy);if(dist<155){ctx.strokeStyle=`rgba(41,150,195,${(1-dist/155)*.12})`;ctx.lineWidth=.75;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(qx,qy);ctx.stroke();}}ctx.fillStyle=`rgba(29,149,192,${.22+p.z*.3})`;ctx.beginPath();ctx.arc(x,y,1.4+p.z*2.5,0,2*Math.PI);ctx.fill();ctx.strokeStyle=`rgba(40,164,188,${.2+p.z*.22})`;ctx.beginPath();ctx.arc(x,y,4+p.z*4+Math.sin(t*2+p.phase),0,2*Math.PI);ctx.stroke();}raf=requestAnimationFrame(paint);}paint();return()=>{active=false;cancelAnimationFrame(raf);window.removeEventListener('resize',size);};
}
(async()=>{state=await loadApp();render();if(!isPersistent())showToast('保存機能が使えないため、進捗は一時的にのみ保持されます。');})();
