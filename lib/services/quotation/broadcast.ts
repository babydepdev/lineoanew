import { pusherServer, PUSHER_CHANNELS } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';

type UpdateType = 'created' | 'updated' | 'deleted';

export async function broadcastQuotationUpdate(type: UpdateType, quotationId: string) {
  try {
    const metrics = await getDashboardMetrics();
    
    await Promise.all([
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        'metrics-updated',
        metrics
      ),
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        `quotation-${type}`,
        { quotationId, metrics }
      )
    ]);
  } catch (error) {
    console.error(`Error broadcasting quotation ${type}:`, error);
  }
}