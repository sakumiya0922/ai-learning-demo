/** Pure state machines for teaching. No Git/Python/OS command is executed. */
export const DEMO_SCHEMA = 1;
const copy = value => JSON.parse(JSON.stringify(value));
const commitId = n => n < 26 ? String.fromCharCode(65 + n) : `C${n + 1}`;
const snapshot = (s, id) => s.commits.find(c => c.id === id);
export function ancestor(s, older, newer) {
  if (older === newer) return true;
  const seen = new Set(), pending = [newer];
  while (pending.length) {
    const id = pending.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    for (const p of snapshot(s,id)?.parents || []) {
      if (p === older) return true;
      pending.push(p);
    }
  }
  return false;
}
export function createDemo(kind) {
  const common = {kind, schema:DEMO_SCHEMA, count:0, command:'', message:'', changed:[]};
  const initial = {
    init: {phase:0,message:'練習用フォルダの作成から、初回コミットまでを再現。'},
    staging: {work:7, index:7, commits:[{id:'A',value:7}], diff:'work', message:'「ファイルを編集」→「git add」→「git commit」の順に選択。'},
    remote: {local:'A', tracking:'A', remote:'A', commits:[{id:'A',value:7,parents:[]}], message:'ローカルでコミットしても、GitHub側の履歴は未更新。'},
    branch: {current:'main', refs:{main:'B'}, commits:[{id:'A',value:7,parents:[],lane:0},{id:'B',value:14,parents:['A'],lane:0}], message:'改善用ブランチを作成し、mainと別の履歴を進める。'},
    conflict: {phase:0, resolution:null, message:'同じ行をmainでは14、featureでは28に変更済み。'},
    history: {work:28, selected:'B', commits:[{id:'A',value:7},{id:'B',value:14},{id:'C',value:28}], message:'コミットを選択して、当時の内容を表示。作業ファイルは変化しない。'},
    objects: {selected:'commit', message:'Commit → Tree → Blobを選択し、参照先を確認。'},
    filesystem: {selected:'working', message:'フォルダ・ファイルを選択し、保存内容を確認。'},
    ignore: {rules:{env:true,raw:true,settings:true}, staged:[], message:'除外ルールを切り替え、git add . の対象を確認。'},
    experiment: {code:0,lr:'0.01',runs:[],selected:null,message:'学習条件だけを変えてRunを追加。Gitコミットとの対応を比較。'},
    docker: {image:false, container:false, running:false, mounted:true, inside:false, outside:false, message:'イメージを作成してからコンテナを起動。'},
    pytest: {case:'normal',fixed:false,result:null,message:'境界値のケースを選び、テスト結果を比較。'}
  };
  if (!initial[kind]) throw new Error(`Unknown demo: ${kind}`);
  return {...common, ...initial[kind]};
}
export const TEST_CASES = {
  normal:{name:'通常の補充',pred:20,safety:10,stock:5,expected:25},
  boundary:{name:'在庫が十分',pred:5,safety:2,stock:40,expected:0},
  fraction:{name:'小数の予測',pred:20.2,safety:10,stock:5,expected:26}
};
export function allowedFiles(s) {
  return ['train.py', ...(!s.rules.env?['.env']:[]), ...(!s.rules.raw?['data/raw.csv']:[]), 'settings.json'];
}
function update(s, command, message, changed=[]) {Object.assign(s,{command,message,changed});}
/** Reducer returns a new state. Invalid actions never corrupt the current state. */
export function stepDemo(previous, action, payload='') {
  if (!previous || previous.schema!==DEMO_SCHEMA) throw new Error('Unsupported demo state');
  if (action==='reset') return createDemo(previous.kind);
  const s=copy(previous); s.count++; s.changed=[];
  switch(s.kind) {
    case 'init': {
      const sequence=['mkdir','init','file','add','commit'];
      const commands=['mkdir practice','git init -b main','train.pyを作成','git add train.py','git commit -m "Initial commit"'];
      const messages=['空の作業フォルダを作成。Gitの管理情報はまだ存在しない。','.gitフォルダを作成。コミットは0件。mainは最初のコミット前。','ファイルを保存。新規ファイルはまだ未追跡。','ファイルをステージへ登録。コミットはまだ0件。','コミットAを作成。mainがAを参照し、初めて履歴が確定。'];
      if(sequence[s.phase]===action){update(s,commands[s.phase],messages[s.phase],['folders','index','history']);s.phase++;}
      break;
    }
    case 'staging': {
      const head=s.commits.at(-1).value;
      if(action==='edit') {
        s.work=s.work===7?14:s.work===14?28:7;
        update(s,'ファイルを編集',`作業ファイルだけを window = ${s.work} に変更。ステージと履歴は維持。`,['work']);
      } else if(action==='add') {
        s.index=s.work; update(s,'git add train.py',`現在の内容（${s.work}）をステージへ記録。作業ファイルはそのまま残る。`,['index']);
      } else if(action==='commit') {
        if(s.index===head){update(s,'git commit','ステージに差分なし。新しいコミットは作成しない。');break;}
        s.commits.push({id:commitId(s.commits.length),value:s.index});
        update(s,'git commit -m "Update window"',`コミット${s.commits.at(-1).id}に window = ${s.index} を保存。${s.work!==s.index?'add後の再編集分は未コミット。':'3領域の内容が一致。'}`,['history']);
      } else if(action==='unstage') {
        s.index=head;update(s,'git restore --staged train.py','ステージをHEADの内容へ復元。作業ファイルの編集内容は維持。',['index']);
      } else if(action==='restore') {
        s.work=s.index;update(s,'git restore train.py','作業ファイルをステージの内容へ復元。未ステージの変更は破棄。',['work']);
      } else if(action==='diff-work'||action==='diff-stage') {
        s.diff=action==='diff-work'?'work':'stage';
        update(s,s.diff==='work'?'git diff':'git diff --staged',s.diff==='work'?'ステージと作業ファイルの差分を表示。':'HEADとステージの差分を表示。');
      }
      break;
    }
    case 'remote': {
      if(action==='local-commit'||action==='remote-commit') {
        const field=action==='local-commit'?'local':'remote',parent=s[field],id=commitId(s.commits.length);
        s.commits.push({id,value:snapshot(s,parent).value+7,parents:[parent]});s[field]=id;
        update(s,field==='local'?'編集 + git add + git commit':'別PCからGitHubへpush',field==='local'?`ローカルに${id}を作成。GitHubとorigin/mainは未更新。`:`GitHub側が${id}へ更新。自分のPCはまだ取得していない。`,[field]);
      } else if(action==='push') {
        if(!ancestor(s,s.remote,s.local)){update(s,'git push origin main','送信拒否：GitHub側に未取得の変更。履歴を上書きせず停止。');break;}
        s.remote=s.local;s.tracking=s.local;
        update(s,'git push origin main','GitHubのmainとローカルのorigin/mainを更新。',['remote','tracking']);
      } else if(action==='fetch') {
        s.tracking=s.remote;update(s,'git fetch origin','origin/mainを更新。ローカルmain・作業ファイルは変更しない。',['tracking']);
      } else if(action==='pull') {
        s.tracking=s.remote;
        if(ancestor(s,s.local,s.remote)) {s.local=s.remote;update(s,'git pull --ff-only origin main','取得後、mainを早送り。作業ファイルも取得した版に更新。',['tracking','local']);}
        else if(ancestor(s,s.remote,s.local)) update(s,'git pull --ff-only origin main','リモートはローカルの祖先。取り込む更新なし。',['tracking']);
        else update(s,'git pull --ff-only origin main','双方で履歴が分岐。取得のみ実施し、早送りできないため統合を停止。',['tracking']);
      }
      break;
    }
    case 'branch': {
      if(action==='create'&&!s.refs.feature) {s.refs.feature=s.refs[s.current];s.current='feature';update(s,'git switch -c feature','同じコミットからfeatureを作成。HEADはfeatureを参照。',['refs']);}
      else if(action==='commit') {
        const parent=s.refs[s.current],id=commitId(s.commits.length);
        s.commits.push({id,value:snapshot(s,parent).value+7,parents:[parent],lane:s.current==='feature'?1:0});
        s.refs[s.current]=id;update(s,'編集 + git add + git commit',`${s.current}だけが${id}へ移動。もう一方の参照は維持。`,['refs']);
      } else if(action==='switch-main'||action==='switch-feature') {
        const branch=action==='switch-main'?'main':'feature';if(!s.refs[branch])break;
        s.current=branch;update(s,`git switch ${branch}`,`HEADを${branch}へ切り替え。作業ファイルは${s.refs[branch]}の内容。`,['work','refs']);
      } else if(action==='merge'&&s.current==='main'&&s.refs.feature) {
        if(ancestor(s,s.refs.main,s.refs.feature)){s.refs.main=s.refs.feature;update(s,'git merge --ff-only feature','mainをfeatureの先端へ移動。マージコミットは作成しない。',['refs']);}
        else update(s,'git merge --ff-only feature','履歴が分岐しているため早送り不可。別の統合方法が必要。');
      }
      break;
    }
    case 'conflict': {
      if(action==='merge'&&s.phase===0){s.phase=1;update(s,'git merge feature','同じ行の変更が衝突。Gitが自動で決められず、統合を一時停止。',['work']);}
      else if(action==='resolve-14'||action==='resolve-28') {
        if(s.phase<1||s.phase>=3)break;
        s.resolution=action==='resolve-14'?14:28;s.phase=2;
        update(s,'衝突箇所を編集',`window = ${s.resolution} を採用し、衝突マーカーを削除。まだ解決済みの登録は未実施。`,['work']);
      } else if(action==='add'&&s.phase===2){s.phase=3;update(s,'git add train.py','編集後の内容をステージし、このファイルの衝突解決を登録。',['index']);}
      else if(action==='commit'&&s.phase===3){s.phase=4;update(s,'git commit','BとCの2つを親に持つマージコミットMを作成。',['history']);}
      break;
    }
    case 'history': {
      if(action==='select'&&snapshot(s,payload)){s.selected=payload;update(s,`git show ${payload}:train.py`,'過去の内容を表示するだけ。作業ファイルと履歴は維持。',['selection']);}
      else if(action==='restore'){s.work=snapshot(s,s.selected).value;update(s,`git restore --source=${s.selected} -- train.py`,`作業ファイルを${s.selected}の内容へ復元。HEADと過去の履歴は維持。`,['work']);}
      else if(action==='commit'&&s.work!==s.commits.at(-1).value){s.commits.push({id:commitId(s.commits.length),value:s.work});update(s,'git add train.py + git commit','復元内容を新しいコミットとして記録。過去のコミットは削除しない。',['history']);}
      else if(action==='revert'&&s.commits.length===3&&s.work===28){s.work=14;s.commits.push({id:'D',value:14});update(s,'git revert C','Cの変更（14→28）を打ち消すDを追加。C自体は履歴に残る。',['history','work']);}
      break;
    }
    case 'objects':
      if(action==='select'&&['commit','tree','blob'].includes(payload)){s.selected=payload;update(s,`git cat-file -p <${payload}のID>`,'選択したオブジェクトの内容を表示。IDは教材用の記号。',['selection']);}break;
    case 'filesystem':
      if(action==='select'&&['working','index','head','objects'].includes(payload)){s.selected=payload;update(s,'保存場所を選択','選択したファイル・フォルダの役割を表示。',['selection']);}break;
    case 'ignore':
      if(action==='toggle'&&Object.hasOwn(s.rules,payload)){s.rules[payload]=!s.rules[payload];update(s,'.gitignoreを編集','ルールを変更。すでに追跡しているsettings.jsonは除外されない。');}
      else if(action==='add'){s.staged=[...new Set([...s.staged,...allowedFiles(s)])];update(s,'git add .','未追跡かつ除外対象のファイルだけをスキップ。追跡済みファイルの変更は記録。',['index']);}break;
    case 'experiment':
      if(action==='lr'&&['0.1','0.01','0.001'].includes(payload)){s.lr=payload;update(s,'学習率を選択','学習条件のみ変更。コードのコミットIDは維持。');}
      else if(action==='code'){s.code++;update(s,'コード変更 + git commit',`コードの版を${commitId(s.code)}へ更新。過去のRunは維持。`);}
      else if(action==='run') {
        const id=`R-${String(s.runs.length+1).padStart(3,'0')}`;
        s.runs.push({id,code:commitId(s.code),lr:s.lr,mae:({'0.1':280,'0.01':260,'0.001':275})[s.lr]+s.code*3});s.selected=id;
        update(s,'mlflow.start_run() → 記録',`${id}を追加。数値とモデル情報は説明用の固定値。実際の学習・モデル保存は未実行。`,['runs']);
      } else if(action==='select'&&s.runs.some(r=>r.id===payload)){s.selected=payload;update(s,'Runを選択','選択した実験の学習条件とコードの版を表示。',['selection']);}break;
    case 'docker':
      if(action==='mount'&&!s.container){s.mounted=!s.mounted;update(s,'保存設定を切り替え','マウントあり：ホストの成果物を利用。マウントなし：コンテナ内だけに保存。');}
      else if(action==='build'){s.image=true;update(s,'docker build -t demo .','イメージを作成。コンテナはまだ起動していない。',['image']);}
      else if(action==='run'&&s.image&&!s.container){s.container=true;s.running=true;update(s,s.mounted?'docker run -d -v ./artifacts:/out demo':'docker run -d demo','イメージから新しいコンテナを起動。',['container']);}
      else if(action==='save'&&s.running){if(s.mounted)s.outside=true;else s.inside=true;update(s,'/out/model.pklを保存',s.mounted?'ホストのartifacts/に保存。':'コンテナの書き込み領域に保存。',['file']);}
      else if(action==='stop'&&s.running){s.running=false;update(s,'docker stop demo','実行を停止。コンテナと保存データは残る。',['container']);}
      else if(action==='remove'&&s.container){s.running=false;s.container=false;s.inside=false;update(s,'docker rm -f demo','コンテナ内だけのデータを削除。イメージとホスト側データは残る。',['container','file']);}break;
    case 'pytest':
      if(action==='case'&&TEST_CASES[payload]){s.case=payload;s.result=null;update(s,'テストケースを選択','入力と期待値を切り替え。');}
      else if(action==='fix'){s.fixed=!s.fixed;s.result=null;update(s,'実装を切り替え',s.fixed?'負の補充数を0に補正。':'負の補充数を補正しない実装。');}
      else if(action==='run') {const c=TEST_CASES[s.case],raw=Math.ceil(c.pred+c.safety-c.stock),actual=s.fixed?Math.max(0,raw):raw;s.result={actual,expected:c.expected,pass:actual===c.expected};update(s,'assert actual == expected',s.result.pass?'期待値と一致。':'期待値と不一致。テスト失敗の原因を実装と照合。',['result']);}break;
    default: throw new Error('Unknown demo kind');
  }
  return s;
}
