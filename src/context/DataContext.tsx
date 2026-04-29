import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_DATA, DISTRICTS as INITIAL_DISTRICTS } from '../data';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import type { Category, Venue } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  venues: Venue[];
  districts: string[];
  loading: boolean;
  addVenue: (venue: Venue) => void;
  removeVenue: (id: string) => void;
  updateVenue: (id: string, patch: Partial<Venue>) => void;
  bulkUpdateVenues: (patches: Array<{ id: string; patch: Partial<Venue> }>) => void;
  addDistrict: (name: string) => void;
  removeDistrict: (name: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

type LegacyCategory = 'yemek' | 'tatlı-kahve';

function migrateCategory(category: unknown, tags: unknown): Category | null {
  if (category === 'yemek') return 'yemek';
  if (category === 'tatlı') return 'tatlı';
  if (category === 'kafe') return 'kafe';
  if (category === 'bar') return 'bar';

  if (category === 'tatlı-kahve') {
    const tagList = Array.isArray(tags) ? tags : [];
    const hasBar = tagList.some(t => String(t).toLowerCase() === 'bar');
    const hasTatli = tagList.some(t => String(t).toLowerCase() === 'tatlı' || String(t).toLowerCase() === 'tatli');
    if (hasBar) return 'bar';
    if (hasTatli) return 'tatlı';
    return 'kafe';
  }
  return null;
}

function normalizeVenue(input: unknown): Venue | null {
  if (!input || typeof input !== 'object') return null;
  const r = input as Record<string, unknown>;
  const id = typeof r.id === 'string' ? r.id : null;
  const name = typeof r.name === 'string' ? r.name : null;
  if (!id || !name) return null;

  const tags = Array.isArray(r.tags) ? r.tags.map(t => String(t)) : [];
  const category = migrateCategory(r.category, tags);

  const placeId =
    typeof r.placeId === 'string'
      ? r.placeId
      : (typeof r.place_id === 'string' ? r.place_id : null);

  const priceLevel =
    typeof r.priceLevel === 'number'
      ? r.priceLevel
      : (typeof r.price_level === 'number' ? r.price_level : null);

  const photoUrl =
    typeof r.photoUrl === 'string'
      ? r.photoUrl
      : (typeof r.photo_url === 'string' ? r.photo_url : null);

  return {
    id,
    name,
    district: typeof r.district === 'string' ? r.district : null,
    category,
    tags,
    ...(typeof r.isCustom === 'boolean' ? { isCustom: r.isCustom } : {}),

    placeId,
    rating: typeof r.rating === 'number' ? r.rating : null,
    priceLevel,
    photoUrl,
    address: typeof r.address === 'string' ? r.address : null,
    lat: typeof r.lat === 'number' ? r.lat : null,
    lng: typeof r.lng === 'number' ? r.lng : null,
  };
}

function migrateVenues(list: unknown, fallback: Venue[]): Venue[] {
  const arr = Array.isArray(list) ? list : [];
  const migrated = arr.map(normalizeVenue).filter((v): v is Venue => !!v);
  return migrated.length > 0 ? migrated : fallback;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const isAdmin = session?.isAdmin ?? false;

  const [venues, setVenues] = useState<Venue[]>(() => migrateVenues(loadFromStorage('venues', INITIAL_DATA), INITIAL_DATA));
  const [districts, setDistricts] = useState<string[]>(() => loadFromStorage('districts', INITIAL_DISTRICTS));
  const [loading, setLoading] = useState(isSupabaseEnabled());

  // Supabase’ten ilk yükleme
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const [vRes, dRes] = await Promise.all([
          supabase.from('venues').select('*').order('created_at', { ascending: true }),
          supabase.from('districts').select('name').order('sort_order', { ascending: true }),
        ]);

        if (cancelled) return;

        if (vRes.data && vRes.data.length > 0) {
          const list = migrateVenues(vRes.data, INITIAL_DATA);
          setVenues(list);
        } else {
          // İlk kurulum: statik mekan ve bölgeleri Supabase’e ekle
          await supabase.from('venues').insert(INITIAL_DATA.map(v => ({
            id: v.id,
            name: v.name,
            district: v.district ?? '',
            category: v.category,
            tags: v.tags,
            is_custom: v.isCustom ?? false,
            place_id: v.placeId ?? null,
            rating: v.rating ?? null,
            price_level: v.priceLevel ?? null,
            photo_url: v.photoUrl ?? null,
            address: v.address ?? null,
            lat: v.lat ?? null,
            lng: v.lng ?? null,
          })));
          await supabase.from('districts').insert(INITIAL_DISTRICTS.map((name, i) => ({ name, sort_order: i })));
          setVenues(INITIAL_DATA);
          setDistricts(INITIAL_DISTRICTS);
        }
        if (dRes.data && dRes.data.length > 0) {
          setDistricts(dRes.data.map((r: { name: string }) => r.name));
        }
      } catch (_) {
        // Supabase yoksa veya hata varsa mevcut state (localStorage) kalsın
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Her durumda localStorage’a yansıt (yedek / Supabase yokken tek kaynak)
  useEffect(() => {
    saveToStorage('venues', venues);
  }, [venues]);
  useEffect(() => {
    saveToStorage('districts', districts);
  }, [districts]);

  const addVenue = useCallback(async (venue: Venue) => {
    if (!isAdmin) return;
    setVenues(prev => [...prev, venue]);
    if (supabase) {
      try {
        await supabase.from('venues').insert({
          id: venue.id,
          name: venue.name,
          district: venue.district ?? '',
          category: venue.category,
          tags: venue.tags ?? [],
          is_custom: venue.isCustom ?? false,
          place_id: venue.placeId ?? null,
          rating: venue.rating ?? null,
          price_level: venue.priceLevel ?? null,
          photo_url: venue.photoUrl ?? null,
          address: venue.address ?? null,
          lat: venue.lat ?? null,
          lng: venue.lng ?? null,
        });
      } catch {
        setVenues(prev => prev.filter(v => v.id !== venue.id));
      }
    } else {
      saveToStorage('venues', [...venues, venue]);
    }
  }, [isAdmin, venues]);

  const removeVenue = useCallback(async (id: string) => {
    if (!isAdmin) return;
    setVenues(prev => prev.filter(v => v.id !== id));
    if (supabase) {
      try {
        await supabase.from('venues').delete().eq('id', id);
      } catch {
        setVenues(prev => [...prev, ...venues.filter(v => v.id === id)]);
      }
    } else {
      saveToStorage('venues', venues.filter(v => v.id !== id));
    }
  }, [isAdmin, venues]);

  const updateVenue = useCallback(async (id: string, patch: Partial<Venue>) => {
    if (!isAdmin) return;
    const prevSnapshot = venues;
    setVenues(prev => prev.map(v => (v.id === id ? { ...v, ...patch } : v)));

    if (supabase) {
      try {
        const updateRow: Record<string, unknown> = {};
        if ('name' in patch && typeof patch.name === 'string') updateRow.name = patch.name;
        if ('district' in patch) updateRow.district = patch.district ?? null;
        if ('category' in patch) updateRow.category = patch.category ?? null;
        if ('tags' in patch && Array.isArray(patch.tags)) updateRow.tags = patch.tags;
        if ('isCustom' in patch) updateRow.is_custom = patch.isCustom ?? false;
        if ('placeId' in patch) updateRow.place_id = patch.placeId ?? null;
        if ('rating' in patch) updateRow.rating = patch.rating ?? null;
        if ('priceLevel' in patch) updateRow.price_level = patch.priceLevel ?? null;
        if ('photoUrl' in patch) updateRow.photo_url = patch.photoUrl ?? null;
        if ('address' in patch) updateRow.address = patch.address ?? null;
        if ('lat' in patch) updateRow.lat = patch.lat ?? null;
        if ('lng' in patch) updateRow.lng = patch.lng ?? null;

        await supabase.from('venues').update(updateRow).eq('id', id);
      } catch {
        setVenues(prevSnapshot);
      }
    } else {
      saveToStorage('venues', venues.map(v => (v.id === id ? { ...v, ...patch } : v)));
    }
  }, [isAdmin, venues]);

  const bulkUpdateVenues = useCallback(async (patches: Array<{ id: string; patch: Partial<Venue> }>) => {
    if (!isAdmin) return;
    if (patches.length === 0) return;
    const prevSnapshot = venues;

    const patchMap = new Map(patches.map(p => [p.id, p.patch] as const));
    const next = venues.map(v => (patchMap.has(v.id) ? { ...v, ...patchMap.get(v.id)! } : v));
    setVenues(next);

    if (supabase) {
      try {
        const rows = patches.map(({ id, patch }) => ({
          id,
          ...(typeof patch.name === 'string' ? { name: patch.name } : {}),
          ...(patch.district !== undefined ? { district: patch.district } : {}),
          ...(patch.category !== undefined ? { category: patch.category } : {}),
          ...(Array.isArray(patch.tags) ? { tags: patch.tags } : {}),
          ...(patch.isCustom !== undefined ? { is_custom: patch.isCustom } : {}),
          ...(patch.placeId !== undefined ? { place_id: patch.placeId } : {}),
          ...(patch.rating !== undefined ? { rating: patch.rating } : {}),
          ...(patch.priceLevel !== undefined ? { price_level: patch.priceLevel } : {}),
          ...(patch.photoUrl !== undefined ? { photo_url: patch.photoUrl } : {}),
          ...(patch.address !== undefined ? { address: patch.address } : {}),
          ...(patch.lat !== undefined ? { lat: patch.lat } : {}),
          ...(patch.lng !== undefined ? { lng: patch.lng } : {}),
        }));
        await supabase.from('venues').upsert(rows, { onConflict: 'id' });
      } catch {
        setVenues(prevSnapshot);
      }
    } else {
      saveToStorage('venues', next);
    }
  }, [isAdmin, venues]);

  const addDistrict = useCallback(async (name: string) => {
    if (!isAdmin) return;
    if (districts.includes(name)) return;
    const next = [...districts, name];
    setDistricts(next);
    if (supabase) {
      try {
        await supabase.from('districts').upsert({ name, sort_order: next.length - 1 }, { onConflict: 'name' });
      } catch {
        setDistricts(prev => prev.filter(d => d !== name));
      }
    } else {
      saveToStorage('districts', next);
    }
  }, [isAdmin, districts]);

  const removeDistrict = useCallback(async (name: string) => {
    if (!isAdmin) return;
    setDistricts(prev => prev.filter(d => d !== name));
    if (supabase) {
      try {
        await supabase.from('districts').delete().eq('name', name);
      } catch {
        setDistricts(prev => [...prev, name]);
      }
    } else {
      saveToStorage('districts', districts.filter(d => d !== name));
    }
  }, [isAdmin, districts]);

  return (
    <DataContext.Provider value={{
      venues,
      districts,
      loading,
      addVenue,
      removeVenue,
      updateVenue,
      bulkUpdateVenues,
      addDistrict,
      removeDistrict,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
