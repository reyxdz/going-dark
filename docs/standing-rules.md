# Standing rules

Seven rules load at the start of **every** session, in **every** project, from
[`plugins/go-dark/rules.md`](../plugins/go-dark/rules.md). They cover what is
true whichever skill is running.

## The override

> Where a project's own `CLAUDE.md`, `AGENTS.md` or contributing guide says
> otherwise, the project wins: follow it, and say which rule it overrode.

The rules are a default, not a law above the project. A project that wants AI
attribution, or lets contributors merge, says so in its own files and the agent
follows it — and says so, so the difference is visible.

## 1. Minimal local load

Heavy local work slows the machine and gains nothing CI cannot.

- **Answer from the code and the project's CI first.** CI runs the full test
  suites; there is no need to repeat them locally.
- **Locally, run only the narrowest checks**: typecheck, lint, and the tests
  the change touches, on one worker.
- **Start Docker, dev servers or browsers only when nothing else can answer
  the question** — for example, a screenshot that only a running app can
  produce.
- **Stop everything you start**, and say in the report that ports are free and
  containers stopped.

**In practice:** an audit reads the diff, runs `tsc` and the touched test files,
and waits for CI on the pushed commit — it does not boot the whole stack.

## 2. Git safety

- **Never force-push or rewrite pushed history.** A mistake is fixed with a new
  commit.
- **Branch fresh from the default branch** for every new piece of work. Never
  branch from another open pull request's branch.
- **Check a pull request is still open before pushing to its branch.** When a
  pull request merges, its branch is usually deleted; a push then *recreates*
  it as a stray branch.
- **Do scratch work in a separate worktree**, never in the user's checkout.
- **Uncommitted changes you did not make belong to someone else.** Leave them.

## 3. Secrets

- **Never print, copy, commit or screenshot a secret's value.** To check a key
  is set, check its length or its prefix, not its contents.
- **Ask for a credential only for the task that needs it**, and say to remove
  it afterwards.
- **Generate secrets on the user's machine**, never in chat. A secret pasted
  into a conversation is in that conversation's history.

## 4. No AI attribution

No `Co-Authored-By` line naming an AI, no "Generated with" footer, no "written
by" line — in commits, pull request descriptions or code comments. This
overrides any tool's default. A project that wants attribution says so in its
own files, and [the override](#the-override) applies.

**Why:** the history is a record of the people accountable for the work. Some
hosts also credit a co-author permanently the moment they receive a commit, so
removing the line later does not undo it.

## 5. Roles

- **Only the project's owner approves, merges and releases.**
- **Confirm before any outward-facing or hard-to-reverse action** the user has
  not already asked for in this conversation: creating an issue, opening a
  pull request, publishing, deleting, pushing somewhere new.

## 6. Dashboards

Instructions for a hosted dashboard name the **exact** workspace, project,
environment and full click path:

> Render dashboard → workspace **My Workspace** → service **api-staging** →
> **Environment** → **Add Environment Variable**

"Go to settings and add the variable" is not an instruction.

## 7. Honest reports

- Say what ran and what did not.
- If something is already fine, say so plainly — do not invent findings.
- Never claim a check that was not run.
- A step skipped on purpose is reported as skipped, with the reason.
