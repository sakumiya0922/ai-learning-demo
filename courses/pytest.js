import {text,code,note,table,list,diagram,lab,page,question} from './utils.js';
export const pytestCourse={
 id:'pytest',label:'03',name:'pytest',tagline:'変更のたびに、正しさを検証する',description:'テストケース設計、assert、fixture、parametrizeを通して機械学習処理の品質を守ります。',symbol:'✓',minutes:78,accent:'#18ab91',
 outcomes:['Python関数の単体テストを書ける','正常系・異常系を設計できる','fixtureとparametrizeを使える','機械学習のデータ漏洩や評価計算のテスト観点を説明できる'],
 pages:[
 page('why','なぜテストが必要？','機械学習開発でテストが担う役割を説明できる','機械学習ではモデルのAccuracyだけでなく、前処理や特徴量生成、評価指標の計算が正しく実装されていることが重要です。pytestはPythonプログラムの動作を検証するテストフレームワークです。',[
  text('精度が高くても不具合は残る','例えば未来の販売数量を特徴量に混ぜてしまうと、見かけの精度だけ上がることがあります。精度指標だけではこの問題を発見できないため、処理の入出力を確認するテストが必要です。'),
  diagram('品質確認の位置づけ',[['前処理','想定の形になるか'],['学習・推論','例外なく実行できるか'],['評価','計算式が正しいか']],'テストはモデルの精度改善そのものを保証するものではありません。'),
  note('Gitと連携','テストを実行してから変更をコミットすると、動作確認したコードを履歴として残しやすくなります。')
 ],6),
 page('types','テストの種類と範囲','単体・結合・統合テストの違いを説明できる','テストでは、どの範囲の動作を検証するかを決めます。小さな関数の検証から、DBや画面を含む一連の処理の確認まで段階があります。',[
  table('テストの範囲',['種類','対象の例','目的'],[['単体テスト','特徴量生成関数','一つの処理を素早く検証'],['結合テスト','DB書き込み・読み込み','複数機能の連携を検証'],['統合テスト','データ準備〜画面表示','主要な利用経路を検証']]),
  text('テストしやすい設計','入力を渡すと結果を返す純粋な関数はテストが書きやすいです。DB接続やファイル入出力は分けて扱うと、条件を制御しやすくなります。'),
  note('MLOpsとの関係','学習データやモデルが実際の要件を満たすかは、コードの単体テストだけでなくデータ検証やモデル評価でも確認します。')
 ],6),
 page('assert','pytestの基本構文','テスト関数とassertの記述方法を理解する','pytestは通常、`test_`で始まる関数などを検出して実行し、`assert`の条件が満たされなければテストを失敗とします。',[
  code('テスト対象：補充計算',`# src/replenishment.py\ndef order_qty(predicted, safety_stock, inventory):\n    return max(0, int(predicted + safety_stock - inventory))`,'ここでは説明用に整数の簡単な計算を使っています。','python'),
  code('最小のテスト',`# tests/test_replenishment.py\nfrom src.replenishment import order_qty\n\ndef test_order_qty_positive():\n    assert order_qty(20, 10, 5) == 25`,'実際のDemandPilotの計算・importとは異なる学習用コードです。','python'),
  code('テストを実行',`python -m pytest -q`,'-qは出力を簡潔に表示します。'),
  lab('pytest','assertの結果を予測する','入力値を変えて、想定した答えと実際の計算結果の一致を確認します。')
 ],8),
 page('cases','正常系・境界値・異常系','複数の入力条件を漏れなく考えられる','1つの正常な入力だけで合格しても、境界条件や欠損データで不具合が起きることがあります。',[
  table('補充計算のケース設計',['種類','入力例','期待結果'],[['正常系','予測20・安全10・在庫5','25'],['境界値','予測5・安全5・在庫10','0'],['下限','予測5・安全2・在庫40','0'],['異常系','在庫に文字列を渡す','仕様に沿って例外または入力エラー']]),
  text('期待結果から設計する','期待結果は実装コードを写して作らないことが大切です。業務仕様や計算式から独立に求めて、誤った実装を検出できるようにします。'),
  note('評価時の注意','「負の補充数にしない」ような業務上の条件を、通常ケースとは別にテストします。')
 ],6),
 page('parametrize','複数ケースをまとめてテスト','parametrizeで入力と期待値を切り替えられる','`@pytest.mark.parametrize`を使うと、同じテスト関数で複数パターンを検証できます。',[
  code('パラメータ化したテスト',`import pytest\n\n@pytest.mark.parametrize("pred,safety,stock,expected", [\n    (20, 10, 5, 25),\n    (5, 5, 10, 0),\n    (5, 2, 40, 0),\n])\ndef test_order_qty(pred, safety, stock, expected):\n    assert order_qty(pred, safety, stock) == expected`,'各行は別のテストケースとして報告されます。','python'),
  text('適した使い方','同じ機能を数十の入力パターンで検証したいときに有効です。一方、目的が異なるテストまで無理にまとめると、失敗原因が追いにくくなります。'),
  note('MLflowと混同しない','pytestのparametrizeはコードの正しさを確認するための複数ケース実行です。モデル学習のハイパーパラメータ探索とは目的が異なります。')
 ],6),
 page('fixture','fixtureで準備処理を共有','fixtureの役割と基本的な使い方を説明できる','複数のテストで同じ入力データを作る場合、fixtureに準備処理をまとめられます。',[
  code('共通データを用意',`import pytest\nimport pandas as pd\n\n@pytest.fixture\ndef sales_df():\n    return pd.DataFrame({"sales": [10, 0, 25]})\n\ndef test_sales_nonnegative(sales_df):\n    assert (sales_df["sales"] >= 0).all()`,'テスト関数の引数名にfixture名を書くと値を受け取れます。','python'),
  text('fixtureのスコープ','通常はテスト関数ごとに新しいfixtureが用意されます。`scope="module"`などにより共有範囲を変えられますが、共有しすぎるとテスト間の依存が生まれるため注意します。'),
  note('片付け処理','一時ファイルやDB接続が必要なら、`yield` fixtureで後片付けを記述できます。')
 ],7),
 page('errors','例外と外部依存をテスト','例外検証とモックの基本的な使いどころが分かる','不正な入力で適切にエラーになるかもテスト対象です。また、外部APIやDBへの接続は、必要に応じて差し替えて検証します。',[
  code('例外の検証',`import pytest\n\ndef divide(a, b):\n    if b == 0:\n        raise ValueError("zero denominator")\n    return a / b\n\ndef test_zero_division():\n    with pytest.raises(ValueError, match="zero denominator"):\n        divide(1, 0)`,'想定した例外が発生しなければテストが失敗します。','python'),
  text('モックの考え方','外部のデータ取得処理をテストする場合、実際のAPIへ毎回アクセスせず、テスト用の応答を返す関数に差し替えることがあります。pytestの`monkeypatch`や`unittest.mock`を利用します。'),
  note('モックだけでは不十分','モックを使った単体テストだけでは、本物のDBやAPIとの連携は保証できません。必要に応じて結合テストも用意します。')
 ],7),
 page('ml-specific','機械学習固有のテスト','データ漏洩・特徴量・評価指標のチェック観点を理解する','機械学習では通常のプログラムテストに加えて、時系列の未来データを誤って使っていないかなど、データの意味に関する検証が重要です。',[
  list('DemandPilotを例にした観点',['学習・検証・テストの期間が意図した境界になっているか','基準日より未来の販売情報を特徴量に使っていないか','0件の日を含めた集計が正しいか','MAEとWAPEの算出が手計算と一致するか','保存したモデルで推論した結果が期待形式になっているか']),
  code('評価指標の小さなテスト例',`from sklearn.metrics import mean_absolute_error\n\ndef test_mae_known_values():\n    actual = [10, 20]\n    pred = [12, 16]\n    assert mean_absolute_error(actual, pred) == 3.0`,'期待値は (2 + 4) / 2 = 3 と手計算で確認できます。','python'),
  note('重要','テストデータを見て追加チューニングすると、そのテストを独立した最終評価として扱いにくくなります。コードテストとモデル評価は役割を分けましょう。','warn')
 ],7),
 page('docker','Docker内でpytestを実行','コンテナ内でテストを動かす操作を説明できる','Dockerでアプリを実行する場合は、テストも同じ依存ライブラリの環境で動かすことで、ホストPCとの差を減らせます。',[
  code('DemandPilotの実行例',`docker compose run --rm --entrypoint pytest pipeline -q`,'pytestがイメージにインストールされている前提です。'),
  code('テストを絞って実行する例',`docker compose run --rm --entrypoint pytest pipeline -q tests/test_features.py`,'ファイル単位で実行して原因を絞れます。'),
  text('テスト実行時の注意','DBや学習済みモデルが必要な統合テストは、前提となるデータを準備してから実行します。`skip`が出た場合は「実行できていないテストがある」ことも確認します。'),
  note('失敗時に見るもの','テスト名、AssertionErrorの内容、期待値と実測値、スタックトレースを順に確認します。')
 ],6),
 page('summary','pytest講座のまとめ','適切なテストを自分で書く流れを整理できる','pytestは開発者の想定とプログラムの実際の振る舞いを比較する仕組みです。モデル精度の評価とは異なる品質確認を担当します。',[
  diagram('基本の流れ',[['仕様','期待値を決める'],['test_関数','入力とassertを書く'],['pytest','実行・失敗分析']],'失敗した理由を調べ、実装またはテスト仕様を修正します。'),
  list('要点の再確認',['正常系だけでなく境界値・異常系を含める','parametrizeで複数ケースを整理できる','fixtureはテストの準備を共有する','外部依存はモックと実連携テストを使い分ける','データ漏洩・期間分割・評価式などML固有の問題も検証する']),
  note('次のページ','最後に10問をまとめて採点します。','good')
 ],4),
 page('quiz','pytestの理解度テスト','テスト設計とpytest構文を判断できる','全10問の確認テストです。回答後に採点結果と解説を表示します。合格目安は70%以上です。',[],8)
 ],
 quiz:[
 question('pytestの主な役割は？',['Pythonコードの動作を検証する','モデルの精度を自動改善する','Gitへコミットする'],0,'pytestはテストフレームワークです。'),
 question('テスト関数名として一般的に検出されるのは？',['check_sales','test_sales','sales_model'],1,'pytestは通常test_で始まる関数を検出します。'),
 question('assertの条件がFalseなら？',['テスト失敗','テスト成功','自動で学習率を更新'],0,'assertが偽になるとAssertionErrorが発生します。'),
 question('境界値テストの例は？',['結果がちょうど0になるケース','開発者の氏名を調べる','GitHubへpushする'],0,'処理が切り替わる境界の入力を確認します。'),
 question('parametrizeの主な用途は？',['同じテストを複数データで実行する','DBを暗号化する','複数Dockerイメージを統合する'],0,'parametrizeは複数ケースを効率的に記述できます。'),
 question('fixtureは何をする？',['テストに使う共通の準備処理を定義','Gitのブランチを作る','モデルをRegistryへ登録'],0,'fixtureで入力データなどの準備を共有できます。'),
 question('pytest.raisesを使うのは？',['想定した例外を確認するとき','Pythonの関数を高速化するとき','Lossを記録するとき'],0,'raisesは例外が発生することをテストします。'),
 question('モックを用いたテストで不足しやすいことは？',['本物の外部システムとの連携の保証','関数の戻り値確認','テストの実行速度'],0,'実システムとの接続は別の結合テストで確認します。'),
 question('時系列の特徴量テストで重要なのは？',['基準日より未来の情報を使っていないか','フォントの色','Dockerのアイコン'],0,'未来情報を使うデータ漏洩は重大な問題です。'),
 question('テスト実行結果にskipがある場合は？',['テストが実行されていない理由を確認','全テストが必ず成功したと判断','Gitにpushできなくなる'],0,'skipは未実行であり、前提条件を確認すべきです。')
 ]
};
