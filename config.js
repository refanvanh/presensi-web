// Konfigurasi untuk Google Sheets API
// Ganti nilai-nilai di bawah ini dengan informasi spreadsheet Anda

const GOOGLE_SHEETS_CONFIG = {
    // ID Spreadsheet - dapatkan dari URL spreadsheet Anda
    // Contoh: https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit
    // ID-nya adalah: 1ABC123DEF456GHI789JKL
    SPREADSHEET_ID: '1Ztx84ZaJ30UQ7vUWQU8WaXM0UF3d9JY3YMgBwvi0oHY',
    
    // Nama sheet (tab) di spreadsheet Anda
    SHEET_NAME: 'Absensi',
    
    // API Key dari Google Cloud Console
    // Cara mendapatkan:
    // 1. Buka https://console.cloud.google.com/
    // 2. Buat project baru atau pilih project yang ada
    // 3. Enable Google Sheets API
    // 4. Buat API Key di Credentials
    // 5. Restrict API Key ke Google Sheets API
    API_KEY: 'AIzaSyA-e41hNMHRprlpWL31MeX4xS9znrMndh0',
    
    // Range untuk menulis data (opsional, default akan otomatis)
    RANGE: 'A:G'
};

// Konfigurasi aplikasi
const APP_CONFIG = {
    // Nama aplikasi
    APP_NAME: 'Sistem Absensi Karyawan',
    
    // Versi aplikasi
    VERSION: '1.0.0',
    
    // Timezone
    TIMEZONE: 'Asia/Jakarta',
    
    // Jumlah maksimal riwayat yang disimpan di localStorage
    MAX_RECENT_ITEMS: 10,
    
    // Auto-save draft interval (dalam detik)
    AUTO_SAVE_INTERVAL: 1,
    
    // Departemen yang tersedia
    DEPARTMENTS: [
        'IT',
        'HR', 
        'Finance',
        'Marketing',
        'Operations',
        'Sales',
        'Customer Service',
        'Production',
        'Quality Control',
        'Maintenance'
    ],
    
    // Jenis absensi yang tersedia
    ATTENDANCE_TYPES: [
        'Masuk',
        'Keluar',
        'Izin',
        'Sakit',
        'Cuti',
        'Terlambat'
    ]
};

// Export konfigurasi untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GOOGLE_SHEETS_CONFIG, APP_CONFIG };
}
