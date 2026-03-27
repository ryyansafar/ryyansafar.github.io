#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';

const REGISTRY_BASE = 'https://ryyansafar.site/registry';

const program = new Command();

program
  .name('ryyan-ui')
  .description('CLI to add ryyansafar technical primitives')
  .version('0.2.0');

program
  .command('add')
  .description('add a component to your project')
  .argument('<component>', 'component name (e.g. cursor-spring, noise-overlay)')
  .action(async (component) => {
    console.log(chalk.cyan(`➜ Adding ${component}...`));

    try {
      const response = await fetch(`${REGISTRY_BASE}/${component}.json`);
      if (!response.ok) {
        throw new Error(`Component "${component}" not found. Run ${chalk.bold('ryyan-ui list')} to see available components.`);
      }

      const data = await response.json();
      const targetDir = path.join(process.cwd(), 'components', 'ui');
      await fs.ensureDir(targetDir);

      const targetPath = path.join(targetDir, `${component}${data.extension || '.tsx'}`);
      await fs.writeFile(targetPath, data.code);

      console.log(chalk.green(`✔ Added → ${path.relative(process.cwd(), targetPath)}`));

      if (data.dependencies?.length) {
        console.log(chalk.yellow(`\n⚠  Requires: ${data.dependencies.join(', ')}`));
        console.log(chalk.dim(`   npm install ${data.dependencies.join(' ')}`));
      } else {
        console.log(chalk.dim('   No additional dependencies needed.'));
      }
    } catch (error) {
      console.error(chalk.red(`\n✖ ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('list')
  .description('list all available components')
  .action(async () => {
    try {
      const response = await fetch(`${REGISTRY_BASE}/index.json`);
      if (!response.ok) throw new Error('Could not reach registry.');

      const components = await response.json();

      console.log(chalk.bold('\n  Available components\n'));
      for (const c of components) {
        console.log(`  ${chalk.cyan(c.name.padEnd(22))} ${chalk.dim(c.description)}`);
      }
      console.log(chalk.dim(`\n  Usage: ryyan-ui add <name>\n`));
    } catch (error) {
      console.error(chalk.red(`\n✖ ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
