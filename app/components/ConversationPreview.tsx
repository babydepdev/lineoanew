import React from 'react';
import { ConversationWithMessages } from '../types/chat';
import { formatTimestamp } from '../utils/dateFormatter';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';

interface ConversationPreviewProps {
  conversation: ConversationWithMessages;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationPreview({
  conversation,
  isSelected,
  onClick,
}: ConversationPreviewProps) {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors",
        isSelected && "bg-slate-100 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <div className="flex gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className={cn(
            "text-lg",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : "bg-slate-100 dark:bg-slate-700 text-muted"
          )}>
            {conversation.platform === 'LINE' ? 'L' : 'F'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <div className="space-y-1">
              <h3 className="font-medium leading-none">
                {conversation.platform} Chat
              </h3>
              <p className="text-xs text-muted truncate">
                ID: {conversation.userId.slice(0, 8)}...
              </p>
            </div>
            {lastMessage && (
              <span className="text-xs text-muted shrink-0 ml-2">
                {formatTimestamp(lastMessage.timestamp)}
              </span>
            )}
          </div>
          
          {lastMessage && (
            <p className="text-sm text-muted truncate">
              <span className={cn(
                "font-medium mr-1",
                lastMessage.sender === 'USER' ? "text-primary" : "text-muted"
              )}>
                {lastMessage.sender === 'USER' ? 'User:' : 'Bot:'}
              </span>
              {lastMessage.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}