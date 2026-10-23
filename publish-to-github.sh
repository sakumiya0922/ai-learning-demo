#!/usr/bin/env bash
# Deploy Neural Daylight to the existing GitHub Pages repository from a machine with Git write access.
set -euo pipefail

REMOTE="${1:-https://github.com/sakumiya0922/ai-learning-demo.git}"
BRANCH="${2:-main}"
SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v git >/dev/null 2>&1; then
  echo 'Gitが見つかりません。Gitをインストールしてください。' >&2
  exit 1
fi
if [[ ! -f "$SOURCE/index.html" || ! -f "$SOURCE/src/app.js" ]]; then
  echo '必要な教材ファイルが見つかりません。ZIPを展開したフォルダ内で実行してください。' >&2
  exit 1
fi
if command -v node >/dev/null 2>&1; then
  echo '教材データの自動テストを実行します。'
  (cd "$SOURCE" && node --test tests/content.test.js)
else
  echo 'Node.jsがないため教材データテストはスキップします。'
fi

WORK="$(mktemp -d "${TMPDIR:-/tmp}/neural-daylight-publish.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

echo "公開先を取得します: $REMOTE"
git clone --quiet --branch "$BRANCH" "$REMOTE" "$WORK/site"
cd "$WORK/site"

# Preserve the *actual* original demo before replacing the public index.
# If already preserved in a previous release, do not overwrite the backup.
if [[ -f index.html && ! -e legacy-demo-original.html ]]; then
  cp index.html legacy-demo-original.html
  echo '既存サイトのindex.htmlをlegacy-demo-original.htmlとして退避しました。'
fi

for f in index.html legacy-demo.html README.md package.json .nojekyll publish-to-github.sh; do
  cp "$SOURCE/$f" "$f"
done
for d in src assets docs tests; do
  cp -R "$SOURCE/$d" ./
done

git add index.html legacy-demo.html README.md package.json .nojekyll publish-to-github.sh src assets docs tests
if [[ -f legacy-demo-original.html ]]; then git add legacy-demo-original.html; fi

if git diff --cached --quiet; then
  echo '変更はありません。すでにこの内容が反映されています。'
  exit 0
fi

git commit -m 'Publish Neural Daylight Git Docker pytest MLflow courses'
echo "GitHubへpushします: $BRANCH"
git push origin "HEAD:$BRANCH"
echo 'pushに成功しました。GitHub Pagesの公開設定に従ってサイトが更新されます。'
echo '公開URL（Pagesがmain/(root)の場合）: https://sakumiya0922.github.io/ai-learning-demo/'
