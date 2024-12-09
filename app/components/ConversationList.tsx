"use client";

import React from 'react';
import { ConversationWithMessages } from '../types/chat';
import { ConversationPreview } from './ConversationPreview';

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
    const aLastMessage = a.messages[a.messages.length - 1];
    const bLastMessage = b.messages[b.messages.length - 1];
    
    if (!aLastMessage) return 1;
    if (!bLastMessage) return -1;
    
    return bLastMessage.timestamp.getTime() - aLastMessage.timestamp.getTime();
  });

  return (
    <div className="w-1/4 border-r overflow-y-auto bg-white">
      <div className="sticky top-0 bg-gray-50 p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
      </div>
      
      <div className="divide-y">
        {sortedConversations.map((conversation) => (
          <ConversationPreview
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedId === conversation.id}
            onClick={() => onSelect(conversation)}
          />
        ))}
        
        {sortedConversations.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        )}
      </div>
    </div>
  );
};