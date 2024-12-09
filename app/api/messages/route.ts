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

    console.log('Sending message to platform:', {
      platform,
      userId: conversation.userId,
      content,
      timestamp: new Date().toISOString()
    });

    // Send to platform first
    let messageSent = false;
    if (platform === 'LINE') {
      messageSent = await sendLineMessage(conversation.userId, content);
    } else if (platform === 'FACEBOOK') {
      messageSent = await sendFacebookMessage(conversation.userId, content);
    }

    if (!messageSent) {
      console.error('Failed to send message to platform');
      return NextResponse.json(
        { error: 'Failed to send message to platform' },
        { status: 500 }
      );
    }

    // Create bot message after successful platform delivery
    const botMessage = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender: 'BOT',
        platform,
        timestamp: new Date(),
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

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

    if (!updatedConversation) {
      throw new Error('Failed to fetch updated conversation');
    }

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

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: {
        conversation: true,
      },
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}