import { Quotation } from '@prisma/client';
import { pusherServer, PUSHER_CHANNELS } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';

export async function broadcastQuotationUpdate(quotation: Quotation) {
  try {
    // Get fresh metrics after quotation creation
    const metrics = await getDashboardMetrics();

    // Broadcast both events
    await Promise.all([
      // Broadcast metrics update
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        'metrics-updated',
        metrics
      ),
      // Broadcast quotation creation with metrics
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        'quotation-created',
        { quotation, metrics }
      )
    ]);

    console.log('Broadcast successful:', {
      quotationId: quotation.id,
      totalQuotations: metrics.totalQuotations
    });
  } catch (error) {
    console.error('Error broadcasting quotation update:', error);
    throw error;
  }
}