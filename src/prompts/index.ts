import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerPrompts(server: McpServer): void {
  // Keep prompts argument-free so clients that omit `arguments` can still resolve them.
  server.registerPrompt(
    'setup-guide',
    {
      title: 'Flexoki Setup Guide',
      description: 'Returns a guided prompt to help set up Flexoki in a target framework.',
    },
    async () => {
      const framework = 'next';
      const tailwindVersion = 'v4';

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                'Help me set up Flexoki in my project.',
                `Framework: ${framework}`,
                `Tailwind: ${tailwindVersion}`,
                'Provide file placement, imports, and a minimal verification checklist.',
              ].join('\n'),
            },
          },
        ],
      };
    }
  );

  server.registerPrompt(
    'troubleshoot',
    {
      title: 'Flexoki Troubleshooter',
      description: 'Returns a troubleshooting prompt for common Flexoki integration issues.',
    },
    async () => {
      const issue = 'dark mode does not toggle';

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                'Diagnose and fix this Flexoki integration issue:',
                issue,
                'Check CSS import order, data-theme behavior, and Tailwind mappings.',
              ].join('\n'),
            },
          },
        ],
      };
    }
  );

  server.registerPrompt(
    'customization',
    {
      title: 'Flexoki Customization Guide',
      description: 'Returns a prompt focused on customizing Flexoki tokens safely.',
    },
    async () => {
      const goal = 'Adjust accent colors while preserving contrast';

      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: [
                'Help customize Flexoki tokens for this goal:',
                goal,
                'Keep semantic token names stable and describe migration-safe changes.',
              ].join('\n'),
            },
          },
        ],
      };
    }
  );
}
