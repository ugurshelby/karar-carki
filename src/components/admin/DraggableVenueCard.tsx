import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Category, Venue } from '../../types';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'yemek', label: 'yemek' },
  { value: 'tatlı', label: 'tatlı' },
  { value: 'kafe', label: 'kafe' },
  { value: 'bar', label: 'bar' },
];

export const DraggableVenueCard: React.FC<{
  venue: Venue;
  onCategoryChange: (id: string, category: Category | null) => void;
}> = ({ venue, onCategoryChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: venue.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-2xl bg-[#242424] border border-[rgba(245,240,232,0.08)]"
    >
      <button
        className="min-touch w-9 h-9 rounded-xl bg-[#2e2e2e] border border-[rgba(245,240,232,0.08)] text-[#6B6560] flex items-center justify-center"
        {...attributes}
        {...listeners}
        aria-label="Sürükle"
      >
        <GripVertical size={18} strokeWidth={1.6} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-[#F5F0E8] truncate">{venue.name}</div>
        <div className="text-xs text-[#A8A095] truncate">{venue.district ?? 'Eşleştirilmemiş'}</div>
      </div>

      <select
        value={venue.category ?? ''}
        onChange={(e) => onCategoryChange(venue.id, (e.target.value || null) as Category | null)}
        className="bg-[#2e2e2e] border border-[rgba(245,240,232,0.08)] rounded-xl px-3 py-2 text-xs text-[#F5F0E8] focus:outline-none focus:border-[rgba(245,240,232,0.16)]"
      >
        <option value="">—</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
};

