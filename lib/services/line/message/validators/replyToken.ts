import { ReplyTokenValidation } from '../types/replyToken';
import { REPLY_TOKEN_LIMITS } from '../constants';
import { replyTokenStore } from '../replyTokenStore';

export function validateReplyToken(
  token: string | null | undefined,
  timestamp: number | null | undefined
): ReplyTokenValidation {
  if (!token || !timestamp) {
    return {
      isValid: false,
      reason: 'Missing token or timestamp',
      expiresAt: 0,
      remainingTime: 0
    };
  }

  const now = Date.now();
  const metadata = replyTokenStore.get(token);

  // Check if token has been used
  if (metadata?.used) {
    return {
      isValid: false,
      reason: 'Reply token has already been used',
      expiresAt: timestamp + REPLY_TOKEN_LIMITS.MAX_AGE,
      remainingTime: 0
    };
  }

  const messageAge = now - timestamp;
  const replyWindowRemaining = REPLY_TOKEN_LIMITS.REPLY_WINDOW - messageAge;
  const maxAgeRemaining = REPLY_TOKEN_LIMITS.MAX_AGE - messageAge;
  const expiresAt = timestamp + REPLY_TOKEN_LIMITS.MAX_AGE;

  // Check if within 1-minute reply window
  if (messageAge > REPLY_TOKEN_LIMITS.REPLY_WINDOW) {
    return {
      isValid: false,
      reason: 'Reply token expired (1-minute window exceeded)',
      expiresAt,
      remainingTime: 0
    };
  }

  // Check if within 20-minute maximum age
  if (messageAge > REPLY_TOKEN_LIMITS.MAX_AGE) {
    return {
      isValid: false,
      reason: 'Reply token expired (20-minute maximum age exceeded)',
      expiresAt,
      remainingTime: 0
    };
  }

  return {
    isValid: true,
    expiresAt,
    remainingTime: Math.min(replyWindowRemaining, maxAgeRemaining)
  };
}