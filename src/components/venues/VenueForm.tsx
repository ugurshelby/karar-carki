import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Search, X } from 'lucide-react';
import { usePlaces } from '../../hooks/usePlaces';
import type { Category, Venue } from '../../types';
import CategoryIcon from '../ui/CategoryIcon';

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
  initialVenue?: Venue;
  onUpdate?: (id: string, patch: Partial<Venue>) => void;
}> = ({ open, onClose, districts, onSubmit, initialVenue, onUpdate }) => {
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

  const isEdit = !!initialVenue;

  useEffect(() => {
    if (!open) return;
    if (!initialVenue) return;
    setDraft({
      ...initialVenue,
      // ensure partial is safe
      category: initialVenue.category ?? 'yemek',
      tags: initialVenue.tags ?? [],
    });
    setStep(2);
    setQuery('');
  }, [open, initialVenue]);

  const canContinueStep2 = !!draft.name;
  const canSubmit = !!draft.name && !!draft.district && !!draft.category;

  const title = useMemo(() => {
    if (isEdit) return 'Mekan Düzenle';
    if (step === 1) return 'Mekan Ara';
    if (step === 2) return 'Detayları Kontrol Et';
    return 'Kategori & Semt';
  }, [isEdit, step]);

  const close = () => {
    onClose();
    reset();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-49"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,0,0,0.65)' }}
            onClick={close}
          />

          <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-6">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
              className="w-full md:max-w-[480px]"
              style={{
                background: 'var(--bg-surface)',
                borderRadius: 'var(--r-xl)',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '0 20px 32px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:hidden" style={{ margin: '12px auto 0', width: 40, height: 4, background: 'var(--border-strong)', borderRadius: 'var(--r-full)' }} />

              <div className="flex items-center justify-between" style={{ paddingTop: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {isEdit ? 'Mekan Düzenle' : 'Yeni Mekan'}
                </div>
                <button
                  onClick={close}
                  className="min-touch"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}
                  aria-label="Kapat"
                  type="button"
                >
                  <X size={20} strokeWidth={1.6} />
                </button>
              </div>

              <div className="flex items-center justify-center" style={{ gap: 6, marginBottom: 24 }}>
                {[1, 2, 3].map((i) => {
                  const active = step === i;
                  const past = step > i;
                  return (
                    <div
                      key={i}
                      style={{
                        height: 6,
                        width: active ? 20 : 6,
                        borderRadius: 'var(--r-full)',
                        background: past ? 'rgba(154,92,40,0.5)' : active ? 'var(--accent)' : 'var(--border-strong)',
                        transition: 'width 0.2s, background 0.2s',
                      }}
                    />
                  );
                })}
              </div>

              <AnimatePresence mode="popLayout">
                {!isEdit && step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <div className="relative">
                <Search size={18} strokeWidth={1.6} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ready ? 'Mekan adı ara (Google Places)' : 'Google Places yükleniyor...'}
                  className="w-full"
                  style={{
                    height: 52,
                    background: 'var(--bg-elevated)',
                    border: '0.5px solid var(--border)',
                    borderRadius: 'var(--r-md)',
                    padding: '0 16px 0 44px',
                    fontSize: 15,
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginTop: 8, borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                {loading ? <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Öneriler yükleniyor...</div> : null}
                {!ready ? <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Places script’i hazır değil.</div> : null}
                {suggestions.map((s, idx) => (
                  <button
                    key={s.placeId}
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
                    className="w-full text-left"
                    style={{
                      background: 'var(--bg-elevated)',
                      padding: '12px 16px',
                      border: 'none',
                      borderBottom: idx === suggestions.length - 1 ? 'none' : '0.5px solid var(--border)',
                      cursor: 'pointer',
                    }}
                    type="button"
                  >
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{s.description}</div>
                  </button>
                ))}
                {ready && query.trim() && suggestions.length === 0 && !loading ? (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', paddingTop: 8 }}>Öneri bulunamadı.</div>
                ) : null}
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
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  Kategori
                </div>
                <div className="grid grid-cols-2" style={{ gap: 10 }}>
                  {CATEGORIES.map((c) => (
                    <motion.button
                      key={c.value}
                      type="button"
                      onClick={() => setDraft((p) => ({ ...p, category: c.value }))}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        padding: '14px 10px',
                        borderRadius: 'var(--r-md)',
                        background: draft.category === c.value ? `var(--cat-${c.value === 'yemek' ? 'food' : c.value === 'kafe' ? 'cafe' : c.value === 'tatlı' ? 'sweet' : 'bar'}-bg)` : 'var(--bg-elevated)',
                        border: `0.5px solid ${draft.category === c.value ? `var(--cat-${c.value === 'yemek' ? 'food' : c.value === 'kafe' ? 'cafe' : c.value === 'tatlı' ? 'sweet' : 'bar'}-border)` : 'var(--border)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <CategoryIcon category={c.value} size={22} />
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</div>
                    </motion.button>
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

              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                {step > 1 ? (
                  <button
                    onClick={() => setStep((s) => (s === 2 ? 1 : 2))}
                    className="min-touch"
                    style={{
                      height: 52,
                      padding: '0 16px',
                      borderRadius: 'var(--r-md)',
                      background: 'transparent',
                      border: '0.5px solid var(--border)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                    type="button"
                  >
                    Geri
                  </button>
                ) : null}

                {!isEdit && step === 1 ? (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    disabled={!draft.name}
                    className="min-touch"
                    style={{
                      flex: 1,
                      height: 52,
                      borderRadius: 'var(--r-md)',
                      background: 'var(--accent)',
                      color: '#fff',
                      border: 'none',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: draft.name ? 1 : 0.4,
                    }}
                    type="button"
                  >
                    Devam
                  </motion.button>
                ) : null}

                {step === 2 ? (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(3)}
                    disabled={!canContinueStep2}
                    className="min-touch"
                    style={{
                      flex: 1,
                      height: 52,
                      borderRadius: 'var(--r-md)',
                      background: 'var(--accent)',
                      color: '#fff',
                      border: 'none',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: canContinueStep2 ? 1 : 0.4,
                    }}
                    type="button"
                  >
                    Devam
                  </motion.button>
                ) : null}

                {step === 3 ? (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!canSubmit) return;
                      if (isEdit && initialVenue && onUpdate) {
                        const patch: Partial<Venue> = {
                          name: String(draft.name ?? initialVenue.name),
                          district: draft.district ?? initialVenue.district ?? null,
                          category: draft.category ?? initialVenue.category ?? null,
                          tags: draft.tags ?? initialVenue.tags ?? [],
                        };
                        onUpdate(initialVenue.id, patch);
                      } else {
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
                      }
                      close();
                    }}
                    disabled={!canSubmit}
                    className="min-touch"
                    style={{
                      flex: 1,
                      height: 52,
                      borderRadius: 'var(--r-md)',
                      background: 'var(--accent)',
                      color: '#fff',
                      border: 'none',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: canSubmit ? 1 : 0.4,
                    }}
                    type="button"
                  >
                    {isEdit ? 'Güncelle' : 'Kaydet'}
                  </motion.button>
                ) : null}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

