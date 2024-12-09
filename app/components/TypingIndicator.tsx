"use client";

import React, { useState, useEffect } from 'react';
import { pusherClient, PUSHER_EVENTS } from '@/lib/pusher';

interface TypingIndicatorProps {
  conversationId: string;
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const channel = pusherClient.subscribe(`private-conversation-${conversationId}`);

    const handleTypingStart = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(true);
      }
    };

    const handleTypingEnd = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(false);
      }
    };

    channel.bind(PUSHER_EVENTS.TYPING_START, handleTypingStart);
    channel.bind(PUSHER_EVENTS.TYPING_END, handleTypingEnd);

    return () => {
      channel.unbind(PUSHER_EVENTS.TYPING_START, handleTypingStart);
      channel.unbind(PUSHER_EVENTS.TYPING_END, handleTypingEnd);
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [conversationId]);

  if (!isTyping) return null;

  return (
    <div className="px-6 py-2">
      <div className="typing-indicator flex items-center gap-1 text-muted">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}