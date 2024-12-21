"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageCircle, Users } from 'lucide-react';
import { DashboardMetrics as DashboardMetricsType } from '../../dashboard/types';
import { SummaryCard } from '@/app/dashboard/components/SummaryCard';

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetricsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/dashboard/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <SummaryCard
          title="Total Quotations"
          value={metrics.totalQuotations}
          icon={<FileText className="w-6 h-6" />}
          color="bg-blue-500"
          delay={0.1}
        />
        <SummaryCard
          title="LINE OA Connected"
          value={metrics.totalAccounts}
          icon={<Users className="w-6 h-6" />}
          color="bg-green-500"
          delay={0.2}
        />
        <SummaryCard
          title="Total Messages"
          value={metrics.totalMessages}
          icon={<MessageCircle className="w-6 h-6" />}
          color="bg-purple-500"
          delay={0.3}
        />
      </div>

      {/* LINE Account Stats */}
      <h2 className="text-xl font-semibold mb-6">LINE Account Statistics</h2>
      <div className="grid gap-6">
        {metrics.accountStats.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
                <p className="text-sm text-gray-500 mt-1">LINE Official Account</p>
              </div>
              <div className="flex gap-8">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{account.conversations}</p>
                  <p className="text-sm text-gray-500">Conversations</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{account.messages}</p>
                  <p className="text-sm text-gray-500">Messages</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      <div className="h-6 w-40 bg-slate-200 rounded animate-pulse mb-6" />
      
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}