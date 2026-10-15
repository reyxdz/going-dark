# Changelog

Every release, newest first. Versions follow semantic versioning: a patch for
wording, a minor version for a new skill, rule or agent, a major version for a
change in how an existing skill or the installer behaves.

## 0.7.0 — 2026-10-15

**New skill: `/go-dark:fix`**

- Fixes findings from anyone or anything — a developer, a tester, review
  comments on a pull request, an issue, another skill or a tool. A report from
  `/go-dark:audit-pr` goes to `/go-dark:fix-audit` instead.
- Checks every finding against the code before changing anything. Each one
  ends Confirmed, Not a problem (with the evidence), Needs the owner, or
  Cannot check — a wrong finding is never "fixed" anyway.
- Traces a bug from where it shows to every place one step does not fit the
  next, proves it with a failing test, and fixes every copy of the same
  mistake in the feature.
- "Which one is right?" is settled by the specification — the issue, its
  plan, decision records, the project's rules — or by the owner. Vague
  findings, product decisions, new text for users and values nobody gave go
  to the owner as questions, each option with its exact change.
- Fixes only what was found: anything else it notices is listed, not changed.
  Every behaviour fix gets a failing test first and its own commit, it works
  in a scratch copy, and it points to a fresh audit before merging.
- Tested with Claude Haiku in a practice repository on seven developer
  findings, including a false one, a vague one and a product decision: it
  found both causes of "the form never works", proved the false finding wrong
  with the exact lines, asked before every decision, and changed nothing
  else.

## 0.6.0 — 2026-10-15

**New skill: `/go-dark:fix-audit`**

- Applies every fix an `audit-pr` report lists, exactly as written: it finds
  each line's current text before changing it, and an item it cannot find is
  "Already fixed" or "Could not apply" — never a guess. Nothing the report
  does not name is changed.
- Asks the owner the report's questions, copied exactly; when an answer says
  what but not where, it proposes one exact change and asks once more. It
  never picks an answer for the owner.
- Behaviour fixes get their failing test first and their own commit, named
  for the audit item; text, tidy and test fixes share one commit. It works in
  a scratch copy, pushes without force, and leaves the owner's folder as it
  was.
- It never calls its own work safe: it hands back to a fresh
  `/go-dark:audit-pr` for the verdict.
- Tested for real with Claude Haiku in a practice repository: all 25 items of
  an audit report applied exactly, against a baseline that made one commit
  and added fixes nobody asked for.

**`audit-pr`**

- Every option of every question in a report now states its exact change, so
  the answer can be applied without guessing.
- A report-only audit ends by pointing to `/go-dark:fix-audit`.

## 0.5.1 — 2026-10-15

**`project-context` never touches your own folder, and Refresh follows every
wrong claim**

Found by running the skill for real (in Cursor, on a live project) and
auditing the pull request it opened.

- Every file is written in a separate work copy (a git worktree on a new
  branch). Your folder's branch and files are never changed, and the skill
  checks at the end that they are exactly as they were. Before, landing the
  change switched your folder to a new branch.
- Refresh asks which AI agents the team uses, and checks each one reads a
  file that holds the instructions — Codex, Copilot and Cursor read
  `AGENTS.md`, not `CLAUDE.md`.
- Refresh follows every stale or contradicted claim through the repository:
  each file that repeats it gets its own row in the table you approve, and a
  file with no approved row is never changed. It now also asks for a second
  yes after showing the changes.
- Enforcement reuses what the project already has — an existing hook, the
  exact files an existing check rejects, an existing setup script — instead
  of adding duplicates. The template `.env` hook now allows only
  `.env.example`.
- Sharper definitions of Stale, Contradicted and Missing, and one-file test
  commands built from the project's own test script.

## 0.5.0 — 2026-10-15

**`audit-pr` finds everything, down to a single typo**

- Two verdicts only: **PERFECTLY SAFE to merge into `<branch>`**, or **NOT
  SAFE TO MERGE YET — `<count>` fixes needed**, followed by every fix.
  Nothing is "not worth holding" any more: a typo blocks "perfectly safe"
  like any other fix.
- A new step reads every changed line, the title, the description, every
  commit message and every new file name word by word, against sixteen fixed
  questions (spelling, repeated and confused words, spacing, capitalisation,
  exact copy, grammar, the same number and name everywhere, references,
  leftovers, unused code, whitespace). A coverage table proves no line was
  skipped.
