import { readConfig } from '../utils/index.js';
import { formatAgentDisplay } from '../format.js';
import { uninstallAgent } from '../commands/uninstall.js';

export async function uninstallAgentTool(): Promise<void> {
  const config = readConfig();
  
  if (config.agents.length === 0) {
    console.log('No agents installed');
    return;
  }
  
  const { select } = await import('@inquirer/prompts');
  
  const choices = config.agents.map(a => ({
    name: formatAgentDisplay(a.name, a.repo),
    value: `${a.repo}:${a.id}`,
    description: a.id
  }));
  
  const selected = await select({
    message: 'Select an agent to uninstall:',
    loop: false,
    choices
  });
  
  const [repo, agentId] = selected.split(':');
  await uninstallAgent(repo, agentId);
}
