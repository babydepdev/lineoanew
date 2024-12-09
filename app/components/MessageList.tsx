import React, { useEffect, useRef } from 'react';
import { useLineMessages } from '../hooks/useLineMessages';
import { formatTimestamp } from '../utils/dateFormatter';

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { botMessages, userMessages, isLoading, error } = useLineMessages(conversationId);

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

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error loading messages: {error.message}</div>
      </div>
    );
  }

  const allMessages = [...botMessages, ...userMessages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
      {allMessages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === 'USER' ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              msg.sender === 'USER'
                ? 'bg-white text-gray-800 border border-gray-200'
                : 'bg-blue-500 text-white'
            }`}
          >
            <div className="text-sm mb-1 font-semibold">
              {msg.sender === 'USER' ? 'User' : 'LINE Official Account'}
            </div>
            <div className="break-words whitespace-pre-wrap text-base">
              {msg.content}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}