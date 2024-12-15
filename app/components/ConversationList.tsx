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

export default function ConversationList({ 
  conversations, 
  onSelect,
  selectedId 
}: ConversationListProps) {
  const sortedConversations = [...conversations].sort((a, b) => {
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  return (
    <ScrollArea className="flex-1 w-full">
      <div className="divide-y divide-slate-200">
        {sortedConversations.map((conversation) => (
          <React.Fragment key={conversation.id}>
            <ConversationPreview
              conversation={conversation}
              isSelected={selectedId === conversation.id}
              onClick={() => onSelect(conversation)}
            />
            <Separator className="last:hidden" />
          </React.Fragment>
        ))}
        
        {sortedConversations.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-900">No conversations yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Start chatting to see your conversations here
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}