# `/go-dark:fix-audit`

> **Claude Code:** `/go-dark:fix-audit` · **Other agents:** the `go-dark-fix-audit` skill — ask for it by what you want, or by name.

## When it runs

- `/go-dark:fix-audit 71` after an audit that only reported.
- "Fix everything the audit found", "apply the audit's fixes to #71".
- Another agent, or a weaker one, should make the fixes an audit listed.

It needs a report from [`/go-dark:audit-pr`](./audit-pr.md): pasted in the
conversation, in a file, or as a comment on the pull request. Without one, it
asks you to run the audit first.

## What it does

Three rules make it safe: it applies **exactly what the report says**, nothing
more; it **finds each line's current text before changing it**, and never
guesses when the text is not there; and it **never judges its own work** — a
fresh audit gives the verdict.

1. **Get the report** — and stop if there is none, if it found nothing to
   fix, or if it is not in the exact format.
2. **Make the item list** — one row per fix, each given one kind: an
   **Edit** (a `Now:` text and a `Change to:` text), an **Action** (a `Do:`),
   a **Check** (something to read or run and confirm), a **Question** for you,
   or **At merge** (a commit-message typo). The row count must match the
   report's.
3. **Read the pull request, and choose what to do** — fix on its branch if it
   is open; stop if it is closed, a fork, or cannot be pushed to; a new
   follow-up pull request if it is already merged. It notes your folder's
   branch and status first.
4. **Ask you the report's questions** — copied exactly. Your answers fill in
   the fixes. If an answer says what but not where, it proposes one exact
   change and asks once more. It never picks the recommended option for you.
5. **Make the scratch copy** — a separate git worktree, brought up to date
   with the base branch. If that conflicts, it stops and asks for a fresh
   audit.
6. **Apply every item** — behaviour fixes first, each with its failing test
   first and its own commit; then the text, tidy and test fixes together. For
   each Edit it searches for the current text: found once, it makes exactly
   the change; found nowhere, the item is "Already fixed" or "Could not
   apply" — never a guess.
7. **Commit** — one commit per behaviour fix, named for its audit item; one
   for the rest. Every changed line must belong to an item. No AI
   attribution.
8. **Fix the description and title** — through your pull request check, if
   the project has one.
9. **Push and watch CI** — only to an open pull request, never with force.
10. **Clean up** — removes the scratch copy, and confirms your folder is
    unchanged.
11. **Report** — and point to a fresh audit.

## What you get

A table with one row for every item in the report — Fixed, Already fixed,
Checked, At merge, Answered, Not needed, Waiting on you, or Could not apply —
with its commit and its proof. Then the squash commit message to use when you
merge, anything still waiting on you, the checks and CI, and your folder's
state. It ends with the next step:

```markdown
### Next

Run `/go-dark:audit-pr 71` again — ideally in a new session or with another agent. Only a fresh audit can say whether #71 is PERFECTLY SAFE to merge.
```

## What it never does

- Never changes anything the report does not name — no extra improvements.
- Never guesses a fix, and never answers a question for you.
- Never calls the pull request safe; that is the next audit's job.
- Never rewrites history: a commit-message typo is fixed in the squash
  message when you merge.
- Never force-pushes, merges or approves, and never works in your own folder.
- Never adds AI attribution to a commit.

## Exact templates and wording

Every template, command and checklist is in [the skill itself](../../plugins/go-dark/skills/fix-audit/SKILL.md).
