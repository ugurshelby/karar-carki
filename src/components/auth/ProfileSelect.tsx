import React from 'react';
import { motion } from 'motion/react';
import { User, Shield } from 'lucide-react';

interface ProfileSelectProps {
  onSelectGuest: () => void;
  onSelectShelby: () => void;
}

export const ProfileSelect: React.FC<ProfileSelectProps> = ({ onSelectGuest, onSelectShelby }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Date Çarkı</h1>
          <p className="text-gray-400 mt-3">Devam etmek için profil seç.</p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onSelectGuest}
            className="w-full min-h-[56px] rounded-3xl bg-[#161616] border border-[#262626] px-6 py-5 text-left hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <User size={22} />
              </div>
              <div>
                <div className="text-lg font-semibold">Misafir</div>
                <div className="text-sm text-gray-500">Sadece görüntüleme</div>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onSelectShelby}
            className="w-full min-h-[56px] rounded-3xl bg-white text-black px-6 py-5 text-left hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center">
                <Shield size={22} />
              </div>
              <div>
                <div className="text-lg font-semibold">Shelby</div>
                <div className="text-sm text-black/60">Tam yetki (PIN gerekli)</div>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

