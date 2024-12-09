"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="p-4 border-t border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className={cn(
            "flex-grow resize-none p-3 rounded-xl",
            "border border-slate-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "min-h-[44px] max-h-[200px]",
            "placeholder:text-slate-400"
          )}
          rows={1}
        />
        <button
          onClick={handleSend}
          className={cn(
            "px-4 py-2 bg-blue-500 text-white rounded-xl",
            "hover:bg-blue-600 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "h-[44px] w-[44px] flex items-center justify-center"
          )}
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};