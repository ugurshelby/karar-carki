# Karar Çarkı – Manuel Kurulum ve Deploy Adımları

Bu dosya, projeyi Vercel’da yayına almak ve Supabase ile veri saklamayı açmak için **sadece sizin yapmanız gereken** işlemleri tek yerde toplar.

---

## 1. Supabase projesi oluşturma

1. [supabase.com](https://supabase.com) → **Start your project** → Giriş yapın.
2. **New project** ile yeni proje oluşturun:
   - **Name:** Örn. `karar-carki`
   - **Database password:** Güçlü bir şifre belirleyin (kaydedin).
   - **Region:** Size yakın bölge (örn. Frankfurt).
3. Proje hazır olana kadar bekleyin.

---

## 2. Supabase tablolarını oluşturma

1. Sol menüden **SQL Editor**’ı açın.
2. **New query** ile yeni sorgu açın.
3. Projedeki **`supabase/schema.sql`** dosyasının **tüm içeriğini** kopyalayıp SQL Editor’a yapıştırın.
4. **Run** (veya Ctrl+Enter) ile çalıştırın.
5. “Success” benzeri bir mesaj görmelisiniz.

---

## 3. Storage bucket ve politikaları

1. Sol menüden **Storage**’a gidin.
2. **New bucket**:
   - **Name:** `memories` (tam bu isim olmalı).
   - **Public bucket:** Açık (✓). (Anı fotoğrafları herkese açık URL ile saklanacak.)
3. **Create bucket** ile oluşturun.
4. `memories` bucket’ına tıklayın → **Policies** sekmesi.
5. **New policy** ile iki policy ekleyin:

   **Policy 1 – Okuma (SELECT):**
   - **Policy name:** `Public read`
   - **Allowed operation:** SELECT (Read)
   - **Target roles:** `anon`
   - **Policy definition:** `true` (WITH CHECK boş bırakılabilir veya true)

   **Policy 2 – Yükleme (INSERT):**
   - **Policy name:** `Public upload`
   - **Allowed operation:** INSERT (Create)
   - **Target roles:** `anon`
   - **Policy definition:** `true`

   (Supabase arayüzü “Policy definition” için genelde “Using expression” alanına `true` yazmanızı ister.)

6. Kaydedin.

---

## 4. Supabase URL ve Anon Key’i alma

1. Sol menüden **Project Settings** (dişli) → **API**.
2. Şunları kopyalayın:
   - **Project URL** → `.env` ve Vercel’da `VITE_SUPABASE_URL` olacak.
   - **anon public** key → `.env` ve Vercel’da `VITE_SUPABASE_ANON_KEY` olacak.

---

## 5. Ortam değişkenleri (yerel geliştirme)

1. Proje kökünde `.env` dosyası oluşturun (`.env.example`’ı kopyalayıp adını `.env` yapabilirsiniz).
2. İçine yazın:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
```

3. `xxxxxxxxxxxx` ve key’i kendi Supabase projenizden alın. `.env` dosyasını **asla** Git’e eklemeyin (zaten `.gitignore`’da olmalı).

---

## 6. Vercel’da deploy

1. [vercel.com](https://vercel.com) → Giriş yapın.
2. **Add New** → **Project**.
3. Bu projeyi GitHub/GitLab/Bitbucket’a bağlayıp repoyu seçin; veya **Import** ile ZIP / “Upload” ile yükleyin.
4. **Framework Preset:** Vite algılanmalı (algılanmazsa **Vite** seçin).
5. **Root Directory:** Boş bırakın (proje kökü).
6. **Environment Variables** bölümüne ekleyin:

   - **Name:** `VITE_SUPABASE_URL`  
     **Value:** Supabase Project URL (adım 4).
   - **Name:** `VITE_SUPABASE_ANON_KEY`  
     **Value:** Supabase anon public key (adım 4).

7. **Deploy**’a tıklayın.
8. Build bittikten sonra **Visit** ile siteyi açın. Tüm sayfalar (Mekanlar, Çark, Anılar) çalışıyor olmalı; anı eklerken fotoğraf seçtiğinizde Supabase Storage’a yüklenecek.

---

## 7. (İsteğe bağlı) İlk açılışta statik mekanlar

Supabase’te `venues` ve `districts` tabloları boşsa, uygulama **ilk yüklemede** otomatik olarak `data.ts` içindeki statik mekan ve bölge listesini Supabase’e yazar. Ek bir seed script çalıştırmanız gerekmez.

İsterseniz kendi başlangıç verinizi Supabase **SQL Editor**’da manuel ekleyebilirsiniz; uygulama bir kez veri gördüğünde otomatik seed’i tekrar çalıştırmaz.

---

## Özet kontrol listesi

- [ ] Supabase projesi oluşturuldu.
- [ ] `supabase/schema.sql` SQL Editor’da çalıştırıldı.
- [ ] Storage’da `memories` bucket’ı oluşturuldu ve public read + anon upload policy’leri eklendi.
- [ ] `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` alındı.
- [ ] Yerel `.env` dosyasına bu değişkenler yazıldı (yerel test için).
- [ ] Vercel projesi oluşturuldu ve aynı iki env değişkeni Vercel’a eklendi.
- [ ] Deploy tamamlandı, site açıldı ve Mekanlar / Çark / Anılar sayfaları test edildi.

Bu adımlar tamamsa site hem mobil hem masaüstünde kullanıma hazırdır; statik veriler ve anılar (görsel + metin) Supabase’te saklanır.
