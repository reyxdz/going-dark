---
name: write-handoff
description: Use when asked for a handoff prompt, a brief for another agent or contributor to carry out an issue, or instructions that "even the least capable agent" must be able to follow without mistakes.
---

# Write a handoff prompt

## What this skill is for

A **handoff** is a document that lets someone with no memory of your
conversation — the **builder** — carry out an issue exactly as decided. It is
written for the least capable reader:

- every fact is checked against the code;
- every decision is final and written down;
- every step has an action and a check;
- every point of doubt says "stop and ask" instead of "use your judgement".

If you cannot reach that standard yet, you write a **blocked draft** instead,
clearly marked so nobody builds from it.

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
4. Never invent a fact. Every file path, function name, command, number and
   decision in the handoff must come from the issue, the owner, or the code
   you read during this task.
5. When you cannot check something — no access to the code, a command fails,
   the owner has not answered — do not guess. Put a marker in the handoff
   (see "Markers" below) and go on. Any marker makes the handoff a blocked
   draft.
6. The project's own rules win. If a file you read in Step 1 says something
   different from this file, do what the project says, and tell the owner:
   `The project's rule "<quote>" replaced this skill's rule "<quote>".`
7. You write the handoff. You do **not** build the issue, commit, push or
   open pull requests.

## Words used in this file

| Word | Meaning |
|---|---|
| **owner** | The person who decides what is built and merges pull requests. Step 1 shows how to find them. |
| **builder** | The agent or person who will follow the handoff. Assume they know nothing about this project and will do exactly what the words say. |
| **issue** | The GitHub issue the handoff is for. `<N>` means its number. |
| **default branch** | The branch pull requests go into, usually `main`. Step 1 finds it. |
| **ground truth** | Facts read from the code itself: file paths, function names, defaults, commands, test patterns. Never from memory. |
| **verbatim part** | Anything the builder must paste or type exactly: code, SQL, config, a header row, a file name, a message users read, a pull request description. |
| **personal instruction files** | A person's own AI instruction or memory files that are not part of the project (for example a private `CLAUDE.md` in their home folder). They must never be committed. |
| **pull request check** | A script or CI job that checks pull request descriptions, if the project has one. Step 1 finds it. |
| **scratch folder** | A folder outside the repository for temporary files. Use the one your tool gives you (a scratchpad or temp folder). If it gives none: `/tmp/going-dark` on macOS and Linux, `%TEMP%\going-dark` on Windows. |
| **today** | Today's date as `YYYY-MM-DD`. |

### Markers

| Marker | Put it where | Example |
|---|---|---|
| `[VERIFY: <what to check, and where>]` | A fact you could not read in the code | `[VERIFY: the admin-only middleware's name — search "admin" in backend/src/middleware]` |
| `[OPEN Q<n>]` | A decision the owner has not answered. `<n>` is the question's number in your message to the owner | `Rows over the limit: [OPEN Q1]` |
| `[UNPROVEN]` | A verbatim part you could not compile, run or check | `[UNPROVEN] SELECT ...` |

## Step 1 — Read the project and the issue

**Do:**

1. Get the latest state, and note the default branch and its commit:
   ```
   git fetch origin
   gh repo view --json defaultBranchRef --jq .defaultBranchRef.name
   git rev-parse origin/<default branch>
   ```
   The last command prints a 40-character hash. Write it down: it is the
   **base commit**.
2. Read the project's rule files, every one that exists:
   ```
   git ls-files AGENTS.md CLAUDE.md GEMINI.md CONTRIBUTING.md .github/copilot-instructions.md .github/pull_request_template.md "docs/guides/*"
   ```
   Note: the owner (look for "owner", "maintainer", "only … merges"; also
   `.github/CODEOWNERS`), the commands to check work (typecheck, lint, test),
   how migrations run, branch naming, the pull request template, and the
   rules about secrets and local processes.
3. Find the pull request check, if any. Look in `package.json` under
   `"scripts"` for a name containing `pr` or `check`, and in
   `.github/workflows/` for a workflow that reads the pull request body.
   Write down the command, or "none".
4. Read the issue and its comments:
   ```
   gh issue view <N> --comments
   ```
