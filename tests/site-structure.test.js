import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('GitHub Pages entry and static resources are present', () => {
  const html = read('index.html');
  assert.match(html, /<meta charset="UTF-8">/);
  for (const p of ['assets/styles.css', 'assets/favicon.svg', 'src/app.js']) {
    assert.ok(html.includes(`"${p}"`), `index.html should reference ${p}`);
    assert.ok(existsSync(resolve(root, p)), `Missing ${p}`);
  }
});

test('course modules, storage and design specification are present', () => {
  const paths = [
    'src/courses/git.js', 'src/courses/docker.js',
    'src/courses/pytest.js', 'src/courses/mlflow.js',
    'src/courses/index.js', 'src/storage.js', 'docs/教材設計書.md'
  ];
  for (const p of paths) assert.ok(existsSync(resolve(root, p)), `Missing ${p}`);
});

test('unused prototype pages and one-time deployment script are removed', () => {
  for (const p of ['legacy-demo.html', 'legacy-demo-original.html',
    'archive/legacy-demo-original.html', 'scripts/publish-to-github.sh']) {
    assert.ok(!existsSync(resolve(root, p)), `Unused file remains: ${p}`);
  }
  assert.doesNotMatch(read('src/app.js'), /legacy-demo\.html/);
});

test('new repository name and Pages URL are used in README', () => {
  const readme = read('README.md');
  assert.match(readme, /sakumiya0922\/ml-engineering-learning-lab/);
  assert.doesNotMatch(readme, /https:\/\/sakumiya0922\.github\.io\/ai-learning-demo/);
  assert.ok(existsSync(resolve(root, '.gitignore')));
  assert.ok(existsSync(resolve(root, '.nojekyll')));
});
