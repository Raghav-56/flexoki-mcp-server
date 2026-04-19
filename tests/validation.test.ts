import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  generateComponentSchema,
  generateTailwindConfigSchema,
  setupProjectSchema,
} from '../src/utils/validation.js';

describe('setupProjectSchema', () => {
  it('applies defaults', () => {
    const parsed = setupProjectSchema.parse({ framework: 'react' });
    assert.equal(parsed.tailwindVersion, 'v4');
    assert.equal(parsed.useThemeToggle, true);
    assert.equal(parsed.includeExamples, true);
  });
});

describe('generateTailwindConfigSchema', () => {
  it('defaults importPath', () => {
    const parsed = generateTailwindConfigSchema.parse({ version: 'v4' });
    assert.equal(parsed.importPath, './flexoki.css');
  });
});

describe('generateComponentSchema', () => {
  it('defaults component to button', () => {
    const parsed = generateComponentSchema.parse({ framework: 'static' });
    assert.equal(parsed.component, 'button');
  });
});
