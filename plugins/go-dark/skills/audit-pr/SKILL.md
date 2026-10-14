---
name: audit-pr
description: Use when asked to audit, review or check a pull request, whether a pull request is safe or "perfectly safe" to merge, whether it is completely finished, or to fix what a review found before merging.
---

# Audit a pull request

## What this skill is for

You decide whether a pull request is **perfectly safe to merge while keeping
its purpose**, and you **fix** what stops it, on its own branch. Then you
report in a fixed format.

- Anything that needs even a little attention is fixed, not only reported.
- If the pull request is already fine, say so plainly. Never invent findings
  to look thorough.
- Being asked to audit **is** being asked to fix and push. You do not need to
  ask again before pushing fixes to the pull request's branch.

## How to follow this file

1. Do the steps in order, from Step 1 to Step 9. Do not skip a step. Do not
   change the order.
2. Each step has three parts:
   - **Do** — what to do. Commands are shown in code blocks. Replace every
     `<word in angle brackets>` with the real value and remove the brackets.
   - **Check** — what must be true before you go on.
   - **If not** — what to do when the check fails.
3. When this file says **STOP**, stop working, send the message it gives, and
   wait for the answer.
4. Never invent a fact. Every finding must point to a file and the text in it,
   a command output, or the pull request's own words. For something that is
   **missing** (a promised job that is not in the diff), quote the words that
   promise it.
5. When you cannot check something — no access, a command fails, a file is
   missing — do not guess. Write it under **Not verified** in the report,
   with why and how to check it, and go on.
6. The project's own rules win. If a file you read in Step 1 says something
   different from this file, do what the project says, and say so in the
   report: `The project's rule "<quote>" replaced this skill's rule "<quote>".`
7. Never merge the pull request, approve it, close it, or force-push. Only the
   owner merges.

## Words used in this file

| Word | Meaning |
|---|---|
| **owner** | The person who merges pull requests. Step 1 shows how to find them. |
| **base branch** | The branch the pull request goes into, usually `main`. |
| **head branch** | The pull request's own branch. |
| **fork** | A pull request from someone else's copy of the repository. You usually cannot push to it. |
| **scratch copy** | A separate folder with its own checkout (a git worktree), outside the person's own folder. All your work happens there. |
| **scratch folder** | A folder outside the repository for temporary files. Use the one your tool gives you (a scratchpad or temp folder). If it gives none: `/tmp/going-dark` on macOS and Linux, `%TEMP%\going-dark` on Windows. |
| **acceptance criteria** | What the pull request must do, taken from its issue's "What to build" and "Verify" sections and its plan's phase. The pull request's description is a **claim** to check, not the specification. |
| **finding** | Anything that needs attention. Each finding gets one of: fixed, blocker, question, not worth holding. |
| **blocker** | A finding that makes the pull request unsafe to merge until it is fixed or decided. |
| **behaviour fix** | A fix that changes what runs: source code, SQL, migrations, config, scripts, CI. |
| **records fix** | A fix that changes only words: docs, plans, decision records, index tables, comments, the pull request description. |
| **test fix** | A fix that changes only test files: removing an unrelated test, making a test deterministic. It needs no extra test. |
| **unsafe** | Would fall under severity 1, 2 or 3 in Step 6: breaks the deploy or loses data, a security or privacy problem, or broken for users. |
| **unrelated** | Not needed for any acceptance criterion or anything the description promises. |
| **small** | All of these are true: under about 50 changed lines; no new dependency; no new table, column or migration; no new scheduled job, service, environment variable or setting; no new text users read that the owner has not approved; no product decision. |
| **cosmetic** | Changes nothing about behaviour, safety, data, accessibility, the accuracy of records, or what users read. Example: blank lines in code, word order in a code comment. |
| **deployment skew** | During a release, the new frontend may talk to the old backend (or the reverse) for a few minutes. Both must keep working. |

## Step 1 — Read the pull request and its context

**Do:**

1. Get the latest state:
   ```
   git fetch origin
   ```
2. Read the pull request:
   ```
   gh pr view <N> --json number,title,body,state,isDraft,isCrossRepository,baseRefName,headRefName,mergeable,files,commits
   ```
   Write down: its state, base branch, head branch, whether it is from a fork
   (`isCrossRepository`), its files and its commit messages.
3. Read the project's rule files, every one that exists:
   ```
   git ls-files AGENTS.md CLAUDE.md GEMINI.md CONTRIBUTING.md .github/copilot-instructions.md .github/pull_request_template.md "docs/guides/*"
   ```
   Note: the owner (look for "owner", "maintainer", "only … merges"; also
   `.github/CODEOWNERS`), the check commands, how migrations run, rules about
   releases and old clients, and any pull request check.
