━━━ SPINOUT — DESIGN LANGUAGE ━━━

Kütüphane: lucide-react (tüm ikonlar buradan)
İkon boyutları: size={18} (navbar), size={20} (liste/kart), size={24} (başlık/modal)
Stroke genişliği: strokeWidth={1.6} — tüm ikonlarda sabit

── KATEGORİ İKONLARI ──────────────────────────────

yemek   →    renk: #E84820   bg: rgba(232,72,32,0.14)
kafe    →             renk: #B5713A   bg: rgba(107,58,31,0.25)
tatlı   →       renk: #5BAFD6   bg: rgba(91,175,214,0.12)
bar     →               renk: #4CA86A   bg: rgba(42,107,60,0.20)

Her kategorinin rozeti:
  padding: 3px 8px, border-radius: 5px, font-size: 10px, font-weight: 700
  letter-spacing: 0.05em, text-transform: uppercase
  border: 0.5px solid [kategori rengi, %40 opaklık]

── GENEL UI İKONLARI ────────────────────────────────

MapPin       → mekan pin / Google Maps yönlendirme    #A8A095
Star         → yıldız puanı (dolu: #F5A020)           #A8A095
Clock        → geçmiş / son seçim                     #6B6560
Search       → arama kutusu                           #6B6560
Navigation   → harita / semt                          #6B6560
Zap          → sürpriz modu butonu                    #9A5C28
Settings2    → admin paneli girişi                    #6B6560
Crown        → Shelby profil ikonu                    #9A5C28
User         → Misafir profil ikonu                   #6B6560
Plus         → mekan / semt ekleme                    #F5F0E8
Pencil       → düzenleme (sadece admin)               #9A5C28
Trash2       → silme (sadece admin, destructive red)  #C83010
X            → modal/sheet kapatma                    #A8A095
ChevronRight → liste öğesi navigasyon oku             #6B6560
GripVertical → sürükle-bırak tutacağı                 #6B6560

── RENK PALETİ ──────────────────────────────────────

Arka planlar:
  --bg-base:     #1a1a1a   ana arka plan
  --bg-surface:  #242424   kart, modal
  --bg-elevated: #2e2e2e   hover, input, aktif yüzey
  --bg-overlay:  #111111   header, tab bar

Aksan:
  --accent:      #9A5C28   birincil CTA, aktif tab, admin vurgu
  --accent-dark: #7A4418   hover / pressed

Metin:
  --text-primary:   #F5F0E8
  --text-secondary: #A8A095
  --text-muted:     #6B6560

Kenarlık:
  --border:       rgba(245,240,232,0.08)
  --border-strong:rgba(245,240,232,0.16)

Kategori renkleri:
  yemek  → #E84820  (turuncu-kırmızı)   arka plan bg: #280800
  kafe   → #B5713A  (kahve çekirdeği)   arka plan bg: #1a0c04
  tatlı  → #5BAFD6  (bebek mavisi)      arka plan bg: #0a1e2a
  bar    → #4CA86A  (dublin yeşili)     arka plan bg: #0a1a0e

── TİPOGRAFİ ─────────────────────────────────────────

Font: "DM Sans" — import from Google Fonts
Weights: 400 (body), 500 (label/nav), 600 (başlık/CTA)

Uygulama adı "Spinout": 600, letter-spacing: -0.02em
Sekme etiketi: 500, 11px, uppercase, letter-spacing: 0.04em
Mekan adı (kart): 600, 15px, letter-spacing: -0.01em
Rozet: 700, 10px, uppercase, letter-spacing: 0.05em
Body/açıklama: 400, 14px, line-height: 1.6

── KÖŞE & FORM DİLİ ──────────────────────────────────

--radius-sm:   5px   rozet, chip
--radius-md:   10px  buton, input, küçük kart
--radius-lg:   14px  modal, mekan kartı, bottom sheet
--radius-xl:   20px  profil seçim kartları
--radius-full: 9999px avatar, pill buton

── MEKAN KARTI ───────────────────────────────────────

min-height: 160px (liste), 200px (detay)
Fotoğraf arka plan + gradient overlay:
  linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)
Sol üst: kategori rozeti
Sağ üst: MapPin ikonu → Google Maps linki (yeni sekme)
Sol alt: mekan adı (600, 15px) + semt (400, 12px, --text-secondary)
Sağ alt: ★ yıldız puanı + ₺ fiyat göstergesi (12px, --text-secondary)

── ANİMASYON ─────────────────────────────────────────

Kütüphane: framer-motion
Bottom sheet: y: "100%" → 0, duration: 0.35, ease: [0.32, 0.72, 0, 1]
Modal: scale: 0.96 + opacity 0→1, duration: 0.2
Kazanan kart: scale: 0.8 → 1.05 → 1, spring stiffness: 300
Çark dönüşü: cubic-bezier(0.17, 0.67, 0.12, 0.99), min 3s
Kart hover (masaüstü): scale: 1.02, duration: 0.15

── BUTONLAR ──────────────────────────────────────────

Primary:  bg #9A5C28 | text #F5F0E8 | hover bg #7A4418
Ghost:    bg transparent | border --border-strong | text --text-primary
Danger:   bg transparent | text #C83010 | border rgba(200,48,16,0.3)
Disabled: opacity 0.35, pointer-events: none

── TAB BAR ───────────────────────────────────────────

bg: --bg-overlay, border-top: --border
Aktif: ikon + etiket --accent rengiyle
Pasif: ikon + etiket --text-muted
Touch target: min 48x48px

── LOGO / ÇAR ────────────────────────────────────────

SVG çark: 4 eşit segment, kategori renkleriyle
  yemek=#E84820, kafe=#6B3A1F, tatlı=#3A8CAE, bar=#2A6B3C
Merkez daire: --bg-elevated
Üst gösterge (pointer): üçgen, --accent rengi
Boyut: 32px (navbar), 56px (profil/splash ekranı)
