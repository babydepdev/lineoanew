"use client";

import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

export function Header({ toggleSidebar, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-foreground/5 border-b border-foreground/10">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-foreground/5 rounded-md transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-geist-sans)]">
          {title}
        </h1>
      </div>
    </header>
  );
}