import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Search, X } from 'lucide-react';
import { BottomSheet } from '../ui/BottomSheet';
import { usePlaces } from '../../hooks/usePlaces';
import type { Category, Venue } from '../../types';

type Step = 1 | 2 | 3;

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'yemek', label: 'Yemek' },
  { value: 'tatlı', label: 'Tatlı' },
  { value: 'kafe', label: 'Kafe' },
  { value: 'bar', label: 'Bar' },
];

export const VenueForm: React.FC<{
  open: boolean;
  onClose: () => void;
  districts: string[];
  onSubmit: (venue: Venue) => void;
}> = ({ open, onClose, districts, onSubmit }) => {
  const [step, setStep] = useState<Step>(1);
  const [query, setQuery] = useState('');
  const { ready, loading, suggestions, getDetails } = usePlaces(query);

  const [draft, setDraft] = useState<Partial<Venue>>({
    category: 'yemek',
    tags: [],
  });

  const reset = () => {
    setStep(1);
    setQuery('');
    setDraft({ category: 'yemek', tags: [] });
  };

  const canContinueStep2 = !!draft.name;
  const canSubmit = !!draft.name && !!draft.district && !!draft.category;

  const title = useMemo(() => {
    if (step === 1) return 'Mekan Ara';
    if (step === 2) return 'Detayları Kontrol Et';
    return 'Kategori & Semt';
  }, [step]);

  return (
    <BottomSheet
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
    >
      <div className="p-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-white/50">Adım {step}/3</div>
            <div className="text-xl font-bold text-white">{title}</div>
          </div>
          <button onClick={() => { onClose(); reset(); }} className="min-touch w-9 h-9 rounded-full bg-[#262626] text-gray-300 hover:bg-[#333] flex items-center justify-center">
            <X size={18} />
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="space-y-4"
            >
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ready ? 'Mekan adı ara (Google Places)' : 'Google Places yükleniyor...'}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#0A0A0A] border border-[#262626] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div className="space-y-2">
                {loading && <div className="text-sm text-white/50">Öneriler yükleniyor...</div>}
                {!ready && <div className="text-sm text-white/50">Places script’i hazır değil.</div>}
                {suggestions.map((s) => (
                  <button
                    key={s.placeId}
                    className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    onClick={async () => {
                      const details = await getDetails(s.placeId);
                      if (!details) return;
                      setDraft((prev) => ({
                        ...prev,
                        id: `v-${Date.now()}`,
                        name: details.name,
                        placeId: details.placeId ?? null,
                        rating: details.rating ?? null,
                        priceLevel: details.priceLevel ?? null,
                        photoUrl: details.photoUrl ?? null,
                        address: details.address ?? null,
                        lat: details.lat ?? null,
                        lng: details.lng ?? null,
                      }));
                      setStep(2);
                    }}
                  >
                    <div className="text-white font-semibold">{s.description}</div>
                  </button>
                ))}
                {ready && query.trim() && suggestions.length === 0 && !loading && (
                  <div className="text-sm text-white/50">Öneri bulunamadı.</div>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">İsim</label>
                <input
                  value={draft.name ?? ''}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Adres</label>
                <textarea
                  rows={3}
                  value={draft.address ?? ''}
                  onChange={(e) => setDraft((p) => ({ ...p, address: e.target.value }))}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Yıldız</div>
                  <div className="text-white font-bold">{typeof draft.rating === 'number' ? draft.rating.toFixed(1) : '—'}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Fiyat</div>
                  <div className="text-white font-bold">{typeof draft.priceLevel === 'number' ? draft.priceLevel : '—'}</div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Kategori</label>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setDraft((p) => ({ ...p, category: c.value }))}
                      className={`min-h-[52px] rounded-2xl border text-sm font-semibold transition-colors ${
                        draft.category === c.value
                          ? 'bg-white text-black border-white'
                          : 'bg-[#0A0A0A] text-white/70 border-[#262626] hover:border-white/20'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Semt</label>
                <select
                  value={draft.district ?? ''}
                  onChange={(e) => setDraft((p) => ({ ...p, district: e.target.value }))}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white focus:outline-none focus:border-white/20 appearance-none transition-colors"
                >
                  <option value="">Seçiniz</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed left-0 right-0 bottom-0 p-6 bg-linear-to-t from-[#161616] via-[#161616] to-transparent">
          <div className="max-w-lg mx-auto flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s === 2 ? 1 : 2))}
                className="min-h-[48px] px-5 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:border-white/20 transition-colors"
              >
                Geri
              </button>
            )}
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                disabled={!draft.name}
                className="flex-1 min-h-[48px] rounded-2xl bg-white text-black font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Devam <ChevronRight size={18} />
              </button>
            )}
            {step === 2 && (
              <button
                onClick={() => setStep(3)}
                disabled={!canContinueStep2}
                className="flex-1 min-h-[48px] rounded-2xl bg-white text-black font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                Devam <ChevronRight size={18} />
              </button>
            )}
            {step === 3 && (
              <button
                onClick={() => {
                  if (!canSubmit) return;
                  const v: Venue = {
                    id: String(draft.id ?? `v-${Date.now()}`),
                    name: String(draft.name ?? ''),
                    district: String(draft.district ?? ''),
                    category: draft.category ?? null,
                    tags: draft.tags ?? [],
                    isCustom: true,
                    placeId: draft.placeId ?? null,
                    rating: draft.rating ?? null,
                    priceLevel: draft.priceLevel ?? null,
                    photoUrl: draft.photoUrl ?? null,
                    address: draft.address ?? null,
                    lat: draft.lat ?? null,
                    lng: draft.lng ?? null,
                  };
                  onSubmit(v);
                  onClose();
                  reset();
                }}
                disabled={!canSubmit}
                className="flex-1 min-h-[48px] rounded-2xl bg-white text-black font-bold disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Kaydet
              </button>
            )}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

