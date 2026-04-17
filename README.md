# MPLS SMAN 5 TUBAN - Website Platform

Website modern dan interaktif untuk Masa Pengenalan Lingkungan Sekolah (MPLS) SMAN 5 TUBAN dengan fitur lengkap, animasi, dan desain startup-quality.

## 🎯 Fitur Utama

### Landing Page
- Hero section dengan animasi parallax
- Deskripsi MPLS dan fitur-fitur
- Galeri kegiatan preview
- Call-to-action buttons
- Responsive design

### Sistem Autentikasi
- **Register**: Pendaftaran dengan validasi email dan password
- **Login**: Login dengan role-based redirect
- **OTP Verification**: Verifikasi email dengan OTP 6 digit (5 menit expiry)
- **Remember Me**: Opsi untuk mengingat email login

### Dashboard Siswa
Menu dan fitur:
- **Dashboard**: Overview progress MPLS dengan statistik
- **Jadwal**: Lihat jadwal kegiatan MPLS
- **Materi**: Akses materi pembelajaran
- **Tugas**: Lihat dan kerjakan tugas
- **Absensi**: Absensi digital harian
- **Quiz**: Kerjakan quiz dan lihat scoring
- **Leaderboard**: Ranking siswa berdasarkan poin
- **Pengumuman**: Pengumuman penting dari admin
- **Galeri**: Lihat foto-foto kegiatan MPLS
- **Profil**: Edit data profil pribadi

### Dashboard Admin
Menu dan fitur:
- **Dashboard**: Statistik dan overview
- **Kelola User**: CRUD user siswa
- **Jadwal**: Kelola jadwal kegiatan
- **Materi**: Kelola materi pembelajaran
- **Tugas**: Kelola tugas siswa
- **Pengumuman**: Kelola pengumuman
- **Galeri Kegiatan**: Upload dan kelola foto galeri

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Cloud Storage
- **UI/UX**: 
  - Glassmorphism design
  - Dark mode support
  - Full animations
  - Responsive design

## 📁 Struktur File

```
mpls-website/
├── index.html                 # Landing Page
├── login.html                 # Login Page
├── register.html              # Register Page
├── verify.html                # OTP Verification Page
├── dashboard-siswa.html       # Student Dashboard
├── dashboard-admin.html       # Admin Dashboard
├── css/
│   └── style.css             # Main stylesheet
├── js/
│   ├── app.js                # Utility functions
│   └── firebase.js           # Firebase configuration
├── assets/
│   ├── images/               # Image assets
│   └── icons/                # Icon assets
└── README.md                 # Documentation
```

## 🚀 Instalasi & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd mpls-website
```

### 2. Konfigurasi Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Dapatkan Firebase config
3. Update `js/firebase.js` dengan kredensial Anda:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Setup Firestore Database

Buat collections berikut di Firestore:

```
- users (untuk data user)
- otp_codes (untuk OTP verification)
- schedules (untuk jadwal kegiatan)
- materials (untuk materi pembelajaran)
- submissions (untuk tugas siswa)
- attendance (untuk absensi)
- quiz (untuk quiz)
- announcements (untuk pengumuman)
- gallery (untuk galeri kegiatan)
```

### 4. Setup Firebase Security Rules

Terapkan security rules untuk Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // OTP codes collection
    match /otp_codes/{email} {
      allow read, write: if true; // For development only
    }

    // Public collections (read-only for students)
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5. Setup Storage Rules

Terapkan security rules untuk Cloud Storage:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /submissions/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Jalankan Server

Gunakan live server atau simple HTTP server:

```bash
# Menggunakan Python
python -m http.server 8000

# Atau gunakan Live Server extension di VS Code
```

Akses di `http://localhost:8000`

## 👤 Demo Akun

Untuk testing, gunakan akun demo:
- **Email**: demo@example.com
- **Password**: demo123

## 🎨 Customization

### Mengubah Warna Tema

Edit variabel CSS di `css/style.css`:

```css
:root {
    --primary: #6366f1;
    --secondary: #a855f7;
    --accent: #ec4899;
    /* ... */
}
```

### Mengubah Font

Update font family di `css/style.css`:

```css
body {
    font-family: 'Your Font Name', sans-serif;
}
```

## 📱 Responsive Design

Website fully responsive untuk:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔐 Security Features

- Firebase Authentication
- OTP Email Verification
- Firestore Security Rules
- Role-based Access Control
- XSS Protection
- Rate limiting untuk login & OTP

## 🎯 Fitur Animasi

- Fade-in animations
- Slide animations
- Parallax scrolling
- Hover effects
- Loading animations
- Toast notifications
- Modal transitions

## 📊 Database Schema

### Users Collection
```javascript
{
  email: string,
  username: string,
  role: 'siswa' | 'admin',
  isVerified: boolean,
  createdAt: timestamp,
  avatar: string,
  phone: string,
  class: string,
  studentId: string,
  points: number
}
```

### Gallery Collection
```javascript
{
  title: string,
  description: string,
  imageUrl: string,
  createdAt: timestamp,
  uploadedBy: string
}
```

## 🐛 Troubleshooting

### Firebase Connection Error
- Pastikan Firebase config sudah benar
- Check internet connection
- Verify Firebase project settings

### OTP Tidak Terkirim
- OTP ditampilkan di console untuk testing
- Untuk production, integrasikan dengan email service (SendGrid, etc)

### Storage Upload Error
- Check Firebase Storage rules
- Verify file size limits
- Check storage quota

## 📝 Lisensi

Proyek ini dibuat untuk SMAN 5 TUBAN.

## 👨‍💻 Developer

Dikembangkan dengan ❤️ menggunakan Firebase dan Vanilla JavaScript.

## 📞 Support

Untuk bantuan dan pertanyaan, silakan hubungi admin MPLS SMAN 5 TUBAN.

---

**Versi**: 1.0.0  
**Last Updated**: 2024
