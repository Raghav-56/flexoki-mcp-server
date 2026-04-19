import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerGenerateComponentTool } from './generateComponent.js';
import { registerGenerateTailwindConfigTool } from './generateTailwindConfig.js';
import { registerSetupProjectTool } from './setupProject.js';

export function registerTools(server: McpServer): void {
  registerSetupProjectTool(server);
  registerGenerateTailwindConfigTool(server);
  registerGenerateComponentTool(server);
}
