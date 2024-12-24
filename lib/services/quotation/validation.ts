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
  
  export function calculateQuotationTotal(items: Array<{ quantity: number; price: number }>): number {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  }