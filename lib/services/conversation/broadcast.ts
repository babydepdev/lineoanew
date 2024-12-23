import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../../pusher';
import { formatConversationForPusher } from '@/lib/messageFormatter';

const prisma = new PrismaClient();

export async function broadcastAllConversations() {
  try {
    // Get all conversations with latest messages
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 50 // Limit to most recent messages
        },
        lineAccount: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Format conversations for broadcast
    const formattedConversations = conversations.map(conv => formatConversationForPusher(conv));

    // Broadcast to all clients
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.CONVERSATIONS_UPDATED,
      formattedConversations
    );

    return true;
  } catch (error) {
    console.error('Error broadcasting conversations:', error);
    return false;
  }
}