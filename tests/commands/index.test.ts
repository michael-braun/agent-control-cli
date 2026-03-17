import { describe, expect, it } from 'vitest';
import * as commands from '../../src/commands/index.js';

describe('commands index exports', () => {
  it('re-exports all command handlers', () => {
    expect(typeof commands.addRepo).toBe('function');
    expect(typeof commands.installAgent).toBe('function');
    expect(typeof commands.uninstallAgent).toBe('function');
    expect(typeof commands.listAvailableAgents).toBe('function');
    expect(typeof commands.listInstalledAgents).toBe('function');
    expect(typeof commands.listRepos).toBe('function');
    expect(typeof commands.removeRepo).toBe('function');
    expect(typeof commands.showAgentInfo).toBe('function');
    expect(typeof commands.cleanup).toBe('function');
    expect(typeof commands.update).toBe('function');
    expect(typeof commands.doctor).toBe('function');
    expect(typeof commands.interactive).toBe('function');
  });
});

