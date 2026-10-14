---
name: write-issue
description: Use when creating or drafting a GitHub issue, turning a bug, idea, request or audit finding into an issue, or checking whether an existing issue is ready to plan or build from.
---

# Write an issue

## What this skill is for

An issue is a **specification**. Someone who never saw your conversation must
be able to plan and build from it without guessing. That means:

- the problem is concrete, with real file names and real numbers;
- every decision says who made it and when;
- what is in scope and what is not is written down;
- "done" can be measured.

You will: collect facts, sort the open points, ask the owner, write the draft
from a fixed template, show it, and only then file it on GitHub.

To **check an existing issue** instead of writing one, do Step 1, then go
straight to "Before you send" and answer every question about that issue.
Report each "no" with what to add.

## How to follow this file

1. Do the steps in order, from Step 1 to Step 9. Do not skip a step. Do not
   change the order.
2. Each step has three parts:
   - **Do** — what to do. Commands are shown in code blocks. Replace every
     `<word in angle brackets>` with the real value and remove the brackets.
   - **Check** — what must be true before you go on.
   - **If not** — what to do when the check fails.
3. When this file says **STOP**, stop working, send the message it gives, and
   wait for the answer. Do not go on until the person answers.
4. Never invent a fact. Every file name, line number, number, name and date
   you write must come from the person, the code, or a command you ran during
   this task.
5. When you cannot check a fact — no access to the repository, a command
   fails, the file does not exist — you may still write it if the person told
   you, but put `*(unverified: <why>)*` right after it. Never write a number
   or a file path you made up.
6. The project's own rules win. If a file you read in Step 1 says something
   different from this file, do what the project says, and tell the person:
   `The project's rule "<quote>" replaced this skill's rule "<quote>".`
7. **Never** create the issue on GitHub until the person has seen the full
   draft and said yes (Step 8).
8. The examples in this file (numbers, copy, file names) only show the shape.
   Never reuse them as values for a real issue.

## Words used in this file

| Word | Meaning |
|---|---|
| **owner** | The person who decides what is built. Step 1 shows how to find them. |
| **owner's handle** | The owner's GitHub username, for example `reyxdz`. |
| **bug** | Something that worked, or was meant to work, and does not. |
| **feature** | Something new that people will be able to do. |
| **technical issue** | A change users do not ask for directly: speed, size, cost, security, cleanup. A complaint like "the list is slow" is a technical issue. |
| **owner question** | A question whose answer changes what users get, what it costs, or the risk. Step 4 lists them. |
| **technical call** | A choice about how to build it, which you make yourself and write down. Step 4 lists them. |
| **decision record (ADR)** | A short document, usually in `docs/decisions/` or `docs/adr/`, recording a choice that is expensive to undo. |
| **expensive to undo** | Undoing it later would need a data migration, break users or other apps, cost money, or change a public URL or API. |
| **sets a precedent** | It is the first of its kind in the project, and later work will copy it (the first paged list, the first file upload, the first background job). |
| **copy** | Any text users will read: buttons, messages, errors, empty pages. |
| **scratch folder** | A folder outside the repository for temporary files. Use the one your tool gives you (often called a scratchpad or temp folder). If it gives none: `/tmp/going-dark` on macOS and Linux, `%TEMP%\going-dark` on Windows. Create it if it is missing. |
| **today** | Today's date as `YYYY-MM-DD`, from your environment. If you do not know it, ask. |

## Step 1 — Read the project

**Do:**

1. List the project's rule files and read every one that exists:
   ```
   git ls-files AGENTS.md CLAUDE.md GEMINI.md CONTRIBUTING.md .github/copilot-instructions.md "docs/explanation/*" "docs/guides/*"
   ```
2. Read the issue templates, if any:
   ```
   git ls-files ".github/ISSUE_TEMPLATE/*"
   ```
3. Read the three most recent issues, to copy their style:
   ```
   gh issue list --state all --limit 3 --json number,title,labels,body
   ```
