# Setup Guide - MPLS SMAN 5 TUBAN Website

Panduan lengkap untuk setup dan deployment website MPLS.

## 📋 Prerequisites

- Browser modern (Chrome, Firefox, Safari, Edge)
- Akun Google untuk Firebase
- Text editor (VS Code recommended)
- Git (optional)

## 🔥 Step 1: Setup Firebase Project

### 1.1 Buat Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Klik "Create Project"
3. Masukkan nama project: `MPLS-SMAN5-TUBAN`
4. Pilih region: `asia-southeast1` (Indonesia)
5. Klik "Create Project"

### 1.2 Enable Authentication

1. Di sidebar, pilih "Authentication"
2. Klik "Get started"
3. Di "Sign-in method", enable:
   - Email/Password
4. Klik "Save"

### 1.3 Create Firestore Database

1. Di sidebar, pilih "Firestore Database"
2. Klik "Create database"
3. Pilih region: `asia-southeast1`
4. Pilih mode: "Start in test mode" (untuk development)
5. Klik "Create"

### 1.4 Setup Cloud Storage

1. Di sidebar, pilih "Storage"
2. Klik "Get started"
3. Pilih region: `asia-southeast1`
4. Klik "Done"

### 1.5 Dapatkan Firebase Config

1. Klik ⚙️ (Settings) di sidebar
2. Pilih "Project settings"
3. Scroll ke bawah, cari "Your apps"
4. Klik icon `</>`
5. Copy Firebase config
6. Paste di `js/firebase.js`

## 📊 Step 2: Setup Firestore Collections

Buat collections berikut dengan struktur data:

### 2.1 Users Collection

```
Collection: users
Documents: auto-generated

Fields:
- email (string)
- username (string)
- role (string) - 'siswa' atau 'admin'
- isVerified (boolean)
- createdAt (timestamp)
- avatar (string) - optional
- phone (string) - optional
- class (string) - optional
- studentId (string) - optional
- points (number) - default: 0
```

### 2.2 OTP Codes Collection

```
Collection: otp_codes
Documents: email address

Fields:
- code (string) - 6 digit OTP
- email (string)
- createdAt (timestamp)
- expiresAt (timestamp)
- attempts (number)
```

### 2.3 Schedules Collection

```
Collection: schedules
Documents: auto-generated

Fields:
- title (string)
- description (string)
- date (timestamp)
- time (string) - format: "HH:mm"
- location (string)
- createdAt (timestamp)
```

### 2.4 Materials Collection

```
Collection: materials
Documents: auto-generated

Fields:
- title (string)
- description (string)
- content (string)
- fileUrl (string) - optional
- createdAt (timestamp)
- createdBy (string) - user ID
```

### 2.5 Submissions Collection

```
Collection: submissions
Documents: auto-generated

Fields:
- title (string)
- description (string)
- deadline (timestamp)
- studentId (string)
- status (string) - 'pending', 'submitted', 'graded'
- fileUrl (string)
- grade (number)
- feedback (string)
- createdAt (timestamp)
```

### 2.6 Attendance Collection

```
Collection: attendance
Documents: auto-generated

Fields:
- studentId (string)
- studentName (string)
- date (timestamp)
- time (string)
- createdAt (timestamp)
```

### 2.7 Announcements Collection

```
Collection: announcements
Documents: auto-generated

Fields:
- title (string)
- content (string)
- createdBy (string) - user ID
- createdAt (timestamp)
- updatedAt (timestamp)
```

### 2.8 Quiz Collection

```
Collection: quiz
Documents: auto-generated

Fields:
- title (string)
- description (string)
- questions (array)
- timeLimit (number) - in seconds
- createdBy (string) - user ID
- createdAt (timestamp)
```

### 2.9 Gallery Collection

```
Collection: gallery
Documents: auto-generated

Fields:
- title (string)
- description (string)
- imageUrl (string)
- uploadedBy (string) - user ID
- createdAt (timestamp)
```

## 🔐 Step 3: Setup Security Rules

