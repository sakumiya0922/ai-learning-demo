import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('GitHub Pages entry and resources are retained at stable paths', () => {
  const html = read('index.html');
  assert.match(html, /<meta charset="UTF-8">/);
  for (const p of ['assets/styles.css', 'assets/favicon.svg', 'src/app.js']) {
    assert.ok(html.includes(`"${p}"`), `index.html should reference ${p}`);
    assert.ok(existsSync(resolve(root, p)), `Missing ${p}`);
  }
});

test('courses and old demo remain accessible', () => {
  const paths = [
    'src/courses/git.js', 'src/courses/docker.js',
    'src/courses/pytest.js', 'src/courses/mlflow.js',
    'src/storage.js', 'legacy-demo.html', 'docs/教材設計書.md'
  ];
  for (const p of paths) assert.ok(existsSync(resolve(root, p)), `Missing ${p}`);
  assert.match(read('src/app.js'), /href="legacy-demo\.html"/);
});

test('repository organization uses dedicated operational folders', () => {
  assert.ok(existsSync(resolve(root, 'scripts/publish-to-github.sh')));
  assert.ok(existsSync(resolve(root, '.gitignore')));
});
