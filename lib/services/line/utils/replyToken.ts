import { ReplyTokenInfo } from '../types/reply';

const REPLY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes in milliseconds

export function validateReplyToken(
  token: string | null | undefined,
  timestamp: number | null | undefined
): ReplyTokenInfo {
  if (!token || !timestamp) {
    return {
      token: '',
      timestamp: 0,
      isValid: false,
      expiresAt: 0
    };
  }

  const now = Date.now();
  const messageAge = now - timestamp;
  const expiresAt = timestamp + REPLY_TOKEN_EXPIRY;
  const isValid = messageAge < REPLY_TOKEN_EXPIRY;

  return {
    token,
    timestamp,
    isValid,
    expiresAt
  };
}