export * from './messages';
export * from './reply';
export * from './validation';

export interface MessageResult {
  success: boolean;
  error?: string;
}

export interface ReplyMessageOptions {
  replyToken: string;
  content: string;
  timestamp: number;
  lineAccountId?: string | null;
}

export interface PushMessageOptions {
  userId: string;
  content: string;
  lineAccountId?: string | null;
}