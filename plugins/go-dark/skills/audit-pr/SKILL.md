---
name: audit-pr
description: Use when asked to audit, review or check a pull request, a branch or uncommitted changes, whether they are safe or "perfectly safe" to merge, to find every problem in them however minor (even a single typo), whether a pull request is completely finished, or to fix what a review found before merging.
---

# Audit a pull request

## What this skill is for

You decide whether a pull request is **PERFECTLY SAFE to merge into its target
branch while keeping its purpose** — or you list **every** fix it needs, down to
a single typo. In Fix mode you also make those fixes on its branch. Then you
report in a fixed format.

There are only two verdicts:

- **PERFECTLY SAFE to merge into `<branch>`.** — nothing at all is left to fix.
- **NOT SAFE TO MERGE YET — `<count>` fixes needed.** — followed by every fix,
  however small.

Three rules make the audit fair:

- **Nothing is too small.** A typo, a double space, a wrong capital letter, a
  leftover `console.log` — each is a fix, and each one keeps the pull request
  from being perfectly safe.
- **Nothing is invented.** Every finding quotes the exact text that is wrong
  and the rule it breaks. "I would write it differently" is not a finding.
- **A clean pull request is called clean.** If you find nothing, the verdict is
  PERFECTLY SAFE. Never add findings to look thorough.

Being asked to audit **is** being asked to fix and push (Fix mode). You do not
need to ask again before pushing fixes to the pull request's branch.

## How to follow this file

1. Do the steps in order, from Step 1 to Step 10. Do not skip a step. Do not
   change the order.
2. Each step has three parts:
   - **Do** — what to do. Commands are shown in code blocks. Replace every
     `<word in angle brackets>` with the real value and remove the brackets.
   - **Check** — what must be true before you go on.
   - **If not** — what to do when the check fails.
3. When this file says **STOP**, stop working, send the message it gives, and
   wait for the answer.
4. Never invent a fact. Every finding must quote the exact text from the diff,
   a command output, or the pull request's own words. For something that is
   **missing** (a promised job that is not in the diff), quote the words that
   promise it.
5. When you cannot check something — no access, a command fails, a file is
   missing — do not guess. Note it for Step 7, which decides whether it blocks.
6. The project's own rules win — "the project" is the repository the pull
   request belongs to, not whatever folder you happen to be in. If a file you
   read in Step 1 says something
   different from this file, do what the project says, and say so in the
   report: `The project's rule "<quote>" replaced this skill's rule "<quote>".`
7. Never merge the pull request, approve it, close it, or force-push. Only the
   owner merges.

## Words used in this file

| Word | Meaning |
|---|---|
| **owner** | The person who merges pull requests. Step 1 shows how to find them. |
| **base branch** | The branch the pull request goes into — the target branch, usually `main`. |
| **head branch** | The pull request's own branch. |
| **fork** | A pull request from someone else's copy of the repository. You usually cannot push to it. |
| **scratch copy** | A separate folder with its own checkout (a git worktree), outside the person's own folder. All your work happens there. |
| **scratch folder** | A folder outside the repository for temporary files. Use the one your tool gives you (a scratchpad or temp folder). If it gives none: `/tmp/going-dark` on macOS and Linux, `%TEMP%\going-dark` on Windows. |
| **acceptance criteria** | What the pull request must do, taken from its issue's "What to build" and "Verify" sections and its plan's phase. The pull request's description is a **claim** to check, not the specification. |
| **changed line** | A line in the diff that starts with `+` (added or changed). Lines starting with `-` are removed; you check them only to see what was lost. |
| **finding** | Something in the change that is wrong, missing or inconsistent, and breaks a named rule (Step 7). Every finding is either a **fix** or a **question** for the owner. |
| **preference** | "I would write it differently" with no rule broken. A preference is **not** a finding and is never reported. |
| **behaviour fix** | A fix that changes what runs: source code, SQL, migrations, config, scripts, CI — except the tidy fixes below. |
| **text fix** | A fix that changes only words people read: docs, comments, copy, test names, the description, plans, decision records, index tables — and the words inside a string in code, when nothing else on the line changes. |
| **tidy fix** | Removing something that should not be there, or whitespace: an unused import or variable, a leftover debug or log line (even one that logs personal data), commented-out code, trailing spaces. It needs no test. |
| **test fix** | A fix that changes only test files: removing an unrelated test, making a test deterministic. |
| **unsafe** | Severity 1, 2 or 3 in Step 7: breaks the deploy or loses data, a security or privacy problem, or broken for users. |
| **unrelated** | Not needed for any acceptance criterion or anything the description promises. |
| **small** | All of these are true: under about 50 changed lines; no new dependency; no new table, column or migration; no new scheduled job, service, environment variable or setting; no new text users read that the owner has not approved; no product decision. |
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
   Write down: its title, description, state, base branch, head branch,
   whether it is from a fork (`isCrossRepository`), its files and **every
   commit message**.
