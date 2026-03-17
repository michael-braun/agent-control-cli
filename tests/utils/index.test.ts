import { describe, expect, it } from 'vitest';
import * as utils from '../../src/utils/index.js';

describe('utils index exports', () => {
  it('re-exports utility helpers', () => {
    expect(typeof utils.ensureDirectories).toBe('function');
    expect(typeof utils.readConfig).toBe('function');
    expect(typeof utils.writeConfig).toBe('function');
    expect(typeof utils.findJsonFiles).toBe('function');
    expect(typeof utils.createSymlink).toBe('function');
    expect(typeof utils.removeSymlink).toBe('function');
    expect(typeof utils.extractMarkdownLinks).toBe('function');
    expect(typeof utils.getRepoPath).toBe('function');
    expect(typeof utils.getRepoMetaPath).toBe('function');
    expect(typeof utils.getAgentDir).toBe('function');
    expect(typeof utils.hashPath).toBe('function');
    expect(typeof utils.isGitRepository).toBe('function');
    expect(typeof utils.hasUncommittedChanges).toBe('function');
    expect(typeof utils.selectAgentInteractive).toBe('function');
  });
});

