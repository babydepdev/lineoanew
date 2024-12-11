import Pusher from 'pusher';
import PusherClient from 'pusher-js';
import { pusherConfig, isPusherConfigured } from '../config/pusher';

// Validate configuration
if (!isPusherConfigured()) {
  console.warn('Pusher configuration is missing or incomplete');
}

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: pusherConfig.appId,
  key: pusherConfig.key,
  secret: pusherConfig.secret,
  cluster: pusherConfig.cluster,
  useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  pusherConfig.key,
  {
    cluster: pusherConfig.cluster,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    channelAuthorization: {
      endpoint: '/api/pusher/auth',
      transport: 'ajax',
    }
  }
);

// Pusher event names
export const PUSHER_EVENTS = {
  MESSAGE_RECEIVED: 'message-received',
  CONVERSATION_UPDATED: 'conversation-updated',
  CONVERSATIONS_UPDATED: 'conversations-updated',
  TYPING_START: 'typing-start',
  TYPING_END: 'typing-end',
  CLIENT_TYPING: 'client-typing',
} as const;

// Pusher channel names
export const PUSHER_CHANNELS = {
  CHAT: 'private-chat',
  CONVERSATION: 'private-conversation',
  CLIENT: 'private-client-events',
} as const;

// Helper function to trigger client events
export function triggerClientEvent(eventName: string, data: any) {
  const channel = pusherClient.channel(PUSHER_CHANNELS.CLIENT);
  if (channel && channel.subscribed) {
    return channel.trigger(eventName, data);
  }
}