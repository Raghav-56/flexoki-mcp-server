import {
  FLEXOKI_CSS_TEMPLATE,
  FLEXOKI_THEME_JS_TEMPLATE,
  THEME_TOGGLE_JS_TEMPLATE,
} from './templates.js';
import type {
  GenerateComponentInput,
  GenerateTailwindConfigInput,
  GeneratedFile,
  SetupProjectInput,
  SetupProjectResult,
} from './types.js';

function normalizeImportPath(importPath: string | undefined): string {
  if (!importPath || !importPath.trim()) {
    return './flexoki.css';
  }
  return importPath;
}

export function generateTailwindConfig(input: GenerateTailwindConfigInput): string {
  const importPath = normalizeImportPath(input.importPath);

  if (input.version === 'v3') {
    const themeImportPath = importPath.endsWith('.js') ? importPath : './flexoki-theme.js';
    return `const { flexokiColors } = require('${themeImportPath}');

module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        flexoki: flexokiColors,
      },
    },
  },
};
`;
  }

  return `@import "tailwindcss";
@import "${importPath}";

@theme {
  --color-fl-bg: var(--fl-bg);
  --color-fl-bg-2: var(--fl-bg-2);
  --color-fl-tx: var(--fl-tx);
  --color-fl-tx-2: var(--fl-tx-2);
  --color-fl-ui: var(--fl-ui);
  --color-fl-cy: var(--fl-cy);
  --color-fl-re: var(--fl-re);
  --color-fl-gr: var(--fl-gr);
  --color-fl-bl: var(--fl-bl);
  --color-fl-or: var(--fl-or);
  --color-fl-pu: var(--fl-pu);
  --color-fl-ma: var(--fl-ma);
}
`;
}

export function generateComponent(input: GenerateComponentInput): string {
  const kind = input.component ?? 'button';

  if (input.framework === 'static') {
    if (kind === 'card') {
      return `<article style="background: var(--fl-bg-2); border: 1px solid var(--fl-ui); padding: 1rem; border-radius: 0.5rem;">
  <h3 style="margin: 0 0 0.5rem; color: var(--fl-tx);">Flexoki Card</h3>
  <p style="margin: 0; color: var(--fl-tx-2);">Semantic tokens automatically adapt to light and dark modes.</p>
</article>
`;
    }

    if (kind === 'layout') {
      return `<main style="min-height: 100vh; background: var(--fl-bg); color: var(--fl-tx); padding: 2rem;">
  <h1>Flexoki Layout</h1>
  <p style="color: var(--fl-tx-2);">This page uses semantic Flexoki tokens.</p>
  <a href="#" style="color: var(--fl-cy);">Primary Link</a>
</main>
`;
    }

    return `<button style="background: var(--fl-cy); color: var(--fl-paper); border: 1px solid var(--fl-ui); padding: 0.5rem 0.875rem; border-radius: 0.5rem;">
  Flexoki Button
</button>
`;
  }

  if (input.framework === 'vue') {
    if (kind === 'card') {
      return `<template>
  <article class="card">
    <h3>Flexoki Card</h3>
    <p>Semantic tokens automatically adapt to light and dark modes.</p>
  </article>
</template>

<style scoped>
.card {
  background: var(--fl-bg-2);
  color: var(--fl-tx);
  border: 1px solid var(--fl-ui);
  border-radius: 0.5rem;
  padding: 1rem;
}
p { color: var(--fl-tx-2); }
</style>
`;
    }

    if (kind === 'layout') {
      return `<template>
  <main class="layout">
    <h1>Flexoki Layout</h1>
    <p>Theme tokens are active.</p>
    <a href="#">Primary Link</a>
  </main>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  padding: 2rem;
  background: var(--fl-bg);
  color: var(--fl-tx);
}
p { color: var(--fl-tx-2); }
a { color: var(--fl-cy); }
</style>
`;
    }

    return `<template>
  <button class="btn">Flexoki Button</button>
</template>

<style scoped>
.btn {
  background: var(--fl-cy);
  color: var(--fl-paper);
  border: 1px solid var(--fl-ui);
  border-radius: 0.5rem;
  padding: 0.5rem 0.875rem;
}
</style>
`;
  }

  const isTsx = input.framework === 'next' || input.framework === 'react';
  const componentName = kind === 'layout' ? 'FlexokiLayout' : kind === 'card' ? 'FlexokiCard' : 'FlexokiButton';

  if (kind === 'card') {
    return `export function ${componentName}() {
  return (
    <article
      style={{
        background: 'var(--fl-bg-2)',
        color: 'var(--fl-tx)',
        border: '1px solid var(--fl-ui)',
        borderRadius: '0.5rem',
        padding: '1rem',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Flexoki Card</h3>
      <p style={{ marginBottom: 0, color: 'var(--fl-tx-2)' }}>
        Semantic tokens automatically adapt to light and dark modes.
      </p>
    </article>
  );
}
`;
  }

  if (kind === 'layout') {
    return `export function ${componentName}() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'var(--fl-bg)',
        color: 'var(--fl-tx)',
      }}
    >
      <h1>Flexoki Layout</h1>
      <p style={{ color: 'var(--fl-tx-2)' }}>Theme tokens are active.</p>
      <a href="#" style={{ color: 'var(--fl-cy)' }}>
        Primary Link
      </a>
    </main>
  );
}
`;
  }

  return `export function ${componentName}() {
  return (
    <button
      style={{
        background: 'var(--fl-cy)',
        color: 'var(--fl-paper)',
        border: '1px solid var(--fl-ui)',
        borderRadius: '0.5rem',
        padding: '0.5rem 0.875rem',
      }}
    >
      Flexoki Button
    </button>
  );
}
`;
}

