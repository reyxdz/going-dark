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
│   └── skills/<skill>/SKILL.md the five skills, in the Agent Skills format
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
   in bash on `startup`, `clear` and `compact`. Text a session-start hook
   prints is added to the session's context, so the rules hold from the first
   message and again after a compaction.

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
- every skill's folder name is valid and matches its `name`, its description
  starts with "Use when", and its frontmatter is within 1,024 characters;
- the hook loads `rules.md`, and the file exists;
- **every relative link and `#anchor` in every Markdown file resolves**.

## Tests

`npm test` runs `test/*.test.mjs` with Node's built-in runner: frontmatter
parsing, renaming for other agents, the rules block (idempotent install,
in-place update, exact removal), installs and uninstalls in a temporary home
and project, refusing a foreign folder, dry runs, and the repository passing
its own check.

## Cost

| Part | When | Roughly |
|---|---|---|
| Skill names and descriptions | Every session | ~360 tokens |
| Standing rules | Every session | ~450 tokens |
| One skill's body | Only when it runs | 0.8k–1.3k tokens |

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

## Releasing a change

1. Edit the files.
2. Bump `version` in **both** `plugins/go-dark/.claude-plugin/plugin.json` and
   `package.json` — `check` fails if they differ. Patch for wording, minor for
   a new skill or rule, major for a change in how an existing skill behaves.
3. `npm test` and `npm run check`.
4. Commit with a message that says what changed and why, and push to `main`.
   CI runs both again on Node 20 and 24.
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
