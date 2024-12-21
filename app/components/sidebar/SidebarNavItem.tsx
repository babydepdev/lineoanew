import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export function SidebarNavItem({  icon, label, onClick }: SidebarNavItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-left",
        "text-sm font-medium",
        "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}