export function generateSetupProject(input: SetupProjectInput): SetupProjectResult {
  const files: GeneratedFile[] = [];
  const useThemeToggle = input.useThemeToggle ?? true;
  const includeExamples = input.includeExamples ?? true;

  files.push({
    path: 'flexoki.css',
    language: 'css',
    content: FLEXOKI_CSS_TEMPLATE,
  });

  files.push({
    path: 'flexoki-theme.js',
    language: 'javascript',
    content: FLEXOKI_THEME_JS_TEMPLATE,
  });

  if (useThemeToggle) {
    files.push({
      path: 'theme-toggle.js',
      language: 'javascript',
      content: THEME_TOGGLE_JS_TEMPLATE,
    });
  }

  if (input.tailwindVersion === 'v3') {
    files.push({
      path: 'tailwind.config.js',
      language: 'javascript',
      content: generateTailwindConfig({
        version: 'v3',
        importPath: './flexoki-theme.js',
      }),
    });
  }

  if (input.tailwindVersion === 'v4') {
    files.push({
      path: 'globals.css',
      language: 'css',
      content: generateTailwindConfig({
        version: 'v4',
        importPath: './flexoki.css',
      }),
    });
  }

  let example: GeneratedFile | undefined;
  if (includeExamples) {
    const extension = input.framework === 'vue' ? 'vue' : input.framework === 'static' ? 'html' : 'tsx';
    example = {
      path: `FlexokiExample.${extension}`,
      language: extension === 'vue' ? 'vue' : extension === 'html' ? 'html' : 'tsx',
      content: generateComponent({
        framework: input.framework,
        component: 'card',
      }),
    };
  }

  const instructions = [
    '# Flexoki Setup Instructions',
    '',
    '1. Copy generated files into your project root or styling directory.',
    '2. Import flexoki.css at the app entry point.',
    input.tailwindVersion === 'v3'
      ? '3. For Tailwind v3, place tailwind.config.js and include flexoki-theme.js.'
      : input.tailwindVersion === 'v4'
        ? '3. For Tailwind v4, include globals.css with @theme mappings.'
        : '3. Use semantic CSS variables directly in your styles.',
    useThemeToggle
      ? '4. Add <button id="theme-toggle">Dark</button> and load theme-toggle.js.'
      : '4. Optional: add a manual theme toggle later by using data-theme on <html>.',
    '5. Use semantic tokens like var(--fl-bg), var(--fl-tx), and var(--fl-cy).',
  ].join('\n');

  return {
    files,
    instructions,
    example,
  };
}
