# Troubleshooting and FAQ

## The `/go-dark:` commands don't appear

1. **Restart Claude Code.** Skills load when a session starts.
2. Check it is installed and enabled: `claude plugin list` should show
   `go-dark@going-dark` as **enabled**. If it says disabled:
   `claude plugin enable go-dark@going-dark`.
3. Check the scope. Installed with `--scope project` or `--scope local`, it
   appears only in that project.
4. Check its contents: `claude plugin details go-dark` should list 5 skills.

## The standing rules do not load

The rules load through a hook that runs in **bash**.

1. Run `bash --version`. On Windows, install Git for Windows if bash is
   missing, then restart Claude Code.
2. Check the hook is registered: `claude plugin details go-dark` lists
   `Hooks (1) SessionStart`.
3. Ask Claude, in a new session: *"Which going-dark standing rules are you
   following?"* If it cannot say, the hook did not run — check the two steps
   above and that the plugin is enabled.

## A skill runs when I didn't want it

Claude chooses a skill when your request matches its description. Say what you
want instead — "just answer, don't audit". If it keeps happening in one
project, install going-dark only where you want it (`--scope project` or
`--scope local`) rather than for every project. To change *when* a skill
triggers, see [Customising](./customising.md#4-fork-it-and-change-the-method).

## A project's rules disagree with going-dark

That is expected and handled: **the project wins**, and Claude says which
going-dark rule it overrode. If Claude follows going-dark instead, make the
project's rule explicit in its `CLAUDE.md`.

## An update didn't take effect

1. `claude plugin marketplace update going-dark`
2. Restart Claude Code.
3. `claude plugin list` should show the new version.

## FAQ

**Does it send anything anywhere?**
No. It has no scripts, servers or network calls of its own. The skills use the
tools you already have — `git`, `gh` — only when a task needs them, and the
standing rules require asking before anything outward-facing.

**Does it change my projects?**
Only when you ask. `/go-dark:project-context` proposes files and shows them
before committing; the other skills create issues, push fixes or open pull
requests only as part of what you asked for, after the checks in
[Standing rules](./standing-rules.md#5-roles).

**Does it work without GitHub?**
The flow and the standards do. The parts that read or edit issues and pull
requests use the GitHub CLI; on another host, Claude falls back to that host's
tools or asks you to do that step.

**Why "no AI attribution"?**
The commit history records the people accountable for the work. A project that
wants attribution can override it — see [Standing rules](./standing-rules.md#4-no-ai-attribution).

**Can I use only one skill?**
Yes. Each skill works on its own; [the flow](./the-flow.md) only connects them.
To remove the rest, fork it and delete the skill folders you don't want.
