import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-dashed border-white/10 rounded-3xl bg-white/5 p-8 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-black/30 border border-white/10 mx-auto flex items-center justify-center mb-4">
        <Sparkles className="text-amber-200" size={22} />
      </div>
      <div className="text-white font-semibold text-lg">{title}</div>
      {description && <div className="text-sm text-white/60 mt-2">{description}</div>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </motion.div>
  );
};

