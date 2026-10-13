import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { loadPlugin } from './install.mjs';

/** The Agent Skills rules: lowercase letters, digits and hyphens. */
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FRONTMATTER_MAX = 1024;

/**
 * Everything the installer and the Claude Code plugin rely on, checked. Returns
 * the problems found; an empty list means the repository is sound.
 */
export function check(root) {
  const problems = [];
  const fail = (message) => problems.push(message);

  // Manifests: the marketplace, the plugin and the package agree.
  const read = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
  const marketplace = read('.claude-plugin/marketplace.json');
  const manifest = read('plugins/go-dark/.claude-plugin/plugin.json');
  const pkg = read('package.json');
  const entry = marketplace.plugins?.find((plugin) => plugin.name === manifest.name);
  if (!entry) fail(`marketplace.json has no entry for plugin "${manifest.name}"`);
  else if (resolve(root, entry.source) !== resolve(root, 'plugins/go-dark')) {
    fail(`marketplace.json points "${manifest.name}" at ${entry.source}, not ./plugins/go-dark`);
  }
  if (pkg.version !== manifest.version) {
    fail(`package.json version ${pkg.version} differs from plugin.json version ${manifest.version}`);
  }

  // Skills: each folder holds a SKILL.md whose name matches it.
  const { skills, pluginDir } = loadPlugin(root);
  if (skills.length === 0) fail('no skills found under plugins/go-dark/skills');
  for (const skill of skills) {
    const where = relative(root, skill.file);
    const fm = skill.frontmatter;
    if (!fm) {
      fail(`${where}: no frontmatter`);
      continue;
    }
    const { name, description } = fm.fields;
    if (name !== skill.folder) fail(`${where}: name "${name}" differs from its folder "${skill.folder}"`);
    if (!NAME.test(skill.folder)) fail(`${where}: folder name must be lowercase letters, digits and hyphens`);
    if (!description) fail(`${where}: no description`);
    else if (!description.startsWith('Use when')) {
      fail(`${where}: description should start with "Use when", so it says when to use the skill`);
    }
    if (fm.raw.length > FRONTMATTER_MAX) {
      fail(`${where}: frontmatter is ${fm.raw.length} characters; the limit is ${FRONTMATTER_MAX}`);
    }
  }

  // The session-start hook loads a rules file that exists.
  const hooks = JSON.parse(readFileSync(join(pluginDir, 'hooks', 'hooks.json'), 'utf8'));
  const commands = JSON.stringify(hooks);
  if (!commands.includes('rules.md')) fail('hooks.json does not load rules.md');
  if (!existsSync(join(pluginDir, 'rules.md'))) fail('plugins/go-dark/rules.md is missing');

  // Documentation: every relative link and #anchor resolves.
  for (const problem of brokenLinks(root)) fail(problem);

  return problems;
}

function markdownFiles(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) markdownFiles(path, found);
    else if (entry.name.endsWith('.md')) found.push(path);
  }
  return found;
}

/** GitHub's heading anchors: lowercase, punctuation dropped, spaces to hyphens. */
export function slug(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');
}

/** Lines outside fenced code, where links are real. */
function proseLines(text) {
  let inFence = false;
  return text.split(/\r?\n/).filter((line) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return false;
    }
    return !inFence;
  });
}

function anchorsOf(file) {
  return new Set(
    proseLines(readFileSync(file, 'utf8'))
      .filter((line) => /^#{1,6} /.test(line))
      .map((line) => slug(line.replace(/^#{1,6} /, ''))),
  );
}

export function brokenLinks(root) {
  const broken = [];
  for (const file of markdownFiles(root)) {
    for (const line of proseLines(readFileSync(file, 'utf8'))) {
      // Inline code holds examples, not links.
      for (const match of line.replace(/`[^`]*`/g, '').matchAll(/\]\(([^)\s]+)\)/g)) {
        const target = match[1];
        if (/^[a-z]+:/i.test(target)) continue;
        const [path, anchor] = target.split('#');
        const dest = path ? resolve(dirname(file), path) : file;
        const ok =
          existsSync(dest) && (!anchor || (statSync(dest).isFile() && anchorsOf(dest).has(anchor)));
        if (!ok) broken.push(`${relative(root, file)}: broken link ${target}`);
      }
    }
  }
  return broken;
}
