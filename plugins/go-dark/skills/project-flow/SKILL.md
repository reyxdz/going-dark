---
name: project-flow
description: Use when deciding what step a piece of work is at or what comes next, when starting work on an issue, when a pull request has merged, before a release, or when asked whether an issue or feature is finished or what is left.
---

# Project flow: where is this work, and what comes next?

## What this skill is for

Use it to answer questions like "Is issue #12 finished?", "What is left?" or
"What comes next?". You check nine steps, one at a time, give each one a
status, and send a report in a fixed format.

Work is **finished** only when real users have it and the records say so.
Merged code is **not** finished.

## How to follow this file

1. Do the steps in order, from Step 1 to Step 6. Do not skip a step. Do not
   change the order.
2. Each step has three parts:
   - **Do** — what to do. Commands are shown in code blocks. Replace every
     `<word in angle brackets>` with the real value and remove the brackets.
   - **Check** — what must be true before you go on.
   - **If not** — what to do when the check fails.
3. Never invent a fact. Every name, number, date, file path and result you
   write must come from something you read or ran during this task, or that
   the person told you. If a source gives an approximate value ("about three
   weeks ago"), keep it approximate and say where it came from. If a template
   asks for a value you do not have, write `[NOT CHECKED: <what> — <why>]` in
   its place.
4. When you cannot do something — a command fails, you have no access to the
   repository or GitHub, a file does not exist — do not guess and do not
   pretend it worked. Write `[NOT CHECKED: <what> — <why>]` in your notes and
   go on to the next instruction. Every `[NOT CHECKED]` appears in the report.
5. The project's own rules win. If a project file listed in Step 1 says
   something different from this file, do what the project says, and add to
   the report: `The project's rule "<quote>" replaced this skill's rule "<quote>".`
6. This skill only **reads**. Do not create, edit, close, merge or comment on
   anything. Only report.

## Words used in this file

| Word | Meaning |
|---|---|
| **owner** | The person who decides what is built, merges pull requests and releases. Step 1 shows how to find them. |
| **issue** | The GitHub issue that describes the work, for example `#12`. `<N>` in this file means its number, without the `#`. |
| **pull request (PR)** | A proposed change. **Merged** means it is in the default branch. |
| **default branch** | The branch pull requests go into, usually `main`. Step 1 finds it. |
| **release branch** | The branch real users get, for example `production`. Some projects have none: they release with tags, or deploy the default branch directly. Step 1 finds out which. |
| **plan** | A document, usually in `docs/plans/`, that splits a large issue into **phases**. Small issues have no plan. |
| **phase** | One part of a plan. One pull request may deliver one phase or several, as long as it names each one it delivers. |
| **decision record (ADR)** | A short document, usually in `docs/decisions/` or `docs/adr/`, recording a choice that is expensive to undo. Its status is *Proposed*, *Accepted* or *Superseded*. |
| **handoff** | A document telling another agent or person how to build an issue, usually in `docs/handoffs/`. |
| **staging** | A copy of the live site, used to try changes before real users get them. |
| **records** | The issue, the plan, decision records, index tables (README files listing plans, decisions or handoffs) and pull request descriptions. |
| **closing keyword** | `Close`, `Closes`, `Closed`, `Fix`, `Fixes`, `Fixed`, `Resolve`, `Resolves` or `Resolved`, in any capitals, followed by `#<N>`, in a pull request description. GitHub closes the issue when that pull request merges. `Part of #<N>` does **not** close it. |
| **replaced** | A pull request was closed without merging, and a later one says it replaces it ("Replaces #40"), or the owner says so. |

## The nine steps

Every piece of work goes through these nine steps, in this order.

| # | Step | Done when |
|---|---|---|
| 1 | **Issue** | The issue has a summary of the problem, a list of what to build, and a measurable "Verify" or "Done when" section. |
| 2 | **Decide** | No open question is left on the issue. Every decision record the issue or plan names is *Accepted*. If the work needs more than one pull request, a plan exists. |
| 3 | **Handoff** | A handoff exists if the work was given to someone else to build. |
| 4 | **Build** | Every phase of the plan was delivered by a merged pull request, and no pull request for the issue is still open. |
| 5 | **Audit** | Every merged pull request was audited before it merged. |
| 6 | **Merge** | Every pull request for the issue is merged (or closed and replaced by one that merged). |
| 7 | **Verify on staging** | Someone used the change on staging — a real phone, light and dark theme, the plan's verify steps — and wrote down what they checked. |
| 8 | **Release** | The change is in what real users get. |
| 9 | **Close out** | The plan's boxes are ticked, its status says complete, follow-up work has its own issues, and the issue is closed. |

### The four statuses

Give every step exactly one status.

| Status | Use it when |
|---|---|
| **Done** | You saw evidence that the "Done when" is true. |
| **Not done** | You looked, and the evidence shows it is false or missing. |
| **Not needed** | The step does not apply. Only allowed where Step 3 below says so. |
| **Unconfirmed** | You could not look: no access, the command failed, or the file was not available to you. (Step 5, Audit, has its own rule below.) |

The difference that matters: **looked and did not find it = Not done.
Could not look = Unconfirmed.**

Example: you read the issue and every comment, and nobody wrote down a
staging check. Step 7 is **Not done**. You could not open the issue at all.
Step 7 is **Unconfirmed**.

## Step 1 — Find the project's facts

**Do:**

1. Get the latest state from GitHub:
   ```
   git fetch origin
   ```
2. List the project's rule files:
   ```
   git ls-files AGENTS.md CLAUDE.md GEMINI.md CONTRIBUTING.md .github/copilot-instructions.md "docs/guides/*"
   ```
   Read every file it lists. Write down the name of each file you read.
   While reading, note anything about: who the owner is, who merges, how to
   release, what the release branch is called, staging, and how often to
   release.
3. **Find the owner.** In the files you just read, look for "owner",
   "maintainer", "only … merges" or "only … releases". Also read
   `.github/CODEOWNERS` if it exists. If you find a name or GitHub handle,
   that is the owner. If you do not, the owner is the person who asked you
   this question; write "the owner" in the report.
4. **Find the default branch:**
   ```
   gh repo view --json defaultBranchRef --jq .defaultBranchRef.name
   ```
   The output is one word, for example `main`.
5. **Find how the project releases.** Use the first rule that matches:
   1. The project's rules name a release branch → that is it.
   2. The project's rules say the default branch deploys to users on every
      merge (for example "main deploys to production automatically") → the
      project **deploys the default branch directly**.
   3. Run `git branch -r`. Look for `origin/production`, `origin/release`,
      `origin/prod` and `origin/live`, in that order. The first one in the
      list is the release branch.
   4. Run `git tag --sort=-creatordate`. If it lists version tags such as
      `v1.4.0` → the project releases **by tag**.
   5. None of these → write `[NOT CHECKED: how the project releases — no
      release branch or tags found]`. Step 8 will be Unconfirmed, and the
      report asks the owner.

**Check:** you have a list of rule files read (it may be empty), the owner,
the default branch, and how the project releases.

**If not:** for each fact you could not find, write `[NOT CHECKED: …]` and go
on. If `gh` or `git` does not work at all, every later step that needs it is
Unconfirmed.

## Step 2 — Collect what the records say about the issue

**Do:**

1. Read the issue and all its comments:
   ```
   gh issue view <N> --comments
   ```
   Write down:
   - its state: `OPEN` or `CLOSED`;
   - whether it has a "Decided" section, and whether any box anywhere is
     still unticked (`- [ ]`) under "Decide first" or a similar heading;
   - every plan, decision record, handoff and pull request it mentions;
   - any comment saying the change was checked on staging.
2. Find its pull requests:
   ```
   gh pr list --state all --search "<N>" --json number,title,state,body --limit 100
   ```
   Keep only the pull requests whose title or description contains `#<N>`
   not followed by another digit (`#120` is a different issue). For each one,
   write down: its number, its state (`OPEN`, `MERGED` or `CLOSED`), and
   whether its description has a closing keyword or `Part of #<N>`.
3. Find the plan, decision records and handoff that mention the issue:
   ```
   git grep -l "#<N>" origin/<default-branch> -- docs
   ```
   Each output line looks like `origin/main:docs/plans/0031-cover-photo.md`.
   Read each file:
   ```
   git show origin/<default-branch>:<path after the colon>
   ```
   From a **plan**, write down: the plan's own status (a line near the top
   such as `Status: Ready` or `**Status:** Complete`), each phase and its
   status, and every box in its "Acceptance", "Verify" or "Done when" lists
   (ticked or not). From a **decision record**,
   write down its status. From a **handoff**, write down its status
   (*Draft*, *Ready* or *Complete*).

