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
    }
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[360px] w-[90vw] sm:w-full">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <AlertDialogTitle className="text-center text-base sm:text-lg">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm sm:text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={handleClose} 
            className="w-full h-11 text-base font-medium"
          >
            ตกลง
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}