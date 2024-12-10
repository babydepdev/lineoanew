"use client";

import React from 'react';
import { ConversationWithMessages } from '@/app/types/chat';
import ConversationList from '../ConversationList';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  conversations: ConversationWithMessages[];
  selectedId?: string;
  onSelect: (conversation: ConversationWithMessages) => void;
}

export function Sidebar({ isOpen, conversations, selectedId, onSelect }: SidebarProps) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 lg:static",
      "w-[280px] sm:w-[320px] lg:w-80",
      "bg-white border-r border-slate-200",
      "transition-transform duration-300 ease-in-out",
      "z-40 lg:z-auto",
      "lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "flex flex-col h-full"
    )}>
      <ConversationList 
        conversations={conversations}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </aside>
  );
}