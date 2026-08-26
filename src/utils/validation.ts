import { z } from 'zod';

export const setupProjectSchema = z.object({
  framework: z.enum(['react', 'next', 'vue', 'static']),
  tailwindVersion: z.enum(['v3', 'v4', 'none']).default('v4'),
  useThemeToggle: z.boolean().default(true),
  includeExamples: z.boolean().default(true),
});

export const generateTailwindConfigSchema = z.object({
  version: z.enum(['v3', 'v4']),
  importPath: z.string().min(1).default('./flexoki.css'),
});

export const generateComponentSchema = z.object({
  framework: z.enum(['react', 'next', 'vue', 'static']),
  component: z.enum(['button', 'card', 'layout']).default('button'),
});

export type SetupProjectSchema = z.infer<typeof setupProjectSchema>;
export type GenerateTailwindConfigSchema = z.infer<typeof generateTailwindConfigSchema>;
export type GenerateComponentSchema = z.infer<typeof generateComponentSchema>;

export interface ToolErrorResult {
  content: Array<{ type: 'text'; text: string }>;
  isError: true;
  [key: string]: unknown;
}

function formatZodIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `- ${path}: ${issue.message}`;
    })
    .join('\n');
}

/**
 * Parses raw tool-call arguments against a schema. On success returns the
 * parsed value; on failure returns an MCP error response with a readable
 * summary of every validation failure instead of throwing.
 */
export function parseToolInput<T>(
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  rawInput: unknown
): { ok: true; data: T } | { ok: false; error: ToolErrorResult } {
  let parsed: unknown;
  try {
    parsed = rawInput === undefined || rawInput === null ? {} : rawInput;
  } catch {
    parsed = {};
  }

  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      ok: false,
      error: {
        content: [
          {
            type: 'text',
            text: `Invalid arguments: expected a JSON object, received ${Array.isArray(parsed) ? 'array' : typeof parsed}.`,
          },
        ],
        isError: true,
      },
    };
  }

  const result = schema.safeParse(parsed);
  if (result.success) {
    return { ok: true, data: result.data };
  }

  return {
    ok: false,
    error: {
      content: [
        {
          type: 'text',
          text: `Invalid arguments for tool call:\n${formatZodIssues(result.error)}`,
        },
      ],
      isError: true,
    },
  };
}