- Every finding is proved before it is reported: found again with
  `git grep -n` (which also gives its line number), tied to a named rule, and
  given an exact fix. Preferences and hedges ("consider", "might") are
  deleted, so a clean pull request is called clean.
- Things the auditor could not check block the verdict unless CI or the
  staging step covers them — and the auditor must try them itself first.
- Each fix is reported with its severity, file and line, the exact current
  text and the exact new text.
- Commit-message typos are fixed at squash-merge, never by force-pushing.
- Branches and uncommitted work can be audited the same way.
- Tested with Claude Haiku on a pull request with 19 planted problems (all
  found) and on a clean one (called perfectly safe, nothing invented).

## 0.4.0 — 2026-10-14

**Every skill rewritten for the least capable agent**

- Each skill now has the same parts: how to follow it, a glossary of every
  term that could be misread, numbered steps with **Do**, **Check** and
  **If not**, exact commands, "first rule that matches" tables instead of
  judgement calls, exact output templates, a yes/no checklist before sending,
  and a table of common mistakes.
- One rule everywhere for what cannot be checked: never guess, mark it, carry
  on, and report it.
- One question format for every agent, not only Claude Code, with what to do
  when the owner is away.
- `project-flow`: four statuses (Done, Not done, Not needed, Unconfirmed)
  with a rule for each step, the exact commands to find the release, and a
  fixed report.
- `write-issue`: a table separating owner questions from technical calls;
  copy and target numbers always come from the owner.
- `write-handoff`: an eleven-point search for what a "fully decided" issue
  leaves open; a full handoff template with the parts the builder copies word
  for word; READY only with no marker left.
- `audit-pr`: three modes (fix, report-only, follow-up), a checklist A–L,
  a severity order, a definition of "small", known problems with their usual
  fixes, and exact scratch-copy and push commands.
- `project-context`: the eight questions to ask, the exact `AGENTS.md`,
  constraints and decision-record templates, ready-made hooks, a CI job and
  agent settings, and a Refresh procedure.
- Tested with Claude Haiku over three rounds, on the original and on new
  scenarios.

## 0.3.0 — 2026-10-14

**Skills, after testing each one with fresh agents on realistic tasks**

- `project-flow`: reports the first open step and every remaining one with its
  owner; separates "unconfirmed" from "not done"; compares merged pull requests
  with the plan's phases; gives a default release rhythm.
- `write-issue`: asks the owner only product, cost and risk questions and
  records technical calls as such; "Decide first" only for deferred questions;
  says what to write when context, staging or a covering issue is missing.
- `write-handoff`: finds the gaps in an issue called "fully decided"; asks how
  many pull requests; writes a marked **Draft — blocked** handoff instead of an
  unverified one; Draft status in the index.
- `audit-pr`: an audit includes its fixes; checks the other open pull requests
  for number collisions; behaviour fixes get failing-first tests, doc fixes do
  not; the report lists every blocker, the owner's questions, what was not
  verified, and CI after the fixes.
- `project-context`: asks which agents the team uses and which rules to
  enforce; drafts with placeholders when the owner is away; hooks come with an
  install step and a CI mirror; adds a pull request template and agent
  settings.

**Agents**

- GitHub Copilot: standing rules at user level, in
  `~/.copilot/copilot-instructions.md`.
- Cursor: skills at user level, in `~/.agents/skills`.
- Every path now comes from the vendor's official documentation.

**Claude Code**

- The standing rules load on Windows without Git Bash: the hook no longer
  forces bash, so Claude Code uses PowerShell there. `rules.md` is plain ASCII
  so every shell prints it unchanged.
- The plugin folder has its own README, a licence and links, for the plugin
  directory.

**Repository**

- `going-dark check` enforces the Agent Skills name and description limits, a
  plain-ASCII `rules.md`, and no forced bash in the hook.
- CI runs on Linux, Windows and macOS.
- going-dark follows its own method: `AGENTS.md`, issue and pull request
  templates, and this changelog.

## 0.2.0 — 2026-10-14

- Works with any AI agent: an installer (`npx github:reyxdz/going-dark install
  --agent <agent>`) for Codex, Gemini CLI, GitHub Copilot, Cursor and any agent
  that reads `AGENTS.md`.
- `going-dark check`, tests, and CI.
- Skills worded for every agent; `AGENTS.md` as the shared instructions file.

## 0.1.0 — 2026-10-14

- First release: the Claude Code plugin with five skills and the standing
  rules, and the documentation.
