import { describe, expect, it } from 'vitest';
import { hashPath } from '../../src/utils/hash.js';

describe('hashPath', () => {
  it('returns a stable 16 char hash for the same input', () => {
    const a = hashPath('/tmp/example');
    const b = hashPath('/tmp/example');

    expect(a).toBe(b);
    expect(a).toHaveLength(16);
    expect(a).toMatch(/^[a-f0-9]{16}$/);
  });

  it('returns different hashes for different inputs', () => {
    expect(hashPath('/tmp/a')).not.toBe(hashPath('/tmp/b'));
  });
});

