import { prisma } from '@/lib/prisma';

/**
 * Generate a unique quotation number with format QT-YYYYMMDD-XXX
 * where XXX is a sequential number padded with zeros
 */
export async function generateQuotationNumber(): Promise<string> {
  try {
    // Get current date components
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    
    // Find the latest quotation number for today
    const latestQuotation = await prisma.quotation.findFirst({
      where: {
        number: {
          startsWith: `QT-${dateString}`
        }
      },
      orderBy: {
        number: 'desc'
      }
    });

    // Extract sequence number or start from 1
    let sequenceNumber = 1;
    if (latestQuotation) {
      const currentSequence = parseInt(latestQuotation.number.split('-')[2]);
      sequenceNumber = currentSequence + 1;
    }

    // Generate new number with padded sequence
    return `QT-${dateString}-${String(sequenceNumber).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating quotation number:', error);
    throw new Error('Failed to generate quotation number');
  }
}

/**
 * Validate quotation items
 */
export function validateQuotationItems(items: any[]): boolean {
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }

  return items.every(item => 
    typeof item === 'object' &&
    typeof item.name === 'string' && item.name.trim() !== '' &&
    typeof item.quantity === 'number' && item.quantity > 0 &&
    typeof item.price === 'number' && item.price >= 0
  );
}

/**
 * Calculate total amount for quotation items
 */
export function calculateQuotationTotal(items: Array<{ quantity: number; price: number }>): number {
  return items.reduce((total, item) => total + (item.quantity * item.price), 0);
}

/**
 * Format quotation number for display
 */
export function formatQuotationNumber(number: string): string {
  const parts = number.split('-');
  if (parts.length !== 3) return number;

  const date = parts[1];
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  const sequence = parts[2];

  return `QT-${year}/${month}/${day}-${sequence}`;
}

/**
 * Parse quotation number to extract components
 */
export function parseQuotationNumber(number: string): {
  prefix: string;
  date: string;
  sequence: string;
} | null {
  const match = number.match(/^(QT)-(\d{8})-(\d{3})$/);
  if (!match) return null;

  return {
    prefix: match[1],
    date: match[2],
    sequence: match[3]
  };
}