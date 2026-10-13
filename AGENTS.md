# Working in this repository

Instructions for any AI agent or contributor working on going-dark itself.
going-dark follows its own method: the standing rules in
[`plugins/go-dark/rules.md`](./plugins/go-dark/rules.md) apply here too.

## Start here

Always:

1. This file.
2. [`docs/how-it-is-built.md`](./docs/how-it-is-built.md): every file, how each
   agent loads it, and the design decisions behind it.

By task:

- **Changing a skill or the rules:** the skill's `SKILL.md` under
  `plugins/go-dark/skills/`, and its page under `docs/skills/`. Keep the two
  saying the same thing.
- **Changing the installer:** `src/`, its tests in `test/`, and
  `docs/getting-started.md` when what it writes changes.
- **Adding or fixing an agent:** the table in `src/agents.mjs`. Every path must
  come from that agent's official documentation; link it in
  `docs/how-it-is-built.md`.

## Rules

**The skills are agent-neutral.** Refer to another skill as
`/go-dark:<skill>` (the installer rewrites it to `go-dark-<skill>` for other
agents). Name a tool only as an example: "two to four options (in Claude Code,
the AskUserQuestion tool)".

**A skill's description says when to use it, never what it does.** It starts
with "Use when"; `npm run check` enforces it. An agent that reads a summary of
the steps may follow the summary and skip the skill.

**`rules.md` is plain ASCII.** The session-start hook prints it through bash
or PowerShell, and PowerShell may read it in the wrong encoding otherwise.

**No dependencies.** The installer uses only Node's standard library, so there
is nothing to install, audit or update.

**The installer only ever touches what it made.** Skill folders carry a
`.going-dark` marker, and rules live between the `going-dark:start` and
`going-dark:end` markers. Never change that contract without a major version.

**Versions move together.** `plugins/go-dark/.claude-plugin/plugin.json` and
`package.json` carry the same version; `npm run check` fails if they differ.
Add an entry to `CHANGELOG.md` in the same change.

**No AI attribution** in commits, pull request descriptions or code comments.

## Verify before reporting done

```
npm test
npm run check
claude plugin validate --strict plugins/go-dark
```

CI runs the first two on Linux, Windows and macOS, on Node 20 and 24.
