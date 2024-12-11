"use client";

import React, { useEffect, useState } from 'react';
import { LineChannel } from '@/app/types/line';
import { AddChannelForm } from '@/app/components/line/AddChannelForm';
import { ChannelList } from '@/app/components/line/ChannelList';

export default function LineChannelsPage() {
  const [channels, setChannels] = useState<LineChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await fetch('/api/line/channels');
      if (!response.ok) {
        throw new Error('Failed to fetch channels');
      }
      const data = await response.json();
      setChannels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChannelAdded = (channel: LineChannel) => {
    setChannels((prev) => [...prev, channel]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          LINE Channel Management
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Add New Channel
            </h2>
            <AddChannelForm onChannelAdded={handleChannelAdded} />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Channels
            </h2>
            <ChannelList channels={channels} />
          </section>
        </div>
      </div>
    </div>
  );
}