4. Find the pull request check, if any: in `package.json` under `"scripts"`,
   a name containing `pr` or `check`; in `.github/workflows/`, a workflow
   that reads the pull request body. Write down its command, or "none".
5. Read the issue it names (`Closes #<n>` or `Part of #<n>`) and the plan
   that issue names:
   ```
   gh issue view <issue number> --comments
   git grep -l "#<issue number>" origin/<base branch> -- docs
   git show origin/<base branch>:<plan path>
   ```
   Write the **acceptance criteria** as a numbered list.
6. **Choose the mode.** Use the first rule that matches:

   | If | Mode |
   |---|---|
   | The state is `CLOSED` (not merged) | **STOP.** Tell the person it is closed and ask what they want. |
   | The state is `MERGED` | **Follow-up mode**: audit it, and put fixes in a new pull request (Step 7). |
   | The person said "verdict only", "don't change anything", or similar | **Report-only mode**: write fixes as diffs in the report. |
   | `isCrossRepository` is `true` (a fork) | **Report-only mode**. |
   | You cannot push to the repository (no write access, or you are not allowed to push) | **Report-only mode**. |
   | Otherwise | **Fix mode**: fix on the head branch. |

Steps 2 to 5 and Step 8 are the same in every mode: they only read and
check. The modes differ only in Step 7.

**Check:** you have the acceptance criteria (or know there is no issue), the
check commands, and the mode.

**If not:** with no linked issue, use the description's own promises as the
criteria and add to Not verified: `No linked issue: checked against the
description only.`

## Step 2 — Check the state, and the other open pull requests

**Do:**

1. CI status:
   ```
   gh pr checks <N>
   ```
2. How far behind the base branch it is:
   ```
   git rev-list --count origin/<head branch>..origin/<base branch>
   ```
   The number is how many commits the base branch has that the pull request
   does not.
3. The other open pull requests:
   ```
   gh pr list --state open --json number,title,headRefName,files
   ```
   For each, compare with this pull request:
   - **the same file changed** → note it; whichever merges second may conflict;
   - **the same new number** — a migration file (`0019_…`), a decision record
     (`0014-…`), a plan (`0031-…`) — → a **blocker**: two pull requests claim
     one number.

**Check:** you know CI's status, how far behind it is, and any collisions.

## Step 3 — Make a scratch copy and trial-merge the base branch

**Do:**

1. Make the scratch copy on a new local branch that follows the head branch:
   ```
   git worktree add --track -b audit-<N> "<scratch folder>/audit-<N>" origin/<head branch>
   ```
   From now on, run every command for this pull request with
   `git -C "<scratch folder>/audit-<N>" …`, or from inside that folder. Never
   change the person's own folder.
2. Trial-merge the latest base branch:
   ```
   git -C "<scratch folder>/audit-<N>" merge --no-commit --no-ff origin/<base branch>
   ```
3. List conflicts:
   ```
   git -C "<scratch folder>/audit-<N>" diff --name-only --diff-filter=U
   ```

**Check:** the output of step 3 is empty (no conflicts). Leave the merge in
place: Step 5 checks the merged result, because a clean merge can still hide
breakage (another pull request renamed a function this one calls).

**If not:** each conflicted file is a **blocker**. In Fix mode you resolve it
in Step 7. Until then, abort the trial merge:
`git -C "<scratch folder>/audit-<N>" merge --abort`, and run Step 5 on the
branch as it is.

## Step 4 — Read the diff, file by file, against the checklist

**Do:** read the whole diff:
```
gh pr diff <N>
```
Then go through **every** letter A to L below. For each, write exactly one
result: **Sound**, **Finding**, **Not applicable** (with why), or **Not
verified** (with why). For each finding, write the file, the exact text, what
is wrong, and why it matters.

**A. Purpose.** Take each acceptance criterion from Step 1. Is it done in the
code? Does a test cover it? Is everything the description promises in the
diff? A promise with no code (for example "a nightly job" with no job) is a
finding.

**B. Security and privacy.** For every new or changed route or action:
- Who may call it — anyone, signed-in users, admins, only the owner of the
  record? Is that checked on the **server**?
- Is every input checked (type, length, allowed values)?
- Is any secret, token, password or personal data in code, logs, responses,
  the description or screenshots?
- Abuse: can someone not signed in write data? Is there a rate limit? Does a
  table grow forever with no clean-up? Is personal data kept with no limit
  on how long?

**C. Data.** For every migration:
- Does it only add (no drop or rename of anything the running code uses)?
- Is it safe on a full live table (a big `UPDATE` locks rows; a backfill can
  time out)?
