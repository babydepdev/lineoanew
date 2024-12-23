import { NextRequest, NextResponse } from 'next/server';
import { handleGetQuotations } from './handlers/get';
import { handleCreateQuotation } from './handlers/create';
import { validateRequest } from './validation';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');

    // Validate request
    const validationResult = validateRequest({ accountId });
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    return handleGetQuotations(accountId!);
  } catch (error) {
    console.error('Error in quotations GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validationResult = validateRequest(body);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    return handleCreateQuotation(body);
  } catch (error) {
    console.error('Error in quotations POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}