3. Read the project's rule files, every one that exists:
   ```
   git ls-files AGENTS.md CLAUDE.md GEMINI.md CONTRIBUTING.md .github/copilot-instructions.md .github/pull_request_template.md "docs/guides/*"
   ```
   Note: the owner (look for "owner", "maintainer", "only … merges"; also
   `.github/CODEOWNERS`), the check commands, how migrations run, rules about
   releases and old clients, **style rules** (capitalisation, spelling, naming,
   wording), whether pull requests are **squash-merged**, and any pull request
   check.
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
   Write the **acceptance criteria** as a numbered list. Copy every piece of
   exact text the issue specifies (messages, labels, numbers) — Step 5
   compares them character by character.
6. **Choose the mode.** Use the first rule that matches:

   | If | Mode |
   |---|---|
   | The state is `CLOSED` (not merged) | **STOP.** Tell the person it is closed and ask what they want. |
   | The state is `MERGED` | **Follow-up mode**: audit it, and put fixes in a new pull request (Step 8). |
   | The person said "verdict only", "report only", "don't change anything", or similar | **Report-only mode**: write every fix in the report, change nothing. |
   | `isCrossRepository` is `true` (a fork) | **Report-only mode**. |
   | You cannot push to the repository (no write access, or you are not allowed to push) | **Report-only mode**. |
   | Otherwise | **Fix mode**: fix on the head branch. |

Steps 2 to 7 and Step 9 are the same in every mode: they only read and
check. The modes differ only in Step 8.

**Check:** you have the acceptance criteria (or know there is no issue), the
check commands, the style rules, and the mode.

