-- Karar Çarkı - Supabase şema (manuel çalıştırılacak)
-- Supabase Dashboard > SQL Editor'da bu dosyanın içeriğini yapıştırıp Run edin.

-- Mekanlar tablosu (statik + kullanıcı eklediği mekanlar)
CREATE TABLE IF NOT EXISTS public.venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('yemek', 'tatlı-kahve')),
  tags TEXT[] DEFAULT '{}',
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bölgeler (semtler) - sıralı liste
CREATE TABLE IF NOT EXISTS public.districts (
  name TEXT PRIMARY KEY,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anılar (tarih, not, görsel URL)
CREATE TABLE IF NOT EXISTS public.memories (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  date DATE NOT NULL,
  note TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Anonim kullanıcı okuyabilsin ve yazabilsin (auth kullanmıyoruz)
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "venues_all" ON public.venues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "districts_all" ON public.districts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "memories_all" ON public.memories FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket "memories" için: Dashboard > Storage > New bucket > "memories", Public.
-- Aşağıdaki policy'yi Storage > memories > Policies kısmından ekleyin veya SQL ile:
-- INSERT policy: allow public upload (anon)
-- SELECT policy: allow public read
-- Supabase Dashboard'da Storage > memories bucket > Policies > "Allow public read and upload for anon"

COMMENT ON TABLE public.venues IS 'Mekan listesi (statik + kullanıcı eklemeleri)';
COMMENT ON TABLE public.districts IS 'Bölge/semt listesi';
COMMENT ON TABLE public.memories IS 'Anılar sayfasındaki kayıtlar (görsel URL Supabase Storage’da)';
