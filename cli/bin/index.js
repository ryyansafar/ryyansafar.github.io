#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';

const program = new Command();

program
  .name('ryyan-ui')
  .description('CLI to add ryyansafar technical primitives')
  .version('0.1.0');

program
  .command('add')
  .description('add a component to your project')
  .argument('<component>', 'the component to add')
  .action(async (component) => {
    console.log(chalk.cyan(`➜ Adding ${component}...`));
    
    try {
      // For now, we fetch from the user's portfolio registry
      // Replace with your actual portfolio URL once live
      const registryUrl = `https://ryyansafar.github.io/registry/${component}.json`;
      
      const response = await fetch(registryUrl);
      if (!response.ok) {
        throw new Error(`Component "${component}" not found in registry.`);
      }
      
      const data = await response.json();
      const targetDir = path.join(process.cwd(), 'components', 'ui');
      await fs.ensureDir(targetDir);
      
      const targetPath = path.join(targetDir, `${component}${data.extension || '.tsx'}`);
      await fs.writeFile(targetPath, data.code);
      
      console.log(chalk.green(`✔ Success! Component added to ${targetPath}`));
      if (data.dependencies?.length) {
        console.log(chalk.yellow(`\nNote: This component requires the following dependencies:`));
        console.log(chalk.white(`npm install ${data.dependencies.join(' ')}`));
      }
    } catch (error) {
      console.error(chalk.red(`\n✖ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
