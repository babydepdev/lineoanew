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
    // Check if message already exists to prevent duplicates
    if (messageId) {
      const existingMessage = await prisma.message.findUnique({
        where: { externalId: messageId }
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

    // Broadcast message via Pusher
    await broadcastMessage(newMessage, updatedConversation);

    return { conversation: updatedConversation, message: newMessage };
  } catch (error) {
    console.error('Error handling incoming message:', error);
    throw error;
  }
}