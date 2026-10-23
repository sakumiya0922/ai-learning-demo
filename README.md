# Neural Daylight — 機械学習開発を学ぶWeb教材

Git・Docker・pytest・MLflowの基礎を、**図解・操作例・理解度テスト**で学べるWeb教材です。

### [▶ Web教材を体験する](https://sakumiya0922.github.io/ml-engineering-learning-lab/)

![Web教材の画面](assets/preview.png)

## できること

- Gitを含む4講座（**全74ページ**）を、ページ送りで学べる
- 操作例や疑似シミュレーションで仕組みを確認できる
- 講座の最後に知識問題で理解度を確認できる
- 学習進捗をブラウザに保存し、JSONで出力できる

## 作成した目的

機械学習では、モデルを学習するだけでなく、コード・実行環境・テスト・実験の管理が必要です。初学者がそれぞれの技術を**何のために使い、内部で何が起きるのか**理解できるよう、丁寧な解説と具体例を組み合わせました。

## 使用技術

**HTML / CSS / JavaScript / IndexedDB / GitHub Pages**

演習はブラウザ内のシミュレーションです。実際のGit・Docker・pytest・MLflowコマンドを実行するものではありません。学習履歴は閲覧者の端末内に保存されます。

<details><summary>開発者向け：ローカル起動とテスト</summary>

```bash
python3 -m http.server 8000
npm test
```

`app/` は画面と履歴、`courses/` は教材本文、`assets/` はデザイン、`docs/` は設計書、`tests/` は自動テストです。

</details>
