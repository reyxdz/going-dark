# How the plugin is built

For anyone maintaining going-dark or building something like it.

## Files

```
going-dark/                          the repository, and the marketplace
├── .claude-plugin/
│   └── marketplace.json             lists the plugins this marketplace offers
├── plugins/
│   └── go-dark/                     the plugin
│       ├── .claude-plugin/
│       │   └── plugin.json          the plugin's name, version, description
│       ├── rules.md                 the standing rules, loaded every session
│       ├── hooks/
│       │   └── hooks.json           the SessionStart hook that loads rules.md
│       └── skills/
│           ├── project-flow/SKILL.md
│           ├── write-issue/SKILL.md
│           ├── write-handoff/SKILL.md
│           ├── audit-pr/SKILL.md
│           └── project-context/SKILL.md
├── docs/                            this documentation
├── LICENSE                          MIT
└── README.md
```

## How Claude Code loads it

1. **The marketplace.** `claude plugin marketplace add reyxdz/going-dark`
   registers the repository as a source. Claude Code reads
   `.claude-plugin/marketplace.json`, whose `name` (`going-dark`) is the part
   after `@` in `go-dark@going-dark`, and whose `plugins[].source`
   (`./plugins/go-dark`) says where the plugin lives.
2. **The plugin.** `claude plugin install go-dark@going-dark` copies the plugin
   into Claude Code's plugin cache and enables it. Its `plugin.json` `name`
   (`go-dark`) becomes the prefix of every command.
3. **The skills.** Each folder under `skills/` is one skill. Its folder name
   becomes the command after the colon: `skills/audit-pr/` →
   `/go-dark:audit-pr`. At the start of a session, only each skill's
   `name` and `description` are loaded (a few dozen tokens each). The body
   loads only when the skill runs — when you type its command, or when Claude
   decides your request matches its description.
4. **The hook.** `hooks/hooks.json` registers a `SessionStart` hook that runs on
   `startup`, `clear` and `compact`:

   ```json
   { "type": "command", "command": "cat \"${CLAUDE_PLUGIN_ROOT}/rules.md\"", "shell": "bash" }
   ```

   Text a SessionStart hook prints is added to the session's context, so the
   standing rules are in force from the first message — and again after a
   context compaction. `${CLAUDE_PLUGIN_ROOT}` is set by Claude Code to the
   installed plugin's folder.

## Cost

`claude plugin details go-dark` estimates it:

| Part | When | Roughly |
|---|---|---|
| Skill names and descriptions | Every session | ~360 tokens |
| Standing rules | Every session (hook output) | ~450 tokens |
| One skill's body | Only when it runs | 0.8k–1.3k tokens |

## Writing a skill description

The `description` in a `SKILL.md` frontmatter decides **when** Claude loads the
skill. Two rules keep it working:

- **Say when to use it, not what it does.** Start with "Use when…" and list the
  situations and phrases that should trigger it.
- **Never summarise the steps.** A description that summarises the process
  invites Claude to follow the summary and skip the skill's body.

```yaml
# Good — triggers only
description: Use when asked to audit, review or check a pull request, or whether it is safe to merge.

# Bad — a summary Claude may follow instead of reading the skill
description: Merges main, reads the diff, fixes problems and reports a verdict.
```

## Releasing a change

1. Edit the files.
2. Bump `version` in `plugins/go-dark/.claude-plugin/plugin.json` — semantic
   versioning: patch for wording, minor for a new skill or rule, major for a
   change in how an existing skill behaves.
3. Validate:

   ```
   claude plugin validate .
   claude plugin validate plugins/go-dark
   ```

4. Commit with a message that says what changed and why, and push to `main`.
5. Users get it with `claude plugin marketplace update going-dark` and a
   restart.
6. Optionally tag the release: `claude plugin tag plugins/go-dark` creates a
   `go-dark--v<version>` tag after checking the manifest and the marketplace
   entry agree.

## Design decisions

| Decision | Why |
|---|---|
| Standing rules in a hook, not in a skill | A skill loads only when triggered; these rules must hold in every session |
| The project always wins | A method imposed over a project's own rules would be resisted or ignored; deferring, visibly, keeps both |
| Skills read the project before applying the method | The same skill works in a project with rich conventions and in one with none |
| No scripts, servers or dependencies | Nothing to install, nothing running in the background, nothing to break across operating systems |
| One plugin, not five | One install, one version, one place to change the method |
