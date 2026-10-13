# `/go-dark:project-flow`

> **Claude Code:** `/go-dark:project-flow` · **Other agents:** the `go-dark-project-flow` skill — ask for it by what you want, or by name.

Tells you where a piece of work stands in [the flow](../the-flow.md), what
comes next, and whether it is really finished.

## When it runs

- You type `/go-dark:project-flow`, optionally with an issue or pull request:
  `/go-dark:project-flow #12`.
- You ask "is #12 finished?", "what's left on this?", "what comes next?".
- A pull request has just merged, or a release is coming.

## What it does

1. Reads the project's own rules first (`AGENTS.md` or `CLAUDE.md`, contributing and release
   guides). Where the project defines a step differently, the project wins.
2. Gathers the facts — it does not assume:
   - the issue's state, its Decided section, and its linked pull requests;
   - which pull requests merged (`gh pr list --search "#12" --state all`);
   - the plan's progress table and unticked boxes;
   - any decision record's status;
   - **whether the release branch contains the work**:
     `git merge-base --is-ancestor <merge-commit> origin/<release-branch>`.
3. Walks the nine steps and stops at the **first one not done**.
4. Reports that step, what is left in it, and who owns it.

## Example report

> **#12 is built but not finished: step 8, Release.**
> Both pull requests merged (#40, #44), and staging was checked on a phone.
> Production does not have it yet: it is 31 commits behind the default branch.
> Left: the owner releases; then step 9 — tick plan 0012's Phase 3 and close
> #12.

## What "finished" means

Finished is step 9 done: users have the feature, and every record says so.
Merged code is step 6. The skill will not call work finished at step 6.

## Common mistakes it prevents

| Mistake | What the skill does |
|---|---|
| Closing an issue when its code merges | Checks the release branch contains the work first |
| A plan that still says "Not started" after the work shipped | Lists the boxes and statuses to update in step 9 |
| A follow-up mentioned in a review and then forgotten | Asks for it to be filed as an issue |
| Two contributors taking the same plan or migration number | Asks for numbers to be claimed in step 2 |