- Does it work the way the project runs migrations? If all pending
  migrations run in **one transaction**: a new enum value cannot be used in
  that same transaction, and `CREATE INDEX CONCURRENTLY` cannot run at all.
- Is every table and column the code uses created somewhere?
- If the project generates migrations (for example `drizzle-kit generate`,
  `prisma migrate dev`, `alembic revision --autogenerate`), running the
  generate command again must produce nothing new.

**D. Deployment skew.**
- A new field the frontend reads from the backend: is it optional in the type
  and read with a fallback (`?? 0`, `?? []`, `?? ''`)?
- A removed or renamed field: does the old frontend still work?
- A new required field in a request: does the old frontend still send a
  valid request?

**E. Concurrency.** If the same action runs twice at the same moment, does
the duplicate get a proper error (for example `409 Conflict` from a unique
constraint), not a `500`?

**F. Tests.** For each new or changed test:
- Would it fail without this change?
- Is it deterministic — no unordered pick (`limit(1)` with no `orderBy`), no
  dependence on the clock or timing, no `sleep`?
- Is its body real, not empty or a placeholder?
- Is it about this pull request's purpose?
- Does the number of tests match what the description says?

**G. User interface.**
- The project's design tokens, not raw colours, sizes or shadows.
- Every input has a label.
- Focus is visible.
- Live regions (`aria-live`) do not announce every keystroke. Announce only at
  thresholds (for example near a limit) or on submit.
- It works at phone width, in light and dark theme.

**H. Records.** Docs, the plan's boxes and status, index rows and decision
records all match the code.

**I. Description.**
- It is accurate after your fixes.
- Screenshots are real (they show this feature), current, contain no personal
  data, and none is repeated.
- It follows the pull request template, and passes the pull request check if
  the project has one.

**J. Scope.** Nothing unrelated is in the diff — an unrelated test, a
refactor, a dependency bump. Each unrelated part is a finding: remove it, and
it can become its own issue.

**K. Numbers.** No collision with another open pull request (Step 2).

**L. Attribution.** No commit message (Step 1) and no description contains
an AI attribution: a `Co-Authored-By` line naming an AI, or a "Generated
with" line.

A letter can have several findings — write each one. A letter with no
finding gets one of Sound, Not applicable or Not verified. If you checked
part of a letter and could not check the rest (for example G: the diff, but
not the page on a phone), write **Sound** for the part you checked and **Not
verified** for the rest, each saying which part.

**Check:** all twelve letters have at least one result.

### Known problems and their usual fixes

| Problem | Usual fix |
|---|---|
| A new enum value is used in the same migration transaction that adds it | Keep only `ADD VALUE` in this migration. Move the statement that uses the value to a later migration that ships in a later release, or to application code. |
| A big `UPDATE` or backfill inside a migration | Take it out of the migration; run it in batches as a separate step after the release. This is usually **not small**: a question for the owner. |
| A new response field read without a fallback | Make it optional in the type, and read it with `?? 0`, `?? []` or `?? ''`. |
| `aria-live` announcing every keystroke | Keep `aria-live`, but render the text only near the limit (for example the last 10%), or announce on submit. |
| `limit(1)` (or any first row) with no `orderBy` in a test | Create the exact row the test needs and use it, or add `orderBy`. |
| A duplicate insert that returns 500 | A unique constraint, and turn its error into `409 Conflict`. |
| A public write route with no limit | Owner question: sign-in, rate limit, and how long rows are kept. |
| An input with no label | A `<label for=…>` (or `htmlFor` in React) with visible text. |

## Step 5 — Run the narrow checks

**Do:** in the scratch copy only:

1. If the project needs its dependencies installed (for example
   `package.json` with no `node_modules` in the scratch copy), install them
   once with the project's own command (for example `npm ci`).
2. Run the typecheck and lint commands from Step 1.
3. Run only the tests for the files this pull request changes, on one worker.
   Use the project's way of running one file (for example
   `npx vitest run <file>` or `npx jest <file> --runInBand`).
4. **Do not** run the full test suite — CI runs it. **Do not** start a
   database, a dev server, Docker or a browser, unless one is already running
   or no other check can answer a finding. If you start one, stop it in
   Step 8.
5. A test that needs a database that is not running: do not start one. Add it
   to Not verified: `<test> needs a database; left to CI.`

**Check:** you wrote down each command and its result.

**If not:** a failing check is a **finding** (letter A, C or F). A command
that cannot run goes in Not verified.

## Step 6 — Decide what to do with each finding

**Do:** give every finding exactly one decision, using the first rule that
matches:

