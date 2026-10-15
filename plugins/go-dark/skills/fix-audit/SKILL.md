---
name: fix-audit
description: Use when asked to fix what an audit found — to apply the fixes listed in an audit report from /go-dark:audit-pr, or "fix everything the audit said", on a pull request or a branch.
---

# Fix what an audit found

## What this skill is for

`/go-dark:audit-pr` writes a report that lists every fix a pull request needs,
each with the exact current text and the exact new text. This skill makes
**every one of those fixes, exactly as written**, on the pull request's
branch, and reports what happened to each item.

Three rules make it safe:

- **Exactly what the report says.** Each item is applied as written — nothing
  more, nothing less. No extra improvements, no reformatting.
- **Found before changed.** Before changing a line, you find its current text
  in the file. If it is not there, you do not guess: you report it.
- **You never judge your own work.** When you are done, a fresh run of
  `/go-dark:audit-pr` decides whether the pull request is PERFECTLY SAFE. You
  never write that verdict yourself.

## How to follow this file

1. Do the steps in order, from Step 1 to Step 11. Do not skip a step. Do not
   change the order.
2. Each step has three parts:
   - **Do** — what to do. Commands are shown in code blocks. Replace every
     `<word in angle brackets>` with the real value and remove the brackets.
   - **Check** — what must be true before you go on.
   - **If not** — what to do when the check fails.
3. When this file says **STOP**, stop working, send the message it gives, and
   wait for the answer.
4. Never invent a fix. Every change you make comes from an item in the report,
   or from the owner's answer to one of its questions.
5. When you cannot do something — a command fails, a file is missing, the
   text is not there — do not guess. Mark the item "Could not apply" with the
   reason, and go on to the next item.
6. The project's own rules win. If a project file says something different
   from this file, do what the project says, and say so in the report.
7. **Never change the person's own folder.** All work happens in a scratch
   copy. Never merge, approve, close or force-push. Only the owner merges.

## Words used in this file

| Word | Meaning |
|---|---|
| **report** | The audit report from `/go-dark:audit-pr`. It starts with `## Audit of #<N>` and has a numbered list under `### Fixes needed`. |
| **item** | One numbered entry in that list. |
| **Now text** | The exact current text an item quotes, after `Now:`. |
| **Change-to text** | The exact new text, after `Change to:`. `(delete the line)` means remove the whole line. Inside a Now or Change-to text **everything is literal**, angle brackets included (`From: Ana <ana@example.com>` keeps its `<` and `>`) — except a placeholder the report says to fill in, such as "`<N>` comes from Q1". |
| **owner** | The person who merges pull requests — usually the person who asked you. |
| **the person's folder** | Their own checkout of the repository — the folder you were started in. You only read it. |
| **scratch copy** | A separate checkout (a git worktree) in the scratch folder. All changes happen there. |
| **scratch folder** | A folder outside the repository for temporary files. Use the one your tool gives you (a scratchpad or temp folder). If it gives none: `/tmp/going-dark` on macOS and Linux, `%TEMP%\going-dark` on Windows. |
| **base branch** | The branch the pull request goes into, usually `main`. |
| **head branch** | The pull request's own branch. |
| **behaviour fix** | A change to what runs: source code, SQL, migrations, config, scripts, CI — including markup attributes such as `role`, `disabled` or `aria-live`. |
| **text fix** | A change only to words people read: docs, comments, copy, test names, the description — and the words inside a string, when nothing else on the line changes. |
| **tidy fix** | Removing something that should not be there, or whitespace: an unused import, a leftover log line (even one that logs personal data), commented-out code, trailing spaces. |
| **test fix** | A change only to test files: a test's input, name or expected value. It needs no new test. |

### The five kinds of item

Give each item exactly one kind. Use the first rule that matches:

| If the item… | Kind | What you do |
|---|---|---|
| says "Question Q<n>" or "Needs your answer" | **Question** | Ask the owner (Step 4). The answer turns it into an Edit or an Action. |
| says "Fix at merge" | **At merge** | Nothing in the code. Carry it to your final message. |
| says "Check" and has a `Do:` that reads or runs something to confirm it | **Check** | Run or read exactly that, and write down what you found. |
| has `Now:` and `Change to:` | **Edit** | Find the Now text and replace it with the Change-to text. |
| has `Do:` without `Now:` | **Action** | Do exactly what it says. |

## Step 1 — Get the report

**Do:** find the report. Use the first place that has it:

