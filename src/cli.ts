#!/usr/bin/env node
import { Command } from 'commander';
import { 
  addRepo, 
  installAgent, 
  uninstallAgent, 
  cleanup, 
  update,
  doctor,
  listAvailableAgents, 
  listInstalledAgents,
  listRepos,
  removeRepo,
  showAgentInfo,
  interactive,
  installSkill,
  uninstallSkill,
  listInstalledSkills,
  listAvailableSkills,
  showSkillInfo,
  listAvailableSteerings,
  settings,
  enableAutoUpdateCommand,
  disableAutoUpdateCommand
} from './commands/index.js';
import { checkForUpdate } from './utils/index.js';

const program = new Command();

program
  .name('agent-control')
  .description('CLI tool to manage agent repositories')
  .version('1.0.0')
  .action(interactive);

program
  .command('add-repo <url> <name>')
  .description('Add a git repository or local path')
  .action(addRepo);

program
  .command('remove-repo <name>')
  .description('Remove a repository')
  .action(removeRepo);

program
  .command('list-repos')
  .description('List all repositories')
  .action(listRepos);

program
  .command('list')
  .description('List all installed agents')
  .action(listInstalledAgents);

program
  .command('list-available <repo>')
  .description('List all available agents in a repository')
  .action(listAvailableAgents);

program
  .command('info <repo> <agent-id>')
  .description('Show detailed information about an agent')
  .action(showAgentInfo);

program
  .command('install <repo> <agent-id>')
  .description('Install an agent')
  .action(installAgent);

program
  .command('uninstall <repo> <agent-id>')
  .description('Uninstall an agent')
  .action(uninstallAgent);

program
  .command('install-skill <repo> <skill-id>')
  .description('Install a skill')
  .action(installSkill);

program
  .command('uninstall-skill <repo> <skill-id>')
  .description('Uninstall a skill')
  .action(uninstallSkill);

program
  .command('list-skills')
  .description('List all installed skills')
  .action(listInstalledSkills);

program
  .command('list-available-skills <repo>')
  .description('List all available skills in a repository')
  .action(listAvailableSkills);

program
  .command('skill-info <repo> <skill-id>')
  .description('Show detailed information about a skill')
  .action(showSkillInfo);

program
  .command('list-available-steerings <repo>')
  .description('List all available steerings in a repository')
  .action(listAvailableSteerings);

program
  .command('cleanup')
  .description('Cleanup and recreate symlinks')
  .action(cleanup);

program
  .command('update')
  .description('Update all repositories and cleanup')
  .action(update);

program
  .command('doctor')
  .description('Diagnose and fix issues')
  .action(doctor);

program
  .command('interactive')
  .description('Start interactive mode')
  .action(interactive);

const settingsCmd = program
  .command('settings')
  .description('Manage settings');

settingsCmd
  .command('show')
  .description('Show current settings')
  .action(settings);

settingsCmd
  .command('auto-update-on')
  .description('Enable auto-update cronjob')
  .action(enableAutoUpdateCommand);

settingsCmd
  .command('auto-update-off')
  .description('Disable auto-update cronjob')
  .action(disableAutoUpdateCommand);

const isInteractive = !process.argv.slice(2).length || process.argv[2] === 'interactive';
const updateCheck = isInteractive ? null : checkForUpdate();

(async () => {
  if (updateCheck) {
    const updateMsg = await updateCheck;
    if (updateMsg) {
      const border = '#'.repeat(updateMsg.length + 12);
      console.log(`\n  ${border}\n  ###   ${updateMsg}   ###\n  ${border}\n`);
    }
  }
  await program.parseAsync();
})().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
