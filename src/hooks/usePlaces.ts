import { useEffect, useMemo, useState } from 'react';
import { getAutocompleteSuggestions, getPlaceDetails, isPlacesReady } from '../lib/placesApi';

export type PlacesSuggestion = {
  description: string;
  placeId: string;
};

export function usePlaces(query: string) {
  const [ready, setReady] = useState(isPlacesReady());
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlacesSuggestion[]>([]);

  useEffect(() => {
    if (ready) return;
    const id = window.setInterval(() => {
      const ok = isPlacesReady();
      if (ok) {
        setReady(true);
        window.clearInterval(id);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [ready]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ready) return;
      const q = query.trim();
      if (!q) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      const res = await getAutocompleteSuggestions(q);
      if (!cancelled) setSuggestions(res);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [query, ready]);

  const api = useMemo(() => ({
    ready,
    loading,
    suggestions,
    getDetails: getPlaceDetails,
  }), [ready, loading, suggestions]);

  return api;
}

