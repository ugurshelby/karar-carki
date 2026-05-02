import type { Venue } from '../types';

/** Google Maps aç: önce place_id, sonra koordinat, son çare metin araması (Ankara). */
export function getGoogleMapsUrl(
  venue: Pick<Venue, 'placeId' | 'name' | 'district' | 'lat' | 'lng'>
): string {
  if (venue.placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(venue.placeId)}`;
  }
  if (typeof venue.lat === 'number' && typeof venue.lng === 'number') {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${venue.lat},${venue.lng}`)}`;
  }
  const parts = [venue.name, venue.district, 'Ankara'].filter((p): p is string => !!p && p.length > 0);
  const text = parts.join(' ').trim() || 'Ankara';
  return `https://www.google.com/maps/search/${encodeURIComponent(text)}`;
}
