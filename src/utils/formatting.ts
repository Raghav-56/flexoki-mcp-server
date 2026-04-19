import type { GeneratedFile } from './types.js';

export function filesToMarkdown(files: GeneratedFile[]): string {
  return files
    .map((file) => {
      return [
        `### ${file.path}`,
        '',
        '```' + file.language,
        file.content.trimEnd(),
        '```',
      ].join('\n');
    })
    .join('\n\n');
}
