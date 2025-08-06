export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  model?: string;
  tokens?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextLength?: number;
  costPer1kTokens?: {
    input: number;
    output: number;
  };
}

export interface ChatConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  stream: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export type Theme = 'light' | 'dark' | 'system';
