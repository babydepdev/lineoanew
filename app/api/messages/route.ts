import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendLineMessage } from '@/lib/lineClient';
import { sendFacebookMessage } from '@/lib/facebookClient';
import { broadcastMessageUpdate } from '@/lib/messageService';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, content, platform } = body;

    if (!conversationId || !content || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Create bot message first to show in UI immediately
    const botMessage = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender: 'BOT',
        platform,
        timestamp: new Date(),
      },
    });

    // Broadcast message immediately for real-time UI update
    await broadcastMessageUpdate(conversationId);

    // Then attempt to send to platform
    let messageSent = false;
    try {
      if (platform === 'LINE') {
        messageSent = await sendLineMessage(conversation.userId, content);
      } else if (platform === 'FACEBOOK') {
        messageSent = await sendFacebookMessage(conversation.userId, content);
      }
    } catch (error) {
      console.error('Error sending message to platform:', error);
    }

    if (!messageSent) {
      // Delete the message if platform delivery failed
      await prisma.message.delete({
        where: { id: botMessage.id }
      });
      
      // Broadcast update to remove the failed message
      await broadcastMessageUpdate(conversationId);
      
      return NextResponse.json(
        { error: 'Failed to send message to platform' },
        { status: 500 }
      );
    }

    // Get final updated conversation
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    return NextResponse.json({
      message: botMessage,
      conversation: updatedConversation,
    });
  } catch (error) {
    console.error('Error handling message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}