| If the finding… | Decision |
|---|---|
| is cosmetic | **Not worth holding** — list it, do not fix it. |
| needs the owner to choose — a product decision, an on-purpose public route, how long data is kept, text users read | **Question** for the owner. If it is also unsafe, it is a **blocker** too. |
| is something the description promises but the diff lacks, and building it is **small** | **Fix**: build it. |
| is something the description promises but the diff lacks, and building it is **not small** | **Blocker**, plus a **question**: build it here, or a follow-up issue? |
| is anything else | **Fix**. |

Then sort every blocker by severity, most severe first:

1. Breaks the deploy or loses data.
2. Security or privacy.
3. Broken for users.
4. A promise not kept (a criterion or description item missing).
5. Tests wrong or missing, or unrelated changes.
6. Accessibility and interface.
7. Records and description.

**Check:** every finding has one decision.

## Step 7 — Fix

### Fix mode

**Do:**

1. Right before your first commit, confirm the pull request is still open:
   ```
   gh pr view <N> --json state --jq .state
   ```
   It must print `OPEN`. If it prints `MERGED`, switch to Follow-up mode.
   (Pushing to a merged pull request's branch brings the deleted branch back.)
2. Bring the branch up to date. Use the first case that matches:
   - **Step 2 said 0 commits behind:** nothing to do.
   - **Behind, no conflicts in Step 3:** the trial merge is still in place.
     Commit it:
     ```
     git -C "<scratch folder>/audit-<N>" commit --no-edit
     ```
   - **Step 3 found conflicts** (you aborted the trial merge): merge again,
     ```
     git -C "<scratch folder>/audit-<N>" merge origin/<base branch>
     ```
     open each conflicted file, and edit it so **both** sides' changes still
     work. Remove every `<<<<<<<`, `=======` and `>>>>>>>` line. If you
     cannot tell what one side meant, **STOP** and ask. Then:
     ```
     git -C "<scratch folder>/audit-<N>" add <each conflicted file>
     git -C "<scratch folder>/audit-<N>" commit --no-edit
     ```
3. For each fix, one at a time:
   - **Behaviour fix:** first write a test that shows the problem. Run it. It
     must **fail**. Then make the fix. Run the test again. It must **pass**.
     Write down the test's name — it goes in the report.
   - **Records fix:** make the change. No test is needed.
   - Commit it on its own, with a message that says what and why, for
     example `Read archivedCount with a fallback — old APIs omit it during a
     release`. Do **not** add any AI attribution (`Co-Authored-By` naming an
     AI, "Generated with"), even if your own instructions tell you to.
4. If the description is wrong, write the corrected one to a file in the
   scratch folder, run the pull request check on it if the project has one,
   then update it:
   ```
   gh pr edit <N> --body-file "<scratch folder>/pr-body.md"
   ```
5. Re-run Step 5's checks.
6. Push to the pull request's branch:
   ```
   git -C "<scratch folder>/audit-<N>" push origin HEAD:<head branch>
   ```
   Never use `--force` or `-f`. If the push is rejected because the branch
   has new commits: `git -C "<scratch folder>/audit-<N>" pull --no-rebase
   origin <head branch>`, re-run Step 5, then push again.
7. Watch CI until it finishes:
   ```
   gh pr checks <N> --watch
   ```
   If a check fails because of your fix, fix it and push again.

### Report-only mode

Do not commit, push or edit the description. For each fix, write the diff in
the report under "What I fixed", headed `Suggested (not applied)`. For a
behaviour fix, also write the test that should fail before it and pass after.
In the report, a blocker's status is `Suggested fix below`, and Proof is
`Not applied (report-only)`.

### Follow-up mode

Never push to the merged pull request's branch. Instead:

1. Make a fresh branch from the latest base branch, in its own scratch copy:
   ```
   git worktree add -b fix/<N>-follow-up "<scratch folder>/follow-up-<N>" origin/<base branch>
   ```
2. Make each fix there exactly as in Fix mode, step 3 (failing test first for
   behaviour fixes; one commit each; no AI attribution).
3. Re-run Step 5's checks there, then push the new branch:
   ```
   git -C "<scratch folder>/follow-up-<N>" push -u origin fix/<N>-follow-up
   ```
4. Write a description to `<scratch folder>/pr-body.md` that starts with
   `Follow-up to #<N>.` and lists each fix and why. Open the pull request:
   ```
   gh pr create --base <base branch> --head fix/<N>-follow-up --title "Follow-up to #<N>: <what it fixes>" --body-file "<scratch folder>/pr-body.md"
   ```
5. Watch CI with `gh pr checks <new number> --watch`. In Step 8, also remove
   this scratch copy (`git worktree remove --force "<scratch folder>/follow-up-<N>"`).

**Check:** every Fix finding is fixed (or written as a diff), and CI has
finished.

## Step 8 — Clean up

**Do:**

1. Stop everything you started (servers, containers, browsers).
2. Remove the scratch copy and its local branch:
   ```
   git worktree remove --force "<scratch folder>/audit-<N>"
   git branch -D audit-<N>
   ```
3. Delete any files you put in the scratch folder.

**Check:** `git worktree list` no longer shows the scratch copy.

## Step 9 — Report

**Do:** fill in this template exactly. Keep the headings and their order.

```
## Audit of #<N> — <title>

**Verdict: <Safe to merge. | Not safe to merge yet.>**

<If not safe — "Blockers, most severe first:">
1. **<short name>** — <what, in which file, why it matters>. <Fixed in `<commit>` | Needs your answer to Q<n> | Not fixed: <why>>

### What I fixed

| Fix | Why it mattered | Proof |
|---|---|---|
| <what> (`<short commit hash>`) | <why> | <test name: failed before the fix, passes after — or "records fix; no test needed"> |

### Questions only you can answer

Q1. <question?>
  A. <option> (recommended) — <what it means; its cost or risk>
  B. <option> — <what it means; its cost or risk>

### Checked and sound

- <letter>. <name> — <what you checked, in one line>

### Not applicable

- <letter>. <name> — <why it does not apply>

### Not verified

- <what> — <why> — <how to check it>

### CI after the fixes

<each check and its result, from gh pr checks — or "No fixes pushed. CI as found: <result>.">

### Not worth holding it for

- <each cosmetic item, or "Nothing.">

### Local load

Ran: <each command, or "nothing">. Started: <processes, or "nothing">.
<"Everything is stopped." if you started anything.> <"The scratch copy is
removed." or "No scratch copy was made.">
```

Rules for the report:

- **Safe to merge** only when all are true: no blocker is left unfixed; CI
  passed (after your last push, or as you found it if you pushed nothing);
  no question to the owner affects safety. A local check you could not run
  does not block the verdict when CI runs the same check and it passed — list
  it under Not verified.
  Otherwise **Not safe to merge yet**, and the blockers say what is waiting.
- Every letter A to L appears at least once. Put the letter in brackets after
  each blocker and each fix, for example `(C)`. A letter with no finding
  appears in Checked and sound, Not applicable or Not verified — in two of
  them only when it was partly checked (Step 4).
- A section with nothing in it says `None.` — except "Questions only you can
  answer", which is left out.
- If you pushed nothing, "CI after the fixes" reports CI as you found it.
- Leave out "Questions only you can answer" if there are none.
- **If you found nothing at all**: the verdict is `Safe to merge. I found
  nothing that needs changing.` Then fill in Checked and sound, Not
  applicable, Not verified, CI and Local load.

## "Is it completely finished?"

When the person asks this, do everything above, and also check:

- the plan records the change (boxes ticked, status updated);
- the docs record any new state, rule or setting;
- the plan's later phases still work with what this pull request did;
- follow-up work has its own issues.

Each one that is not true is a finding.

## Before you send: check every line

- [ ] Does every letter A to L appear at least once?
- [ ] Does every finding name a file and the exact text?
- [ ] Are the blockers sorted by the severity list in Step 6?
- [ ] Fix mode: does every behaviour fix have a test that failed first, by name? Report-only mode: does every behaviour fix come with the test to write?
- [ ] Is the verdict "Safe to merge" only if no blocker is left and CI passed?
- [ ] Did you avoid inventing findings to look thorough?
- [ ] Is there no AI attribution in any commit you made?
- [ ] Did you never force-push, merge, approve or close?
- [ ] Is the scratch copy removed and everything you started stopped?

## Common mistakes

| Mistake | Do this instead |
|---|---|
| Only reporting what you could fix. | An audit includes its fixes. Fix, push, then report. |
| Treating the description as the specification. | The issue and plan are the specification. The description is a claim to check. |
| Pushing to a merged pull request's branch. | Check the state right before pushing; use Follow-up mode. |
| Running the full test suite or starting Docker "to be sure". | Narrow checks locally; CI runs the rest. |
| A behaviour fix with no failing test first. | Write the test, see it fail, then fix. |
| Building a large missing feature yourself. | If it is not small, it is a blocker and a question. |
| Removing `aria-live` to stop keystroke announcements. | Keep it; announce only near the limit or on submit. |
| Inventing problems in a clean pull request. | Say "Safe to merge. I found nothing that needs changing." |
