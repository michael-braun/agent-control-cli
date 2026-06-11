import { loadRepoMeta } from '../analyzer.js';
import { readConfig } from '../utils/index.js';
import { installAgent } from '../commands/install.js';
import { uninstallAgent } from '../commands/uninstall.js';

export async function showAgentInfoTool(repo: string, agentId: string): Promise<void> {
  const meta = loadRepoMeta(repo);
  
  if (!meta) {
    console.error(`Repository ${repo} not found`);
    return;
  }
  
  const agent = meta.agents.find(a => a.id === agentId);
  
  if (!agent) {
    console.error(`Agent ${agentId} not found in ${repo}`);
    return;
  }
  
  const config = readConfig();
  const isInstalled = config.agents.some(a => a.id === agentId && a.repo === repo);
  
  console.log(`\nAgent Information:\n`);
  console.log(`  ID: ${agent.id}`);
  console.log(`  Name: ${agent.name}`);
  console.log(`  Repository: ${repo}`);
  console.log(`  Description: ${agent.description}`);
  console.log(`  Status: ${isInstalled ? '\x1b[32mInstalled\x1b[0m' : '\x1b[33mNot installed\x1b[0m'}`);
  console.log(`\n  Files (${agent.files.length}):`);
  for (const file of agent.files) {
    console.log(`    - ${file}`);
  }
  console.log();
  
  // Show action options
  const { select } = await import('@inquirer/prompts');
  
  const choices = [
    { name: '← Back', value: 'back' }
  ];
  
  if (isInstalled) {
    choices.unshift({ name: 'Uninstall', value: 'uninstall' });
  } else {
    choices.unshift({ name: 'Install', value: 'install' });
  }
  
  const action = await select({
    message: 'Select an action:',
    loop: false,
    choices,
    default: 'back'
  });
  
  if (action === 'install') {
    await installAgent(repo, agentId);
  } else if (action === 'uninstall') {
    await uninstallAgent(repo, agentId);
  }
}
