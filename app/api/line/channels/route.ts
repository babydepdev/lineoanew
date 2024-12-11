import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const channels = await prisma.lineChannel.findMany({
      include: {
        _count: {
          select: {
            conversations: true,
            userProfiles: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(channels);
  } catch (error) {
    console.error('Error fetching LINE channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, channelId, accessToken, secret } = body;

    if (!name || !channelId || !accessToken || !secret) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if channel ID already exists
    const existingChannel = await prisma.lineChannel.findUnique({
      where: { channelId }
    });

    if (existingChannel) {
      return NextResponse.json(
        { error: 'Channel ID already exists' },
        { status: 400 }
      );
    }

    const channel = await prisma.lineChannel.create({
      data: {
        name,
        channelId,
        accessToken,
        secret
      },
      include: {
        _count: {
          select: {
            conversations: true,
            userProfiles: true
          }
        }
      }
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.error('Error creating LINE channel:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}