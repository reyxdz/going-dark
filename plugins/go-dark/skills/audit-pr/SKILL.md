---
name: audit-pr
description: Use when asked to audit, review or check a pull request, whether a pull request is safe or "perfectly safe" to merge, whether it is completely finished, or to fix what a review found before merging.
---

# Audit a pull request

## Overview

The bar is **perfectly safe to merge while keeping its purpose**. Anything that
needs even a little attention is fixed on the branch, not just reported. If
the pull request is already fine, say so plainly — never invent findings.

## Process

1. **Context.** Read the project's rules (`CLAUDE.md`, PR template, the guide
   the PR check enforces), the pull request's description, its issue and plan.
2. **State.** `gh pr view` (state, mergeable, review), `gh pr checks`, how far
   behind the default branch it is, and the base it was cut from.
3. **Merge first, in a scratch worktree.** Never use the user's checkout.
   Trial-merge the current default branch to find conflicts and the
   breakage a clean merge hides (two pull requests claiming one plan, ADR or
   migration number; a renamed function another pull request still calls).
4. **Read the diff file by file** against the checklist below.
5. **Check with minimal load.** Typecheck, lint and the tests the change
   touches, locally, one worker. Leave the full suites to CI. Start a database,
   dev servers or a browser only if no other check can answer, and stop them.
6. **Fix.** On the pull request's branch: confirm it is still open, merge the
   default branch if needed, make each fix its own commit with a message
   saying why, add a test that fails without the fix (prove it by reverting
   the fix once), push normally — never force — and watch CI.
7. **Report** (format below).

## Checklist

- **Purpose:** every acceptance criterion is met in the code and has a test.
- **Security and privacy:** authentication and ownership on every route;
  validation; no secret, token or personal data in code, logs, responses,
  descriptions or screenshots; abuse vectors (unauthenticated writes, missing
  rate limits, unbounded growth).
- **Data:** migrations additive; safe on live data; safe inside the way the
  project runs them (one transaction? a new enum value used in the same
  transaction fails); a second generate step finds nothing.
- **Deployment skew:** during a release, old and new frontend and backend run
  side by side. New response fields are optional and read with a fallback;
  old clients still work.
- **Concurrency:** two requests at once — a duplicate becomes the proper
  error, not a 500.
- **Tests:** deterministic (no unordered pick, no timing luck); they would
  fail without the change.
- **UI:** design tokens; accessibility (labels, focus, live regions that
  don't announce every keystroke); phone width; both themes.
- **Records:** API and data docs, the plan's boxes and status, index rows,
  decision records — all match the code.
- **Description:** accurate after your fixes; screenshots real, current,
  free of personal data and not duplicated; passes the project's PR check.

## "Is it completely finished?"

Everything above, plus: the plan and docs record the change (a new state, a
new rule), later steps of the plan still hold, and follow-ups are filed. If it
already merged, put fixes in a new small pull request from the default branch.

## Report

1. **Verdict first:** safe to merge / not yet, and the one thing blocking.
2. **What I fixed**, with why each mattered.
3. **What I checked** and found sound.
4. **Not worth holding it for** — only genuinely cosmetic items.
5. **Local load:** what ran locally, and that nothing is left running.
