import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** Every installed skill's folder and `name` start with this outside Claude Code. */
export const PREFIX = 'go-dark-';

/**
 * The YAML frontmatter of a `SKILL.md`: one `key: value` per line, which is all
 * the Agent Skills format needs. Returns null when there is none.
 */
export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (field) fields[field[1]] = field[2].trim();
  }
  return { fields, raw: match[1], length: match[0].length };
}

/** The plugin's skills, one per folder under `skills/`, in name order. */
export function readSkills(pluginDir) {
  const skillsDir = join(pluginDir, 'skills');
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const file = join(skillsDir, entry.name, 'SKILL.md');
      const text = readFileSync(file, 'utf8');
      return { folder: entry.name, file, text, frontmatter: parseFrontmatter(text) };
    })
    .sort((a, b) => a.folder.localeCompare(b.folder));
}

/**
 * Claude Code namespaces plugin skills (`/go-dark:audit-pr`). Other agents keep
 * every skill in one shared folder, so there the prefix is part of the name
 * (`go-dark-audit-pr`), and every reference to one is rewritten to match.
 */
export function neutralise(text) {
  return text.replace(/\/go-dark:/g, PREFIX);
}

/** A skill as another agent installs it: prefixed name, rewritten references. */
export function renderForAgent(skill) {
  const name = PREFIX + skill.folder;
  const text = neutralise(skill.text).replace(/^name:.*$/m, `name: ${name}`);
  return { name, text };
}
