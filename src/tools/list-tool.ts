import { readConfig } from '../utils/index.js';
import { formatAgentDisplay } from '../format.js';
import { showAgentInfoTool } from './info-tool.js';

export async function listInstalledAgentsTool(): Promise<void> {
  const config = readConfig();
  
  if (config.agents.length === 0) {
    console.log('\nNo agents installed\n');
    return;
  }
  
  // Interactive selection
  const { select } = await import('@inquirer/prompts');
  
  const choices = config.agents.map(a => ({
    name: formatAgentDisplay(a.name, a.repo),
    value: `${a.repo}:${a.id}`,
    description: a.id
  }));
  
  choices.push({ name: '← Back', value: 'back', description: '' });
  
  const selected = await select({
    message: 'Select an agent to view details:',
    loop: false,
    choices
  });
  
  if (selected === 'back') return;
  
  const [repo, agentId] = selected.split(':');
  await showAgentInfoTool(repo, agentId);
}
