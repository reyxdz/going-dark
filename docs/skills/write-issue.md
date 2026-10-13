# `/go-dark:write-issue`

> **Claude Code:** `/go-dark:write-issue` · **Other agents:** the `go-dark-write-issue` skill — ask for it by what you want, or by name.

Writes an issue as a **specification**: someone who never saw the conversation
can plan or build from it without guessing.

## When it runs

- `/go-dark:write-issue`, after describing what you want.
- "Write an issue for this", "turn this bug into an issue", "file that as a
  follow-up".
- "Is #12 ready to build?" — it checks an existing issue against the standard.

## What it does

1. **Reads the project**: `AGENTS.md` or `CLAUDE.md`, its constraints and decision records,
   its issue templates, and two or three recent issues — to match labels and
   voice.
2. **Collects facts from the code**, not memory: the file and line of a bug,
   real numbers (sizes, timings, counts), the decision records that apply.
3. **Asks you the product questions** only you can answer, two to four options
   each, recommended option first.
4. **Drafts the issue** in the order below.
5. **Shows you the draft and asks before creating it**: creating an issue is
   outward-facing.
6. Creates it with `gh issue create --title … --body-file … --label …`.

## The standard

### Title

A plain sentence naming the **outcome** and its **key constraint**.

| Kind | Good | Not |
|---|---|---|
| Feature | Let people attach photos, audio, video and documents in messages, with a size limit per media type | Attachments |
| Bug | The landing page search does nothing — make search work | Search broken |
| Technical | Load a lazy page's text with the page, not on every first visit | Refactor i18n |

### Body sections, in order

Use the ones that apply; never leave one empty.

| # | Section | Holds |
|---|---|---|
| 1 | **Summary** | The real problem: who tries what, what happens, why it matters. A bug names the file and line; a technical issue gives numbers |
| 2 | **Why it happens** | Technical issues only: the root cause, citing the decision record behind it |
| 3 | **What to build** | Checkboxes grouped by layer (Data, Enforcement, UI, Housekeeping); each concrete and testable; specifications as tables; rejected options with their reason |
| 4 | **Decide first** → **Decided (name, YYYY-MM-DD)** | Open questions as unticked boxes; once settled, the heading changes and each box is ticked with its answer |
| 5 | **Verify / Done when** | Measurable acceptance: exact numbers, exact behaviour, named tests, a check on staging |
| 6 | **Not in this ticket** | What is out of scope, and which issue covers it |
| 7 | **Docs** | Which reference documents must change |
| 8 | **Notes** | Where it came from ("raised in #41's audit"), timing |
| 9 | **How to ship** | A pull request into the default branch through its template, checks passing, link to the guide |

### What every issue respects

- **The project's real limits**, named and linked: users' devices and data
  costs, hosting memory, privacy law, schedulers that run late.
- **Rules enforced by the server and storage**, never only the browser.
- **Failure designed for**: "decided when the file is read, whatever any job
  has done"; a designed empty state, never a bare "no results".
- **Exact copy** for anything people will read: "This video expired on 12 Nov
  2026", not "show an expiry message".
- **Absolute dates**, and decision records, guides and issues **linked by
  number**.

## Template

```markdown
## Summary

<Who tries to do what, what happens instead, and why it matters. For a bug:
the file and line. For a technical issue: the numbers.>

## What to build

**Data.**
- [ ] <table / column / migration, additive>

**Enforcement: server and storage, not the browser.**
- [ ] <the check, and the error it returns>

**UI.**
- [ ] <the screen, the states, the exact copy>

| <Spec> | <Value> | <Why> |
|---|---|---|

## Decide first

- [ ] <Question only the owner can answer> — options: <A> / <B>

## Verify

- [ ] Tests: <named cases, including the unhappy paths>
- [ ] On staging: <what someone does, and what they see>

## Not in this ticket

<Out of scope> — that is #<n>.

## Docs

<Reference documents to update.>

## How to ship

Through a pull request into `main`, using the template, with its checks
passing. See <link to the contributing guide>.
```

## Checking an existing issue

Asked "is #12 ready?", it reports against each section: what is missing, which
questions are still open, and whether "done" is measurable. It does not edit
the issue unless you ask.
