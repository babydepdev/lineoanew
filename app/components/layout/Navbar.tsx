"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MessageCircle, Settings } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    {
      href: '/',
      label: 'Chat',
      icon: MessageCircle
    },
    {
      href: '/line/channels',
      label: 'LINE Channels',
      icon: Settings
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex items-center px-4 border-b-2 text-sm font-medium",
                    pathname === link.href
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}