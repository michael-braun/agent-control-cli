import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({ existsSync: vi.fn() }));
vi.mock('child_process', () => ({ execSync: vi.fn() }));

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { hasUncommittedChanges, isGitRepository } from '../../src/utils/git.js';

describe('git utils', () => {
  beforeEach(() => vi.clearAllMocks());

  it('checks .git directory', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    expect(isGitRepository('/repo')).toBe(true);
  });

  it('detects uncommitted changes', () => {
    vi.mocked(execSync).mockReturnValue(' M file.txt\n' as any);
    expect(hasUncommittedChanges('/repo')).toBe(true);
  });

  it('returns false when git command fails', () => {
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('failed');
    });
    expect(hasUncommittedChanges('/repo')).toBe(false);
  });
});

