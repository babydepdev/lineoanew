import { Message } from '@prisma/client';
import { ConversationWithMessages } from '@/app/types/chat';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../pusher';
import { formatMessageForPusher, formatConversationForPusher } from '../messageFormatter';

export async function broadcastMessage(message: Message, conversation: ConversationWithMessages) {
  try {
    await Promise.all([
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formatMessageForPusher(message)
      ),
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        formatConversationForPusher(conversation)
      ),
    ]);
    return true;
  } catch (error) {
    console.error('Error broadcasting message:', error);
    return false;
  }
}