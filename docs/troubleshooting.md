# Troubleshooting and FAQ

## Claude Code: the `/go-dark:` commands don't appear

1. **Restart Claude Code.** Skills load when a session starts.
2. `claude plugin list` should show `go-dark@going-dark` as **enabled**. If it
   says disabled: `claude plugin enable go-dark@going-dark`.
3. Check the scope. Installed with `--scope project` or `--scope local`, it
   appears only in that project.
4. `claude plugin details go-dark` should list 7 skills.

## Other agents: the skills aren't used

1. **Start a new session.** Agents read skills and rules when a session starts.
2. Run `npx github:reyxdz/going-dark agents` and check the folder your agent
   reads holds the seven `go-dark-*` folders.
3. Check the rules file holds the `<!-- going-dark:start` block. That block
   lists every skill and its file, so even if your agent does not load skills
   natively, it can find them — ask it to *"use the go-dark-audit-pr skill"*.
4. If your agent reads neither `.agents/skills` nor `AGENTS.md`, use
   `--agent agents --scope project` and point the agent at `AGENTS.md` in its
   own settings.

## The installer says a folder "was not made by going-dark"

A skill folder of the same name already exists and has no `.going-dark` marker,
so it may be someone else's. The installer stopped without changing anything.
Move that folder aside and run the installer again.

## The standing rules do not load

**Claude Code** loads them through a session-start hook that prints
`rules.md`. It runs in bash, or in PowerShell on Windows when Git Bash is not
installed, so no extra install is needed.

1. `claude plugin details go-dark` should list `Hooks (1) SessionStart`.
2. Make sure you are on going-dark 0.3.0 or later
   (`claude plugin list`): 0.2.0 and earlier forced bash, which fails on
   Windows without Git Bash.

**Other agents** load them from the rules file: check the `going-dark:start`
block is in the file your agent reads (`npx github:reyxdz/going-dark agents`
shows which).

Then ask, in a new session: *"Which going-dark standing rules are you
following?"*

## A skill runs when I didn't want it

Agents choose a skill when your request matches its description. Say what you
want instead — "just answer, don't audit". If it keeps happening in one
project, install going-dark only where you want it (`--scope project`) rather
than for every project. To change *when* a skill triggers, see
[Customising](./customising.md#4-fork-it-and-change-the-method).

## A project's rules disagree with going-dark

That is expected and handled: **the project wins**, and the agent says which
going-dark rule it overrode. If the agent follows going-dark instead, make the
project's rule explicit in its `AGENTS.md` or `CLAUDE.md`.

## An update didn't take effect

- **Claude Code:** `claude plugin marketplace update going-dark`, restart, and
  check `claude plugin list` shows the new version.
- **Other agents:** run the install command again; the `going-dark:start` line
  in the rules file shows the installed version.

## FAQ

**Does it send anything anywhere?**
No. The installer copies files and makes no network calls of its own; `npx`
fetches it from GitHub. The skills use the tools you already have — `git`,
`gh` — only when a task needs them, and the standing rules require asking
before anything outward-facing.

**Does it change my projects?**
Only when you ask. The installer writes only the files listed in
[Getting started](./getting-started.md#2-install), and only inside its marked
block in a rules file. The project-context skill proposes files and shows them
before committing.

**Does it work without GitHub?**
The flow and the standards do. The parts that read or edit issues and pull
requests use the GitHub CLI; on another host, the agent uses that host's tools
or asks you to do that step.

**Why "no AI attribution"?**
The commit history records the people accountable for the work. A project that
wants attribution can override it — see
[Standing rules](./standing-rules.md#4-no-ai-attribution).

**Can I use only one skill?**
Yes. Each skill works on its own; [the flow](./the-flow.md) only connects them.
To remove the rest, fork it and delete the skill folders you don't want.
