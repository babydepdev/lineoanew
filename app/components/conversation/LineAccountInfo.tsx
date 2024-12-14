import React from 'react';
import { cn } from '@/lib/utils';
import { useLineAccount } from '@/app/hooks/useLineAccount';

interface LineAccountInfoProps {
  accountId: string;
  className?: string;
}

export function LineAccountInfo({ accountId, className }: LineAccountInfoProps) {
  const { account, isLoading } = useLineAccount(accountId);

  if (isLoading) {
    return (
      <span className={cn(
        "animate-pulse bg-slate-200 rounded h-3 w-20 inline-block",
        className
      )} />
    );
  }

  return (
    <p className={cn("text-xs text-slate-500", className)}>
      {account?.name || 'Unknown Account'}
    </p>
  );
}