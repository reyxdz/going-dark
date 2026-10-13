---
name: project-flow
description: Use when deciding what step a piece of work is at or what comes next, when starting work on an issue, when a pull request has merged, before a release, or when asked whether an issue or feature is finished.
---

# Project flow

## Overview

Every piece of work moves through the same nine steps, and each step has an
exit condition. Work is finished when real users have it and the records say
so — not when the code merges.

First, read the project's own rules (`CLAUDE.md`, contributing and release
guides). Where they define a step differently, the project wins.

## The nine steps

| # | Step | Done when |
|---|---|---|
| 1 | **Issue** | It meets the issue standard (`/go-dark:write-issue`). |
| 2 | **Decide** | Every open question on the issue is ticked with who decided and the date. Anything expensive to reverse has a decision record (ADR), *Proposed* until the owner accepts it. A plan exists if the work spans several pull requests. The next ADR, plan and migration numbers are claimed on the issue. |
| 3 | **Handoff** | For delegated or multi-step work: a handoff prompt (`/go-dark:write-handoff`), saved in the project's handoffs folder. |
| 4 | **Build** | One pull request at a time, each branched fresh from the default branch. A step of a larger issue says `Part of #N`; only the pull request that finishes it says `Closes #N`. |
| 5 | **Audit** | `/go-dark:audit-pr` finds it safe to merge while keeping its purpose. |
| 6 | **Merge** | The owner approves and merges. With several open pull requests, the owner picks the order, and the rest update from the default branch. |
| 7 | **Verify on staging** | Someone used the change where users will: a real phone, both themes, the plan's verify steps. CI cannot do this. |
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

## Answering "is this finished?"

Walk the nine steps for the issue and report the first one not done, with
what is left and who owns it. Check, don't assume: the pull requests merged,
the plan's boxes, the issue's state, and whether the release branch contains
the work (`git merge-base --is-ancestor <commit> origin/<release-branch>`).
