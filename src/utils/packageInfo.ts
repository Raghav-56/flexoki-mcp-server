import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SERVER_NAME = 'flexoki-mcp-server';

function resolveServerVersion(): string {
  try {
    const currentFile = fileURLToPath(import.meta.url);
    const currentDir = dirname(currentFile);
    const packageJsonPath = resolve(currentDir, '../../package.json');
    const packageJsonText = readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonText) as { version?: unknown };

    if (typeof packageJson.version === 'string' && packageJson.version.trim()) {
      return packageJson.version;
    }
  } catch {
    // Fall back to a safe value when package metadata is unavailable.
  }

  return '0.0.0';
}

export const SERVER_VERSION = resolveServerVersion();
