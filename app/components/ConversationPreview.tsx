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
      className={`
        p-4 hover:bg-gray-50 cursor-pointer transition-colors
        ${isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
          `}>
            {conversation.platform === 'LINE' ? 'L' : 'F'}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {conversation.platform} User
            </div>
            <div className="text-xs text-gray-500">
              ID: {conversation.userId.slice(0, 8)}...
            </div>
          </div>
        </div>
        {lastMessage && (
          <span className="text-xs text-gray-500">
            {formatTimestamp(lastMessage.timestamp)}
          </span>
        )}
      </div>
      
      {lastMessage && (
        <div className="ml-13 pl-13">
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${
              lastMessage.sender === 'BOT' ? 'text-blue-600' : 'text-green-600'
            }`}>
              {lastMessage.sender === 'USER' ? 'User' : 'Bot'}
            </span>
            <span className="text-gray-600 truncate">
              {lastMessage.content}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};