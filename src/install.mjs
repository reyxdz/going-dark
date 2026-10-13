import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { AGENTS, resolvePath } from './agents.mjs';
import { hasBlock, removeBlock, renderRulesBlock, upsertBlock } from './rules-block.mjs';
import { PREFIX, readSkills, renderForAgent } from './skills.mjs';

/** Marks a skill folder as going-dark's, so it is never mistaken for someone else's. */
export const STAMP = '.going-dark';

const MARKETPLACE = 'reyxdz/going-dark';

/** The plugin's folder, its version and its standing rules, from the package root. */
export function loadPlugin(root) {
  const pluginDir = join(root, 'plugins', 'go-dark');
  const manifest = JSON.parse(readFileSync(join(pluginDir, '.claude-plugin', 'plugin.json'), 'utf8'));
  return {
    pluginDir,
    version: manifest.version,
    rules: readFileSync(join(pluginDir, 'rules.md'), 'utf8'),
    skills: readSkills(pluginDir),
  };
}

function targetFor(agent, scope) {
  const target = AGENTS[agent];
  if (!target) {
    throw new Error(`Unknown agent "${agent}". Choose one of: ${Object.keys(AGENTS).join(', ')}.`);
  }
  if (target.plugin) return { target };
  const skills = target.skills[scope];
  const rules = target.rules[scope];
  if (!skills && !rules) {
    throw new Error(`${target.label} has no ${scope}-level folder for skills or rules. Use --scope project, from inside the project.`);
  }
  return { target, skills, rules };
}

/** Claude Code installs through its own plugin system. */
function claudeCommands(action, scope) {
  return action === 'install'
    ? [
        `claude plugin marketplace add ${MARKETPLACE}`,
        `claude plugin install go-dark@going-dark --scope ${scope}`,
      ]
    : [`claude plugin uninstall go-dark@going-dark --scope ${scope}`];
}

/**
 * Installs the skills and the standing rules for one agent. Returns what it did
 * (or, with dryRun, would do), one line per change.
 */
export function install({ root, agent, scope, project, dryRun = false }) {
  const { target, skills: skillsPath, rules: rulesPath } = targetFor(agent, scope);
  if (target.plugin) {
    return { manual: claudeCommands('install', scope), done: [] };
  }

  const plugin = loadPlugin(root);
  const done = [];
  const notes = [];

  if (skillsPath) {
    const skillsDir = resolvePath(skillsPath, project);
    const current = new Set(plugin.skills.map((skill) => PREFIX + skill.folder));
    for (const skill of plugin.skills) {
      const { name, text } = renderForAgent(skill);
      const dest = join(skillsDir, name);
      if (existsSync(dest) && !existsSync(join(dest, STAMP))) {
        throw new Error(`${dest} exists and was not made by going-dark. Move it aside, then run this again.`);
      }
      if (!dryRun) {
        mkdirSync(dest, { recursive: true });
        writeFileSync(join(dest, 'SKILL.md'), text);
        writeFileSync(join(dest, STAMP), `${plugin.version}\n`);
      }
      done.push(`skill  ${dest}`);
    }
    // A skill renamed or removed since the last install.
    for (const stale of stampedSkills(skillsDir).filter((name) => !current.has(name))) {
      if (!dryRun) rmSync(join(skillsDir, stale), { recursive: true, force: true });
      done.push(`removed stale skill  ${join(skillsDir, stale)}`);
    }
  }

  if (rulesPath) {
    const rulesFile = resolvePath(rulesPath, project);
    const block = renderRulesBlock({
      rules: plugin.rules,
      skills: plugin.skills,
      skillsPath: skillsPath ?? '.agents/skills',
      version: plugin.version,
    });
    const existing = existsSync(rulesFile) ? readFileSync(rulesFile, 'utf8') : '';
    if (!dryRun) {
      mkdirSync(dirname(rulesFile), { recursive: true });
      writeFileSync(rulesFile, upsertBlock(existing, block));
    }
    done.push(`rules  ${rulesFile}${hasBlock(existing) ? ' (updated)' : ''}`);
  } else {
    notes.push(`${target.label} has no ${scope}-level rules file. For the standing rules, run this again with --scope project inside each project.`);
  }

  return { done, notes, manual: [] };
}

/** Removes exactly what install added: stamped skill folders and the rules block. */
export function uninstall({ agent, scope, project, dryRun = false }) {
  const { target, skills: skillsPath, rules: rulesPath } = targetFor(agent, scope);
  if (target.plugin) {
    return { manual: claudeCommands('uninstall', scope), done: [] };
  }

  const done = [];
  if (skillsPath) {
    const skillsDir = resolvePath(skillsPath, project);
    for (const name of stampedSkills(skillsDir)) {
      if (!dryRun) rmSync(join(skillsDir, name), { recursive: true, force: true });
      done.push(`removed skill  ${join(skillsDir, name)}`);
    }
    // Folders install created, left empty: `skills/`, then `.agents/`.
    if (!dryRun && removeIfEmpty(skillsDir) && basename(dirname(skillsDir)) === '.agents') {
      removeIfEmpty(dirname(skillsDir));
    }
  }
  if (rulesPath) {
    const rulesFile = resolvePath(rulesPath, project);
    if (existsSync(rulesFile)) {
      const existing = readFileSync(rulesFile, 'utf8');
      if (hasBlock(existing)) {
        const remaining = removeBlock(existing);
        if (!dryRun) {
          if (remaining.trim()) writeFileSync(rulesFile, remaining);
          else rmSync(rulesFile);
        }
        done.push(`removed rules  ${rulesFile}${remaining.trim() ? '' : ' (file was otherwise empty, deleted)'}`);
      }
    }
  }
  return { done, notes: [], manual: [] };
}

/** Removes a folder only if it exists and holds nothing. Returns whether it did. */
function removeIfEmpty(dir) {
  if (!existsSync(dir) || readdirSync(dir).length > 0) return false;
  rmSync(dir, { recursive: true });
  return true;
}

function stampedSkills(skillsDir) {
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(PREFIX))
    .filter((entry) => existsSync(join(skillsDir, entry.name, STAMP)))
    .map((entry) => entry.name);
}
