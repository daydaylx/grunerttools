import React from 'react';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useChat } from '@/features/chat/hooks/useChat';
import { useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const { sessions, currentSession, createNewSession, selectSession, deleteSession } = useChat();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const formatDate = (dateInput: Date | string) => {
    // Stelle sicher, dass wir ein Date-Objekt haben
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 z-50 h-full w-64 transform bg-gray-50 transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
          'dark:bg-gray-800',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chats</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={createNewSession}
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat sessions */}
          <div className="flex-1 overflow-y-auto p-2">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No conversations yet
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={clsx(
                      'group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors',
                      'hover:bg-gray-100 dark:hover:bg-gray-700',
                      currentSession?.id === session.id 
                        ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500' 
                        : ''
                    )}
                    onClick={() => selectSession(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(session.updatedAt)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      title="Delete chat"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
