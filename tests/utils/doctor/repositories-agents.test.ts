import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('doctor repository and agent checks', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('checkRepositories detects broken repo symlink', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn((p: string) => p === '/repos'),
      readdirSync: vi.fn(() => ['repo1']),
      statSync: vi.fn(() => ({ isDirectory: () => true })),
      lstatSync: vi.fn(() => ({ isSymbolicLink: () => true })),
      readlinkSync: vi.fn(() => '/missing-repo'),
      unlinkSync: vi.fn()
    }));
    vi.doMock('path', async (importOriginal) => ({ ...(await importOriginal<typeof import('path')>()) }));
    vi.doMock('child_process', () => ({ execSync: vi.fn() }));
    vi.doMock('../../../src/constants.js', () => ({ REPOS_DIR: '/repos' }));

    const { checkRepositories } = await import('../../../src/utils/doctor/check-repositories.js');
    const result = checkRepositories();

    expect(result.issues).toBe(1);
    expect(result.fixes).toHaveLength(1);
  });

  it('checkAgents marks orphaned agents when repo metadata is missing', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn(() => false),
      lstatSync: vi.fn(),
      readlinkSync: vi.fn()
    }));
    vi.doMock('../../../src/constants.js', () => ({ AGENTS_DIR: '/agents', KIRO_AGENTS_DIR: '/kiro' }));
    vi.doMock('../../../src/analyzer.js', () => ({ loadRepoMeta: vi.fn(() => null) }));

    const { checkAgents } = await import('../../../src/utils/doctor/check-agents.js');
    const result = checkAgents({
      agents: [{ id: 'a1', repo: 'repo', name: 'Agent' }],
      symlinks: {}
    });

    expect(result.issues).toBeGreaterThan(0);
    expect(result.orphanedAgents).toHaveLength(1);
    expect(result.validAgents).toHaveLength(0);
  });
});

