"use client";

import React from 'react';
import { ConversationWithMessages } from '../types/chat';
import { ConversationPreview } from './ConversationPreview';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { LineAccountTabs } from './chat/LineAccountTabs';

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
  const [selectedAccountId, setSelectedAccountId] = React.useState<string | null>(null);

  const filteredConversations = React.useMemo(() => {
    if (!selectedAccountId) return conversations;
    return conversations.filter(conv => 
      conv.platform === 'LINE' && conv.lineAccountId === selectedAccountId
    );
  }, [conversations, selectedAccountId]);

  const sortedConversations = React.useMemo(() => {
    return [...filteredConversations].sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [filteredConversations]);

  return (
    <>
      <LineAccountTabs 
        selectedAccountId={selectedAccountId}
        onAccountSelect={setSelectedAccountId}
      />
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
                {selectedAccountId 
                  ? "No chats found for this LINE account"
                  : "Start chatting to see your conversations here"
                }
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}