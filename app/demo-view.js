import {TEST_CASES, allowedFiles} from './demo-state.js?v=6';
const esc=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const rich=x=>esc(x).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
const btn=(action,label,disabled=false,payload='',extra='')=>`<button type="button" class="demo-button ${extra}" data-action="demo" data-op="${action}" data-value="${esc(payload)}" ${disabled?'disabled':''}>${esc(label)}</button>`;
const pill=(text,kind='')=>`<span class="demo-badge ${kind}">${esc(text)}</span>`;
const code=value=>`<code class="demo-value"><span>window</span> = <b>${esc(value)}</b></code>`;
const card=(s,key,title,value,status,meta='')=>`<div class="demo-state-card ${s.changed.includes(key)?'just-changed':''}"><div class="demo-state-title">${title}</div>${value}<div class="demo-card-foot">${status}</div>${meta?`<small>${meta}</small>`:''}</div>`;
const grid=(cards,columns=3)=>`<div class="demo-state-grid demo-cols-${columns}">${cards.join('')}</div>`;
const arrow=label=>`<div class="demo-arrow" aria-hidden="true"><span>${esc(label)}</span><b>→</b></div>`;
function init(s){
 const phases=['mkdir','init','file','add','commit'];
 const controls=[['mkdir','フォルダを作成'],['init','git init'],['file','ファイルを作成'],['add','git add'],['commit','git commit']];
 return grid([
  card(s,'folders','作業フォルダ',`<pre class="demo-initial-tree">${s.phase<1?'（未作成）':`practice/${s.phase>=2?'\n├─ .git/':''}${s.phase>=3?'\n└─ train.py':''}`}</pre>`,pill(s.phase>=3?(s.phase>=4?'train.py：追跡対象':'train.py：未追跡'):'コードなし')),
  card(s,'index','ステージ',`<b class="demo-big-state">${s.phase>=4?'window = 7':'空'}</b>`,pill(s.phase===4?'次のコミット対象':s.phase>=5?'HEADと一致':'まだ登録なし',s.phase===4?'accent':'')),
  card(s,'history','コミット履歴',`<b class="demo-number">${s.phase>=5?'1':'0'}</b>`,pill(s.phase>=5?'main → A':'まだコミットなし'))
 ])+`<div class="demo-controls">${controls.map(([op,label])=>btn(op,label,phases[s.phase]!==op)).join('')}</div>`;
}
function staging(s,config){
 const head=s.commits.at(-1),dirty=s.work!==s.index,staged=s.index!==head.value;
 const before=s.diff==='work'?s.index:head.value,after=s.diff==='work'?s.work:s.index;
 return `<div class="demo-state-flow">${card(s,'work','作業フォルダ',code(s.work),pill(dirty?'未ステージの変更':'ステージと一致',dirty?'warn':''))}${arrow('add')}${card(s,'index','ステージ',code(s.index),pill(staged?'次のコミット対象':'HEADと一致',staged?'accent':''))}${arrow('commit')}${card(s,'history',`履歴 <span class="mini-ref">HEAD → ${esc(head.id)}</span>`,code(head.value),pill(`${s.commits.length}件のコミット`))}</div>
 <div class="demo-controls">${btn('edit','ファイルを編集')}${btn('add','git add',!dirty)}${btn('commit','git commit',!staged)}${config.extended?btn('unstage','ステージを戻す',!staged)+btn('restore','作業を戻す',!dirty):''}</div>
 ${config.diff?`<div class="demo-diff"><div class="demo-tabbar">${btn('diff-work','git diff',false,'',s.diff==='work'?'selected':'')}${btn('diff-stage','git diff --staged',false,'',s.diff==='stage'?'selected':'')}<span>${s.diff==='work'?'ステージ → 作業フォルダ':'HEAD → ステージ'}</span></div><pre>${before===after?'<span class="diff-empty">差分なし</span>':`<span class="diff-remove">− window = ${before}</span>\n<span class="diff-add">+ window = ${after}</span>`}</pre></div>`:''}`;
}
function remote(s){
 const value=id=>s.commits.find(c=>c.id===id)?.value;
 return grid([
  card(s,'local','自分のPC · main',`<b class="demo-commit-id">${esc(s.local)}</b>${code(value(s.local))}`,pill('作業ファイルもこの版')),
  card(s,'tracking','自分のPC · origin/main',`<b class="demo-commit-id">${esc(s.tracking)}</b>${code(value(s.tracking))}`,pill('最後に把握したリモートの版')),
  card(s,'remote','GitHub · main',`<b class="demo-commit-id">${esc(s.remote)}</b>${code(value(s.remote))}`,pill('リモートの実際の版'))
 ])+`<div class="demo-controls">${btn('local-commit','ローカルで編集＋commit')}${btn('push','git push')}${btn('remote-commit','別PCから更新')}${btn('fetch','git fetch')}${btn('pull','git pull --ff-only')}</div>`;
}
function branchGraph(s){
 const columns=new Map();
 s.commits.forEach(c=>columns.set(c.id, c.parents.length?Math.max(...c.parents.map(p=>columns.get(p)||0))+1:0));
 const max=Math.max(...columns.values()),width=Math.max(440,(max+1)*120);
 const pos=c=>({x:50+columns.get(c.id)*115,y:c.lane?125:45});
 let paths='',nodes='';
 for(const c of s.commits){const p=pos(c);
  for(const parent of c.parents){const a=pos(s.commits.find(n=>n.id===parent));paths+=`<path d="M${a.x} ${a.y} C${a.x+50} ${a.y} ${p.x-50} ${p.y} ${p.x} ${p.y}" class="${c.lane?'feature-edge':''}"/>`;}
  const refs=Object.entries(s.refs).filter(([,id])=>id===c.id).map(([name])=>name);
  const active=s.refs[s.current]===c.id;
  nodes+=`<g class="${active?'graph-active':''}"><circle cx="${p.x}" cy="${p.y}" r="14"/><text x="${p.x}" y="${p.y+4}" text-anchor="middle" class="node-letter">${esc(c.id)}</text><text x="${p.x}" y="${p.y+32}" text-anchor="middle">${c.value}</text>${refs.length?`<text x="${p.x}" y="${p.y-24}" text-anchor="middle" class="ref-label">${refs.map(esc).join(' / ')}</text>`:''}</g>`;
 }
 return `<div class="demo-graph"><svg viewBox="0 0 ${width} 175" role="img" aria-label="${esc(s.commits.map(c=>`${c.id}の親は${c.parents.join('・')||'なし'}`).join('。'))}">${paths}${nodes}</svg></div>`;
}
function branch(s){
 const ref=s.refs[s.current],c=s.commits.find(c=>c.id===ref);
 return `<div class="demo-branch-meta">${pill(`HEAD → ${s.current}`,'accent')}<span>作業ファイル：${code(c.value)}</span></div>${branchGraph(s)}<div class="demo-controls">${btn('create','featureを作成',!!s.refs.feature)}${btn('commit','編集＋commit',s.commits.length>=6)}${btn('switch-main','mainへ切替',s.current==='main')}${btn('switch-feature','featureへ切替',!s.refs.feature||s.current==='feature')}${btn('merge','mainへ統合',s.current!=='main'||!s.refs.feature||s.refs.feature===s.refs.main)}</div><p class="demo-small">各点はコミット、下の数値はwindowの値。操作例は未コミット変更のない状態を想定。</p>`;
}
function conflict(s){
 const graph=`<div class="demo-graph"><svg viewBox="0 0 640 170" role="img" aria-label="共通の親AからmainのBとfeatureのCへ分岐${s.phase===4?'。MはBとCを親として統合':''}"><path d="M60 80Q160 80 220 40H280"/><path d="M60 80Q160 80 220 125H280" class="feature-edge"/>${s.phase===4?'<path d="M280 40H380Q450 40 520 80"/><path d="M280 125H380Q450 125 520 80" class="feature-edge"/>':''}<circle cx="60" cy="80" r="15"/><text x="60" y="85" text-anchor="middle" class="node-letter">A</text><circle cx="280" cy="40" r="15"/><text x="280" y="45" text-anchor="middle" class="node-letter">B</text><text x="280" y="15" text-anchor="middle">main：14</text><circle cx="280" cy="125" r="15"/><text x="280" y="130" text-anchor="middle" class="node-letter">C</text><text x="280" y="160" text-anchor="middle">feature：28</text>${s.phase===4?`<g class="graph-active"><circle cx="520" cy="80" r="15"/><text x="520" y="85" text-anchor="middle" class="node-letter">M</text><text x="520" y="120" text-anchor="middle">main：${s.resolution}</text></g>`:''}</svg></div>`;
 const source=s.phase===1?'<<<<<<< HEAD\nwindow = 14\n=======\nwindow = 28\n>>>>>>> feature':`window = ${s.resolution||14}`;
 return graph+`<div class="demo-conflict-code"><div>${pill(['統合前','衝突あり','編集済み','解決を登録済み','統合完了'][s.phase],s.phase===1?'warn':'')}<span>train.py</span></div><pre>${esc(source)}</pre></div><div class="demo-controls">${btn('merge','git merge feature',s.phase!==0)}${btn('resolve-14','14を採用',s.phase<1||s.phase>=3)}${btn('resolve-28','28を採用',s.phase<1||s.phase>=3)}${btn('add','git add',s.phase!==2)}${btn('commit','git commit',s.phase!==3)}</div>`;
}
function history(s){
 const choice=s.commits.find(c=>c.id===s.selected),head=s.commits.at(-1);
 return `<div class="demo-history-rail" aria-label="確認するコミット">${s.commits.map(c=>`<button class="history-node ${c.id===s.selected?'selected':''}" type="button" data-action="demo" data-op="select" data-value="${c.id}" aria-pressed="${c.id===s.selected}"><span>${c.id}</span><small>window = ${c.value}</small>${c.id===head.id?'<b>HEAD</b>':''}</button>`).join('<span class="history-join" aria-hidden="true"></span>')}</div>${grid([
 card(s,'selection',`選択した${choice.id}（閲覧のみ）`,code(choice.value),pill('表示してもファイルは不変')),
 card(s,'work','現在の作業ファイル',code(s.work),pill(s.work===head.value?'HEADと一致':'未コミットの変更',s.work!==head.value?'warn':''))
 ],2)}<div class="demo-controls">${btn('restore','選択した版を取り出す',s.work===choice.value)}${btn('commit','add＋commitで記録',s.work===head.value)}${btn('revert','git revert C',s.commits.length!==3||s.work!==28)}</div><p class="demo-small">復元は作業ファイルを上書き。ここでは練習用の1ファイルを再現。</p>`;
}
const OBJECTS={
 commit:{label:'Commit C',sub:'履歴の接続',rows:[['tree','t1'],['parent','Commit B'],['message','学習処理を修正'],['author','教材用の作成者']]},
 tree:{label:'Tree t1',sub:'ファイル名と内容の対応',rows:[['train.py','Blob b1'],['README.md','Blob b2']]},
 blob:{label:'Blob b1',sub:'ファイルの内容',rows:[['内容','window = 14'],['含まない情報','ファイル名・作成者・親コミット']]}
};
function objects(s){
 const o=OBJECTS[s.selected];
 return `<div class="demo-inspector"><div class="inspector-choices">${Object.entries(OBJECTS).map(([id,x])=>`<button class="inspector-choice ${s.selected===id?'selected':''}" type="button" data-action="demo" data-op="select" data-value="${id}" aria-pressed="${s.selected===id}"><b>${x.label}</b><span>${x.sub}</span></button>`).join('<span class="inspector-arrow" aria-hidden="true">↓ 参照</span>')}</div><div class="inspector-detail"><h4>${o.label}</h4><dl>${o.rows.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div></div>`;
}
const FILES={
 working:{path:'train.py',type:'ファイル',description:'編集するPythonコード。保存だけではGit履歴に追加されない。',content:'window = 14\n# 作業フォルダ内の実ファイル'},
 index:{path:'.git/index',type:'ファイル',description:'次のコミットに使う内容の索引。git addで更新。',content:'train.py → 内容の参照\n形式：Git専用のバイナリ'},
 head:{path:'.git/HEAD',type:'ファイル',description:'通常は現在のブランチを参照。',content:'ref: refs/heads/main\n形式：テキスト'},
 objects:{path:'.git/objects/',type:'フォルダ',description:'ファイル内容・フォルダ構成・コミットをGitオブジェクトとして保存。',content:'Blob：内容\nTree：名前と階層\nCommit：履歴の接続'}
};
function filesystem(s){const f=FILES[s.selected];return `<div class="demo-inspector"><div class="inspector-choices file-choices"><strong>project/</strong>${Object.entries(FILES).map(([id,x])=>`<button type="button" class="inspector-choice ${id===s.selected?'selected':''}" data-action="demo" data-op="select" data-value="${id}"><b>${x.path}</b><span>${x.type}</span></button>`).join('')}</div><div class="inspector-detail"><h4>${f.path}</h4><p>${f.description}</p><pre>${esc(f.content)}</pre></div></div>`;}
function ignore(s){
 const files=[['train.py',false,false],['.env',s.rules.env,false],['data/raw.csv',s.rules.raw,false],['settings.json',s.rules.settings,true]];
 return `<div class="demo-ignore-layout"><div class="ignore-rules"><strong>.gitignore のルール</strong>${[['env','.env'],['raw','data/raw.csv'],['settings','settings.json']].map(([key,label])=>`<label><input type="checkbox" data-demo-change="toggle" data-value="${key}" ${s.rules[key]?'checked':''}><code>${label}</code></label>`).join('')}<small>settings.jsonは追跡済み・変更あり</small></div><div class="ignore-files">${files.map(([name,ignored,tracked])=>`<div><code>${name}</code>${pill(s.staged.includes(name)?'ステージ済み':tracked?'追跡済み':ignored?'除外':'未追跡',s.staged.includes(name)?'accent':ignored&&!tracked?'':'warn')}</div>`).join('')}</div></div><div class="demo-controls">${btn('add','git add .')}</div>`;
}
function experiment(s){
 const r=s.runs.find(x=>x.id===s.selected);
 return `<div class="demo-experiment-options"><label>学習率<select data-demo-change="lr"><option ${s.lr==='0.1'?'selected':''}>0.1</option><option ${s.lr==='0.01'?'selected':''}>0.01</option><option ${s.lr==='0.001'?'selected':''}>0.001</option></select></label><div><span>現在のコード</span>${pill(`Commit ${s.code<26?String.fromCharCode(65+s.code):'C'+(s.code+1)}`,'accent')}</div>${btn('run','疑似Runを追加')}${btn('code','コードを変更＋commit')}</div>
 <div class="demo-run-table"><table><thead><tr><th>Run</th><th>Gitコミット</th><th>学習率</th><th>MAE ↓</th></tr></thead><tbody>${s.runs.length?s.runs.map(r=>`<tr class="${r.id===s.selected?'selected':''}"><td><button type="button" data-action="demo" data-op="select" data-value="${r.id}" aria-label="${r.id}の詳細">${r.id}</button></td><td>${r.code}</td><td>${r.lr}</td><td>${r.mae}</td></tr>`).join(''):'<tr><td colspan="4" class="empty-row">学習率を選び、Runを追加</td></tr>'}</tbody></table></div>${r?`<div class="demo-run-detail"><b>${r.id}</b><span>コード：${r.code}</span><span>学習率：${r.lr}</span><span>モデル保存先の例：artifacts/${r.id}/model</span></div>`:''}<p class="demo-small">同一の評価条件を仮定した架空の数値。モデル本体は生成・保存しない。</p>`;
}
function docker(s){return `<label class="demo-mount"><input type="checkbox" data-demo-change="mount" ${s.mounted?'checked':''} ${s.container?'disabled':''}>ホストにマウントして保存</label>${grid([
 card(s,'image','イメージ',`<b class="demo-big-state">${s.image?'作成済み':'未作成'}</b>`,pill('Python + ライブラリ')),
 card(s,'container','コンテナ',`<b class="demo-big-state">${s.running?'起動中':s.container?'停止中':'なし'}</b>`,pill(s.inside?'内部モデルあり':'内部モデルなし',s.inside?'accent':'')),
 card(s,'file','ホストのartifacts/',`<b class="demo-big-state">${s.outside?'model.pkl':'空'}</b>`,pill('コンテナとは別の保存場所'))
 ])}<div class="demo-controls">${btn('build','docker build',s.image)}${btn('run','docker run',!s.image||s.container)}${btn('save','モデルを保存',!s.running)}${btn('stop','停止',!s.running)}${btn('remove','コンテナを削除',!s.container)}</div>`;}