**Check:** you have the issue's state, its pull requests, and the plan,
decision records and handoff (each may be "none found").

**If not:** write `[NOT CHECKED: …]` for what you could not read, and go on.

## Step 3 — Give each of the nine steps a status

Go through the table below one row at a time. For each step, follow its rule
exactly and write the status and the reason, for example
`Step 6 Merge — Done: #40 and #44 are both MERGED.`

| Step | How to decide its status |
|---|---|
| **1. Issue** | **Done** if the issue has a summary, a list of what to build, and a Verify or "Done when" section with things you can measure. **Not done** if any of the three is missing — name it. |
| **2. Decide** | **Not done** if any box under "Decide first" (or a similar heading) is unticked, or a decision record the issue or plan names is still *Proposed*, or there are two or more pull requests and no plan. Name which. Otherwise **Done**. |
| **3. Handoff** | A handoff for the issue exists: **Done** if its status is *Ready* or *Complete*, **Not done** if it is *Draft*. No handoff exists: **Not needed** (a handoff is only required when the work is given to someone else, and the records do not show that). |
| **4. Build** | **With a plan:** list every phase. For each, find the merged pull request that delivered it — one whose title or description names that phase (for example "Phase 2" or the phase's title). **Done** if every phase has one and no pull request for the issue is `OPEN`. **Not done** otherwise — name each phase with no pull request and each open pull request. **Without a plan:** **Done** if at least one pull request is merged and none is open. |
| **5. Audit** | Read each merged pull request's reviews and comments: `gh pr view <PR> --comments`. **Done** if every one has an approving review, or a comment that contains "audit" or "safe to merge". If any has none: **Unconfirmed** — audits are often given in chat and not written on GitHub. Never mark this step Not done. |
| **6. Merge** | **Done** if every pull request for the issue is `MERGED`, or `CLOSED` with another one that merged in its place. **Not done** if any is `OPEN` — name it. |
| **7. Verify on staging** | **Done** only if something written says the change was checked on staging (or, if the project has no staging, on the closest real environment): an issue comment, a pull request comment, or a ticked plan box that names staging. **Not done** if you read the issue, its pull requests and the plan and found nothing. |
| **8. Release** | Find the merge commit of the pull request that merged **last** (latest merge date): `gh pr view <PR> --json mergeCommit --jq .mergeCommit.oid`. Then use the **one** bullet that matches how the project releases (Step 1):<br>• **Release branch:** run `git branch -r --contains <commit>`. **Done** if the output has `origin/<release-branch>`. **Not done** if not.<br>• **Tags:** run `git tag --contains <commit>`. **Done** if it lists a tag. **Not done** if it is empty.<br>• **The project deploys the default branch directly** (its rules say so): **Done** once merged.<br>• **Release method unknown** (Step 1): **Unconfirmed**.<br>If you already have the answer from another command, use it: `git merge-base --is-ancestor <commit> origin/<release-branch>` exiting with 1 means **not** released; exiting with 0 means released. |
| **9. Close out** | **Done** only if all of these are true: the issue is `CLOSED`; step 8 is Done; and, **if there is a plan**, every box in its acceptance or verify list is ticked and its status says complete. (With no plan, the plan part does not apply.) **Not done** otherwise — name every one that is missing. |

**Check:** all nine steps have exactly one status and a reason.

## Step 4 — Look for warnings

Check each of these. Write a warning for every one that is true.

1. **Plan and pull requests do not match.** A phase is marked done in the plan
   but no merged pull request delivers it, or there are fewer merged pull
   requests than phases. Write: `The plan marks phase <X> done, but no merged
   pull request delivers it.`
2. **The issue will not close by itself.** No merged or open pull request for
   the issue has a closing keyword. Write: `No pull request says "Closes
   #<N>", so the issue must be closed by hand at step 9, after the release.`
3. **The release is behind.** Only if the project has a release branch. Run:
   ```
   git rev-list --count origin/<release-branch>..origin/<default-branch>
   git log -1 --format=%cs origin/<release-branch>
   ```
   The first number is how many commits are waiting to be released. The second
   is the date of the last release. If the project's rules set a release
   rhythm, compare with it. If they set none: warn when more than 14 days have
   passed since that date, or more than 10 commits are waiting. Write: `The
   last release was <date> (<days> days ago) and <count> commits are waiting.`
4. **It reached users too early.** Only if step 8 (Release) is **Done** and
   any of steps 1–7 is **Not done**. Write: `The work is released, but
   step <number> (<name>) was never done.` — naming every such step, for
   example "steps 5 (Audit) and 7 (Verify on staging) were never done".

## Step 5 — Decide the verdict

Use the first rule that matches:

1. Every step is **Done** or **Not needed** → `Yes. #<N> is finished.`
2. At least one step is **Not done** → `No. #<N> is not finished. The first
   step not done is step <number> (<name>).` The first step not done is the
   lowest-numbered step with status Not done. An Unconfirmed step is
   **never** the first step not done.
3. No step is Not done, but some are **Unconfirmed** → `I cannot confirm #<N>
   is finished: step <numbers> could not be checked.`

## Step 6 — Write the report

Fill in this template exactly. Keep the headings and their order. Leave out a
section only where the template says so.

```
**Is #<N> finished?** <the verdict sentence from Step 5>

**What is left, in order**

| Step | Status | What is left | Who does it |
|---|---|---|---|
| <number>. <name> | Not done | <the exact action, in one sentence> | <owner's handle, or "the owner"> |

**Could not check**
- Step <number> (<name>): <why>. To confirm: <exactly what to look at or run>.

**Already done:** steps <numbers>. **Not needed:** steps <numbers>.

**Warnings**
- <each warning from Step 4>

**What I read:** <the rule files from Step 1, or "the project has no AGENTS.md, CLAUDE.md, GEMINI.md, CONTRIBUTING.md or guides">; the issue; pull requests <numbers>; <plan, decision record and handoff files>.
<every [NOT CHECKED: …] note, one per line>
```

Rules for the template:

- **What is left** lists every step with status Not done, lowest number first.
- **Could not check** lists every Unconfirmed step. Leave the section out if
  there are none.
- **Warnings**: leave the section out if Step 4 found none.
- **Who does it:**
  - Merge, Release and closing the issue: always the owner.
  - Every other step: the owner, unless the plan or issue names someone else
    for it.
- **What is left** must be an action someone can do, not a description. Write
  "Check the cover photo on staging on a real phone, in light and dark theme,
  then write what you checked as a comment on #12" — not "staging not done".
- If the next step is one of these, add the skill to use:
  - step 1 → `/go-dark:write-issue`;
  - step 3 → `/go-dark:write-handoff`;
  - step 5 → `/go-dark:audit-pr`.

## Before you send: check every line

Answer each question. If any answer is "no", fix the report first.

- [ ] Does every one of the nine steps appear once — in What is left, Could
      not check, Already done or Not needed?
- [ ] Is the verdict's "first step not done" the lowest-numbered Not done step?
- [ ] Is no Unconfirmed step named as the first step not done?
- [ ] Does every Not done step have an action and a person?
- [ ] Does every Unconfirmed step say what would confirm it?
- [ ] Did you check all four warnings in Step 4?
- [ ] Does every fact in the report come from something you read or ran?
- [ ] Are all `[NOT CHECKED]` notes in the report?
- [ ] Did you avoid changing anything (no comment, close, merge or edit)?

## Common mistakes

| Mistake | Do this instead |
|---|---|
| Saying "finished" because the pull requests merged. | Merged is step 6 of 9. Check steps 7, 8 and 9. |
| Marking a step Not done because you could not open a file. | Could not look = **Unconfirmed**. |
| Marking a step Unconfirmed when you looked and found nothing. | Looked and found nothing = **Not done**. |
| Trusting the plan's "Done" for a phase. | Find the merged pull request that delivered it. |
| Assuming the issue will close itself. | Only a merged pull request with a closing keyword closes it. |
| Writing "the release is old" with no numbers. | Give the date, the days and the commit count. |
| Closing the issue or ticking boxes yourself. | This skill only reports. The owner acts. |
