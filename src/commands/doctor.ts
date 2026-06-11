import { writeConfig } from '../utils/index.js';
import { cleanup } from './cleanup.js';
import { checkDirectories } from '../utils/doctor/check-directories.js';
import { checkConfig } from '../utils/doctor/check-config.js';
import { checkRepositories } from '../utils/doctor/check-repositories.js';
import { checkOrphanedSymlinks } from '../utils/doctor/check-symlinks.js';
import { checkAgents } from '../utils/doctor/check-agents.js';
import { checkCron } from '../utils/doctor/check-cron.js';

export async function doctor(): Promise<void> {
  console.log('\n🔍 Running diagnostics...\n');
  
  let totalIssues = 0;
  let totalFixed = 0;
  const allFixes: Array<() => void> = [];
  
  // Check directories
  const dirResult = checkDirectories();
  totalIssues += dirResult.issues;
  allFixes.push(...dirResult.fixes);
  
  // Check config
  const configResult = checkConfig();
  totalIssues += configResult.issues;
  allFixes.push(...configResult.fixes);
  const config = configResult.config;
  
  // Check repositories
  const repoResult = checkRepositories();
  totalIssues += repoResult.issues;
  allFixes.push(...repoResult.fixes);
  
  // Check orphaned symlinks
  const symlinkResult = checkOrphanedSymlinks();
  totalIssues += symlinkResult.issues;
  allFixes.push(...symlinkResult.fixes);
  
  // Check agents
  const agentResult = checkAgents(config);
  totalIssues += agentResult.issues;
  
  // Check cron
  const cronResult = checkCron();
  totalIssues += cronResult.issues;
  allFixes.push(...cronResult.fixes);
  
  // Fix issues
  if (totalIssues > 0) {
    console.log(`\n⚠️  Found ${totalIssues} issue${totalIssues !== 1 ? 's' : ''}`);
    
    const { confirm } = await import('@inquirer/prompts');
    const shouldFix = await confirm({
      message: 'Attempt to fix issues automatically?',
      default: true
    });
    
    if (shouldFix) {
      console.log('\n🔧 Fixing issues...\n');
      
      // Apply all fixes
      for (const fix of allFixes) {
        try {
          fix();
          totalFixed++;
        } catch (err) {
          console.error(`  ✗ Fix failed: ${(err as Error).message}`);
        }
      }
      
      // Handle orphaned agents
      if (agentResult.orphanedAgents.length > 0) {
        console.log(`\n  Found ${agentResult.orphanedAgents.length} orphaned agent${agentResult.orphanedAgents.length !== 1 ? 's' : ''}:`);
        for (const agent of agentResult.orphanedAgents) {
          console.log(`    - ${agent.name} (${agent.id}) from ${agent.repo}`);
        }
        
        const { confirm: confirmRemove } = await import('@inquirer/prompts');
        const shouldRemove = await confirmRemove({
          message: 'Remove orphaned agents?',
          default: true
        });
        
        if (shouldRemove) {
          const { uninstallAgentFiles } = await import('../symlinks.js');
          for (const agent of agentResult.orphanedAgents) {
            try {
              uninstallAgentFiles(agent.id);
              console.log(`  ✓ Removed orphaned agent '${agent.name}' (${agent.id})`);
              totalFixed++;
            } catch (err) {
              console.error(`  ✗ Failed to remove '${agent.name}': ${(err as Error).message}`);
            }
          }
        }
      }
      
      // Remove invalid agents from config
      if (agentResult.validAgents.length < config.agents.length) {
        const removed = config.agents.length - agentResult.validAgents.length;
        config.agents = agentResult.validAgents;
        writeConfig(config);
        console.log(`  ✓ Removed ${removed} invalid agent${removed !== 1 ? 's' : ''} from config`);
        totalFixed++;
      }
      
      // Recreate symlinks
      console.log('\n  Running cleanup to recreate symlinks...');
      await cleanup();
      
      console.log(`\n✅ Fixed ${totalFixed} issue${totalFixed !== 1 ? 's' : ''}`);
    }
  } else {
    console.log('\n✅ No issues found! Everything looks good.\n');
  }
}