1. The person pasted it in the conversation.
2. The person named a file: read it.
3. It is a comment on the pull request:
   ```
   gh pr view <N> --comments
   ```
   Use the **newest** comment that starts with `## Audit of #<N>`.

**Check:** the report starts with `## Audit of #<N>`, its verdict line says
`NOT SAFE TO MERGE YET — <count> fixes needed`, and it has a numbered list
under `### Fixes needed`.

**If not:**
- No report anywhere → **STOP**. Send: `There is no audit report for #<N>
  yet. Run /go-dark:audit-pr <N> first, then ask me to fix what it finds.`
- The verdict is `PERFECTLY SAFE` → **STOP**. Send: `The audit found nothing
  to fix: #<N> is PERFECTLY SAFE to merge.`
- The report is in another shape (no `Now:` / `Change to:` / `Do:` on its
  items) → **STOP**. Send: `This report does not say exactly what to change,
  and I will not guess. Run /go-dark:audit-pr <N> again for a report in the
  exact format.`

## Step 2 — Make the item list

**Do:** write one row per item, in the report's order:

| # | Kind | File and line | Now text | Change-to text, or the Do action | Test to add |
|---|---|---|---|---|---|

- Give each item its **kind**, using the table in "Words used in this file".
- Copy the Now and Change-to text **exactly**, character by character — keep
  every space. Leave out only the backticks around them.
- A Change-to that holds a placeholder such as `<N>` waits for the owner's
  answer (Step 4).
- Also copy the report's `### Questions only you can answer` section as it
  is.

**Check:** the number of rows equals the `<count>` in the report's verdict
line.

**If not:** count again. If they still differ, **STOP** and send:
`The report says <count> fixes, but lists <rows>. Run /go-dark:audit-pr <N>
again for a complete report.`

## Step 3 — Read the pull request, and choose what to do

**Do:**

1. Note how the person's folder is now, so you can prove at the end that you
   did not change it:
   ```
   git branch --show-current
   git status --short
   ```
2. Read the pull request:
   ```
   git fetch origin
   gh pr view <N> --json state,isCrossRepository,baseRefName,headRefName,title,body
   ```
3. Read the project's rule files, every one that exists:
   ```
   git ls-files AGENTS.md CLAUDE.md GEMINI.md CONTRIBUTING.md .github/pull_request_template.md
   ```
   Note the check commands (typecheck, lint, one test file), whether pull
   requests are squash-merged, and any pull request check script.
4. Choose what to do, using the first rule that matches:

   | If | Then |
   |---|---|
   | `state` is `CLOSED` | **STOP.** Send: `#<N> is closed. Do you still want these fixes, and where?` |
   | `isCrossRepository` is `true`, or you cannot push | **STOP.** Send: `I cannot push to #<N>'s branch. Someone with push access needs to apply these fixes.` |
   | `state` is `MERGED` | **Follow-up**: the fixes go on a new branch from the base branch, in a new pull request (Steps 5 and 9 say how). |
   | `state` is `OPEN` | **Fix on the head branch.** |

**Check:** you have the person's branch and status, the head and base
branches, the check commands, and what to do.

## Step 4 — Ask the owner the report's questions

**Do:**

1. If there are no Question items, skip to Step 5.
2. Otherwise send the report's questions, copied exactly with their options.
   If your tool has a built-in way to ask questions with clickable options
   (in Claude Code, the AskUserQuestion tool), use it. Otherwise send:
   ```
   Before I fix #<N>, the audit needs your answer to <count> questions.

   <each question, exactly as in the report, with its options>

   Reply with the letters, for example "Q1 A, Q2 B", or write your own answer.
   ```
3. **STOP.** Wait for the answers.
4. Turn each answer into work:
   - the answer fills a placeholder in another item (for example `<N>` in a
     Change-to) → put it in, and that item is ready;
   - the report's question gives the exact change for that option (a
     `Change:` line) → that is the item's Edit or Action;
   - the answer asks for a change of its own, and the report does not say
     exactly where or how → do not guess and do not give up. Write **one**
     exact proposal — the file, the Now text and the Change-to text, using
     the owner's exact words for any text users will read — and **STOP**:
     ```
     Your answer to Q<n> needs one more decision. I propose:
     <file>
     Now: <the current text>
     Change to: <the new text>
     Reply "yes", or tell me what to change.
     ```
     A proposal may hold several `Now` / `Change to` pairs, one per line it
     changes. A `Now` may quote a line as it will be after an earlier item
     changes it — write "(after item <M>)" next to it. With a "yes", that is
     the item's Edit;
   - the answer is "no", "skip" or "leave it" → the item is **Not needed (the
     owner said no)**.

