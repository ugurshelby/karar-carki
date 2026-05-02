import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface PinModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (pin: string) => boolean;
}

export const PinModal: React.FC<PinModalProps> = ({ open, onClose, onVerify }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [shakeNonce, setShakeNonce] = useState(0);

  useEffect(() => {
    if (open) {
      setPin('');
      setError(null);
      setShakeNonce(0);
    }
  }, [open]);

  const submit = () => {
    const ok = onVerify(pin.trim());
    if (!ok) {
      setError('PIN yanlış.');
      setShakeNonce((n) => n + 1);
    }
    else onClose();
  };

  const canSubmit = useMemo(() => pin.trim().length === 4, [pin]);
  const isError = !!error;

  const pressDigit = (d: string) => {
    setError(null);
    setPin((p) => (p.length >= 4 ? p : (p + d).slice(0, 4)));
  };

  const backspace = () => {
    setError(null);
    setPin((p) => p.slice(0, -1));
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: shakeNonce === 0 ? 0 : [0, 8, -8, 8, -8, 0],
            }}
            transition={{ duration: shakeNonce === 0 ? 0.3 : 0.4, ease: 'easeOut' }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-[320px] shadow-2xl"
            style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--r-xl)',
              border: '0.5px solid var(--border-strong)',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div className="w-full flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-[20px] font-semibold" style={{ color: 'var(--text-primary)' }}>Shelby</div>
                <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>PIN kodunu gir</div>
              </div>
              <button
                onClick={onClose}
                className="min-touch flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--r-full)',
                  background: 'var(--bg-elevated)',
                  border: '0.5px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
                aria-label="Kapat"
              >
                <X size={18} strokeWidth={1.6} />
              </button>
            </div>

            <div className="flex" style={{ gap: 12 }}>
              {Array.from({ length: 4 }).map((_, i) => {
                const filled = i < pin.length;
                const background = isError ? '#C83010' : filled ? 'var(--accent)' : 'transparent';
                const borderColor = isError ? '#C83010' : filled ? 'var(--accent)' : 'var(--border-strong)';
                return (
                  <div
                    key={i}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 9999,
                      border: `1.5px solid ${borderColor}`,
                      background,
                      transition: '120ms',
                    }}
                  />
                );
              })}
            </div>

            {error ? <div className="text-[12px]" style={{ color: '#C83010' }}>{error}</div> : null}

            <div className="grid grid-cols-3" style={{ gap: 12 }}>
              {['1','2','3','4','5','6','7','8','9', '', '0', '⌫'].map((k) => {
                if (k === '') return <div key="spacer" />;
                const isBack = k === '⌫';
                const onPress = isBack ? backspace : () => pressDigit(k);
                const disabled = !isBack && pin.length >= 4;
                return (
                  <motion.button
                    key={k}
                    whileTap={{ scale: 0.92 }}
                    onClick={onPress}
                    disabled={disabled}
                    className="flex items-center justify-center"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--r-full)',
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      fontSize: 22,
                      fontWeight: 500,
                      transition: '100ms',
                      opacity: disabled ? 0.35 : 1,
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent)';
                      (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                    }}
                    aria-label={isBack ? 'Sil' : `Rakam ${k}`}
                    type="button"
                  >
                    {k}
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={submit}
              disabled={!canSubmit}
              className="w-full"
              style={{
                minHeight: 48,
                borderRadius: 'var(--r-xl)',
                background: canSubmit ? 'var(--text-primary)' : 'rgba(245,240,232,0.35)',
                color: '#111',
                fontWeight: 700,
                transition: '150ms',
              }}
              type="button"
            >
              Giriş Yap
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

