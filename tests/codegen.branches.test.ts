import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  generateComponent,
  generateSetupProject,
  generateTailwindConfig,
} from '../src/utils/codegen.js';
import { SERVER_NAME, SERVER_VERSION } from '../src/utils/packageInfo.js';

describe('generateTailwindConfig edge cases', () => {
  it('v3 falls back to ./flexoki-theme.js when importPath is not a .js file', () => {
    const output = generateTailwindConfig({ version: 'v3', importPath: './flexoki.css' });
    assert.match(output, /require\('\.\/flexoki-theme\.js'\)/);
  });

  it('v4 falls back to the default import path when blank', () => {
    const output = generateTailwindConfig({ version: 'v4', importPath: '   ' });
    assert.match(output, /@import "\.\/flexoki\.css";/);
  });
});

describe('generateComponent remaining branches', () => {
  it('defaults component to button', () => {
    const output = generateComponent({ framework: 'react' });
    assert.match(output, /export function FlexokiButton/);
  });

  it('generates next layout component', () => {
    const output = generateComponent({ framework: 'next', component: 'layout' });
    assert.match(output, /export function FlexokiLayout/);
    assert.match(output, /<main/);
    assert.match(output, /var\(--fl-bg\)/);
  });

  it('generates vue button and static layout', () => {
    const vueButton = generateComponent({ framework: 'vue', component: 'button' });
    assert.match(vueButton, /<template>/);
    assert.match(vueButton, /class="btn"/);

    const staticLayout = generateComponent({ framework: 'static', component: 'layout' });
    assert.match(staticLayout, /<main style=/);
    assert.match(staticLayout, /Flexoki Layout/);
  });
});

describe('generateSetupProject options', () => {
  it('omits toggle, tailwind config, and example when disabled', () => {
    const result = generateSetupProject({
      framework: 'static',
      tailwindVersion: 'none',
      useThemeToggle: false,
      includeExamples: false,
    });

    const paths = result.files.map((f) => f.path);
    assert.ok(!paths.includes('theme-toggle.js'));
    assert.ok(!paths.includes('tailwind.config.js'));
    assert.ok(!paths.includes('globals.css'));
    assert.equal(result.example, undefined);
    assert.match(result.instructions, /Use semantic CSS variables directly/);
    assert.match(result.instructions, /Optional: add a manual theme toggle/);
  });

  it('v3 setup includes tailwind.config.js and an html example for static', () => {
    const result = generateSetupProject({
      framework: 'static',
      tailwindVersion: 'v3',
      useThemeToggle: true,
      includeExamples: true,
    });

    const paths = result.files.map((f) => f.path);
    assert.ok(paths.includes('tailwind.config.js'));
    assert.ok(paths.includes('theme-toggle.js'));
    assert.equal(result.example?.path, 'FlexokiExample.html');
    assert.equal(result.example?.language, 'html');
    assert.match(result.instructions, /Tailwind v3/);
  });

  it('vue examples use the .vue extension and language', () => {
    const result = generateSetupProject({
      framework: 'vue',
      tailwindVersion: 'none',
      includeExamples: true,
    });
    assert.equal(result.example?.path, 'FlexokiExample.vue');
    assert.equal(result.example?.language, 'vue');
  });
});

describe('packageInfo', () => {
  it('exposes server name and a non-empty semver version', () => {
    assert.equal(SERVER_NAME, 'flexoki-mcp-server');
    assert.match(SERVER_VERSION, /^\d+\.\d+\.\d+$/);
  });
});
