import { execSync } from 'child_process';
import { CRON_COMMENT } from '../constants.js';

function getNodePath(): string {
  return execSync('which node', { encoding: 'utf-8' }).trim();
}

function getBinPath(): string {
  try {
    return execSync('which agentctl', { encoding: 'utf-8' }).trim();
  } catch {
    return execSync('which agent-control', { encoding: 'utf-8' }).trim();
  }
}

function getCurrentCrontab(): string {
  try {
    return execSync('crontab -l 2>/dev/null', { encoding: 'utf-8' });
  } catch {
    return '';
  }
}

export function isAutoUpdateEnabled(): boolean {
  const crontab = getCurrentCrontab();
  return crontab.includes(`# ${CRON_COMMENT}`);
}

export function enableAutoUpdate(schedule = '0 */6 * * *'): void {
  if (isAutoUpdateEnabled()) {
    throw new Error('Auto-update is already enabled.');
  }

  const node = getNodePath();
  const bin = getBinPath();
  const logFile = '~/.agent-control/logs/auto-update.log';
  const cronLine = `${schedule} mkdir -p ~/.agent-control/logs && ${node} ${bin} update >> ${logFile} 2>&1 # ${CRON_COMMENT}`;
  const crontab = getCurrentCrontab();
  const newCrontab = crontab.endsWith('\n') ? crontab + cronLine + '\n' : crontab + '\n' + cronLine + '\n';

  execSync(`echo ${JSON.stringify(newCrontab)} | crontab -`);
}

export function disableAutoUpdate(): void {
  const crontab = getCurrentCrontab();
  const lines = crontab.split('\n').filter(line => !line.includes(`# ${CRON_COMMENT}`));
  const newCrontab = lines.join('\n');

  execSync(`echo ${JSON.stringify(newCrontab)} | crontab -`);
}
