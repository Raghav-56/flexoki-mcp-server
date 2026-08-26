import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { generateTailwindConfig } from '../utils/codegen.js';
import { parseToolInput, generateTailwindConfigSchema } from '../utils/validation.js';

export function registerGenerateTailwindConfigTool(server: McpServer): void {
  server.registerTool(
    'generate-tailwind-config',
    {
      title: 'Generate Tailwind Config',
      description:
        'Generates Tailwind v3 config or Tailwind v4 @theme CSS mapped to Flexoki semantic tokens.',
      inputSchema: generateTailwindConfigSchema,
    },
    async (rawInput) => {
      const parsed = parseToolInput(generateTailwindConfigSchema, rawInput);
      if (!parsed.ok) {
        return parsed.error;
      }
      const input = parsed.data;
      const configText = generateTailwindConfig({
        version: input.version,
        importPath: input.importPath,
      });

      const language = input.version === 'v3' ? 'javascript' : 'css';

      return {
        content: [
          {
            type: 'text',
            text: [
              `# Tailwind ${input.version.toUpperCase()} Flexoki Config`,
              '',
              `\`\`\`${language}`,
              configText.trimEnd(),
              '```',
            ].join('\n'),
          },
        ],
      };
    }
  );
}
