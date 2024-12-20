import { useEffect, useState } from 'react';

export function useWebNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  return {
    permission,
    requestPermission,
    showNotification
  };
}