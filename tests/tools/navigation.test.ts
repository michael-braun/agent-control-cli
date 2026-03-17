import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('navigation tools', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('interactive exits when user selects exit', async () => {
    vi.doMock('../../src/commands/update.js', () => ({ update: vi.fn() }));
    vi.doMock('../../src/commands/cleanup.js', () => ({ cleanup: vi.fn() }));
    vi.doMock('../../src/commands/doctor.js', () => ({ doctor: vi.fn() }));
    vi.doMock('../../src/tools/list-tool.js', () => ({ listInstalledAgentsTool: vi.fn() }));
    vi.doMock('../../src/tools/list-repos-tool.js', () => ({ listReposTool: vi.fn() }));
    vi.doMock('../../src/tools/list-available-tool.js', () => ({ listAvailableAgentsTool: vi.fn() }));
    vi.doMock('@inquirer/prompts', () => ({ select: vi.fn(() => Promise.resolve('exit')) }));

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { interactive } = await import('../../src/tools/interactive.js');
    await interactive();

    expect(log).toHaveBeenCalledWith('\nGoodbye!\n');
  });

  it('listReposTool returns when back is selected', async () => {
    vi.doMock('fs', () => ({
      readdirSync: vi.fn(() => ['repo']),
      existsSync: vi.fn(() => true),
      statSync: vi.fn(() => ({ isDirectory: () => true })),
      lstatSync: vi.fn(() => ({ isSymbolicLink: () => false }))
    }));
    vi.doMock('../../src/constants.js', () => ({ REPOS_DIR: '/repos' }));
    vi.doMock('../../src/analyzer.js', () => ({ loadRepoMeta: vi.fn(() => ({ agents: [] })) }));
    vi.doMock('../../src/utils/index.js', () => ({ readConfig: vi.fn(() => ({ agents: [], symlinks: {} })) }));
    vi.doMock('../../src/commands/remove-repo.js', () => ({ removeRepo: vi.fn() }));
    vi.doMock('@inquirer/prompts', () => ({ select: vi.fn(() => Promise.resolve('back')) }));

    const { listReposTool } = await import('../../src/tools/list-repos-tool.js');
    await listReposTool();
  });
});

