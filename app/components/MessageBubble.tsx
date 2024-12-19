import React from 'react';
import { Message } from '@prisma/client';
import { formatTimestamp } from '../utils/dateFormatter';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { ProfileAvatar } from './ProfileAvatar';
import { useChatState } from '../features/chat/useChatState';
import { MessageActions } from './chat/MessageActions';
import Image from 'next/image';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { conversations } = useChatState();
  const conversation = conversations.find(conv => conv.id === message.conversationId);
  const isUser = message.sender === 'USER';
  const isTempMessage = message.id.startsWith('temp-');
  const displayAsUser = isUser && !isTempMessage;
  const isImage = message.contentType === 'image';

  return (
    <div className={cn(
      "flex items-end gap-2 group relative px-2 sm:px-4 lg:px-8",
      displayAsUser ? "flex-row-reverse" : "flex-row"
    )}>
      {displayAsUser ? (
        <ProfileAvatar 
          userId={conversation?.userId || ''} 
          platform={message.platform}
        />
      ) : (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-muted/10 text-muted">
            B
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-[70%] space-y-1",
        displayAsUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl overflow-hidden",
          displayAsUser 
            ? "bg-primary text-primary-foreground rounded-br-none" 
            : "bg-slate-800 text-white rounded-bl-none",
          isTempMessage && "opacity-70",
          isImage ? "p-0" : "px-4 py-2.5"
        )}>
          {isImage && message.contentUrl ? (
            <div className="relative w-[240px] h-[240px]">
              <Image
                src={message.contentUrl}
                alt="Message image"
                fill
                className="object-cover"
                sizes="(max-width: 240px) 100vw, 240px"
              />
            </div>
          ) : (
            <span className="text-sm">{message.content}</span>
          )}
        </div>
        <div className={cn(
          "px-2 text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity",
          displayAsUser ? "text-right" : "text-left"
        )}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>

      <MessageActions message={message} />
    </div>
  );
}