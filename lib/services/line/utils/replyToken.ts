import { ReplyTokenInfo } from "../message/types/reply";
import { DEFAULT_REPLY_CONFIG } from '../message/types/reply';

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
  const expiresAt = timestamp + DEFAULT_REPLY_CONFIG.maxAge;
  const isValid = messageAge < DEFAULT_REPLY_CONFIG.maxAge;

  return {
    token,
    timestamp,
    isValid,
    expiresAt
  };
}