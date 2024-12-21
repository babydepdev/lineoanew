import { Quotation } from '@prisma/client';
import { pusherServer, PUSHER_CHANNELS } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';

export async function broadcastQuotationUpdate(quotation: Quotation) {
  const metrics = await getDashboardMetrics();

  await Promise.all([
    pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      'metrics-updated',
      metrics
    ),
    pusherServer.trigger(
      PUSHER_CHANNELS.CHAT,
      'quotation-created',
      { quotation, metrics }
    )
  ]);
}