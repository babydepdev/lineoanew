import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RouteParams = {
  params: {
    messageId: string;
  };
};

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const message = await prisma.message.findUnique({
      where: { id: context.params.messageId },
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}