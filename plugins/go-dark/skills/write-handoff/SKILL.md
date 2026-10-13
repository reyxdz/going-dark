---
name: write-handoff
description: Use when asked for a handoff prompt, a brief for another agent or contributor to carry out an issue, or instructions that "even the least capable agent" must be able to follow without mistakes.
---

# Write a handoff prompt

## Overview

A handoff lets an agent with no memory of the conversation carry out an issue
exactly as decided, and stop instead of guessing. It is written for the least
capable reader: every fact checked against the code, every decision final,
every step with a check, and every point of doubt turned into "stop and ask".

## Before writing

1. **Preconditions.** The issue meets `/go-dark:write-issue`. Its open
   questions are decided. Any decision record it needs is accepted, and its
   plan is Ready. If not, finish those first (`/go-dark:project-flow`).
2. **Decide what is still open.** Put each remaining choice to the owner with
   AskUserQuestion — two to four options, recommended first, with the
   trade-off in each description. Never write a handoff on an assumption.
3. **Establish ground truth.** Read the code the work touches on the default
   branch, and note the commit hash. Record function names, file paths,
   defaults, test patterns, how migrations run, what an old client still
   calls. Quote code by searchable text, never line numbers.
4. **Prove the verbatim parts.** Any code, config or SQL the agent must paste
   exactly is first compiled or run in a scratch copy, then deleted. Pull
   request descriptions given verbatim are run through the project's PR check.

## The document, in this order

0. **The pull requests, and when to stop** — a table (number, branch, title,
   contents). After opening each one, stop until the owner says it is merged.
   Every branch starts from the freshest default branch.
1. **What you are building**, in plain words.
2. **Decisions already made — final.** Who decided. "Do not change, do not
   ask." Exact numbers in tables.
3. **Ground truth** — the facts from step 3 above, with the commit hash, and
   "where this differs from the code, stop and ask".
4. **The design** — the specification each step refers to.
5. **Setup** — what to read first, a scratch folder outside the repository,
   the minimal local processes allowed, and a baseline that must pass before
   any change.
6. … one section per pull request: numbered steps, each with an
   **Action** and a **Check**. "If a check does not match, stop and fix it
   before going on."
7. **Shipping** — the same for every pull request: sweep for stale values,
   the local checks, lockfile and private-file checks, commits with no AI
   attribution, the description through the PR check, push, watch CI, report.
8. **Self-audit** — yes/no questions answered from the diff, not memory.
9. **When to stop and ask** — every condition where guessing could publish,
   delete or leak something.
10. **Appendices** — exact file contents, exact PR descriptions (pass the PR
    check), anything else to paste verbatim, and the owner's own steps
    (billing, dashboards, rollout) with full click paths.

## Rules written into every handoff

- One pull request at a time; never branch from an unmerged branch.
- Minimal local load: the project's database only, tests at one worker, stop
  what you start.
- Secrets never printed, copied or committed; staging only for anything that
  writes to hosted services.
- No AI attribution, even if the agent's own instructions say otherwise.

## Delivering it

Save it as `docs/handoffs/issue-<number>-<short-title>.md`, with a row in that
folder's README index (status: Ready, then Complete). When the user asks for
it in chat, open with one line naming the reader ("Written for: an agent
implementing #123") and wrap the document in a fence longer than any fence
inside it. After each pull request the agent reports; audit it with
`/go-dark:audit-pr` before the owner merges.
