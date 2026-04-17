// Firebase Configuration
// PENTING: Ganti dengan kredensial Firebase Anda sendiri
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Set Firestore persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support all of the features required to enable persistence');
        }
    });

// Auth state listener
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User logged in:', user.email);
        // Simpan user info ke session storage
        sessionStorage.setItem('userEmail', user.email);
        sessionStorage.setItem('userId', user.uid);
        
        // Cek role user dari Firestore
        db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                sessionStorage.setItem('userRole', userData.role);
                sessionStorage.setItem('isVerified', userData.isVerified);
                sessionStorage.setItem('username', userData.username);
            }
        });
    } else {
        console.log('User logged out');
        sessionStorage.clear();
    }
});

// Helper functions
async function registerUser(email, password, username) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Simpan data user ke Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            username: username,
            role: 'siswa',
            isVerified: false,
            createdAt: new Date(),
            avatar: '',
            phone: '',
            class: '',
            studentId: ''
        });

        return user;
    } catch (error) {
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

async function logoutUser() {
    try {
        await auth.signOut();
        sessionStorage.clear();
    } catch (error) {
        throw error;
    }
}

async function getCurrentUser() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            resolve(user);
        });
    });
}

async function getUserData(userId) {
    try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        throw error;
    }
}

// OTP Functions
async function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function saveOTP(email, otp) {
    try {
        const expiresAt = new Date(Date.now() + 5 * 60000); // 5 menit
        await db.collection('otp_codes').doc(email).set({
            code: otp,
            email: email,
            createdAt: new Date(),
            expiresAt: expiresAt,
            attempts: 0
        });
    } catch (error) {
        throw error;
    }
}

async function verifyOTP(email, otp) {
    try {
        const doc = await db.collection('otp_codes').doc(email).get();
        if (!doc.exists) {
            throw new Error('OTP tidak ditemukan');
        }

        const otpData = doc.data();
        const now = new Date();

        if (now > otpData.expiresAt) {
            throw new Error('OTP sudah kadaluarsa');
        }

        if (otpData.attempts >= 3) {
            throw new Error('Terlalu banyak percobaan gagal');
        }

        if (otpData.code !== otp) {
            await db.collection('otp_codes').doc(email).update({
                attempts: otpData.attempts + 1
            });
            throw new Error('OTP salah');
        }

        // OTP benar, hapus OTP dan aktifkan akun
        await db.collection('otp_codes').doc(email).delete();
        
        const user = auth.currentUser;
        if (user) {
            await db.collection('users').doc(user.uid).update({
                isVerified: true,
                verifiedAt: new Date()
            });
        }

        return true;
    } catch (error) {
        throw error;
    }
}

// Upload file to Firebase Storage
async function uploadFile(file, path) {
    try {
        const storageRef = storage.ref(path);
        const uploadTask = storageRef.put(file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload progress:', progress);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    } catch (error) {
        throw error;
    }
}

// Delete file from Firebase Storage
async function deleteFile(fileUrl) {
    try {
        const fileRef = storage.refFromURL(fileUrl);
        await fileRef.delete();
    } catch (error) {
        throw error;
    }
}
