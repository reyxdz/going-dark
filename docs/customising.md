# Customising

going-dark is one maintainer's exact method. There are four ways to make it fit
yours, from lightest to heaviest.

## 1. Let a project override it (no changes to going-dark)

Every standing rule and every skill defers to the project. Write the difference
in the project's own `CLAUDE.md`:

```markdown
## Rules

**Contributors may merge their own pull requests** once CI is green and one
review approves.

**Commits may carry a Co-Authored-By line** for AI tools.
```

Claude follows the project and says which going-dark rule it overrode, so the
difference is visible rather than silent. This is the right choice when only
one project differs.

## 2. Install it for one project only

Install with `--scope project` (shared with the team, recorded in the
project's `.claude/settings.json`) or `--scope local` (only you, not
committed), instead of for every project. See
[Getting started](./getting-started.md#2-install).

## 3. Turn it off for a while

```
claude plugin disable go-dark@going-dark
```

The skills and the standing rules stop loading in new sessions until you run
`claude plugin enable go-dark@going-dark`.

## 4. Fork it and change the method

1. Fork `reyxdz/going-dark` on GitHub, or copy the folder.
2. Edit what you want:

   | To change | Edit |
   |---|---|
   | A standing rule | `plugins/go-dark/rules.md` |
   | When a skill triggers | the `description` in that skill's `SKILL.md` frontmatter |
   | What a skill does | the body of `plugins/go-dark/skills/<skill>/SKILL.md` |
   | The command prefix | `name` in `plugins/go-dark/.claude-plugin/plugin.json` (and the folder and marketplace entry to match) |
   | Add a skill | a new `plugins/go-dark/skills/<new-skill>/SKILL.md` |

3. Bump `version` in `plugins/go-dark/.claude-plugin/plugin.json`.
4. Check it: `claude plugin validate .` and
   `claude plugin validate plugins/go-dark`.
5. Install your fork instead:

   ```
   claude plugin marketplace add <you>/going-dark
   claude plugin install go-dark@going-dark
   ```

   Or, while you work on it, add the **local folder** as the marketplace —
   `claude plugin marketplace add C:\path\to\going-dark` — so a change is one
   `claude plugin marketplace update going-dark` and a restart away.

See [How the plugin is built](./how-it-is-built.md) for what each file does
and how to write a skill description that triggers at the right time.
