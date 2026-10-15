---
name: fix
description: Use when given findings to fix — problems reported by a developer or tester, review comments on a pull request, a bug list or issue, or results from another skill or tool — and asked to fix them. For a report from /go-dark:audit-pr, use /go-dark:fix-audit instead.
---

# Fix findings

## What this skill is for

A **finding** is someone saying something is wrong: "the form never works",
"there's a typo in the thank-you message", a review comment, a line in a bug
list, a result from a tool. Findings are often vague, and sometimes wrong.

This skill turns each finding into a checked, exact fix, and makes it:

1. **Confirm before changing.** Every finding is checked against the code.
   A finding that turns out to be wrong is reported as "Not a problem" with
   the evidence — never "fixed" anyway.
2. **Fix the cause, not the symptom.** A bug is traced back to the line where
   things first go wrong, and proved with a failing test.
3. **Fix only what was found.** Anything else you notice is listed, not
   changed. Anything that needs a decision goes to the owner.

If what you were given is a report from `/go-dark:audit-pr` (it starts with
`## Audit of #`), do not use this skill: use `/go-dark:fix-audit`, which
applies such reports exactly.

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
4. Never invent a fact or a fix. Every change must come from a confirmed
   finding, or from the owner's answer to a question.
5. When you cannot check something — a command fails, a file is missing — do
   not guess. Give that finding the verdict **Cannot check**, with why, and go
   on.
6. The project's own rules win. If a project file says something different
   from this file, do what the project says, and say so in the report.
7. **Never change the person's own folder**, except in the one case Step 3
   allows. Never merge, approve, close or force-push. Only the owner merges.

## Words used in this file

| Word | Meaning |
|---|---|
| **finding** | One thing someone says is wrong. "There's a typo, and two spaces too" is one finding with two parts. |
| **owner** | The person who decides and merges — usually the person who asked you. |
| **the specification** | What the work is meant to do, in this order: the issue, its plan, decision records, the project's rule files (`AGENTS.md`, `CLAUDE.md`). Not the code, and not the pull request description. |
| **evidence** | Something anyone can check: a file and line with its exact text, a command and its output, or a test that fails. |
| **the person's folder** | Their own checkout of the repository — the folder you were started in. |
| **scratch copy** | A separate checkout (a git worktree) in the scratch folder. All changes happen there. |
| **scratch folder** | A folder outside the repository for temporary files. Use the one your tool gives you (a scratchpad or temp folder). If it gives none: `/tmp/going-dark` on macOS and Linux, `%TEMP%\going-dark` on Windows. |
| **behaviour fix** | A change to what runs: source code, SQL, migrations, config, scripts, CI — including markup attributes such as `role` or `disabled`. |
| **text fix** | A change only to words people read: docs, comments, copy, test names — and the words inside a string, when nothing else on the line changes. |
| **tidy fix** | Removing something that should not be there, or whitespace: an unused import, a leftover log line (even one that logs personal data), commented-out code, trailing spaces. |
| **test fix** | A change only to test files: a test's input, name or expected value. |
| **small** | All of these are true: under about 50 changed lines; no new dependency; no new table, column or migration; no new scheduled job, service, environment variable or setting; no new text users read that the owner has not given; no product decision. |

## Step 1 — Collect the findings

**Do:** gather every finding, from wherever it was given:

| Where | How to read it |
|---|---|
| In the conversation | Use it as written. |
| A file | Read the file. |
| Comments on a pull request | The two commands below. |
| An issue | `gh issue view <number> --comments` |

For a pull request, read both its comments and the comments on lines of
code:
```
gh pr view <N> --comments
gh api repos/<owner>/<repo>/pulls/<N>/comments --jq '.[] | "\(.path):\(.line) \(.user.login): \(.body)"'
```

**Check:** you have the findings.

**If not:**
- Nothing to fix was given → **STOP**. Send: `What should I fix? Paste the
  findings, or tell me where they are.`
- It is a report from `/go-dark:audit-pr` (it starts with `## Audit of #`) →
  stop using this skill, and follow `/go-dark:fix-audit` instead.

## Step 2 — Number the findings

**Do:** write one row per finding, in the order they were given:

| # | Who | Their exact words | What it says is wrong, in one line |
|---|---|---|---|

