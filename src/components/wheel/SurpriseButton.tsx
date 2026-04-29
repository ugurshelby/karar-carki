import React from 'react';
import { Zap } from 'lucide-react';

export const SurpriseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="min-h-[48px] px-5 rounded-2xl bg-transparent border border-[rgba(245,240,232,0.16)] text-[#F5F0E8] font-semibold hover:border-[rgba(245,240,232,0.24)] transition-colors flex items-center justify-center gap-2"
    >
      <Zap size={18} strokeWidth={1.6} className="text-[#9A5C28]" />
      Sürpriz!
    </button>
  );
};

