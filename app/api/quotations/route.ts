import { NextRequest, NextResponse } from 'next/server';
import { createQuotation } from './services/create';
import { broadcastQuotationCreated } from './services/broadcast';

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

    // Calculate total
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.price), 0
    );

    // Create quotation
    const quotation = await createQuotation({
      number: `QT${Date.now()}`,
      customerName,
      lineAccountId,
      total,
      items
    });

    // Broadcast updates asynchronously - don't wait
    broadcastQuotationCreated(quotation).catch(console.error);

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}