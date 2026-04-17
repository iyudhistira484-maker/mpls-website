# Deployment Guide - MPLS SMAN 5 TUBAN

Panduan lengkap untuk deployment website MPLS ke production.

## 📋 Pre-deployment Checklist

Sebelum deploy, pastikan:

- ✅ Firebase project sudah dibuat dan dikonfigurasi
- ✅ Firestore database sudah setup dengan collections
- ✅ Firebase Authentication sudah enabled
- ✅ Cloud Storage sudah setup
- ✅ Security Rules sudah diterapkan
- ✅ Admin account sudah dibuat
- ✅ Environment variables sudah dikonfigurasi
- ✅ Testing sudah dilakukan
- ✅ Performance sudah dioptimasi
- ✅ SSL/HTTPS sudah enabled

## 🚀 Option 1: Firebase Hosting

Firebase Hosting adalah pilihan terbaik untuk website statis dengan Firebase backend.

### Setup

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login ke Firebase**
```bash
firebase login
```

3. **Initialize Firebase Project**
```bash
firebase init hosting
```

Jawab pertanyaan:
- Select Firebase project: pilih project Anda
- What do you want to use as your public directory? `./` atau `.`
- Configure as a single-page app? `No`
- Set up automatic builds? `No`

4. **Deploy**
```bash
firebase deploy
```

Setelah deploy, website akan tersedia di:
`https://your-project-id.web.app`

### Update Domain

Untuk menggunakan custom domain:

1. Di Firebase Console, buka "Hosting"
2. Klik "Add custom domain"
3. Masukkan domain Anda
4. Follow instructions untuk setup DNS

## 🌐 Option 2: Netlify

Netlify adalah platform hosting yang mudah digunakan dengan CI/CD terintegrasi.

### Setup

1. **Push ke GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/mpls-website.git
git push -u origin main
```

2. **Connect ke Netlify**
- Buka [Netlify](https://netlify.com)
- Klik "New site from Git"
- Pilih GitHub
- Authorize Netlify
- Pilih repository
- Klik "Deploy site"

3. **Configure Build Settings**
- Build command: (kosongkan)
- Publish directory: `./`

4. **Deploy**
Netlify akan otomatis deploy setiap kali Anda push ke GitHub.

### Custom Domain

1. Di Netlify, buka "Domain settings"
2. Klik "Add custom domain"
3. Masukkan domain Anda
4. Follow instructions untuk setup DNS

## 📦 Option 3: Vercel

Vercel adalah platform hosting modern dengan performance terbaik.

### Setup

1. **Push ke GitHub** (seperti Netlify)

2. **Connect ke Vercel**
- Buka [Vercel](https://vercel.com)
- Klik "New Project"
- Pilih GitHub repository
- Klik "Import"

3. **Configure Project**
- Framework: Other
- Root Directory: `./`
- Build Command: (kosongkan)
- Output Directory: `./`

4. **Deploy**
Vercel akan otomatis deploy.

## 🔧 Production Optimization

### 1. Minify Assets

Minify CSS dan JavaScript untuk mengurangi ukuran file:

```bash
# Menggunakan online tools atau build tools
# Atau gunakan Firebase hosting yang otomatis minify
```

### 2. Optimize Images

Compress semua gambar:

```bash
# Gunakan ImageOptim, TinyPNG, atau tools lainnya
```

### 3. Enable Caching

Tambahkan cache headers di `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.{js,css,png,jpg,jpeg,gif,svg,ico}",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 4. Enable Compression

Firebase Hosting otomatis menggunakan gzip compression.

### 5. CDN

Firebase Hosting menggunakan Google Cloud CDN untuk distribusi global.

## 🔐 Security Hardening

### 1. Update Security Rules

Pastikan Firestore dan Storage rules sudah production-ready:

```javascript
// Jangan gunakan test mode di production
// Terapkan strict security rules
```

### 2. Enable HTTPS

Semua hosting platform mendukung HTTPS otomatis.

### 3. Set Security Headers

Tambahkan security headers di `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  }
}
```

### 4. Enable CORS

Jika API dari domain berbeda:

```javascript
// Di firebase.js atau backend
// Configure CORS properly
```

## 📊 Monitoring & Analytics

### 1. Firebase Console

Monitor di Firebase Console:
- Authentication metrics
- Firestore usage
- Storage usage
- Hosting analytics

### 2. Google Analytics

Setup Google Analytics:

```html
<!-- Tambahkan di <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### 3. Error Tracking

Setup error tracking dengan Sentry atau Firebase Crashlytics.

## 🔄 Continuous Deployment

### GitHub Actions

Setup CI/CD dengan GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## 📱 Mobile App Deployment

Untuk membuat mobile app dari website:

### Option 1: Progressive Web App (PWA)

Tambahkan `manifest.json`:

```json
{
  "name": "MPLS SMAN 5 TUBAN",
  "short_name": "MPLS",
  "description": "Masa Pengenalan Lingkungan Sekolah",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### Option 2: Capacitor

Convert ke native app:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
```

## 🚨 Troubleshooting

### Deploy Error: Permission Denied

```bash
# Solution: Login ulang
firebase logout
firebase login
```

### Deploy Error: Project Not Found

```bash
# Solution: Set project ID
firebase use --add
```

### Website Blank After Deploy

```bash
# Solution: Clear cache
# Di browser: Ctrl+Shift+Delete (Chrome)
# Atau hard refresh: Ctrl+Shift+R
```

### Slow Performance

- Check Firebase usage
- Optimize images
- Enable caching
- Use CDN
- Minify assets

## 📞 Support & Maintenance

### Regular Maintenance

- Monitor Firebase usage
- Update dependencies
- Check security rules
- Review error logs
- Backup data

### User Support

- Setup support email
- Create FAQ page
- Document features
- Provide tutorials

## 🎯 Post-deployment

Setelah deploy:

1. ✅ Test semua fitur di production
2. ✅ Verify Firebase configuration
3. ✅ Check security rules
4. ✅ Monitor performance
5. ✅ Setup analytics
6. ✅ Create user documentation
7. ✅ Train admin users
8. ✅ Setup backup strategy
9. ✅ Create runbook untuk incidents
10. ✅ Plan maintenance schedule

## 📚 Resources

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [Web Performance Guide](https://web.dev/performance)
- [Security Best Practices](https://owasp.org)

---

**Last Updated**: 2024
**Version**: 1.0.0
