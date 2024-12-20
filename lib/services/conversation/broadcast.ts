import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';

const prisma = new PrismaClient();

export async function broadcastAllConversations() {
  try {
    // Get minimal conversation data
    const conversations = await prisma.conversation.findMany({
      select: {
        id: true,
        platform: true,
        userId: true,
        updatedAt: true,
        lineAccountId: true,
        lineAccount: {
          select: {
            id: true,
            name: true
          }
        },
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
      }
    });

    // Format minimal data for broadcast
    const minimalData = conversations.map(conv => ({
      id: conv.id,
      platform: conv.platform,
      userId: conv.userId,
      updatedAt: conv.updatedAt.toISOString(),
      lineAccountId: conv.lineAccountId,
      lineAccount: conv.lineAccount,
      lastMessage: conv.messages[0] ? {
        id: conv.messages[0].id,
        content: conv.messages[0].content,
        sender: conv.messages[0].sender,
        timestamp: conv.messages[0].timestamp.toISOString()
      } : null
    }));

    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATIONS_UPDATED,
      minimalData
    );

    return true;
  } catch (error) {
    console.error('Error broadcasting conversations:', error);
    return false;
  }
}