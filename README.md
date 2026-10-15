# GOING DARK

A method for AI coding agents, for running a software project one strict way:
issues written as specifications, handoff prompts any agent can follow, audits
that fix what they find, and one flow from issue to release.

It works with **Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot, Cursor,
and any agent that reads `AGENTS.md`**. The skills are plain Markdown in the
open [Agent Skills](https://agentskills.io) format, and a small installer puts
them where each agent looks.

It is opinionated on purpose. It is one maintainer's method, used daily on a
real product, packaged so it works in any project.

## Install

### Claude Code

```
/plugin marketplace add reyxdz/going-dark
/plugin install go-dark@going-dark
```

Commands are `/go-dark:<skill>`, and the standing rules load at every session
start.

### Every other agent

With Node.js 20 or later, run the installer straight from GitHub — nothing is
installed globally:

```
npx github:reyxdz/going-dark install --agent codex
```

| `--agent` | Agent | `--scope user` (every project) | `--scope project` (this project) |
|---|---|---|---|
| `codex` | OpenAI Codex | skills in `~/.agents/skills`, rules in `~/.codex/AGENTS.md` | `.agents/skills`, `AGENTS.md` |
| `gemini` | Gemini CLI | skills in `~/.agents/skills`, rules in `~/.gemini/GEMINI.md` | `.agents/skills`, `GEMINI.md` |
| `copilot` | GitHub Copilot | skills in `~/.agents/skills`, rules in `~/.copilot/copilot-instructions.md` | `.agents/skills`, `AGENTS.md` |
| `cursor` | Cursor | skills in `~/.agents/skills` (its user rules live in Settings → Rules) | `.agents/skills`, `AGENTS.md` |
| `agents` | Any agent that reads `AGENTS.md` | — | `.agents/skills`, `AGENTS.md` |

Outside Claude Code each skill is named `go-dark-<skill>`. The rules go into
the rules file inside a marked block that lists every skill and the file to
read, so even an agent without native skill support finds and follows them.
The installer never touches anything else in that file, refuses to overwrite a
folder it did not create, and `uninstall` removes exactly what it added.

```
npx github:reyxdz/going-dark install --agent cursor --scope project --dry-run
npx github:reyxdz/going-dark uninstall --agent codex
npx github:reyxdz/going-dark agents
```

To stay on one release, add its tag — `npx github:reyxdz/going-dark#v0.5.1 …`.
Every release is listed in the [changelog](CHANGELOG.md).

## Skills

| Skill | Claude Code | Use it to |
|---|---|---|
| project-flow | `/go-dark:project-flow` | See where a piece of work stands and what comes next, or whether it is really finished |
| write-issue | `/go-dark:write-issue` | Write an issue as a specification, or check one is ready to build from |
| write-handoff | `/go-dark:write-handoff` | Write a handoff prompt an agent can carry out without guessing |
| audit-pr | `/go-dark:audit-pr` | Audit a pull request line by line: "perfectly safe to merge", or every fix down to a single typo — and make those fixes |
| project-context | `/go-dark:project-context` | Set up or refresh a project's `AGENTS.md`, constraints, and the checks that enforce its rules |

In every agent, the skill also triggers by itself when what you ask matches it.

## The flow

Issue → decide → handoff → build → audit → merge → verify on staging →
release → close out. Each step has an exit condition, and work counts as
finished when users have it and the records say so, not when the code merges.

## Standing rules

[`plugins/go-dark/rules.md`](./plugins/go-dark/rules.md) applies in every
session, in every project:

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

**A project's own rules always win.** Where a project's `AGENTS.md`,
`CLAUDE.md` or contributing guide says otherwise, the agent follows the project
and says which rule it overrode.

## Documentation

The full documentation is in [`docs/`](./docs/README.md):

- [Getting started](./docs/getting-started.md) — install for your agent, check
  it works, first project.
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

## Develop

```
npm test        # the installer's tests (Node's built-in runner, no dependencies)
npm run check   # manifests, skills and every documentation link
```

Both run in GitHub Actions on every push and pull request.

## License

MIT — see [LICENSE](./LICENSE).
