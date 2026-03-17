import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('list/info tools', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('listInstalledAgentsTool supports back navigation', async () => {
    const showAgentInfoTool = vi.fn();

    vi.doMock('../../src/utils/index.js', () => ({
      readConfig: vi.fn(() => ({ agents: [{ id: 'a1', repo: 'repo', name: 'A' }], symlinks: {} }))
    }));
    vi.doMock('../../src/format.js', () => ({ formatAgentDisplay: vi.fn(() => 'Agent') }));
    vi.doMock('../../src/tools/info-tool.js', () => ({ showAgentInfoTool }));
    vi.doMock('@inquirer/prompts', () => ({ select: vi.fn(() => Promise.resolve('back')) }));

    const { listInstalledAgentsTool } = await import('../../src/tools/list-tool.js');
    await listInstalledAgentsTool();

    expect(showAgentInfoTool).not.toHaveBeenCalled();
  });

  it('showAgentInfoTool can trigger install action', async () => {
    vi.doUnmock('../../src/tools/info-tool.js');
    const uninstallAgent = vi.fn();

    vi.doMock('../../src/analyzer.js', () => ({
      loadRepoMeta: vi.fn(() => ({ agents: [{ id: 'a1', name: 'A', description: 'D', files: ['/f'] }] }))
    }));
    vi.doMock('../../src/utils/index.js', () => ({
      readConfig: vi.fn(() => ({ agents: [{ id: 'a1', repo: 'repo', name: 'A' }], symlinks: {} }))
    }));
    vi.doMock('../../src/commands/install.js', () => ({ installAgent: vi.fn() }));
    vi.doMock('../../src/commands/uninstall.js', () => ({ uninstallAgent }));
    vi.doMock('@inquirer/prompts', () => ({ select: vi.fn(() => Promise.resolve('uninstall')) }));

    const { showAgentInfoTool } = await import('../../src/tools/info-tool.js');
    await showAgentInfoTool('repo', 'a1');

    expect(uninstallAgent).toHaveBeenCalledWith('repo', 'a1');
  });

  it('listAvailableAgentsTool shows empty message without repos', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn(() => false),
      readdirSync: vi.fn(),
      statSync: vi.fn(),
      lstatSync: vi.fn()
    }));
    vi.doMock('../../src/constants.js', () => ({ REPOS_DIR: '/repos' }));
    vi.doMock('../../src/analyzer.js', () => ({ loadRepoMeta: vi.fn() }));
    vi.doMock('../../src/utils/index.js', () => ({ readConfig: vi.fn(() => ({ agents: [], symlinks: {} })) }));
    vi.doMock('../../src/format.js', () => ({ formatAgentDisplay: vi.fn((n: string) => n) }));
    vi.doMock('../../src/tools/info-tool.js', () => ({ showAgentInfoTool: vi.fn() }));

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { listAvailableAgentsTool } = await import('../../src/tools/list-available-tool.js');
    await listAvailableAgentsTool();

    expect(log).toHaveBeenCalledWith('\nNo repositories found\n');
  });
});

