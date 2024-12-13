export interface ReplyTokenInfo {
    token: string;
    timestamp: number;
    isValid: boolean;
    expiresAt: number;
  }
  
  export interface ReplyMessageConfig {
    maxAge: number; // Maximum age in milliseconds
    retryOnFailure: boolean;
    fallbackToPush: boolean;
  }
  
  export const DEFAULT_REPLY_CONFIG: ReplyMessageConfig = {
    maxAge: 20 * 60 * 1000, // 20 minutes
    retryOnFailure: true,
    fallbackToPush: true
  };