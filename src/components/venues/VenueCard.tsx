import React from 'react';
import { ExternalLink, Pencil, Star, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Venue } from '../../types';
import { getGoogleMapsUrl } from '../../lib/mapsUrls';
import { useVenuePlacesEnrichment } from '../../hooks/useVenuePlacesEnrichment';
import CategoryBadge from '../ui/CategoryBadge';

function cssKey(category: Venue['category']): string {
  if (category === 'yemek') return 'food';
  if (category === 'kafe') return 'cafe';
  if (category === 'tatlı') return 'sweet';
  if (category === 'bar') return 'bar';
  return 'food';
}

export const VenueCard: React.FC<{
  venue: Venue;
  onDelete?: (id: string) => void;
  onEdit?: (venue: Venue) => void;
}> = ({ venue: venueIn, onDelete, onEdit }) => {
  const venue = useVenuePlacesEnrichment(venueIn);
  const key = cssKey(venue.category);

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.15 }}
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: 'var(--r-lg)',
        minHeight: 160,
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {venue.photoUrl ? (
        <img
          src={venue.photoUrl}
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, var(--cat-${key}-dark) 0%, color-mix(in srgb, var(--cat-${key}-dark) 60%, #000) 100%)`,
          }}
        />
      )}

      {!venue.photoUrl && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px) 0 0 / 20px 20px',
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)',
        }}
      />

      <div className="absolute z-2" style={{ top: 10, left: 10 }}>
        {venue.category ? <CategoryBadge category={venue.category} size="sm" /> : null}
      </div>

      <div className="absolute z-2 flex items-center" style={{ top: 10, right: 10, gap: 6 }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => window.open(getGoogleMapsUrl(venue), '_blank', 'noreferrer')}
          className="min-touch flex items-center justify-center"
          style={{
            borderRadius: 'var(--r-full)',
            padding: 6,
            border: 'none',
            background: 'rgba(0,0,0,0.4)',
            color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
          }}
          aria-label="Google Maps’te aç"
          type="button"
        >
          <ExternalLink size={18} strokeWidth={1.6} />
        </motion.button>

        {(onEdit || onDelete) && (
          <>
            {onEdit && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(venue)}
                className="min-touch flex items-center justify-center"
                style={{
                  borderRadius: 'var(--r-full)',
                  padding: 6,
                  border: 'none',
                  background: 'rgba(0,0,0,0.4)',
                  color: 'rgba(255,255,255,0.9)',
                  cursor: 'pointer',
                }}
                aria-label="Mekanı düzenle"
                type="button"
              >
                <Pencil size={18} strokeWidth={1.6} />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(venue.id)}
                className="min-touch flex items-center justify-center"
                style={{
                  borderRadius: 'var(--r-full)',
                  padding: 6,
                  border: 'none',
                  background: 'rgba(0,0,0,0.4)',
                  color: 'rgba(255,255,255,0.9)',
                  cursor: 'pointer',
                }}
                aria-label="Mekanı sil"
                type="button"
              >
                <Trash2 size={18} strokeWidth={1.6} />
              </motion.button>
            )}
          </>
        )}
      </div>

      <div className="absolute z-2" style={{ left: 0, right: 0, bottom: 0, padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {venue.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              {venue.district ?? 'Eşleştirilmemiş'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: '#F5A020' }}>
              <Star size={14} strokeWidth={1.6} style={{ color: '#F5A020' }} />
              <span>{typeof venue.rating === 'number' ? venue.rating.toFixed(1) : '—'}</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              {typeof venue.priceLevel === 'number' ? '₺'.repeat(Math.max(0, venue.priceLevel)) : '—'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

