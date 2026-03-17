import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { extractMarkdownLinks } from '../../src/utils/markdown.js';

describe('extractMarkdownLinks', () => {
  const dirs: string[] = [];

  afterEach(() => {
    for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
  });

  it('returns local links and follows nested markdown files without loops', () => {
    const root = mkdtempSync(join(tmpdir(), 'ac-markdown-'));
    dirs.push(root);

    const docs = join(root, 'docs');
    mkdirSync(docs, { recursive: true });

    const main = join(docs, 'main.md');
    const child = join(docs, 'child.md');
    const txt = join(docs, 'notes.txt');

    writeFileSync(main, '[child](child.md) [notes](notes.txt) [web](https://example.com)');
    writeFileSync(child, '[back](main.md)');
    writeFileSync(txt, 'hello');

    const links = extractMarkdownLinks(main);

    expect(links).toContain(child);
    expect(links).toContain(txt);
    expect(links.filter(l => l === main).length).toBeLessThanOrEqual(1);
  });

  it('returns empty array for missing files', () => {
    expect(extractMarkdownLinks('/does/not/exist.md')).toEqual([]);
  });
});

