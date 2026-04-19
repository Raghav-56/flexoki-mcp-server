export type Framework = 'react' | 'next' | 'vue' | 'static';

export type TailwindVersion = 'v3' | 'v4' | 'none';

export type ComponentKind = 'button' | 'card' | 'layout';

export interface SetupProjectInput {
  framework: Framework;
  tailwindVersion: TailwindVersion;
  useThemeToggle?: boolean;
  includeExamples?: boolean;
}

export interface GenerateTailwindConfigInput {
  version: Exclude<TailwindVersion, 'none'>;
  importPath?: string;
}

export interface GenerateComponentInput {
  framework: Framework;
  component?: ComponentKind;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: 'css' | 'javascript' | 'typescript' | 'tsx' | 'vue' | 'html' | 'markdown';
}

export interface SetupProjectResult {
  files: GeneratedFile[];
  instructions: string;
  example?: GeneratedFile;
}