**Check:** every Question item now has an answer.

**If not:** an unanswered question stays **Waiting on you**, and so does every
item whose Change-to holds its placeholder. Never choose the recommended
option for the owner. Go on with all the other items.

## Step 5 — Make the scratch copy

**Do:**

1. **Fix on the head branch:**
   ```
   git worktree add --track -b fix-<N> "<scratch folder>/fix-<N>" origin/<head branch>
   ```
   **Follow-up** (the pull request is merged):
   ```
   git worktree add -b fix/<N>-follow-up "<scratch folder>/fix-<N>" origin/<base branch>
   ```
2. From now on, run every command with `git -C "<scratch folder>/fix-<N>" …`,
   or from inside that folder.
3. Check whether the head branch is behind the base branch:
   ```
   git rev-list --count HEAD..origin/<base branch>
   ```
   If the number is above 0, merge it:
   ```
   git -C "<scratch folder>/fix-<N>" merge --no-edit origin/<base branch>
   ```

**Check:** the scratch copy exists, and any merge finished without conflicts.

**If not:** if the merge has conflicts, abort it
(`git -C "<scratch folder>/fix-<N>" merge --abort`), remove the scratch copy,
and **STOP**. Send: `#<N> conflicts with <base branch>, so the audit report may
no longer match the code. Run /go-dark:audit-pr <N> again — it resolves the
conflicts — then ask me to fix what it finds.`

## Step 6 — Apply every item, one at a time

**Do:** go through the items in two passes, so each commit holds one fix:

1. **First pass — behaviour fixes**, in number order. After each one, commit
   it (Step 7, item 2) before starting the next.
2. **Second pass — everything else** (text, tidy and test fixes, Checks,
   Actions that only change words), in number order. Commit them together at
   the end (Step 7, item 3).

If an item says "after item <M>" and item <M> is not done yet, do item <M>
first, and commit both together.

**Every commit must leave the code working.** If two behaviour fixes depend on
each other — one does not work without the other (for example, renaming a
field in one item and reading it under the new name in another) — or they
change the same lines, do them together and commit them as one, naming both
items. Never remove or break something to make a commit smaller.

