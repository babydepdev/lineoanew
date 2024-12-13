import { ReplyTokenInfo } from '../types/reply';
import { DEFAULT_REPLY_CONFIG } from '../message/types';

export function validateReplyToken(
  token: string | undefined | null,
  timestamp: number | undefined | null
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

export function getReplyTokenExpiry(timestamp: number): number {
  return timestamp + DEFAULT_REPLY_CONFIG.maxAge;
}

export function formatExpiryTime(expiresAt: number): string {
  const remaining = Math.max(0, expiresAt - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}