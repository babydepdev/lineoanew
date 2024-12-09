"use client";

import React from 'react';
import { Message } from '@prisma/client';
import { formatTimestamp } from '../utils/dateFormatter';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'USER';

  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} items-end gap-2`}>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 text-sm">U</span>
        </div>
      )}
      
      <div className={`max-w-[70%] group`}>
        <div
          className={`
            rounded-2xl px-4 py-2 
            ${isUser 
              ? 'bg-white border border-gray-200 rounded-bl-none' 
              : 'bg-blue-500 text-white rounded-br-none'
            }
            shadow-sm
          `}
        >
          <div className="break-words whitespace-pre-wrap text-[15px]">
            {message.content}
          </div>
        </div>
        <div 
          className={`
            text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity
            ${isUser ? 'text-left' : 'text-right'}
            text-gray-500
          `}
        >
          {formatTimestamp(message.timestamp)}
        </div>
      </div>

      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white text-sm">B</span>
        </div>
      )}
    </div>
  );
}