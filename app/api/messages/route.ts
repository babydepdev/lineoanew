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

    console.log('Received message request:', { conversationId, content, platform });

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
      console.error('Conversation not found:', conversationId);
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    console.log('Found conversation:', {
      id: conversation.id,
      platform: conversation.platform,
      userId: conversation.userId
    });

    // Send to platform first
    let messageSent = false;
    try {
      if (platform === 'LINE') {
        console.log('Sending LINE message to:', conversation.userId);
        messageSent = await sendLineMessage(conversation.userId, content);
      } else if (platform === 'FACEBOOK') {
        console.log('Sending Facebook message to:', conversation.userId);
        messageSent = await sendFacebookMessage(conversation.userId, content);
      }
    } catch (error) {
      console.error('Error sending message to platform:', error);
    }

    if (!messageSent) {
      console.error('Failed to send message to platform:', platform);
      return NextResponse.json(
        { error: 'Failed to send message to platform' },
        { status: 500 }
      );
    }

    // Create bot message after successful platform send
    const botMessage = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender: 'BOT',
        platform,
        timestamp: new Date(),
      },
    });

    console.log('Created bot message:', botMessage);

    // Broadcast the message update
    await broadcastMessageUpdate(conversationId);

    // Get final updated conversation
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    console.log('Message sent successfully');
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