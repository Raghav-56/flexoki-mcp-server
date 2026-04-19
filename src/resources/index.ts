import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import {
  FLEXOKI_CSS_TEMPLATE,
  FLEXOKI_THEME_JS_TEMPLATE,
  THEME_TOGGLE_JS_TEMPLATE,
} from '../utils/templates.js';
import { generateTailwindConfig } from '../utils/codegen.js';

export function registerResources(server: McpServer): void {
  server.registerResource(
    'template-flexoki-css',
    'template://flexoki/css',
    {
      title: 'Flexoki CSS Template',
      description: 'Raw and semantic Flexoki CSS token file.',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/css',
          text: FLEXOKI_CSS_TEMPLATE,
        },
      ],
    })
  );

  server.registerResource(
    'template-flexoki-theme-js',
    'template://flexoki/theme-js',
    {
      title: 'Flexoki Tailwind Theme JS Template',
      description: 'Tailwind v3-compatible Flexoki colors export.',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/javascript',
          text: FLEXOKI_THEME_JS_TEMPLATE,
        },
      ],
    })
  );

  server.registerResource(
    'template-theme-toggle-js',
    'template://flexoki/toggle-js',
    {
      title: 'Theme Toggle JS Template',
      description: 'No-dependency data-theme dark-mode toggle script.',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/javascript',
          text: THEME_TOGGLE_JS_TEMPLATE,
        },
      ],
    })
  );

  server.registerResource(
    'config-tailwind-v3',
    'config://tailwind/v3-base',
    {
      title: 'Tailwind v3 Base Flexoki Config',
      description: 'A baseline tailwind.config.js using flexoki-theme.js.',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/javascript',
          text: generateTailwindConfig({ version: 'v3', importPath: './flexoki-theme.js' }),
        },
      ],
    })
  );

  server.registerResource(
    'config-tailwind-v4',
    'config://tailwind/v4-theme',
    {
      title: 'Tailwind v4 @theme Flexoki Config',
      description: 'A baseline globals.css mapping Flexoki variables via @theme.',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/css',
          text: generateTailwindConfig({ version: 'v4', importPath: './flexoki.css' }),
        },
      ],
    })
  );
}
