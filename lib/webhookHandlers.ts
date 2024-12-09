import { PrismaClient } from '@prisma/client';
import { broadcastMessageUpdate } from './messageService';

const prisma = new PrismaClient();

export async function handleIncomingMessage(
  userId: string,
  messageText: string,
  platform: 'LINE' | 'FACEBOOK',
  messageId?: string,
  timestamp?: Date
) {
  try {
    console.log('Handling incoming message:', {
      userId,
      messageText,
      platform,
      messageId,
      timestamp
    });

    const messageTimestamp = timestamp || new Date();

    const result = await prisma.$transaction(async (tx) => {
      let conversation = await tx.conversation.findFirst({
        where: {
          userId: userId,
          platform: platform
        }
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            userId: userId,
            platform: platform,
            channelId: userId
          }
        });
      }

      const newMessage = await tx.message.create({
        data: {
          conversationId: conversation.id,
          content: messageText,
          sender: 'USER',
          platform: platform,
          externalId: messageId,
          timestamp: messageTimestamp
        }
      });

      await tx.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
      });

      return { message: newMessage, conversationId: conversation.id };
    });

    if (result) {
      await broadcastMessageUpdate(result.conversationId);
      console.log('Message broadcast complete');
    }

    return result;
  } catch (error) {
    console.error('Error handling incoming message:', error);
    throw error;
  }
}