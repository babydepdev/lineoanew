import { Quotation } from '@prisma/client';
import { pusherServer, PUSHER_CHANNELS } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';

export async function broadcastQuotationUpdate(quotation: Quotation) {
  try {
    const metrics = await getDashboardMetrics();
    
    await Promise.all([
      pusherServer.trigger(PUSHER_CHANNELS.CHAT, 'metrics-updated', metrics),
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        'quotation-created',
        { quotation, metrics }
      )
    ]);

    console.log('Broadcast update successful:', {
      quotationId: quotation.id,
      totalQuotations: metrics.totalQuotations
    });
  } catch (error) {
    console.error('Error broadcasting quotation update:', error);
    throw error;
  }
}

export async function broadcastQuotationDelete(quotation: Quotation) {
  try {
    const metrics = await getDashboardMetrics();
    
    await Promise.all([
      pusherServer.trigger(PUSHER_CHANNELS.CHAT, 'metrics-updated', metrics),
      pusherServer.trigger(
        PUSHER_CHANNELS.CHAT,
        'quotation-deleted',
        { quotationId: quotation.id, metrics }
      )
    ]);

    console.log('Broadcast delete successful:', {
      quotationId: quotation.id,
      totalQuotations: metrics.totalQuotations
    });
  } catch (error) {
    console.error('Error broadcasting quotation deletion:', error);
    throw error;
  }
}