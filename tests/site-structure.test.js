import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('GitHub Pagesの入口から必要なファイルを読み込める', () => {
  const html = read('index.html');
  for (const path of ['assets/styles.css', 'assets/favicon.svg', 'app/main.js']) {
    assert.ok(html.includes(`"${path}"`), `index.htmlに ${path} がありません`);
    assert.ok(existsSync(resolve(root, path)), `ファイルがありません: ${path}`);
  }
});

test('アプリと教材のコードが分離されている', () => {
  for (const path of [
    'app/main.js', 'app/storage.js', 'courses/index.js', 'courses/utils.js',
    'courses/git.js', 'courses/docker.js', 'courses/pytest.js', 'courses/mlflow.js',
    'docs/教材設計書.md', 'assets/styles.css', 'assets/favicon.svg'
  ]) assert.ok(existsSync(resolve(root, path)), `ファイルがありません: ${path}`);
  assert.match(read('app/main.js'), /from '\.\.\/courses\/index\.js'/);
  assert.match(read('app/main.js'), /from '\.\/storage\.js'/);
  assert.match(read('tests/content.test.js'), /from '\.\.\/courses\/index\.js'/);
});

test('旧デモ・旧構成は含まれていない', () => {
  for (const path of [
    'src/', 'legacy-demo.html', 'legacy-demo-original.html',
    'archive/legacy-demo-original.html', 'scripts/publish-to-github.sh'
  ]) assert.equal(existsSync(resolve(root, path)), false, `不要ファイルが残っています: ${path}`);
  assert.doesNotMatch(read('app/main.js'), /legacy-demo\.html/);
});

test('READMEは見学者向けで簡潔', () => {
  const readme = read('README.md');
  assert.match(readme, /https:\/\/sakumiya0922\.github\.io\/ml-engineering-learning-lab\//);
  assert.match(readme, /assets\/preview\.png/);
  assert.ok(readme.split('\n').length < 60, 'READMEを短く維持する');
});
