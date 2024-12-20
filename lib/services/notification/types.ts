import { LineUserProfile } from '@/app/types/line';

export interface NotificationConfig {
  content: string;
  profile?: LineUserProfile;
  title?: string;
}

export interface NotificationResult {
  success: boolean;
  error?: string;
}
