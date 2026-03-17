import { describe, expect, it } from 'vitest';
import { AGENTS_DIR, BASE_DIR, CONFIG_PATH, KIRO_AGENTS_DIR, REPOS_DIR } from '../src/constants.js';

describe('constants', () => {
  it('exposes expected base paths', () => {
    expect(BASE_DIR).toContain('.agent-control');
    expect(CONFIG_PATH).toContain('.agent-control/config.json');
    expect(REPOS_DIR).toContain('.agent-control/repos');
    expect(AGENTS_DIR).toContain('.agent-control/agents');
    expect(KIRO_AGENTS_DIR).toContain('.kiro/agents');
  });
});

