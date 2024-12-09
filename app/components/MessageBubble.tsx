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
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          isUser ? "bg-primary text-primary-foreground" : "bg-muted/10 text-muted"
        )}>
          {isUser ? 'U' : 'B'}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-[70%] space-y-1",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2.5 text-sm",
          isUser ? "message-bubble-user" : "message-bubble-bot",
          message.id.startsWith('temp-') && "opacity-70"
        )}>
          {message.content}
        </div>
        <div className={cn(
          "px-2 text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "text-right" : "text-left"
        )}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
}