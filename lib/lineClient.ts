import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS, PUSHER_CHANNELS } from './pusher';
import { formatConversationForPusher } from './messageFormatter';
import { LineMessageEvent } from '@/app/types/line';

const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || ''
};

const prisma = new PrismaClient();
export const lineClient = new Client(lineConfig);

export async function handleLineWebhook(event: LineMessageEvent) {
  console.log('Received LINE webhook event:', JSON.stringify(event, null, 2));

  if (event.type !== 'message' || event.message.type !== 'text') {
    console.log('Skipping non-text message event');
    return;
  }

  const userId = event.source.userId;
  const text = event.message.text;
  const messageId = event.message.id;
  const timestamp = new Date(event.timestamp);
  const channelId = event.source.roomId || event.source.groupId || userId;

  try {
    // First, verify if we can get user profile
    try {
      const profile = await lineClient.getProfile(userId);
      console.log('LINE user profile:', profile);
    } catch (error) {
      console.error('Error fetching LINE user profile:', error);
      // Continue anyway as this is not critical
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Find or create conversation first
      let conversation = await tx.conversation.findFirst({
        where: {
          userId: userId,
          platform: 'LINE'
        },
        include: {
          messages: true
        }
      });

      if (!conversation) {
        console.log('Creating new LINE conversation for user:', userId);
        conversation = await tx.conversation.create({
          data: {
            userId: userId,
            platform: 'LINE',
            channelId: channelId
          },
          include: {
            messages: true
          }
        });
      }

      // Check for duplicate message
      const existingMessage = await tx.message.findFirst({
        where: {
          externalId: messageId,
          platform: 'LINE'
        }
      });

      if (existingMessage) {
        console.log('Duplicate LINE message detected, skipping:', messageId);
        return { conversation, message: existingMessage };
      }

      // Create new message
      console.log('Creating new LINE message:', {
        conversationId: conversation.id,
        content: text,
        messageId
      });

      const newMessage = await tx.message.create({
        data: {
          conversationId: conversation.id,
          content: text,
          sender: 'USER',
          platform: 'LINE',
          externalId: messageId,
          timestamp
        }
      });

      // Update conversation timestamp
      await tx.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() }
      });

      return { conversation, message: newMessage };
    });

    // Fetch the complete updated conversation
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: result.conversation.id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (updatedConversation) {
      // Broadcast updates
      await Promise.all([
        pusherServer.trigger(
          PUSHER_CHANNELS.CHAT,
          PUSHER_EVENTS.CONVERSATION_UPDATED,
          formatConversationForPusher(updatedConversation)
        ),
        prisma.conversation.findMany({
          include: {
            messages: {
              orderBy: { timestamp: 'asc' }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }).then(conversations => 
          pusherServer.trigger(
            PUSHER_CHANNELS.CHAT,
            PUSHER_EVENTS.CONVERSATIONS_UPDATED,
            conversations.map(formatConversationForPusher)
          )
        )
      ]);

      console.log('Successfully processed and broadcast LINE message:', {
        messageId,
        conversationId: updatedConversation.id,
        timestamp: timestamp.toISOString()
      });
    }

    return updatedConversation;
  } catch (error) {
    console.error('Error handling LINE message:', error);
    throw error;
  }
}

export async function sendLineMessage(userId: string, message: string): Promise<boolean> {
  if (!userId || !message) {
    console.error('Invalid userId or message for LINE');
    return false;
  }

  try {
    console.log('Sending LINE message:', { userId, message });
    await lineClient.pushMessage(userId, {
      type: 'text',
      text: message
    });
    console.log('LINE message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return false;
  }
}