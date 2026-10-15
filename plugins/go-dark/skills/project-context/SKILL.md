---
name: project-context
description: Use when starting work in a project for the first time, when a project has no AGENTS.md or CLAUDE.md, or its rules are missing or out of date, or when asked to set up or refresh what an agent must know, do and never do in a project.
---

# Project context

## What this skill is for

An agent knows a project through three layers. This skill sets up all three,
or refreshes them.

| Layer | What it holds | Where |
|---|---|---|
| **Know** | What to read first, the do's and don'ts with their reasons, one real file to copy per kind of work, the commands that check work | `AGENTS.md` at the repository root. Most agents read it. Claude Code and Gemini CLI get a one-line file pointing to it. |
| **Why** | The realities that make general instinct wrong here, and the decisions already made | `docs/explanation/constraints.md` and `docs/decisions/` |
| **Never** | Rules that must not depend on anyone remembering them | Git hooks, a CI check, a pull request template, the agents' own settings |

**First, decide which part of this file to follow:**

- `git ls-files AGENTS.md CLAUDE.md GEMINI.md` lists nothing → **Set up**
  (Steps 1–12).
- It lists a file → **Refresh** (the section near the end).

## How to follow this file

1. Do the steps in order. Do not skip a step. Do not change the order.
2. Each step has three parts:
   - **Do** — what to do. Commands and file contents are shown in code blocks.
     Replace every `<word in angle brackets>` with the real value and remove
     the brackets. Copy everything else exactly.
   - **Check** — what must be true before you go on.
   - **If not** — what to do when the check fails.
3. When this file says **STOP**, stop working, send the message it gives, and
   wait for the answer.
4. Never invent a fact about the project. Every command, path, name and limit
   you write must come from the repository, a command you ran, or the owner.
   Anything only the owner can confirm, and has not, is written as
   `[OWNER: <the question>]`.
5. When you cannot check something — a command fails, a file is missing —
   do not guess. Write `[OWNER: …]` in the file, or note it for the report.
6. Do not run anything heavy: no installs, builds, servers, Docker or
   browsers. Reading files and running `git` and `gh` is enough.
7. **Never change the person's own folder.** Do not switch its branch, and do
   not create, edit or delete files in it. Every file this skill writes is
   written in the **work copy** (Step 5, or Refresh step 6). Two commands do
   run in the person's folder, and that is allowed, because they change
   neither its branch nor its files: `git fetch origin`, and the
   `git worktree add` that makes the work copy.
8. Do not commit, push or open a pull request until the owner has seen every
   change and said yes.

## Words used in this file

| Word | Meaning |
|---|---|
| **owner** | The person who decides and merges. If the repository does not say, it is the person who asked you. |
| **the person's folder** | The folder the person is working in — their own checkout of the repository: the folder you were started in (`git rev-parse --show-toplevel` prints its root). You only read it. |
| **work copy** | A separate checkout of the repository (a git worktree) on a new branch, in the scratch folder. Every file this skill writes goes here. |
| **scratch folder** | A folder outside the repository for temporary files. Use the one your tool gives you (a scratchpad or temp folder). If it gives none: `/tmp/going-dark` on macOS and Linux, `%TEMP%\going-dark` on Windows. |
| **instruction files** | `AGENTS.md`, `CLAUDE.md` and `GEMINI.md` — the files agents read at the start of every task. |
| **don't** | A rule about something that must never happen, for example "never commit a `.env` file". |
| **enforce** | Make a don't impossible to break by accident: a hook stops it on the contributor's machine, and CI stops it on GitHub. |
| **hook** | A script git runs before a commit. Hooks live in `.githooks/` and are switched on per clone. |
| **CI** | The checks GitHub runs on every pull request, in `.github/workflows/`. |
| **decision record (ADR)** | A short numbered document in `docs/decisions/` recording a choice that is expensive to undo. |
| **imitate file** | A real file in the repository that shows the right way to write one kind of thing (an API route, a database table, a UI component, a test). |
| **short** | `AGENTS.md` under 120 lines. Each rule one line, each reason one line. |

