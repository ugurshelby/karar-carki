import React from 'react';
import { MapPin, Star } from 'lucide-react';
import type { Category, Venue } from '../../types';
import { getGoogleMapsUrl } from '../../lib/mapsUrls';
import { useVenuePlacesEnrichment } from '../../hooks/useVenuePlacesEnrichment';
import { Badge } from '../ui/Badge';
import CategoryBadge from '../ui/CategoryBadge';

function price(level: number | null | undefined): string {
  if (typeof level !== 'number' || level < 0) return '—';
  if (level === 0) return 'Ücretsiz';
  return '₺'.repeat(Math.min(4, level));
}

function categoryLabel(cat: Category | null): string {
  if (cat === 'yemek') return 'Yemek';
  if (cat === 'tatlı') return 'Tatlı';
  if (cat === 'kafe') return 'Kafe';
  if (cat === 'bar') return 'Bar';
  return 'Mekan';
}

function categoryTint(cat: Category | null): string {
  if (cat === 'yemek') return 'rgba(232,72,32,0.22)';
  if (cat === 'kafe') return 'rgba(181,113,58,0.2)';
  if (cat === 'tatlı') return 'rgba(91,175,214,0.18)';
  if (cat === 'bar') return 'rgba(76,168,106,0.18)';
  return 'rgba(107,101,96,0.2)';
}

export const WinnerCard: React.FC<{ venue: Venue; title?: string }> = ({ venue: venueIn, title = 'Sürpriz' }) => {
  const venue = useVenuePlacesEnrichment(venueIn);
  const mapsUrl = getGoogleMapsUrl(venue);

  return (
    <div
      className="relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl border border-[rgba(245,240,232,0.12)] bg-[#242424] shadow-2xl"
      style={{
        backgroundImage: venue.photoUrl ? `url(${venue.photoUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!venue.photoUrl && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(165deg, ${categoryTint(venue.category)} 0%, #242424 55%)`,
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/20" />

      <div className="relative z-10 flex shrink-0 items-start justify-between gap-3 px-4 pt-4">
        <Badge tone="accent">{title}</Badge>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="min-touch flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(245,240,232,0.16)] bg-[rgba(245,240,232,0.15)] backdrop-blur"
          aria-label="Google Maps’te aç"
        >
          <MapPin size={18} strokeWidth={1.6} className="text-[#F5F0E8]" />
        </a>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-6 pt-14">
        {venue.category ? (
          <div className="mb-2">
            <CategoryBadge category={venue.category} size="md" />
          </div>
        ) : null}
        <div
          className="mt-2 wrap-break-word text-3xl font-semibold tracking-tight text-[#F5F0E8] sm:text-4xl"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {venue.name}
        </div>
        <div className="mt-2 text-sm text-[#A8A095]">{venue.district ?? 'Eşleştirilmemiş'}</div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-sm text-[#A8A095]">
            <Star size={18} strokeWidth={1.6} className="shrink-0 text-[#F5A020]" />
            <span>{typeof venue.rating === 'number' ? venue.rating.toFixed(1) : '—'}</span>
          </div>
          <div className="shrink-0 text-sm font-semibold text-[#A8A095]">{price(venue.priceLevel)}</div>
        </div>
      </div>
    </div>
  );
};
