"use client";

import { motion } from 'framer-motion';
import { FileText, MessageCircle, Users } from 'lucide-react';
import { DashboardMetrics as DashboardMetricsType } from '../types';
import { SummaryCard } from './SummaryCard';

interface DashboardMetricsProps {
  metrics: DashboardMetricsType;
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-6">Dashboard Overview</h2>
      
      {/* Summary Cards */}
      <div className="grid gap-4 mb-8">
        <SummaryCard
          title="Total Quotations"
          value={metrics.totalQuotations}
          icon={<FileText className="w-5 h-5" />}
          color="bg-blue-500"
          delay={0.1}
        />
        <SummaryCard
          title="LINE OA Connected"
          value={metrics.totalAccounts}
          icon={<Users className="w-5 h-5" />}
          color="bg-green-500"
          delay={0.2}
        />
        <SummaryCard
          title="Total Messages"
          value={metrics.totalMessages}
          icon={<MessageCircle className="w-5 h-5" />}
          color="bg-purple-500"
          delay={0.3}
        />
      </div>

      {/* LINE Account Stats */}
      <h3 className="text-sm font-medium mb-4">LINE Account Statistics</h3>
      <div className="space-y-4">
        {metrics.accountStats.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-900">{account.name}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-bold text-slate-900">{account.conversations}</p>
                  <p className="text-xs text-slate-500">Conversations</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{account.messages}</p>
                  <p className="text-xs text-slate-500">Messages</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}