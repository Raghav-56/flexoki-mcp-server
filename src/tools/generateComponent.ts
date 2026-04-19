import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { generateComponent } from '../utils/codegen.js';
import { generateComponentSchema } from '../utils/validation.js';

function inferLanguage(framework: 'react' | 'next' | 'vue' | 'static'): string {
  if (framework === 'vue') return 'vue';
  if (framework === 'static') return 'html';
  return 'tsx';
}

export function registerGenerateComponentTool(server: McpServer): void {
  server.registerTool(
    'generate-flexoki-component',
    {
      title: 'Generate Flexoki Component',
      description:
        'Generates a framework-specific example component using semantic Flexoki tokens.',
      inputSchema: generateComponentSchema,
    },
    async (rawInput) => {
      const input = generateComponentSchema.parse(rawInput);
      const source = generateComponent(input);
      const language = inferLanguage(input.framework);

      return {
        content: [
          {
            type: 'text',
            text: [
              `# ${input.framework} ${input.component} Example`,
              '',
              `\`\`\`${language}`,
              source.trimEnd(),
              '```',
            ].join('\n'),
          },
        ],
      };
    }
  );
}
