import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { pusherServer } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lineAccountId, customerName, items } = body;

    // Validate required fields
    if (!lineAccountId || !customerName || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total once
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.price), 0
    );

    // Generate quotation number
    const quotationNumber = `QT${Date.now()}`;

    // Create quotation and items in a single transaction
    const quotation = await prisma.$transaction(async (tx) => {
      const newQuotation = await tx.quotation.create({
        data: {
          number: quotationNumber,
          customerName,
          total,
          lineAccountId,
          items: {
            create: items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price
            }))
          }
        },
        include: {
          items: true
        }
      });

      // Get metrics in parallel with quotation creation
      const metrics = await getDashboardMetrics();

      // Broadcast updates
      await Promise.all([
        pusherServer.trigger(
          'private-chat',
          'metrics-updated',
          metrics
        ),
        pusherServer.trigger(
          'private-chat',
          'quotation-created',
          { quotation: newQuotation, metrics }
        )
      ]);

      return newQuotation;
    });

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}