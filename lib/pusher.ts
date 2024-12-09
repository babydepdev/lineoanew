import Pusher from 'pusher';
import PusherClient from 'pusher-js';
import { pusherConfig, isPusherConfigured } from './config/pusher';

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

// Client-side Pusher instance with proper typing
export const pusherClient = new PusherClient(
  pusherConfig.key,
  {
    cluster: pusherConfig.cluster,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    channelAuthorization: {
      endpoint: '/api/pusher/auth',
      transport: 'ajax',
    },
  }
);

// Create a client channel for sending events
const clientChannel = pusherClient.subscribe('private-client-events');

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

// Type-safe client event trigger
export const triggerClientEvent = (eventName: string, data: any) => {
  if (clientChannel) {
    return (clientChannel as any).trigger(eventName, data);
  }
};