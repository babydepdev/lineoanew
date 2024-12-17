import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
  } from '../ui/dialog';
  import { LineAccountForm } from './LineAccountForm';
  
  interface AddLineAccountDialogProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export function AddLineAccountDialog({ isOpen, onClose }: AddLineAccountDialogProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add LINE Official Account</DialogTitle>
            <DialogDescription>
              Add a new LINE Official Account to manage conversations.
            </DialogDescription>
          </DialogHeader>
  
          <LineAccountForm onSuccess={onClose} />
        </DialogContent>
      </Dialog>
    );
  }