### 3.1 Firestore Security Rules

Di Firestore Console, buka tab "Rules" dan paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow read for authenticated users
    match /{document=**} {
      allow read: if request.auth != null;
    }

    // Users collection - read own data or admin
    match /users/{userId} {
      allow read: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
    }

    // OTP codes - public for verification
    match /otp_codes/{email} {
      allow read, write: if true;
    }

    // Admin only write access
    match /schedules/{document=**} {
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /materials/{document=**} {
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /announcements/{document=**} {
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /gallery/{document=**} {
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Students can write their own submissions
    match /submissions/{document=**} {
      allow write: if request.auth != null;
    }

    // Students can write attendance
    match /attendance/{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

Klik "Publish"

### 3.2 Storage Security Rules

Di Storage Console, buka tab "Rules" dan paste:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Gallery - admin write, all authenticated read
    match /gallery/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Submissions - students can upload
    match /submissions/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // Default deny
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

Klik "Publish"

## 👤 Step 4: Create Admin Account

### 4.1 Buat Admin User Manual

1. Buka `register.html` dan register akun baru
2. Verifikasi email dengan OTP
3. Login dengan akun tersebut
4. Di Firestore, buka collection `users`
5. Cari dokumen user Anda
6. Edit field `role` dari `siswa` menjadi `admin`
7. Logout dan login kembali

### 4.2 Atau Gunakan Firebase Console

1. Di Firebase Console, buka "Authentication"
2. Klik "Add user"
3. Masukkan email dan password
4. Di Firestore, buat dokumen baru di collection `users`
5. Set field `role` ke `admin`

## 🚀 Step 5: Deploy Website

### Option 1: Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login ke Firebase:
```bash
firebase login
```

3. Initialize Firebase project:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

### Option 2: Netlify

1. Push code ke GitHub
2. Buka [Netlify](https://netlify.com)
3. Connect GitHub repository
4. Deploy

### Option 3: Vercel

1. Push code ke GitHub
2. Buka [Vercel](https://vercel.com)
3. Import project
4. Deploy

## ✅ Step 6: Testing

### Test Register Flow
1. Buka `index.html`
2. Klik "Daftar Sekarang"
3. Isi form dengan data valid
4. Verifikasi OTP (lihat console untuk OTP)
5. Login dengan akun baru

### Test Admin Features
1. Login dengan akun admin
2. Akses `dashboard-admin.html`
3. Test upload foto di Galeri
4. Check Firestore untuk data baru

### Test Student Features
1. Login dengan akun siswa
2. Akses `dashboard-siswa.html`
3. Test semua menu
4. Check data di Firestore

## 🔧 Troubleshooting

### Firebase Config Error
**Problem**: "Firebase is not defined"
**Solution**: 
- Pastikan Firebase CDN script sudah di-load
- Check order script di HTML

### OTP Tidak Terkirim
**Problem**: "OTP tidak diterima di email"
**Solution**:
- OTP ditampilkan di browser console untuk testing
- Untuk production, setup email service (SendGrid, Mailgun, etc)

### Storage Upload Error
**Problem**: "Permission denied" saat upload
**Solution**:
- Check Storage Security Rules
- Pastikan user adalah admin
- Verify file size

### Database Connection Error
**Problem**: "Cannot read property 'collection' of undefined"
**Solution**:
- Pastikan Firebase config benar
- Check internet connection
- Verify Firestore database sudah aktif

## 📱 Mobile Testing

Untuk test di mobile:

1. Jalankan local server
2. Dapatkan IP address komputer:
```bash
ipconfig getifaddr en0  # Mac
hostname -I            # Linux
ipconfig               # Windows
```

3. Akses dari mobile: `http://<IP>:8000`

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)

## 🎓 Next Steps

Setelah setup berhasil:

1. Customize warna dan tema
2. Tambahkan logo sekolah
3. Setup email service untuk OTP
4. Buat sample data untuk testing
5. Train admin users
6. Launch ke production

---

**Happy coding! 🚀**
