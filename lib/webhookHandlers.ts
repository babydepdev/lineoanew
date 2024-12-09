import { PrismaClient } from '@prisma/client';
import { broadcastMessage } from './services/chatService';

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

    // Check if message already exists to prevent duplicates
    if (messageId) {
      const existingMessage = await prisma.message.findFirst({
        where: { 
          OR: [
            { externalId: messageId },
            {
              conversationId: {
                in: (await prisma.conversation.findMany({
                  where: { userId, platform },
                  select: { id: true }
                })).map(c => c.id)
              },
              content: messageText,
              timestamp: {
                gte: new Date(Date.now() - 5000) // Messages within last 5 seconds
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

    // Create user message with proper timestamp handling
    const messageTimestamp = timestamp || new Date();
    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: messageText,
        sender: 'USER',
        platform: platform,
        externalId: messageId,
        timestamp: messageTimestamp
      }
    });

    console.log('Created new message:', newMessage);

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

    // Broadcast message via Pusher
    await broadcastMessage(newMessage, updatedConversation);
    console.log('Message broadcast complete');

    return { conversation: updatedConversation, message: newMessage };
  } catch (error) {
    console.error('Error handling incoming message:', error);
    throw error;
  }
}