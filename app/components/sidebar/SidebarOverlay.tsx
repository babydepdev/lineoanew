import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarOverlayProps {
  isOpen: boolean;
  onClick: () => void;
}

export function SidebarOverlay({ isOpen, onClick }: SidebarOverlayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden",
        "transition-opacity duration-300 ease-in-out"
      )}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}