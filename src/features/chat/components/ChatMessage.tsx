import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { Message } from '@/types';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const isUser = message.role === 'user';

  return (
    <div className={clsx(
      'group flex w-full gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50',
      isUser ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
    )}>
      {/* Avatar */}
      <div className={clsx(
        'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full',
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {isUser ? 'You' : 'Assistant'}
            </span>
            {message.model && !isUser && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {message.model}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 w-6 p-0"
              title="Copy message"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none break-words text-gray-700 dark:text-gray-300 dark:prose-invert">
          <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
        </div>
      </div>
    </div>
  );
};