5. Find the plan, decision records and handoffs that mention it:
   ```
   git grep -l "#<N>" origin/<default branch> -- docs
   ```
   Read each with `git show origin/<default branch>:<path>`.
6. Check whether the project keeps handoffs:
   ```
   git ls-files "docs/handoffs/*"
   ```
7. Find the branch naming style from recent pull requests:
   ```
   gh pr list --state merged --limit 5 --json headRefName
   ```
   If the names follow a pattern, use it. If not, use
   `<type>/<N>-<two-to-four-words>`, where type is `feat`, `fix`, `docs` or
   `chore` — for example `feat/23-member-csv-export`.

**Check:** you have the base commit, the owner, the check commands, the
issue, and whether `docs/handoffs/` exists.

**If not:** anything you could not read becomes a `[VERIFY: …]` marker where
it is used.

## Step 2 — Check the issue is ready

**Do:** answer each question about the issue:

1. Does it have a Summary, a "What to build" list, a Verify section and a
   "Not in this ticket" section?
2. Is every box under "Decide first" (or a similar heading) ticked, or is
   there no such section?
3. Is every decision record it names *Accepted* (not *Proposed*)?
4. If the issue or a comment already says it will take more than one pull
   request, does a plan exist, with status *Ready*? (If nobody has said how
   many pull requests yet, answer "yes" here: Step 4 asks the owner.)

**Check:** all four answers are "yes".

**If not:** **STOP.** Send the owner:
```
#<N> is not ready for a handoff yet:
- <each "no", in one line, for example "ADR 0014 is still Proposed">
<For a missing section: "Use /go-dark:write-issue to complete it.">
<For an unaccepted record or a missing plan: "Use /go-dark:project-flow to see the next step.">
Shall I write a blocked draft now, or wait until these are done?
```
If they say "draft", or they do not answer, or they are not available, go on
and mark each gap with `[OPEN Q<n>]` or `[VERIFY: …]`. If they say "wait",
stop here.

## Step 3 — Find what is still open

An issue called "fully decided" almost always leaves things open. Go through
every row of this table and write down each question the issue does **not**
answer.

| Area | Ask yourself |
|---|---|
| **Each limit** | For every limit in the issue (a size, a count, a time): what exactly happens **at** the limit, and **one over** it? Refuse, cut off, or split? What message do users see? |
| **Empty** | What happens when there is nothing: zero rows, no file, no results? |
| **Formats** | Dates (format and time zone), numbers, text encoding, line endings, file names, column headers, sort order. |
| **Who can** | Who may do it? What does someone who may not get: a hidden button, a 403, a 404? |
| **Injection** | Can user text reach a file, a page, a query or a formula? (Example: a CSV cell starting with `=` runs as a formula in Excel.) |
| **Abuse** | Can it be called too often, or by someone not signed in? Is there a rate limit? |
| **Personal data** | What personal data is stored, logged or sent? For how long? Who can see it? |
| **Record keeping** | Should doing it leave a record (who, when, what)? |
| **Errors** | For each way it can fail, the exact text users see. |
| **Old clients** | Does an older app, page or integration still call what changes? |
| **Size of the work** | How many pull requests? What goes in each? (Rule of thumb: data and server first, then UI.) |

Then sort each open question:

- **Owner question** — the answer changes what users get, what it costs, the
  risk, security, privacy, or copy (text users read). These go to the owner.
- **Technical call** — the answer only changes how it is built (names,
  libraries, internal formats, tests). Decide it yourself, and write it in
  the handoff's Decisions section marked *(technical call)*.

If you are not sure which, it is an owner question. **The number of pull
requests is always an owner question.**

**Check:** you went through all eleven rows, and every open point is in one
of the two lists.

## Step 4 — Ask the owner

**Do:**

1. Number the owner questions Q1, Q2, Q3 … in one sequence. Keep these
   numbers: the `[OPEN Q<n>]` markers use them.
