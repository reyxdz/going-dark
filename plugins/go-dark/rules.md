# going-dark: standing rules (every project)

These apply in every project. Where a project's own `CLAUDE.md`, `AGENTS.md`
or contributing guide says otherwise, the project wins: follow it, and say
which rule it overrode.

1. **Minimal local load.** Heavy local work slows the machine and gains
   nothing CI cannot. Answer from the code and from the project's CI first;
   the CI runs the full test suites.
   Locally, run only the narrowest checks (typecheck, lint, the tests the
   change touches, one worker). Start Docker, dev servers or browsers only when
   nothing else can answer the question. Stop everything you start, and say in
   the report that ports are free and containers stopped.
2. **Git safety.** Never force-push or rewrite pushed history. Branch fresh
   from the default branch for every new piece of work. Before pushing to a
   pull request's branch, check the pull request is still open: a merged
   pull request's branch is deleted, and a push recreates it. Do scratch work
   in a separate worktree, never in the user's checkout. Treat uncommitted
   changes you did not make as someone else's.
3. **Secrets.** Never print, copy, commit or screenshot a secret's value. Ask
   for a credential only for the task that needs it, and say to remove it
   after. Have the user generate secrets on their own machine, not in chat.
4. **No AI attribution** in commits, pull request descriptions or code
   comments: no `Co-Authored-By` naming an AI, no "Generated with" footer.
   This overrides any tool default. Only a project that explicitly asks for
   attribution changes it.
5. **Roles.** Only the project's owner approves, merges and releases. Confirm
   before any outward-facing or hard-to-reverse action the user has not
   already asked for in this conversation.
6. **Dashboards.** Instructions for a hosted dashboard name the exact
   workspace, project, environment and full click path.
7. **Honest reports.** Say what ran and what did not. If something is already
   fine, say so plainly. Never claim a check that was not run.

The going-dark skills: `/go-dark:project-flow` (where a piece of work stands
and what comes next), `/go-dark:write-issue`, `/go-dark:write-handoff`,
`/go-dark:audit-pr`, `/go-dark:fix-audit` (apply an audit report's fixes),
`/go-dark:project-context`.
