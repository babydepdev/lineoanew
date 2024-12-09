import { Message } from '@prisma/client';
import { ConversationWithMessages } from '@/app/types/chat';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../pusher';
import { formatMessageForPusher, formatConversationForPusher } from '../messageFormatter';

export async function broadcastMessage(message: Message, conversation: ConversationWithMessages) {
  try {
    console.log('Broadcasting message:', message);
    console.log('Broadcasting conversation:', conversation);

    // Broadcast the message first
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.MESSAGE_RECEIVED,
      formatMessageForPusher(message)
    );

    // Small delay to ensure message is processed first
    await new Promise(resolve => setTimeout(resolve, 100));

    // Then broadcast the conversation update
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATION_UPDATED,
      formatConversationForPusher(conversation)
    );

    return true;
  } catch (error) {
    console.error('Error broadcasting message:', error);
    return false;
  }
}