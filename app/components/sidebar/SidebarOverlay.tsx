import { cn } from '@/lib/utils';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClick: () => void;
}

export function SidebarOverlay({ isOpen, onClick }: SidebarOverlayProps) {
  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden",
        "transition-opacity duration-300 ease-in-out",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}