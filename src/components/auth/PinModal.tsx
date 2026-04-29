import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';

interface PinModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (pin: string) => boolean;
}

export const PinModal: React.FC<PinModalProps> = ({ open, onClose, onVerify }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPin('');
      setError(null);
    }
  }, [open]);

  const canSubmit = useMemo(() => pin.trim().length === 4, [pin]);

  const submit = () => {
    const ok = onVerify(pin.trim());
    if (!ok) setError('PIN yanlış.');
    else onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="w-full max-w-sm bg-[#161616] border border-[#262626] rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-gray-300" />
                <h2 className="text-lg font-bold text-white">Shelby PIN</h2>
              </div>
              <button
                onClick={onClose}
                className="min-touch w-9 h-9 rounded-full bg-[#262626] text-gray-300 hover:bg-[#333] transition-colors flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                inputMode="numeric"
                pattern="\\d*"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  setError(null);
                  setPin(e.target.value.replace(/\\D/g, '').slice(0, 4));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canSubmit) submit();
                }}
                placeholder="••••"
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white placeholder-gray-700 tracking-[0.5em] text-center text-2xl focus:outline-none focus:border-white/20 transition-colors"
                autoFocus
              />
              {error && <div className="text-sm text-red-400">{error}</div>}
              <button
                onClick={submit}
                disabled={!canSubmit}
                className="w-full min-h-[48px] rounded-2xl bg-white text-black font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Giriş Yap
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

