import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  generateComponentSchema,
  generateTailwindConfigSchema,
  parseToolInput,
  setupProjectSchema,
} from '../src/utils/validation.js';

describe('parseToolInput', () => {
  it('returns parsed data for valid arguments', () => {
    const result = parseToolInput(setupProjectSchema, { framework: 'react' });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.data.framework, 'react');
      assert.equal(result.data.tailwindVersion, 'v4');
    }
  });

  it('treats null or missing arguments as an empty object so defaults apply', () => {
    const result = parseToolInput(generateComponentSchema, undefined);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.isError, true);
      assert.match(result.error.content[0].text, /framework/i);
    }
  });

  it('rejects non-object arguments with a type-aware message', () => {
    for (const bad of ['react', 42, ['react'], true]) {
      const result = parseToolInput(setupProjectSchema, bad);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.error.isError, true);
        assert.match(result.error.content[0].text, /expected a JSON object/i);
      }
    }
  });

  it('lists each invalid field in the error response instead of throwing', () => {
    const result = parseToolInput(generateTailwindConfigSchema, { version: 'v2' });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error.isError, true);
      const text = result.error.content[0].text;
      assert.match(text, /Invalid arguments for tool call/);
      assert.match(text, /version/);
    }
  });

  it('reports multiple issues at once', () => {
    const result = parseToolInput(setupProjectSchema, {
      framework: 'svelte',
      tailwindVersion: 'v1',
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      const text = result.error.content[0].text;
      assert.match(text, /framework/);
      assert.match(text, /tailwindVersion/);
    }
  });

  it('error shape is a valid MCP tool error response', () => {
    const result = parseToolInput(generateComponentSchema, null);
    assert.equal(result.ok, false);
    if (!result.ok) {
      const err = result.error;
      assert.deepEqual(
        Object.keys(err).sort(),
        ['content', 'isError']
      );
      assert.equal(err.isError, true);
      assert.equal(err.content[0].type, 'text');
      assert.equal(typeof err.content[0].text, 'string');
      assert.ok(err.content[0].text.length > 0);
    }
  });
});
