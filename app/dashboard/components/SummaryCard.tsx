import { motion } from 'framer-motion';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

export function SummaryCard({ 
  title, 
  value, 
  icon, 
  color,
  delay = 0
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className={`${color} p-2 rounded-lg text-white`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-lg font-bold text-slate-900">{value.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}