4. List the labels that exist:
   ```
   gh label list
   ```
5. List the decision records:
   ```
   git ls-files "docs/decisions/*" "docs/adr/*"
   ```
6. **Find the owner.** In the rule files, look for "owner", "maintainer",
   "only … merges". Also read `.github/CODEOWNERS` if it exists. If you find
   a GitHub handle, that is the owner's handle. If not, the owner is the
   person asking you; you will ask for their handle in Step 5.

**Check:** you know the owner (or will ask), the labels, and the style of
recent issues.

**If not:** for each thing you could not read, note it. Anything you later
write that depends on it gets `*(unverified: …)*`.

## Step 2 — Decide what kind of issue it is

**Do:** pick exactly one, using the words table: **bug**, **feature** or
**technical issue**.

**Check:** you picked one, using the first rule that matches:
1. It was meant to work and does not ("broken", "never arrives", "error",
   "stopped working") → **bug**.
2. It works, but too slowly, too big, too costly, or needs cleaning up →
   **technical issue**.
3. People will be able to do something they cannot do now → **feature**.

## Step 3 — Collect the facts

**Do:**

1. **Where in the code.** Find the exact file and line:
   ```
   git grep -n "<function, route or text the person mentioned>"
   ```
   Write `file:line` from the output, for example
   `backend/src/routes/offers.ts:42`. If you cannot search the code, use what
   the person said, exactly as they said it ("near line 40", not ":40"), and
   add `*(unverified: code not read)*`.
2. **Numbers.** Write down every number the person gave (sizes, times,
   counts) **with its unit and where it was measured**, for example "2.4 MB
   for 50 offers, measured on staging". Do not round, change or add numbers.
3. **Decisions already made.** Note which decision records (from Step 1)
   are about this area. Note them by number and title.
4. **The real limits.** In the rule files, find what the project says about
   its users' devices, data, hosting, money and law. Note every limit that
   touches this issue.

**Check:** every fact has a source: the person, a file and line, or a
command output.

## Step 4 — Sort every open point into two lists

**Do:** write down everything not yet decided. Put each point in **one**
list using this table.

| Owner questions — ask the owner | Technical calls — decide yourself |
|---|---|
| What is in scope and what is not | Library, framework or tool to use — first check whether the project already uses one (in the package file) |
| A new or changed public URL, or what other apps send and receive | Function, file and variable names |
| Any limit users notice: page size, file size, time limit, how many | Internal details other apps never see |
| Any number in the Verify section (target size, target time) | Internal data formats and algorithms |
| Every piece of copy (text users read) | How the code is organised |
| What users see when something fails or is empty | How to test it |
| Anything that costs money or uses users' data | Database indexes, query shape |
| Anything that changes security or privacy | Defaults that users never see, and how the system behaves when it is set up wrong (for example refusing to start) |
| Anything that breaks other apps or old clients | |
| Anything expensive to undo | |

For each **technical call**, write your choice and a one-line reason.

For each **owner question**, prepare two to four options. Put the one you
recommend first. For each option, write what it means and its cost or risk.
For copy, write the exact text you propose as an option.

**Check:** no owner question was moved to the technical list because it was
easier. If you are not sure which list a point belongs in, it is an owner
question.

## Step 5 — Ask the owner

**Do:**

1. If your tool has a built-in way to ask questions with clickable options
   (in Claude Code, the AskUserQuestion tool), use it. Otherwise, send the
   questions as a message in exactly this format:
   ```
   I need your decision on <count> things before I write the issue.

   Q1. <the question, one sentence, ending with "?">
     A. <option> (recommended) — <what it means; its cost or risk>
     B. <option> — <what it means; its cost or risk>
     C. <option> — <what it means; its cost or risk>

   Q2. ...

   Reply with the letters, for example "Q1 A, Q2 B", or write your own answer.
   ```
2. Ask **at most four** questions in one message. If you have more, send the
   four that change the most first, wait, then send the next four.
