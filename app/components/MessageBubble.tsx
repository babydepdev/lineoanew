"use client";

import React from 'react';
import { Message } from '@prisma/client';
import { formatTimestamp } from '../utils/dateFormatter';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'USER';

  return (
    <div className={cn(
      "flex items-end gap-2 group",
      isUser ? "justify-start" : "justify-end"
    )}>
      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-100 text-blue-600">U</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("max-w-[70%]")}>
        <div className={cn(
          "rounded-2xl px-4 py-2 shadow-sm",
          isUser 
            ? "bg-white border border-slate-200 rounded-bl-none" 
            : "bg-blue-500 text-white rounded-br-none"
        )}>
          <div className="break-words whitespace-pre-wrap text-[15px]">
            {message.content}
          </div>
        </div>
        <div className={cn(
          "text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          isUser ? "text-left" : "text-right",
          "text-slate-500"
        )}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>

      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-500 text-white">B</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}