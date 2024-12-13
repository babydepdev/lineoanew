export interface MessageResult {
    success: boolean;
    error?: string;
  }
  
  export interface PushMessageOptions {
    userId: string;
    content: string;
    lineAccountId?: string | null;
  }
  
  export interface ReplyMessageOptions {
    replyToken: string;
    content: string;
    timestamp: number;
    lineAccountId?: string | null;
  }