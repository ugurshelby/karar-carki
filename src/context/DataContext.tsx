import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Venue, Memory, INITIAL_DATA, DISTRICTS as INITIAL_DISTRICTS } from '../data';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

interface DataContextType {
  venues: Venue[];
  districts: string[];
  memories: Memory[];
  loading: boolean;
  addVenue: (venue: Venue) => void;
  removeVenue: (id: string) => void;
  addDistrict: (name: string) => void;
  removeDistrict: (name: string) => void;
  addMemory: (memory: Memory) => void;
  removeMemory: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

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
  const [venues, setVenues] = useState<Venue[]>(() => loadFromStorage('venues', INITIAL_DATA));
  const [districts, setDistricts] = useState<string[]>(() => loadFromStorage('districts', INITIAL_DISTRICTS));
  const [memories, setMemories] = useState<Memory[]>(() => loadFromStorage('memories', []));
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
        const [vRes, dRes, mRes] = await Promise.all([
          supabase.from('venues').select('*').order('created_at', { ascending: true }),
          supabase.from('districts').select('name').order('sort_order', { ascending: true }),
          supabase.from('memories').select('*').order('created_at', { ascending: false }),
        ]);

        if (cancelled) return;

        if (vRes.data && vRes.data.length > 0) {
          const list = vRes.data.map((r: { id: string; name: string; district: string; category: string; tags: string[]; is_custom?: boolean }) => ({
            id: r.id,
            name: r.name,
            district: r.district,
            category: r.category as 'yemek' | 'tatlı-kahve',
            tags: r.tags ?? [],
            isCustom: r.is_custom ?? false,
          }));
          setVenues(list);
        } else {
          // İlk kurulum: statik mekan ve bölgeleri Supabase’e ekle
          await supabase.from('venues').insert(INITIAL_DATA.map(v => ({
            id: v.id,
            name: v.name,
            district: v.district,
            category: v.category,
            tags: v.tags,
            is_custom: v.isCustom ?? false,
          })));
          await supabase.from('districts').insert(INITIAL_DISTRICTS.map((name, i) => ({ name, sort_order: i })));
          setVenues(INITIAL_DATA);
          setDistricts(INITIAL_DISTRICTS);
        }
        if (dRes.data && dRes.data.length > 0) {
          setDistricts(dRes.data.map((r: { name: string }) => r.name));
        }
        if (mRes.data && mRes.data.length > 0) {
          const list = mRes.data.map((r: { id: string; venue_id: string; venue_name: string; date: string; note: string; image_url?: string | null }) => ({
            id: r.id,
            venueId: r.venue_id,
            venueName: r.venue_name,
            date: r.date,
            note: r.note,
            image: r.image_url ?? undefined,
          }));
          setMemories(list);
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
  useEffect(() => {
    saveToStorage('memories', memories);
  }, [memories]);

  const addVenue = useCallback(async (venue: Venue) => {
    setVenues(prev => [...prev, venue]);
    if (supabase) {
      try {
        await supabase.from('venues').insert({
          id: venue.id,
          name: venue.name,
          district: venue.district,
          category: venue.category,
          tags: venue.tags ?? [],
          is_custom: venue.isCustom ?? false,
        });
      } catch {
        setVenues(prev => prev.filter(v => v.id !== venue.id));
      }
    } else {
      saveToStorage('venues', [...venues, venue]);
    }
  }, [venues]);

  const removeVenue = useCallback(async (id: string) => {
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
  }, [venues]);

  const addDistrict = useCallback(async (name: string) => {
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
  }, [districts]);

  const removeDistrict = useCallback(async (name: string) => {
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
  }, [districts]);

  const addMemory = useCallback(async (memory: Memory) => {
    setMemories(prev => [memory, ...prev]);
    if (supabase) {
      try {
        await supabase.from('memories').insert({
          id: memory.id,
          venue_id: memory.venueId,
          venue_name: memory.venueName,
          date: memory.date,
          note: memory.note,
          image_url: memory.image || null,
        });
      } catch {
        setMemories(prev => prev.filter(m => m.id !== memory.id));
      }
    } else {
      saveToStorage('memories', [memory, ...memories]);
    }
  }, [memories]);

  const removeMemory = useCallback(async (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    if (supabase) {
      try {
        await supabase.from('memories').delete().eq('id', id);
      } catch {
        setMemories(prev => [...prev, ...memories.filter(m => m.id === id)]);
      }
    } else {
      saveToStorage('memories', memories.filter(m => m.id !== id));
    }
  }, [memories]);

  return (
    <DataContext.Provider value={{
      venues,
      districts,
      memories,
      loading,
      addVenue,
      removeVenue,
      addDistrict,
      removeDistrict,
      addMemory,
      removeMemory,
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
