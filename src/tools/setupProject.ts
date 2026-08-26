import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { generateSetupProject } from '../utils/codegen.js';
import { filesToMarkdown } from '../utils/formatting.js';
import { parseToolInput, setupProjectSchema } from '../utils/validation.js';

export function registerSetupProjectTool(server: McpServer): void {
  server.registerTool(
    'setup-flexoki-project',
    {
      title: 'Setup Flexoki Project',
      description:
        'Generates a complete Flexoki setup for React, Next.js, Vue, or static HTML, including theme files and Tailwind integration.',
      inputSchema: setupProjectSchema,
    },
    async (rawInput) => {
      const parsed = parseToolInput(setupProjectSchema, rawInput);
      if (!parsed.ok) {
        return parsed.error;
      }
      const input = parsed.data;
      const result = generateSetupProject(input);

      const blocks = [
        '# Flexoki Setup Bundle',
        '',
        '## Generated Files',
        filesToMarkdown(result.files),
      ];

      if (result.example) {
        blocks.push('', '## Example Component', filesToMarkdown([result.example]));
      }

      blocks.push('', '## Setup Instructions', result.instructions);

      return {
        content: [
          {
            type: 'text',
            text: blocks.join('\n'),
          },
        ],
      };
    }
  );
}
