"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import { PUSHER_EVENTS, triggerClientEvent } from '@/lib/pusher';
import { debounce } from 'lodash';
import { PusherTypingEvent } from '../types/pusher';

interface MessageInputProps {
  onSend: (message: string) => void;
  conversationId: string;
}

export function MessageInput({ onSend, conversationId }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const debouncedTypingEnd = debounce(() => {
    setIsTyping(false);
    const typingEvent: PusherTypingEvent = {
      conversationId,
      isTyping: false
    };
    triggerClientEvent(PUSHER_EVENTS.CLIENT_TYPING, typingEvent);
  }, 1000);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      const typingEvent: PusherTypingEvent = {
        conversationId,
        isTyping: true
      };
      triggerClientEvent(PUSHER_EVENTS.CLIENT_TYPING, typingEvent);
    }
    debouncedTypingEnd();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="p-2 sm:p-4 border-t border-border bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className={cn(
            "flex-grow resize-none p-2 sm:p-3 rounded-xl",
            "bg-slate-50 dark:bg-slate-800 border border-border",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "placeholder:text-muted text-sm sm:text-base",
            "min-h-[44px] max-h-[200px]"
          )}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={cn(
            "p-2 sm:p-3 rounded-xl bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "h-[44px] w-[44px] flex items-center justify-center"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}