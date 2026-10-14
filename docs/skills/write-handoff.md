# `/go-dark:write-handoff`

> **Claude Code:** `/go-dark:write-handoff` · **Other agents:** the `go-dark-write-handoff` skill — ask for it by what you want, or by name.

## When it runs

- `/go-dark:write-handoff #12`.
- "Write a handoff for this issue", "brief an agent to do #12", "write it so
  even the dumbest agent can't get it wrong".

## What it does

A **handoff** lets a builder with no memory of the conversation carry out an
issue exactly as decided. It is written for the least capable reader: every
fact is checked against the code, every decision is final, every step has an
action and a check, and every doubt says "stop and ask". If that standard
cannot be met yet, it writes a **blocked draft** instead. It writes the
handoff only. It does not build the issue, commit, push or open pull requests.

1. **Read the project and the issue** — the project's rule files, the owner,
   the base commit (the default branch's 40-character hash), the pull request
   check, the issue, and the plan, decision records and handoffs that mention
   it. Where the project's rules differ from the skill, the project wins and the
   owner is told.
2. **Check the issue is ready** — it has Summary, What to build, Verify and
   Not in this ticket sections; every "Decide first" box is ticked; every
   decision record is Accepted; and a Ready plan exists if there is more than
   one pull request. If not, it stops and asks whether to write a blocked draft
   or wait. It points to `/go-dark:write-issue` or `/go-dark:project-flow`.
3. **Find what is still open** — even in an issue called "fully decided". It
   goes through eleven areas: each limit (at it and one over it), empty cases,
   formats, who can do it, injection, abuse, personal data, record keeping,
   errors, old clients, and the size of the work. Each open point is an
   **owner question** (it changes what users get, cost, risk, security,
   privacy or copy) or a **technical call** (it changes only how it is built;
   it decides these and marks them). If unsure, it is an owner question. The
   number of pull requests is always an owner question.
4. **Ask the owner** — numbered Q1, Q2 and so on, with two to four options
   and the recommended one first, at most four per message. It waits. It never
   writes its recommended option as the owner's answer.
5. **Collect the ground truth** — it reads the code on the default branch and
   records each fact with a file path, a search text and the value. Never a
   line number.
6. **Prove the verbatim parts** — code, SQL, config, file contents and pull
   request descriptions the builder must paste are checked in a scratch copy
   with the narrowest check, then the copy is removed.
7. **Write the handoff** — from the template, in a fixed order. Every step
   inside has one **Action** and one **Check**.
8. **Check the handoff** — a yes/no checklist, fixed until every answer is
   yes.
9. **Save it** — see below.
10. **Tell the owner** — whether it is ready or blocked, where it is, and
    every question still open.

Markers, used wherever something is unchecked. Any marker makes it a blocked
draft:

- `[VERIFY: what to check]` — a fact it could not read in the code.
- `[OPEN Qn]` — a decision the owner has not answered.
- `[UNPROVEN]` — a verbatim part it could not run or check.

## What you get

One document, with a STATUS line:

- `STATUS: READY.` only when there is no marker anywhere in it.
- `STATUS: DRAFT — BLOCKED. Do not execute.` otherwise, with a closing section
  that lists what unblocks it.

The sections run from "The pull requests, and when to stop" through what is
being built, the decisions already made, the ground truth, the design, setup,
one section per pull request, shipping, a self-audit and when to stop and ask.
The appendices hold the pull request descriptions, exact file contents and the
owner's own steps. It begins like this:

```markdown
# Handoff: #12 — Export members as CSV

STATUS: DRAFT — BLOCKED. Do not execute.
Written for: whoever builds #12, with no memory of earlier conversations.
Based on `main` at commit `<40-character hash>`, 2026-10-14.

## 0. The pull requests, and when to stop
```

**Saved:** if `docs/handoffs/` exists, as
`docs/handoffs/issue-<N>-<short-title>.md`, with an index row marked Draft or
Ready. It is not committed. If the folder does not exist, it does not create
it. It delivers the handoff in chat inside a code fence and asks whether to
save it. In chat it opens with the line "Written for: an agent building #<N>."

When the builder opens each pull request, audit it with
[`/go-dark:audit-pr`](./audit-pr.md) before the owner merges.

## What it never does

- Never invents a fact. Every path, command, number and decision comes from
  the issue, the owner or the code it read.
- Never marks a handoff READY with a marker left in it.
- Never builds the issue, commits, pushes or opens a pull request.
- Never writes a line number as ground truth, or a check like "make sure it
  works".
- Never puts personal instruction files, secrets or AI attribution into the
  work. Every handoff tells the builder to add no AI attribution, never to
  force-push, and to stop after each pull request.

## Exact templates and wording

Every template, command and checklist is in [the skill itself](../../plugins/go-dark/skills/write-handoff/SKILL.md).
