import { PrismaClient } from '@prisma/client';
import { LineMessageEvent } from '@/app/types/line';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../pusher';
import { formatMessageForPusher } from '../messageFormatter';

const prisma = new PrismaClient();

export async function handleLineWebhookEvent(event: LineMessageEvent, channelId: string) {
  try {
    if (event.type !== 'message' || event.message.type !== 'text') {
      console.log('Skipping non-text message event');
      return null;
    }

    const userId = event.source.userId;
    const text = event.message.text;
    const messageId = event.message.id;
    const timestamp = new Date(event.timestamp);

    // Check if message already exists to prevent duplicates
    const existingMessage = await prisma.message.findUnique({
      where: { externalId: messageId }
    });

    if (existingMessage) {
      console.log('Message already processed:', messageId);
      return existingMessage;
    }

    // Find or create conversation with channel ID
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId,
        platform: 'LINE',
        lineChannelId: channelId
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
          userId,
          platform: 'LINE',
          channelId: userId,
          lineChannelId: channelId
        },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }
          }
        }
      });
    }

    // Create message with transaction to handle race conditions
    const message = await prisma.$transaction(async (tx) => {
      // Double-check message doesn't exist within transaction
      const msg = await tx.message.findUnique({
        where: { externalId: messageId }
      });

      if (msg) {
        return msg;
      }

      return tx.message.create({
        data: {
          conversationId: conversation!.id,
          content: text,
          sender: 'USER',
          platform: 'LINE',
          externalId: messageId,
          timestamp
        }
      });
    });

    // Format and broadcast message
    const formattedMessage = formatMessageForPusher(message);

    await Promise.all([
      // Broadcast to conversation-specific channel
      pusherServer.trigger(
        `private-conversation-${conversation.id}`,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formattedMessage
      ),
      // Broadcast to main chat channel
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.MESSAGE_RECEIVED,
        formattedMessage
      )
    ]);

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: timestamp }
    });

    return message;
  } catch (error) {
    console.error('Error handling LINE webhook event:', error);
    throw error;
  }
}