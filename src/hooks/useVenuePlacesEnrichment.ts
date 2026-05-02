import { useEffect, useMemo, useState } from 'react';
import type { Venue } from '../types';
import { useData } from '../context/DataContext';
import { getAutocompleteSuggestions, getPlaceDetails, isPlacesReady } from '../lib/placesApi';

const sessionMerged = new Map<string, Partial<Venue>>();

let queueTail: Promise<void> = Promise.resolve();

function enqueue(fn: () => Promise<void>): void {
  queueTail = queueTail.then(() => fn()).then(
    () => new Promise<void>((r) => setTimeout(r, 350))
  );
}

const inFlight = new Set<string>();
/** Bir kez Places ile denendi; kısmi veri gelse de tekrar döngüye girilmez. */
const enrichedOnce = new Set<string>();

function needsEnrichment(v: Venue): boolean {
  return (
    v.photoUrl == null ||
    v.rating == null ||
    v.priceLevel == null ||
    v.lat == null ||
    v.lng == null ||
    v.placeId == null
  );
}

function mergePatch(venue: Venue, details: NonNullable<Awaited<ReturnType<typeof getPlaceDetails>>>): Partial<Venue> {
  return {
    placeId: details.placeId ?? venue.placeId ?? null,
    rating: typeof venue.rating === 'number' ? venue.rating : details.rating ?? null,
    priceLevel: typeof venue.priceLevel === 'number' ? venue.priceLevel : details.priceLevel ?? null,
    photoUrl: venue.photoUrl ?? details.photoUrl ?? null,
    address: venue.address ?? details.address ?? null,
    lat: typeof venue.lat === 'number' ? venue.lat : details.lat ?? null,
    lng: typeof venue.lng === 'number' ? venue.lng : details.lng ?? null,
  };
}

/**
 * Places yüklüyse eksik puan/foto/konum için otomatik tamamlar (oturum içi önbellek).
 * placeId yoksa isim+semt ile autocomplete’ten ilk eşleşmeyi dener. İstekler kuyrukta tek tek gider.
 */
export function useVenuePlacesEnrichment(venue: Venue): Venue {
  const { updateVenue } = useData();
  const [extra, setExtra] = useState<Partial<Venue>>(() => sessionMerged.get(venue.id) ?? {});
  const [placesReady, setPlacesReady] = useState(() => isPlacesReady());

  const effective = useMemo(() => ({ ...venue, ...sessionMerged.get(venue.id), ...extra }), [venue, extra]);

  useEffect(() => {
    if (placesReady) return;
    const id = window.setInterval(() => {
      if (isPlacesReady()) {
        setPlacesReady(true);
        window.clearInterval(id);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [placesReady]);

  useEffect(() => {
    setExtra(sessionMerged.get(venue.id) ?? {});
  }, [venue.id]);

  useEffect(() => {
    if (!placesReady) return;
    if (enrichedOnce.has(venue.id)) return;
    if (!needsEnrichment(effective)) return;
    if (inFlight.has(venue.id)) return;

    let cancelled = false;
    inFlight.add(venue.id);

    enqueue(async () => {
      try {
        if (cancelled) return;
        if (!isPlacesReady()) {
          inFlight.delete(venue.id);
          return;
        }

        let placeId = effective.placeId ?? null;
        if (!placeId) {
          const q = [venue.name, venue.district, 'Ankara'].filter(Boolean).join(' ');
          const suggestions = await getAutocompleteSuggestions(q);
          const first = suggestions[0];
          if (!first?.placeId) {
            enrichedOnce.add(venue.id);
            return;
          }
          placeId = first.placeId;
        }

        const details = await getPlaceDetails(placeId);
        enrichedOnce.add(venue.id);
        if (cancelled || !details) return;

        const base = { ...venue, ...(sessionMerged.get(venue.id) ?? {}) } as Venue;
        const patch = mergePatch(base, details);
        sessionMerged.set(venue.id, { ...sessionMerged.get(venue.id), ...patch });
        setExtra((prev) => ({ ...prev, ...patch }));
        void updateVenue(venue.id, patch);
      } finally {
        inFlight.delete(venue.id);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [effective, placesReady, updateVenue, venue, venue.id]);

  return effective;
}
