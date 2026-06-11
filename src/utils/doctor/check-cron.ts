import { execSync } from 'child_process';
import { CRON_COMMENT } from '../../constants.js';
import { DiagnosticResult } from './types.js';

export function checkCron(): DiagnosticResult {
  const fixes: Array<() => void> = [];
  let issues = 0;

  try {
    const crontab = execSync('crontab -l 2>/dev/null', { encoding: 'utf-8' });
    const cronLines = crontab.split('\n').filter(line => line.includes(`# ${CRON_COMMENT}`));

    if (cronLines.length > 1) {
      issues++;
      console.log(`  ⚠ Found ${cronLines.length} duplicate auto-update cronjobs (expected max 1)`);
      fixes.push(() => {
        const lines = crontab.split('\n');
        const filtered = lines.filter(line => !line.includes(`# ${CRON_COMMENT}`));
        // Keep only the last one
        filtered.push(cronLines[cronLines.length - 1]);
        execSync(`echo ${JSON.stringify(filtered.join('\n'))} | crontab -`);
        console.log('  ✓ Removed duplicate cronjobs, kept one');
      });
    }
  } catch {
    // No crontab available
  }

  return { issues, fixes };
}
