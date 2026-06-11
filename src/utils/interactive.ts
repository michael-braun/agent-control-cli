import { readdirSync, statSync } from 'fs';
import { loadRepoMeta } from '../analyzer.js';
import { formatAgentDisplay } from '../format.js';
import { readConfig, getRepoPath } from '../utils/index.js';
import { REPOS_DIR } from '../constants.js';

export async function selectAgentInteractive(message: string, showInstalled: boolean = false): Promise<{ repo: string; agentId: string } | null> {
  const { select } = await import('@inquirer/prompts');
  const config = readConfig();
  
  const repos = readdirSync(REPOS_DIR).filter(f => {
    const fullPath = getRepoPath(f);
    return statSync(fullPath).isDirectory();
  });
  
  const allChoices: Array<{ name: string; value: string; description: string }> = [];
  
  for (const repoName of repos) {
    const repoMeta = loadRepoMeta(repoName);
    if (!repoMeta) continue;
    
    for (const a of repoMeta.agents) {
      const isInstalled = config.agents.some(installed => installed.id === a.id && installed.repo === repoName);
      const statusTag = showInstalled && isInstalled ? ' \x1b[32m[Installed]\x1b[0m' : '';
      
      allChoices.push({
        name: `${formatAgentDisplay(a.name, repoName, a.description)}${statusTag}`,
        value: `${repoName}:${a.id}`,
        description: a.id
      });
    }
  }
  
  if (allChoices.length === 0) {
    console.log('\nNo agents available\n');
    return null;
  }
  
  const selected = await select({
    message,
    loop: false,
    choices: allChoices
  });
  
  const [repo, agentId] = selected.split(':');
  return { repo, agentId };
}
