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

describe('mcp server integration', () => {
  it('lists capabilities and resolves prompts without arguments', async () => {
    await withClient(async (client) => {
      const tools = await client.listTools();
      const resources = await client.listResources();
      const prompts = await client.listPrompts();

      assert.ok(tools.tools.some((tool) => tool.name === 'setup-flexoki-project'));
      assert.ok(resources.resources.some((resource) => resource.uri === 'template://flexoki/css'));
      assert.ok(prompts.prompts.some((prompt) => prompt.name === 'setup-guide'));

      const setupGuide = await client.getPrompt({ name: 'setup-guide' });
      assert.ok((setupGuide.messages?.length ?? 0) > 0);
    });
  });
});
