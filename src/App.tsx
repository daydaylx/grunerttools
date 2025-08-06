import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ChatView } from '@/features/chat/components/ChatView';
import { useTheme } from '@/hooks/useTheme';

const App: React.FC = () => {
  // Initialize theme
  useTheme();

  return (
    <MainLayout>
      <ChatView />
    </MainLayout>
  );
};

export default App;
