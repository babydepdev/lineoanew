import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const quotations = await prisma.quotation.findMany({
      where: {
        lineAccountId: accountId
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(quotations);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lineAccountId, customerName, items } = body;

    // Validate required fields
    if (!lineAccountId || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate quotation number (you may want to customize this)
    const quotationNumber = `QT${Date.now()}`;

    // Calculate total
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.price), 0
    );

    // Create quotation with items
    const quotation = await prisma.quotation.create({
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

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}