**If not:** with no linked issue, use the description's own promises as the
criteria, and note for Step 7: `No linked issue: checked against the
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
     (`0014-…`), a plan (`0031-…`) — → a finding: two pull requests claim one
     number.

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
2. If Step 2 said **0 commits behind**, skip to the Check: there is nothing to
   merge.
3. Otherwise trial-merge the latest base branch:
   ```
   git -C "<scratch folder>/audit-<N>" merge --no-commit --no-ff origin/<base branch>
   ```
4. List conflicts:
   ```
   git -C "<scratch folder>/audit-<N>" diff --name-only --diff-filter=U
   ```

**Check:** no conflicts (step 4 printed nothing, or you skipped it). Leave a
clean trial merge in place: Step 6 checks the merged result, because a clean
merge can still hide breakage (another pull request renamed a function this
one calls).

**If not:** each conflicted file is a finding. In Fix mode you resolve it in
Step 8. Until then, abort the trial merge:
`git -C "<scratch folder>/audit-<N>" merge --abort`, and run Step 6 on the
branch as it is.

## Step 4 — Check what the change means: letters A to L

**Do:** read the whole diff:
```
gh pr diff <N>
```
Then go through **every** letter A to L below. For each, write one result:
**Sound**, **Finding** (with each finding), **Not applicable** (with why), or
**Not verified** (with why). For each finding, write the file, the exact text,
what is wrong, and why it matters.

**A. Purpose.** Take each acceptance criterion from Step 1. Is it done in the
code? Does a test cover it? Is everything the description promises in the
diff? Is every new piece of code actually used — a new component that nothing
renders, a new route that nothing calls? A promise with no code (for example
"a nightly job" with no job) is a finding.

**B. Security and privacy.** For every new or changed route or action:
- Who may call it — anyone, signed-in users, admins, only the owner of the
  record? Is that checked on the **server**?
- Is every input checked on the server (type, length, allowed values)? A limit
  only in the browser (`maxLength`) is not a limit.
- Is any secret, token, password or personal data (names, emails, phone
  numbers, messages) in code, **logs**, responses, the description or
  screenshots?
- Abuse: can someone not signed in write data or send email? Is there a rate
  limit? Does a table grow forever with no clean-up? Is personal data kept with
  no limit on how long?

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

**D. Deployment skew and connections.**
- A new field the frontend reads from the backend: is it optional in the type
  and read with a fallback (`?? 0`, `?? []`, `?? ''`)?
- A removed or renamed field: does the old frontend still work?
- A new required field in a request: does the old frontend still send a
  valid request?
- Does every caller use exactly the name the other side expects — the same
  URL path, the same field names, the same method? Compare the frontend
  request with the backend route and its validation, letter by letter.

**E. Concurrency and failure.**
- If the same action runs twice at the same moment (a double click), does the
  duplicate get a proper error, not a `500` or a second email?
- If a call fails (a network error, a `400`, a `500`), does the code notice?
  Showing success after a failed request is a finding.

**F. Tests.** For each new or changed test:
- Would it fail without this change?
- Does it test the exact value the issue gives (a limit of 500 is tested with
  501, not 5001)?
- Is it deterministic — no unordered pick (`limit(1)` with no `orderBy`), no
  dependence on the clock or timing, no `sleep`?
- Is its body real, not empty or a placeholder?
- Is it about this pull request's purpose?
- Does the number of tests match what the description says?

**G. User interface** — checked from the code and from the screenshots in the
description. (Looking at the running page on a phone is the staging step that
comes after merging; it is not required here.)
- The project's design tokens, not raw colours, sizes or shadows.
- Every input has a label.
- Focus is visible.
- Live regions (`aria-live`) do not announce every keystroke. Announce only at
  thresholds (for example near a limit) or on submit.
- A message that appears after an action (a success or error text) is
  announced: `role="status"` or `aria-live="polite"`.

**H. Records.** Docs, the plan's boxes and status, index rows and decision
records all match the code — every name, number and limit. Also search for
the **old** value or behaviour the change replaces (an old limit, an old
message, an old format): `git -C "<scratch folder>/audit-<N>" grep -n "<old
value>"`. Every place that still says the old thing is a finding.

**I. Description.**
- It is accurate after your fixes. It claims nothing the diff does not do.
- Its issue number is right: `Closes #<n>` names the issue in Step 1.
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

**Not applicable** means the diff touches nothing the letter is about (no
migration → C). **Sound** means it does, and you found nothing wrong.

A letter can have several findings — write each one. If you checked part of a
letter and could not check the rest, write **Sound** for the part you checked
and **Not verified** for the rest, each saying which part.

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
| A public write route with no limit | The project's rate limiter if it has one; otherwise an owner question: sign-in, rate limit, and how long rows are kept. |
| An input with no label | A `<label for=…>` (or `htmlFor` in React) with visible text. |
| A `fetch` whose result is never checked | Check `response.ok`; show success only when it is true, and an error otherwise (error text is an owner question if the issue gives none). |
| Personal data in a log line | Remove the log line, or log only an anonymous id. |

## Step 5 — Read every changed line: letters M and N

Step 4 checked what the change **means**. This step checks what it **says**,
one line at a time. It is how single typos are found. Do not skip a line
because it "looks fine".

**Do:**

1. **List what to read.** Everything below gets the same line-by-line reading:
   - every changed line (`+`) in every file of the diff;
   - the pull request's title and every line of its description;
   - every commit message (Step 1);
   - every new or renamed file name.
2. **Get the mechanical checks first:**
   ```
   git -C "<scratch folder>/audit-<N>" diff --check origin/<base branch>...HEAD
   ```
   Every line it prints (trailing whitespace, mixed spaces and tabs) is a
   finding under N. Also, `\ No newline at end of file` under a `+` line in the
   diff is a finding under N.
