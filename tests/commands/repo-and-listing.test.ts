import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('commands repo and listing', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('listInstalledAgents prints empty message', async () => {
    vi.doMock('../../src/utils/index.js', () => ({
      readConfig: vi.fn(() => ({ agents: [], symlinks: {} }))
    }));
    vi.doMock('../../src/format.js', () => ({ formatAgentDisplay: vi.fn() }));

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { listInstalledAgents } = await import('../../src/commands/list.js');

    await listInstalledAgents();
    expect(log).toHaveBeenCalledWith('\nNo agents installed\n');
  });

  it('listAvailableAgents exits when repo is missing', async () => {
    vi.doMock('../../src/analyzer.js', () => ({ loadRepoMeta: vi.fn(() => null) }));
    vi.doMock('../../src/format.js', () => ({ formatAgentDisplay: vi.fn((n: string) => n) }));

    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit');
    }) as any);

    const { listAvailableAgents } = await import('../../src/commands/list-available.js');
    await expect(listAvailableAgents('missing')).rejects.toThrow('exit');
  });

  it('showAgentInfo prints status for installed agent', async () => {
    vi.doMock('../../src/analyzer.js', () => ({
      loadRepoMeta: vi.fn(() => ({ agents: [{ id: 'a1', name: 'A', description: 'D', files: ['/f'] }] }))
    }));
    vi.doMock('../../src/utils/index.js', () => ({
      readConfig: vi.fn(() => ({ agents: [{ id: 'a1', repo: 'repo', name: 'A' }], symlinks: {} }))
    }));

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { showAgentInfo } = await import('../../src/commands/info.js');

    await showAgentInfo('repo', 'a1');
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Agent Information'));
  });

  it('removeRepo prevents deletion when agents are installed', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn(() => true),
      rmSync: vi.fn()
    }));

    vi.doMock('../../src/utils/index.js', () => ({
      getRepoPath: vi.fn(() => '/repos/repo'),
      readConfig: vi.fn(() => ({ agents: [{ id: 'a1', repo: 'repo', name: 'A' }], symlinks: {} }))
    }));

    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit');
    }) as any);

    const { removeRepo } = await import('../../src/commands/remove-repo.js');
    await expect(removeRepo('repo')).rejects.toThrow('exit');
  });
});

