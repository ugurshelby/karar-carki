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
        className="space-y-3"
        style={{
          borderRadius: 'var(--r-md)',
          padding: 8,
          minHeight: 120,
          border: isOver ? '1.5px dashed var(--accent)' : '1.5px dashed transparent',
          background: isOver ? 'var(--accent-glow)' : 'transparent',
          transition: '150ms',
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-45"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.4 }}
          style={{ background: 'var(--bg-base)' }}
        >
          <div
            className="sticky top-0 z-10"
            style={{
              background: 'var(--bg-overlay)',
              borderBottom: '0.5px solid var(--border)',
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>Admin Paneli</div>
            <button
              onClick={onClose}
              className="min-touch flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--r-full)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
              aria-label="Kapat"
              type="button"
            >
              <X size={22} strokeWidth={1.6} />
            </button>
          </div>

          <div
            className="flex-1 overflow-auto"
            style={{
              padding: 16,
              paddingBottom: 90,
              scrollbarWidth: 'none',
            }}
          >
            <DndContext onDragEnd={onDragEnd}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div style={{ width: '100%' }} className="md:w-[280px] md:shrink-0">
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 8,
                    }}
                  >
                    Eşleştirilmemiş
                  </div>

                  <UnmatchedDropZone>
                    <SortableContext items={unmatched.map(v => v.id)} strategy={verticalListSortingStrategy}>
                      {unmatched.length === 0 ? (
                        <div
                          style={{
                            borderRadius: 'var(--r-md)',
                            padding: 16,
                            border: '1.5px dashed var(--border-strong)',
                            color: 'var(--text-muted)',
                            textAlign: 'center',
                            fontSize: 12,
                          }}
                        >
                          Buraya bırak
                        </div>
                      ) : null}
                      {unmatched.map((v) => (
                        <DraggableVenueCard key={v.id} venue={v} onCategoryChange={onCategoryChange} />
                      ))}
                    </SortableContext>
                  </UnmatchedDropZone>
                </div>

                <div className="flex-1">
                  <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    {districts.map((d) => (
                      <div key={d} style={{ minWidth: 200, flexShrink: 0 }}>
                        <DistrictColumn
                          district={d}
                          venues={byDistrict.get(d) ?? []}
                          onCategoryChange={onCategoryChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DndContext>
          </div>

          <div
            className="sticky bottom-0"
            style={{
              background: 'var(--bg-overlay)',
              borderTop: '0.5px solid var(--border)',
              padding: `12px 16px calc(12px + env(safe-area-inset-bottom))`,
            }}
          >
            <button
              onClick={() => onSave(Array.from(dirty.entries()).map(([id, patch]) => ({ id, patch })))}
              disabled={dirty.size === 0}
              className="min-touch w-full"
              style={{
                height: 52,
                borderRadius: 'var(--r-md)',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                border: 'none',
                opacity: dirty.size === 0 ? 0.4 : 1,
                cursor: dirty.size === 0 ? 'default' : 'pointer',
              }}
              type="button"
            >
              Değişiklikleri Kaydet
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

