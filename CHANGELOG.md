# Changelog

Every release, newest first. Versions follow semantic versioning: a patch for
wording, a minor version for a new skill, rule or agent, a major version for a
change in how an existing skill or the installer behaves.

## 0.3.0 — 2026-10-14

**Skills, after testing each one with fresh agents on realistic tasks**

- `project-flow`: reports the first open step and every remaining one with its
  owner; separates "unconfirmed" from "not done"; compares merged pull requests
  with the plan's phases; gives a default release rhythm.
- `write-issue`: asks the owner only product, cost and risk questions and
  records technical calls as such; "Decide first" only for deferred questions;
  says what to write when context, staging or a covering issue is missing.
- `write-handoff`: finds the gaps in an issue called "fully decided"; asks how
  many pull requests; writes a marked **Draft — blocked** handoff instead of an
  unverified one; Draft status in the index.
- `audit-pr`: an audit includes its fixes; checks the other open pull requests
  for number collisions; behaviour fixes get failing-first tests, doc fixes do
  not; the report lists every blocker, the owner's questions, what was not
  verified, and CI after the fixes.
- `project-context`: asks which agents the team uses and which rules to
  enforce; drafts with placeholders when the owner is away; hooks come with an
  install step and a CI mirror; adds a pull request template and agent
  settings.

**Agents**

- GitHub Copilot: standing rules at user level, in
  `~/.copilot/copilot-instructions.md`.
- Cursor: skills at user level, in `~/.agents/skills`.
- Every path now comes from the vendor's official documentation.

**Claude Code**

- The standing rules load on Windows without Git Bash: the hook no longer
  forces bash, so Claude Code uses PowerShell there. `rules.md` is plain ASCII
  so every shell prints it unchanged.
- The plugin folder has its own README, a licence and links, for the plugin
  directory.

**Repository**

- `going-dark check` enforces the Agent Skills name and description limits, a
  plain-ASCII `rules.md`, and no forced bash in the hook.
- CI runs on Linux, Windows and macOS.
- going-dark follows its own method: `AGENTS.md`, issue and pull request
  templates, and this changelog.

## 0.2.0 — 2026-10-14

- Works with any AI agent: an installer (`npx github:reyxdz/going-dark install
  --agent <agent>`) for Codex, Gemini CLI, GitHub Copilot, Cursor and any agent
  that reads `AGENTS.md`.
- `going-dark check`, tests, and CI.
- Skills worded for every agent; `AGENTS.md` as the shared instructions file.

## 0.1.0 — 2026-10-14

- First release: the Claude Code plugin with five skills and the standing
  rules, and the documentation.
