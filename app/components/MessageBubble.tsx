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
  // Ensure correct sender identification
  const isUser = message.sender === 'USER';
  const isTempMessage = message.id.startsWith('temp-');

  // Don't show temporary bot messages as user messages
  const displayAsUser = isUser && !isTempMessage;

  return (
    <div className={cn(
      "flex items-end gap-2 group",
      displayAsUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          displayAsUser ? "bg-primary text-primary-foreground" : "bg-muted/10 text-muted"
        )}>
          {displayAsUser ? 'U' : 'B'}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-[70%] space-y-1",
        displayAsUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-2.5 text-sm",
          displayAsUser ? "message-bubble-user" : "message-bubble-bot",
          isTempMessage && "opacity-70"
        )}>
          {message.content}
        </div>
        <div className={cn(
          "px-2 text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity",
          displayAsUser ? "text-right" : "text-left"
        )}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
}