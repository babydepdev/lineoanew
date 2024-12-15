import { cn } from '@/lib/utils';
import { DocumentButtonProps } from './types';

export function ResponsiveDocumentButton({
  onClick,
  variant = 'primary',
  title,
  icon,
  className
}: DocumentButtonProps) {
  return (
    <>
      {/* Desktop/Tablet version */}
      <button
        onClick={onClick}
        className={cn(
          "hidden md:flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          "hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2",
          variant === 'primary' 
            ? "bg-primary text-primary-foreground focus:ring-primary" 
            : "bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400",
          className
        )}
        title={title}
      >
        {icon}
        <span>{title}</span>
      </button>

      {/* Mobile version */}
      <button
        onClick={onClick}
        className={cn(
          "md:hidden flex items-center justify-center p-2 rounded-md text-sm transition-colors",
          "hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2",
          variant === 'primary' 
            ? "bg-primary text-primary-foreground focus:ring-primary" 
            : "bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400",
          className
        )}
        title={title}
      >
        {icon}
      </button>
    </>
  );
}