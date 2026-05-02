import React from 'react';
import { motion } from 'motion/react';
import { User, Shield } from 'lucide-react';

interface ProfileSelectProps {
  onSelectGuest: () => void;
  onSelectShelby: () => void;
}

function SpinoutLogo() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <g transform="translate(28,28)">
        <path d="M0 0 L0 -24 A24 24 0 0 1 24 0 Z" fill="#E84820" />
        <path d="M0 0 L24 0 A24 24 0 0 1 0 24 Z" fill="#6B3A1F" />
        <path d="M0 0 L0 24 A24 24 0 0 1 -24 0 Z" fill="#3A8CAE" />
        <path d="M0 0 L-24 0 A24 24 0 0 1 0 -24 Z" fill="#2A6B3C" />
        <circle cx="0" cy="0" r="6" fill="#2e2e2e" />
      </g>
      <path d="M28 2 L23 10 L33 10 Z" fill="#9A5C28" />
    </svg>
  );
}

export const ProfileSelect: React.FC<ProfileSelectProps> = ({ onSelectGuest, onSelectShelby }) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'var(--bg-base)', gap: 32 }}
    >
      <div className="flex flex-col items-center text-center" style={{ gap: 10 }}>
        <SpinoutLogo />
        <div
          className="text-[32px] font-semibold"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
        >
          Spinout
        </div>
        <div className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
          Bu akşam nereye?
        </div>
      </div>

      <div className="flex w-full max-w-[360px]" style={{ gap: 16 }}>
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectGuest}
          className="flex-1 flex flex-col items-center"
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid var(--border)',
            borderRadius: 'var(--r-xl)',
            padding: '28px 16px',
            gap: 12,
            cursor: 'pointer',
            transition: '150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-surface)';
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
            }}
          >
            <User size={24} strokeWidth={1.6} />
          </div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            Misafir
          </div>
          <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            Sadece görüntüle
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectShelby}
          className="flex-1 flex flex-col items-center"
          style={{
            background: 'var(--bg-surface)',
            border: '0.5px solid rgba(154,92,40,0.45)',
            borderRadius: 'var(--r-xl)',
            padding: '28px 16px',
            gap: 12,
            cursor: 'pointer',
            transition: '150ms',
            boxShadow: '0 0 0 0px transparent',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(154,92,40,0.45)';
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-surface)';
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 1.5px var(--accent)';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 0px transparent';
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: 'var(--accent-glow)',
              color: 'var(--text-primary)',
            }}
          >
            <Shield size={24} strokeWidth={1.6} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            Shelby
          </div>
          <div className="text-[12px]" style={{ color: 'var(--accent)' }}>
            Admin
          </div>
        </motion.button>
      </div>
    </div>
  );
};

