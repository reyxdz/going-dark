# Getting started

This page takes you from nothing to using going-dark on a real project, in the
agent you already use.

## 1. What you need

| Need | For | Check |
|---|---|---|
| An AI coding agent | Claude Code, Codex, Gemini CLI, Copilot, Cursor, or any agent that reads `AGENTS.md` | — |
| `git` | Every skill reads and works with a repository | `git --version` |
| Node.js 20 or later | The installer, for every agent except Claude Code | `node --version` |
| GitHub CLI `gh`, signed in (recommended) | The issue and audit skills read and edit issues and pull requests through it | `gh auth status` |

Nothing runs in the background, and nothing is installed globally.

## 2. Install

### Claude Code

Inside Claude Code:

```
/plugin marketplace add reyxdz/going-dark
/plugin install go-dark@going-dark
```

Or from a terminal, choosing the scope:

```
claude plugin marketplace add reyxdz/going-dark
claude plugin install go-dark@going-dark --scope user
```

| Scope | Applies to | Recorded in |
|---|---|---|
| `user` (default) | Every project you open on this machine | your user settings |
| `project` | One project, for everyone who opens it | the project's `.claude/settings.json` |
| `local` | One project, only for you | the project's `.claude/settings.local.json` (not committed) |

Restart Claude Code. Skills and hooks load when a session starts.

### Codex, Gemini CLI, Copilot, Cursor and any other agent

Run the installer from GitHub with `npx`:

```
npx github:reyxdz/going-dark install --agent <agent> [--scope user|project]
```

| `--agent` | Agent | `--scope user` | `--scope project` |
|---|---|---|---|
| `codex` | OpenAI Codex | skills `~/.agents/skills`, rules `~/.codex/AGENTS.md` | skills `.agents/skills`, rules `AGENTS.md` |
| `gemini` | Gemini CLI | skills `~/.agents/skills`, rules `~/.gemini/GEMINI.md` | skills `.agents/skills`, rules `GEMINI.md` |
| `copilot` | GitHub Copilot | skills `~/.agents/skills`, rules `~/.copilot/copilot-instructions.md` | skills `.agents/skills`, rules `AGENTS.md` |
| `cursor` | Cursor | skills `~/.agents/skills` (Cursor keeps user rules in Settings → Rules, so use `--scope project` for the rules) | skills `.agents/skills`, rules `AGENTS.md` |
| `agents` | Any agent that reads `AGENTS.md` | not available | skills `.agents/skills`, rules `AGENTS.md` |

- **The default scope** is `user` where the agent supports it, otherwise
  `project`.
- **`--scope project`** installs into the current folder; add
  `--project <dir>` to choose another.
- **`--dry-run`** shows every file it would change, and changes nothing.
- **`npx github:reyxdz/going-dark agents`** prints the exact paths on your
  machine.

`.agents/skills` is the skills folder Codex, Gemini CLI, GitHub Copilot and
Cursor all read, so installing for several of them keeps a single copy. Gemini
CLI reads `GEMINI.md`, not `AGENTS.md`, unless its `context.fileName` setting
names `AGENTS.md` — so its rules go into `GEMINI.md`.

**What it changes, exactly:**

1. **Skills** — seven folders, `go-dark-audit-pr` … `go-dark-write-issue`, each
   with a `SKILL.md` and a `.going-dark` marker file. If a folder of that name
   already exists *without* the marker, it stops and changes nothing.
2. **Rules** — one block in the rules file, between
   `<!-- going-dark:start … -->` and `<!-- going-dark:end -->`. It holds the
   standing rules and a list of every skill with the file to read, so an agent
   without native skill support still finds and follows them. Everything else
   in the file is left exactly as it was. Running the installer again replaces
   the block; it never adds a second one.

Start a new session in your agent to pick the changes up.

## 3. Check it works

**Claude Code**

1. `claude plugin list` shows `go-dark@going-dark`, **enabled**.
2. `claude plugin details go-dark` lists **7 skills** and **1 hook**.
3. In a new session, typing `/go-dark:` shows the seven commands.

**Other agents**

1. The rules file you installed to contains the `going-dark:start` block.
2. The skills folder contains the seven `go-dark-*` folders.

**Every agent:** ask *"Which going-dark standing rules are you following?"* It
should list the seven rules from [Standing rules](./standing-rules.md). If it
cannot, see [Troubleshooting](./troubleshooting.md#the-standing-rules-do-not-load).

## 4. Your first project

Open your agent in the repository you want to work on. In Claude Code you can
type the commands; in any agent you can simply ask, and the matching skill is
used.

1. **Give it its context.** *"Set this project up"* —
   `/go-dark:project-context` in Claude Code. The agent reads the repository,
   asks you what the code cannot show (who decides, the real-world limits,
   what must never happen), and proposes an `AGENTS.md`, a constraints document
   and the checks that enforce the critical rules. Nothing is committed until
   you have seen it. Skip this if the project already has good instructions —
   run it later to refresh.
2. **Turn an idea into an issue.** Describe what you want, then *"write the
   issue"* — `/go-dark:write-issue`. The agent asks the questions only you can
   answer, then drafts the issue and shows it before creating anything.
3. **Plan who builds it.** If an agent or a teammate will carry it out,
   *"write a handoff for #12"* — `/go-dark:write-handoff`.
4. **Audit what comes back.** *"Audit pull request 42"* — `/go-dark:audit-pr`.
   The agent merges the current default branch in a scratch copy, reads the
   change, fixes what needs fixing on the branch, and reports.
5. **Keep track.** *"Is #12 finished?"* — `/go-dark:project-flow` — tells you
   where the work stands and what comes next.

## 5. Update, pause or remove

**Claude Code**

| To | Run |
|---|---|
| Get the latest version | `claude plugin marketplace update going-dark`, then restart |
| Pause it, keep it installed | `claude plugin disable go-dark@going-dark` |
| Turn it back on | `claude plugin enable go-dark@going-dark` |
| Remove it | `claude plugin uninstall go-dark@going-dark`, then `claude plugin marketplace remove going-dark` |

**Other agents**

| To | Run |
|---|---|
| Get the latest version | the same `install` command again — `npx` fetches the latest |
| Stay on one version | add the release tag: `npx github:reyxdz/going-dark#v0.7.0 install --agent <agent>` |
| Remove it | `npx github:reyxdz/going-dark uninstall --agent <agent> [--scope …]` |

`uninstall` removes exactly what `install` added: the marked skill folders, the
folders it created if they are left empty, and the rules block — restoring the
rules file as it was, or deleting it if going-dark had created it. Because
`~/.agents/skills` is shared, uninstalling for one agent removes the skills for
the others that read that folder too.
