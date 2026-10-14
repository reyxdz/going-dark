# `/go-dark:write-issue`

> **Claude Code:** `/go-dark:write-issue` · **Other agents:** the `go-dark-write-issue` skill — ask for it by what you want, or by name.

## When it runs

- `/go-dark:write-issue`, after describing what you want.
- "Write an issue for this", "turn this bug into an issue", "file that as a
  follow-up".
- "Is #12 ready to build?" — it checks an existing issue against the standard.

## What it does

An issue is a **specification**: someone who never saw the conversation can
plan and build from it without guessing. The problem is concrete, every
decision says who made it and when, scope is written down, and "done" can be
measured.

1. **Read the project** — the project's rule files, issue templates, the three
   most recent issues (to copy their style), the labels that exist, and the
   decision records. It finds the owner. Where the project's rules differ from
   the skill, the project wins and it says so.
2. **Decide what kind of issue it is** — a bug, a feature or a technical issue
   (speed, size, cost, security, cleanup). It picks one.
3. **Collect the facts** — the exact file and line from the code, every number
   you gave with its unit and where it was measured, the decision records for
   the area, and the project's real limits (devices, data, hosting, money, law).
   A fact it cannot check is marked `*(unverified: why)*`.
4. **Sort every open point into two lists** — **owner questions** are anything
   that changes what users get, what it costs or the risk: scope, public URLs,
   limits users notice, numbers in Verify, all copy, failure and empty states,
   money, security, privacy, and anything expensive to undo. **Technical calls**
   are how it is built: libraries, names, internal formats, tests. If unsure,
   it is an owner question.
5. **Ask the owner** — at most four questions per message, each with two to
   four options and the recommended one first. It waits for the answer. An
   unanswered question goes in **Decide first**, unticked. It never records its
   own recommendation as the owner's decision.
6. **Write the draft** — from the template, in a fixed order. The required
   sections are Summary, What to build, Verify, Not in this ticket and How to
   ship, plus Decided once anything is decided. Why it happens, Decide first,
   Docs and Notes appear only when they apply.
7. **Check the draft** — a yes/no checklist, fixed until every answer is yes.
   Among other things: every rule says what the server does, not only the
   browser; every failure and empty state has exact copy; every date is
   absolute; records are named by number.
8. **Show the draft and ask to file it** — it sends the full draft and the
   labels it will use, then waits. Only a clear yes ("file it", "go ahead")
   counts.
9. **File it** — with `gh issue create`, using only labels that exist, then
   sends you the link.

To **check an existing issue** ("is #12 ready?"), it reads the project, then
answers the same yes/no checklist about that issue and reports each "no" with
what to add. It does not edit the issue unless you ask.

## What you get

One GitHub issue whose title names the outcome and its key limit. The body
holds the sections above. Technical calls sit in Decided marked
*(technical call)*, and each out-of-scope item names its issue number or says
"no issue yet", with an offer to file it. Title patterns:

```
Feature:   Let <who> <do what>, <key limit>
Bug:       <The symptom> — <the fix>
Technical: <Make what> <better how>, <for whom or why>
```

For example, a bug title: "The landing page search does nothing — make search
work".

## What it never does

- Never invents a fact, a number or a file path. A fact it could not check is
  marked `*(unverified: …)*`.
- Never files the issue on GitHub until you have seen the full draft and said
  yes.
- Never decides an owner question itself, and never writes its recommended
  option as your answer.
- Never invents a label. It uses only those from `gh label list`.
- Never saves the issue body inside the repository. It uses a scratch folder
  and deletes the file afterwards.

## Exact templates and wording

Every template, command and checklist is in [the skill itself](../../plugins/go-dark/skills/write-issue/SKILL.md).
