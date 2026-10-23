import {text,code,note,table,list,diagram,lab,page,question} from './utils.js';
export const dockerCourse={
 id:'docker',label:'02',name:'Docker',tagline:'実行環境ごと、同じ動きを再現する',description:'Dockerfile・イメージ・コンテナ・Composeを通じて、PythonとDBの実行環境を構築する仕組みを学びます。',symbol:'▣',minutes:90,accent:'#1592c0',
 outcomes:['イメージとコンテナを区別できる','Dockerfileからアプリのイメージをビルドできる','volumeによるデータ永続化の必要性を説明できる','ComposeでPythonとPostgreSQLを組み合わせられる'],
 pages:[
 page('why','なぜDockerを使う？','実行環境の違いが生む問題とDockerの役割を説明できる','同じ`train.py`でも、Pythonやライブラリのバージョンが異なると動作結果が変わることがあります。Dockerは実行環境をコンテナとして再現しやすくするツールです。',[
  text('コードだけを共有しても足りない','LightGBMを使うにはPython、NumPy、scikit-learn、OS側のライブラリなどが必要です。コードと一緒に必要な実行環境の定義を配布することで、環境構築を標準化できます。'),
  diagram('実行環境をコードで定義',[['コード','train.py'],['Dockerfile','環境の作り方'],['コンテナ','統一した環境で実行']],'OSカーネル自体はホストのものを利用します。'),
  note('venvとの関係','venvはPython環境の分離に向きます。DockerはOSユーザー空間やシステム依存ライブラリも含めてまとめられます。')
 ],6),
 page('image-container','イメージとコンテナ','イメージとコンテナの違いを説明できる','**イメージ**はアプリを実行するための読み取り専用レイヤーを含むテンプレート、**コンテナ**はそこから生成して動かす実行単位です。',[
  diagram('1つのイメージから複数のコンテナ',[['Dockerfile','定義ファイル'],['Image','実行環境のひな型'],['Container','起動中の実体']],'同じイメージから別々のコンテナを起動できます。'),
  table('違いを整理',['イメージ','コンテナ'],[['ビルドした成果物','イメージを元に実行される'],['ファイル層を共有できる','書き込み可能な層を持つ'],['docker image ls で確認','docker ps -a で確認']]),
  lab('docker','ビルドと起動を試す','疑似Docker環境でイメージ作成からコンテナ起動までを体験します。')
 ],8),
 page('architecture','Dockerの基本構造','Docker EngineとホストOSの役割が分かる','Docker CLIで`docker run`を実行すると、Docker Engineがイメージを利用してコンテナを作成します。Dockerは通常、仮想マシンのようにゲストOSカーネルを丸ごと起動しません。',[
  diagram('構造を簡略化',[['Docker CLI','操作コマンド'],['Docker Engine','コンテナを管理'],['Host Kernel','カーネルを共有']],'MacではDocker DesktopがLinux仮想マシンを利用してLinuxコンテナを動かします。'),
  text('MacとLinuxの違い','DockerはLinuxのカーネル機能を活用します。MacやWindowsでLinuxコンテナを動かす場合、Docker Desktopなどが背後でLinux環境を用意します。'),
  note('学習の範囲','この教材ではDocker Engineの内部実装までは扱わず、使い始めるために必要なイメージ・コンテナ・Compose・volumeに集中します。')
 ],6),
 page('dockerfile','Dockerfileを読む・書く','FROM、WORKDIR、COPY、RUN、CMDの役割が分かる','Dockerfileはイメージの作り方を記述するテキストファイルです。上から順に命令を適用し、ビルド時の処理と起動時の処理を分けて定義します。',[
  code('PythonアプリのDockerfile',`FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY src/ ./src/\nCMD ["python", "src/train.py"]`,'`RUN`はビルド時、`CMD`はコンテナ起動時の既定コマンドを定義します。','dockerfile'),
  table('主要命令の意味',['命令','役割'],[['FROM','元となるベースイメージ'],['WORKDIR','以後の作業ディレクトリ'],['COPY','ホストのファイルをイメージ内へコピー'],['RUN','イメージ作成中にコマンドを実行'],['CMD','起動時の既定コマンド']]),
  note('ビルドの効率','依存関係ファイルだけを先にCOPYし、ライブラリをインストールすると、ソースだけ変更したときにビルドキャッシュを利用しやすくなります。')
 ],8),
 page('commands','ビルド・起動・ログ確認','基本的なDockerコマンドを使い分ける','Dockerfileからイメージを作り、コンテナを起動してログを確認するのが基本的な操作です。',[
  code('最小の操作例',`docker build -t ml-demo:local .\ndocker run --name ml-demo --rm ml-demo:local\ndocker ps -a\ndocker image ls`,'`--rm`を指定したコンテナは停止後に自動削除されます。'),
  code('常駐コンテナの調査',`docker logs my-container\ndocker exec -it my-container sh\ndocker stop my-container`,'`exec`は起動中のコンテナ内でコマンドを実行します。'),
  text('何が保存される？','イメージはDockerのイメージストア、コンテナの書き込み層はDockerの管理領域に置かれます。コンテナを削除すると、書き込み層のデータも通常は失われます。')
 ],7),
 page('volumes','データをコンテナ外に残す','volumeとバインドマウントを区別できる','PostgreSQLのデータや学習済みモデルをコンテナ内だけに置くと、コンテナ削除時に失うおそれがあります。データを永続化するにはvolumeやバインドマウントを使います。',[
  diagram('コンテナと保存先',[['コンテナ','計算処理'],['マウント','保存先を接続'],['ホスト / volume','コンテナ外に保持']],'コンテナの寿命とデータの寿命を分けられます。'),
  table('2つの保存方法',['バインドマウント','名前付きvolume'],[['`./artifacts:/app/artifacts`','`postgres_data:/var/lib/postgresql/data`'],['ホストの指定フォルダを利用','Dockerが保存先を管理'],['モデルやCSVの確認に便利','DBデータの永続化に便利']]),
  code('バインドマウントの例',`docker run --rm -v "$(pwd)/artifacts:/app/artifacts" ml-demo:local`,'出力モデルがコンテナからホストの`artifacts/`に保存されます。'),
  note('注意','`docker compose down -v`はvolumeを削除するため、DBのデータを消す可能性があります。通常の停止では`-v`を付けません。','warn')
 ],8),
 page('network','コンテナ間の通信','Compose内のサービス名とlocalhostの違いが分かる','複数コンテナを組み合わせる場合、サービス間で通信できることが必要です。Composeの同じネットワークに属するコンテナは、通常サービス名で相互に名前解決できます。',[
  diagram('PythonとPostgreSQL',[['pipeline','Pythonプロセス'],['db:5432','サービス名で接続'],['PostgreSQL','DBコンテナ']],'pipeline内のlocalhostはpipeline自身。DBへは通常`db`を利用します。'),
  code('Pythonの接続設定例',`POSTGRES_HOST=db\nPOSTGRES_PORT=5432`,'この設定は同じComposeネットワーク上のPythonコンテナ内から使う値です。','env'),
  note('ポート公開','`ports`はホストPCからコンテナへアクセスする設定です。コンテナ同士の通信には必ずしもホストへのポート公開は必要ありません。')
 ],6),
 page('compose','Docker Composeでまとめて管理','compose.yamlとサービス・volumeの役割を理解する','Docker Composeは複数のサービスをYAMLファイルで定義し、まとめて起動・停止する仕組みです。Python処理とPostgreSQLを別サービスにする構成で便利です。',[
  code('compose.yamlの簡単な例',`services:\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: local_only\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n  app:\n    build: .\n    depends_on:\n      - db\n    ports:\n      - "127.0.0.1:8501:8501"\nvolumes:\n  pgdata:`,'パスワードはローカル説明用です。本番環境では秘密情報管理が必要です。','yaml'),
  code('複数サービスを操作',`docker compose build\ndocker compose up -d db\ndocker compose up -d app\ndocker compose ps\ndocker compose logs --tail=100 app\ndocker compose down`,'downでは通常、名前付きvolumeは削除されません。'),
  note('depends_onの意味','単純な`depends_on`は起動順を制御しますが、DBの準備完了まで待つとは限りません。healthcheckとconditionを使う構成もあります。')
 ],8),
 page('demandpilot','DemandPilotの構成を読む','実際のCompose構成で各要素が果たす役割を説明できる','DemandPilotでは`db`がPostgreSQL、`pipeline`がデータ処理・学習、`app`がStreamlitです。各処理は同じPythonイメージを共有できます。',[
  table('サービスと役割',['サービス','何をする？','保存先'],[['db','商品・取引・日次販売のSQL管理','名前付き `postgres_data` volume'],['pipeline','データ取得・前処理・学習・評価','ホストの `data/`・`artifacts/`'],['app','モデルとDBを読み、画面表示','読み込み対象は共通の保存領域']]),
  code('DemandPilotでの操作',`docker compose build\ndocker compose up -d db\ndocker compose run --rm pipeline prepare-data\ndocker compose run --rm pipeline train\ndocker compose run --rm --entrypoint pytest pipeline -q\ndocker compose up -d app`,'DemandPilotの公開READMEに基づく操作例です。実際には初回にDB初期化も行います。'),
  text('なぜ環境を分ける？','データベース、学習処理、Web画面は役割や稼働時間が異なります。サービスを分ければ学習処理が終わってもDBや画面を継続させられます。')
 ],8),
 page('troubleshoot','よくある問題の切り分け','ログ・状態・再ビルドの使い分けを理解する','「起動しない」「変更が反映されない」「DBに接続できない」などの原因を、コンテナの状態とログから順番に調べます。',[
  table('症状と確認場所',['症状','確認'],[['Dockerに接続できない','Docker Desktopが起動しているか'],['アプリが止まる','`docker compose logs app`'],['コード変更が反映されない','イメージ再ビルドの要否'],['DBに接続できない','`db`サービス・認証情報・healthcheck'],['学習済みモデルが消えた','volume／バインドマウントの有無']]),
  code('状況を確認する',`docker compose ps\ndocker compose logs --tail=100 app\ndocker compose logs --tail=100 db\ndocker compose build app\ndocker compose up -d app`,'データを消すような削除コマンドは、原因が分かるまで実行しません。'),
  note('安全な運用','`docker system prune`や`down -v`などの削除系コマンドは、保存すべきデータがないか確認してから実行します。','warn')
 ],7),
 page('summary','Docker講座のまとめ','Dockerでどこまで再現し、何を永続化するか説明できる','Dockerはコードを動かす「環境」を標準化します。特にイメージとコンテナ、ビルドと起動、コンテナとデータ保存先の違いが重要です。',[
  diagram('環境の構築と運用',[['Dockerfile','イメージを定義'],['build','イメージを生成'],['run / up','コンテナを起動']],'永続データはvolumeやバインドマウントでコンテナ外へ保存します。'),
  list('要点の再確認',['イメージは実行環境のひな型。コンテナは実行単位','RUNはビルド時、CMDは起動時の既定コマンド','Composeは複数コンテナを一括管理する','コンテナ削除とデータ削除の関係を理解する','Docker内のlocalhostは基本的にそのコンテナ自身を指す']),
  note('次のページ','続いて10問の理解度テストです。概念とコマンドを混同していないか確認しましょう。','good')
 ],4),
 page('quiz','Dockerの理解度テスト','環境管理の基本概念と操作を判断できる','全10問の確認テストです。回答後に採点結果と解説を表示します。合格目安は70%以上です。',[],8)
 ],
 quiz:[
 question('Dockerのイメージとは？',['実行環境のひな型','実行中のPythonプロセスそのもの','GitのコミットID'],0,'イメージはコンテナを生成するための土台です。'),
 question('DockerfileのRUN命令は主にいつ実行される？',['ビルド時','Docker Desktopのインストール時','コンテナ停止時'],0,'RUNはイメージビルド時に処理します。'),
 question('起動済みコンテナのログ確認は？',['docker logs','git log','pytest -q'],0,'docker logsで標準出力・標準エラーを確認します。'),
 question('コンテナの削除後もDBデータを残すには？',['volumeを使用する','コンテナ名を短くする','CMDを削除する'],0,'volumeなど外部保存先に永続化します。'),
 question('Composeの役割は？',['複数サービスをまとめて定義・実行する','モデルの精度を計測する','Gitのブランチを統合する'],0,'Composeはサービス群の起動・管理を補助します。'),
 question('ComposeのPythonサービスからPostgreSQLへ接続するときのホスト名は通常？',['localhost','db（DBサービス名）','127.0.0.1を固定'],1,'同一Composeネットワークではサービス名で通信します。'),
 question('DockerfileのFROMが指定するのは？',['ベースイメージ','最終的なAccuracy','GitHubのユーザー名'],0,'FROMは元となるイメージを指定します。'),
 question('docker compose down -v の注意点は？',['名前付きvolumeが削除され得る','Gitコミットが失われる','学習率が変更される'],0,'-vでvolumeも削除されるため注意が必要です。'),
 question('コード変更がイメージに反映されないとき確認するのは？',['再ビルドが必要か','MLflowのRun数','GitHubの閲覧数'],0,'COPYしたコードは通常イメージに取り込まれるため再ビルドが必要な場合があります。'),
 question('Dockerとvenvの違いで正しい説明は？',['どちらも完全な仮想マシン','Dockerはシステム依存も含む環境をまとめられる','venvはPostgreSQLサーバーも管理する'],1,'DockerはPython以外の環境も含めてコンテナ化できます。')
 ]
};
