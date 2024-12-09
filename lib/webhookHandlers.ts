import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatMessageForPusher, formatConversationForPusher } from './messageFormatter';

const prisma = new PrismaClient();

export async function handleIncomingMessage(
  userId: string,
  messageText: string,
  platform: 'LINE' | 'FACEBOOK',
  messageId?: string,
  timestamp?: Date
) {
  try {
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId: userId,
        platform: platform
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: userId,
          platform: platform,
          channelId: userId
        },
        include: {
          messages: true
        }
      });
    }

    // Create user message
    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: messageText,
        sender: 'USER',
        platform: platform,
        externalId: messageId,
        timestamp: timestamp || new Date()
      }
    });

    // Get updated conversation with the new message
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!updatedConversation) {
      throw new Error('Failed to fetch updated conversation');
    }

    // Trigger Pusher events immediately
    await Promise.all([
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formatMessageForPusher(newMessage)
      ),
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        formatConversationForPusher(updatedConversation)
      )
    ]);

    return { conversation: updatedConversation, message: newMessage };
  } catch (error) {
    console.error('Error handling incoming message:', error);
    throw error;
  }
}