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

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Check for duplicate message
      if (messageId) {
        const existingMessage = await tx.message.findFirst({
          where: {
            OR: [
              { externalId: messageId },
              {
                conversationId: {
                  in: (await tx.conversation.findMany({
                    where: { userId, platform },
                    select: { id: true }
                  })).map(c => c.id)
                },
                content: messageText,
                timestamp: {
                  gte: new Date(Date.now() - 5000)
                }
              }
            ]
          }
        });

        if (existingMessage) {
          console.log('Duplicate message detected, skipping:', messageId);
          return null;
        }
      }

      // Find or create conversation
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

      // Create user message
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

      // Update conversation timestamp
      await tx.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
      });

      return { message: newMessage, conversationId: conversation.id };
    });

    if (result) {
      // Broadcast message update immediately
      await broadcastMessageUpdate(result.conversationId);
      console.log('Message broadcast complete');
    }

    return result;
  } catch (error) {
    console.error('Error handling incoming message:', error);
    throw error;
  }
}