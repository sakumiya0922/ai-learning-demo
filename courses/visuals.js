/** Illustrated, explicitly authored teaching aids. Each item depicts the state or relationship discussed on that page. */
const v = (title,variant,items,caption='') => ({type:'visual',title,variant,items:items.map(([label,detail])=>({label,detail})),caption});
export const VISUALS = {
 git: {
  'scope':v('4つの技術は何を管理する？','compare', [['Git','ソースコードと変更履歴'],['Docker','プログラムが動く環境'],['pytest','処理が期待どおり動くか'],['MLflow','実験条件・精度・学習済みモデル']],'Gitですべてを保存するのではなく、役割を分担します。'),
  'problem-team':v('完成版と改善版は別の履歴を進む','branch',[['main','A → B → E（動作確認済み）'],['feature','B → C → D（モデル改善中）']],'Bの時点から別々に進み、完成後に統合できます。'),
  'repo-concept':v('PCのどこにファイルがある？','folders',[['my-project/','Gitで管理するプロジェクトのフォルダ'],['train.py','人が編集するPythonファイル'],['.git/','コミットやブランチの情報をGitが保持する隠しフォルダ']],'Gitの内部管理情報は通常、プロジェクト直下の .git フォルダに入ります。'),
  'three-areas-concept':v('ファイルが通る3つの管理領域','zones',[['作業ディレクトリ','train.pyを編集する'],['ステージングエリア','git addで保存候補を選ぶ'],['リポジトリ','git commitで履歴を確定']],'実際にはファイルを単純に「移動」するのではなく、内容のスナップショットをインデックス・Gitオブジェクトへ記録します。'),
  'snapshot-concept':v('コミットは各時点の状態を参照できる','timeline',[['コミット A','train.py: v1'],['コミット B','train.py: v2 + test.py'],['コミット C','train.py: v3 + test.py']],'変更された部分だけでなく、各時点の追跡ファイル全体を復元できます。'),
  'branch-concept':v('ブランチは別フォルダではなく参照','branch',[['main','A → B'],['feature','B → C → D']],'featureはコミットDを指す名前。mainはコミットBを指す名前です。'),
  'git-internal-files':v('目に見えるコードとGitの管理領域','folders',[['project/','プロジェクトのルート'],['src/train.py','普段編集する学習コード'],['.git/objects/','内容・ツリー・コミットをGit形式で保存'],['.git/HEAD','現在のブランチ等を参照']],' .git/ 配下はGitが管理するため、通常は手動で編集しません。'),
  'tracked-ignored':v('ファイルごとに扱いが違う','compare',[['追跡する','train.py・tests/・設定ファイル'],['追跡しない','大容量データ・モデル・秘密の.env']],' .gitignore は新規ファイルの除外判定に使われますが、追跡済みのファイルを自動解除しません。'),
  'git-add-mechanism':v('addの前後を比較','zones',[['編集した train.py','作業フォルダの最新版'],['git add train.py','現在の内容をステージに登録'],['その後に再編集','ステージには前回addした内容が残る']],'再編集分もコミットに含めたい場合は、もう一度 git add します。'),
  'git-commit-mechanism':v('コミットが参照する3種類のオブジェクト','objects',[['Blob','ファイルの中身を保持'],['Tree','ファイル名・ディレクトリ構造を保持'],['Commit','Tree・親コミット・作成者・メッセージを参照']],'コードがそのまま「train.py」という名前で .git にコピーされるわけではありません。'),
  'git-branches-head':v('HEADとブランチの関係','branch',[['HEAD','現在チェックアウトしているmainを指す'],['main','コミット Cを指す'],['feature','コミット Dを指す']],'コミットすると現在のブランチが新しいコミットを指すように動きます。'),
  'merge-mechanism':v('2つの開発履歴をまとめる','branch',[['main','A → B → E'],['feature','B → C → D'],['merge後','E + D → M（統合）']],'条件によってはマージコミットを作らずfast-forwardすることもあります。'),
  'recover-mechanism':v('「確認」「作業ファイルの復元」「取り消し」は別','compare',[['git show / diff','過去の内容を確認・比較'],['git restore','作業ファイルを指定した状態に戻す'],['git revert','変更を打ち消す新しいコミットを作る']],'操作前に対象ファイルと未コミット変更を確認します。'),
  'start-project':v('Gitを始めるフォルダの例','folders',[['forecast-project/','ここで git init を実行'],['train.py','学習コード'],['tests/test_train.py','テストコード'],['.git/','初期化後にできる履歴管理用フォルダ']]),
  'create-file':v('新しく作ったファイルはまだ未追跡','zones',[['新規作成','train.py'],['git status','Untracked files と表示'],['git add','追跡する内容としてステージ']],'ファイルを作っただけではGitは自動的にコミットしません。'),
  'add-first-file':v('初めてのgit add','zones',[['作業','train.pyにPythonを記述'],['ステージ','train.pyを登録'],['Git履歴','まだ新規コミットは存在しない']],'git addではまだコミットは作られません。'),
  'commit-first':v('初回コミットの結果','timeline',[['git add','保存する対象を指定'],['git commit','コミット Aが作られる'],['git log','AのIDとメッセージを確認']]),
  'edit-diff':v('変更点を把握してから記録','compare',[['変更前','window = 7'],['変更後','window = 14'],['git diff','変更前後の行を対比表示']],'まだステージしていない変更は通常 git diff で確認できます。'),
  'staged-diff':v('何と何を比較している？','zones',[['HEAD','最後のコミット'],['ステージ','次にコミット予定の内容'],['作業フォルダ','最後に編集した内容']],'git diff --staged はHEAD↔ステージ、git diffはステージ↔作業フォルダを比較します。'),
  'unstage-and-restore':v('2種類の「戻す」を混同しない','compare',[['git restore --staged','ステージの変更を外す（作業ファイルは維持）'],['git restore <file>','未コミットの作業ファイル変更を破棄する']],'後者は未保存の変更を失うことがあるため注意。'),
  'git-log-show':v('コミットIDから保存された内容にたどる','timeline',[['git log','A / B / Cの履歴を一覧'],['git show B','コミットBの差分を確認'],['git show B:path','B時点のファイル内容を見る']]),
  'branch-operations':v('新ブランチはmainを保ったまま進む','branch',[['main','コミット Bで待機'],['feature/model','BからC、Dへ開発'],['git switch','現在の作業対象を切り替える']]),
  'branch-merge':v('merge前後の履歴イメージ','branch',[['main','A → B'],['feature','B → C → D'],['統合後','A → B → C → D（fast-forward例）']],'変更状況によって統合方法は異なります。'),
  'remote-operations':v('ローカルとGitHubは別の保存場所','zones',[['ローカルGit','commitして履歴を保存'],['git push','GitHubへコミットを送信'],['GitHub','履歴が公開・共有される']],'pushしていないローカルコミットはGitHubに現れません。'),
  'safe-restore':v('目的ごとに安全なコマンドを選ぶ','compare',[['確認する','git show / git diff'],['ファイルを戻す','git restore --source=ID'],['共有履歴を打ち消す','git revert']]),
  'ignore-limits':v('.gitignoreは過去を消さない','timeline',[['コミット前','機密ファイルを追跡しない'],['コミット後','.gitignore追加だけでは履歴に残る'],['漏えい時','資格情報を失効・交換、履歴削除も検討']]),
  'scenario-edit':v('開発と実験の境界','flow',[['編集','features.pyを修正'],['pytest','変更による不具合を検出'],['git commit','コードの状態を確定'],['学習','確定したコードで実験']]),
  'scenario-run':v('同じコードから複数の実験','flow',[['Git ID: A','コードは同一'],['Run 001','学習率0.1 → MAE 280'],['Run 002','学習率0.01 → MAE 260']],'Git IDは同じでも、MLflowのRun IDは実験ごとに異なります。'),
  'scenario-share':v('共同開発・共有の流れ','flow',[['ローカル','変更してコミット'],['GitHub','pushで共有'],['ほかのPC','fetch / pullで取得']]),
  'summary-checklist':v('Gitで再現性を支える情報の関係','compare',[['Gitコミット','コード・実装状態'],['データ・環境','Git外も含めて管理'],['MLflow Run','学習条件と結果を紐づけ']])
 },
 docker:{
  'dockerfile':v('Dockerfileからイメージを作る','flow',[['FROM','ベースイメージ'],['COPY / RUN','必要なファイルとライブラリ'],['docker build','再利用可能なイメージ']]),
  'commands':v('ビルドと起動は別の操作','flow',[['Dockerfile','構築手順'],['docker build','イメージを作成'],['docker run','コンテナ起動']]),
  'compose':v('Composeで複数サービスを管理','compare',[['app','Python・Streamlit'],['db','PostgreSQL'],['volume','DBデータを永続化']]),
  'demandpilot':v('需要予測アプリの実行環境','flow',[['アプリ','Streamlitで画面表示'],['Python処理','LightGBMによる推論'],['PostgreSQL','販売履歴を保存']]),
  'troubleshoot':v('不具合の切り分け','flow',[['docker ps','コンテナの状態'],['docker logs','エラーを確認'],['Dockerfile / 設定','原因を修正']])
 },
 pytest:{
  'types':v('テストの大きさの違い','compare',[['単体テスト','関数ひとつの結果'],['結合テスト','複数の処理のつながり'],['E2E','利用者操作から出力まで']]),
  'assert':v('テストは期待値と実際の値を比較する','flow',[['入力','予測値20・在庫5'],['処理','補充数を計算'],['assert','期待値25との一致を確認']]),
  'cases':v('数値計算で確認すべき条件','compare',[['正常系','想定どおりの入力'],['境界値','在庫と需要が等しい'],['異常系','欠損や不正な入力']]),
  'parametrize':v('同じ関数を複数条件でテスト','flow',[['ケース1','正常な需要'],['ケース2','在庫が十分'],['ケース3','境界値']]),
  'fixture':v('fixtureはテストに準備物を渡す','flow',[['fixture','テスト用データを準備'],['test_A','データを受け取る'],['test_B','同じ準備方法を再利用']]),
  'ml-specific':v('機械学習ならではの検証','compare',[['データ漏洩','未来の情報が混入しない'],['特徴量','列・型・欠損の期待'],['評価','計算式が正しく実装される']]),
  'docker':v('Dockerとpytestを組み合わせる','flow',[['Docker','テスト用環境を用意'],['pytest','テストを実行'],['結果','PASS / FAILを確認']])
 },
 mlflow:{
  'logging':v('1回の実験で残す情報','flow',[['Parameters','学習率・木の数'],['Metrics','MAE・Accuracy'],['Artifacts','モデル・混同行列']]),
  'artifacts':v('DBとファイルの保存先を区別','compare',[['Tracking DB','Run ID・パラメータ・Metrics'],['Artifact Store','モデル本体・グラフ・設定ファイル']]),
  'history':v('学習履歴は一度の数値だけではない','flow',[['Epoch 1','Loss 0.8'],['Epoch 2','Loss 0.5'],['Epoch 3','Loss 0.3']]),
  'search':v('良いRunを選ぶ','flow',[['Run一覧','実験を検索'],['比較','精度と条件を比較'],['取得','採用Run・モデルを特定']]),
  'local':v('ローカルの保存先','folders',[['mlflow.db','RunとパラメータのSQLite DB'],['artifacts/','モデル・評価画像などの保存先'],['.git/','コード変更履歴。MLflowとは別']]),
  'practice':v('需要予測の実験サイクル','flow',[['学習','条件を変更'],['MLflow','結果をRunに記録'],['比較','評価指標から採用候補を選ぶ']])
 }
};
export function enrichWithVisuals(course){
 const byId=VISUALS[course.id]||{};
 return {...course,pages:course.pages.map(p=>{
  const visual=byId[p.id];
  if(!visual)return p;
  const blocks=p.blocks||[];
  const at=blocks.length&&blocks[0].type==='text'?1:0;
  return {...p,blocks:[...blocks.slice(0,at),visual,...blocks.slice(at)]};
 })};
}