3. If you do not know the owner's GitHub handle, add one last line:
   `Also: what is your GitHub username, for the "Decided" section?`
4. **STOP.** Wait for the answer.

**Check:** you have an answer for every question.

**If not:**
- The owner answered some questions: ask the rest again in the same format.
- The owner said they cannot decide yet, or they are not available: those
  questions go in a **Decide first** section in Step 6, unticked. **Never**
  write your recommended option as the owner's answer.

## Step 6 — Write the draft

**Do:** write the issue from this template. Keep the headings and their
order. **Required** sections are always there. **Optional** sections are
left out completely when they do not apply — never leave a heading with
nothing under it.

**The title** is one plain sentence naming the outcome and its most
important limit.

| Kind | Pattern | Example |
|---|---|---|
| Feature | `Let <who> <do what>, <key limit>` | `Let people attach photos and documents in messages, with a size limit per type` |
| Bug | `<The symptom> — <the fix>` | `The landing page search does nothing — make search work` |
| Technical | `<Make what> <better how>, <for whom or why>` | `Page the offer list and send thumbnails, so it loads on budget phones` |

**The body:**

```
## Summary

<2–5 sentences: who tries to do what, what happens, why it matters. A bug
names the file and line. A technical issue gives the measured numbers with
units and where they were measured.>

## Why it happens            (optional: bugs and technical issues, when known)

<The cause, in plain words. Cite the decision record behind it ("ADR 0012"),
or write "No decision record covers this." If the fix sets a precedent, add
"This sets a precedent; see Notes.">

## What to build

### Data                    (only the groups that apply)
- [ ] <one concrete thing that can be checked>

### Server
- [ ] ...

### UI
- [ ] ...

### Docs and housekeeping
- [ ] ...

<A specification with three or more values is a table:>

| Setting | Value |
|---|---|
| Page size | 20 |

<Every option that was rejected says why, in the item: "PDF only: Office
files can carry macros.">

<Every piece of copy, as a table:>

| When | Users see |
|---|---|
| The list is empty | "No offers yet. New offers appear here." |

## Decided (<owner's handle>, <today>)

- [x] <the question in a few words> — **<the owner's answer>**
- [x] <topic> — **<your choice>** *(technical call)*

## Decide first               (optional: only if the owner deferred something)

- [ ] <the question> — options: A. <…> (recommended), B. <…>

## Verify

- [ ] <a measurable result: an exact number with its unit, or exact behaviour>
- [ ] <a named test: "a test that GET /offers?limit=51 returns 400">
- [ ] On staging, <what to check, with which device, browser or account>.

## Not in this ticket

- <what is out of scope> — <the issue that covers it, as #number, or "no issue yet">

## Docs                       (optional)

- <each document that must change, by path>

## Notes                      (optional)

- <where this came from: "Raised by <who> on <date>" or "Found in #41's audit">
- <timing, dependencies, the precedent this sets>

## How to ship

A pull request into `<default branch>` using the pull request template, with
all checks passing. <Link the project's pull request guide, or write "The
project has no pull request guide.">
```

Rules for every section:

- **Decided** contains only questions the owner actually answered, plus your
  technical calls marked *(technical call)*. Use the owner's handle and
  today's date in the heading.
- **Verify** numbers come from the owner or the person who asked. If nobody
  gave you a target, it was an owner question in Step 4 — do not make one up.
- Every **date** is absolute (`2026-11-12`), never "next week".
- Every decision record, guide and other issue is named by its number
  (`ADR 0012`, `#41`).
- Every rule is enforced by the **server**, never only in the browser. If
  your draft says "the button is hidden", it must also say what the server
  does when the request comes anyway.
- Failure and empty states are designed: say exactly what users see. Never
  "show an error" or "no results".
- Respect the project's real limits from Step 3. Name the limit in the item
  it shapes ("thumbnails, because users are on prepaid data").
- **Not in this ticket** is required. For each item with no issue, add to your
  message in Step 8: `Shall I file an issue for <item>?`
