import { Message } from '@prisma/client';
import { pusherServer } from '@/lib/pusher';
import { PUSHER_EVENTS, PUSHER_CHANNELS } from '@/app/config/constants';

export async function broadcastNewMessage(message: Message) {
  try {
    await Promise.all([
      // Broadcast to conversation-specific channel
      pusherServer.trigger(
        `private-conversation-${message.conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        {
          ...message,
          timestamp: message.timestamp.toISOString()
        }
      ),
      // Broadcast to main chat channel
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        {
          ...message,
          timestamp: message.timestamp.toISOString()
        }
      )
    ]);
    
    return true;
  } catch (error) {
    console.error('Error broadcasting message:', error);
    return false;
  }
}