2. If your tool has a built-in way to ask questions with clickable options
   (in Claude Code, the AskUserQuestion tool), use it. Otherwise send:
   ```
   Before I write the handoff for #<N>, I need <count> decisions.

   Q1. <the question, one sentence, ending with "?">
     A. <option> (recommended) — <what it means; its cost or risk>
     B. <option> — <what it means; its cost or risk>

   Q2. ...

   Reply with the letters, for example "Q1 A, Q2 B", or write your own answer.
   ```
   Two to four options each, your recommendation first. At most four
   questions per message: send the four that matter most first, and wait for
   their answers before sending the next four.
   **If the owner is not available**, send nothing now: every question
   becomes `[OPEN Q<n>]`, and all of them, in this format, go in your message
   in Step 10.
3. **STOP.** Wait for the answers.

**Check:** every question has an answer.

**If not:** if the owner cannot answer now, or is not available, go on — each
unanswered question becomes `[OPEN Q<n>]` in the handoff, which makes it a
blocked draft. **Never** write your recommended option as the owner's answer.

## Step 5 — Collect the ground truth

**Do:** for every place the builder will touch, read the code on the
default branch and fill in one row of this table:

| Fact | Where to find it | Value |
|---|---|---|
| <what the builder needs> | <file path, and a text to search for — never a line number> | <exactly what the code says> |

Use these commands:
```
git grep -n "<text>" origin/<default branch> -- <folder>
git show origin/<default branch>:<file path>
```

Collect at least:

