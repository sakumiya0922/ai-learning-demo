# Neural Daylight — 機械学習開発のWeb教材

Git・Docker・pytest・MLflowを、**図解と操作体験を通じて学べるWeb教材**です。

### [▶ Web教材を開く](https://sakumiya0922.github.io/ml-engineering-learning-lab/)

![Neural Daylight のトップ画面](assets/preview.png)

## 何ができる？

- **Git・Docker・pytest・MLflow**の4講座（全48ページ）
- コード例・図解・疑似操作で仕組みを体験
- 各講座10問の理解度テスト
- 学習進捗の保存とJSON形式での履歴出力

## 作成した目的

機械学習の開発では、モデル学習以外にもコード管理・環境構築・テスト・実験管理の知識が必要です。これらを初学者が段階的に学べるよう、説明をページ単位に分け、操作による確認と理解度テストを組み合わせました。

## 使用技術

**HTML / CSS / JavaScript / IndexedDB / GitHub Pages**

サーバー不要で動作し、学習履歴は利用者のブラウザ内に保存します。操作演習はJavaScriptによる**シミュレーション**で、実際のGit・Dockerなどは実行しません。

<details>
<summary>開発者向け：構成と起動方法</summary>

- `app/`：画面と学習履歴の処理
- `courses/`：4講座の本文・問題
- `assets/`：CSS・画像・アイコン
- `docs/`：教材設計書
- `tests/`：自動テスト

```bash
python3 -m http.server 8000  # http://localhost:8000/
npm test                     # Node.jsがある場合
```

</details>
