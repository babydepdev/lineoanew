import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function SidebarNavItem({ href, icon, label }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        "text-sm font-medium",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}