# `/go-dark:project-context`

> **Claude Code:** `/go-dark:project-context` · **Other agents:** the `go-dark-project-context` skill — ask for it by what you want, or by name.

## When it runs

- `/go-dark:project-context` in a project for the first time.
- A project has no `AGENTS.md` or `CLAUDE.md`, or its rules are out of date.
- "Set this project up for agents", "what are the do's and don'ts here?",
  "refresh the project rules".

## What it does

An agent knows a project through three layers, and this skill sets up all
three. **Know** is `AGENTS.md`, which most agents read at the start of every
session. **Why** is `docs/explanation/constraints.md` and `docs/decisions/`.
**Never** is git hooks, a CI check, a pull request template and the agents' own
settings.

If `AGENTS.md`, `CLAUDE.md` and `GEMINI.md` are all missing, it runs the setup
steps. If one exists, it runs Refresh instead.

**It never touches your own folder.** It notes your branch and `git status` at
the start, writes every file in a separate work copy (a git worktree on a new
branch), and checks at the end that your folder is exactly as it was.

### Setting a project up

1. **Read the repository** — files, the last 30 commits, recent issues and
   pull requests, the README, package file, CI workflows, docs, hooks and
   scripts. It records the language, scripts, what CI runs, every check the
   project already has, the default branch and the project's name. It runs
   nothing heavy: no installs, builds, servers or Docker.
2. **Pick one imitate file per kind of work** — one real file for each of
   route, table, component, page, data code and test, checked with
   `git ls-files`.
3. **Find the exact commands that check work** — typecheck, lint, all tests
   and one test file, taken only from the scripts and CI.
4. **Ask the owner** — eight questions in two rounds. Round one: who merges
   (Q1), which AI agents the team uses (Q2), which rules a check should
   enforce (Q3), and where staging and production run (Q4). Round two, in the
   owner's own words: who uses the product (Q5), what limits the code must
   respect (Q6), what must never happen (Q7), and what the project is (Q8).
   It waits for the answers. An unanswered question becomes
   `[OWNER: <the question>]`. It never treats its own recommended option as the
   owner's answer.
5. **Make the work copy** — a git worktree on a free branch,
   `docs/agent-context` (or with today's date added if that name is taken),
   from the latest default branch. If it cannot be made, it stops and asks —
   it never switches your folder instead.
6. **Write `AGENTS.md`** — under 120 lines, every rule with a one-line reason.
   It holds a start-here list, the do's and don'ts, the imitate table, the
   verify commands and where the project runs.
7. **Write the pointer files** — if the team uses Claude Code, a `CLAUDE.md`
   containing only `@AGENTS.md`; the same for Gemini CLI. An existing
   `CLAUDE.md` has its content moved into `AGENTS.md` first, and the owner is
   told. Codex, Copilot and Cursor read `AGENTS.md` directly.
8. **Write `docs/explanation/constraints.md`** — one section per real limit
   from Q5 to Q7, each stating the reality, the rule it leads to, what people
   would normally do instead, and who confirmed it.
9. **Start the decision log** — `docs/decisions/` with an index and a first
   record that agent instructions live in `AGENTS.md`. Skipped if a log
   already exists.
10. **Enforce the don'ts the owner chose** — skipped if the owner chose none.
    It first reuses what the project already has: an existing hook, the exact
    pattern of an existing check of the same rule, and an existing script that
    switches hooks on. Only what is missing is added:
    - a git hook for each chosen rule (`commit-msg` for AI attribution,
      `pre-commit` for `.env` files);
    - a way to switch the hooks on in every clone (a `prepare` script, or a
      line in the README);
    - a CI workflow running the same checks, since a fresh clone has no hooks;
    - a pull request template, if there is none;
    - for Claude Code, `.claude/settings.json` denying force-pushes and
      reading `.env` files.
11. **Show the owner every file** — it sends the full content and waits for a
    yes. It also gives the two GitHub settings only the owner can change: block
    force-pushes to the default branch, and require the `agent-rules` check.
12. **Land it as one pull request** — from the work copy, only the files
    shown to the owner. It removes the work copy, confirms your folder is
    unchanged, and sends the link. It does not merge.

### Refreshing a project

Refresh reads the repository again (steps 1 to 3), then:

1. **Asks which AI agents the team uses**, and checks each one reads a file
   that holds the instructions — Codex, Copilot and Cursor read `AGENTS.md`,
   not `CLAUDE.md`. If one does not, it asks whether to move the instructions
   to `AGENTS.md`.
2. **Checks every claim** in the instruction files, the constraints, and the
   files they tell agents to read first, as **Correct**, **Stale**,
   **Contradicted** or **Missing** — and whether each don't is enforced.
3. **Follows every wrong claim** through the repository with `git grep`: each
   other file that repeats it gets its own row.
4. **Sends you one table** — one row per claim per file, with the evidence and
   the proposed fix — and waits. "Fix them" approves the concrete fixes; each
   yes/no question needs its own answer. A file with no approved row is never
   changed.
5. **Shows you every changed file and waits again** — nothing is committed
   until you say "open the pull request". Then it lands the fixes from a work
   copy as one pull request on `docs/refresh-agent-context`.

Personal preferences and dashboard paths go to the agent's own memory, not to
the repository.

## What you get

Up to these files, shown to you before anything is committed:

- `AGENTS.md`, and a `CLAUDE.md` or `GEMINI.md` that holds only the line
  `@AGENTS.md`;
- `docs/explanation/constraints.md` and a numbered decision log;
- the hooks, the `agent-rules` CI workflow, a pull request template and
  `.claude/settings.json`, for the rules you chose to enforce;
- one pull request, once you say yes.

Anything it could not confirm stays in the files as `[OWNER: <question>]`, and
the message lists each one under "Still open".

## What it never does

- Never invents a fact about the project. Every command, path and limit comes
  from the repository, a command it ran, or the owner.
- Never commits, pushes or opens a pull request before you have seen every file
  and said yes. If any `[OWNER: …]` is left, or you are away, it commits
  nothing.
- Never merges the pull request, and never adds AI attribution to a commit.
- Never puts personal instructions, another client's project, or secrets of any
  kind into the repository.
- Never switches your folder's branch or writes files in it.
- Never runs installs, builds, servers, Docker or browsers.

## Exact templates and wording

Every template, command and checklist is in [the skill itself](../../plugins/go-dark/skills/project-context/SKILL.md).
