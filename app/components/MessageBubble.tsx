import React from 'react';
import { Message } from '@prisma/client';
import { formatTimestamp } from '../utils/dateFormatter';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { ProfileAvatar } from './ProfileAvatar';
import { useChatState } from '../features/chat/useChatState';
import { MessageActions } from './chat/MessageActions';
import { Image } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { conversations } = useChatState();
  const conversation = conversations.find(conv => conv.id === message.conversationId);
  const isUser = message.sender === 'USER';
  const isTempMessage = message.id.startsWith('temp-');
  const displayAsUser = isUser && !isTempMessage;
  const isImage = message.content.startsWith('[Image]');

  // Extract image URL from content if it's an image message
  const imageUrl = isImage ? message.content.replace('[Image]', '').trim() : null;

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
          "px-4 py-2.5 rounded-2xl",
          displayAsUser 
            ? "bg-primary text-primary-foreground rounded-br-none" 
            : "bg-slate-800 text-white rounded-bl-none",
          isTempMessage && "opacity-70",
          isImage && "p-1" // Reduce padding for images
        )}>
          {isImage && imageUrl ? (
            <div className="relative">
              <img 
                src={imageUrl}
                alt="Sent image"
                className="max-w-full rounded-lg max-h-[300px] object-contain"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
                <Image className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <span className="text-sm flex items-center gap-2">
              {isImage && <Image className="w-4 h-4" />}
              {message.content}
            </span>
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