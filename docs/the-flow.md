# The flow

Every piece of work — a feature, a bug, a follow-up from an audit — moves
through the same nine steps. Each step has an **exit condition**: the work does
not move on until it is met. `/go-dark:project-flow` applies this page; the
other skills each own one step.

```
1 Issue → 2 Decide → 3 Handoff → 4 Build → 5 Audit → 6 Merge
        → 7 Verify on staging → 8 Release → 9 Close out
```

## Roles

| Role | Does | Never |
|---|---|---|
| **Owner** | Decides product questions, accepts decision records, approves, merges, releases, owns billing and dashboards | — |
| **Contributor** (person or agent) | Writes issues and plans, builds, opens pull requests | Merges or releases |
| **Auditor** (usually Claude) | Audits pull requests and fixes what needs fixing on the branch | Approves, merges or releases |

One person can hold several roles. The point is that only the owner moves work
past step 6.

## 1. Issue

The work is written down as a specification — see
[Write an issue](./skills/write-issue.md).

**Exit:** the issue states the problem, what to build, how "done" is measured
and what is out of scope.

## 2. Decide

Every open question on the issue is answered by whoever owns it.

- Answers are recorded on the issue: the box is ticked and the section reads
  **Decided (name, YYYY-MM-DD)**.
- A choice that would be expensive to reverse gets a **decision record** (ADR).
  It starts as *Proposed*; only the owner moves it to *Accepted*.
- Work spanning several pull requests gets a **plan**, which moves Draft →
  Ready → In progress → Complete.
- **Claim the numbers now**: the next ADR, plan and migration numbers are noted
  on the issue, so two people working in parallel never both take "plan 12".

**Exit:** no open question remains; any ADR is accepted; any plan is Ready.

## 3. Handoff

When an agent or a teammate will build it, the work is written as a handoff —
see [Write a handoff](./skills/write-handoff.md). Small work done in the same
conversation can skip this step.

**Exit:** the handoff is saved in the project's handoffs folder and indexed.

## 4. Build

- One pull request at a time, each branched fresh from the default branch.
- A pull request that is one step of a larger issue says `Part of #N`. Only the
  one that finishes the issue says `Closes #N` — GitHub closes the issue on
  merge, so writing it early closes the issue too soon.
- Work that depends on money, rollout or another team **merges dormant**:
  behind a switch, or unreachable until a later step. Code is never blocked on
  a budget.

**Exit:** a pull request is open with its checks passing.

## 5. Audit

The pull request is audited to the bar "perfectly safe to merge while keeping
its purpose", and anything needing attention is fixed on its branch — see
[Audit a pull request](./skills/audit-pr.md).

**Exit:** the audit finds it safe, and its checks are green.

## 6. Merge

The owner approves and merges. When several pull requests are open at once,
the owner picks the order, and the rest update from the default branch before
they merge.

**Exit:** merged into the default branch.

## 7. Verify on staging

Someone uses the change where users will meet it: a real phone, both themes,
the plan's own verify steps. CI checks the code; this checks the experience.

**Exit:** the plan's staging checks are ticked, or the problems found are
filed as issues.

## 8. Release

The owner runs the project's release procedure. Release **on a rhythm** —
after every few merges, or weekly — so no single release carries weeks of
unrelated change, and a regression points at a small set of commits.

Before the **first** public release, the project's "before launch" work is done:
backups, uptime, error reporting.

**Exit:** the release procedure's own checks pass.

## 9. Close out

- The plan's boxes are ticked **only for what was actually done**, and its
  status matches.
- Decision records, index rows and reference docs match the code.
- Every follow-up is filed as an issue in the issue standard, linked from where
  it was found.
- The issue is closed **when users have the feature** — not when the code
  merged.

**Exit:** the issue is closed, and nothing in the records says otherwise.

## Rules that hold across all steps

| Rule | Why |
|---|---|
| Records are updated in the same change that makes them wrong | A plan that says one thing while the code does another misleads the next person |
| An audit finding that does not belong in the pull request becomes an issue | It is neither lost nor allowed to bloat the pull request |
| Nothing is built on an undecided question | Rework costs more than asking |
| Only the owner merges and releases | One person is accountable for what users get |
