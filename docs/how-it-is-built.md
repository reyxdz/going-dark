# How it is built

For anyone maintaining going-dark or building something like it.

## Files

```
going-dark/
├── .claude-plugin/
│   └── marketplace.json        Claude Code: the marketplace, listing the plugin
├── plugins/go-dark/            the single source of the method
│   ├── .claude-plugin/
│   │   └── plugin.json         Claude Code: name, version, description
│   ├── rules.md                the standing rules
│   ├── hooks/hooks.json        Claude Code: loads rules.md at session start
│   └── skills/<skill>/SKILL.md the six skills, in the Agent Skills format
├── bin/going-dark.mjs          the installer's command
├── src/
│   ├── agents.mjs              where each agent reads skills and rules
│   ├── skills.mjs              reads skills; renames them for other agents
│   ├── rules-block.mjs         builds, replaces and removes the rules block
│   ├── install.mjs             install and uninstall
│   ├── check.mjs               validates the repository
│   └── cli.mjs                 arguments, help and output
├── test/                       Node's built-in test runner
├── .github/workflows/check.yml tests and check on every push and pull request
├── docs/                       this documentation
├── package.json                the npx entry point; version matches plugin.json
├── LICENSE                     MIT
└── README.md
```

**One source, many agents.** The skills and rules are written once, in
`plugins/go-dark/`. Claude Code reads that folder as a plugin; every other agent
gets a copy made from it by the installer.

## The format

Each skill is a folder holding a `SKILL.md`:

```markdown
---
name: audit-pr
description: Use when asked to audit, review or check a pull request, …
---

# Audit a pull request
…
```

This is the open [Agent Skills](https://agentskills.io) format: a `name` that
matches the folder (lowercase letters, digits, hyphens), a `description` saying
**when** to use it, and Markdown instructions. Agents load only the name and
description up front, and the body when the skill is used.

## In Claude Code

1. **The marketplace.** `claude plugin marketplace add reyxdz/going-dark` reads
   `.claude-plugin/marketplace.json`; its `name` (`going-dark`) is the part
   after `@` in `go-dark@going-dark`, and its `source` points at
   `./plugins/go-dark`.
2. **The plugin.** `claude plugin install go-dark@going-dark` copies the plugin
   into Claude Code's cache. Its `name` (`go-dark`) prefixes every command, and
   each skill folder becomes the rest: `skills/audit-pr/` →
   `/go-dark:audit-pr`.
3. **The hook.** `hooks/hooks.json` runs `cat "${CLAUDE_PLUGIN_ROOT}/rules.md"`
   on `startup`, `clear` and `compact`. Claude Code substitutes the path
   itself, and runs the command in bash — or in PowerShell on Windows when
   Git Bash is not installed, where `cat` also prints a file. That is why the
   hook sets no `shell`, and why `rules.md` is plain ASCII: PowerShell may
   read a file without a byte-order mark in the system code page. Text a
   session-start hook prints is added to the session's context, so the rules
   hold from the first message and again after a compaction.

## In every other agent

`going-dark install --agent <agent>`:

1. **Finds the folders** in the table in `src/agents.mjs`. `~` paths are the
   user's home; others are relative to the project.
2. **Copies each skill** to `<skills>/go-dark-<skill>/SKILL.md`. Claude Code
   namespaces plugin skills, but other agents keep all skills in one shared
   folder, so the prefix moves into the name: `name: audit-pr` becomes
   `name: go-dark-audit-pr`, and every `/go-dark:<skill>` reference in the text
   becomes `go-dark-<skill>`. A `.going-dark` file in the folder marks it as
   going-dark's, holding the version.
3. **Writes the rules block** into the rules file:
   - the standing rules, one heading level down, so they nest inside the file;
   - **every skill with its trigger and the path of its `SKILL.md`** — this is
     what makes going-dark work in agents with no native skill support: they
     read `AGENTS.md`, and it tells them which file to read for which task;
   - between `<!-- going-dark:start … -->` and `<!-- going-dark:end -->`, so a
     second install replaces it and `uninstall` removes only it.
4. **Removes stale skills** — marked folders whose skill no longer exists.

Safety rules the installer keeps:

| Rule | Why |
|---|---|
| Never overwrite a skill folder without the `.going-dark` marker | It may be someone else's skill with the same name |
| Never touch the rules file outside the marked block | The project's own rules are the project's |
| `--dry-run` reports and changes nothing | So you can see the change first |
| `uninstall` deletes a rules file only if going-dark's block was all it held | Never delete a file the project owns |
| No dependencies, no network calls | Nothing to audit but the files in this repository |

## `going-dark check`

Run by CI on every push and pull request (`npm run check`):

- the marketplace entry, `plugin.json` and `package.json` agree on name,
  location and version;
- every skill's folder name follows the Agent Skills rules (1-64 lowercase
  letters, digits and single hyphens) and matches its `name`; its description
  starts with "Use when" and is at most 1,024 characters;
- the hook loads `rules.md`, does not force bash, and `rules.md` is plain
  ASCII;
- **every relative link and `#anchor` in every Markdown file resolves**.

