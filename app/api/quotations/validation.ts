interface ValidationResult {
    isValid: boolean;
    error?: string;
  }
  
  interface RequestData {
    accountId?: string | null;
    lineAccountId?: string;
    customerName?: string;
    items?: any[];
  }
  
  export function validateRequest(data: RequestData): ValidationResult {
    // Validate GET request
    if ('accountId' in data) {
      if (!data.accountId) {
        return {
          isValid: false,
          error: 'Account ID is required'
        };
      }
      return { isValid: true };
    }
  
    // Validate POST request
    if (!data.lineAccountId || !data.customerName || !data.items?.length) {
      return {
        isValid: false,
        error: 'Missing required fields'
      };
    }
  
    return { isValid: true };
  }