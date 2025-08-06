import { Message, ChatSession, ChatConfig } from '@/types';

export interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
  config: ChatConfig;
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  updateConfig: (config: Partial<ChatConfig>) => void;
  clearError: () => void;
}

export type ChatStore = ChatState & ChatActions;
