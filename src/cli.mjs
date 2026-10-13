import { AGENTS, SCOPES, defaultScope, resolvePath } from './agents.mjs';
import { check } from './check.mjs';
import { install, uninstall } from './install.mjs';

const HELP = `going-dark — install the going-dark method into any AI coding agent

Usage
  going-dark install   --agent <agent> [--scope user|project] [--project <dir>] [--dry-run]
  going-dark uninstall --agent <agent> [--scope user|project] [--project <dir>] [--dry-run]
  going-dark agents    where each agent reads skills and rules
  going-dark check     validate this repository (manifests, skills, documentation links)

Agents
${Object.entries(AGENTS)
  .map(([id, agent]) => `  ${id.padEnd(9)} ${agent.label}`)
  .join('\n')}

  --scope user      every project on this machine (the default where the agent supports it)
  --scope project   only the project in --project (default: the current folder)
  --dry-run         show what would change, change nothing

Run it without installing anything:
  npx github:reyxdz/going-dark install --agent codex
`;

function parse(argv) {
  const [command, ...rest] = argv;
  const options = { command, dryRun: false, project: process.cwd() };
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--help' || arg === '-h') options.command = 'help';
    else if (['--agent', '--scope', '--project'].includes(arg)) {
      const value = rest[i + 1];
      if (!value || value.startsWith('--')) throw new Error(`${arg} needs a value`);
      options[arg.slice(2)] = value;
      i += 1;
    } else throw new Error(`Unknown option ${arg}. Run going-dark help.`);
  }
  return options;
}

function report({ done, notes = [], manual }, dryRun) {
  if (manual.length) {
    console.log('Claude Code installs going-dark through its plugin system. Run:\n');
    for (const line of manual) console.log(`  ${line}`);
    console.log('\nThen restart Claude Code.');
    return;
  }
  console.log(dryRun ? 'Would change:' : 'Changed:');
  for (const line of done) console.log(`  ${line}`);
  for (const note of notes) console.log(`\nNote: ${note}`);
  if (!dryRun) console.log('\nRestart the agent, or start a new session, to pick the changes up.');
}

/** Runs one command; returns the process exit code. */
export function main(argv, root) {
  let options;
  try {
    options = parse(argv);
  } catch (error) {
    console.error(error.message);
    return 2;
  }

  switch (options.command) {
    case 'install':
    case 'uninstall': {
      if (!options.agent) {
        console.error(`--agent is required. Choose one of: ${Object.keys(AGENTS).join(', ')}.`);
        return 2;
      }
      if (!AGENTS[options.agent]) {
        console.error(`Unknown agent "${options.agent}". Choose one of: ${Object.keys(AGENTS).join(', ')}.`);
        return 2;
      }
      const scope = options.scope ?? defaultScope(options.agent);
      if (!SCOPES.includes(scope)) {
        console.error(`--scope must be one of: ${SCOPES.join(', ')}.`);
        return 2;
      }
      try {
        const run = options.command === 'install' ? install : uninstall;
        const result = run({ root, agent: options.agent, scope, project: options.project, dryRun: options.dryRun });
        report(result, options.dryRun);
        return 0;
      } catch (error) {
        console.error(error.message);
        return 1;
      }
    }
    case 'agents': {
      for (const [id, agent] of Object.entries(AGENTS)) {
        console.log(`${id} — ${agent.label}`);
        if (agent.plugin) {
          console.log('  installs as a plugin: /go-dark:<skill> commands and a session-start hook\n');
          continue;
        }
        for (const scope of SCOPES) {
          const skills = agent.skills[scope];
          const rules = agent.rules[scope];
          if (!skills && !rules) continue;
          console.log(`  ${scope}: skills ${skills ? resolvePath(skills, options.project) : '—'}`);
          console.log(`  ${' '.repeat(scope.length)}  rules  ${rules ? resolvePath(rules, options.project) : '—'}`);
        }
        console.log('');
      }
      return 0;
    }
    case 'check': {
      const problems = check(root);
      if (problems.length === 0) {
        console.log('going-dark check: manifests, skills and documentation links are all sound.');
        return 0;
      }
      console.error(`going-dark check found ${problems.length} problem(s):`);
      for (const problem of problems) console.error(`  - ${problem}`);
      return 1;
    }
    case undefined:
    case 'help':
      console.log(HELP);
      return 0;
    default:
      console.error(`Unknown command "${options.command}". Run going-dark help.`);
      return 2;
  }
}
