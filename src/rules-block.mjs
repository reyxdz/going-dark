import { PREFIX, neutralise } from './skills.mjs';

export const START = '<!-- going-dark:start';
export const END = '<!-- going-dark:end -->';

/**
 * The standing rules as a block for an agent's rules file (`AGENTS.md`,
 * `GEMINI.md`): the rules themselves, then every skill with the file to read.
 * Listing the files means an agent with no native skill support still finds
 * and follows the right skill.
 */
export function renderRulesBlock({ rules, skills, skillsPath, version }) {
  const body = neutralise(rules)
    .replace(/\r\n/g, '\n')
    .trim()
    // The fuller skill list below replaces the rules file's closing one-liner.
    .replace(/\n+The going-dark skills:[\s\S]*$/, '')
    // One level down, so the block sits inside the file's own structure.
    .replace(/^(#+) /gm, '#$1 ');
  const list = skills
    .map((skill) => {
      const name = PREFIX + skill.folder;
      const when = skill.frontmatter.fields.description;
      return `- **${name}** — ${when} Read \`${skillsPath}/${name}/SKILL.md\` before acting.`;
    })
    .join('\n');
  return [
    `${START} — managed by going-dark ${version}. Run the installer again to update it, or \`going-dark uninstall\` to remove it. -->`,
    body,
    '',
    '## going-dark skills',
    '',
    'When a task matches one of these, read its file first and follow it.',
    '',
    list,
    END,
  ].join('\n');
}

function findBlock(text) {
  const start = text.indexOf(START);
  const end = text.indexOf(END, start);
  return start === -1 || end === -1 ? null : { start, end: end + END.length };
}

/** The file with the block replaced, or appended after one blank line. */
export function upsertBlock(existing, block) {
  const found = findBlock(existing);
  if (found) return existing.slice(0, found.start) + block + existing.slice(found.end);
  if (!existing.trim()) return `${block}\n`;
  const separator = existing.endsWith('\n\n') ? '' : existing.endsWith('\n') ? '\n' : '\n\n';
  return `${existing}${separator}${block}\n`;
}

/** The file with the block and the blank line before it removed. */
export function removeBlock(existing) {
  const found = findBlock(existing);
  if (!found) return existing;
  const before = existing.slice(0, found.start).replace(/\n+$/, '');
  const after = existing.slice(found.end).replace(/^\n+/, '');
  if (!before) return after;
  return after ? `${before}\n\n${after}` : `${before}\n`;
}

export function hasBlock(text) {
  return findBlock(text) !== null;
}
