import { readdirSync, existsSync, statSync, lstatSync } from 'fs';
import { join } from 'path';
import { REPOS_DIR } from '../constants.js';
import { loadRepoMeta } from '../analyzer.js';
import { readConfig } from '../utils/index.js';
import { removeRepo } from '../commands/remove-repo.js';

export async function listReposTool(): Promise<void> {
  if (!existsSync(REPOS_DIR)) {
    console.log('\nNo repositories found\n');
    return;
  }
  
  while (true) {
    const entries = readdirSync(REPOS_DIR);
    const repos = entries.filter(entry => {
      const fullPath = join(REPOS_DIR, entry);
      return statSync(fullPath).isDirectory();
    });
    
    const { select } = await import('@inquirer/prompts');
    
    const choices = repos.map(repo => {
      const meta = loadRepoMeta(repo);
      const agentCount = meta?.agents.length || 0;
      return {
        name: `${repo} (${agentCount} agent${agentCount !== 1 ? 's' : ''})`,
        value: repo
      };
    });
    
    choices.push(
      { name: '➕ Add repository', value: 'add' },
      { name: '← Back', value: 'back' }
    );
    
    const selected = await select({
      message: 'Select a repository:',
      loop: false,
      choices,
      default: 'back'
    });
    
    if (selected === 'back') return;
    
    if (selected === 'add') {
      const { addRepoTool } = await import('./add-repo-tool.js');
      await addRepoTool();
      continue;
    }
    
    const shouldContinue = await showRepoInfo(selected);
    if (!shouldContinue) return;
  }
}

async function showRepoInfo(repo: string): Promise<boolean> {
  const meta = loadRepoMeta(repo);
  const config = readConfig();
  const installedAgents = config.agents.filter(a => a.repo === repo);
  
  const repoPath = join(REPOS_DIR, repo);
  const isSymlink = lstatSync(repoPath).isSymbolicLink();
  const hasGit = existsSync(join(repoPath, '.git'));
  
  let gitSupport = '\x1b[33mNo\x1b[0m'; // Orange
  if (isSymlink) {
    gitSupport = '\x1b[33mSymlink (local path)\x1b[0m'; // Orange
  } else if (hasGit) {
    gitSupport = '\x1b[32mYes\x1b[0m'; // Green
  }
  
  const lastUpdated = meta?.lastUpdated 
    ? new Date(meta.lastUpdated).toLocaleString()
    : 'Never';
  
  console.log(`\nRepository: ${repo}`);
  console.log(`Total agents: ${meta?.agents.length || 0}`);
  console.log(`Installed agents: ${installedAgents.length}`);
  console.log(`Git support: ${gitSupport}`);
  console.log(`Last updated: ${lastUpdated}\n`);
  
  const { select } = await import('@inquirer/prompts');
  
  const canDelete = installedAgents.length === 0;
  const choices = [
    { name: '← Back', value: 'back' }
  ];
  
  if (hasGit && !isSymlink) {
    choices.unshift({ name: '🔄  Update repository', value: 'update' });
  }
  
  if (canDelete) {
    choices.unshift({ name: '🗑️  Remove repository', value: 'remove' });
  }
  
  const action = await select({
    message: canDelete ? 'Select an action:' : 'Cannot remove: agents still installed',
    loop: false,
    choices,
    default: 'back'
  });
  
  if (action === 'remove') {
    await removeRepo(repo);
  } else if (action === 'update') {
    await updateSingleRepo(repo);
  }
  
  return true;
}

async function updateSingleRepo(repo: string): Promise<void> {
  const repoPath = join(REPOS_DIR, repo);
  const { isGitRepository, hasUncommittedChanges } = await import('../utils/index.js');
  const { analyzeRepository } = await import('../analyzer.js');
  const { execSync } = await import('child_process');
  
  if (isGitRepository(repoPath) && hasUncommittedChanges(repoPath)) {
    console.error(`\nError: Repository ${repo} has uncommitted changes. Please commit or stash them first.\n`);
    return;
  }
  
  console.log(`\nUpdating ${repo}...`);
  execSync('git pull', { cwd: repoPath, stdio: 'inherit' });
  
  console.log(`Analyzing ${repo}...`);
  analyzeRepository(repo, repoPath);
  
  console.log('Update complete\n');
}
