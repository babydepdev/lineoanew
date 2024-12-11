"use client";

import React from 'react';
import { LineChannel } from '@/app/types/line';
import { formatDate } from '@/lib/utils';

interface ChannelListProps {
  channels: LineChannel[];
}

export function ChannelList({ channels }: ChannelListProps) {
  return (
    <div className="space-y-4">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{channel.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Added {formatDate(new Date(channel.createdAt))}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {channel._count?.conversations || 0} conversations
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Channel ID:</span>
                <br />
                <code className="text-xs bg-gray-50 px-2 py-1 rounded">
                  {channel.channelId}
                </code>
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Access Token:</span>
                <br />
                <code className="text-xs bg-gray-50 px-2 py-1 rounded">
                  {channel.accessToken.slice(0, 20)}...
                </code>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Users:</span>
                <br />
                {channel._count?.userProfiles || 0} profiles cached
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Last Updated:</span>
                <br />
                {formatDate(new Date(channel.updatedAt))}
              </p>
            </div>
          </div>
        </div>
      ))}

      {channels.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500">No LINE channels added yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Add your first channel using the form above
          </p>
        </div>
      )}
    </div>
  );
}