## Tests

`npm test` runs `test/*.test.mjs` with Node's built-in runner: frontmatter
parsing, renaming for other agents, the rules block (idempotent install,
in-place update, exact removal), installs and uninstalls in a temporary home
and project, refusing a foreign folder, dry runs, and the repository passing
its own check.

## Sources for the agent paths

Every path in `src/agents.mjs` comes from the vendor's own documentation,
checked on 2026-10-14:

| Agent | Skills | Rules | Source |
|---|---|---|---|
| OpenAI Codex | `~/.agents/skills`, `.agents/skills` | `~/.codex/AGENTS.md`, `AGENTS.md` | [Skills](https://learn.chatgpt.com/docs/build-skills), [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) |
| Gemini CLI | `~/.agents/skills`, `.agents/skills` (aliases of `~/.gemini/skills`, `.gemini/skills`) | `~/.gemini/GEMINI.md`, `GEMINI.md` | [Skills](https://geminicli.com/docs/cli/skills/), [GEMINI.md](https://geminicli.com/docs/cli/gemini-md/) |
| GitHub Copilot | `~/.agents/skills`, `.agents/skills` | `~/.copilot/copilot-instructions.md`, `AGENTS.md` | [Skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills), [Instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) |
| Cursor | `~/.agents/skills`, `.agents/skills` | `AGENTS.md` (user rules are in its settings) | [Skills](https://cursor.com/docs/context/skills), [Rules](https://cursor.com/docs/context/rules) |
| Format | — | — | [Agent Skills specification](https://agentskills.io/specification) |

## Cost

| Part | When | Roughly |
|---|---|---|
| Skill names and descriptions | Every session | ~360 tokens |
| Standing rules | Every session | ~450 tokens |
| One skill's body | Only when it runs | 4k–6k tokens |

## Writing a skill description

The `description` decides **when** an agent loads the skill:

- **Say when to use it, not what it does.** Start with "Use when…" and list the
  situations and phrases that should trigger it. `check` enforces the start.
- **Never summarise the steps.** An agent that reads a summary may follow it
  and skip the skill's body.

```yaml
# Good — triggers only
description: Use when asked to audit, review or check a pull request, or whether it is safe to merge.

# Bad — a summary an agent may follow instead of reading the skill
description: Merges main, reads the diff, fixes problems and reports a verdict.
```

## Writing a skill body

The skills are written for the **least capable agent** that might run them,
not the most capable. A strong model loses nothing from precise steps; a
weak one fails on every judgement word left undefined. Every skill has the
same parts, in this order:

1. **What this skill is for** — two or three sentences.
2. **How to follow this file** — the same rules in every skill: do the steps
   in order; each step has **Do**, **Check** and **If not**; **STOP** means
   send the given message and wait; never invent a fact; what to write when
   something cannot be checked; the project's own rules win.
3. **Words used in this file** — every term a weak agent could misread
   ("owner", "small", "unsafe", "scratch folder"), defined once.
4. **Numbered steps** — exact commands with placeholders in `<angle
   brackets>`, and decisions written as "use the first rule that matches"
   tables, never "use your judgement".
5. **Templates** — the exact shape of every output: the report, the issue,
   the handoff, the files.
6. **Before you send** — a yes/no checklist.
7. **Common mistakes** — each with what to do instead.

Each skill is one self-contained `SKILL.md`: the installer copies only that
file, and a weak agent may not open a second one.

**How they are tested.** Each skill is run by a small model (Claude Haiku)
on a realistic scenario, with instructions to log every point where it had
to guess. The guesses are the defects: each becomes a definition, a rule or
a template line, and the scenario is run again. New scenarios then check the
skill generalises — including a pull request with nothing wrong, which must
be called safe without invented findings.

## Releasing a change

1. Edit the files.
2. Bump `version` in **both** `plugins/go-dark/.claude-plugin/plugin.json` and
   `package.json` — `check` fails if they differ. Patch for wording, minor for
   a new skill or rule, major for a change in how an existing skill behaves.
3. `npm test` and `npm run check`.
4. Add an entry to `CHANGELOG.md`, commit with a message that says what
   changed and why, and push to `main`. CI runs both again on Linux, Windows
   and macOS, on Node 20 and 24.
5. Claude Code users run `claude plugin marketplace update going-dark`; other
   agents run the install command again.
6. Optionally tag it: `claude plugin tag plugins/go-dark` creates a
   `go-dark--v<version>` tag after checking the manifest and the marketplace
   agree.

## Design decisions

| Decision | Why |
|---|---|
| One source folder, copied out per agent | The method is written once; no agent's copy can drift from another's |
| The skill list inside the rules block | Agents without native skills still find every skill, from the one file they all read |
| Standing rules in a hook (Claude Code) and a rules file (others), not in a skill | A skill loads only when triggered; these rules must hold in every session |
| The project always wins | A method imposed over a project's own rules would be resisted or ignored; deferring, visibly, keeps both |
| Skills read the project before applying the method | The same skill works in a project with rich conventions and in one with none |
| No dependencies | Nothing to install, nothing to keep updated, nothing to break |
