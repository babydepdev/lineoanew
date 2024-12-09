import { Message } from '@prisma/client';
import { ConversationWithMessages } from '@/app/types/chat';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../pusher';
import { formatMessageForPusher, formatConversationForPusher } from '../messageFormatter';

export async function broadcastMessage(message: Message, conversation: ConversationWithMessages) {
  try {
    console.log('Broadcasting message:', {
      id: message.id,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp
    });

    // Format the message and conversation for Pusher
    const formattedMessage = formatMessageForPusher(message);
    const formattedConversation = formatConversationForPusher(conversation);

    // Broadcast both events simultaneously
    await Promise.all([
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formattedMessage
      ),
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        formattedConversation
      )
    ]);

    console.log('Broadcast complete:', {
      messageId: message.id,
      conversationId: conversation.id
    });

    return true;
  } catch (error) {
    console.error('Error broadcasting message:', error);
    return false;
  }
}