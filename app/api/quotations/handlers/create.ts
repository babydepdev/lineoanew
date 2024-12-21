import { NextRequest, NextResponse } from 'next/server';
import { createQuotation } from '../services/create';
import { broadcastQuotationCreated } from '../services/broadcast';
import { validateQuotationData } from '../validators';
import { generateQuotationNumber } from '../utils';

export async function handleCreateQuotation(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validationError = validateQuotationData(body);
    if (validationError) {
      return validationError;
    }

    // Generate quotation number
    const number = generateQuotationNumber();

    // Create quotation with optimized process
    const quotation = await createQuotation({
      ...body,
      number
    });

    if (!quotation) {
      throw new Error('Failed to create quotation');
    }

    // Broadcast updates asynchronously
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