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

    // Create user message first
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender: 'USER',
        platform,
        timestamp: new Date(),
      },
    });

    // Broadcast the user message immediately
    await broadcastMessageUpdate(conversationId);

    // Then send to platform and create bot message
    let messageSent = false;
    if (platform === 'LINE') {
      console.log('Sending LINE message to:', conversation.userId);
      messageSent = await sendLineMessage(conversation.userId, content);
    } else if (platform === 'FACEBOOK') {
      console.log('Sending Facebook message to:', conversation.userId);
      messageSent = await sendFacebookMessage(conversation.userId, content);
    }

    if (!messageSent) {
      console.error('Failed to send message to platform:', platform);
      // Delete the message if sending failed
      await prisma.message.delete({
        where: { id: userMessage.id }
      });
      return NextResponse.json(
        { error: 'Failed to send message to platform' },
        { status: 500 }
      );
    }

    // Create bot response message
    const botMessage = await prisma.message.create({
      data: {
        conversationId,
        content: 'Received your message',
        sender: 'BOT',
        platform,
        timestamp: new Date(),
      },
    });

    // Get final updated conversation
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    // Broadcast the final state with bot message
    await broadcastMessageUpdate(conversationId);

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