# `/go-dark:project-context`

Sets up — or refreshes — everything an agent must **know**, **understand** and
**never do** in a project, so every session starts from the same ground.

## When it runs

- `/go-dark:project-context` in a project for the first time.
- A project has no `CLAUDE.md`, or its rules are out of date.
- "Set this project up for Claude", "what are the do's and don'ts here?",
  "refresh the project rules".

## The three layers

| Layer | Holds | Lives in |
|---|---|---|
| **Know** | What to read first; the do's and don'ts, each with its reason; one real file to imitate per kind of work | `CLAUDE.md` at the repository root — Claude Code reads it at the start of every session |
| **Why** | The realities that make general instinct wrong here; the decisions already made; how work is done | `docs/` — constraints, decision records, plans, guides |
| **Never** | Rules too important to depend on being remembered | Git hooks, CI checks, `.claude/settings.json` hooks and permissions |

Each layer points to the next instead of copying it, so `CLAUDE.md` stays short
enough to read every time.

## Setting a project up

1. **Read the repository**, without running anything heavy: the README,
   package files and scripts, CI workflows, existing docs, the last 30
   commits, open issues and pull requests.
2. **Ask what the code cannot show**: who decides and who merges; the
   real-world limits (users, devices, budget, hosting, law); what must never
   happen; where staging and production live.
3. **Write `CLAUDE.md`** (template below).
4. **Write `docs/explanation/constraints.md`**: the few realities that look
   wrong by general instinct and are right here (template below).
5. **Start a decision log** — `docs/decisions/`, numbered, with an index — if
   there is none, and record the choices that would be expensive to reverse.
6. **Enforce the critical don'ts**: a commit hook for attribution or secrets;
   CI checks for the PR template, docs and size budgets — whatever applies.
7. **Show you every file before committing**, and land them through the
   project's normal pull request flow.

## Refreshing a project

It compares each claim in `CLAUDE.md` and the constraints with the code and the
recent history, reports what is stale, missing or contradicted, and fixes it in
one pull request. Anything the repository should not hold — personal
preferences, dashboard paths — goes to Claude's memory instead.

## `CLAUDE.md` template

```markdown
# Working in this repository

## Start here — what to load before you work

Do not load the whole `docs/` tree. More context is not better context.

### Always
1. This file.
2. `docs/explanation/constraints.md` — why some decisions here look wrong by
   general instinct and are right.
3. Your plan or issue.

### Then, by what you are touching
- **Backend:** <guide links>
- **Frontend:** <design system link>

### Copy an existing file's shape
| Writing | Imitate |
|---|---|
| A route | `<path>` |
| A table | `<path>` |
| A component | `<path>` |

## Rules

**<Rule>.** <One-line reason.>
**Never commit a secret.** <Where secrets live instead.>
**Verify before reporting done.** Run `<typecheck>`, `<lint>`, `<test>`.
**Release only when <owner> asks**, by `<release guide>`.
```

## Constraints template

```markdown
# Constraints

The realities this project is built for. Several decisions follow from them
that look wrong by general instinct — and are right here.

## 1. <Reality, stated as a fact>

<The evidence: numbers, users, hardware, law, budget.>

**So:** <the decisions it forces, and the instinct it overrides.>
```

## What never goes into the repository

Personal instruction files, private policies, and anything naming another
client's project. Those belong in the user's own configuration.
