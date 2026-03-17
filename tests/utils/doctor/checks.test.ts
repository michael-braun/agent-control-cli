import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('doctor checks', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('checkDirectories reports missing directories', async () => {
    vi.doMock('fs', () => ({ existsSync: vi.fn(() => false) }));
    vi.doMock('../../../src/utils/index.js', () => ({ ensureDirectories: vi.fn() }));

    const { checkDirectories } = await import('../../../src/utils/doctor/check-directories.js');
    const result = checkDirectories();

    expect(result.issues).toBe(3);
    expect(result.fixes).toHaveLength(3);
  });

  it('checkConfig repairs malformed config shape', async () => {
    const writeConfig = vi.fn();

    vi.doMock('../../../src/utils/index.js', () => ({
      readConfig: vi.fn(() => ({ agents: null, symlinks: null })),
      writeConfig
    }));

    const { checkConfig } = await import('../../../src/utils/doctor/check-config.js');
    const result = checkConfig();

    expect(result.issues).toBe(2);
    result.fixes.forEach(f => f());
    expect(writeConfig).toHaveBeenCalled();
  });

  it('checkOrphanedSymlinks finds broken symlinks', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn((p: string) => p === '/kiro'),
      readdirSync: vi.fn(() => ['agent-control_a1']),
      lstatSync: vi.fn(() => ({ isSymbolicLink: () => true })),
      readlinkSync: vi.fn(() => '/missing/target'),
      unlinkSync: vi.fn()
    }));

    vi.doMock('../../../src/constants.js', () => ({ KIRO_AGENTS_DIR: '/kiro' }));

    const { checkOrphanedSymlinks } = await import('../../../src/utils/doctor/check-symlinks.js');
    const result = checkOrphanedSymlinks();

    expect(result.issues).toBe(1);
    expect(result.fixes).toHaveLength(1);
  });
});

