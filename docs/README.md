# going-dark documentation

Everything about going-dark: what it does, how to install it in your agent, how
each part works, and how to change it.

Read in this order the first time:

1. [Getting started](./getting-started.md) — install it for Claude Code, Codex,
   Gemini CLI, Copilot, Cursor or any agent; check it works; use it on a
   project for the first time.
2. [The flow](./the-flow.md) — the nine steps every piece of work goes
   through. The skills all hang off this.
3. [Standing rules](./standing-rules.md) — the seven rules in force in every
   session, and how a project overrides them.

Then the skill you need. In Claude Code you type the command; in any agent you
can ask for what you want, or name the skill.

| Page | Claude Code | Other agents | Covers |
|---|---|---|---|
| [Project flow](./skills/project-flow.md) | `/go-dark:project-flow` | `go-dark-project-flow` | Where work stands, what comes next, "is this finished?" |
| [Write an issue](./skills/write-issue.md) | `/go-dark:write-issue` | `go-dark-write-issue` | Issues as specifications, with a full template |
| [Write a handoff](./skills/write-handoff.md) | `/go-dark:write-handoff` | `go-dark-write-handoff` | Handoff prompts any agent can follow, with a skeleton |
| [Audit a pull request](./skills/audit-pr.md) | `/go-dark:audit-pr` | `go-dark-audit-pr` | The two verdicts, the checklist, the line-by-line pass, fixing, the report |
| [Project context](./skills/project-context.md) | `/go-dark:project-context` | `go-dark-project-context` | `AGENTS.md`, constraints and enforced rules for a project |

And when you want more:

- [Customising](./customising.md) — making a project override the method,
  installing it for one project, forking it.
- [How it is built](./how-it-is-built.md) — every file, the installer, the
  Agent Skills format, the check and the tests, releasing a change.
- [Troubleshooting and FAQ](./troubleshooting.md) — when skills don't appear,
  the rules don't load, or a project disagrees.

## The idea in one paragraph

Work fails in the gaps between people and agents: an issue that leaves the
real question open, a handoff that assumes context the reader lacks, a review
that lists problems instead of fixing them, a feature called "done" because its
code merged. going-dark closes those gaps with one standard for each step and
one flow that connects them, in every project and every agent you use —
while always deferring to that project's own rules.
