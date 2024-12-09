import React, { useEffect, useRef } from 'react';
import { formatTimestamp } from '../utils/dateFormatter';
import { useLineMessages } from '../hooks/useLineMessages';

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { botMessages, userMessages, isLoading } = useLineMessages(conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [botMessages, userMessages]);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  const allMessages = [...botMessages, ...userMessages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  if (allMessages.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">No messages yet</div>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50">
      {allMessages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === 'USER' ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`
              max-w-[70%] rounded-2xl px-4 py-3 shadow-sm
              ${msg.sender === 'USER' 
                ? 'bg-white text-gray-800 border border-gray-100' 
                : 'bg-blue-600 text-white'
              }
              ${msg.sender === 'USER' 
                ? 'rounded-tl-sm' 
                : 'rounded-tr-sm'
              }
            `}
          >
            <div className="text-sm mb-1 font-medium opacity-75">
              {msg.sender === 'USER' ? 'User' : 'LINE Official Account'}
            </div>
            <div className="break-words whitespace-pre-wrap text-base">
              {msg.content}
            </div>
            <div className={`
              text-xs mt-1
              ${msg.sender === 'USER' ? 'text-gray-500' : 'text-blue-100'}
            `}>
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}