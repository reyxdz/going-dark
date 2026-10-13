#!/usr/bin/env node
// going-dark — install the going-dark method into any AI coding agent.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { main } from '../src/cli.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
process.exitCode = main(process.argv.slice(2), root);
