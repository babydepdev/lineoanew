
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateQuotation(data: any): ValidationResult {
  // Check required fields
  if (!data.lineAccountId || !data.customerName || !data.items?.length) {
    return {
      isValid: false,
      error: 'Missing required fields'
    };
  }

  // Validate items
  for (const item of data.items) {
    if (!item.name || typeof item.quantity !== 'number' || typeof item.price !== 'number') {
      return {
        isValid: false,
        error: 'Invalid item data'
      };
    }
  }

  return { isValid: true };
}