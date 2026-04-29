-- Karar Çarkı v2 migration (manuel çalıştırılacak)
-- Supabase Dashboard > SQL Editor'da Run edin.

-- 1) venues: kategori genişletme + Places kolonları
ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS place_id TEXT,
  ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS price_level INT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- district artık admin panelde boş kalabilir
ALTER TABLE public.venues
  ALTER COLUMN district DROP NOT NULL;

-- Eski CHECK constraint'i (adı bilinmiyor) güvenle kaldırıp yenisini eklemek için:
DO $$
DECLARE
  c_name TEXT;
BEGIN
  SELECT conname INTO c_name
  FROM pg_constraint
  WHERE conrelid = 'public.venues'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%category%';

  IF c_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.venues DROP CONSTRAINT %I', c_name);
  END IF;
END $$;

ALTER TABLE public.venues
  ADD CONSTRAINT venues_category_check
  CHECK (category IN ('yemek', 'tatlı', 'kafe', 'bar'));

-- Legacy kategori migration: tatlı-kahve -> kafe (varsayılan)
UPDATE public.venues
SET category = 'kafe'
WHERE category = 'tatlı-kahve';

