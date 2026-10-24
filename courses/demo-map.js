/** Context-specific demos. Existing page IDs and all written explanations remain intact. */
const d=(kind,title,hint,options={})=>({kind,title,hint,...options});
const init=d('init','初回コミットまでを再現','**フォルダ作成・git init・ファイル作成・add・commit**で変わる保存状態を確認。');
const staging=d('staging','編集・記録の前後を比較','**3つの内容を比較**しながら、編集 → add → commitを実行。');
const remote=d('remote','PCとGitHubの履歴を比較','**commitとpushは別操作。** 送信・取得の前後で、3つの参照を比較。');
const branch=d('branch','ブランチとHEADを動かす','featureで変更を記録し、mainへ切り替えて**作業ファイルの内容**を比較。');
const history=d('history','過去の内容を選んで比較','**表示・復元・記録**を別々に実行。どの操作が作業ファイルを変えるか確認。');
const objects=d('objects','Commit・Tree・Blobをたどる','オブジェクトを選択し、**保存内容と参照先**を確認。');
const files=d('filesystem','保存場所を選んで確認','ファイル名を選択し、**コード本体とGitの管理情報**を区別。');
const ignore=d('ignore','除外ルールの効果を比較','ルールを変更してgit add . を実行。**追跡済みファイルには除外が効かない**点を確認。');
const runs=d('experiment','コードの版とRunを比較','条件だけを変更した場合と、コードを変更した場合の**コミットID・Run ID**を比較。');
const docker=d('docker','起動・保存・削除を体験','マウントの有無を切り替え、**コンテナ削除後に残るデータ**を比較。');
const pytest=d('pytest','不具合をテストで見つける','通常・境界値・小数のケースを実行。**同じ実装でも入力によって結果が変化。**');
const map={
 git:{
  'problem-overwrite':history,'problem-team':branch,'problem-ml':runs,'what-is-git':remote,
  'repo-concept':files,'three-areas-concept':staging,'three-areas-concept-continue-1':staging,
  'snapshot-concept':history,'branch-concept':branch,'remote-concept':remote,
  'git-internal-files':files,'tracked-ignored':ignore,
  'git-add-mechanism':{...staging,title:'add後に再編集した場合を比較',hint:'編集 → add → **もう一度編集** → commitの順に実行。最後の編集が自動保存されない点を確認。',diff:true},
  'git-commit-mechanism':objects,'git-branches-head':branch,
  'merge-mechanism':{...branch,title:'mainを早送りして統合',hint:'featureでcommit → mainへ切替 → 統合。**新しいマージコミットを作らずmainが移動。**'},
  'recover-mechanism':history,
  'start-project':init,'create-file':init,'add-first-file':init,'commit-first':init,
  'edit-diff':{...staging,diff:true,title:'変更前後をdiffで比較'},
  'staged-diff':{...staging,diff:true,title:'2種類のdiffを切り替える'},
  'unstage-and-restore':{...staging,diff:true,extended:true,title:'ステージと作業ファイルを別々に戻す'},
  'git-log-show':history,'branch-operations':branch,
  'branch-merge':d('conflict','コンフリクトを解決して統合','**統合 → 衝突箇所の編集 → add → commit**の順に進め、2つの親を持つ履歴を作成。'),
  'remote-operations':remote,'remote-operations-continue-1':remote,'safe-restore':history,
  'ignore-limits':ignore,'scenario-intro':branch,'scenario-edit':staging,
  'scenario-run':runs,'scenario-investigate':history,'scenario-share':remote,'summary-map':{...staging,diff:true,extended:true}
 },
 docker:{'image-container':docker,commands:docker,volumes:docker},
 pytest:{'assert-continue-1':pytest,cases:pytest,parametrize:pytest},
 mlflow:{hierarchy:runs,logging:runs,search:runs,git:runs,practice:runs}
};
export function demoFor(courseId,pageId){return map[courseId]?.[pageId]||null;}
export const DEMO_MAP=map;