3. **Read each changed line and ask every question below.** For text people
   read — comments, strings, messages, labels, docs, test names, the
   description, commit messages — read it **word by word**. In Markdown,
   read the words, and also check the markup is complete: every backtick and
   every `**` has its pair, and every link has its `(...)`. For names in code
   (variables, functions, fields, files), split them into words first:
   `contactMesssage` → "contact", "messsage"; `send_mail` → "send", "mail".

   | Code | Question | Example of a finding |
   |---|---|---|
   | **M1** | Is every word spelled correctly? A word that is not an English word must be a name the project already uses: `git grep -c -w "<word>" origin/<base branch>` prints a count above 0. | "bussiness", "recieve", "mesage", "messsage" |
   | **M2** | Is any word repeated by mistake? | "the the", "to to" |
   | **M3** | Is a word confused with a similar one? Check every: its/it's, your/you're, their/there/they're, then/than, affect/effect, lose/loose, to/too, whose/who's, a/an. | "if it's length" → "its length" |
   | **M4** | Is the spacing right? No double space inside text, no space before `,` `.` `!` `?` `:`, a space after them. | "Thanks!  We" |
   | **M5** | Do quotes and brackets open and close in pairs? Does each sentence end like its neighbours (all with a full stop, or none)? | |
   | **M6** | Does capitalisation follow the project's style rule (Step 1) and match its neighbours? | "Email Address" where labels use sentence case |
   | **M7** | Where the issue gives exact text, is it the same **character by character**? Compare letter by letter, space by space. | |
   | **M8** | Is every sentence grammatical and complete? | "This checks if user exist" |
   | **M9** | Is every number the same everywhere it appears — issue, code, tests, docs, description? List each number in the change and find every other place it must match. | `max(5000)` in code, 500 in the issue, 1000 in the docs |
   | **M10** | Is every name the same everywhere — the same field, route, file or function spelled identically in frontend, backend, tests and docs? For each new name: `git -C "<scratch folder>/audit-<N>" grep -n -w "<name>"`. Spelled differently elsewhere → finding. | `message` in the form, `messsage` on the server |
   | **M11** | Does every reference point at something real — issue numbers, file paths, links, function names in comments and docs? Check with `git ls-files <path>`, `git grep`, `gh issue view <n>`. | "Closes #96" when the issue is #69 |
   | **N1** | Is any debug leftover there — `console.log`, `print`, `debugger`, `dump`, a hard-coded test value? | `console.log('contact form', …)` |
   | **N2** | Is anything unused — an import, variable, function or parameter? For each new name, the `git grep -n -w` from M10 shows only its own definition → unused. | `import { formatDate }` never used |
   | **N3** | Is there commented-out code, or a `TODO`/`FIXME` with no issue number? | `// TODO fix later` |
   | **N4** | Does the line match the file's own style — indentation, quote marks, semicolons — like the lines around it? | |
   | **N5** | Whitespace: anything `git diff --check` printed, and a missing newline at the end of a file. | trailing spaces |

4. **Fill in the coverage table.** One row per file, plus one row each for
   the title, the description and the commit messages:

   | File | Changed lines | Lines read | Findings |
   |---|---|---|---|
   | `backend/src/routes/contact.ts` | 21 | 21 | 4 |

   "Changed lines" is the number of `+` lines in that file. For the title,
   the description and the commit messages, it is their number of non-blank
   lines. "Lines read" must be the same number.

**Check:** in every row, Lines read equals Changed lines.

**If not:** go back and read the lines you missed.

## Step 6 — Run the narrow checks

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
   Step 9.
5. A test that needs a database that is not running: do not start one. Note
   it: `<test> needs a database; left to CI.`

**Check:** you wrote down each command and its result.

**If not:** a failing check is a finding (letter A, C or F). A command
that cannot run is noted for Step 7.

## Step 7 — Prove every finding, then decide

**Do:**

1. **Prove each finding.** Delete it unless all three are true:
   - **It is real.** The quoted text is really there. Search for it:
     ```
     git -C "<scratch folder>/audit-<N>" grep -n -F "<exact quoted text>" -- <file>
     ```
     The output gives the **line number** — use this number in the report,
     never one you counted yourself. If the search output and the diff seem
     to disagree, open the file and look: the file is the truth. (For the title, description or a commit
     message, quote it from Step 1. For something missing, quote the words
     that promise it.)
   - **It breaks a rule** you can name: a letter A–L, a code M1–N5, an
     acceptance criterion, a project rule, or plain correctness (it would
     crash, fail, mislead or leak).
   - **It can be fixed exactly**: you can write the exact new text or the exact
     action.

   Anything that fails is a preference, a guess or a duplicate: delete it.
   Never write "consider", "might", "could be nicer" or "optionally" — a
   finding is either a fix or not reported at all.
