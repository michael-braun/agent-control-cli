import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('utils interactive selection', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('returns null when no agents are available', async () => {
    vi.doMock('fs', () => ({
      readdirSync: vi.fn(() => []),
      statSync: vi.fn(() => ({ isDirectory: () => true }))
    }));

    vi.doMock('../../src/utils/index.js', () => ({
      readConfig: vi.fn(() => ({ agents: [], symlinks: {} })),
      getRepoPath: vi.fn((name: string) => `/repos/${name}`)
    }));

    vi.doMock('../../src/analyzer.js', () => ({ loadRepoMeta: vi.fn(() => null) }));
    vi.doMock('../../src/constants.js', () => ({ REPOS_DIR: '/repos' }));
    vi.doMock('../../src/format.js', () => ({ formatAgentDisplay: vi.fn((name: string) => name) }));

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { selectAgentInteractive } = await import('../../src/utils/interactive.js');

    const selected = await selectAgentInteractive('Select');
    expect(selected).toBeNull();
    expect(log).toHaveBeenCalledWith('\nNo agents available\n');
  });
});

