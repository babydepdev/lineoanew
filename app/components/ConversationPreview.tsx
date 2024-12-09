import React from 'react';
import { ConversationWithMessages } from '../types/chat';
import { formatTimestamp } from '../utils/dateFormatter';

interface ConversationPreviewProps {
  conversation: ConversationWithMessages;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationPreview: React.FC<ConversationPreviewProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b hover:bg-gray-100 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium text-gray-900">
          {conversation.platform} - {conversation.userId}
        </div>
        {lastMessage && (
          <span className="text-xs text-gray-500">
            {formatTimestamp(lastMessage.timestamp)}
          </span>
        )}
      </div>
      
      {lastMessage && (
        <div className="flex items-center">
          <span className={`text-xs font-medium mr-2 ${
            lastMessage.sender === 'BOT' ? 'text-blue-600' : 'text-green-600'
          }`}>
            {lastMessage.sender}
          </span>
          <span className="text-sm text-gray-600 truncate">
            {lastMessage.content}
          </span>
        </div>
      )}
    </div>
  );
};