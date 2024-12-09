"use client";

import React from 'react';
import { ConversationWithMessages } from '../types/chat';
import { ConversationPreview } from './ConversationPreview';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface ConversationListProps {
  conversations: ConversationWithMessages[];
  onSelect: (conversation: ConversationWithMessages) => void;
  selectedId?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  onSelect,
  selectedId 
}) => {
  const sortedConversations = [...conversations].sort((a, b) => {
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  return (
    <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Conversations</h2>
        <p className="text-sm text-slate-500 mt-1">
          {conversations.length} total
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="divide-y divide-slate-200">
          {sortedConversations.map((conversation) => (
            <React.Fragment key={conversation.id}>
              <ConversationPreview
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                onClick={() => onSelect(conversation)}
              />
              <Separator />
            </React.Fragment>
          ))}
          
          {sortedConversations.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <svg 
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="mt-4 text-sm font-medium">No conversations yet</p>
              <p className="mt-1 text-sm text-slate-400">
                Start chatting to see your conversations here
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};