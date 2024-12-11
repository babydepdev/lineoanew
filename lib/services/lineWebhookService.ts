import { PrismaClient } from '@prisma/client';
import { LineMessageEvent } from '@/app/types/line';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from '../pusher';
import { formatMessageForPusher, formatConversationForPusher } from '../messageFormatter';
import { findLineAccountBySecret } from './lineAccountService';

const prisma = new PrismaClient();

export async function handleLineWebhookEvent(event: LineMessageEvent, signature: string) {
  try {
    if (event.type !== 'message' || event.message.type !== 'text') {
      console.log('Skipping non-text message event');
      return null;
    }

    // Find the corresponding LINE account using the signature
    const lineAccount = await findLineAccountBySecret(signature);
    if (!lineAccount) {
      console.error('No LINE account found for signature');
      return null;
    }

    const userId = event.source.userId;
    const text = event.message.text;
    const messageId = event.message.id;
    const timestamp = new Date(event.timestamp);
    const channelId = event.source.roomId || event.source.groupId || userId;
    const isFromBot = event.source.type === 'bot';

    // Check if message already exists
    const existingMessage = await prisma.message.findUnique({
      where: { externalId: messageId }
    });

    if (existingMessage) {
      console.log('Message already exists, skipping:', messageId);
      return existingMessage;
    }

    // Find or create conversation using transaction
    const result = await prisma.$transaction(async (tx) => {
      let conversation = await tx.conversation.findFirst({
        where: {
          userId: userId,
          platform: 'LINE',
          lineAccountId: lineAccount.id
        },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' }
          }
        }
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            userId: userId,
            platform: 'LINE',
            channelId: channelId,
            lineAccountId: lineAccount.id
          },
          include: {
            messages: {
              orderBy: { timestamp: 'asc' }
            }
          }
        });
      }

      // Create message within transaction
      const message = await tx.message.create({
        data: {
          conversationId: conversation.id,
          content: text,
          sender: isFromBot ? 'BOT' : 'USER',
          platform: 'LINE',
          externalId: messageId,
          timestamp
        }
      });

      // Update conversation timestamp
      await tx.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: timestamp }
      });

      return { message, conversation };
    });

    const { message, conversation } = result;

    // Format message for Pusher
    const formattedMessage = formatMessageForPusher(message);

    // Broadcast updates in parallel
    await Promise.all([
      // Broadcast message to conversation-specific channel
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
      ),

      // Broadcast conversation update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        PUSHER_EVENTS.CONVERSATION_UPDATED,
        formatConversationForPusher(conversation)
      )
    ]);

    return message;
  } catch (error) {
    console.error('Error handling LINE webhook event:', error);
    throw error;
  }
}