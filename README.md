# Noctoon - Webtoon Okuma Platformu

Modern, koyu temalı webtoon/manga okuma platformu.

## 🌟 Özellikler

- 📚 **Seri Kütüphanesi** - Serileri türe, duruma göre filtrele
- 📖 **Okuyucu** - Sayfa sayfa okuma deneyimi
- 🔖 **Yer İmleri** - Favorilerini kaydet (localStorage)
- 🔒 **Admin Paneli** - Seri/bölüm ekleme ve yönetme
- 🌙 **Koyu Tema** - Göz dostu tasarım

## 🚀 Demo

[Live Demo](https://noctoon-psi.vercel.app)

## 🛠️ Teknolojiler

- **Frontend:** React, TypeScript, Tailwind CSS, Wouter
- **Backend:** Vercel Serverless Functions
- **Database:** Neon PostgreSQL (opsiyonel)
- **Deployment:** Vercel

## 📦 Kurulum

```bash
# Repo'yu klonla
git clone https://github.com/fth530/noctoon.git
cd noctoon

# Client bağımlılıkları
cd client
npm install
npm run dev
```

## 🔐 Admin Girişi

- **Kullanıcı:** admin
- **Şifre:** admin123

## 📁 Proje Yapısı

```
├── api/                 # Vercel serverless API
├── client/             
│   ├── src/
│   │   ├── components/  # UI bileşenleri
│   │   ├── pages/       # Sayfalar
│   │   └── lib/         # Yardımcı fonksiyonlar
├── server/              # Express server (local dev)
└── shared/              # Paylaşılan şemalar
```

## 📝 Lisans

MIT
