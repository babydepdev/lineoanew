import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import {  formatMessageForPusher } from './messageFormatter';

const prisma = new PrismaClient();

export async function broadcastMessageUpdate(conversationId: string) {
  try {
    // Get conversation with limited messages
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
          take: -50, // Only get last 50 messages
        },
      },
    });

    if (!updatedConversation) {
      console.error('Conversation not found:', conversationId);
      return;
    }

    const latestMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
    
    // Split broadcasts into smaller chunks
    await Promise.all([
      // Broadcast just the new message
      pusherServer.trigger(
        `private-conversation-${conversationId}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formatMessageForPusher(latestMessage)
      ),

      // Broadcast minimal conversation update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        {
          id: updatedConversation.id,
          updatedAt: updatedConversation.updatedAt.toISOString(),
          lastMessage: formatMessageForPusher(latestMessage)
        }
      )
    ]);

    // Update conversations list with minimal data
    const allConversations = await prisma.conversation.findMany({
      select: {
        id: true,
        platform: true,
        userId: true,
        updatedAt: true,
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            sender: true,
            timestamp: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
    });

    const minimalConversations = allConversations.map(conv => ({
      id: conv.id,
      platform: conv.platform,
      userId: conv.userId,
      updatedAt: conv.updatedAt.toISOString(),
      lastMessage: conv.messages[0] ? {
        ...conv.messages[0],
        timestamp: conv.messages[0].timestamp.toISOString()
      } : null
    }));

    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATIONS_UPDATED,
      minimalConversations
    );

    return updatedConversation;
  } catch (error) {
    console.error('Error broadcasting message update:', error);
    throw error;
  }
}