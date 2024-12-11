"use client";

import React from 'react';
import { LineChannel } from '@/app/types/line';
import { Select } from '../ui/select';

interface ChannelSelectorProps {
  channels: LineChannel[];
  selectedChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
}

export function ChannelSelector({
  channels,
  selectedChannelId,
  onChannelSelect,
}: ChannelSelectorProps) {
  return (
    <div className="p-4 border-b border-slate-200">
      <Select
        value={selectedChannelId || ''}
        onValueChange={onChannelSelect}
        items={channels.map(channel => ({
          value: channel.id,
          label: channel.name
        }))}
        placeholder="Select LINE Channel"
      />
    </div>
  );
}