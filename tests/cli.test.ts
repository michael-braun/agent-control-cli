import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('cli bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('registers commands and parses argv', async () => {
    const parseAsync = vi.fn(() => Promise.resolve());
    const command = vi.fn();

    vi.doMock('commander', () => ({
      Command: class {
        name() { return this; }
        description() { return this; }
        version() { return this; }
        action() { return this; }
        command() { command(); return this; }
        parse() { return this; }
        parseAsync() { return parseAsync(); }
      }
    }));

    vi.doMock('../src/commands/index.js', () => ({
      addRepo: vi.fn(),
      installAgent: vi.fn(),
      uninstallAgent: vi.fn(),
      cleanup: vi.fn(),
      update: vi.fn(),
      doctor: vi.fn(),
      listAvailableAgents: vi.fn(),
      listInstalledAgents: vi.fn(),
      listRepos: vi.fn(),
      removeRepo: vi.fn(),
      showAgentInfo: vi.fn(),
      interactive: vi.fn(),
      installSkill: vi.fn(),
      uninstallSkill: vi.fn(),
      listInstalledSkills: vi.fn(),
      listAvailableSkills: vi.fn(),
      showSkillInfo: vi.fn(),
      listAvailableSteerings: vi.fn(),
      settings: vi.fn(),
      enableAutoUpdateCommand: vi.fn(),
      disableAutoUpdateCommand: vi.fn()
    }));

    await import('../src/cli.js');

    expect(parseAsync).toHaveBeenCalled();
    expect(command).toHaveBeenCalled();
  });
});