### Which agent reads which file

| Agent | Reads at the start of every task |
|---|---|
| Claude Code | `CLAUDE.md` (which can point to `AGENTS.md` with the line `@AGENTS.md`) |
| Gemini CLI | `GEMINI.md` (which can point to `AGENTS.md` with the line `@AGENTS.md`) |
| Codex | `AGENTS.md` |
| GitHub Copilot | `AGENTS.md` |
| Cursor | `AGENTS.md` |

An agent the team uses that is not in this table: ask the owner which file it
reads.

## Step 1 — Read the repository

**Do:**

1. Note how the person's folder is now, so you can prove at the end that you
   did not change it:
   ```
   git branch --show-current
   git status --short
   ```
   Write both outputs down.
2. Get the latest state, then run each command and read what it shows:
   ```
   git fetch origin
   git ls-files
   git log --oneline -30
   gh issue list --state all --limit 10
   gh pr list --state all --limit 10
   ```
3. Read each of these that exists: `README.md`, the package file
   (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`
   or `Gemfile`), every file in `.github/workflows/`, every file in `docs/`,
   `.github/CODEOWNERS`, and every file in `.githooks/` and `scripts/`.

Write down:
1. The language and framework.
2. The folders where the code lives (for example `src/`, `app/`, `backend/`).
3. The scripts in the package file (for `package.json`, everything under
   `"scripts"`).
4. What CI runs, and every check the project already has — hooks in
   `.githooks/`, scripts that check pull requests, a script that switches
   hooks on (look for `core.hooksPath`).
5. Names, words and areas that appear in recent commits and issues (for
   example "Stripe", "teacher login") — these are clues to what the project
   does.
6. The default branch and the repository's full name (`<owner>/<repo>`):
   `gh repo view --json defaultBranchRef,nameWithOwner --jq '.defaultBranchRef.name, .nameWithOwner'`.
7. The project's name: the `"name"` in the package file, or the first
   heading of `README.md`.
8. Today's date, as `YYYY-MM-DD`, from your environment.

**Check:** you have the two outputs from item 1, and all eight.

**If not:** for each one you could not find, write `[OWNER: <the question>]`
wherever a later step uses it, and go on.

## Step 2 — Pick one imitate file per kind of work

**Do:**

1. List the files changed most often recently:
   ```
   git log --name-only --format= -50
   ```
2. For each kind of work this project has — API route, database table or
   migration, UI component, page, data-loading code, test — pick **one real
   file** that does it. Prefer a file that appears often in the list above.
3. Check each pick exists:
   ```
   git ls-files <path>
   ```

**Check:** every pick printed its own path.

**If not:** pick another file. If the project has no file of that kind, leave
that kind out. If you could not pick a single file (for example the commands
did not run), the Imitate table in Step 6 gets one row:
`| [OWNER: which file shows the right way to write <kind>?] | — |`.

## Step 3 — Find the exact commands that check work

**Do:** for each check, find the command in the package file's scripts or in
the CI workflow, and write it exactly.

| Check | Where to look | Example |
|---|---|---|
| Typecheck | a script named `typecheck` or `tsc`; or `tsconfig.json` exists | `npm run typecheck`, or `npx tsc --noEmit` |
| Lint | a script named `lint` | `npm run lint` |
| Tests, all | a script named `test` | `npm test` |
| Tests, one file | the `test` script: pass the file through it | `npm test -- <file>` (works when the script runs `vitest run`, `jest` or similar); for Python `pytest <file>`; for Go `go test ./<package>` |

In a project with several packages (for example `backend/` and `frontend/`,
each with its own `package.json`), write the one-file test command for each,
for example `npm --prefix backend run test -- <file>`. Never use a command
that builds or starts the app (`build`, `dev`, `start`) as a check.

**Check:** each command is built only from what the scripts and workflow
show.

**If not:** write `[OWNER: how do you run <check>?]`.

## Step 4 — Ask the owner

**Do:**

1. If your tool has a built-in way to ask questions with clickable options
   (in Claude Code, the AskUserQuestion tool), use it. Otherwise send these
   two messages, one at a time, and wait for the answer to the first before
   sending the second. Fill in the options from what you found in Step 1.
   Where you found nothing to fill an option with (no handle for Q1 A, no
   hosting for Q4 A), leave that option out and keep the others.

   **Message 1:**
   ```
   To set this project up for AI agents I need your answers to 8 questions, in two rounds.

   Q1. Who decides what is built and who merges pull requests?
     A. Only <the handle with the most merged pull requests> (recommended)
     B. Any maintainer, after one review
     C. Someone else — write their GitHub username

   Q2. Which AI agents does your team use? (pick all that apply)
     A. Claude Code
     B. Codex
     C. GitHub Copilot
     D. Cursor, Gemini CLI or another — write which

   Q3. Which rules should be enforced by a check, not only written down?
     A. Both: no AI attribution in commits, and no .env files committed (recommended)
     B. Only: no .env files committed
     C. Only: no AI attribution in commits
     D. None — write them down only

   Q4. Where do staging and production run?
     A. <what you found, e.g. "Vercel and Render"> — confirm or correct
     B. There is no staging
     C. Write your own answer

   Reply like "Q1 A, Q2 A B, Q3 A, Q4 A", or write your own answers.
   ```

   **Message 2:**
   ```
   Q5. Who uses the product, and on what devices? (for example "teachers, on school laptops and cheap Android phones")
   Q6. What limits must the code respect? Money, hosting memory, data, law — anything that makes the usual way wrong here.
   Q7. What must never happen? (for example "a student sees another student's marks")
   Q8. What is the project, in one sentence? (I found: <the clues from Step 1>)

   Write your answers in your own words. "Skip" is fine for any of them.
   ```
2. **STOP.** Wait for the answers.

**Check:** you have an answer, or "skip", for all eight.

**If not:**
- **The owner is not available** (they said so, or the task says so): do not
  send the messages. Go on, and treat all eight as unanswered.
- **Some answers are missing:** go on with the ones you have.
- Every unanswered question becomes `[OWNER: <the question>]` wherever a later
  step uses its answer. A step that only runs for a certain answer (Step 7
  needs Q2; Step 10 needs Q3) is **skipped** when that answer is missing, and
  listed under "Still open" in Step 11. **Never** use your recommended option
  as the owner's answer. In Step 11, commit nothing.

## Step 5 — Make the work copy

**Do:**

1. Choose the branch name: `docs/agent-context`. Check it is free, locally
   and on GitHub:
   ```
   git branch --list docs/agent-context
   git ls-remote --heads origin docs/agent-context
   ```
   If either prints anything, use `docs/agent-context-<today's date>`
   instead, and check that name the same way.
2. Make the work copy from the latest default branch:
   ```
   git worktree add -b <branch> "<scratch folder>/agent-context" origin/<default branch>
   ```
3. From now on, every path in Steps 6 to 10 is inside the work copy, and every
   `git` command runs there: `git -C "<scratch folder>/agent-context" …`.

**Check:** `git -C "<scratch folder>/agent-context" branch --show-current`
prints the branch name, and the person's folder is on the same branch as in
Step 1.

**If not:** if `git worktree add` fails, send the person the exact error and
**STOP**. Never fall back to switching the person's own folder.

## Step 6 — Write `AGENTS.md`

**Do:** create `AGENTS.md` at the root of the work copy from this template.
Keep it **short**: under 120 lines.

````
# Working in this repository

Instructions for any AI agent or contributor working on <project name>:
<the one sentence from Q8>.

## Start here

Read these, in order. Do not load the whole `docs/` folder — read only what
your task needs.

1. This file.
2. [`docs/explanation/constraints.md`](docs/explanation/constraints.md) — the
   realities that make the usual way wrong here.
3. The issue or plan you are working on.

## Do and don't

| Rule | Why |
|---|---|
| Branch fresh from `<default branch>` for every change. | Old branches carry other people's unmerged work. |
| Never force-push or rewrite pushed history. | Others may have built on it. |
| Never commit a secret or a `.env` file. Add new variables to `.env.example` with a safe placeholder. | A pushed secret is public forever, even after deletion. |
| <If Q3 chose AI attribution:> No AI attribution in commits or pull requests: no `Co-Authored-By` naming an AI, no "Generated with" line. | Commits are the human contributor's record. A hook and CI enforce this. |
| <If Q3 is unanswered:> [OWNER: should commits and pull requests carry no AI attribution?] | — |
| Only <Q1's answer> merges pull requests. | <One line, or "The owner decides what ships.">. |
| <One row for each answer to Q6 and Q7> | <its reason> |

## Imitate

Read one of these and copy its shape. This is faster and more reliable than
any description.

| Writing | Copy the shape of |
|---|---|
| <kind from Step 2> | `<path from Step 2>` |

## Verify before reporting done

Run these. Do not report work done on the basis that it looks right.

```
<typecheck command from Step 3>
<lint command from Step 3>
<one-file test command from Step 3, written with path/to/the.test.ts as the file>
```

CI runs the full test suite. Locally, run only the tests for the files you
changed.

## Where it runs

- Staging: <Q4's answer>
- Production: <Q4's answer>
````

Rules:
- `<project name>` and the date come from Step 1.
- Every row in "Do and don't" has a reason in one line — except a row that is
  only an `[OWNER: …]` question, whose reason is `—`.
- Every path in "Imitate" is one you checked in Step 2.
- Writing a file creates its folders (`docs/explanation/`, `docs/decisions/`).
- Every command is one you found in Step 3.
- Leave out a row whose answer was "skip" or a `[OWNER: …]` you cannot fill
  — unless the owner is unavailable, in which case keep the row with the
  placeholder.

**Check:** the file is under 120 lines and has no empty section.

## Step 7 — Write the pointer files

**Do:**

1. **If Q2 includes Claude Code:**
   - `CLAUDE.md` does not exist → create it with exactly one line:
     ```
     @AGENTS.md
     ```
   - `CLAUDE.md` exists and has content → move its content into `AGENTS.md`
     (put each rule in the right section; keep every rule), then replace
     `CLAUDE.md` with the one line `@AGENTS.md`. Tell the owner in Step 11.
2. **If Q2 includes Gemini CLI:** do the same with `GEMINI.md`.
3. Codex, GitHub Copilot and Cursor read `AGENTS.md` directly. They need no
   pointer file.

**Check:** each pointer file contains only `@AGENTS.md`.

## Step 8 — Write `docs/explanation/constraints.md`

**Do:** create it from this template. Write one section for each real limit
from Q5, Q6 and Q7. If the owner skipped them or is unavailable, write one
section with `[OWNER: …]` placeholders.

```
# Constraints

The realities of <project name> that make the usual way of building wrong
here. Read this before changing anything structural.

## 1. <short name, for example "Users are on cheap phones with prepaid data">

**The reality:** <the fact, with a number if the owner gave one>
**So here we:** <the rule it leads to>
**Instead of:** <what someone would normally do, and why that is wrong here>
**Confirmed by:** <owner's handle>, <YYYY-MM-DD> — or [OWNER: is this right?]
```

**Check:** every section has all four lines, and nothing in it was invented.

## Step 9 — Start the decision log

**Do:** skip this step if `docs/decisions/` or `docs/adr/` already exists.
Otherwise create two files.

`docs/decisions/README.md`:
```
# Decisions

Choices that would be expensive to undo, or that rejected a reasonable
alternative. Each record is numbered and never renumbered. A record is
Proposed until the owner accepts it.

| No. | Decision | Status |
|---|---|---|
| [0001](0001-agent-instructions-live-in-agents-md.md) | Agent instructions live in AGENTS.md | Proposed |
```

`docs/decisions/0001-agent-instructions-live-in-agents-md.md`:
```
# 0001. Agent instructions live in AGENTS.md

- **Status:** Proposed
- **Date:** <YYYY-MM-DD>

## Context

AI agents read different files: Codex, Copilot and Cursor read AGENTS.md;
Claude Code reads CLAUDE.md; Gemini CLI reads GEMINI.md. Copies drift apart.

## Decision

All instructions live in AGENTS.md. CLAUDE.md and GEMINI.md, where used,
contain only `@AGENTS.md`.

## Rejected

- A full copy per agent: they drift apart within weeks.

## Consequences

A rule is changed in one place. Rules that must never be broken are also
enforced by a hook and CI, not only written down.
```

**Check:** the README table links to the record, and the record's number is
`0001`.

## Step 10 — Enforce the don'ts the owner chose

**Do:** items 1 to 3 run only for the rules chosen in Q3 — skip them if Q3
was "D. None" or is unanswered. Item 4 (the pull request template) always
runs in Set up. Item 5 runs only if Q2 includes Claude Code. For each rule chosen in Q3,
first look at what the project already has (Step 1, item 4):

| The project already has… | Then |
|---|---|
| a hook that checks this rule | Add nothing for this rule. |
| a script or CI check that checks this rule (for example a pull request check) | Make the new hook reject **exactly the same files** as that check, and add no new CI step: that check is the CI side. If its pattern uses something `grep -E` cannot (a lookahead such as `(?!example$)`), write it as two greps: one that matches, then `grep -Ev` that removes the allowed names. |
| a script that switches hooks on (`core.hooksPath`) | Use it; do not add a `prepare` script or a README line. |
| none of these | Use the files below. |

1. **Hooks.** Create the hook file for each rule that needs one.

   `.githooks/commit-msg` (for "no AI attribution"):
   ```
   #!/bin/sh
   # Blocks AI attribution in commit messages. See <the instruction file>.
   if grep -Eiq '^co-authored-by:.*(claude|anthropic|openai|chatgpt|copilot|gemini|cursor|codex)|generated (with|by) .*(claude|chatgpt|copilot|gemini|cursor|codex)' "$1"; then
     echo "Commit blocked: remove the AI attribution line. See <the instruction file>." >&2
     exit 1
   fi
   ```

   `.githooks/pre-commit` (for "no .env files"):
   ```
   #!/bin/sh
   # Blocks committing real .env files; only .env.example is allowed. See <the instruction file>.
   bad=$(git diff --cached --name-only --diff-filter=ACR | grep -E '(^|/)\.env(\.[^/]+)?$' | grep -Ev '(^|/)\.env\.example$')
   if [ -n "$bad" ]; then
     echo "Commit blocked: these files hold secrets and must not be committed:" >&2
     echo "$bad" >&2
     exit 1
   fi
   ```

   In each hook, replace `<the instruction file>` with `AGENTS.md`, or with
   the file that holds the instructions if the project keeps them elsewhere.
   Mark each **new** hook as runnable, so it works on macOS and Linux too:
   ```
   git -C "<scratch folder>/agent-context" add .githooks/<each new hook file>
   git -C "<scratch folder>/agent-context" update-index --chmod=+x .githooks/<each new hook file>
   ```

2. **Switch the hooks on in every clone**, unless the project already does. A
   fresh clone has no hooks until this runs.
   - **`package.json` exists:** add to `"scripts"`:
     `"prepare": "git config core.hooksPath .githooks"`. If a `"prepare"`
     script already exists, add ` && git config core.hooksPath .githooks` to
     its end instead.
   - **Otherwise:** add a "Setup" line to `README.md`:
     `Run once after cloning: git config core.hooksPath .githooks`.

3. **The same check in CI**, unless the project already has one. Create
   `.github/workflows/agent-rules.yml`. Keep only the steps for the rules
   that need one:
   ```
   name: agent-rules
   on: pull_request
   jobs:
     agent-rules:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
           with:
             fetch-depth: 0
         - name: No AI attribution in commit messages
           run: |
             for c in $(git rev-list "origin/${{ github.base_ref }}..${{ github.event.pull_request.head.sha }}"); do
               git log -1 --format=%B "$c" > "$RUNNER_TEMP/msg"
               sh .githooks/commit-msg "$RUNNER_TEMP/msg"
             done
         - name: No .env files
           run: |
             bad=$(git diff --name-only --diff-filter=ACR "origin/${{ github.base_ref }}...${{ github.event.pull_request.head.sha }}" | grep -E '(^|/)\.env(\.[^/]+)?$' | grep -Ev '(^|/)\.env\.example$' || true)
             if [ -n "$bad" ]; then echo "These files must not be committed: $bad"; exit 1; fi
   ```

4. **A pull request template**, if `.github/pull_request_template.md` does not
   exist:
   ```
   ## What and why

   <!-- The problem, and why this is the fix. -->

   Issue: <!-- "Closes #N" if this finishes it, "Part of #N" if it is one step -->

   ## How to verify

   1. <!-- the commands, and what to look at -->

   ## Checklist

   - [ ] One change; no unrelated edits
   - [ ] The checks in AGENTS.md pass
   - [ ] No secret, `.env` file or personal data
   - [ ] No AI attribution in commits or this description
   ```

5. **Claude Code's own settings**, only if Q2 includes Claude Code. If
   `.claude/settings.json` does not exist, create it:
   ```
   {
     "permissions": {
       "deny": [
         "Bash(git push --force:*)",
         "Bash(git push -f:*)",
         "Bash(git push --force-with-lease:*)",
         "Read(./.env)",
         "Read(./.env.*)"
       ]
     }
   }
   ```
   If it exists, add these five lines to its `"deny"` list instead, and keep
   everything already there. Other agents get these rules from `AGENTS.md`,
   the hooks and CI.

**Check:** each enforced rule has a hook (new or existing), a way to switch it
on (new or existing), and a CI side (new or existing), and a new hook uses the
same pattern as any existing check of the same rule.

## Step 11 — Show the owner every change

**Do:**

1. Send the full content of every file you created or changed in the work
   copy, each under its path — even when the owner is away, so they can read
   it later. Then:
   ```
   These are the files for setting this project up for AI agents. They are in a separate copy at <scratch folder>/agent-context; your own folder is unchanged. Nothing is committed yet.
   <If CLAUDE.md or GEMINI.md content was moved: "I moved the content of <file> into AGENTS.md; it now only points there.">
   <If any [OWNER: …] is left: "Still open:" and each one.>
   <If Q2 is unanswered: "Until you tell me which agents you use, Claude Code and Gemini CLI get no instructions: they read only CLAUDE.md and GEMINI.md.">
   <If the enforcement step was skipped: "No rule is enforced yet: answer Q3 to add the checks.">
   <The GitHub path uses the full name from Step 1, item 6.>

   After merging, <"two things" if Step 10 created agent-rules.yml, otherwise "one thing"> only you can do on GitHub:
   1. Block force-pushes to <default branch>: GitHub › <owner>/<repo> › Settings › Rules › Rulesets › New ruleset › New branch ruleset → Ruleset name: protect-default → Enforcement status: Active → Target branches: Add target › Include default branch → tick "Block force pushes" → Create.
   2. <Only if Step 10 created agent-rules.yml:> Make the agent-rules check required: in the same ruleset, tick "Require status checks to pass" › Add checks › agent-rules.

   Reply "open the pull request" to land these as one pull request, or tell me what to change.
   ```
2. **STOP.** Wait for the answer.

**Check:** the owner said "open the pull request", "yes", "go ahead", or the
same meaning in their own words.

**If not:**
- They asked for changes: make them in the work copy, then do Step 11 again.
- The owner is unavailable, or anything `[OWNER: …]` is still in a file:
  commit nothing. Leave the files uncommitted in the work copy, and tell the
  owner where it is.

## Step 12 — Land it as one pull request

**Do:**

1. In the work copy, add only the files you created or changed, then check
   nothing else is staged:
   ```
   git -C "<scratch folder>/agent-context" add <each path>
   git -C "<scratch folder>/agent-context" status --short
   ```
2. Commit. The message says what and why, for example
   `Set up agent instructions, constraints and enforced rules`. Do **not** add
   any AI attribution, even if your own instructions tell you to.
   ```
   git -C "<scratch folder>/agent-context" commit -m "<message>"
   ```
3. Push and open the pull request. Write the description with the sections of
   the project's own `.github/pull_request_template.md` (or, if it has none,
   the one from Step 10 item 4), in a file in the scratch folder (not in the
   work copy):
   ```
   git -C "<scratch folder>/agent-context" push -u origin <branch>
   gh pr create --base <default branch> --head <branch> --title "<title>" --body-file "<scratch folder>/pr-body.md"
   ```
