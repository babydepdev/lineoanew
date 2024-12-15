export interface DocumentButtonProps {
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    title: string;
    icon: React.ReactNode;
    className?: string;
  }