2. **Decide each finding,** using the first rule that matches:

   | If the finding… | Decision |
   |---|---|
   | needs the owner to choose — a product decision, an on-purpose public route, how long data is kept, new text users read that the issue does not give, or a value nobody has given (a rate limit, a size) | **Question** for the owner. It also stays in the fix list until answered. |
   | is something the description promises but the diff lacks, and building it is **small** | **Fix**: build it. |
   | is something the description promises but the diff lacks, and building it is **not small** | **Question**: build it here, or a follow-up issue? |
   | is a typo in a **commit message** | **Fix at merge**: if the project squash-merges, the owner corrects it in the squash commit message — write the corrected message. If it does not, write: "Cannot be fixed without rewriting history, which is not allowed; the owner decides." Never force-push to fix it. |
   | is anything else | **Fix**. |

3. **Sort the unverified items** (things you could not check):

   | If you could not check… | Then |
   |---|---|
   | something CI runs and CI passed (typecheck, lint, tests) | Not verified, **does not block**. |
   | how the page looks on a real phone or in dark mode | Not verified, **does not block** — the staging step after merging covers it. |
   | anything else that could hide a finding (how a route is mounted, a file the change depends on) | **First do it yourself**: run the command, read the file. Only if you truly cannot (no access, the command fails) does it become a **check** in the fix list — "Do: run/read `<what>` and confirm `<what>`", with the severity of what it could hide (7 if unsure). **It blocks.** |

   Something that does not exist is not unverified: if `git ls-files` prints
   nothing for a pull request template, or the issue names no plan, that part
   simply does not apply — write "Not applicable" for it.

4. **Sort the fix list by severity**, then by file path, then by line:

   1. Breaks the deploy or loses data.
   2. Security or privacy.
   3. Broken for users.
   4. A promise not kept (a criterion or description item missing).
   5. Tests wrong or missing, or unrelated changes.
   6. Accessibility and interface.
   7. Records and description.
   8. Text and tidiness (M and N).

   M and N findings are severity 8, except: text the issue gives exactly (M7)
   that is wrong → 4; a number or name that differs between two places (M9,
   M10) and breaks behaviour → 3; one that is wrong only in docs → 7. A **question** takes the severity of the
   finding it decides. A missing thing with no file yet is listed under the
   file where it belongs, or `(no file yet)`.

**Check:** every remaining finding quotes real text, names its rule, has an
exact fix, and has a severity.

## Step 8 — Fix

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
3. Fix **every** finding with the decision Fix — including every typo — one
   at a time:
   - **Behaviour fix:** first write a test that shows the problem. Run it. It
     must **fail**. Then make the fix. Run the test again. It must **pass**.
     Write down the test's name — it goes in the report.
   - **Text, tidy or test fix:** make the change. No new test is needed.
   - Commit each behaviour fix on its own, with a message that says what and
     why, for example `Read archivedCount with a fallback — old APIs omit it
     during a release`. Text and tidy fixes may share one commit, for example
     `Fix typos and remove a leftover log line`. Do **not** add any AI
     attribution (`Co-Authored-By` naming an AI, "Generated with"), even if
     your own instructions tell you to.
4. If the description is wrong, write the corrected one to a file in the
   scratch folder, run the pull request check on it if the project has one,
   then update it:
   ```
   gh pr edit <N> --body-file "<scratch folder>/pr-body.md"
   ```
   A wrong title: `gh pr edit <N> --title "<corrected title>"`.
5. Re-run Step 6's checks, and Step 5's `git diff --check`.
6. Push to the pull request's branch:
   ```
   git -C "<scratch folder>/audit-<N>" push origin HEAD:<head branch>
   ```
   Never use `--force` or `-f`. If the push is rejected because the branch
   has new commits: `git -C "<scratch folder>/audit-<N>" pull --no-rebase
   origin <head branch>`, re-run Step 6, then push again.
7. Watch CI until it finishes:
   ```
   gh pr checks <N> --watch
   ```
   If a check fails because of your fix, fix it and push again.

### Report-only mode

Change nothing: no commit, no push, no edit to the title or description. Steps
3 and 6 still run — a scratch copy and narrow checks only read. Every finding
goes in the report's fix list with its exact fix. For a behaviour fix,
also write the test to add, which fails before the fix and passes after.

### Follow-up mode

