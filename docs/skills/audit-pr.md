# `/go-dark:audit-pr`

> **Claude Code:** `/go-dark:audit-pr` · **Other agents:** the `go-dark-audit-pr` skill — ask for it by what you want, or by name.

## When it runs

- `/go-dark:audit-pr 42` or `/go-dark:audit-pr <url>`.
- "Audit this", "is this perfectly safe to merge?", "check this PR", "find
  every problem, even typos", "fix that and make it safe".
- "Audit this branch" or "audit my uncommitted changes" — the same audit,
  without a pull request.
- "Is this completely finished?" — the stricter variant, described below.

## What it does

There are only two verdicts: **PERFECTLY SAFE to merge into `<branch>`**, or
**NOT SAFE TO MERGE YET — `<count>` fixes needed**, followed by every fix.
Nothing is too small: a single typo is a fix, and it blocks "perfectly safe".
Nothing is invented: every finding quotes the exact text and the rule it
breaks, and "I would write it differently" is never reported. A clean pull
request is called clean.

**An audit includes its fixes:** asking for an audit is asking for every fix
to be pushed to the pull request's branch, unless you ask for a report only.

1. **Read the pull request and its context** — the pull request, every commit
   message, the project's rule files (including style rules and whether it
   squash-merges), its pull request check, and the linked issue and plan. The
   issue and plan are the specification; the description is only a claim to
   check. It then picks one mode:
   - **Fix mode** (the default): fixes go on the pull request's branch.
   - **Report-only mode**: when you ask for a report or verdict only, the pull
     request comes from a fork, or it cannot push. It changes nothing.
   - **Follow-up mode**: the pull request is already merged. Fixes go in a
     new pull request.
   - A closed (unmerged) pull request stops the skill, and it asks you.
2. **Check the state, and the other open pull requests** — CI status, how far
   behind the base branch it is, and whether another open pull request
   changes the same files or claims the same migration, decision or plan
   number.
3. **Make a scratch copy and trial-merge the base branch** — in a separate
   git worktree, never your own folder.
4. **Check what the change means** — letters A to L: A Purpose, B Security
   and privacy, C Data, D Deployment skew and connections, E Concurrency and
   failure, F Tests, G User interface, H Records, I Description, J Scope,
   K Numbers, L Attribution. There is a table of known problems and their
   usual fixes.
5. **Read every changed line** — letters M (text) and N (tidiness). Every
   added line, the title, the description, every commit message and every new
   file name is read word by word against sixteen fixed questions: spelling,
   repeated words, confused words (its/it's), spacing, pairs of quotes and
   brackets, capitalisation, exact copy, grammar, the same number everywhere,
   the same name everywhere, references that exist, debug leftovers, unused
   code, commented-out code, the file's own style, and whitespace. A coverage
   table proves every line was read.
6. **Run the narrow checks** — typecheck, lint and only the tests for the
   changed files. It does not run the full suite, and does not start a
   database, server, Docker or browser unless one is already running or
   nothing else can answer a finding.
7. **Prove every finding, then decide** — each finding must be really there
   (found again with `git grep -n`, which also gives its line number), break a
   rule it can name, and have an exact fix. Anything else is deleted. Each
   finding becomes a fix or a question for the owner. Things it could not
   check block the verdict unless CI already covers them or the staging step
   after merging does. The fix list is sorted by severity:
   1. breaks the deploy or loses data;
   2. security or privacy;
   3. broken for users;
   4. a promise not kept;
   5. tests wrong or missing, or unrelated changes;
   6. accessibility and interface;
   7. records and description;
   8. text and tidiness.
8. **Fix** — in Fix mode: confirm the pull request is still open, bring the
   branch up to date, then fix every finding, typos included. A behaviour fix
   first gets a test that fails, then the fix, then the test passes. Text and
   tidy fixes need no test. A typo in a commit message is never fixed by
   force-pushing: in a squash-merge project, it gives you the corrected squash
   message. It pushes normally and watches CI.
9. **Clean up** — stops anything it started and removes the scratch copy.
10. **Report** — fills in a fixed template.

**"Is it completely finished?"** adds four checks: the plan records the
change, the docs record any new state or rule, the plan's later phases still
work, and follow-up work has its own issues.

## What you get

A report that starts with the verdict. If it is not perfectly safe, every
fix follows, numbered, each with its severity, file and line, the exact
current text and the exact new text. Then: what it found and fixed (Fix
mode), questions only you can answer, a table of all fourteen checks, the
line coverage table, what it could not verify and why that does not block,
CI, and the local load. For example:

```markdown
**NOT SAFE TO MERGE YET — 2 fixes needed before merging into `main`.**

### Fixes needed

1. **[3. Broken for users] (D)** `backend/src/routes/contact.ts:11` — the server expects `messsage`, the form sends `message`, so every real submission fails.
   Now: `messsage: z.string().min(1).max(500),`
   Change to: `message: z.string().min(1).max(500),`
2. **[8. Text and tidiness] (M1)** `frontend/src/features/help/ContactForm.tsx:29` — "bussiness" is misspelled.
   Now: `2 bussiness days`
   Change to: `2 business days`
```

## What it never does

- Never leaves a finding out for being small, and never calls a pull request
  perfectly safe while any fix, question or blocking check remains.
- Never invents a finding, hedges ("consider", "might"), or reports a
  preference.
- Never merges, approves or closes the pull request. Only the owner merges.
- Never force-pushes, and never pushes to a merged pull request's branch.
- Never runs the full test suite, or starts a database, server, Docker or
  browser "to be sure".
- Never adds AI attribution to a commit, and never works in your own folder.

## Exact templates and wording

Every template, command and checklist is in [the skill itself](../../plugins/go-dark/skills/audit-pr/SKILL.md).
