import { NotificationConfig, NotificationResult } from './types';
import { NOTIFICATION_CONFIG } from './config';
import { checkNotificationPermission, requestNotificationPermission } from './permissions';

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    return requestNotificationPermission();
  }

  static show({ content, profile }: NotificationConfig): NotificationResult {
    if (!checkNotificationPermission()) {
      return { success: false, error: 'Notifications not permitted' };
    }

    try {
      const notification = new Notification(NOTIFICATION_CONFIG.TITLE, {
        body: content,
        icon: profile?.pictureUrl || NOTIFICATION_CONFIG.DEFAULT_ICON,
        badge: NOTIFICATION_CONFIG.DEFAULT_ICON,
        tag: 'chat-message',
        requireInteraction: true,
        silent: false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return { success: true };
    } catch (error) {
      console.error('Error showing notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to show notification' 
      };
    }
  }
}

export type { NotificationConfig, NotificationResult };