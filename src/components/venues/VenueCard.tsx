import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import type { Category, Venue } from '../../types';
import { Badge } from '../ui/Badge';

function categoryLabel(cat: Category | null): string {
  if (cat === 'yemek') return 'Yemek';
  if (cat === 'tatlı') return 'Tatlı';
  if (cat === 'kafe') return 'Kafe';
  if (cat === 'bar') return 'Bar';
  return 'Belirsiz';
}

function formatPrice(level: number | null | undefined): string {
  if (typeof level !== 'number' || level < 0) return '—';
  const capped = Math.min(4, Math.max(0, level));
  if (capped === 0) return 'Ücretsiz';
  return '₺'.repeat(capped);
}

export const VenueCard: React.FC<{ venue: Venue }> = ({ venue }) => {
  const mapsUrl = venue.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${venue.placeId}`
    : null;

  return (
    <div
      className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-lg transition-transform md:hover:scale-[1.02] md:hover:shadow-2xl"
      style={{
        backgroundImage: venue.photoUrl ? `url(${venue.photoUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-black/0" />

      <div className="absolute left-4 top-4">
        <Badge tone="accent">{categoryLabel(venue.category)}</Badge>
      </div>

      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute right-3 top-3 min-touch w-10 h-10 rounded-full bg-black/35 border border-white/10 backdrop-blur flex items-center justify-center text-white/90 hover:text-white transition-colors"
          aria-label="Google Maps’te aç"
        >
          <ExternalLink size={18} />
        </a>
      )}

      <div className="relative p-5 pt-20">
        <div className="mt-16">
          <div className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            {venue.name}
          </div>
          <div className="text-sm text-white/65 mt-1">
            {venue.district ?? 'Eşleştirilmemiş'}
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Star size={16} className="text-amber-300" />
            <span>{typeof venue.rating === 'number' ? venue.rating.toFixed(1) : '—'}</span>
          </div>
          <div className="text-sm font-semibold text-white/90">
            {formatPrice(venue.priceLevel)}
          </div>
        </div>
      </div>
    </div>
  );
};

