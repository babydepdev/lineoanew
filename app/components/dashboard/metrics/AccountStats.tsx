"use client";

import { motion } from 'framer-motion';
import { AccountStats as AccountStatsType } from '@/app/types/dashboard';

interface AccountStatsProps {
  accounts: AccountStatsType[];
}

export function AccountStats({ accounts }: AccountStatsProps) {
  return (
    <>
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">LINE Account Statistics</h2>
      <div className="grid gap-4 sm:gap-6">
        {accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-slate-900">{account.name}</h3>
                <p className="text-sm text-slate-500 mt-1">LINE Official Account</p>
              </div>
              <div className="flex justify-between sm:gap-8">
                <div className="text-center sm:text-right">
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{account.conversations}</p>
                  <p className="text-xs sm:text-sm text-slate-500">Conversations</p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{account.messages}</p>
                  <p className="text-xs sm:text-sm text-slate-500">Messages</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}