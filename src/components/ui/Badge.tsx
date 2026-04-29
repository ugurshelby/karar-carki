import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  tone?: 'neutral' | 'accent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, tone = 'neutral', className = '' }) => {
  const toneClass =
    tone === 'accent'
      ? 'bg-amber-500/15 text-amber-200 border-amber-500/20'
      : 'bg-black/35 text-white/80 border-white/10';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur ${toneClass} ${className}`}>
      {children}
    </span>
  );
};

