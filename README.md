# Neural Daylight — 機械学習開発の技術教材

**Git・Docker・pytest・MLflow**を、図解・コード例・疑似操作演習・理解度テストで学ぶ、GitHub Pages上の学習ポータルです。

- Web教材：[Neural Daylight](https://sakumiya0922.github.io/ml-engineering-learning-lab/)
- GitHubリポジトリ：[ml-engineering-learning-lab](https://github.com/sakumiya0922/ml-engineering-learning-lab)

## 教材と主な機能

| 講座 | 学習ページ | 理解度テスト | 疑似操作 |
| --- | ---: | ---: | --- |
| Git | 13 | 10問 | add・commitによる状態の変化 |
| Docker | 12 | 10問 | イメージ・コンテナ・ボリューム |
| pytest | 11 | 10問 | assertでの成否判定 |
| MLflow | 12 | 10問 | Runの記録と比較 |
| **合計** | **48** | **40問** | |

ページ送り方式。進捗、テストの採点結果、疑似演習の記録をブラウザ内に保存します。学習履歴をJSON形式で出力できます。

## 構成

```text
ml-engineering-learning-lab/     # GitHub Pagesの公開ルート
├── index.html                   # トップページ
├── .nojekyll                    # Jekyll変換の無効化
├── .gitignore                   # ローカル生成物の除外設定
├── README.md                    # プロジェクト説明
├── package.json                 # Node.jsテスト設定
├── assets/                      # CSS・アイコン
│   ├── styles.css
│   └── favicon.svg
├── src/                         # WebアプリのJavaScript
│   ├── app.js                   # 画面・講座移動・疑似演習
│   ├── storage.js               # IndexedDBへの学習履歴保存
│   └── courses/                 # 教材本文・設問
│       ├── git.js
│       ├── docker.js
│       ├── pytest.js
│       ├── mlflow.js
│       ├── index.js
│       └── utils.js
├── docs/
│   └── 教材設計書.md
└── tests/
    ├── content.test.js
    └── site-structure.test.js
```

旧Python実行デモと、一度限りの公開・整理スクリプトは、現行教材に不要なため削除しています。必要な場合はGit履歴から参照できます。

## 開発・動作確認

開発用のPythonライブラリやバックエンドサーバーは不要です。JavaScriptのES Modulesを使うため、ファイルを直接開くのではなく、HTTPサーバー経由で確認します。

```bash
python3 -m http.server 8000
```

ブラウザから <http://localhost:8000/> にアクセスします。

Node.jsがインストールされていれば教材内容・ファイル参照などのテストができます。

```bash
npm test
```

## 公開方法

GitHub Pagesで `main` ブランチの `/(root)` を公開元に設定します。`index.html`・`src/`・`assets/` の相対パスを維持しているため、リポジトリ名が変わっても同じ構成で公開できます。

ソースコードを更新したら通常のGit操作でコミット・Pushします。

```bash
git add .
git commit -m "Update learning materials"
git push origin main
```

リポジトリ名変更後、すでにcloneした作業フォルダがある場合はremote URLを更新してください。

```bash
git remote set-url origin https://github.com/sakumiya0922/ml-engineering-learning-lab.git
```

## 保存と制約

- 学習履歴はユーザーのブラウザに保存され、GitHubにはアップロードされません。
- 保存先はIndexedDB（`ai-learning-portfolio`）。従来と同じオリジン `https://sakumiya0922.github.io` なので、通常はリポジトリ名の変更で記録を失いません。ただしブラウザデータ削除・プライベートモードなどでは失われます。
- 学習者名はブラウザ内の表示名であり、本人認証は行いません。
- Git・Docker・pytest・MLflowの操作演習はJavaScriptの**シミュレーション**です。実際のOSコマンドやPythonライブラリは実行されません。
- 初期教材と図解は技術概念の学習を目的としており、実ツールの完全な代替ではありません。
- 会社の機密情報や未公開の社内教材は掲載しないでください。

## 作成・編集箇所

| 編集内容 | 場所 |
| --- | --- |
| 教材本文・設問 | `src/courses/*.js` |
| 画面構成・遷移・疑似操作 | `src/app.js` |
| 進捗・履歴の保存 | `src/storage.js` |
| CSSや色 | `assets/styles.css` |
| 技術教材の設計書 | `docs/教材設計書.md` |
| 自動テスト | `tests/` |
