import React from 'react';
import { MapPin, Star } from 'lucide-react';
import type { Venue } from '../../types';
import { Badge } from '../ui/Badge';

function price(level: number | null | undefined): string {
  if (typeof level !== 'number' || level < 0) return '—';
  if (level === 0) return 'Ücretsiz';
  return '₺'.repeat(Math.min(4, level));
}

export const WinnerCard: React.FC<{ venue: Venue; title?: string }> = ({ venue, title = 'Sürpriz' }) => {
  const mapsUrl = venue.placeId ? `https://www.google.com/maps/place/?q=place_id:${venue.placeId}` : null;

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[rgba(245,240,232,0.12)] bg-[#242424] shadow-2xl"
      style={{
        backgroundImage: venue.photoUrl ? `url(${venue.photoUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 200,
      }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />

      <div className="absolute left-4 top-4">
        <Badge tone="accent">{title}</Badge>
      </div>

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-4 min-touch w-10 h-10 rounded-full bg-[rgba(245,240,232,0.15)] border border-[rgba(245,240,232,0.16)] backdrop-blur flex items-center justify-center"
          aria-label="Google Maps’te aç"
        >
          <MapPin size={18} strokeWidth={1.6} className="text-[#F5F0E8]" />
        </a>
      )}

      <div className="relative p-6 flex flex-col justify-end h-full">
        <div className="text-4xl font-semibold tracking-tight text-[#F5F0E8]" style={{ fontFamily: 'var(--font-serif)' }}>
          {venue.name}
        </div>
        <div className="text-sm text-[#A8A095] mt-2">{venue.district ?? 'Eşleştirilmemiş'}</div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#A8A095] text-sm">
            <Star size={18} strokeWidth={1.6} className="text-[#F5A020]" />
            <span>{typeof venue.rating === 'number' ? venue.rating.toFixed(1) : '—'}</span>
          </div>
          <div className="text-sm font-semibold text-[#A8A095]">{price(venue.priceLevel)}</div>
        </div>
      </div>
    </div>
  );
};

