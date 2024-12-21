"use client";

import { FileText, MessageCircle, Users } from 'lucide-react';
import { DashboardMetrics } from '@/app/types/dashboard';
import { SummaryCard } from './SummaryCard';

interface SummaryCardsProps {
  metrics: DashboardMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
      <SummaryCard
        title="Total Quotations"
        value={metrics.totalQuotations}
        icon={<FileText className="w-5 h-5 sm:w-6 sm:h-6" />}
        color="bg-blue-500"
        delay={0.1}
      />
      <SummaryCard
        title="LINE OA Connected"
        value={metrics.totalAccounts}
        icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
        color="bg-green-500"
        delay={0.2}
      />
      <SummaryCard
        title="Total Messages"
        value={metrics.totalMessages}
        icon={<MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
        color="bg-purple-500"
        delay={0.3}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
}