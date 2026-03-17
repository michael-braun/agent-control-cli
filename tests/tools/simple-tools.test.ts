import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('simple tool wrappers', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('installAgentTool installs selected agent', async () => {
    const installAgent = vi.fn();
    vi.doMock('../../src/utils/index.js', () => ({
      selectAgentInteractive: vi.fn(() => Promise.resolve({ repo: 'repo', agentId: 'a1' }))
    }));
    vi.doMock('../../src/commands/install.js', () => ({ installAgent }));

    const { installAgentTool } = await import('../../src/tools/install-tool.js');
    await installAgentTool();

    expect(installAgent).toHaveBeenCalledWith('repo', 'a1');
  });

  it('uninstallAgentTool exits early when no agents installed', async () => {
    vi.doMock('../../src/utils/index.js', () => ({
      readConfig: vi.fn(() => ({ agents: [], symlinks: {} }))
    }));
    vi.doMock('../../src/format.js', () => ({ formatAgentDisplay: vi.fn() }));
    vi.doMock('../../src/commands/uninstall.js', () => ({ uninstallAgent: vi.fn() }));

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { uninstallAgentTool } = await import('../../src/tools/uninstall-tool.js');
    await uninstallAgentTool();

    expect(log).toHaveBeenCalledWith('No agents installed');
  });

  it('addRepoTool validates and calls addRepo', async () => {
    const addRepo = vi.fn();
    vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
    vi.doMock('../../src/utils/index.js', () => ({ getRepoPath: vi.fn(() => '/repos/repo') }));
    vi.doMock('../../src/commands/add-repo.js', () => ({ addRepo }));
    vi.doMock('@inquirer/prompts', () => ({
      input: vi
        .fn()
        .mockResolvedValueOnce('git@github.com:test/repo.git')
        .mockResolvedValueOnce('repo')
    }));

    const { addRepoTool } = await import('../../src/tools/add-repo-tool.js');
    await addRepoTool();

    expect(addRepo).toHaveBeenCalledWith('git@github.com:test/repo.git', 'repo');
  });
});

