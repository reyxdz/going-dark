---
name: audit-pr
description: Use when asked to audit, review or check a pull request, whether a pull request is safe or "perfectly safe" to merge, whether it is completely finished, or to fix what a review found before merging.
---

# Audit a pull request

## Overview

The bar is **perfectly safe to merge while keeping its purpose**. Anything that
needs even a little attention is fixed, not just reported. If the pull request
is already fine, say so plainly — never invent findings.

**An audit includes its fixes.** Being asked to audit is being asked to fix
what the audit finds, on the pull request's branch. Report fixes as suggested
patches instead only when the user asked for a verdict alone, or the branch is
a fork you cannot push to.

## Process

1. **Context.** Read the project's rules (`AGENTS.md` or `CLAUDE.md`, the PR
   template, the guide the PR check enforces), the pull request's
   description, its issue and plan.
2. **State.** `gh pr view` (state, mergeable, review), `gh pr checks`, how far
   behind the default branch it is, and the base it was cut from. List the
   **other open pull requests** and their files: two pull requests claiming one
   plan, ADR or migration number only shows up there.
3. **Merge first, in a scratch worktree.** Never use the user's checkout.
   Trial-merge the current default branch to find conflicts and the breakage
   a clean merge hides (a renamed function another pull request still calls).
4. **Read the diff file by file** against the checklist below.
5. **Check with minimal load.** Typecheck, lint and the tests the change
   touches, locally, one worker. Leave the full suites — and any test that
   needs a database the machine is not already running — to CI. Start a
   database, dev servers or a browser only if no other check can answer, and
   stop them.
6. **Fix.** On the pull request's branch:
   - confirm it is still open; merge the default branch if needed;
   - fix what makes it safe and keeps its purpose. If the description promises
     something the diff lacks, build it when it is small and clearly in scope;
     otherwise it is a blocker, and the owner decides;
   - one commit per fix, with a message saying why;
   - a **behaviour** fix gets a test that fails without it (prove it by
     reverting the fix once); a fix to docs, records or the description does
     not need one;
   - push normally — never force — and watch CI.
7. **Report** (format below).

## Checklist

- **Purpose:** every acceptance criterion is met in the code and has a test.
- **Security and privacy:** authentication and ownership on every route;
  validation; no secret, token or personal data in code, logs, responses,
  descriptions or screenshots; abuse vectors (unauthenticated writes, missing
  rate limits, unbounded growth, personal data kept with no retention).
- **Data:** migrations additive; safe on live data; safe inside the way the
  project runs them (one transaction? a new enum value used in the same
  transaction fails); migration metadata and schema match; a second generate
  step finds nothing.
- **Deployment skew:** during a release, old and new frontend and backend run
  side by side. New response fields are optional and read with a fallback;
  old clients still work.
- **Concurrency:** two requests at once — a duplicate becomes the proper
  error, not a 500.
- **Tests:** deterministic (no unordered pick, no timing luck); they would
  fail without the change; none are empty placeholders.
- **UI:** design tokens; accessibility (labels, focus, live regions that
  don't announce every keystroke); phone width; both themes.
- **Records,** where the project keeps them: API and data docs, the plan's
  boxes and status, index rows, decision records — all match the code.
- **Description:** accurate after your fixes; screenshots real, current,
  free of personal data and not duplicated; passes the project's PR check.

## "Is it completely finished?"

Everything above, plus: the plan and docs record the change (a new state, a
new rule), later steps of the plan still hold, and follow-ups are filed. If it
already merged, put fixes in a new small pull request from the default branch.

## Report

1. **Verdict:** safe to merge, or not yet — with every blocker, most severe
   first.
2. **What I fixed**, each with why it mattered and the test that proves it.
3. **Questions only the owner can answer** (intent, retention, scope).
4. **What I checked** and found sound.
5. **Not verified,** and why (no access, no screenshot, no commit messages).
6. **CI after the fixes.**
7. **Not worth holding it for** — only genuinely cosmetic items.
8. **Local load:** what ran locally, and that nothing is left running.
