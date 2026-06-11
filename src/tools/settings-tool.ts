import { isAutoUpdateEnabled, enableAutoUpdate, disableAutoUpdate } from '../utils/cron.js';

export async function settingsTool(): Promise<void> {
  const { select } = await import('@inquirer/prompts');

  while (true) {
    const enabled = isAutoUpdateEnabled();

    const action = await select({
      message: `⚙️  Settings — Auto-Update: ${enabled ? '\x1b[32menabled\x1b[0m' : '\x1b[33mdisabled\x1b[0m'}`,
      loop: false,
      choices: [
        { name: enabled ? '⏹  Disable auto-update' : '▶️  Enable auto-update (every 6h)', value: 'toggle' },
        { name: '← Back', value: 'back' }
      ],
      default: 'back'
    });

    if (action === 'back') break;

    try {
      if (enabled) {
        disableAutoUpdate();
        console.log('\n  Auto-update disabled.\n');
      } else {
        enableAutoUpdate();
        console.log('\n  Auto-update enabled (every 6 hours).\n');
        console.log('  Logs: ~/.agent-control/logs/auto-update.log\n');
      }
    } catch (err) {
      console.error('Error:', (err as Error).message);
    }
  }
}
