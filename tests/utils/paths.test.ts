import { describe, expect, it } from 'vitest';
import { AGENTS_DIR, REPOS_DIR } from '../../src/constants.js';
import { getAgentDir, getRepoMetaPath, getRepoPath } from '../../src/utils/paths.js';

describe('paths utils', () => {
  it('builds repo and metadata paths', () => {
    expect(getRepoPath('demo')).toBe(`${REPOS_DIR}/demo`);
    expect(getRepoMetaPath('demo')).toBe(`${REPOS_DIR}/demo.meta.json`);
  });

  it('builds agent directory paths', () => {
    expect(getAgentDir('agent-id')).toBe(`${AGENTS_DIR}/agent-id`);
  });
});

