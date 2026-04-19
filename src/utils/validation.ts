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
