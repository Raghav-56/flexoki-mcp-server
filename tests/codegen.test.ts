import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  generateComponent,
  generateSetupProject,
  generateTailwindConfig,
} from '../src/utils/codegen.js';

describe('generateTailwindConfig', () => {
  it('returns v3 config using flexoki-theme.js', () => {
    const output = generateTailwindConfig({ version: 'v3', importPath: './flexoki-theme.js' });
    assert.match(output, /flexoki-theme\.js/);
    assert.match(output, /darkMode/);
  });

  it('returns v4 @theme css', () => {
    const output = generateTailwindConfig({ version: 'v4', importPath: './flexoki.css' });
    assert.match(output, /@theme/);
    assert.match(output, /--color-fl-bg/);
  });
});

describe('generateComponent', () => {
  it('generates static card snippet', () => {
    const output = generateComponent({ framework: 'static', component: 'card' });
    assert.match(output, /var\(--fl-bg-2\)/);
    assert.match(output, /<article/);
  });

  it('generates react button component', () => {
    const output = generateComponent({ framework: 'react', component: 'button' });
    assert.match(output, /export function FlexokiButton/);
    assert.match(output, /var\(--fl-cy\)/);
  });
});

describe('generateSetupProject', () => {
  it('includes core files and v4 globals css', () => {
    const result = generateSetupProject({
      framework: 'next',
      tailwindVersion: 'v4',
      useThemeToggle: true,
      includeExamples: true,
    });

    const fileNames = result.files.map((f) => f.path);
    assert.ok(fileNames.includes('flexoki.css'));
    assert.ok(fileNames.includes('flexoki-theme.js'));
    assert.ok(fileNames.includes('theme-toggle.js'));
    assert.ok(fileNames.includes('globals.css'));
    assert.match(result.instructions, /Flexoki Setup Instructions/);
    assert.match(result.example?.path ?? '', /FlexokiExample/);
  });
});
