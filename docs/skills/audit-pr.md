# `/go-dark:audit-pr`

> **Claude Code:** `/go-dark:audit-pr` · **Other agents:** the `go-dark-audit-pr` skill — ask for it by what you want, or by name.

Audits a pull request to one bar — **perfectly safe to merge while keeping its
purpose** — and fixes what needs fixing on the branch, rather than only listing
it.

## When it runs

- `/go-dark:audit-pr 42` or `/go-dark:audit-pr <url>`.
- "Audit this", "is this perfectly safe to merge?", "check this PR", "fix that
  and make it safe".
- "Is this completely finished?" — the stricter variant below.

## The bar

| If | Then |
|---|---|
| The pull request is already safe | It says so plainly. It never invents findings |
| Anything needs even a little attention | It is fixed on the branch, not just reported |
| A finding does not belong in this pull request | It becomes an issue, linked from the report |

"A little attention" includes stale lines in the description, duplicated
screenshots, a test that only passes by luck, and a badge that breaks for a
minute during a release.

## The process

1. **Context.** The project's rules (`AGENTS.md` or `CLAUDE.md`, the PR template, the guide
   its PR check enforces), the pull request's description, its issue and plan.
2. **State.** `gh pr view` (state, mergeable, review decision), `gh pr checks`,
   how far behind the default branch it is, and the commit it was cut from.
3. **Merge first, in a scratch worktree** — never the user's checkout.
   A trial merge of the current default branch finds conflicts, and also the
   breakage a clean merge hides: two pull requests claiming the same plan, ADR
   or migration number; a function renamed in one and still called in another.
4. **Read the diff, file by file,** against the checklist below.
5. **Check with minimal load.** Typecheck, lint and the tests the change
   touches, locally, on one worker. The full suites are CI's job. A database,
   dev server or browser is started only if nothing else can answer — and
   stopped.
6. **Fix.** On the pull request's branch:
   - confirm the pull request is **still open** (a merged one's branch is
     gone, and a push would recreate it);
   - merge the default branch in if it is behind;
   - one commit per fix, with a message that says **why**;
   - a test that **fails without the fix** — proven by reverting the fix once;
   - push normally, **never force**, and watch CI to green.
7. **Report.**

## The checklist

| Area | Questions |
|---|---|
| **Purpose** | Is every acceptance criterion met in the code, with a test? |
| **Security and privacy** | Authentication and ownership on every route? Input validated? No secret, token or personal data in code, logs, responses, descriptions or screenshots? Abuse vectors — unauthenticated writes, missing rate limits, unbounded growth? |
| **Data** | Migrations additive? Safe on live data? Safe the way the project runs them — if all pending migrations run in one transaction, a new enum value used in the same transaction fails the deploy? Does a second generate step find nothing? |
| **Deployment skew** | During a release old and new frontends and backends run side by side. Are new response fields optional and read with a fallback? Do old clients still work? |
| **Concurrency** | Two identical requests at once — does the second get the proper error, not a 500? |
| **Tests** | Deterministic — no unordered pick, no timing luck? Would they fail without the change? |
| **UI** | Design tokens only? Accessible — labels, focus, live regions that don't announce every keystroke? Phone width? Both themes? |
| **Records** | API and data docs, the plan's boxes and status, index rows, decision records — do they match the code? |
| **Description** | Accurate after the fixes? Screenshots real, current, free of personal data, not duplicated? Passes the project's PR check? |

## "Is it completely finished?"

Everything above, plus:

- the plan and docs **record** the change — a new state, a new rule, a new
  limit;
- the plan's **later** steps still hold given what changed;
- follow-ups are filed.

If the pull request has **already merged**, fixes go in a new, small pull
request from the default branch — never onto the merged branch.

## The report

```markdown
<Verdict in one sentence: safe to merge / not yet, and the one thing blocking.>

**What I fixed** (<n> commits on <branch>, normal pushes, no AI attribution):
1. **<Problem>** — <why it mattered>. <What changed>. <The test that proves it.>

**What I checked and found sound:**
- <area> — <what was verified>

**Not worth holding it for:**
- <only genuinely cosmetic items>

**Local load:** <what ran locally>; nothing is left running.
```
