"use client";

import React from 'react';
import { RuntimeConversation } from '@/app/types/conversation';
import { ConversationPreview } from './ConversationPreview';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { MessageCircle } from 'lucide-react';

interface ConversationListProps {
  conversations: RuntimeConversation[];
  onSelect: (conversation: RuntimeConversation) => void;
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
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white">
      <div className="flex-none p-4 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-slate-900">Conversations</h2>
        </div>
        <p className="text-sm text-slate-500 mt-1 ml-7">
          {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
        </p>
      </div>
      
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
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-slate-900">No conversations yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Start chatting to see your conversations here
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}