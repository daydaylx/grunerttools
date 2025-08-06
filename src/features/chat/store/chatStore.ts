import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChatStore } from '../types';
import { Message, ChatSession } from '@/types';
import { mockService } from '@/services/mockService';
import { v4 as uuidv4 } from 'uuid';

const generateSessionTitle = (firstMessage: string): string => {
  const words = firstMessage.split(' ').slice(0, 5);
  return words.join(' ') + (firstMessage.split(' ').length > 5 ? '...' : '');
};

// Funktion zur Konvertierung von Datumsstrings zurück in Date-Objekte
const convertDatesToObjects = (state: any) => {
  if (state.currentSession) {
    state.currentSession.createdAt = new Date(state.currentSession.createdAt);
    state.currentSession.updatedAt = new Date(state.currentSession.updatedAt);
    state.currentSession.messages.forEach((msg: any) => {
      msg.timestamp = new Date(msg.timestamp);
    });
  }
  
  if (state.sessions) {
    state.sessions.forEach((session: any) => {
      session.createdAt = new Date(session.createdAt);
      session.updatedAt = new Date(session.updatedAt);
      session.messages.forEach((msg: any) => {
        msg.timestamp = new Date(msg.timestamp);
      });
    });
  }
  
  return state;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // State
      currentSession: null,
      sessions: [],
      isLoading: false,
      error: null,
      config: {
        model: 'mock/model-1',
        temperature: 0.7,
        maxTokens: 1000,
        stream: false, // Stream deaktiviert für Mock
      },

      // Actions
      sendMessage: async (content: string) => {
        const { currentSession, config } = get();
        
        set({ isLoading: true, error: null });

        try {
          // Create new session if none exists
          let session = currentSession;
          if (!session) {
            session = {
              id: uuidv4(),
              title: generateSessionTitle(content),
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              model: config.model,
            };
          }

          // Add user message
          const userMessage: Message = {
            id: uuidv4(),
            content,
            role: 'user',
            timestamp: new Date(),
          };

          const updatedMessages = [...session.messages, userMessage];
          session = {
            ...session,
            messages: updatedMessages,
            updatedAt: new Date(),
          };

          // Update state with user message
          set(state => ({
            currentSession: session,
            sessions: state.currentSession 
              ? state.sessions.map(s => s.id === session!.id ? session! : s)
              : [...state.sessions, session!]
          }));

          // Delay for realistisches Gefühl
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock-Antwort hinzufügen
          const response = await mockService.sendMessage(updatedMessages, config);
          
          // Erstelle Assistent-Nachricht
          const assistantMessage: Message = {
            id: uuidv4(),
            content: `Dies ist eine Mock-Antwort auf: "${content}".\n\nIn einer vollständigen Implementation würde hier die Antwort des KI-Modells erscheinen. Um die App mit einem echten KI-Modell zu verbinden, müssten Sie einen gültigen API-Key konfigurieren und die OpenRouter-Integration reparieren.`,
            role: 'assistant',
            timestamp: new Date(),
            model: config.model,
          };

          // Assistent-Nachricht hinzufügen
          session.messages.push(assistantMessage);
          set(state => ({
            currentSession: session,
            sessions: state.sessions.map(s => s.id === session!.id ? session! : s),
            isLoading: false
          }));

        } catch (error) {
          console.error('Send message error:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to send message' 
          });
        }
      },

      createNewSession: () => {
        set({ currentSession: null });
      },

      selectSession: (sessionId: string) => {
        const { sessions } = get();
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
          set({ currentSession: session });
        }
      },

      deleteSession: (sessionId: string) => {
        const { sessions, currentSession } = get();
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        
        set({
          sessions: updatedSessions,
          currentSession: currentSession?.id === sessionId ? null : currentSession,
        });
      },

      updateConfig: (newConfig) => {
        set(state => ({
          config: { ...state.config, ...newConfig }
        }));
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        config: state.config,
      }),
      // Konvertiere Datum-Strings zurück in Date-Objekte beim Hydrate
      onRehydrateStorage: () => (state) => {
        if (state) {
          convertDatesToObjects(state);
        }
      },
    }
  )
);