- If the change is expensive to undo or sets a precedent and no decision
  record covers it, add to Notes: `Needs a decision record: <topic>.`
- If you know a section is needed but could not check a detail in it (a doc
  whose path you could not read, the default branch, whether a guide exists),
  keep the section and mark the detail `*(unverified: …)*`.

**Check:** the draft has a title and the five required sections: Summary,
What to build, Verify, Not in this ticket, How to ship. If anything was
decided, it also has Decided.

## Step 7 — Check the draft

**Do:** answer every question in "Before you send" below about your draft.

**Check:** every answer is "yes".

**If not:** fix the draft, then answer the list again from the top.

## Step 8 — Show the draft and ask to file it

**Do:**

1. Send the person the full title and body, then this message:
   ```
   This is the draft. It is not filed yet.
   Labels I will use: <labels — only labels that exist, from Step 1: one for the kind (bug, feature, technical) and one for the area, where such labels exist; or "none" if you could not list them or none fits>.
   Reply "file it" to create it on GitHub, or tell me what to change.
   ```
   Add any `Shall I file an issue for …?` lines from Step 6.
2. **STOP.** Wait for the answer.

**Check:** the person replied with a clear yes: "file it", "create it", "yes",
"go ahead", or the same meaning in their own words.

**If not:**
- They asked for changes: make them, go back to Step 7, then Step 8.
- Anything that is not a clear yes is **not** permission. Do not file.

## Step 9 — File it

**Do:**

1. Save the body (everything except the title) to a file in the scratch
   folder, for example `<scratch folder>/issue-body.md`. Never save it inside
   the repository.
2. Create the issue, with one `--label` per label (leave `--label` out if there are none):
   ```
   gh issue create --title "<title>" --body-file "<scratch folder>/issue-body.md" --label "<label>"
   ```
3. Delete the body file.
4. Send the person the issue's URL, which the command prints.

**Check:** the command printed a URL like `https://github.com/<owner>/<repo>/issues/<number>`.

**If not:** send the person the exact error. Do not retry with different
labels or a different title unless they say so.

## Before you send: check every line

- [ ] Is the title one sentence that names the outcome and its key limit?
- [ ] Does Summary say who, what happens, and why it matters?
- [ ] Does a bug name the file and line? Does a technical issue give measured numbers with units?
- [ ] Is every item under "What to build" one concrete, checkable thing?
- [ ] Is every specification with three or more values a table?
- [ ] Does every rejected option say why?
- [ ] Is every piece of copy written out exactly?
- [ ] Is every failure and empty state described exactly?
- [ ] Does every rule say what the server does, not only the browser?
- [ ] Does Decided hold only real answers from the owner, and technical calls marked *(technical call)*?
- [ ] Does the Decided heading have the owner's handle and today's date?
- [ ] Is every Verify item measurable, with numbers that came from the owner?
- [ ] Is there a staging check in Verify?
- [ ] Is "Not in this ticket" there, with an issue number or "no issue yet" on each line?
- [ ] Are all dates absolute, and all records named by number?
- [ ] Is every fact you could not check marked *(unverified: …)*?
- [ ] Is there no empty heading?

## Common mistakes

| Mistake | Do this instead |
|---|---|
| Ticking your recommended option as the owner's decision. | Only real answers go in Decided. Unanswered ones go in Decide first. |
| Asking the owner which library to use. | That is a technical call. Decide it and mark it *(technical call)*. |
| Deciding the page size or a target time yourself. | Users notice those: they are owner questions. |
| "Show an error message." | Write the exact message in the copy table. |
| "Make it faster." | "Under 150 KB and under 3 s on a 3G phone profile" — with the owner's numbers. |
| Writing "around line 40" as fact. | Find the exact line, or mark it *(unverified: code not read)*. |
| Filing the issue because the draft looks good. | Show it and wait for "file it". |
| Inventing a label. | Use only labels from `gh label list`. |
| Saving the body file in the repository. | Use the scratch folder, and delete it after. |
