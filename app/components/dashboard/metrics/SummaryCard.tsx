"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  className?: string;
}

export function SummaryCard({ 
  title, 
  value, 
  icon, 
  color,
  delay = 0,
  className
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className={cn(color, "p-2 rounded-lg text-white")}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">
              {value.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}