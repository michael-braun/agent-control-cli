import { isAutoUpdateEnabled, enableAutoUpdate, disableAutoUpdate } from '../utils/cron.js';

export async function settings(): Promise<void> {
  const enabled = isAutoUpdateEnabled();
  console.log(`\n  Auto-Update CronJob: ${enabled ? '\x1b[32menabled\x1b[0m' : '\x1b[33mdisabled\x1b[0m'}`);
  console.log(`  Schedule: every 6 hours`);
  console.log(`  Logs: ~/.agent-control/logs/auto-update.log\n`);
}

export async function enableAutoUpdateCommand(): Promise<void> {
  enableAutoUpdate();
  console.log('Auto-update enabled (every 6 hours).');
}

export async function disableAutoUpdateCommand(): Promise<void> {
  disableAutoUpdate();
  console.log('Auto-update disabled.');
}