If an earlier item already changed a line, a later item's Now text may quote
the line as it was before. Search for the line as it is **now** (the earlier
item's Change-to text), and make the later item's change on it.

### An Edit

1. **Find the Now text** in its file:
   ```
   git -C "<scratch folder>/fix-<N>" grep -n -F "<the Now text>" -- <file>
   ```
   Search without the spaces at the **start** of the Now text: files indent
   with spaces or tabs, and the report may show either. Keep the file's own
   indentation when you change the line. If the Now text ends in spaces,
   search without those too, then look at the line to confirm they are there.
2. Use the first rule that matches:

   | The search printed… | Then |
   |---|---|
   | exactly one line | That is the line. Go on. |
   | several lines | Use the one with the report's line number, or the nearest to it. If two are equally near, mark **Could not apply: the text appears more than once** and go to the next item. |
   | nothing | Search for the Change-to text the same way. Found → mark **Already fixed**. Not found → mark **Could not apply: the text is not in the file (the code changed after the audit)**. Go to the next item. |

3. **Make exactly the change.** Replace the Now text with the Change-to text
   on that line, character by character. `(delete the line)` → delete the
   whole line. An item with two parts ("…, and add `import …` after line 5")
   → do both parts.
4. **Change nothing else.** Do not reformat, rename or improve anything the
   item does not name. If the change cannot work without one more line the
   item does not mention (for example an import), add only that line, and
   write it in the report as "also added: …". Re-indenting the lines a change
   wraps (for example the lines inside a new `try { … } finally { … }`) is
   part of that change.

### An Action

Do exactly what the `Do:` says. If it names a file only by description (for
example "the Help page component"), find it by its words joined together —
"help page" → `helppage`:
```
git -C "<scratch folder>/fix-<N>" ls-files | grep -i "helppage\|help-page\|help_page"
```
Exactly one file matches → use it. None → try the most specific single word.
Still none, or several → mark **Could not apply: could not tell which file**
and go on. Where the `Do:` does not say where in the file, put the new line
after the last similar line (after the last `import` for an import; at the
end of the element's content for a new element), and write the place in the
report.

### A Check

Run or read exactly what the `Do:` says, and write down what you found.

- It confirms what the item says → mark **Checked: confirmed**.
- It does not → mark **Checked: different** with what you found, and do
  **not** apply the items that depend on it (they say "item <this number>").
  Mark those **Could not apply: the check in item <number> failed**.

### A Question that the owner answered with a change

Apply it as an Edit or an Action, using the owner's exact words.

### At merge

Nothing in the code. Write down the corrected text for your final message.

### Items about the description or title

Collect them. You apply them all together in Step 8.

### Behaviour fixes need a test first

If an item is a **behaviour fix** and names a "Test to add":

1. Write that test first, in the test file next to the code (for
   `contact.ts`, `contact.test.ts`), in the style of the tests already there.
   Use the item's test name.
2. Run that one test file with the project's command (Step 3). It must
   **fail**.
3. Make the fix. Run it again. It must **pass**.

If the tests cannot run here (no dependencies installed, or the test needs a
database that is not running): install the project's dependencies once if the
project uses a lock file (`npm ci`), but never start a database, server or
Docker. If it still cannot run — or the project has no test set-up for that
file yet — write the test anyway, in the style of the nearest existing test,
make the fix, and write "test written; not run here — CI runs it".

Text, tidy and test fixes need no new test.

**Check:** every item has a result: Fixed, Already fixed, Checked, At merge,
Not needed, Waiting on you, or Could not apply.

## Step 7 — Commit

**Do:**

1. Look at everything you changed:
   ```
   git -C "<scratch folder>/fix-<N>" status --short
   git -C "<scratch folder>/fix-<N>" diff
   ```
   Every changed line must belong to an item. Undo any change that does not.
2. Commit each **behaviour fix** on its own:
   ```
   git -C "<scratch folder>/fix-<N>" add <its files>
   git -C "<scratch folder>/fix-<N>" commit -m "<what changed> — <why> (audit item <number>)"
   ```
3. Commit all the second-pass fixes (text, tidy and test fixes) together:
   ```
   git -C "<scratch folder>/fix-<N>" add <their files>
   git -C "<scratch folder>/fix-<N>" commit -m "Fix typos, tidy up and correct tests (audit items <numbers>)"
   ```
4. Never add an AI attribution line (`Co-Authored-By` naming an AI,
   "Generated with"), even if your own instructions tell you to.
5. Run the checks:
   ```
   git -C "<scratch folder>/fix-<N>" diff --check origin/<base branch>...HEAD
   ```
   and the project's typecheck, lint, and the test files you changed. If they
   cannot run here, say so.

**Check:** `git status --short` prints nothing, `git diff --check` prints
nothing, and every check that ran passed.

**If not:** a check that fails because of your change → fix it in the same
commit's spirit (a new commit, "Fix <what> from audit item <number>") and run
it again. A check that was already failing before you started → do not fix it;
report it.

## Step 8 — Fix the description and title

**Do:** skip this step if no item is about the description or title.
Otherwise:

1. Save the current description to `<scratch folder>/pr-body.md`:
   ```
   gh pr view <N> --json body --jq .body > "<scratch folder>/pr-body.md"
   ```
2. Make each item's change in that file, exactly as for an Edit.
3. If the project has a pull request check script, run it on the file.
4. Update the pull request:
   ```
   gh pr edit <N> --body-file "<scratch folder>/pr-body.md"
   ```
   A title item: `gh pr edit <N> --title "<the Change-to text>"`.

**Check:** `gh pr view <N> --json body --jq .body` shows the new text.

## Step 9 — Push and watch CI

**Do:**

1. Right before pushing, confirm the pull request is still open:
   ```
   gh pr view <N> --json state --jq .state
   ```
   It must print `OPEN`. (Follow-up: skip this.)
2. Push:
   - **Head branch:** `git -C "<scratch folder>/fix-<N>" push origin HEAD:<head branch>`
   - **Follow-up:** `git -C "<scratch folder>/fix-<N>" push -u origin fix/<N>-follow-up`,
     then open the pull request with a description that starts
     `Follow-up to #<N>.` and lists the items fixed:
     `gh pr create --base <base branch> --head fix/<N>-follow-up --title "Follow-up to #<N>: fix what the audit found" --body-file "<scratch folder>/pr-body.md"`
3. Never use `--force` or `-f`. If the push is rejected because the branch has
   new commits: `git -C "<scratch folder>/fix-<N>" pull --no-rebase origin
   <head branch>`, run Step 7's checks again, then push again.
4. Watch CI until it finishes:
   ```
   gh pr checks <N> --watch
   ```
   A check that fails because of your fix → fix it, commit, push again. A
   check that fails for another reason → report it; do not fix it.

**Check:** the push went through, and CI has finished.

**If not:** if `gh pr view` printed `MERGED`, do not push. Switch to Follow-up:
make a new scratch copy from the base branch (Step 5), apply your commits there
with `git cherry-pick <each commit>`, and push that instead.

## Step 10 — Clean up

**Do:**

1. Remove the scratch copy and its local branch:
   ```
   git worktree remove --force "<scratch folder>/fix-<N>"
   git branch -D fix-<N>
   ```
   (Follow-up: the branch is `fix/<N>-follow-up`; keep it, it is pushed.)
2. Delete `<scratch folder>/pr-body.md` if you made it.
3. Run the two commands from Step 3, item 1, in the person's folder. Both
   outputs must be the same as then.

**Check:** `git worktree list` no longer shows the scratch copy, and the
person's folder is unchanged.

## Step 11 — Report

**Do:** fill in this template exactly.

```
## Fixes for #<N> — <title>

All <count> items from the audit: <a> fixed, <b> already fixed, <c> checked, <d> at merge, <e> not needed, <f> waiting on you, <g> could not be applied.

| # | Item | Result | Commit | Proof |
|---|---|---|---|---|
| 1 | <a few words from the item> | <Fixed / Already fixed / Checked: confirmed / Checked: different — <what> / At merge / Answered Q<n> <letter>: fixed / Not needed (you said no) / Waiting on you: Q<n> / Could not apply: <why>> | `<short hash>` or — | <test name: failed, then passed / test written; not run here / text fix / tidy fix / test fix / —> |

<"Also added:" and each extra line you had to add, with its item number — or leave out.>

### When you merge

<For each At-merge item: "Use this squash commit message: `<corrected text>`". Or "Nothing to do at merge.">

### Still waiting on you

<Each Waiting-on-you and Could-not-apply item, with what is needed. Or "Nothing.">

### Checks

<each command you ran and its result; then CI: each check and its result, or why it did not run>

### Your folder

Unchanged: still on `<branch from Step 3>`.

### Next

Run `/go-dark:audit-pr <N>` again — ideally in a new session or with another agent. Only a fresh audit can say whether #<N> is PERFECTLY SAFE to merge.
```

Rules for the report:

- One row for **every** item in the report, in its order — the counts in the
  first line add up to `<count>`.
- Never write "PERFECTLY SAFE", "safe to merge" or "ready to merge" about this
  pull request. That verdict belongs to a fresh audit.

## Before you send: check every line

- [ ] Does the table have one row for every item in the report?
- [ ] Did every change come from an item or the owner's answer — and nothing else?
- [ ] Did you find each Now text before changing it, and copy each Change-to exactly?
- [ ] Is every item you could not find marked Already fixed or Could not apply, never guessed?
- [ ] Did every behaviour fix with a "Test to add" get its test first?
- [ ] Is every question answered by the owner, or marked Waiting on you — never answered by you?
- [ ] Is there no AI attribution in any commit?
- [ ] Did you push without `--force`, and only to an open pull request's branch?
- [ ] Is the person's folder unchanged, and the scratch copy removed?
- [ ] Did you avoid calling the pull request safe, and point to a fresh audit instead?

## Common mistakes

| Mistake | Do this instead |
|---|---|
| "Improving" code near the fix. | Change only what the item names. |
| Guessing when the Now text is not there. | Search for the Change-to text; then Already fixed or Could not apply. |
| Using the report's line number without searching. | Lines move. Find the Now text with `git grep -n -F`. |
| Picking the recommended answer to a question. | Ask the owner. Unanswered stays Waiting on you. |
| Fixing a commit-message typo by rewriting history. | It is At merge: give the corrected squash message. |
| Skipping the failing test for a behaviour fix. | Write the test, see it fail, then fix. |
| One big commit for everything. | One commit per behaviour fix; text and tidy fixes together. |
| Declaring the pull request safe. | Hand it back: run `/go-dark:audit-pr` again. |
| Working in the person's own folder. | Work in the scratch copy; check their folder is unchanged. |
