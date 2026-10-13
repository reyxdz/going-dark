# `/go-dark:write-handoff`

> **Claude Code:** `/go-dark:write-handoff` · **Other agents:** the `go-dark-write-handoff` skill — ask for it by what you want, or by name.

Writes a **handoff prompt**: a document that lets an agent or contributor with
no memory of the conversation carry out an issue exactly as decided — and stop
instead of guessing. It is written for the least capable reader.

## When it runs

- `/go-dark:write-handoff #12`.
- "Write a handoff for this issue", "brief an agent to do #12", "write it so
  even the dumbest agent can't get it wrong".

## Before it writes a word

| Check | If it fails |
|---|---|
| The issue meets the [issue standard](./write-issue.md) | Fix the issue first |
| Every open question on it is decided | Ask the owner (next row) |
| Any decision record it needs is Accepted, and its plan is Ready | Finish step 2 of [the flow](../the-flow.md) |

1. **Find what is still open — even in an issue called "fully decided".**
   Behaviour at and over each limit, formats, security (injection, access,
   personal data), logging, error copy, and how many pull requests the work
   should be. Each goes to the owner with two to four options, the recommended
   one first, the trade-off in each. A handoff is never written on an
   assumption.
2. **Establish ground truth.** It reads the code the work touches on the
   default branch and records the **commit hash**. It notes function names,
   file paths, defaults, test patterns, how migrations run, and what an older
   client still calls. Code is referred to by **searchable text**, never by
   line number — line numbers drift.
3. **Prove the verbatim parts.** Any code, config or SQL the reader must paste
   exactly is compiled or run in a scratch copy first, then the scratch copy is
   deleted. Pull request descriptions given verbatim are run through the
   project's own PR check.

## When it cannot be finished yet

If the code cannot be read, a verbatim part cannot be proven, or the owner has
not answered, it does not hand over something that only looks ready. It writes
a **draft**:

- headed `STATUS: DRAFT — BLOCKED. Do not execute.`;
- every unchecked fact marked `[VERIFY: what to check]`, every unanswered
  question `[OPEN Qn]`, every unproven verbatim part `[UNPROVEN]`;
- with the list of what unblocks it.

A draft is never saved as Ready; in the index its status is **Draft**.

## The document

Sections in this order. Every numbered step inside has an **Action** and a
**Check**, and the rule: *if a check does not match, stop and fix it before
going on.*

| # | Section | Holds |
|---|---|---|
| 0 | The pull requests, and when to stop | A table: number, branch, title, contents. "After opening each one, stop until the owner says it is merged." Every branch from the freshest default branch |
| 1 | What you are building | Plain words, for someone new to the project |
| 2 | Decisions already made — final | Who decided; "do not change, do not ask"; exact numbers in tables |
| 3 | Ground truth | The facts from the code, the commit hash, and "where this differs from the code, stop and ask" |
| 4 | The design | The specification every step refers to |
| 5 | Setup | What to read first; a scratch folder outside the repository; the minimal local processes allowed; a baseline that must pass before any change |
| 6+ | One section per pull request | Numbered steps, each Action + Check |
| — | Shipping | The same for every pull request: stale-value sweep, local checks, lockfile and private-file checks, commits with no AI attribution, the description through the PR check, push, watch CI, report |
| — | Self-audit | Yes/no questions answered from the diff, not from memory |
| — | When to stop and ask | Every condition where a guess could publish, delete or leak something |
| — | Appendices | Exact file contents; exact PR descriptions; anything else to paste verbatim; the owner's own steps (billing, dashboards, rollout) with full click paths |

## Rules written into every handoff

- One pull request at a time; never branch from an unmerged branch.
- Minimal local load: the project's own database only, tests on one worker,
  stop whatever is started.
- Secrets never printed, copied or committed; only staging for anything that
  writes to hosted services.
- No AI attribution, even if the reader's own instructions say otherwise.

## Skeleton

```markdown
# Handoff: issue #<n> — <title>

You are implementing issue **#<n>** in <repository>. You will ship it as
**<k> pull requests into `main`, one after another.** Read this whole document
before running anything, then do the work in the order written. Every step has
a Check; if a check does not match, stop and fix it before going on. If you
cannot fix it, stop and ask (section <last>).

## 0. The pull requests, and when to stop

| # | Branch | Title | Contains |
|---|---|---|---|
| 1 | `feat/<x>` | <title> | <contents> |

**After you open a pull request, stop** until you are told it is merged.

## 1. What you are building
## 2. Decisions already made (final: do not change, do not ask)
## 3. Ground truth (checked against `main` at <commit>)
## 4. The design
## 5. Setup
### Step 1.1: <name>
- [ ] **Action.** <exactly what to do>
- [ ] **Check.** <exactly what must be true>
## <n>. Shipping a pull request
## <n>. Self-audit
## <n>. When to stop and ask
# Appendices
```

## Delivering it

- **Saved** as `docs/handoffs/issue-<number>-<short-title>.md`, with a row in
  that folder's README index (status *Draft*, *Ready*, later *Complete*).
- **In chat**, when asked: it opens with one line naming the reader —
  *"Written for: an agent implementing #123"* — and wraps the document in a
  code fence longer than any fence inside it, so it copies cleanly.
- **After each pull request** the reader reports back; run
  [`/go-dark:audit-pr`](./audit-pr.md) on it before the owner merges.
