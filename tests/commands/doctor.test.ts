import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('doctor command', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('prints success when no issues are found', async () => {
    vi.doMock('../../src/utils/index.js', () => ({ writeConfig: vi.fn() }));
    vi.doMock('../../src/commands/cleanup.js', () => ({ cleanup: vi.fn() }));
    vi.doMock('../../src/utils/doctor/check-directories.js', () => ({ checkDirectories: vi.fn(() => ({ issues: 0, fixes: [] })) }));
    vi.doMock('../../src/utils/doctor/check-config.js', () => ({ checkConfig: vi.fn(() => ({ issues: 0, fixes: [], config: { agents: [], symlinks: {} } })) }));
    vi.doMock('../../src/utils/doctor/check-repositories.js', () => ({ checkRepositories: vi.fn(() => ({ issues: 0, fixes: [] })) }));
    vi.doMock('../../src/utils/doctor/check-symlinks.js', () => ({ checkOrphanedSymlinks: vi.fn(() => ({ issues: 0, fixes: [] })) }));
    vi.doMock('../../src/utils/doctor/check-agents.js', () => ({ checkAgents: vi.fn(() => ({ issues: 0, validAgents: [], orphanedAgents: [] })) }));

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { doctor } = await import('../../src/commands/doctor.js');
    await doctor();

    expect(log).toHaveBeenCalledWith('\n✅ No issues found! Everything looks good.\n');
  });
});

