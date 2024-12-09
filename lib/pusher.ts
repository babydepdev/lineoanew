import Pusher from 'pusher';
import PusherClient from 'pusher-js';

if (!process.env.NEXT_PUBLIC_PUSHER_KEY || 
    !process.env.PUSHER_APP_ID || 
    !process.env.PUSHER_SECRET || 
    !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('Missing Pusher configuration');
}

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    forceTLS: true,
  }
);

export const PUSHER_EVENTS = {
  MESSAGE_RECEIVED: 'message-received',
  CONVERSATION_UPDATED: 'conversation-updated',
  CONVERSATIONS_UPDATED: 'conversations-updated',
} as const;

export const PUSHER_CHANNELS = {
  CHAT: 'chat',
  PRIVATE_CHAT: 'private-chat',
} as const;