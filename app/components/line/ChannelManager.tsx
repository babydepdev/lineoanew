"use client";

import React, { useState } from 'react';
import { LineChannel } from '@/app/types/line';
import { AddChannelForm } from './AddChannelForm';
import { ChannelList } from './ChannelList';

interface ChannelManagerProps {
  initialChannels: LineChannel[];
}

export function ChannelManager({ initialChannels }: ChannelManagerProps) {
  const [channels, setChannels] = useState<LineChannel[]>(initialChannels);

  const handleChannelAdded = (channel: LineChannel) => {
    setChannels(prev => [...prev, channel]);
  };

  return (
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
  );
}