Never push to the merged pull request's branch. Instead:

1. Make a fresh branch from the latest base branch, in its own scratch copy:
   ```
   git worktree add -b fix/<N>-follow-up "<scratch folder>/follow-up-<N>" origin/<base branch>
   ```
2. Make each fix there exactly as in Fix mode, step 3 (failing test first for
   behaviour fixes; no AI attribution).
3. Re-run Step 6's checks there, then push the new branch:
   ```
   git -C "<scratch folder>/follow-up-<N>" push -u origin fix/<N>-follow-up
   ```
4. Write a description to `<scratch folder>/pr-body.md` that starts with
   `Follow-up to #<N>.` and lists each fix and why. Open the pull request:
   ```
   gh pr create --base <base branch> --head fix/<N>-follow-up --title "Follow-up to #<N>: <what it fixes>" --body-file "<scratch folder>/pr-body.md"
   ```
5. Watch CI with `gh pr checks <new number> --watch`. In Step 9, also remove
   this scratch copy (`git worktree remove --force "<scratch folder>/follow-up-<N>"`).

**Check:** in Fix and Follow-up mode, every Fix finding is fixed and CI has
finished. In Report-only mode, every finding has its exact fix written down.

## Step 9 — Clean up

**Do:**

1. Stop everything you started (servers, containers, browsers).
2. Remove the scratch copy and its local branch:
   ```
   git worktree remove --force "<scratch folder>/audit-<N>"
   git branch -D audit-<N>
   ```
3. Delete any files you put in the scratch folder.

**Check:** `git worktree list` no longer shows the scratch copy.

## Step 10 — Report

**Do:** fill in this template exactly. Keep the headings and their order.

```
## Audit of #<N> — <title>

**<PERFECTLY SAFE to merge into `<base branch>`. | NOT SAFE TO MERGE YET — <count> fixes needed before merging into `<base branch>`.>**

Mode: <Fix | Report-only | Follow-up>.

### Fixes needed

1. **[<severity number>. <severity name>] (<letter or code>)** `<file>:<line>` — <what is wrong, and why it matters>.
   Now: `<the exact current text>`
   Change to: `<the exact new text>`
   <For a behaviour fix: "Test to add: <name> — fails now, passes after.">
   <For a missing thing or a check: "Do: <the exact action>." instead of Now / Change to.>

### What I found and fixed

| # | What was wrong | Fix | Commit | Proof |
|---|---|---|---|---|
| 1 | `<file>:<line>` — <what> (<letter or code>) | <what you changed> | `<short hash>` | <test name: failed before, passes after — or "text fix" / "tidy fix"> |

### Questions only you can answer

Q1. <question?>
  A. <option> (recommended) — <what it means; its cost or risk>
  B. <option> — <what it means; its cost or risk>

### What I checked

| Check | Result | Note |
|---|---|---|
| A. Purpose | <Sound / Finding / Not applicable / Not verified> | <one line> |
| … one row for each of A to L … | | |
| M. Text (M1–M11) | <Sound / Finding> | <one line> |
| N. Tidiness (N1–N5) | <Sound / Finding> | <one line> |

<A letter checked only in part: "Sound, except <what>". The rest is in Fixes
needed or Not verified.>

### Line coverage

| File | Changed lines | Lines read | Findings |
|---|---|---|---|

### Not verified (does not block)

- <what> — <why it does not block: "CI ran it and passed" or "checked on staging after merging">

### CI

<each check and its result, from gh pr checks — after your last push, or as you found it if you pushed nothing>

### Local load

Ran: <each command, or "nothing">. Started: <processes, or "nothing">.
<"Everything is stopped." if you started anything.> <"The scratch copy is
removed." or "No scratch copy was made.">
```

Rules for the report:

- **PERFECTLY SAFE to merge into `<base branch>`.** only when **all** are true:
  - no finding is left unfixed — in Report-only mode, that means there are no
    findings at all;
  - no question to the owner is open;
  - no blocking check is left (Step 7);
  - CI passed (after your last push, or as you found it if you pushed
    nothing).
- Otherwise **NOT SAFE TO MERGE YET — `<count>` fixes needed**, where
  `<count>` is the number of items in "Fixes needed" (fixes, checks and
  findings waiting on a question all count).
