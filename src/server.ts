import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerPrompts } from './prompts/index.js';
import { registerResources } from './resources/index.js';
import { registerGenerateComponentTool } from './tools/generateComponent.js';
import { registerGenerateTailwindConfigTool } from './tools/generateTailwindConfig.js';
import { registerSetupProjectTool } from './tools/setupProject.js';
import { SERVER_NAME, SERVER_VERSION } from './utils/packageInfo.js';

export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
    },
    {
      capabilities: { logging: {} },
      instructions:
        'Use setup-flexoki-project for full scaffolding, generate-tailwind-config for targeted Tailwind config, and generate-flexoki-component for examples. Prefer semantic Flexoki tokens over raw palette values.',
    }
  );

  registerSetupProjectTool(server);
  registerGenerateTailwindConfigTool(server);
  registerGenerateComponentTool(server);

  registerResources(server);
  registerPrompts(server);

  return server;
}
