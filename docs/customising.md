# Customising

going-dark is one maintainer's exact method. There are four ways to make it fit
yours, from lightest to heaviest.

## 1. Let a project override it (no changes to going-dark)

Every standing rule and every skill defers to the project. Write the difference
in the project's own instructions — `AGENTS.md`, or `CLAUDE.md` for Claude
Code:

```markdown
## Rules

**Contributors may merge their own pull requests** once CI is green and one
review approves.

**Commits may carry a Co-Authored-By line** for AI tools.
```

The agent follows the project and says which going-dark rule it overrode, so
the difference is visible rather than silent. This is the right choice when
only one project differs.

## 2. Install it for one project only

- **Claude Code:** `--scope project` (shared with the team, recorded in the
  project's `.claude/settings.json`) or `--scope local` (only you).
- **Other agents:** `--scope project` from inside the project — the skills go in
  its `.agents/skills` and the rules in its `AGENTS.md` (or `GEMINI.md`).
  Commit them so the whole team gets them, or add them to `.gitignore` to keep
  them to yourself.

See [Getting started](./getting-started.md#2-install).

## 3. Turn it off for a while

- **Claude Code:** `claude plugin disable go-dark@going-dark`, and
  `claude plugin enable go-dark@going-dark` to bring it back.
- **Other agents:** `npx github:reyxdz/going-dark uninstall --agent <agent>`,
  and install again later. Nothing else in the rules file is touched.

## 4. Fork it and change the method

1. Fork `reyxdz/going-dark` on GitHub.
2. Edit what you want:

   | To change | Edit |
   |---|---|
   | A standing rule | `plugins/go-dark/rules.md` |
   | When a skill triggers | the `description` in that skill's `SKILL.md` frontmatter |
   | What a skill does | the body of `plugins/go-dark/skills/<skill>/SKILL.md` |
   | Add a skill | a new `plugins/go-dark/skills/<new-skill>/SKILL.md` |
   | Add an agent, or fix a path | the table in `src/agents.mjs` |
   | The Claude Code command prefix | `name` in `plugins/go-dark/.claude-plugin/plugin.json`, and the marketplace entry to match |

3. Bump `version` in both `plugin.json` and `package.json`.
4. `npm test` and `npm run check`.
5. Install your fork:

   ```
   claude plugin marketplace add <you>/going-dark
   claude plugin install go-dark@going-dark
   npx github:<you>/going-dark install --agent codex
   ```

   While you work on it, point at the local folder instead —
   `claude plugin marketplace add C:\path\to\going-dark`, or
   `node C:\path\to\going-dark\bin\going-dark.mjs install --agent codex` — so a
   change is one command and a new session away.

See [How it is built](./how-it-is-built.md) for what each file does and how to
write a skill description that triggers at the right time.