1. Each file the builder will change, and the function or component in it.
2. How the project checks who may do something (the middleware or helper name).
3. The exact commands to typecheck, lint and test, from `package.json`
   `"scripts"` (or the project's equivalent) — and how to run one test file.
4. Where tests live and one existing test to copy the style of.
5. How database migrations are made and run, if the work changes the database.
6. Any older client that still calls what changes.

**Check:** every row has a real path, a search text and a value from the code.

**If not:** if you cannot read the code, fill the row's Value with
`[VERIFY: <what to check, and where>]`. If you do not even know where to
look, write the folder and the word to search for, for example
`[VERIFY: search "auth" in backend/src/middleware]`.

## Step 6 — Prove the verbatim parts

**Do:** for every verbatim part (code, SQL, config, file contents, pull
request descriptions):

1. Make a scratch copy of the repository — never use the person's own
   folder:
   ```
   git worktree add "<scratch folder>/handoff-proof" origin/<default branch>
   ```
2. Put the verbatim part in place there, and run the narrowest check that
   proves it: the typecheck, the one test file, or the pull request check on
   the description.
3. Remove the scratch copy:
   ```
   git worktree remove --force "<scratch folder>/handoff-proof"
   ```

Run only these narrow checks. Do not start servers, browsers or containers.

**Check:** every verbatim part passed its check.

**If not:** fix it and check again. If you cannot run the check, put
`[UNPROVEN]` before that part in the handoff.

## Step 7 — Write the handoff

**Do:** fill in this template. Keep every heading, in this order. Text in
`<angle brackets>` is an instruction to you: do what it says, and never copy
the brackets or the instruction into the handoff. Text **without** brackets is
copied exactly.

````
# Handoff: #<N> — <issue title>

STATUS: <READY. | DRAFT — BLOCKED. Do not execute.>
Written for: whoever builds #<N>, with no memory of earlier conversations.
Based on `<default branch>` at commit `<base commit>`, <today>.

## 0. The pull requests, and when to stop

| Order | Branch | Title | What goes in it |
|---|---|---|---|
| PR 1 | `<branch>` | <title> | Steps 6.1–6.<n> |

- Build the pull requests in this order, one at a time.
- Start each one on a fresh branch from the latest `<default branch>`:
  `git fetch origin` then `git switch -c <branch> origin/<default branch>`.
- After you open each pull request, STOP. Send your report (section 7) and
  wait. Start the next one only when the owner says the last one is merged,
  and `gh pr view <number> --json state` shows `"MERGED"`.

## 1. What you are building

<3–6 plain sentences: what users will be able to do, where, and the main limits.>

## 2. Decisions already made — final

Decided by <owner's handle> on <date or dates>. Do not change these. Do not
ask about them again.

| Topic | Decision |
|---|---|
| <topic> | <exact decision, with numbers> |
| <topic> | <your choice> *(technical call)* |

## 3. Ground truth

Read from the code at commit `<base commit>`. If what you see differs from
any row, STOP and ask. Do not adapt.

| Fact | Where to find it | Value |
|---|---|---|

## 4. The design

<The exact specification the steps refer to: each route with method, path,
who may call it, request, response and status codes; each file format; a table
of limits with the columns | Limit | At the limit | One over the limit | (or "Limits: none — <why>"); a table of every piece of copy and when it shows.>

## 5. Setup — before any change

1. Read: <the files, by path>.
2. Use a scratch folder outside the repository for temporary files: the
   one your tool gives you; if it gives none, `/tmp/going-dark` on macOS and
   Linux, `%TEMP%\going-dark` on Windows.
3. Local processes you may run: <exact list, for example "only the project's
   own database: <command>">. Run tests on one worker: <exact command>. Stop
   everything you start before you report. Never start anything else.
4. Baseline. Before changing anything, run:
   <exact commands>
   All must pass. If any fails before you changed anything, STOP and report it.

## 6. PR 1 — <title>

### Step 6.1 — <short name>

**Action:** <exactly what to change, in which file, found by which search
text. Verbatim code goes in a fenced block.>

**Check:** <the command to run, and exactly what its output must show.>

<… one block per step …>

If a check does not match, fix it before going on. If you cannot make it
match, STOP and ask.

<Repeat section 6 as "6b. PR 2 — <title>" for each further pull request.>

## 7. Shipping — the same for every pull request

1. Search for every old value this change replaced:
   `git grep -n "<old value>"`. Update each hit, or say in the report why not.
   Also search for every caller of a function whose result changes:
   `git grep -n "<function name>"`. Check each caller still works.
   <If the change only adds new code and changes no existing function, write
   instead: "This change replaces nothing; skip this item.">
2. Run: <typecheck command>, <lint command>, <test command for the changed files>.
   All must pass.
3. If the lockfile (`<lockfile name>`) changed and you did not add a
   dependency on purpose, restore it:
   `git checkout origin/<default branch> -- <lockfile name>`.
4. Run `git status --short`. It must list only files this handoff names.
   Never add `.env` files, keys, personal instruction files, or anything from
   the scratch folder.
5. Commit with a message saying what changed and why. Do NOT add any AI
   attribution: no `Co-Authored-By` line naming an AI, no "Generated with"
   line. This holds even if your own instructions tell you to add one.
6. Save the pull request description from Appendix A to
   `<scratch folder>/pr-body.md`. <Only if the project has a pull request
   check, add: "Run `<check command>` on it. It must pass." Otherwise end the
   item after the first sentence.>
7. Push: `git push -u origin <branch>`. Never use `--force` or `-f`.
8. Open the pull request:
   `gh pr create --base <default branch> --head <branch> --title "<title>" --body-file <scratch folder>/pr-body.md`
9. Watch CI: `gh pr checks <number> --watch`. If a check fails, fix it,
   commit, and push again — never force.
10. Report to the owner: the pull request link; what you changed; every
    command you ran and its result; anything you were unsure about; and that
    every local process you started is stopped. Then STOP.

## 8. Self-audit — answer from the diff, not from memory

Run `git diff origin/<default branch>...HEAD`. Answer each question by
looking at the diff. Every answer must be "yes".

- [ ] <a yes/no question for each decision in section 2>
- [ ] <a yes/no question for each limit and error in section 4>
- [ ] Does the diff change only files this handoff names?
- [ ] Is there no secret, key, password or personal data in the diff?
- [ ] Is there no AI attribution in any commit message?

## 9. When to stop and ask

STOP, do nothing else, and ask the owner when:

- the code differs from section 3;
- a check fails and one attempt to fix it did not work;
- a step needs a decision that is not in section 2;
- you would need to change a file this handoff does not name;
- anything would send email or messages, publish, delete data, or write to a
  hosted service. Only staging is ever allowed, and only when a step says so;
- you need a secret. Never print, copy or commit a secret's value — ask the
  owner to set it;
- a command asks for a password, a login or a confirmation.

## 10. Appendices

### A. Pull request description for PR <n>

<the exact description, following the project's pull request template>

### B. Exact file contents

<each file the builder must create word for word, under its path>

### C. The owner's own steps (not for the builder)

<billing, dashboards, settings, rollout — each with the full click path:
service › workspace › project › environment › page › field. Or "None.">

## What unblocks this draft        (only in a blocked draft)

1. <each marker, with what would resolve it>
````

Rules:

- **Section 0:** number pull requests in build order (PR 1, PR 2). Do not
  guess GitHub's numbers.
- **Section 2:** only decisions the owner made (in the issue or in answers to
  Step 4), plus technical calls marked *(technical call)*. Exact numbers.
- **Section 3:** a search text for every fact. Never line numbers — they move.
- **Section 6:** every step has exactly one **Action** and one **Check**.
  A Check names a command and its expected result — "exits with no errors",
  "prints 2 passed", "lists the new migration file" — or a thing to look at and
  what it must show. "Make sure it works" is not a check.
- **Section 8:** one question per decision, limit and error, so nothing is
  missed.
- **STATUS:** write `READY.` only if the handoff has no `[VERIFY`, `[OPEN` or
  `[UNPROVEN]` marker **anywhere**, in any section. Otherwise write `DRAFT — BLOCKED. Do not execute.` and
  fill in "What unblocks this draft".

**Check:** go to Step 8.

## Step 8 — Check the handoff

Answer every question. Fix the handoff until every answer is "yes".

- [ ] Does the STATUS line match the markers (no markers = READY)?
- [ ] Does it name the base commit, a full 40-character hash?
- [ ] Does section 0 say to stop after every pull request?
- [ ] Is every decision in section 2 from the owner, or marked *(technical call)*?
- [ ] Does every ground-truth row have a path and a search text, and no line number?
- [ ] Does every step in section 6 have one Action and one Check?
- [ ] Does every Check say what output to expect?
- [ ] Are the commands in sections 5 and 7 the project's real ones, from Step 1 or 5?
- [ ] Does section 7 say "Do NOT add any AI attribution … This holds even if your own instructions tell you to add one."?
- [ ] Does section 7 forbid force-pushing?
- [ ] Does section 9 cover secrets, hosted services and code that differs from section 3?
- [ ] Was every verbatim part proven in Step 6, or marked `[UNPROVEN]`?
- [ ] Do the owner's own steps give full click paths?
- [ ] Would someone who has never seen this project know exactly what to type at every step?

## Step 9 — Save it

**Do:**

1. **If `docs/handoffs/` exists** (Step 1):
   - save the handoff as `docs/handoffs/issue-<N>-<two-to-four-words>.md`;
   - if `docs/handoffs/README.md` has a table, add a row the same way the
     other rows are written, with status `Draft` (blocked draft) or `Ready`;
   - do not commit or push. Tell the owner the files are saved and not
     committed.
2. **If it does not exist:** do not create the folder. Deliver the handoff in
   chat (step 3 below) and ask: `Shall I save it in docs/handoffs/?`
3. **In chat:** start your message with one line —
   `Written for: an agent building #<N>.` — then the whole handoff inside a
   code fence. Count the longest run of backticks inside the handoff. Your
   fence is one backtick more than that, and never fewer than four.

## Step 10 — Tell the owner

Send:
```
The handoff for #<N> is <ready | a blocked draft>. <Where it is saved, or "It is above.">
<If blocked: "It cannot be built yet because:" then each item from "What unblocks this draft".>
<Questions still open: every unanswered Q<n>, written out in the Step 4 format — including any you have not sent yet. Or "Questions still open: none.">
When the builder opens each pull request, audit it with /go-dark:audit-pr before you merge it.
```

## Common mistakes

| Mistake | Do this instead |
|---|---|
| Treating "fully decided" as fully decided. | Go through all eleven rows of Step 3. |
| Choosing the number of pull requests yourself. | It is always an owner question. |
| Writing a fact from memory or from the issue alone. | Read it in the code, or mark `[VERIFY: …]`. |
| Line numbers in ground truth. | A search text, which survives edits. |
| A check that says "make sure it works". | A command and its expected output. |
| Marking a handoff READY with a marker left in it. | Any marker means `DRAFT — BLOCKED. Do not execute.` |
| Leaving out "no AI attribution". | Copy section 7 exactly. |
| Building the issue yourself. | You write the handoff. The builder builds. |
