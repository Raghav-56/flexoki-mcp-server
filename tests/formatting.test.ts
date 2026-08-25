import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { filesToMarkdown } from '../src/utils/formatting.js';
import type { GeneratedFile } from '../src/utils/types.js';

describe('filesToMarkdown', () => {
  it('renders an empty list as an empty string', () => {
    assert.equal(filesToMarkdown([]), '');
  });

  it('wraps each file in a heading and fenced code block', () => {
    const files: GeneratedFile[] = [
      { path: 'flexoki.css', language: 'css', content: ':root {}\n' },
    ];
    const md = filesToMarkdown(files);
    assert.match(md, /^### flexoki\.css\n\n```css\n:root \{\}\n```$/);
  });

  it('joins multiple files with a blank line separator and trims trailing whitespace', () => {
    const files: GeneratedFile[] = [
      { path: 'a.css', language: 'css', content: '.a {}\n\n\n' },
      { path: 'b.js', language: 'javascript', content: 'const b = 1;\n' },
    ];
    const md = filesToMarkdown(files);
    assert.ok(md.includes('### a.css'));
    assert.ok(md.includes('### b.js'));
    // Trailing blank lines of content are trimmed before the closing fence.
    assert.match(md, /\.a \{\}\n```/);
    assert.equal(md.split('\n\n').filter(Boolean).length > 1, true);
  });
});
