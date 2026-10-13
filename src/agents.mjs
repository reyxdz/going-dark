import { homedir } from 'node:os';
import { isAbsolute, join, resolve } from 'node:path';

/**
 * Where each agent reads skills and standing rules, from each vendor's own
 * documentation (checked 2026-10-14; links in docs/how-it-is-built.md).
 *
 * `~` is the user's home directory; anything else is relative to the project.
 * `.agents/skills` is the skills folder Codex, Gemini CLI, GitHub Copilot and
 * Cursor all read, so installing for several of them shares one copy. Agents
 * without native skill support still find every skill: the rules block lists
 * each one with the path to read.
 *
 * Claude Code is different: it installs the plugin from the marketplace, which
 * keeps its `/go-dark:<skill>` commands and the session-start hook.
 */
export const AGENTS = {
  claude: {
    label: 'Claude Code',
    plugin: true,
  },
  codex: {
    label: 'OpenAI Codex',
    skills: { user: '~/.agents/skills', project: '.agents/skills' },
    rules: { user: '~/.codex/AGENTS.md', project: 'AGENTS.md' },
  },
  gemini: {
    label: 'Gemini CLI',
    skills: { user: '~/.agents/skills', project: '.agents/skills' },
    // Gemini reads GEMINI.md by default; AGENTS.md only when context.fileName names it.
    rules: { user: '~/.gemini/GEMINI.md', project: 'GEMINI.md' },
  },
  copilot: {
    label: 'GitHub Copilot',
    skills: { user: '~/.agents/skills', project: '.agents/skills' },
    rules: { user: '~/.copilot/copilot-instructions.md', project: 'AGENTS.md' },
  },
  cursor: {
    label: 'Cursor',
    skills: { user: '~/.agents/skills', project: '.agents/skills' },
    // Cursor's user rules live in its settings (Customize > Rules), not a file.
    rules: { project: 'AGENTS.md' },
  },
  agents: {
    label: 'Any agent that reads AGENTS.md',
    skills: { project: '.agents/skills' },
    rules: { project: 'AGENTS.md' },
  },
};

export const SCOPES = ['user', 'project'];

/** The home directory, overridable for tests. */
export function home() {
  return process.env.GOING_DARK_HOME || homedir();
}

/** A table path made absolute: `~` from home, anything else from the project. */
export function resolvePath(path, projectDir) {
  if (path.startsWith('~/')) return join(home(), path.slice(2));
  return isAbsolute(path) ? path : resolve(projectDir, path);
}

/** The scope to use when none was asked for: the user's, where the agent supports it. */
export function defaultScope(agent) {
  const target = AGENTS[agent];
  if (target.plugin) return 'user';
  return target.skills.user || target.rules.user ? 'user' : 'project';
}
