import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { X } from 'lucide-react';
import type { Category, Venue } from '../../types';
import { DraggableVenueCard } from './DraggableVenueCard';
import { DistrictColumn } from './DistrictColumn';

type Patch = { id: string; patch: Partial<Venue> };

export const AdminPanel: React.FC<{
  open: boolean;
  onClose: () => void;
  venues: Venue[];
  districts: string[];
  onSave: (patches: Patch[]) => void;
}> = ({ open, onClose, venues, districts, onSave }) => {
  const [local, setLocal] = useState<Venue[]>(venues);
  const [dirty, setDirty] = useState<Map<string, Partial<Venue>>>(new Map());

  React.useEffect(() => {
    if (open) {
      setLocal(venues);
      setDirty(new Map());
    }
  }, [open, venues]);

  const { unmatched, byDistrict } = useMemo(() => {
    const map = new Map<string, Venue[]>();
    for (const d of districts) map.set(d, []);
    const um: Venue[] = [];
    for (const v of local) {
      if (v.district && map.has(v.district)) map.get(v.district)!.push(v);
      else um.push(v);
    }
    return { unmatched: um, byDistrict: map };
  }, [districts, local]);

  const setPatch = (id: string, patch: Partial<Venue>) => {
    setDirty((prev) => {
      const next = new Map(prev);
      const current = next.get(id) ?? {};
      next.set(id, { ...current, ...patch });
      return next;
    });
    setLocal((prev) => prev.map(v => (v.id === id ? { ...v, ...patch } : v)));
  };

  const onCategoryChange = (id: string, category: Category | null) => {
    setPatch(id, { category });
  };

  const onDragEnd = (e: DragEndEvent) => {
    const id = String(e.active.id);
    const over = e.over?.id ? String(e.over.id) : null;
    if (!over) return;

    if (over.startsWith('district:')) {
      const district = over.replace('district:', '');
      setPatch(id, { district });
      return;
    }
    if (over === 'unmatched') {
      setPatch(id, { district: null });
      return;
    }
  };

  const UnmatchedDropZone: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { setNodeRef, isOver } = useDroppable({ id: 'unmatched' });
    return (
      <div
        ref={setNodeRef}
        className={`rounded-2xl border p-3 space-y-3 min-h-[220px] ${
          isOver ? 'border-[rgba(245,240,232,0.16)] bg-[#2e2e2e]' : 'border-[rgba(245,240,232,0.08)] bg-[#242424]'
        }`}
      >
        {children}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            className="h-full w-full max-w-6xl mx-auto bg-[#1a1a1a] border border-[rgba(245,240,232,0.12)] rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="bg-[#111111] border-b border-[rgba(245,240,232,0.08)] px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-[#F5F0E8] font-semibold tracking-tight">Admin Paneli</div>
                <div className="text-xs text-[#6B6560] mt-1">Sürükle-bırak ile semt eşleştir, kategori seç, sonra kaydet.</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSave(Array.from(dirty.entries()).map(([id, patch]) => ({ id, patch })))}
                  disabled={dirty.size === 0}
                  className="min-h-[44px] px-4 rounded-2xl bg-[#9A5C28] text-[#F5F0E8] font-semibold disabled:opacity-35"
                >
                  Değişiklikleri Kaydet
                </button>
                <button
                  onClick={onClose}
                  className="min-touch w-10 h-10 rounded-2xl bg-[#2e2e2e] border border-[rgba(245,240,232,0.08)] text-[#A8A095] flex items-center justify-center"
                >
                  <X size={20} strokeWidth={1.6} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-5">
              <DndContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-[#6B6560] mb-3">Eşleştirilmemiş</div>
                    <UnmatchedDropZone>
                      <SortableContext items={unmatched.map(v => v.id)} strategy={verticalListSortingStrategy}>
                        {unmatched.map((v) => (
                          <DraggableVenueCard key={v.id} venue={v} onCategoryChange={onCategoryChange} />
                        ))}
                      </SortableContext>
                    </UnmatchedDropZone>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {districts.map((d) => (
                      <DistrictColumn
                        key={d}
                        district={d}
                        venues={byDistrict.get(d) ?? []}
                        onCategoryChange={onCategoryChange}
                      />
                    ))}
                  </div>
                </div>
              </DndContext>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

