## What and why

<!-- One paragraph: the problem, and why this is the fix. -->

Issue: <!-- "Closes #N" if this finishes it, "Part of #N" if it is one step -->

## What changed

- **Skills or rules:** <!-- which, and how; or "none" -->
- **Installer:** <!-- what it now writes or checks; or "none" -->
- **Docs:** <!-- which pages; or "none" -->

## How to verify

1. `npm test`
2. `npm run check`
3. <!-- anything specific: an agent and scope to install for, what to look at -->

## Checklist

- [ ] One change; no unrelated edits
- [ ] `npm test` and `npm run check` pass locally
- [ ] A behaviour change has a test that fails without it
- [ ] Skills and their docs pages say the same thing
- [ ] `plugin.json` and `package.json` versions match, and `CHANGELOG.md` has an entry
- [ ] No AI attribution in commits or this description