- **Fixes needed** lists **every** remaining finding and blocking check, in the
  Step 7 order, numbered from 1. Nothing is left out for being small. Leave the
  section out when the verdict is PERFECTLY SAFE.
- **What I found and fixed** lists every finding you fixed (Fix and Follow-up
  mode). Leave it out in Report-only mode.
- Leave out "Questions only you can answer" if there are none.
- **What I checked** has one row for every letter A to N.
- The line number in every finding comes from the `git grep -n` in Step 7.
- **If you found nothing at all**: the verdict is `PERFECTLY SAFE to merge into
  <base branch>. I found nothing that needs changing.` Then fill in What I
  checked, Line coverage, Not verified, CI and Local load.

## "Is it completely finished?"

When the person asks this, do everything above, and also check:

- the plan records the change (boxes ticked, status updated);
- the docs record any new state, rule or setting;
- the plan's later phases still work with what this pull request did;
- follow-up work has its own issues.

Each one that is not true is a finding.

## Changes with no pull request

When asked to audit a branch, or uncommitted work, instead of a pull request:

- **A branch:** the base branch is the one the person names, or the default
  branch. Use `git diff origin/<base branch>...<branch>` instead of
  `gh pr diff`, and `git log origin/<base branch>..<branch>` for the commit
  messages. Make the scratch copy from `<branch>`.
- **Uncommitted work** in the person's folder: read it, never change it. Use
  `git diff HEAD` for changed files, and `git ls-files --others
  --exclude-standard` for new files (read each one in full; every line of a
  new file is a changed line). There are no commit messages, title or
  description to check.
- Skip what does not exist: Step 2 (CI, other pull requests) and the mode
  table. Use **Report-only mode** unless the person asked you to fix — and
  never commit someone's uncommitted work.
- The verdict names the target: `PERFECTLY SAFE to merge into <base branch>`.

## Before you send: check every line

- [ ] Does the verdict use one of the two exact wordings?
- [ ] Is the verdict PERFECTLY SAFE only if no finding, question or blocking check is left and CI passed?
- [ ] Is every finding in "Fixes needed", however small, with nothing moved aside as "minor"?
- [ ] Does every finding quote the exact text, with a line number from `git grep -n`?
- [ ] Does every finding name its rule and give an exact fix?
- [ ] Did you delete every preference, guess and duplicate (Step 7)?
- [ ] Is the fix list in severity order, then file, then line?
- [ ] Does Lines read equal Changed lines in every coverage row?
- [ ] Did you read the title, the description and every commit message word by word?
- [ ] Does What I checked have a row for every letter A to N?
- [ ] Fix mode: does every behaviour fix have a test that failed first, by name? Report-only mode: does every behaviour fix come with the test to add?
- [ ] Is there no AI attribution in any commit you made?
- [ ] Did you never force-push, merge, approve or close?
- [ ] Is the scratch copy removed and everything you started stopped?

## Common mistakes

| Mistake | Do this instead |
|---|---|
| Calling a typo "minor" and leaving it out. | Every typo is a fix. It goes in the list and blocks PERFECTLY SAFE. |
| Skimming lines that "look fine". | Read every changed line against M1–N5, and prove it in the coverage table. |
| Counting line numbers by hand. | Use the number `git grep -n` prints. |
| A finding that says "consider" or "might". | Either it breaks a rule and has an exact fix, or it is not reported. |
| Inventing problems in a clean pull request. | Say "PERFECTLY SAFE to merge into `<branch>`. I found nothing that needs changing." |
| Only reporting what you could fix. | In Fix mode, fix every finding, push, then report. |
| Treating the description as the specification. | The issue and plan are the specification. The description is a claim to check. |
| Checking the frontend and backend separately. | Compare the names, paths and limits on both sides, letter by letter (M9, M10, D). |
| Force-pushing to fix a commit message. | Squash projects: give the corrected squash message. Otherwise the owner decides. |
| Pushing to a merged pull request's branch. | Check the state right before pushing; use Follow-up mode. |
| Running the full test suite or starting Docker "to be sure". | Narrow checks locally; CI runs the rest. |
| A behaviour fix with no failing test first. | Write the test, see it fail, then fix. |
| Building a large missing feature yourself. | If it is not small, it is a question for the owner. |
| Removing `aria-live` to stop keystroke announcements. | Keep it; announce only near the limit or on submit. |
