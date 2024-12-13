export interface ReplyTokenMetadata {
    token: string;
    timestamp: number;
    used: boolean;
  }
  
  export interface ReplyTokenValidation {
    isValid: boolean;
    reason?: string;
    expiresAt: number;
    remainingTime: number;
  }
  
  export interface ReplyTokenStore {
    get: (token: string) => ReplyTokenMetadata | undefined;
    set: (token: string, metadata: ReplyTokenMetadata) => void;
    markAsUsed: (token: string) => void;
    cleanup: () => void;
  }