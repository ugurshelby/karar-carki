-- Karar Çarkı - Supabase şema (manuel çalıştırılacak)
-- Supabase Dashboard > SQL Editor'da bu dosyanın içeriğini yapıştırıp Run edin.

-- Mekanlar tablosu (statik + kullanıcı eklediği mekanlar)
CREATE TABLE IF NOT EXISTS public.venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT,
  category TEXT NOT NULL CHECK (category IN ('yemek', 'tatlı', 'kafe', 'bar')),
  tags TEXT[] DEFAULT '{}',
  is_custom BOOLEAN DEFAULT FALSE,
  place_id TEXT,
  rating DOUBLE PRECISION,
  price_level INT,
  photo_url TEXT,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bölgeler (semtler) - sıralı liste
CREATE TABLE IF NOT EXISTS public.districts (
  name TEXT PRIMARY KEY,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- v2 ile "Anılar" uygulamadan kaldırıldı; bu tablo artık kullanılmıyor.

-- RLS: Anonim kullanıcı okuyabilsin ve yazabilsin (auth kullanmıyoruz)
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "venues_all" ON public.venues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "districts_all" ON public.districts FOR ALL USING (true) WITH CHECK (true);

-- v2 ile Storage bucket kullanılmıyor (Places fotoğrafları URL olarak tutuluyor).

COMMENT ON TABLE public.venues IS 'Mekan listesi (statik + kullanıcı eklemeleri)';
COMMENT ON TABLE public.districts IS 'Bölge/semt listesi';
