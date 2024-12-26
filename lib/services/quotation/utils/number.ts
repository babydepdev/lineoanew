import { prisma } from '@/lib/prisma';

const SEQUENCE_PADDING = 3;
const PREFIX = 'QT';

export async function generateQuotationNumber(): Promise<string> {
  try {
    // Get current date components
    const now = new Date();
    const dateString = formatDateString(now);
    
    // Find latest sequence in a transaction to prevent race conditions
    const sequence = await prisma.$transaction(async (tx) => {
      const latest = await tx.quotation.findFirst({
        where: {
          number: {
            startsWith: `${PREFIX}-${dateString}`
          }
        },
        orderBy: {
          number: 'desc'
        },
        select: {
          number: true
        }
      });

      const nextSequence = latest
        ? parseInt(latest.number.split('-')[2]) + 1
        : 1;

      return nextSequence;
    });

    return formatQuotationNumber(dateString, sequence);
  } catch (error) {
    console.error('Error generating quotation number:', error);
    throw new Error('Failed to generate quotation number');
  }
}

function formatDateString(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('');
}

function formatQuotationNumber(dateString: string, sequence: number): string {
  return [
    PREFIX,
    dateString,
    String(sequence).padStart(SEQUENCE_PADDING, '0')
  ].join('-');
}