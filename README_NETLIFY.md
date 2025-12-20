# Netlify Deployment Guide

Bu proje Netlify'a deploy edilmek için hazırlanmıştır.

## Gereksinimler

- Node.js 20+
- npm veya yarn

## Deployment Adımları

1. **Netlify hesabınıza giriş yapın** ve yeni bir site oluşturun

2. **GitHub/GitLab/Bitbucket repository'nizi bağlayın**

3. **Build ayarları:**
   - Build command: `cd Site-Builder && npm install && npm run build`
   - Publish directory: `Site-Builder/dist/public`
   - Functions directory: `netlify/functions`

4. **Environment Variables (gerekirse):**
   - `NODE_ENV=production`
   - `DATABASE_URL` (eğer PostgreSQL kullanıyorsanız)

5. **Deploy butonuna tıklayın**

## Yerel Test

Netlify CLI ile yerel test yapabilirsiniz:

```bash
npm install -g netlify-cli
netlify dev
```

## Notlar

- Backend API routes `/api/*` path'i üzerinden çalışır
- Frontend static dosyalar `Site-Builder/dist/public` klasöründe build edilir
- Netlify Functions `netlify/functions` klasöründe bulunur
- Memory storage kullanılıyor (veritabanı gerekmez)

## Sorun Giderme

- Build hatası alırsanız, `Site-Builder` klasöründe `npm install` çalıştırın
- API çalışmıyorsa, Netlify Functions loglarını kontrol edin
- CORS hatası alırsanız, `netlify/functions/server.ts` dosyasındaki CORS ayarlarını kontrol edin


