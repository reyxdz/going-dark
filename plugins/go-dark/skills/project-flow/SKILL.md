---
name: project-flow
description: Use when deciding what step a piece of work is at or what comes next, when starting work on an issue, when a pull request has merged, before a release, or when asked whether an issue or feature is finished or what is left.
---

# Project flow

## Overview

Every piece of work moves through the same nine steps, and each step has an
exit condition. Work is finished when real users have it and the records say
so, not when the code merges.

First, read the project's own rules (`AGENTS.md` or `CLAUDE.md`, contributing
and release guides). Where they define a step differently, the project wins.
If the project has none, say so in your answer and use the steps below.

## The nine steps

| # | Step | Done when |
|---|---|---|
| 1 | **Issue** | It meets the issue standard (`/go-dark:write-issue`). |
| 2 | **Decide** | Every open question on the issue is ticked with who decided and the date. Anything expensive to reverse has a decision record (ADR), *Proposed* until the owner accepts it. A plan exists if the work spans several pull requests. The next ADR, plan and migration numbers are claimed on the issue. |
| 3 | **Handoff** | For work delegated to another agent or person: a handoff prompt (`/go-dark:write-handoff`), saved in the project's handoffs folder. Not needed when the person who decided also builds it in one session. |
| 4 | **Build** | One pull request at a time, each branched fresh from the default branch. A step of a larger issue says `Part of #N`; only the pull request that finishes it says `Closes #N`. The merged pull requests together cover every phase of the plan. |
| 5 | **Audit** | `/go-dark:audit-pr` finds it safe to merge while keeping its purpose. |
| 6 | **Merge** | The owner approves and merges. With several open pull requests, the owner picks the order, and the rest update from the default branch. |
| 7 | **Verify on staging** | Someone used the change where users will: a real phone, both themes, the plan's verify steps. CI cannot do this. Without a staging environment, the closest real one. |
| 8 | **Release** | The project's release procedure, run by the owner. Release on a rhythm, so no release carries weeks of unrelated change. |
| 9 | **Close out** | The plan's boxes are ticked only for what was done, its status matches, follow-ups are filed as issues, and the issue is closed only once users have the feature. |

## Rules that hold across the steps

- **Merge dormant, switch on later.** Work that depends on money, rollout or
  another team merges behind a switch or stays unreachable, so code is never
  blocked on budget.
- **Records match reality.** A plan, an ADR's status, an index row and a
  pull request description are updated in the same change that makes them
  wrong.
- **An audit finding that does not belong in the pull request becomes an
  issue**, in the issue standard, linked from where it was found.
- **Before launch**, the project's "before launch" issues (backups, uptime,
  error reporting) are done before the first public release, not after.

## Answering "is this finished?" or "what's left?"

1. **Check, don't assume.** Gather: the issue's state and Decided section;
   the pull requests that mention it, merged or not; the plan's progress table
   and boxes; any ADR's status; and whether the release branch contains the
   work (`git merge-base --is-ancestor <merge-commit> origin/<release-branch>`).
2. **Compare the pull requests with the plan.** If the number or scope of the
   merged pull requests does not match the plan's phases, say so: a phase may
   be marked Done without its own change.
3. **Classify every step** as done, not done, or **unconfirmed** — one you
   could not check from what you have. Unconfirmed is reported with what would
   confirm it, and does not block the steps after it.
4. **Report**, in this order:
   - the verdict in one sentence, naming the first step not done;
   - every remaining step in order, each with what is left and **who owns it**
     (the owner, unless the plan names someone else);
   - the unconfirmed steps;
   - which project rules you read, or that there were none.

**Release rhythm.** Use the project's own rhythm. If it sets none, flag a
release branch more than two weeks or ten merged pull requests behind the
default branch.

**Closing the issue.** If no merged pull request says `Closes #N`, nothing will
close it automatically: say it must be closed by hand at step 9.