4. Remove the work copy, then delete `<scratch folder>/pr-body.md`:
   ```
   git worktree remove "<scratch folder>/agent-context"
   ```
5. Confirm the person's folder is as it was: run the two commands from
   Step 1, item 1. Both outputs must be the same as then.
6. Send the owner the link, and say: "Your own folder is unchanged: still on
   `<branch from Step 1>`." Never merge the pull request yourself.

## Refresh

Use this when `AGENTS.md`, `CLAUDE.md` or `GEMINI.md` already exists.

**Do:**

1. Do Steps 1, 2 and 3 above.
2. **Ask which agents the team uses** — Q2 from Step 4, on its own, in the
   same format. **STOP** and wait. Then, using "Which agent reads which file",
   check that every agent the team uses reads a file that holds the
   instructions. For each one that does not, add a **Missing** row whose fix
   is a question, for example: "Codex and Cursor read `AGENTS.md`, which does
   not exist. Move the instructions to `AGENTS.md` and make `CLAUDE.md` contain
   only `@AGENTS.md`? (yes / no)".
3. **Check every claim.** The files to check are:
   - the instruction files that exist;
   - `docs/explanation/constraints.md`, if it exists;
   - every file the instruction files tell agents to read before **every**
     task (their "Start here" or "Always" list — not the "by task" or "look
     up" lists) — the claims about the project in them. If the
     list names a folder (for example `docs/plans/`), check what the
     instruction files say about the files in it against the folder's own
     template or README, and against a few of its newest files.

   Give each claim one status:

   | Status | Meaning |
   |---|---|
   | **Correct** | The code and history agree with it. |
   | **Stale** | It was true once, and the project has moved on: a path that no longer exists, a renamed script, an old count, a problem a decision record has since solved, a section that was removed. |
   | **Contradicted** | It says the code does one thing, and the code does another — for example "fails at runtime" when the typecheck catches it. |
   | **Missing** | Something agents need that the files do not mention: a folder they should know (for example `docs/handoffs/`), a setup step, a check, a rule in a decision record, an agent that cannot read the instructions. |

   A **claim** is any sentence that states a fact about the project: a path,
   a command, a number, how something works, a rule and its reason. A claim
   that is only partly true is **Stale**, and its fix says which part still
   holds. A claim you cannot check gets no row: list it under "Not checked"
   in the message.

   Check paths with `git ls-files <path>`, commands against the scripts and
   CI, and figures by counting them again. Also check the "Never" layer: for
   each don't in the files, read the hooks in `.githooks/` and the CI checks
   (workflows and the scripts they run) to see whether it is enforced. No
   hook → a **Missing** row whose fix is a question: "Enforce <rule> with a
   hook? (yes / no)".
4. **Follow each wrong claim.** For every Stale or Contradicted claim, search
   the whole repository for it:
   ```
   git grep -n "<a few exact words from the claim>"
   ```
   Every other file that repeats it gets **its own row** in the table, with
   the same status. Do not change a file that has no row.
5. **Send the owner the table,** one row per claim per file:

   | # | File | Claim | Status | Evidence | Proposed fix |
   |---|---|---|---|---|---|

   Leave out the Correct rows, and say how many there were. Then ask:
   `Reply "fix them" to make every concrete fix, and answer each yes/no
   question. You will see every change before anything is committed.`
   **STOP.**
6. "Fix them" approves only the rows with a concrete fix. A row whose fix is a
   question needs its own "yes". Then:
   1. Make the work copy exactly as in Step 5, with the branch name
      `docs/refresh-agent-context`.
   2. In the work copy, edit only the lines the approved rows name. Keep every
      other line as it is.
   3. For each enforcement question answered "yes", do Step 10 items 1 to 3
      for that rule only. For a "yes" to moving the instructions to
      `AGENTS.md`, do Step 7.
   4. Show the owner every change, and the row numbers each change fixes: the
      full new content of a new file or a file under 150 lines; for a longer
      file, its diff (`git -C "<scratch folder>/agent-context" diff -- <file>`). Say "Your own folder is unchanged." and ask:
      `Reply "open the pull request" to land these, or tell me what to
      change.` **STOP.**
   5. With that yes, land them as in Step 12. If the owner said "no" to
      moving the instructions, repeat in your final message which agents
      will not read them.
7. Personal preferences (how one person likes to work) and dashboard paths
   that are not in the repository go to the agent's own memory, not to these
   files.

## Keep out of the repository

Never put these in any file this skill writes:

- personal instructions or private policy files;
- anything naming another client or another company's project;
- secrets, keys, tokens, passwords — even as examples. Use placeholders such
  as `<your-api-key>`.

## Before you send: check every line

- [ ] Is the person's own folder on the same branch, with the same `git status`, as in Step 1?
- [ ] Was every file written in the work copy, never in the person's folder?
- [ ] Is `AGENTS.md` under 120 lines, with a reason on every rule?
- [ ] Is every imitate path real (`git ls-files` printed it)?
- [ ] Is every command taken from the scripts or CI?
- [ ] Does every pointer file contain only `@AGENTS.md`?
- [ ] Does every agent the team uses read a file that holds the instructions?
- [ ] Is every constraint from the owner, or marked `[OWNER: …]`?
- [ ] Does every enforced rule have a hook, a way to switch it on, and a CI side — reusing what the project already has?
- [ ] Refresh: does every changed file have its own row in the table the owner approved?
- [ ] Did you show the owner every change before committing?
- [ ] With any `[OWNER: …]` left, did you commit nothing?
- [ ] Is there no AI attribution in the commit or the pull request?

## Common mistakes

| Mistake | Do this instead |
|---|---|
| Switching the person's folder to a new branch. | Work in the work copy (Step 5). Their folder never changes. |
| Writing a long `AGENTS.md` that copies the docs. | Under 120 lines; point to the docs. |
| An imitate file that does not exist. | Pick from `git log --name-only` and check with `git ls-files`. |
| Guessing what the product is from commit messages. | Ask Q8; write the clues as `[OWNER: …]` until answered. |
| Instructions only in `CLAUDE.md` when the team also uses Codex or Cursor. | Ask Q2; offer to move them to `AGENTS.md`. |
| Fixing a stale claim in one file and leaving the same claim elsewhere. | `git grep` for it; one row per file. |
| Editing a file the owner never saw in the table. | Only files with an approved row change. |
| A second hook or CI check next to one the project already has. | Reuse the existing check and its pattern. |
| A hook with no CI side. | A fresh clone has no hooks. CI is the real guard. |
| A hook nobody switches on. | The project's own setup script, a `prepare` script, or a README line. |
| Two full instruction files, one per agent. | One `AGENTS.md`; the others contain only `@AGENTS.md`. |
| Committing while the owner is away. | Leave the files uncommitted in the work copy, and say where. |
