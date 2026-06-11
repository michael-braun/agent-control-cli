import { mkdirSync, appendFileSync } from 'fs';
import { LOGS_DIR } from '../constants.js';

export function writeUpdateLog(message: string): void {
  mkdirSync(LOGS_DIR, { recursive: true });
  const timestamp = new Date().toISOString();
  appendFileSync(`${LOGS_DIR}/auto-update.log`, `[${timestamp}] ${message}\n`);
}
