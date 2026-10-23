#!/usr/bin/env bash
# One-time, conservative layout cleanup for the existing GitHub Pages repository.
# The live app (index.html, src/, assets/, legacy-demo.html) is NOT modified.
set -euo pipefail

REPO='https://github.com/sakumiya0922/ai-learning-demo.git'
BRANCH='main'
EXPECTED_HEAD='272a78182ed401c17c448c29f5bac6f21a4dd58d'
SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v git >/dev/null 2>&1; then
  echo 'ERROR: Gitが見つかりません。' >&2
  exit 1
fi
if [[ ! -f "$SOURCE/index.html" || ! -f "$SOURCE/tests/site-structure.test.js" ]]; then
  echo 'ERROR: 整理済み教材フォルダ内で実行してください。' >&2
  exit 1
fi
if command -v node >/dev/null 2>&1; then
  echo 'Step 1: 教材データと公開構成の検査'
  (cd "$SOURCE" && node --test tests/*.test.js)
else
  echo 'INFO: Node.jsが見つからないため、ローカルの自動テストをスキップします。'
fi

WORK="$(mktemp -d "${TMPDIR:-/tmp}/neural-daylight-organize.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

echo 'Step 2: GitHubのmainブランチを取得'
git clone --quiet --branch "$BRANCH" "$REPO" "$WORK/site"
cd "$WORK/site"
ACTUAL_HEAD="$(git rev-parse HEAD)"

if [[ "$ACTUAL_HEAD" != "$EXPECTED_HEAD" ]]; then
  if [[ -f archive/legacy-demo-original.html && -f scripts/publish-to-github.sh && ! -e publish-to-github.sh && ! -e legacy-demo-original.html ]]; then
    echo 'すでに整理された構成です。既存の変更は行いません。'
    exit 0
  fi
  echo "ERROR: GitHub側で新しい変更が見つかったため、上書きを中止しました。" >&2
  echo "想定コミット: $EXPECTED_HEAD" >&2
  echo "現在のコミット: $ACTUAL_HEAD" >&2
  echo '新しいZIPを作る前に変更内容を確認してください。' >&2
  exit 1
fi

if [[ ! -f legacy-demo-original.html || ! -f publish-to-github.sh ]]; then
  echo 'ERROR: 移動元のバックアップまたは公開スクリプトが見つからないため、中止しました。' >&2
  exit 1
fi

echo 'Step 3: 旧デモの保管と公開スクリプトの整理'
mkdir -p archive scripts
git mv legacy-demo-original.html archive/legacy-demo-original.html
git mv publish-to-github.sh scripts/publish-to-github.sh
cp "$SOURCE/scripts/publish-to-github.sh" scripts/publish-to-github.sh
cp "$SOURCE/README.md" README.md
cp "$SOURCE/.gitignore" .gitignore
cp "$SOURCE/package.json" package.json
cp "$SOURCE/tests/site-structure.test.js" tests/site-structure.test.js

# Keep existing live pages, scripts and learning storage code untouched.
git add README.md .gitignore package.json tests/site-structure.test.js scripts/publish-to-github.sh archive/legacy-demo-original.html
if git diff --cached --quiet; then
  echo '変更はありません。'
  exit 0
fi

echo '変更予定ファイル一覧:'
git diff --cached --stat

echo 'Step 4: 整理内容をコミットしてmainへpush'
git commit -m 'Organize repository: archive demo, scripts, and docs'
git push origin "HEAD:$BRANCH"
echo 'SUCCESS: GitHubリポジトリの整理を反映しました。'
echo '公開URL: https://sakumiya0922.github.io/ai-learning-demo/'
