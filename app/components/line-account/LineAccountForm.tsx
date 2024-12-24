import { useState } from 'react';
import { useLineAccountMutation } from '@/app/hooks/useLineAccountMutation';

interface LineAccountFormProps {
  onSuccess: () => void;
}

export function LineAccountForm({ onSuccess }: LineAccountFormProps) {
  const [name, setName] = useState('');
  const [channelAccessToken, setChannelAccessToken] = useState('');
  const [channelSecret, setChannelSecret] = useState('');
  const { mutate, isLoading, error } = useLineAccountMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    mutate(
      { name, channelAccessToken, channelSecret },
      {
        onSuccess: () => {
          onSuccess();
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">
          ชื่อ Line OA
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">
          Channel Access Token
        </label>
        <input
          type="text"
          value={channelAccessToken}
          onChange={(e) => setChannelAccessToken(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          placeholder="Enter your LINE channel access token"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">
          Channel Secret
        </label>
        <input
          type="text"
          value={channelSecret}
          onChange={(e) => setChannelSecret(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          placeholder="Enter your LINE channel secret"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Account'}
        </button>
      </div>
    </form>
  );
}