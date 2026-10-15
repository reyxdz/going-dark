# `/go-dark:fix`

> **Claude Code:** `/go-dark:fix` · **Other agents:** the `go-dark-fix` skill — ask for it by what you want, or by name.

## When it runs

- `/go-dark:fix` with findings pasted in, or pointing at them.
- "Fix these", "fix what Marco found", "fix the review comments on #71", "fix
  the bugs in this list".
- Findings from anyone or anything: a developer, a tester, a code review,
  an issue, another skill or a tool.

For a report from [`/go-dark:audit-pr`](./audit-pr.md), it hands over to
[`/go-dark:fix-audit`](./fix-audit.md), which applies such reports exactly.

## What it does

Findings are often vague, and sometimes wrong. This skill checks each one
against the code before changing anything, fixes a bug where it starts rather
than where it shows, and fixes only what was found.

1. **Collect the findings** — from the conversation, a file, a pull request's
   comments (including comments on lines of code), or an issue.
2. **Number the findings** — one row per problem, in the reporter's exact
   words.
3. **Decide where to fix** — an open pull request's branch; a new follow-up
   pull request for a merged one; a new branch and pull request for the
   default branch; or, if you ask, your own uncommitted work in place. It
   also reads the specification: the issue, its plan, decision records and
   the project's rules.
4. **Make the scratch copy** — a separate git worktree.
5. **Investigate every finding**, by its kind:
   - **Text** — find the words; compare exact text character by character.
   - **Bug** — follow the data from where the finding points, one step at a
     time, to the first place where one step does not fit the next. That is
     the cause. It is proved with a failing test, and every copy of the same
     mistake in the feature is found.
   - **Rule** — find the rule and the line that breaks it.
   - **Which is right** — the specification decides; if it does not, you do.
   - **Vague** — it asks you what exactly, and where, with "ignore it" as an
     option.

   Each finding ends **Confirmed**, **Not a problem** (with the evidence),
   **Needs the owner**, or **Cannot check**. Other problems it notices are
   listed, never fixed.
6. **Plan the exact fixes, and ask what needs you** — every fix as an exact
   current line and new line. Anything that is not small, needs new text or a
   value nobody gave, or has more than one reasonable answer becomes a
   question, with the exact change for each option.
7. **Make the fixes** — behaviour fixes first, each with its failing test and
   its own commit; then text, tidy and test fixes together. Nothing else
   changes. No AI attribution.
8. **Check every finding again** — the wrong text is gone, the test passes,
   and every changed line belongs to a finding.
9. **Push** — without force, and only to an open pull request; or open a new
   one.
10. **Clean up** — and confirm your folder is unchanged.
11. **Report.**

## What you get

A table with one row per finding — Fixed, Not a problem, Waiting on you, Owner
said ignore, or Cannot check — with what changed, the commit and the proof.
Then the cause of each bug in a line or two, the evidence for each finding that
was not a problem, what else it noticed but did not change, the checks, and
your folder's state. For example:

```markdown
### Causes

- Finding 1: the form sends `message`; the route expects `messsage` (backend/src/routes/contact.ts:12), so every request failed validation.

### Not a problem

- Finding 5: the name field has a label — frontend/src/features/help/ContactForm.tsx:22 `<label htmlFor="c-name">Your name</label>`.
```

## What it never does

- Never "fixes" a finding it has not confirmed, and never calls a wrong
  finding fixed.
- Never fixes a symptom when it can find the cause.
- Never fixes something no finding mentioned — it lists it instead.
- Never decides a product question, writes new text for users, or picks an
  answer for you.
- Never force-pushes, merges or approves, and never calls a pull request safe
  — that is the next audit's job.
- Never works in your folder, unless you asked it to fix your uncommitted
  work there.

## Exact templates and wording

Every template, command and checklist is in [the skill itself](../../plugins/go-dark/skills/fix/SKILL.md).
