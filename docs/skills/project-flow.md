# `/go-dark:project-flow`

> **Claude Code:** `/go-dark:project-flow` · **Other agents:** the `go-dark-project-flow` skill — ask for it by what you want, or by name.

## When it runs

- You type `/go-dark:project-flow`, optionally with an issue or pull request:
  `/go-dark:project-flow #12`.
- You ask "is #12 finished?", "what's left on this?", "what comes next?".
- A pull request has just merged, or a release is coming.

## What it does

It checks nine steps of [the flow](../the-flow.md), gives each one a status,
and sends a report in a fixed format. The nine steps are: 1 Issue, 2 Decide,
3 Handoff, 4 Build, 5 Audit, 6 Merge, 7 Verify on staging, 8 Release, 9 Close
out. Work is finished only when real users have it and the records say so.
Merged code is step 6, not the end.

Every step gets one of four statuses:

- **Done** — it saw evidence that the step is complete.
- **Not done** — it looked and the evidence shows the step is false or missing.
- **Not needed** — the step does not apply (only a handoff can be not needed).
- **Unconfirmed** — it could not look, for example no access or a failed
  command. Looking and finding nothing is Not done, not Unconfirmed.

The steps of the skill itself:

1. **Find the project's facts** — the project's rule files, the owner, the
   default branch, and how the project releases (a release branch, tags, or
   deploying the default branch). Where the project defines something
   differently, the project wins and the report says so.
2. **Collect what the records say about the issue** — the issue and its
   comments, its pull requests, and the plan, decision records and handoff that
   mention it.
3. **Give each of the nine steps a status** — by a fixed rule for each step.
   For example, Release is checked by whether the last merged pull request's
   commit is in the release branch or a tag. Audit is never marked Not done,
   because audits are often given in chat; it is Unconfirmed if none is
   written on GitHub.
4. **Look for warnings** — the plan and merged pull requests do not match; no
   pull request has a closing keyword, so the issue will not close itself; the
   release is behind (more than 14 days or more than 10 commits, unless the
   project sets its own rhythm); or the work reached users with an earlier step
   not done.
5. **Decide the verdict** — "Yes, finished", "No, the first step not done is
   step N", or "I cannot confirm". An Unconfirmed step is never the first step
   not done.
6. **Write the report** — in the fixed template.

It only reads. It does not create, edit, close, merge or comment on anything.

## What you get

A report that starts with the verdict, then lists every step still to do,
lowest number first, with the exact action and who owns it. That is the owner,
unless the plan names someone. It then lists the steps it could not check and
what would confirm each, the steps already done or not needed, any warnings,
and what it read. Where the next step has a skill (write-issue, write-handoff
or audit-pr), it names it. For example:

```
**Is #12 finished?** No. #12 is not finished. The first step not done is step 7 (Verify on staging).

| Step | Status | What is left | Who does it |
|---|---|---|---|
| 7. Verify on staging | Not done | Check the cover photo on staging on a real phone, then comment what you checked on #12 | the owner |
| 8. Release | Not done | Release the default branch | the owner |
```

## What it never does

- Never invents a fact. Every name, number, date and result comes from
  something it read or ran. Anything it could not check is written as
  `[NOT CHECKED: …]` and appears in the report.
- Never changes anything: no comment, close, merge, edit or ticked box.
- Never calls work finished because the pull requests merged.
- Never marks a step Not done because it could not open something. That is
  Unconfirmed.
- Never assumes the issue will close itself. Only a merged pull request with a
  closing keyword does that.

## Exact templates and wording

Every template, command and checklist is in [the skill itself](../../plugins/go-dark/skills/project-flow/SKILL.md).