- Copy their words **exactly** — this is what you will be judged against.
- One row per thing that is wrong. A sentence that names two different
  problems ("the form fails, and the docs are wrong") is two rows. Two parts
  of one problem ("a typo, and two spaces too", in the same message) is one
  row.
- A finding that only asks something ("which one is right?") still gets a
  row: the question means something may be inconsistent.

**Check:** every finding has a row, and no row mixes two problems.

## Step 3 — Decide where to fix

**Do:**

1. Note how the person's folder is now, so you can prove at the end what you
   changed:
   ```
   git branch --show-current
   git status --short
   ```
2. Get the latest state: `git fetch origin`.
3. Choose where the fixes go, using the first rule that matches:

   | If the findings are about… | Then |
   |---|---|
   | an **open** pull request | Fix on its head branch: `gh pr view <N> --json state,isCrossRepository,headRefName,baseRefName`. If `isCrossRepository` is `true`, or you cannot push → **STOP**: `I cannot push to #<N>'s branch. Someone with push access needs to make these fixes.` |
   | a **merged** pull request | A new branch from the base branch, and a new pull request (**follow-up**). |
   | a **closed** pull request | **STOP**: `#<N> is closed. Where should these fixes go?` |
   | the person's own **uncommitted** work, and they asked you to fix it there | Edit the files **in their folder**, and never commit. This is the only time you change their folder. Skip Steps 4, 9 and 10. |
   | anything else (the project as it is on the default branch) | A new branch from the default branch, named `fix/<two-to-four-words>`, and a new pull request. |

4. Read the project's rule files, every one that exists:
   ```
   git ls-files AGENTS.md CLAUDE.md GEMINI.md CONTRIBUTING.md .github/pull_request_template.md
   ```
   Note the check commands (typecheck, lint, one test file), style rules, and
   whether pull requests are squash-merged.
5. Find **the specification**: for a pull request, the issue it names
   (`Closes #<n>` or `Part of #<n>`) — `gh issue view <n>` — and the plan that
   issue names. Write down every number, limit and piece of exact text it
   gives.

**Check:** you know where the fixes go, the check commands, and the
specification (or that there is none).

## Step 4 — Make the scratch copy

**Do:**

1. Make it, using the first case that matches:
   - **Open pull request:**
     ```
     git worktree add --track -b fix-work "<scratch folder>/fix-work" origin/<head branch>
     ```
   - **Follow-up, or a new branch:**
     ```
     git worktree add -b <new branch> "<scratch folder>/fix-work" origin/<base or default branch>
     ```
     For a follow-up the new branch is `fix/<N>-follow-up`.
2. From now on, run every command with `git -C "<scratch folder>/fix-work" …`,
   or from inside that folder.
3. Open pull request only: if `git rev-list --count HEAD..origin/<base
   branch>` is above 0, merge the base branch:
   `git -C "<scratch folder>/fix-work" merge --no-edit origin/<base branch>`.

**Check:** the scratch copy exists, and any merge finished without conflicts.

**If not:** if the merge has conflicts, abort it (`merge --abort`), remove the
scratch copy, and **STOP**: `#<N> conflicts with <base branch>. Resolve that
first, or ask me to audit it with /go-dark:audit-pr, which resolves
conflicts.`

## Step 5 — Investigate every finding

**Do:** for each row, in order, give it **one kind** and investigate it the
way its kind says. Write down every piece of evidence as you go.

| If the finding… | Kind |
|---|---|
| is about words: a typo, wording, copy, docs, a message | **Text** |
| says something does not work, errors, shows the wrong thing, or behaves wrongly | **Bug** |
| says a rule is broken: security, privacy, a project rule, accessibility | **Rule** |
| asks which of two things is right, or points out that two things disagree | **Which is right** |
| gives no place and no way to check it ("feels slow", "looks off") | **Vague** |

### Text

1. Search for the words it points at:
   ```
   git -C "<scratch folder>/fix-work" grep -n -i "<a word or phrase from the finding>"
   ```
2. Read each line found, word by word. If the specification gives the exact
   text, compare character by character, space by space.
3. Verdict: the mistake is there → **Confirmed**, with the file, line and
   exact text. It is not → **Not a problem**, with the line showing it is
   already right.

