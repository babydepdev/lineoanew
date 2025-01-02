export interface FileValidationResult {
    isValid: boolean;
    error?: string;
  }
  
  export function validateImageFile(file: File): FileValidationResult {
    if (!file || !file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Please upload an image file'
      };
    }
  
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return {
        isValid: false,
        error: 'Image must be less than 5MB'
      };
    }
  
    return { isValid: true };
  }