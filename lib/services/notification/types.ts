import { LineUserProfile } from '@/app/types/line';

export interface NotificationConfig {
  content: string;
  profile?: LineUserProfile;
}

export interface NotificationResult {
  success: boolean;
  error?: string;
}