### Bug

Follow the trail from where the finding says it shows, to where it goes
wrong:

1. **Start where the finding points.** Search for the screen, message,
   button, route or function it names:
   ```
   git -C "<scratch folder>/fix-work" grep -n "<a word the finding uses>"
   ```
2. **Follow the data, one step at a time.** Read the code that runs at that
   point. Write each step as a line: `<file>:<line> — <what it does, and the
   names, values and limits it uses>`. When it calls another function or
   sends a request, find where that is handled (`git grep -n "<the name or
   path>"`), and keep going.
3. **Find every disagreement on the trail.** A cause is a place where one
   step does not fit the next: a path or name spelled differently on two
   sides, a limit that differs, a value that is never checked, a result that
   is ignored. Keep following the trail after the first one: a finding can
   have more than one cause, and each is part of its fix.
4. **Prove it.** Write a test that shows the finding happening, in the test
   file next to the code with the cause (for `contact.ts`, `contact.test.ts`),
   in the style of the tests already there. Run that test file. It must
   **fail**. If tests cannot run here (no dependencies installed — install
   them once with the project's own command, such as `npm ci`; or a database
   that is not running — never start one), the two lines that disagree are
   the evidence, and the test is written anyway.
5. **Look for the same mistake nearby.** Search for the wrong text you found
   (`git grep -n "<the wrong name or value>"`). Every hit in the same feature
   is part of this finding's fix.
6. Verdict: you found a disagreement → **Confirmed**, with the trail and the
   proof. The trail shows the code is right → **Not a problem**, with the
   trail. You could not follow it (a file you cannot read) → **Cannot
   check**.

### Rule

1. Find the rule: in the project's rule files, the specification, or plainly
   (personal data in logs, a missing label).
2. Find the line that breaks it, by searching for what the finding names.
3. Verdict: the line breaks the rule → **Confirmed**, quoting both the rule
   and the line. It does not → **Not a problem**, quoting the line that shows
   it is fine.

### Which is right

1. Find every place that says something about it (code, tests, docs):
   ```
   git -C "<scratch folder>/fix-work" grep -n "<the value or name>"
   ```
2. Look it up in **the specification**.
3. Verdict:
   - the specification answers it → **Confirmed**: everything that disagrees
     with the specification is wrong. The fix makes every place match it.
   - it does not → **Needs the owner**: a question with the options found.

### Vague

**Needs the owner**: a question asking what exactly, and where — with
"ignore it" as an option.

### Things nobody mentioned

While investigating, you will notice other problems. **Do not fix them.**
Write each one under "Also noticed (not changed)", with its file and line.

**Check:** every finding has a kind, evidence, and one verdict: Confirmed,
Not a problem, Needs the owner, or Cannot check. A finding can be partly
Confirmed and partly Needs the owner — for example one cause certain, another
depending on something you cannot see: write both parts.

## Step 6 — Plan the exact fixes, and ask what needs the owner

**Do:**

1. For each **Confirmed** finding, write its exact changes:
   ```
   <#>. <file>
      Now: <the exact current line>
      Change to: <the exact new line>     (or "delete the line")
      Test to add: <name> — fails now, passes after      (bugs only)
   ```
   Fix the cause from Step 5, plus every hit of the same mistake in the same
   feature. Change nothing else.
