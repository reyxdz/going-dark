# Getting started

This page takes you from nothing to using going-dark on a real project.

## 1. What you need

| Need | Why | Check |
|---|---|---|
| Claude Code with plugin support | going-dark is a Claude Code plugin | `claude --version` |
| `git` | Every skill reads and works with a repository | `git --version` |
| `bash` | The standing rules load through a hook that runs in bash. On Windows, Git for Windows provides it | `bash --version` |
| GitHub CLI `gh`, signed in (recommended) | The issue and audit skills read and edit issues and pull requests through it | `gh auth status` |

Nothing else is installed: no packages, no servers, no background processes.

## 2. Install

Inside Claude Code:

```
/plugin marketplace add reyxdz/going-dark
/plugin install go-dark@going-dark
```

Or from a terminal:

```
claude plugin marketplace add reyxdz/going-dark
claude plugin install go-dark@going-dark
```

**Choose where it applies** with `--scope` on the terminal command:

| Scope | Applies to | Use it when |
|---|---|---|
| `user` (default) | Every project you open on this machine | It is your working method everywhere |
| `project` | One project, for everyone who opens it — recorded in that project's `.claude/settings.json` | A team agrees to work this way in one repository |
| `local` | One project, only for you — recorded in `.claude/settings.local.json`, which is not committed | You want it in one repository without imposing it on others |

```
claude plugin install go-dark@going-dark --scope project
```

Then **restart Claude Code**. Skills and hooks load when a session starts.

## 3. Check it works

1. In a terminal: `claude plugin list`. You should see `go-dark@going-dark`,
   status **enabled**.
2. `claude plugin details go-dark` lists **5 skills** and **1 hook**
   (`SessionStart`).
3. In a new Claude Code session, type `/go-dark:`. Five commands appear:
   `audit-pr`, `project-context`, `project-flow`, `write-handoff`,
   `write-issue`.
4. Ask Claude: *"Which going-dark standing rules are you following?"* It
   should list the seven rules from [Standing rules](./standing-rules.md). If
   it cannot, see [Troubleshooting](./troubleshooting.md#the-standing-rules-do-not-load).

## 4. Your first project

Open Claude Code in the repository you want to work on.

1. **Give it its context.** Run `/go-dark:project-context`. Claude reads the
   repository, asks you what the code cannot show (who decides, the real-world
   limits, what must never happen), and proposes a `CLAUDE.md`, a constraints
   document and the checks that enforce the critical rules. Nothing is
   committed until you have seen it. Skip this if the project already has a
   good `CLAUDE.md` — run it later to refresh.
2. **Turn an idea into an issue.** Describe what you want, then run
   `/go-dark:write-issue`. Claude asks the questions only you can answer, then
   drafts the issue and shows it before creating anything on GitHub.
3. **Plan who builds it.** If an agent or a teammate will carry it out, run
   `/go-dark:write-handoff` for the issue.
4. **Audit what comes back.** For each pull request, run
   `/go-dark:audit-pr <url or number>`. Claude merges the current default
   branch in a scratch copy, reads the change, fixes what needs fixing on the
   branch, and reports.
5. **Keep track.** At any point, `/go-dark:project-flow` tells you where the
   work stands and what comes next.

You do not have to type the commands. Claude also picks a skill up by itself
when what you ask matches it — "audit this pull request", "write an issue for
this", "is #12 finished?".

## 5. Update, pause or remove

| To | Run |
|---|---|
| Get the latest version | `claude plugin marketplace update going-dark`, then restart |
| Pause it, keep it installed | `claude plugin disable go-dark@going-dark` |
| Turn it back on | `claude plugin enable go-dark@going-dark` |
| Remove it | `claude plugin uninstall go-dark@going-dark` |
| Forget the source too | `claude plugin marketplace remove going-dark` |

Removing it changes nothing in your projects: it never writes to a project
unless you ask it to.
