import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function withClient(run: (client: Client) => Promise<void>): Promise<void> {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['--import', 'tsx', 'src/index.ts'],
    cwd: process.cwd(),
  });

  const client = new Client(
    {
      name: 'flexoki-mcp-server-tests',
      version: '0.0.0',
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);

  try {
    await run(client);
  } finally {
    await client.close();
  }
}

function textContent(result: unknown): string {
  const content = (result as { content?: Array<{ type: string; text?: string }> }).content ?? [];
  return content
    .filter((block) => block.type === 'text')
    .map((block) => block.text ?? '')
    .join('\n');
}

describe('tool handlers', () => {
  it(
    'setup-flexoki-project returns bundle with theme files and instructions',
    { timeout: 30000 },
    async () => {
      await withClient(async (client) => {
        const result = await client.callTool({
          name: 'setup-flexoki-project',
          arguments: {
            framework: 'next',
            tailwindVersion: 'v4',
            useThemeToggle: true,
            includeExamples: true,
          },
        });

        assert.equal((result as { isError?: boolean }).isError, undefined);
        const text = textContent(result);
        assert.match(text, /# Flexoki Setup Bundle/);
        assert.match(text, /## Generated Files/);
        assert.match(text, /## Example Component/);
        assert.match(text, /## Setup Instructions/);
      });
    }
  );

  it('generate-tailwind-config returns v3 javascript config', { timeout: 30000 }, async () => {
    await withClient(async (client) => {
      const result = await client.callTool({
        name: 'generate-tailwind-config',
        arguments: { version: 'v3', importPath: './flexoki-theme.js' },
      });

      const text = textContent(result);
      assert.match(text, /# Tailwind V3 Flexoki Config/);
      assert.match(text, /```javascript/);
      assert.match(text, /flexoki-theme\.js/);
    });
  });

  it('generate-flexoki-component returns vue card example', { timeout: 30000 }, async () => {
    await withClient(async (client) => {
      const result = await client.callTool({
        name: 'generate-flexoki-component',
        arguments: { framework: 'vue', component: 'card' },
      });

      const text = textContent(result);
      assert.match(text, /# vue card Example/);
      assert.match(text, /```vue/);
    });
  });
});
