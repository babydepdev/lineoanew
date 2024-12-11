"use client";

import React, { useState } from 'react';
import { LineChannel } from '@/app/types/line';

interface AddChannelFormProps {
  onChannelAdded: (channel: LineChannel) => void;
}

export function AddChannelForm({ onChannelAdded }: AddChannelFormProps) {
  const [name, setName] = useState('');
  const [channelId, setChannelId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [secret, setSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/line/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          channelId,
          accessToken,
          secret,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add channel');
      }

      const channel = await response.json();
      onChannelAdded(channel);
      
      // Reset form
      setName('');
      setChannelId('');
      setAccessToken('');
      setSecret('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Channel Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Enter channel name"
          required
        />
      </div>

      <div>
        <label htmlFor="channelId" className="block text-sm font-medium text-gray-700">
          Channel ID
        </label>
        <input
          type="text"
          id="channelId"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Enter LINE channel ID"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          This is your LINE Channel ID from the LINE Developers Console
        </p>
      </div>

      <div>
        <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">
          Channel Access Token
        </label>
        <input
          type="text"
          id="accessToken"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Paste your LINE channel access token"
          required
        />
      </div>

      <div>
        <label htmlFor="secret" className="block text-sm font-medium text-gray-700">
          Channel Secret
        </label>
        <input
          type="password"
          id="secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Enter channel secret"
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding...' : 'Add Channel'}
      </button>
    </form>
  );
}