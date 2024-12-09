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
  useTLS: true
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  pusherConfig.key,
  {
    cluster: pusherConfig.cluster,
    forceTLS: true,
  }
);

export const PUSHER_EVENTS = {
  MESSAGE_RECEIVED: 'message-received',
  CONVERSATION_UPDATED: 'conversation-updated',
  CONVERSATIONS_UPDATED: 'conversations-updated',
} as const;

export const PUSHER_CHANNELS = {
  CHAT: 'private-chat'
} as const;