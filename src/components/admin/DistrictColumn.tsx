import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Venue } from '../../types';
import { DraggableVenueCard } from './DraggableVenueCard';
import type { Category } from '../../types';

export const DistrictColumn: React.FC<{
  district: string;
  venues: Venue[];
  onCategoryChange: (id: string, category: Category | null) => void;
}> = ({ district, venues, onCategoryChange }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `district:${district}` });

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-medium uppercase tracking-wider text-[#6B6560]">{district}</div>
      <div
        ref={setNodeRef}
        className={`min-h-[220px] rounded-2xl border p-3 space-y-3 ${
          isOver ? 'border-[rgba(245,240,232,0.16)] bg-[#2e2e2e]' : 'border-[rgba(245,240,232,0.08)] bg-[#242424]'
        }`}
      >
        <SortableContext items={venues.map(v => v.id)} strategy={verticalListSortingStrategy}>
          {venues.map((v) => (
            <DraggableVenueCard key={v.id} venue={v} onCategoryChange={onCategoryChange} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

