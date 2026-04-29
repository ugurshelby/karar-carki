import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Modal } from '../ui/Modal';

export const DistrictForm: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <MapPin className="text-amber-300" size={18} />
            <h2 className="text-lg font-bold text-white">Yeni Semt</h2>
          </div>
          <button onClick={onClose} className="min-touch w-9 h-9 rounded-full bg-[#262626] text-gray-300 hover:bg-[#333] flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <div className="relative mb-4">
          <div className="absolute right-3 top-3 opacity-10">
            <MapPin size={48} />
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Semt adı (örn. Bahçeli)"
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
            autoFocus
          />
        </div>

        <button
          onClick={() => {
            const trimmed = name.trim();
            if (!trimmed) return;
            onSubmit(trimmed);
            setName('');
            onClose();
          }}
          disabled={!name.trim()}
          className="w-full min-h-[48px] rounded-2xl bg-white text-black font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          Ekle
        </button>
      </div>
    </Modal>
  );
};

