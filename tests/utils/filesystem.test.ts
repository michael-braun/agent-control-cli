import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(),
  symlinkSync: vi.fn(),
  unlinkSync: vi.fn()
}));

vi.mock('path', async (importOriginal) => {
  const actual = await importOriginal<typeof import('path')>();
  return { ...actual };
});

import { createSymlink, findJsonFiles, removeSymlink } from '../../src/utils/filesystem.js';
import { existsSync, readdirSync, statSync, symlinkSync, unlinkSync } from 'fs';

describe('filesystem utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('findJsonFiles walks directories recursively', () => {
    vi.mocked(readdirSync)
      .mockReturnValueOnce(['a.json', 'sub'] as any)
      .mockReturnValueOnce(['b.json'] as any);

    vi.mocked(statSync)
      .mockReturnValueOnce({ isDirectory: () => false } as any)
      .mockReturnValueOnce({ isDirectory: () => true } as any)
      .mockReturnValueOnce({ isDirectory: () => false } as any);

    const result = findJsonFiles('/root');
    expect(result).toEqual(['/root/a.json', '/root/sub/b.json']);
  });

  it('createSymlink throws when link exists', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    expect(() => createSymlink('/target', '/link')).toThrow('already exists');
    expect(symlinkSync).not.toHaveBeenCalled();
  });

  it('removeSymlink removes existing link', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    removeSymlink('/link');
    expect(unlinkSync).toHaveBeenCalledWith('/link');
  });
});