2. Decide for each fix whether it is **small** (see "Words used in this
   file"). A fix also **needs the owner** when any of these is true:
   - it is **not small**;
   - it needs text users will read that nobody has given;
   - it needs a value nobody has given (a limit, a size);
   - there is more than one reasonable way to fix it.
3. If any finding **needs the owner**, ask. If your tool has a built-in way
   to ask questions with clickable options (in Claude Code, the
   AskUserQuestion tool), use it. Otherwise send:
   ```
   I checked all <count> findings. Before I fix them I need <count> answers.

   Q1. <finding <#>: the question, one sentence, ending with "?">
     A. <option> (recommended) — <what it means>
        Change: <file> — Now: <current text> → Change to: <new text>
     B. <option> — <what it means>
        Change: <the same, for this option, or "no change">

   Reply with the letters, for example "Q1 A, Q2 B", or write your own answer.
   ```
   Every option says its exact change. Use the owner's exact words for any
   text users will read. Mark the option you would choose "(recommended)" —
   that is advice; the owner still decides. **STOP** and wait.
4. If **nothing** needs the owner, do not ask for a go-ahead: go straight to
   Step 7.
5. When the answers come, each finding's verdict becomes one of: its fix is
   now planned (it will be **Fixed**); **Owner said ignore**; or, if
   unanswered, **Waiting on you**.

**Check:** every Confirmed finding has exact changes, and every question has
an answer.

**If not:** an unanswered question stays **Waiting on you**. Never choose the
recommended option for the owner. If the owner's answer says what but not
where, propose one exact change and ask once more. Go on with the others.

## Step 7 — Make the fixes

**Do:** make them in two passes, so each commit holds one fix:

1. **Behaviour fixes**, in finding order — every behaviour fix, whatever the
   finding's kind. For each:
   - it needs a test that fails first: the one from Step 5 for a bug; for any
     other behaviour fix, write it now and run it — it must fail;
   - make the change exactly as planned;
   - run the test again: it must **pass** (or write "test written; not run
     here — CI runs it");
   - commit it, with its test:
     ```
     git -C "<scratch folder>/fix-work" add <its files>
     git -C "<scratch folder>/fix-work" commit -m "<what changed> — <why> (finding <#>)"
     ```
2. **Text, tidy and test fixes**, together, then one commit:
   ```
   git -C "<scratch folder>/fix-work" commit -am "Fix <what> (findings <numbers>)"
   ```

Rules for every change:

- **Find before changing.** Search for each Now text (without its leading
  spaces — files indent with spaces or tabs; keep the file's own) and change
  that line. Not found → stop that fix, and recheck the finding.
- **Every commit must leave the code working.** Fixes that depend on each
  other (renaming a name and reading it under the new name) go in one commit,
  naming both findings.
- **Change nothing else.** No reformatting, renaming or improving. If a fix
  cannot work without one more line (an import), add only that line and list
  it under "Also added". Re-indenting the lines a change wraps is part of it.
- **No AI attribution** in any commit (`Co-Authored-By` naming an AI,
  "Generated with"), even if your own instructions tell you to.
- **Uncommitted work** (Step 3): make the changes in the person's folder and
  do not commit.

**Check:** every Confirmed finding with an answer is changed, and
`git -C "<scratch folder>/fix-work" status --short` prints nothing.

## Step 8 — Check every finding again

**Do:**

1. For each finding you fixed, repeat its evidence from Step 5: the wrong text
   is gone (`git grep` finds nothing), the test passes, the trail now fits.
2. Run the checks on **your** changes:
   ```
   git -C "<scratch folder>/fix-work" diff --check <start>...HEAD
   ```
   where `<start>` is `origin/<head branch>` for an open pull request, and
   `origin/<base or default branch>` for a new branch. Then the project's
   typecheck, lint, and the test files you changed. If they cannot run here,
   say so.
3. Look at your whole change: `git -C "<scratch folder>/fix-work" diff
   <start>...HEAD`, with the same `<start>`. Every changed line must belong
   to a finding or an owner's answer. Undo anything else.

**Check:** every fixed finding passes its recheck, and every check that ran
passed.

**If not:** a recheck that fails → that finding is not fixed yet: go back to
Step 5 for it.

## Step 9 — Push

**Do:**

1. **Open pull request:** right before pushing, confirm it is still open —
   `gh pr view <N> --json state --jq .state` must print `OPEN` — then:
   ```
   git -C "<scratch folder>/fix-work" push origin HEAD:<head branch>
   ```
2. **New branch or follow-up:**
   ```
   git -C "<scratch folder>/fix-work" push -u origin <new branch>
   gh pr create --base <base or default branch> --head <new branch> --title "<what it fixes>" --body-file "<scratch folder>/pr-body.md"
   ```
   Write the description in the project's pull request template, listing each
   finding and its fix. For a follow-up, start it with `Follow-up to #<N>.`
3. Never use `--force` or `-f`. If the push is rejected because the branch has
   new commits: `git -C "<scratch folder>/fix-work" pull --no-rebase origin
   <branch>`, run Step 8 again, then push again.
4. Watch CI: `gh pr checks <N> --watch`. A check that fails because of your
   fix → fix it and push again. One that fails for another reason → report
   it.

Push the confirmed fixes even while some questions are still waiting on the
owner; the report lists what is waiting.

**Check:** the push went through, and CI has finished.

## Step 10 — Clean up

**Do:**

1. Remove the scratch copy:
   ```
   git worktree remove --force "<scratch folder>/fix-work"
   git branch -D fix-work
   ```
   (A new branch or follow-up branch is pushed: keep it.)
2. Delete `<scratch folder>/pr-body.md` if you made it.
3. Run the two commands from Step 3, item 1, in the person's folder. Both
   outputs must be the same as then.

**Check:** the scratch copy is gone, and the person's folder is unchanged.

## Step 11 — Report

**Do:** fill in this template exactly.

```
## Fixes for <#N, or the branch, or "your uncommitted work">

<count> findings: <a> fixed, <b> partly fixed, <c> not a problem, <d> owner said ignore, <e> waiting on you, <f> could not check.

| # | Finding (their words, shortened) | Verdict | What I changed | Commit | Proof |
|---|---|---|---|---|---|
| 1 | "<…>" | <Fixed / Partly fixed — waiting on you: Q<n> / Not a problem / Owner said ignore / Waiting on you: Q<n> / Cannot check: <why>> | <file:line — what changed, or —> | `<short hash>` or — | <test: failed, then passed / test written; not run here / the line now reads "…" / —> |

### Causes

<For each bug: the trail in one or two lines — "The form sends `message`; the route expects `messsage` (backend/src/routes/contact.ts:12), so every request failed validation.">

### Not a problem

<For each: the evidence that it is already right — "The name field has a label: frontend/src/features/help/ContactForm.tsx:22 `<label htmlFor="c-name">Your name</label>`." Or "None.">

### Also noticed (not changed)

<Each problem no finding mentioned, with file and line. Or "Nothing.">

### Also added

<Each extra line a fix needed, with its finding. Or leave out.>

### Checks

<each command and its result; CI>

### Your folder

<"Unchanged: still on `<branch>`." — or, for uncommitted work: "Changed as asked; nothing committed.">

### Next

<For a pull request: "Run `/go-dark:audit-pr <N>` before merging — a fresh audit checks the whole change, not only these findings.">
```

Rules for the report:

- One row for **every** finding from Step 2, in order. The counts add up.
- Never say a finding is fixed without its proof.
- Every line of code you quote — in Proof, Causes or Not a problem — is
  copied from the file as it is now, not typed from memory.
- Never call the pull request safe to merge. That is the audit's job.

## Before you send: check every line

- [ ] Does every finding have a row, quoted in the reporter's words?
- [ ] Was every finding checked against the code before anything changed?
- [ ] Does every bug name its cause, with the trail?
- [ ] Is every "Not a problem" backed by evidence?
- [ ] Did the specification decide every "which is right" finding — or the owner?
- [ ] Did every behaviour fix get a test that failed first (or "not run here")?
- [ ] Does every changed line belong to a finding or an owner's answer?
- [ ] Is everything else you noticed listed, not changed?
- [ ] Was every question answered by the owner — never by you?
- [ ] Is there no AI attribution in any commit, and no force-push?
- [ ] Is the person's folder unchanged (unless they asked you to fix their uncommitted work)?

## Common mistakes

| Mistake | Do this instead |
|---|---|
| Fixing what the finding says without checking it. | Investigate first. A wrong finding is "Not a problem", with evidence. |
| Fixing the symptom ("show a nicer error"). | Follow the trail to the first disagreement, and fix that. |
| Fixing one copy of a mistake. | Search for the same wrong text, and fix every copy in the feature. |
| Deciding "which is right" yourself. | The specification decides; if it does not, the owner does. |
| Guessing what a vague finding means. | Ask what exactly, and where — with "ignore it" as an option. |
| Fixing other problems you noticed. | List them under "Also noticed". |
| Writing new user-facing text yourself. | It comes from the specification or the owner. |
| One big commit. | One commit per behaviour fix; text and tidy fixes together. |
| Working in the person's folder. | The scratch copy — unless they asked you to fix their uncommitted work. |
| Calling the pull request safe. | Point to `/go-dark:audit-pr`. |
