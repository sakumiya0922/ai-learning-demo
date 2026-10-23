import {text,code,note,table,list,diagram,lab,page,question} from './utils.js';
export const mlflowCourse={
 id:'mlflow',label:'04',name:'MLflow',tagline:'実験条件とモデルを、紐づけて残す',description:'Run・Metric・Artifact・Gitコミットをつなぎ、後から追える機械学習実験管理を学びます。',symbol:'◈',minutes:95,accent:'#8563cb',
 outcomes:['Experiment・Run・Artifactの関係を説明できる','パラメータと評価指標をコードで記録できる','Run IDから過去の情報を参照できる','Gitのコードと実験記録を追跡できる'],
 pages:[
 page('why','なぜMLflowを使う？','表形式の実験管理との違いを説明できる','CSVで学習率と精度を保存するだけならMLflowは必須ではありません。MLflowの価値は、実行条件・評価指標・モデルファイルなどを一つの実験単位としてまとめて扱えることです。',[
  table('CSV管理とMLflow',['CSVなどでも可能','MLflowで標準化できる'],[['パラメータを列に書く','Run単位でパラメータ記録'],['精度・Lossを表にまとめる','指標と履歴の記録・比較'],['モデルファイルを別途保存','Runやモデル情報と成果物を関連づける'],['GitコミットIDを別途書く','RunタグとしてコミットIDを保持']]),
  diagram('実験の管理単位',[['学習条件','Parameters'],['実行結果','Metrics'],['成果物','Model / Artifacts']],'一回の実験（Run）に結びつけて記録します。'),
  note('必要性の判断','数回の実験ならCSVでも十分です。複数モデル・多数の成果物・チーム間での共有が増えるとMLflowの価値が高まります。')
 ],6),
 page('hierarchy','ExperimentとRun','実験グループと個々の実行を区別できる','MLflowでは関連する学習をExperiment（実験グループ）でまとめ、その内部にRun（各実行）が作られます。',[
  diagram('ExperimentとRun',[['Experiment','需要予測'],['Run 001','学習率0.01'],['Run 002','学習率0.001']],'同じGitコミットでも、学習条件が異なればRunは別々になります。'),
  table('用語を整理',['用語','意味'],[['Experiment','関連するRunを束ねる単位'],['Run','1回の学習・評価処理の単位'],['Parameters','学習率・木の数などの条件'],['Metrics','精度・損失などの数値'],['Artifacts','モデル・画像・JSONなどのファイル']]),
  text('IDの区別','Run IDは実験の一回の実行を識別します。MLflow 3では、ログしたモデルはRunと別のModel IDを持つ場合があります。モデル本体の識別と実験の識別を混同しないことが大切です。')
 ],7),
 page('stores','Tracking Serverの仕組み','Backend StoreとArtifact Storeを区別できる','MLflowは実験の数値情報と、モデルなどのファイル本体を別々の場所に保存できます。ローカル運用ではSQLiteとローカルフォルダの組み合わせが分かりやすいです。',[
  diagram('データの保存先',[['Python','実験ログを送る'],['Tracking Server','Runを管理'],['DB / ファイル','メタ情報と成果物']],'実験データはTracking Server経由で保存できます。'),
  table('保存対象と場所',['保存対象','保存先の例','形式'],[['Run ID・Parameters・Metrics・Tags','`mlflow.db`','SQLiteの1ファイル'],['モデル重み・画像・補助ファイル','`artifacts/`内','`.pkl`・`.png`・YAMLなど'],['コードの変更履歴','`.git/`','Git専用のオブジェクト']]),
  code('ローカルTracking Serverを起動',`mkdir -p mlflow/artifacts\nmlflow server \\\n  --backend-store-uri sqlite:///mlflow/mlflow.db \\\n  --artifacts-destination ./mlflow/artifacts \\\n  --port 5000`,'プロジェクトのルートで実行する例です。事前にmlflowをインストールし、作業ディレクトリを確認します。'),
  note('重要','サーバーが起動していない場合に`http://localhost:5000`へ送ると接続に失敗します。保存先は設定に依存するため、他のプロジェクトでは異なる構成もあります。')
 ],8),
 page('logging','パラメータと指標を記録','start_run・log_param・log_metricの役割が分かる','Pythonの学習処理に少量の記録コードを組み込むと、学習条件と評価結果がRunに紐づけられます。',[
  code('最小のMLflow記録例',`import mlflow\n\nmlflow.set_tracking_uri("http://127.0.0.1:5000")\nmlflow.set_experiment("demand_forecast")\n\nwith mlflow.start_run():\n    mlflow.log_param("n_estimators", 100)\n    mlflow.log_metric("mae", 24.5)`,'学習済みモデルの保存は別処理です。','python'),
  text('保存タイミング','`log_param`が呼ばれた時点でパラメータが記録され、`log_metric`実行時に指標が記録されます。Run終了時には終了状態などが記録されます。モデルファイルは自動で必ず保存されるわけではありません。'),
  lab('mlflow','Runを3パターン作る','学習率を変えた疑似実験を実行し、Runごとの条件・指標・保存物を比較します。')
 ],8),
 page('artifacts','モデル・成果物を保存する','パラメータとファイル本体の保存を区別できる','学習済みモデルや混同行列などはArtifact Storeへ保存します。保存指示を書いたファイルだけが保存される点に注意します。',[
  code('画像とモデルを保存',`import mlflow\nimport mlflow.sklearn\n\nwith mlflow.start_run():\n    mlflow.log_param("max_depth", 5)\n    # 学習処理は省略\n    mlflow.log_artifact("results/confusion_matrix.png")\n    mlflow.sklearn.log_model(model, name="forecast_model")`,'`model`は学習済みのscikit-learnモデルを想定しています。MLflow 3系の書き方です。','python'),
  text('ファイル形式はモデルによる','scikit-learnではpickle系、PyTorchでは重みファイルなど、利用ライブラリに応じて保存形式が変わります。MLflowのモデル形式では`MLmodel`というメタデータも保存されます。'),
  note('コードそのものは？','GitのコミットIDを記録してソースを参照する方法が一般的です。コード一式をMLflowにも保存したいなら`mlflow.log_artifacts("src")`のように明示します。')
 ],7),
 page('history','学習曲線とMetric履歴','指標をstepとともに複数回記録できる','最終精度だけでなく、エポックごとの損失推移を保存すると、途中の学習状況を振り返れます。',[
  code('各エポックでLossを記録',`with mlflow.start_run():\n    for epoch in range(5):\n        loss = train_one_epoch(epoch)\n        mlflow.log_metric("train_loss", loss, step=epoch)`,'`train_one_epoch`は説明用の関数です。実際の学習処理に置き換えます。','python'),
  text('何が保存される？','同じMetric名でもstepやタイムスタンプが違う複数の値を記録できます。最終値だけでなく推移を比較したいときに便利です。'),
  code('Metric履歴を読み出す',`from mlflow.tracking import MlflowClient\nclient = MlflowClient()\nhistory = client.get_metric_history(run_id, "train_loss")\nfor point in history:\n    print(point.step, point.value)`,'`run_id`は実在のRun IDを指定します。','python')
 ],7),
 page('search','過去のRunを検索・取得する','Run IDによる取得と条件検索を使い分ける','Runを選んで過去の学習率やMAEを確認し、その条件を再利用できます。Run IDを手入力しなくても、条件検索で候補を一覧できます。',[
  code('Run IDからパラメータを取得する',`import mlflow\n\nrun = mlflow.get_run("実際のRun ID")\nparams = run.data.params\nmae = run.data.metrics.get("mae")\nprint(params, mae)`,'パラメータは文字列として保存されるため、再利用時には型変換が必要な場合があります。','python'),
  code('指標で上位のRunを検索',`runs = mlflow.search_runs(\n    experiment_names=["demand_forecast"],\n    order_by=["metrics.mae ASC"],\n    max_results=5,\n)\nprint(runs[["run_id", "metrics.mae"]])`,'欠損指標があるRunでは列の有無に注意します。','python'),
  note('モデルIDとの違い','MLflow 3ではログしたモデルをModel IDで識別し、Model Registryでは登録名・バージョン・エイリアスでも扱えます。Run IDは主に学習実行の記録を識別します。')
 ],8),
 page('git','GitとMLflowを紐づける','実験時のコードバージョンを記録できる','実験のRunにはGitのコミットIDを紐づけると、後からコードを確認できます。保存すべきなのは「学習を実行した実装の状態」です。',[
  diagram('識別子の役割',[['Git commit','コードの状態'],['Run ID','学習の一回'],['Model ID','保存したモデル']],'同じGitコミットから複数のRunが生まれます。'),
  code('Gitコミットを明示的に記録する',`# コンテナ起動前にホストで確認\ngit rev-parse HEAD\n\n# Pythonの実験コード内（例）\nwith mlflow.start_run():\n    mlflow.set_tag("git_commit", commit_sha)\n    # 学習と記録`,'`commit_sha`はホスト側などから渡された文字列を想定しています。','python'),
  text('Docker環境での注意','Dockerfileの`.dockerignore`に`.git`が含まれる場合、コンテナ内からGit情報を取得できません。ホストでコミットIDを取得し、環境変数としてコンテナへ渡すなどの方法が使えます。'),
  note('未コミットの変更','コミットされていないコードは、そのコミットIDからは復元できません。実験直前に変更を確定するか、差分を別途保存してください。','warn')
 ],8),
 page('local','ローカルの保存構造を理解','SQLiteファイルとArtifactsフォルダを区別できる','MLflowの管理情報がどのファイルへ保存されるかを知っておくと、バックアップとデータの復元を計画できます。',[
  table('ローカルの基本構成',['パス','種類','保存物'],[['`mlflow/mlflow.db`','SQLiteファイル','Run・Parameters・Metrics・Tags'],['`mlflow/artifacts/`','フォルダ','画像・モデル・付随ファイル'],['`.git/`','フォルダ','Gitの履歴情報']]),
  text('バックアップの考え方','SQLiteだけを残しても、外部のArtifactフォルダに置いたモデルがなければモデル本体は復元できません。逆にArtifactsだけでは、実験の検索に必要なDB情報が失われます。保存先の構成をセットで管理します。'),
  code('Gitから除外する例',`# .gitignore\nmlflow/\nartifacts/\n.env`,'実験成果物をGit管理から除外する例です。学習データは別途保存・バージョン管理が必要です。','gitignore'),
  note('SQLite以外の構成','MLflowは他のデータベースやクラウドストレージとも組み合わせられます。ここでは学習しやすいローカル構成に限定しています。')
 ],7),
 page('practice','需要予測での実践フロー','ハイパーパラメータ探索の実験記録を設計できる','同じ学習コードで木の数を変えて3回学習する場合、1パターンにつき1Runを作ると比較しやすくなります。',[
  code('複数Runの記録（概念実装）',`from sklearn.ensemble import RandomForestRegressor\nfrom sklearn.metrics import mean_absolute_error\nimport mlflow\n\nmlflow.set_experiment("demand_forecast")\nfor n in [50, 100, 200]:\n    with mlflow.start_run():\n        model = RandomForestRegressor(n_estimators=n, random_state=42)\n        model.fit(X_train, y_train)\n        pred = model.predict(X_valid)\n        mlflow.log_param("n_estimators", n)\n        mlflow.log_metric("mae", mean_absolute_error(y_valid, pred))\n        mlflow.sklearn.log_model(model, name="model")`,'`X_train`などは事前に準備したデータです。モデル保存は容量を考えて絞ることもできます。','python'),
  text('結果の判断は別問題','MAEが最小のRunを選んでも、それだけで本番適用が適切とは限りません。時系列分割、ベースライン比較、データ漏洩防止などの評価設計はMLflowとは別に考えます。'),
  note('Git＋MLflow＋Docker','Gitでコード、Dockerで環境、MLflowで実験を紐づければ、実験を後から調べるための情報を整理できます。完全再現にはデータなどの管理も必要です。')
 ],8),
 page('summary','MLflow講座のまとめ','実験管理の全体像と各保存先を整理できる','MLflowはモデル学習ライブラリではなく、実験の記録・比較とモデル管理を助けるソフトウェアです。',[
  diagram('記録の全体像',[['Git','実装コード'],['MLflow Run','条件・指標'],['Artifacts','学習済みモデル']],'必要ならModel Registryで採用モデルを管理します。'),
  list('要点の再確認',['Experimentは実験グループ、Runは1回の実行','Parametersは条件、Metricsは数値指標、Artifactsはファイル','SQLiteは管理情報、Artifact Storeはモデル等の実ファイル','Run IDで学習履歴を取得できる','GitコミットIDでコードの状態へ戻れるが未コミット変更には注意する']),
  note('次のページ','最後に10問の理解度テストを実施します。','good')
 ],4),
 page('quiz','MLflowの理解度テスト','実験管理の基本概念と操作を判断できる','全10問の確認テストです。回答後に採点結果と解説を表示します。合格目安は70%以上です。',[],8)
 ],
 quiz:[
 question('MLflowの主な役割は？',['モデル学習の実行環境そのもの','実験・モデルの記録管理','Gitのコミットを作る'],1,'MLflowは実験とモデルの管理を支援します。'),
 question('Runとは？',['1回の学習・評価実行','Pythonのバージョン','Gitのブランチ'],0,'Runは一度の実験処理を表します。'),
 question('学習率などを記録するAPIは？',['mlflow.log_param','mlflow.log_metric','git add'],0,'log_paramは実験のパラメータを記録します。'),
 question('MAEなどの数値を記録するAPIは？',['mlflow.log_metric','mlflow.log_artifact','docker run'],0,'log_metricは評価指標などの数値を記録します。'),
 question('モデル画像などの実ファイルはどこへ保存？',['Artifact Store','必ずGitのobjects','必ずSQLiteのテーブル'],0,'成果物ファイルは通常Artifact Storeへ保存します。'),
 question('SQLiteのmlflow.dbに主に保存するのは？',['実験管理のメタ情報','学習済み画像データ全件','Dockerイメージ'],0,'Run、パラメータ、Metric、タグなどを保存します。'),
 question('同じGitコミットで学習率を変えて3回実行したら？',['同じRun IDに上書きされる','通常は3つのRunとして記録','GitコミットIDが3つ必要'],1,'Runは個々の実行単位です。'),
 question('Run IDを知っていると何ができる？',['過去の実験条件を取得できる','GitHubの認証を突破できる','GPUの性能を必ず上げられる'],0,'get_runで条件や指標を参照できます。'),
 question('Dockerで.gitをイメージに含めない場合、コミットIDをどう記録する？',['ホストから環境変数などで渡す','必ず自動取得される','記録不可能'],0,'ホストで取得してタグとして渡す方法があります。'),
 question('MLflowさえあれば完全な学習再現が保証される？',['保証される','データ・コード・環境などの管理も必要','Gitは使えなくなる'],1,'MLflowは管理を支援しますが再現性は記録・環境管理の設計次第です。')
 ]
};
