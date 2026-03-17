import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  lstatSync: vi.fn()
}));

import { existsSync, lstatSync } from 'fs';
import { formatAgentDisplay, formatRepo, getRepoGitIndicator } from '../src/format.js';

describe('format helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns orange indicator for symlink repos', () => {
    vi.mocked(lstatSync).mockReturnValue({ isSymbolicLink: () => true } as any);
    vi.mocked(existsSync).mockReturnValue(true);

    expect(getRepoGitIndicator('repo')).toContain('\x1b[33m');
  });

  it('returns green indicator for normal git repos', () => {
    vi.mocked(lstatSync).mockReturnValue({ isSymbolicLink: () => false } as any);
    vi.mocked(existsSync).mockReturnValue(true);

    expect(getRepoGitIndicator('repo')).toContain('\x1b[32m');
  });

  it('formats agent display with optional description', () => {
    vi.mocked(lstatSync).mockReturnValue({ isSymbolicLink: () => false } as any);
    vi.mocked(existsSync).mockReturnValue(true);

    expect(formatRepo('repo')).toContain('repo');
    expect(formatAgentDisplay('Agent', 'repo', 'Desc')).toContain('Desc');
    expect(formatAgentDisplay('Agent', 'repo')).toContain('Agent');
  });
});

