import { PusherConfig } from '../../app/types/config';

export const pusherConfig: PusherConfig = {
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
};

export const isPusherConfigured = (): boolean => {
  return Boolean(
    pusherConfig.appId &&
    pusherConfig.key &&
    pusherConfig.secret &&
    pusherConfig.cluster
  );
};