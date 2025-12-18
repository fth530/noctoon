# Noctoon - Webtoon & Manga Platform

Bu proje Vercel'e deploy edilmek üzere hazırlanmış bir React + TypeScript webtoon/manga okuma platformudur.

## 🚀 Vercel'e Deploy

1. Vercel hesabınıza giriş yapın
2. Yeni bir proje oluşturun
3. Bu `client` klasörünü root directory olarak seçin
4. Build Settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy edin!

## 📋 Admin Girişi

- **Username:** `admin`
- **Password:** `admin123`

## 🛠️ Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Development server başlat
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 📁 Proje Yapısı

```
client/
├── api/              # Vercel Serverless Functions
│   ├── [...path].ts  # Ana API handler (tüm endpoint'ler)
│   └── data.ts       # Mock data storage
├── src/
│   ├── components/   # React bileşenleri
│   ├── pages/        # Sayfa bileşenleri
│   ├── lib/          # Utility fonksiyonları
│   └── shared/       # Paylaşılan type'lar
├── public/           # Statik dosyalar
└── dist/             # Build çıktısı (gitignore'da)
```

## 📝 API Endpoints

Tüm API endpoint'leri `api/[...path].ts` dosyasında tek bir serverless function olarak handle ediliyor:

- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `GET /api/series` - Tüm seriler
- `GET /api/series/:id` - Seri detayı
- `GET /api/series/:id/chapters` - Bölümler
- `GET /api/series/:id/comments` - Yorumlar
- `POST /api/series/:id/comments` - Yorum ekle
- `POST /api/series/:id/like` - Beğeni
- `POST /api/series/:id/favorite` - Favorileme
- `GET /api/user/likes` - Kullanıcı beğenileri
- `GET /api/user/favorites` - Kullanıcı favorileri
- `GET /api/admin/stats` - Admin istatistikleri
- `GET /api/admin/recent-comments` - Son yorumlar

## ⚠️ Notlar

- Data şu anda in-memory storage kullanıyor (global variable ile kalıcı)
- Production için Vercel Postgres veya başka bir veritabanı kullanılması önerilir
- Vercel Hobby planında maksimum 12 serverless function limiti var, bu yüzden tüm API'ler tek bir handler'da birleştirildi

