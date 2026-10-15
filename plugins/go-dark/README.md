# go-dark

The going-dark method for Claude Code: one strict way to run a software
project, from the issue to the release.

| Command | Use it to |
|---|---|
| `/go-dark:project-flow` | See where a piece of work stands and what comes next, or whether it is really finished |
| `/go-dark:write-issue` | Write an issue as a specification, or check one is ready to build from |
| `/go-dark:write-handoff` | Write a handoff prompt another agent can carry out without guessing |
| `/go-dark:audit-pr` | Audit a pull request line by line: "perfectly safe to merge", or every fix down to a single typo — and make those fixes |
| `/go-dark:fix-audit` | Apply every fix an audit report lists, exactly as written, then hand back to a fresh audit |
| `/go-dark:project-context` | Set up or refresh a project's `AGENTS.md`, constraints and enforced rules |

Each skill also runs by itself when what you ask matches it.

**Standing rules.** `rules.md` is added to every session by a session-start
hook that only prints that file: minimal local load, git safety, secrets never
shown, no AI attribution, owner-only merges, exact dashboard click paths, and
honest reports. A project's own `AGENTS.md` or `CLAUDE.md` always wins where it
says otherwise.

**What it does not do.** It runs no scripts of its own, makes no network calls,
and sends no data anywhere. Its only hook prints `rules.md`.

The same method installs into Codex, Gemini CLI, GitHub Copilot and Cursor
through the installer in the repository:
<https://github.com/reyxdz/going-dark>. Full documentation:
<https://github.com/reyxdz/going-dark/tree/main/docs>.

MIT licensed.
