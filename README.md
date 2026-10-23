# Neural Daylight — 機械学習開発のWeb教材

[公開サイト](https://sakumiya0922.github.io/ai-learning-demo/) · [リポジトリ](https://github.com/sakumiya0922/ai-learning-demo)

GitHub Pagesで公開するブラウザ教材です。Git・Docker・pytest・MLflowの4講座を、解説・図解・コード例・疑似操作で学習できます。学習履歴はブラウザ内に記録します。サーバー、ログイン認証、データベースの外部サービスは使用しません。

## 講座

| 講座 | ページ数 | 理解度テスト | 疑似演習 |
|---|---:|---:|---|
| Git | 13 | 10問 | add / commitの状態変化 |
| Docker | 12 | 10問 | イメージ・コンテナ・ボリューム |
| pytest | 11 | 10問 | assertの結果判定 |
| MLflow | 12 | 10問 | Runの記録・比較 |
| **合計** | **48** | **40問** | |

理解度テストは各講座の最後にまとめて出題します。70%以上を合格の目安としています。

## フォルダ構成

```text
ai-learning-demo/
├── index.html                  # 公開サイトの入口【ファイル】
├── .nojekyll                   # GitHub PagesでJekyll処理を無効化【ファイル】
├── .gitignore                  # Gitで除外するローカル生成物【ファイル】
├── README.md                   # この案内【ファイル】
├── package.json                # Node.jsテストの設定【ファイル】
├── legacy-demo.html            # 旧Python実行デモの互換URL【ファイル】
├── assets/                     # デザイン関連【フォルダ】
│   ├── styles.css              # 画面のスタイル【ファイル】
│   └── favicon.svg             # サイトアイコン【ファイル】
├── src/                        # Webアプリの実装【フォルダ】
│   ├── app.js                  # 画面表示・遷移・疑似操作【ファイル】
│   ├── storage.js              # IndexedDBによる学習履歴保存【ファイル】
│   └── courses/                # 教材本文・設問【フォルダ】
│       ├── git.js
│       ├── docker.js
│       ├── pytest.js
│       ├── mlflow.js
│       ├── index.js
│       └── utils.js
├── docs/                       # 設計書【フォルダ】
│   └── 教材設計書.md
├── tests/                      # 自動テスト【フォルダ】
│   ├── content.test.js
│   └── site-structure.test.js
├── scripts/                    # リポジトリ運用のスクリプト【フォルダ】
│   └── publish-to-github.sh
└── archive/                    # 過去の原型を保管【フォルダ】
    └── legacy-demo-original.html  # 最初のPython実行デモ。公開先から移動
```

`archive/legacy-demo-original.html` は公開中の既存リポジトリを整理する際に元の場所から**移動**します。配布ZIPだけには含まれていません。削除せず、Git履歴も保持します。

`legacy-demo.html` は新教材のフッターから参照されているため、リンクを壊さないようルートに残します。

## ローカルでの起動

プロジェクトのルートで次を実行します。

```sh
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` にアクセスします。JavaScript ES Modulesを使用しているため、`index.html` を直接ダブルクリックする方法は推奨しません。

### 自動テスト

Node.jsが利用できれば、次のコマンドで教材の構成・設問・ファイル参照を確認できます。

```sh
npm test
```

テストはGitやDockerを本当に起動するものではなく、教材の構造を検証するものです。

## コードを編集する場所

| 変更したいこと | 編集先 |
|---|---|
| 講座の説明、図解、クイズ | `src/courses/git.js` など |
| 画面・ページ送り・疑似操作 | `src/app.js` |
| 画面の色・レイアウト | `assets/styles.css` |
| 学習履歴の保存・出力 | `src/storage.js` |
| 内容や画面の設計 | `docs/教材設計書.md` |
| テストの追加 | `tests/` |

## GitHub Pagesへの反映

既存サイトが公開されている `main` ブランチのルートを公開元とします。`index.html`、`src/`、`assets/`の配置は変更しません。

この配布物を展開してMacのターミナルで次を実行すると、既存リポジトリを一時ディレクトリにcloneし、旧ファイルを移動してから更新します。

```sh
bash scripts/publish-to-github.sh
```

**注意：** この整理スクリプトは既知のコミット `272a781` を対象とした一度限りの更新です。GitHub上のコミットが変わっていた場合は**更新を止める**ため、既存の変更を上書きしません。更新前のファイルはGitの履歴から復元可能です。GitHubへのPushには利用者自身の認証が必要です。

変更後の公開URL：<https://sakumiya0922.github.io/ai-learning-demo/>

## データの保存と注意事項

- 学習記録はブラウザ内のIndexedDB（`ai-learning-portfolio`）に保存します。GitHubには保存されません。
- 「学習者名」は端末内の表示名であり、本人認証ではありません。
- Git・Docker・pytest・MLflowの演習はJavaScriptによる**疑似操作**です。実ツールは実行されません。
- 旧デモの履歴データは消さず、既存のIndexedDBストアを利用します。
- 学習履歴はブラウザデータの削除によって消える場合があり、端末間同期もできません。
- 会社の機密情報・社内教材・個人情報を公開しないでください。
