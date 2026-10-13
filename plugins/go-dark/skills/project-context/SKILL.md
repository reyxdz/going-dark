---
name: project-context
description: Use when starting work in a project for the first time, when a project has no AGENTS.md or CLAUDE.md, or its rules are missing or out of date, or when asked to set up or refresh what an agent must know, do and never do in a project.
---

# Project context

## Overview

An agent knows a project through three layers. Set up all three, keep each
short, and point from one to the next rather than copying content.

| Layer | What it holds | Where |
|---|---|---|
| **Know** | What to read first, the do's and don'ts with their reasons, one real file to imitate per kind of work | `AGENTS.md` at the repository root, read by most agents; for Claude Code, a `CLAUDE.md` containing `@AGENTS.md` |
| **Why** | The realities that make general instinct wrong here, the decisions already made, how work is done | `docs/` — constraints, decision records, plans, guides |
| **Never** | Rules that must not depend on being remembered | Git hooks, CI checks, a pull request template, and the agent's own settings (for Claude Code, `.claude/settings.json`) |

## Setting it up

1. **Read the repository** without running anything heavy: README, package
   files and scripts, CI workflows, existing docs, the source tree's layout,
   the last 30 commits, open issues and pull requests.
2. **Ask what the code cannot show** — as questions with two to four options
   each (in Claude Code, the AskUserQuestion tool):
   - who decides and who merges;
   - the real-world limits: users, devices, budget, hosting, law;
   - what must never happen;
   - where staging and production live;
   - **which AI agents the team uses** (this decides `CLAUDE.md` and agent
     settings files);
   - **which don'ts to enforce**, rather than only write down.
   If the owner is not available, draft every file with `[OWNER: question]`
   placeholders, list the questions, and commit nothing.
3. **Write `AGENTS.md`**, short — and, if anyone uses Claude Code, a
   `CLAUDE.md` whose only line is `@AGENTS.md`, so both read one file. (If
   the project already has a full `CLAUDE.md`, extend that instead.) It holds:
   - *Start here*: what to read always, what to read by task, and "do not load
     the whole docs tree".
   - *Do's and don'ts*, each with its reason in one line.
   - *Imitate*: a table of one **real** file per kind of work, picked from the
     source tree.
   - *Verify before reporting done*: the exact commands — the narrowest ones,
     checked against how the scripts are defined so the flags work.
4. **Write `docs/explanation/constraints.md`**: the few realities that look
   wrong by general instinct and are right here. Mark anything only the owner
   can confirm as unconfirmed rather than inventing it.
5. **Start a decision log** (`docs/decisions/`, numbered, with an index) if
   none exists. Its first record can be this setup itself: agent instructions
   live in `AGENTS.md`.
6. **Enforce the don'ts the owner chose:**
   - a git hook, with how it is switched on in a fresh clone (for example
     `git config core.hooksPath .githooks`, run by a setup or `prepare`
     script) — and a CI job running the same check, because a fresh clone has
     no hooks until then;
   - a pull request template whose sections the CI check can require;
   - the agents' own settings where they support them: deny force-pushes and
     reading `.env` files.
7. **Show the user every file before committing**, and with their go-ahead,
   land them as one pull request from a fresh branch — the project's normal
   flow, or this one if it has none.

## Refreshing it

Compare each claim in `AGENTS.md` (or `CLAUDE.md`) and the constraints with the
code and recent history. Report what is stale, missing or contradicted, fix it
in one pull request, and save anything the repository cannot hold (personal
preferences, dashboard paths) to the agent's memory instead.

## Keep out of the repository

Personal instructions, private policy files and anything naming another
client's project. Those belong in the user's own configuration.
