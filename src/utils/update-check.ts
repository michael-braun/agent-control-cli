import { createRequire } from 'module';

export async function checkForUpdate(): Promise<string | null> {
  try {
    const require = createRequire(import.meta.url);
    const { version: currentVersion, name: packageName } = require('../../package.json');

    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;

    const { version: latestVersion } = await response.json() as { version: string };

    if (latestVersion !== currentVersion) {
      return `Update available: ${currentVersion} → ${latestVersion}  —  npm install -g ${packageName}`;
    }
  } catch {
    // Silently ignore any errors
  }
  return null;
}
