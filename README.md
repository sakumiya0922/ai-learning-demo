# Neural Daylight — 機械学習エンジニア向け技術教材

GitHub Pagesで動く、機械学習開発技術のブラウザ教材です。

## 収録内容

- Git：13ページ / 理解度テスト10問 / ステージング・コミット疑似操作
- Docker：12ページ / 理解度テスト10問 / イメージ・コンテナ・volume疑似操作
- pytest：11ページ / 理解度テスト10問 / assertの疑似テスト
- MLflow：12ページ / 理解度テスト10問 / Run記録・比較疑似操作

合計48ページ、40問。講座の最後にまとめてテストし、70%以上を合格目安とします。

## 公開方法

このフォルダの `index.html`、`src/`、`assets/`、`legacy-demo.html` をGitHub Pagesの公開元（通常はmainブランチのルート）へ配置します。

GitHubリポジトリの **Settings → Pages → Build and deployment** で `Deploy from a branch`、`main` / `/(root)` を指定します。

公開URL例: `https://sakumiya0922.github.io/ai-learning-demo/`

## ローカルでの確認

```sh
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000/` を開きます。ESモジュールのため `index.html` を直接ダブルクリックする方法は推奨しません。

## 技術仕様

- サーバー不要：HTML / CSS / JavaScript（ES Modules）
- ログイン画面は認証ではなくローカル表示名の入力
- 学習進捗、テスト履歴、疑似操作状態はIndexedDB `ai-learning-portfolio` の `state` ストアへ保存
- 過去のイベント履歴を破壊しないため、既存ストアに追加記録する方式を採用
- JSONエクスポートで記録を個人保存可能
- コマンドの体験部分は**疑似操作**であり、実際のGit/Docker/pytest/MLflowはブラウザ上で実行しない
- 過去のPython実行実証デモに相当するページを `legacy-demo.html` に用意

## 公開上の注意

認証・サーバーDB・端末間同期はありません。学習履歴はブラウザのオリジンごとに保持され、閲覧データ削除で失われる場合があります。公開教材には機密情報や会社のコードを含めないでください。各講座のコード例は学習用です。

## ソースの位置

`src/courses/` の各JSファイルが教材本文・確認問題のデータです。`src/app.js` が画面描画と操作、`src/storage.js` がIndexedDB永続化を担当します。

## 既存GitHub Pagesリポジトリへ反映する（Mac）

ZIPを展開し、Macのターミナルで `ai-learning-demo-site` フォルダを開いて以下を実行します。**GitHubへのpush権限とGit認証が必要です。**

```sh
bash publish-to-github.sh
```

このスクリプトは独立した一時フォルダへ既存リポジトリをcloneし、最初の実行時に旧 `index.html` を `legacy-demo-original.html` に退避してから教材をコピー・commit・pushします。手元の既存作業フォルダは変更しません。外部公開の前にGitHub上の変更内容を確認してください。

Web画面から手動アップロードする場合は、**ZIPを展開した中の** `ai-learning-demo-site` フォルダにある `index.html` と `src/`、`assets/`、`docs/`、`tests/` 等を、既存リポジトリのルートへアップロードします。GitHub Pagesの公開設定は `main` と `/(root)` にしてください。旧 `index.html` を保存したい場合は、アップロード前に `legacy-demo-original.html` に名前を変えて保管してください。

注意：ログイン風の入口は本人認証ではありません。教材の疑似操作は実際のツールコマンドではありません。学習履歴はブラウザ内保存で、サーバー共有や管理者集計はありません。
