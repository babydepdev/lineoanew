import { Client } from '@line/bot-sdk';
import { PrismaClient } from '@prisma/client';
import { pusherServer, PUSHER_EVENTS } from '@/lib/pusher';
import { formatMessageForPusher } from '@/lib/messageFormatter';

const prisma = new PrismaClient();

export async function sendLineMessageToUser(userId: string, content: string): Promise<boolean> {
  try {
    console.log('Sending LINE message:', { userId, content });
    
    // Find the conversation with its LINE channel and verify it exists
    const conversation = await prisma.conversation.findFirst({
      where: { 
        userId,
        platform: 'LINE'
      },
      include: {
        lineChannel: true
      }
    });

    if (!conversation) {
      console.error('Conversation not found for user:', userId);
      return false;
    }

    if (!conversation.lineChannel) {
      console.error('No LINE channel found for conversation:', conversation.id);
      return false;
    }

    // Create LINE client with channel credentials
    const client = new Client({
      channelAccessToken: conversation.lineChannel.accessToken,
      channelSecret: conversation.lineChannel.secret
    });

    // Send message using channel-specific client
    await client.pushMessage(userId, {
      type: 'text',
      text: content
    });

    // Create message record
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        content,
        sender: 'BOT',
        platform: 'LINE',
        timestamp: new Date()
      }
    });

    // Format and broadcast message
    const formattedMessage = formatMessageForPusher(message);
    await pusherServer.trigger(
      `private-conversation-${conversation.id}`,
      PUSHER_EVENTS.MESSAGE_RECEIVED,
      formattedMessage
    );

    console.log('LINE message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending LINE message:', error);
    return false;
  }
}