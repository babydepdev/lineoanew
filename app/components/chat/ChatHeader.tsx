"use client";

import React from 'react';
import { Platform } from '@prisma/client';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface ChatHeaderProps {
  platform: Platform;
  userId: string;
}

export function ChatHeader({ platform, userId }: ChatHeaderProps) {
  return (
    <div className="sticky top-0 z-20 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm sm:text-base">
            {platform === 'LINE' ? 'L' : 'F'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            {platform} Chat
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 truncate max-w-[200px] sm:max-w-none">
            ID: {userId}
          </p>
        </div>
      </div>
    </div>
  );
}