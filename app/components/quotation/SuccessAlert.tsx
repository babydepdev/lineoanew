import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '../ui/alert-dialog';
import { CheckCircle2 } from 'lucide-react';

interface SuccessAlertProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessAlert({ 
  title, 
  description, 
  isOpen, 
  onClose 
}: SuccessAlertProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOpen(true);
      // Auto close after 2 seconds
      const timer = setTimeout(() => {
        setOpen(false);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[360px]">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full">
            ตกลง
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}