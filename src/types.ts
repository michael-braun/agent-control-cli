export interface AgentConfig {
  id: string;
  repo: string;
  name: string;
}

export interface SkillConfig {
  id: string;
  repo: string;
  name: string;
}

export interface Config {
  agents: AgentConfig[];
  skills: SkillConfig[];
  symlinks: Record<string, string[]>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  files: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  dir: string;
  files: string[];
}

export interface Steering {
  name: string;
  description: string;
  dir: string;
  files: string[];
}

export interface RepoMeta {
  agents: Agent[];
  skills: Skill[];
  steerings?: Steering[];
  lastUpdated?: string;
}

export interface KnowledgeBaseResource {
  type: 'knowledgeBase';
  source: string;
  name: string;
  indexType?: 'fast' | 'best';
  include?: string[];
  exclude?: string[];
  autoUpdate?: boolean;
}

export type AgentResource = string | KnowledgeBaseResource;

export interface AgentJson {
  id?: string;
  name?: string;
  description?: string;
  prompt?: string;
  resources?: AgentResource[];
}
