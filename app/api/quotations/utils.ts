export function generateQuotationNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `QT${timestamp}${random}`;
  }