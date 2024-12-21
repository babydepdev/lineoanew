import { useState, useEffect } from 'react';
import { DashboardMetrics } from '../types/dashboard';
import { pusherClient, PUSHER_EVENTS, PUSHER_CHANNELS } from '@/lib/pusher';

export function useDashboardMetrics(initialMetrics: DashboardMetrics) {
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);

  useEffect(() => {
    const channel = pusherClient.subscribe(PUSHER_CHANNELS.CHAT);

    const handleMetricsUpdate = async () => {
      try {
        const response = await fetch('/api/dashboard/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const updatedMetrics = await response.json();
        setMetrics(updatedMetrics);
      } catch (error) {
        console.error('Error updating metrics:', error);
      }
    };

    // Listen for events that should trigger metrics updates
    channel.bind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMetricsUpdate);
    channel.bind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleMetricsUpdate);
    channel.bind('quotation-created', handleMetricsUpdate);
    channel.bind('quotation-deleted', handleMetricsUpdate);
    channel.bind('line-account-updated', handleMetricsUpdate);

    return () => {
      channel.unbind(PUSHER_EVENTS.MESSAGE_RECEIVED, handleMetricsUpdate);
      channel.unbind(PUSHER_EVENTS.CONVERSATIONS_UPDATED, handleMetricsUpdate);
      channel.unbind('quotation-created', handleMetricsUpdate);
      channel.unbind('quotation-deleted', handleMetricsUpdate);
      channel.unbind('line-account-updated', handleMetricsUpdate);
      pusherClient.unsubscribe(PUSHER_CHANNELS.CHAT);
    };
  }, []);

  return metrics;
}