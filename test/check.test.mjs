import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { check, slug } from '../src/check.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('this repository passes its own check', () => {
  assert.deepEqual(check(root), []);
});

test('heading anchors follow GitHub', () => {
  assert.equal(slug('2. Install'), '2-install');
  assert.equal(slug('4. No AI attribution'), '4-no-ai-attribution');
  assert.equal(slug('`/go-dark:audit-pr`'), 'go-darkaudit-pr');
});
