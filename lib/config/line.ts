import { LineConfig } from '../../app/types/config';

export const lineConfig: LineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

export const isLineConfigured = (): boolean => {
  return Boolean(
    lineConfig.channelAccessToken &&
    lineConfig.channelSecret
  );
};