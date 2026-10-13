import { test } from 'node:test';
import assert from 'node:assert/strict';
import { END, START, hasBlock, removeBlock, renderRulesBlock, upsertBlock } from '../src/rules-block.mjs';

const RULES = `# going-dark: standing rules

1. **Minimal local load.**

The going-dark skills: \`/go-dark:audit-pr\`.
`;
const SKILLS = [
  { folder: 'audit-pr', frontmatter: { fields: { description: 'Use when auditing.' } } },
];
const block = renderRulesBlock({ rules: RULES, skills: SKILLS, skillsPath: '.agents/skills', version: '1.2.3' });

test('the block is marked, versioned, and lists each skill with its file', () => {
  assert.ok(block.startsWith(START));
  assert.ok(block.endsWith(END));
  assert.match(block, /going-dark 1\.2\.3/);
  assert.match(block, /\*\*go-dark-audit-pr\*\* — Use when auditing\. Read `\.agents\/skills\/go-dark-audit-pr\/SKILL\.md`/);
});

test('the rules sit one heading level down, without the duplicate one-line skill list', () => {
  assert.match(block, /^## going-dark: standing rules$/m);
  assert.doesNotMatch(block, /The going-dark skills:/);
  assert.doesNotMatch(block, /\/go-dark:/);
});

test('adding the block keeps what the file already had', () => {
  const file = '# Project rules\n\nUse tabs.\n';
  const updated = upsertBlock(file, block);
  assert.ok(updated.startsWith(file));
  assert.ok(hasBlock(updated));
});

test('installing twice leaves one block, not two', () => {
  const once = upsertBlock('# Project rules\n', block);
  const twice = upsertBlock(once, block);
  assert.equal(twice, once);
  assert.equal(twice.split(START).length, 2);
});

test('an updated block replaces the old one in place', () => {
  const once = upsertBlock('# Top\n', block);
  const newer = block.replace('1.2.3', '2.0.0');
  const updated = upsertBlock(once, newer);
  assert.match(updated, /going-dark 2\.0\.0/);
  assert.doesNotMatch(updated, /going-dark 1\.2\.3/);
});

test('removing the block restores the file as it was', () => {
  const file = '# Project rules\n\nUse tabs.\n';
  assert.equal(removeBlock(upsertBlock(file, block)), file);
});

test('removing the block from a file that held only it leaves nothing', () => {
  assert.equal(removeBlock(upsertBlock('', block)).trim(), '');
});

test('removing from a file without the block changes nothing', () => {
  assert.equal(removeBlock('# Untouched\n'), '# Untouched\n');
});
