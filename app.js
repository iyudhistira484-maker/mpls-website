// ==================== APP INITIALIZATION ==================== 

// Check if user is authenticated
async function checkAuth() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

// Redirect to login if not authenticated
async function requireAuth() {
    const isAuth = await checkAuth();
    if (!isAuth) {
        window.location.href = 'login.html';
    }
}

// Redirect to appropriate dashboard based on role
async function redirectToDashboard() {
    const user = await getCurrentUser();
    if (user) {
        const userData = await getUserData(user.uid);
        if (userData.role === 'admin') {
            window.location.href = 'dashboard-admin.html';
        } else {
            window.location.href = 'dashboard-siswa.html';
        }
    }
}

// ==================== TOAST NOTIFICATIONS ==================== 

class Toast {
    constructor() {
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

        this.container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });

        if (duration > 0) {
            setTimeout(() => {
                toast.remove();
            }, duration);
        }
    }

    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    error(message, duration = 3000) {
        this.show(message, 'error', duration);
    }

    warning(message, duration = 3000) {
        this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

const toast = new Toast();

// ==================== LOADING OVERLAY ==================== 

class LoadingOverlay {
    constructor() {
        this.overlay = document.querySelector('.loading-overlay');
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'loading-overlay hidden';
            this.overlay.innerHTML = '<div class="loader"></div>';
            document.body.appendChild(this.overlay);
        }
    }

    show() {
        this.overlay.classList.remove('hidden');
    }

    hide() {
        this.overlay.classList.add('hidden');
    }
}

const loading = new LoadingOverlay();

// ==================== MODAL ==================== 

class Modal {
    constructor(id) {
        this.modal = document.getElementById(id);
        this.closeBtn = this.modal?.querySelector('.modal-close');
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }
    }

    open() {
        if (this.modal) {
            this.modal.classList.add('active');
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    }

    toggle() {
        if (this.modal) {
            this.modal.classList.toggle('active');
        }
    }
}

// ==================== THEME TOGGLE ==================== 

class ThemeToggle {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        }

        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
            this.themeToggle.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-mode');
            this.themeToggle.textContent = '🌙';
        }
    }

    updateIcon() {
        if (this.themeToggle) {
            this.themeToggle.textContent = this.isDarkMode ? '☀️' : '🌙';
        }
    }
}

const themeToggle = new ThemeToggle();

// ==================== FORM VALIDATION ==================== 

class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        return password.length >= 6;
    }

    static validatePasswordMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    static validateUsername(username) {
        return username.length >= 3 && username.length <= 50;
    }

    static validateOTP(otp) {
        return /^\d{6}$/.test(otp);
    }

    static validatePhoneNumber(phone) {
        const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
        return phoneRegex.test(phone);
    }

    static validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
}

// ==================== DATE & TIME UTILITIES ==================== 

class DateUtils {
    static formatDate(date, format = 'DD/MM/YYYY') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year)
            .replace('HH', hours)
            .replace('mm', minutes);
    }

    static formatTime(date) {
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    static getDayName(date) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return days[new Date(date).getDay()];
    }

    static getMonthName(date) {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[new Date(date).getMonth()];
    }

    static isToday(date) {
        const today = new Date();
        const d = new Date(date);
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    }

    static isPast(date) {
        return new Date(date) < new Date();
    }

    static isFuture(date) {
        return new Date(date) > new Date();
    }

    static getDaysUntil(date) {
        const now = new Date();
        const d = new Date(date);
        const diff = d - now;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}

// ==================== STRING UTILITIES ==================== 

class StringUtils {
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static truncate(str, length = 50) {
        if (str.length > length) {
            return str.substring(0, length) + '...';
        }
        return str;
    }

    static slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static generateColor() {
        const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// ==================== STORAGE UTILITIES ==================== 

class StorageUtils {
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    static getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    }

    static removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }

    static clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }
}

// ==================== ANIMATION UTILITIES ==================== 

class AnimationUtils {
    static observeElements(selector = '.fade-in') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    static parallax() {
        window.addEventListener('scroll', () => {
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-parallax');
                const yPos = window.scrollY * speed;
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// ==================== API UTILITIES ==================== 

class APIUtils {
    static async fetchData(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    static async postData(url, data, options = {}) {
        return this.fetchData(url, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options
        });
    }

    static async putData(url, data, options = {}) {
        return this.fetchData(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        });
    }

    static async deleteData(url, options = {}) {
        return this.fetchData(url, {
            method: 'DELETE',
            ...options
        });
    }
}

// ==================== INITIALIZATION ==================== 

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    AnimationUtils.observeElements();
    AnimationUtils.parallax();

    // Initialize theme
    themeToggle.updateIcon();
});
