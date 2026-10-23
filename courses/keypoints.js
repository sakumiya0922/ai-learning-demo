/** 1ページ・1メッセージ。結論を最初に置き、以下の解説をこの主張に結び付ける。 */
export const KEYPOINTS = {
  git: {
    goal: 'Gitの学習目標は、**変更を記録・比較・復元する仕組みを自力で説明し、操作できること**。',
    scope: '**Gitはコードの履歴を担当**。モデル・実験結果・環境情報は別の管理方法と組み合わせる。',
    'problem-overwrite': '**上書き保存だけでは過去のコードを追跡しにくい**。Gitは変更前の状態へ戻る手段を提供する。',
    'problem-team': '**ブランチは完成済みのコードを守りながら、別の改善を進めるための仕組み**。',
    'problem-ml': '**実験結果の理由を追うには、実行時点のコードを特定する必要がある**。',
    'what-is-git': '**GitはPC上で履歴を作るソフトウェア、GitHubはその履歴を共有するサービス**。',
    'repo-concept': '**リポジトリはプロジェクトの変更履歴を管理する単位**。Gitの内部情報は通常 `.git/` に保存する。',
    'three-areas-concept': '**編集・ステージング・コミットは別の段階**。`git add` と `git commit` の役割は異なる。',
    'snapshot-concept': '**コミットは、ある時点の追跡ファイル全体の状態を指す記録**。過去の状態を後から復元できる。',
    'branch-concept': '**ブランチはコミットを指す名前付きの参照**。独立したフォルダのコピーではない。',
    'remote-concept': '**ローカルとGitHubの履歴は別々**。共有するには明示的な同期操作が必要。',
    'git-internal-files': '**`.git/` 内のオブジェクトと参照情報が、Gitの履歴を成立させる**。',
    'tracked-ignored': '**Gitはファイルを追跡・未追跡・除外に分けて扱う**。新規ファイルは自動でコミットされない。',
    'git-add-mechanism': '**`git add` は実行時点のファイル内容をステージに登録する**。その後の再編集は別管理。',
    'git-commit-mechanism': '**`git commit` はBlob・Tree・Commitを通じて、保存対象と過去の履歴を結び付ける**。',
    'git-branches-head': '**新しいコミットを作ると、現在のブランチが指す先が更新される**。',
    'merge-mechanism': '**マージは別々に進んだ変更履歴を統合する操作**。履歴の状態により統合形式が変わる。',
    'recover-mechanism': '**確認・復元・取り消しは目的別にコマンドを使い分ける**。',
    'start-project': '**`git init` で練習用フォルダをリポジトリに変える**。既存プロジェクトは触らない。',
    'create-file': '**新規ファイルは作成しただけでは未追跡**。まず `git status` で状態を確認する。',
    'add-first-file': '**`git add` は「次のコミットに含める内容」を選ぶ操作**。まだ履歴は確定しない。',
    'commit-first': '**`git commit` で初めて保存時点が履歴として確定する**。`git log` で確認できる。',
    'edit-diff': '**`git diff` は変更前後の行を比較する**。コミット前のレビューに使う。',
    'staged-diff': '**`git diff` と `git diff --staged` は比較する領域が異なる**。',
    'unstage-and-restore': '**ステージ解除と作業ファイルの破棄は別操作**。変更を消す前に対象を確認する。',
    'git-log-show': '**コミットIDを指定すると、過去の変更内容とファイルの状態を確認できる**。',
    'branch-operations': '**`git switch -c` で改善用のブランチを作り、mainから分けて作業する**。',
    'branch-merge': '**確認済みの改善をmainへ統合するには `git merge` を使う**。',
    'remote-operations': '**`commit` はローカル保存、`push` はGitHubへの送信**。操作対象を混同しない。',
    'safe-restore': '**過去の参照は `show`、ファイルの復元は `restore`、取り消し履歴は `revert`**。',
    'ignore-limits': '**`.gitignore` は新たな追跡を避ける設定**。過去に保存した秘密情報は消えない。',
    'scenario-intro': '**既存機能を守るため、変更は作業ブランチから始める**。',
    'scenario-edit': '**変更 → 差分確認 → テスト → コミット** の順に進めると、検証済みの変更を残せる。',
    'scenario-run': '**1つのGitコミットから複数のMLflow Runを作成できる**。コードと実験は別の識別子で追跡する。',
    'scenario-investigate': '**精度悪化の調査は、コードの差分と学習条件の差分を切り分けることから始める**。',
    'scenario-share': '**共有するのはコミット済みの履歴**。`git push` の前に公開対象を確認する。',
    'summary-map': '**編集 → add → commit → push** が、変更をローカルの履歴から共有先へ届ける基本の流れ。',
    'summary-checklist': '**コミット前・学習前・公開前の3つの確認が、安全な開発と再現性を支える**。',
    quiz: '**Gitの仕組みと操作の判断を15問で確認する**。'
  },
  docker: {
    overview: '**Dockerのゴールは、イメージ・コンテナ・保存先の違いを理解し、環境を再現すること**。',
    why: '**コードだけでは実行環境は再現できない**。Dockerは依存関係を含む実行環境を定義する。',
    'image-container': '**イメージは実行のひな型、コンテナはそのひな型から作る実行単位**。',
    architecture: '**Docker Engineがコンテナを管理する**。通常はホスト側のカーネルを共有する。',
    dockerfile: '**Dockerfileはイメージの構築手順を記述するファイル**。',
    commands: '**buildでイメージを作成し、runでコンテナを起動する**。',
    volumes: '**コンテナを消しても残すデータは、volumeまたはバインドマウントに保存する**。',
    network: '**同じComposeネットワーク上のサービスは、サービス名を使って通信できる**。',
    compose: '**Composeは複数コンテナの構成と起動方法を1つのYAMLにまとめる**。',
    demandpilot: '**アプリ・学習処理・PostgreSQLをサービス別に分けて構成する**。',
    troubleshoot: '**コンテナの状態 → ログ → 設定の順に確認すると原因を絞れる**。',
    summary: '**Dockerは動かす環境、データの保存先、サービス間通信を分けて管理する**。',
    quiz: '**Dockerの基本構造と操作の判断を10問で確認する**。'
  },
  pytest: {
    overview: '**pytestのゴールは、実装の期待結果をテストコードで検証できること**。',
    why: '**高いモデル精度だけでは、前処理や計算コードの正しさは保証できない**。',
    types: '**テストは関数単位・連携単位・画面までの全体で確認範囲が異なる**。',
    assert: '**pytestは `assert` で期待値と実際の結果を比較する**。',
    cases: '**正常系だけでなく境界値・異常系も検証する**。',
    parametrize: '**parametrizeは同じテストを複数の入力で繰り返す機能**。',
    fixture: '**fixtureでテストに必要なデータと準備処理を共通化する**。',
    errors: '**例外が起きるべき条件もテストする**。外部依存は必要に応じて差し替える。',
    'ml-specific': '**機械学習では時系列漏洩や指標計算の妥当性を検証する**。',
    docker: '**Docker内でpytestを実行すると、アプリと同じ依存環境で検証できる**。',
    summary: '**pytestは「想定した動作」と「実際の動作」の一致を確認する**。',
    quiz: '**テスト設計とpytest操作の判断を10問で確認する**。'
  },
  mlflow: {
    overview: '**MLflowのゴールは、実験条件・精度・モデルをRunに結び付けて追跡できること**。',
    why: '**MLflowは結果の表だけでなく、条件やモデルファイルも実験単位で管理する**。',
    hierarchy: '**Experimentが実験グループ、Runが1回の実験実行**。',
    stores: '**Runの数値情報とモデルなどの実ファイルは別の保存先に置ける**。',
    logging: '**1パターンの学習を1Runとして記録する**。',
    artifacts: '**学習済みモデルと評価画像はArtifact Storeへ保存する**。',
    history: '**EpochごとのMetricを記録すると、学習途中の推移も比較できる**。',
    search: '**Run IDで過去の実験を取得できる**。条件検索から探す方法もある。',
    git: '**RunとGitコミットIDを紐づければ、学習時のコードを特定できる**。',
    local: '**SQLiteは実験情報のファイル、artifactsはモデルを保存するフォルダ**。',
    practice: '**条件を変えるたびにRunを作成し、精度とモデルを比較する**。',
    summary: '**Gitはコード、Dockerは環境、pytestは動作検証、MLflowは実験履歴を担う**。',
    quiz: '**MLflowのRun・保存先・モデル管理の理解を10問で確認する**。'
  }
};

export function withKeypoints(course) {
  const points=KEYPOINTS[course.id] ?? {};
  const pages=course.pages.map(page=>{
    const takeaway=points[page.id];
    if(!takeaway)throw new Error(`結論未設定: ${course.id}/${page.id}`);
    return {...page, takeaway};
  });
  return {...course,pages};
}
