interface ValidationResult {
    isValid: boolean;
    error?: string;
  }
  
  export function validateQuotationRequest(
    accountId?: string | null,
    data?: any
  ): ValidationResult {
    if (!accountId) {
      return {
        isValid: false,
        error: 'Account ID is required'
      };
    }
  
    if (data) {
      const { customerName, items } = data;
      if (!customerName || !items?.length) {
        return {
          isValid: false,
          error: 'Missing required fields'
        };
      }
    }
  
    return { isValid: true };
  }