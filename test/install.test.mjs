import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STAMP, install, uninstall } from '../src/install.mjs';
import { START } from '../src/rules-block.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let sandbox;
let home;
let project;

before(() => {
  sandbox = mkdtempSync(join(tmpdir(), 'going-dark-'));
  home = join(sandbox, 'home');
  project = join(sandbox, 'project');
  mkdirSync(home);
  mkdirSync(project);
  process.env.GOING_DARK_HOME = home;
});

after(() => {
  delete process.env.GOING_DARK_HOME;
  rmSync(sandbox, { recursive: true, force: true });
});

test('a user install for Codex puts skills in ~/.agents/skills and rules in ~/.codex/AGENTS.md', () => {
  install({ root, agent: 'codex', scope: 'user', project });
  const skill = join(home, '.agents', 'skills', 'go-dark-audit-pr');
  assert.ok(existsSync(join(skill, 'SKILL.md')));
  assert.ok(existsSync(join(skill, STAMP)));
  assert.match(readFileSync(join(skill, 'SKILL.md'), 'utf8'), /^name: go-dark-audit-pr$/m);
  const rules = readFileSync(join(home, '.codex', 'AGENTS.md'), 'utf8');
  assert.ok(rules.includes(START));
  assert.match(rules, /~\/\.agents\/skills\/go-dark-write-issue\/SKILL\.md/);
});

test('uninstalling removes exactly what it added', () => {
  uninstall({ agent: 'codex', scope: 'user', project });
  assert.ok(!existsSync(join(home, '.agents', 'skills', 'go-dark-audit-pr')));
  assert.ok(!existsSync(join(home, '.codex', 'AGENTS.md')));
});

test('a project install keeps the project\'s own AGENTS.md content, and uninstall restores it', () => {
  const agentsMd = join(project, 'AGENTS.md');
  writeFileSync(agentsMd, '# This project\n\nRun the tests before pushing.\n');
  install({ root, agent: 'cursor', scope: 'project', project });
  const installed = readFileSync(agentsMd, 'utf8');
  assert.ok(installed.startsWith('# This project'));
  assert.match(installed, /`\.agents\/skills\/go-dark-project-flow\/SKILL\.md`/);
  uninstall({ agent: 'cursor', scope: 'project', project });
  assert.equal(readFileSync(agentsMd, 'utf8'), '# This project\n\nRun the tests before pushing.\n');
  assert.ok(!existsSync(join(project, '.agents')), 'the folders install created are gone too');
});

test('uninstall leaves a shared skills folder that still holds other skills', () => {
  const other = join(project, '.agents', 'skills', 'someone-elses-skill');
  mkdirSync(other, { recursive: true });
  install({ root, agent: 'agents', scope: 'project', project });
  uninstall({ agent: 'agents', scope: 'project', project });
  assert.ok(existsSync(other));
  rmSync(join(project, '.agents'), { recursive: true, force: true });
});

test('it refuses to overwrite a skill folder it did not make', () => {
  const foreign = join(project, '.agents', 'skills', 'go-dark-audit-pr');
  mkdirSync(foreign, { recursive: true });
  writeFileSync(join(foreign, 'SKILL.md'), 'someone else\'s');
  assert.throws(() => install({ root, agent: 'agents', scope: 'project', project }), /was not made by going-dark/);
  assert.equal(readFileSync(join(foreign, 'SKILL.md'), 'utf8'), 'someone else\'s');
  rmSync(join(project, '.agents'), { recursive: true, force: true });
});

test('a dry run changes nothing', () => {
  const result = install({ root, agent: 'gemini', scope: 'user', project, dryRun: true });
  assert.ok(result.done.length > 0);
  assert.ok(!existsSync(join(home, '.gemini')));
});

test('Cursor has no user-level folder, so a user install says to use the project scope', () => {
  assert.throws(() => install({ root, agent: 'cursor', scope: 'user', project }), /--scope project/);
});

test('Claude Code is installed through its plugin system', () => {
  const result = install({ root, agent: 'claude', scope: 'user', project });
  assert.deepEqual(result.manual, [
    'claude plugin marketplace add reyxdz/going-dark',
    'claude plugin install go-dark@going-dark --scope user',
  ]);
});
