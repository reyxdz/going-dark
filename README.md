# GOING DARK

A Claude Code plugin for running a software project one strict way: issues
written as specifications, handoff prompts any agent can follow, audits that
fix what they find, and one flow from issue to release.

It is opinionated on purpose. It is one maintainer's method, used daily on a
real product, packaged so it works in any project.

## Install

In Claude Code:

```
/plugin marketplace add reyxdz/going-dark
/plugin install go-dark@going-dark
```

Or from a terminal:

```
claude plugin marketplace add reyxdz/going-dark
claude plugin install go-dark@going-dark
```

Restart Claude Code. The plugin is installed for your user, so it works in
every project.

## Commands

| Command | Use it to |
|---|---|
| `/go-dark:project-flow` | See where a piece of work stands and what comes next, or whether it is really finished |
| `/go-dark:write-issue` | Write an issue as a specification, or check one is ready to build from |
| `/go-dark:write-handoff` | Write a handoff prompt an agent can carry out without guessing |
| `/go-dark:audit-pr` | Audit a pull request to "perfectly safe to merge", and fix what it finds |
| `/go-dark:project-context` | Set up or refresh a project's `CLAUDE.md`, its constraints, and the checks that enforce its rules |

Claude also picks a skill up by itself when what you ask matches it.

## The flow

Issue → decide → handoff → build → audit → merge → verify on staging →
release → close out. Each step has an exit condition, and work counts as
finished when users have it and the records say so, not when the code merges.

## Standing rules

`plugins/go-dark/rules.md` loads at the start of every session, in every
project:

1. **Minimal local load** — read the code and lean on CI; run only the
   narrowest checks locally, and stop whatever you start.
2. **Git safety** — never force-push; branch fresh from the default branch;
   check a pull request is still open before pushing to it.
3. **Secrets** — never printed, copied, committed or screenshotted.
4. **No AI attribution** in commits, pull requests or code comments.
5. **Roles** — only the project's owner approves, merges and releases.
6. **Dashboards** — instructions name the exact workspace, project,
   environment and click path.
7. **Honest reports** — say what ran and what did not.

**A project's own rules always win.** Where a project's `CLAUDE.md`,
`AGENTS.md` or contributing guide says otherwise, Claude follows the project
and says which rule it overrode. Each skill starts by reading the project's
own conventions, and uses this method only where the project has none.

## Documentation

The full documentation is in [`docs/`](./docs/README.md):

- [Getting started](./docs/getting-started.md) — install, check it works,
  first project.
- [The flow](./docs/the-flow.md) and [standing rules](./docs/standing-rules.md).
- One page per skill, each with a ready-to-use template:
  [project flow](./docs/skills/project-flow.md),
  [write an issue](./docs/skills/write-issue.md),
  [write a handoff](./docs/skills/write-handoff.md),
  [audit a pull request](./docs/skills/audit-pr.md),
  [project context](./docs/skills/project-context.md).
- [Customising](./docs/customising.md),
  [how it is built](./docs/how-it-is-built.md),
  [troubleshooting and FAQ](./docs/troubleshooting.md).

## Update or remove

```
claude plugin marketplace update going-dark
claude plugin uninstall go-dark@going-dark
claude plugin marketplace remove going-dark
```

## License

MIT — see [LICENSE](./LICENSE).
