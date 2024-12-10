import { PrismaClient } from '@prisma/client';
import { LineMessageEvent } from '@/app/types/line';

import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../pusher';
import { formatMessageForPusher, formatConversationForPusher } from '../messageFormatter';

const prisma = new PrismaClient();

export async function handleLineWebhookEvent(event: LineMessageEvent) {
  try {
    if (event.type !== 'message' || event.message.type !== 'text') {
      console.log('Skipping non-text message event');
      return null;
    }

    const userId = event.source.userId;
    const text = event.message.text;
    const messageId = event.message.id;
    const timestamp = new Date(event.timestamp);
    const channelId = event.source.roomId || event.source.groupId || userId;
    const isFromBot = event.source.type === 'bot';

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId: userId,
        platform: 'LINE'
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
          platform: 'LINE',
          channelId: channelId
        },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }
          }
        }
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: text,
        sender: isFromBot ? 'BOT' : 'USER',
        platform: 'LINE',
        externalId: messageId,
        timestamp
      }
    });

    // Format message for Pusher
    const formattedMessage = formatMessageForPusher(message);

    // Broadcast message to conversation-specific channel
    await pusherServer.trigger(
      `private-conversation-${conversation.id}`,
      PUSHER_EVENTS.MESSAGE_RECEIVED,
      formattedMessage
    );

    // Broadcast to main chat channel
    await pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      PUSHER_EVENTS.MESSAGE_RECEIVED,
      formattedMessage
    );

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: timestamp }
    });

    // Get updated conversation with messages
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (updatedConversation) {
      // Broadcast conversation update
      await pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        formatConversationForPusher(updatedConversation)
      );
    }

    return message;
  } catch (error) {
    console.error('Error handling LINE webhook event:', error);
    throw error;
  }
}