import { pusherServer } from '@/lib/pusher';
import { getDashboardMetrics } from '@/app/dashboard/services/metrics';
import { Quotation } from '@prisma/client';

export async function broadcastQuotationCreated(quotation: Quotation) {
  const metrics = await getDashboardMetrics();
  
  await Promise.all([
    pusherServer.trigger(
      'private-chat',
      'metrics-updated',
      metrics
    ),
    pusherServer.trigger(
      'private-chat',
      'quotation-created',
      { quotation, metrics }
    )
  ]);
}