import { useChatStore } from '../store/chatStore';

export const useChat = () => {
  const {
    currentSession,
    sessions,
    isLoading,
    error,
    config,
    sendMessage,
    createNewSession,
    selectSession,
    deleteSession,
    updateConfig,
    clearError,
  } = useChatStore();

  return {
    // State
    currentSession,
    sessions,
    isLoading,
    error,
    config,
    messages: currentSession?.messages || [],

    // Actions
    sendMessage,
    createNewSession,
    selectSession,
    deleteSession,
    updateConfig,
    clearError,
  };
};
