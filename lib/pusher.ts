import Pusher from 'pusher';
import PusherClient from 'pusher-js';
import { PusherConfig } from '@/app/types/config';
import { PusherClientEvent } from '@/app/types/pusher';

// Constants for events and channels
export const PUSHER_EVENTS = {
  MESSAGE_RECEIVED: 'message-received',
  CONVERSATION_UPDATED: 'conversation-updated',
  CONVERSATIONS_UPDATED: 'conversations-updated',
  TYPING_START: 'typing-start',
  TYPING_END: 'typing-end',
  CLIENT_TYPING: 'client-typing',
} as const;

export const PUSHER_CHANNELS = {
  CHAT: 'private-chat',
  CONVERSATION: 'private-conversation',
  CLIENT: 'private-client-events',
} as const;

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
  useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    channelAuthorization: {
      endpoint: '/api/pusher/auth',
      transport: 'ajax',
    }
  }
);

// Helper function to trigger client events
export const triggerClientEvent = (eventName: string, data: PusherClientEvent) => {
  const channel = pusherClient.channel(PUSHER_CHANNELS.CLIENT);
  if (channel?.subscribed) {
    return channel.trigger(eventName, data);
  }
};
