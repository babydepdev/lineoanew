import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../ui/dialog';
import { LineAccountForm } from './LineAccountForm';
import { useChatState } from '@/app/features/chat/useChatState';

interface AddLineAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLineAccountDialog({ isOpen, onClose }: AddLineAccountDialogProps) {
  const { refreshConversations } = useChatState();

  const handleSuccess = async () => {
    // Refresh conversations after adding new account
    await refreshConversations();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] text-slate-600">
        <DialogHeader>
          <DialogTitle>Add LINE Official Account</DialogTitle>
          <DialogDescription>
            Add a new LINE Official Account to manage conversations.
          </DialogDescription>
        </DialogHeader>

        <LineAccountForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}