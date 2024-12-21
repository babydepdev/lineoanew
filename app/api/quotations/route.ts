import { NextRequest, NextResponse } from 'next/server';
import { createQuotation } from './services/create';
import { validateQuotation } from './validators';
import { broadcastQuotationUpdate } from '@/lib/services/quotation/broadcast';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = validateQuotation(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Create quotation
    const quotation = await createQuotation(body);

    // Broadcast update asynchronously - don't wait
    broadcastQuotationUpdate('created', quotation.id).catch(console.error);

    return NextResponse.json(quotation);
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}