import { test } from 'node:test';
import assert from 'node:assert/strict';
import { neutralise, parseFrontmatter, renderForAgent } from '../src/skills.mjs';

const SKILL = `---
name: audit-pr
description: Use when asked to audit a pull request.
---

# Audit

Then run \`/go-dark:write-issue\` for each follow-up.
`;

test('reads the frontmatter fields', () => {
  const fm = parseFrontmatter(SKILL);
  assert.equal(fm.fields.name, 'audit-pr');
  assert.equal(fm.fields.description, 'Use when asked to audit a pull request.');
});

test('a file without frontmatter has none', () => {
  assert.equal(parseFrontmatter('# Just a heading\n'), null);
});

test('reads frontmatter written with Windows line endings', () => {
  assert.equal(parseFrontmatter(SKILL.replace(/\n/g, '\r\n')).fields.name, 'audit-pr');
});

test('outside Claude Code a skill is prefixed, and so is every reference to one', () => {
  const { name, text } = renderForAgent({ folder: 'audit-pr', text: SKILL });
  assert.equal(name, 'go-dark-audit-pr');
  assert.match(text, /^name: go-dark-audit-pr$/m);
  assert.match(text, /`go-dark-write-issue`/);
  assert.doesNotMatch(text, /\/go-dark:/);
});

test('only the name line changes in the frontmatter', () => {
  const { text } = renderForAgent({ folder: 'audit-pr', text: SKILL });
  assert.match(text, /^description: Use when asked to audit a pull request\.$/m);
  assert.equal(neutralise('plain text'), 'plain text');
});
