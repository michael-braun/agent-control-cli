#!/usr/bin/env node
import { execSync } from 'child_process';

const CRON_COMMENT = 'agent-control-auto-update';

try {
  const crontab = execSync('crontab -l 2>/dev/null', { encoding: 'utf-8' });
  if (crontab.includes(`# ${CRON_COMMENT}`)) {
    const lines = crontab.split('\n').filter(line => !line.includes(`# ${CRON_COMMENT}`));
    execSync(`echo ${JSON.stringify(lines.join('\n'))} | crontab -`);
    console.log('Auto-update cronjob removed.');
  }
} catch {
  // No crontab or crontab command not available
}
