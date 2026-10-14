# `/go-dark:audit-pr`

> **Claude Code:** `/go-dark:audit-pr` · **Other agents:** the `go-dark-audit-pr` skill — ask for it by what you want, or by name.

## When it runs

- `/go-dark:audit-pr 42` or `/go-dark:audit-pr <url>`.
- "Audit this", "is this perfectly safe to merge?", "check this PR", "fix that
  and make it safe".
- "Is this completely finished?" — the stricter variant, described below.

## What it does

The bar is "perfectly safe to merge while keeping its purpose". **An audit
includes its fixes:** asking for an audit is asking for the fixes to be pushed
to the pull request's branch. If the pull request is already fine, the skill
says so and does not invent findings.

1. **Read the pull request and its context** — the pull request, the project's
   rule files, its pull request check, and the linked issue and plan. The
   issue and plan are the specification; the description is only a claim to
   check. It then picks one mode:
   - **Fix mode** (the default): fixes go on the pull request's branch.
   - **Report-only mode**: when you ask for a verdict alone, or the pull
     request comes from a fork. Fixes are written as diffs in the report.
   - **Follow-up mode**: the pull request is already merged. Fixes go in a
     new pull request.
   - A closed (unmerged) pull request stops the skill, and it asks you.
2. **Check the state, and the other open pull requests** — CI status, how far
   behind the base branch it is, and whether another open pull request
   changes the same files or claims the same migration, decision or plan
   number. A duplicate number is a blocker.
3. **Make a scratch copy and trial-merge the base branch** — in a separate
   git worktree, never your own folder. Conflicts are blockers.
4. **Read the diff, file by file, against the checklist** — letters A to L,
   each ending as Sound, Finding, Not applicable or Not verified:
   A Purpose, B Security and privacy, C Data, D Deployment skew,
   E Concurrency, F Tests, G User interface, H Records, I Description,
   J Scope, K Numbers, L Attribution. There is also a table of known
   problems and their usual fixes.
5. **Run the narrow checks** — typecheck, lint and only the tests for the
   changed files. It does not run the full suite, and does not start a
   database, server, Docker or browser unless one is already running or
   nothing else can answer a finding.
6. **Decide what to do with each finding** — fix, question for the owner,
   blocker, or not worth holding (cosmetic only). Blockers are ordered by
   severity:
   1. breaks the deploy or loses data;
   2. security or privacy;
   3. broken for users;
   4. a promise not kept;
   5. tests wrong or missing, or unrelated changes;
   6. accessibility and interface;
   7. records and description.

   Something the description promises but the diff lacks is built if it is
   small. If it is not small, it is a blocker and a question for the owner.
7. **Fix** — in Fix mode: confirm the pull request is still open, bring the
   branch up to date, then one commit per fix with a message that says why.
   A behaviour fix first gets a test that fails, then the fix, then the test
   passes. A fix to docs, records or the description needs no test. It
   corrects the description if it is wrong, pushes normally, and watches CI.
8. **Clean up** — stops anything it started and removes the scratch copy.
9. **Report** — fills in a fixed template.

**"Is it completely finished?"** adds four checks: the plan records the
change, the docs record any new state or rule, the plan's later phases still
work, and follow-up work has its own issues.

## What you get

A report with a verdict, the blockers, what was fixed and the proof for each,
questions only you can answer, and the sections for what was checked and
found sound, not applicable, not verified, CI after the fixes, what is not
worth holding the pull request for, and the local load. A pull request is
"Safe to merge" only when no blocker is left and CI passed after the last
push. For example, a clean pull request reports:

```markdown
## Audit of #42 — Add the search page

**Verdict: Safe to merge. I found nothing that needs changing.**

### Checked and sound
- A. Purpose — all three acceptance criteria are in the diff, with tests.
```

## What it never does

- Never invents a finding, and never states a fact without pointing to a file,
  a command output or the pull request's own words. What it cannot check goes
  under "Not verified".
- Never merges, approves or closes the pull request. Only the owner merges.
- Never force-pushes, and never pushes to a merged pull request's branch.
- Never runs the full test suite, or starts a database, server, Docker or
  browser "to be sure".
- Never adds AI attribution to a commit.
- Never works in your own folder. If the project's rules differ from the
  skill, the project's rules win and the report says so.

## Exact templates and wording

Every template, command and checklist is in [the skill itself](../../plugins/go-dark/skills/audit-pr/SKILL.md).