function pytest(s){const c=TEST_CASES[s.case];return `<div class="demo-tabbar">${Object.entries(TEST_CASES).map(([key,v])=>btn('case',v.name,false,key,s.case===key?'selected':'')).join('')}</div><div class="demo-test-code"><div><span>補充数の計算</span>${btn('fix',s.fixed?'補正なしに戻す':'負の値を0に補正')}</div><pre>${esc(s.fixed?'max(0, ceil(predicted + safety - inventory))':'ceil(predicted + safety - inventory)')}</pre></div>${grid([
 card(s,'input','入力',`<dl class="demo-input-values"><dt>予測</dt><dd>${c.pred}</dd><dt>安全在庫</dt><dd>${c.safety}</dd><dt>現在庫</dt><dd>${c.stock}</dd></dl>`,''),
 card(s,'expect','期待値',`<b class="demo-number">${c.expected}</b>`,pill('仕様から決めた値')),
 card(s,'result','実際の値',`<b class="demo-number">${s.result?s.result.actual:'—'}</b>`,s.result?pill(s.result.pass?'PASS':'FAIL',s.result.pass?'success':'warn'):pill('未実行'))
 ])}<div class="demo-controls">${btn('run','テストを実行')}</div>`;}
const RENDERERS={init,staging,remote,branch,conflict,history,objects,filesystem,ignore,experiment,docker,pytest};
export function renderDemo(state,config){
 const view=RENDERERS[state.kind];if(!view)throw new Error(`Unknown demo view ${state.kind}`);
 return `<div class="demo-topline"><span class="demo-label"><span aria-hidden="true">▶</span> 操作デモ</span>${btn('reset','リセット',false,'','demo-reset')}</div><p class="demo-prompt">${rich(config.hint)}</p>${view(state,config)}<div class="demo-feedback" role="status" aria-live="polite">${state.command?`<code>${esc(state.command)}</code>`:''}<span>${esc(state.message)}</span></div><p class="demo-disclaimer">ブラウザ内の再現。実コマンドは実行しない。${['staging','remote','branch','conflict','history','objects'].includes(state.kind)?'コミットIDは説明用の記号。':''}</p>`;
}
