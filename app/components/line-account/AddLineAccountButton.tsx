import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AddLineAccountDialog } from './AddLineAccountDialog';

export function AddLineAccountButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add LINE Account</span>
      </button>

      <AddLineAccountDialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}