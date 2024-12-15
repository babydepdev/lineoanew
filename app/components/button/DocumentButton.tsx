import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface DocumentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function DocumentButton({ 
  children, 
  className,
  variant = 'primary',
  ...props 
}: DocumentButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
        "hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === 'primary' 
          ? "bg-primary text-primary-foreground focus:ring-primary" 
          : "bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}