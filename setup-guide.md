# Panduan Setup Lengkap

## Langkah 1: Buat Google Spreadsheet

1. **Buka Google Sheets**
   - Kunjungi https://sheets.google.com
   - Klik "Blank" untuk membuat spreadsheet baru

2. **Setup Header**
   - Di baris pertama (A1), masukkan header berikut:
   ```
   A1: Tanggal
   B1: Waktu  
   C1: ID Karyawan
   D1: Nama
   E1: Departemen
   F1: Jenis Absensi
   G1: Catatan
   ```

3. **Ambil Spreadsheet ID**
   - Copy URL spreadsheet Anda
   - ID adalah bagian antara `/d/` dan `/edit`
   - Contoh: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
   - ID-nya: `1ABC123DEF456GHI789JKL`

## Langkah 2: Setup Google Cloud Console

1. **Buat Project**
   - Buka https://console.cloud.google.com/
   - Klik "Select a project" > "New Project"
   - Beri nama project (contoh: "Absensi App")
   - Klik "Create"

2. **Enable Google Sheets API**
   - Di sidebar, klik "APIs & Services" > "Library"
   - Search "Google Sheets API"
   - Klik "Google Sheets API" > "Enable"

3. **Buat API Key**
   - Klik "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "API Key"
   - Copy API Key yang muncul

4. **Restrict API Key (Recommended)**
   - Klik pada API Key yang baru dibuat
   - Di "Application restrictions":
     - Pilih "HTTP referrers (web sites)"
     - Tambahkan domain Anda (contoh: `localhost:8000/*`)
   - Di "API restrictions":
     - Pilih "Restrict key"
     - Pilih "Google Sheets API"
   - Klik "Save"

## Langkah 3: Konfigurasi Aplikasi

1. **Edit script.js**
   - Buka file `script.js`
   - Cari bagian `CONFIG` (sekitar baris 3-8)
   - Ganti nilai-nilai berikut:
   ```javascript
   const CONFIG = {
       SPREADSHEET_ID: '1ABC123DEF456GHI789JKL', // Ganti dengan ID spreadsheet Anda
       SHEET_NAME: 'Absensi', // Sesuaikan nama sheet
       API_KEY: 'AIzaSyB...' // Ganti dengan API Key Anda
   };
   ```

2. **Atau edit config.js**
   - Buka file `config.js`
   - Ganti nilai di `GOOGLE_SHEETS_CONFIG`

## Langkah 4: Test Aplikasi

1. **Jalankan Web Server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Atau buka langsung di browser (mungkin ada CORS issues)
   ```

2. **Buka Aplikasi**
   - Buka browser
   - Kunjungi `http://localhost:8000`

3. **Test Submit**
   - Isi form dengan data test
   - Klik "Submit Absensi"
   - Cek apakah data muncul di Google Spreadsheet

## Troubleshooting

### Error: "Gagal mengirim data"
**Solusi:**
- Pastikan API Key valid dan tidak expired
- Pastikan Spreadsheet ID benar
- Pastikan Google Sheets API sudah di-enable
- Cek console browser (F12) untuk error detail

### CORS Error
**Solusi:**
- Gunakan web server lokal, jangan buka file langsung
- Pastikan domain sudah ditambahkan di API Key restrictions

### Data tidak muncul di spreadsheet
**Solusi:**
- Pastikan nama sheet (tab) sesuai dengan konfigurasi
- Pastikan header sudah ada di baris pertama
- Cek permissions spreadsheet (harus bisa di-edit)

### API Key tidak berfungsi
**Solusi:**
- Pastikan API Key tidak expired
- Pastikan restrictions tidak terlalu ketat
- Coba buat API Key baru

## Tips Keamanan

1. **Restrict API Key**
   - Selalu restrict API Key ke domain yang diperlukan
   - Jangan biarkan API Key bisa diakses dari domain lain

2. **Spreadsheet Permissions**
   - Jangan set spreadsheet ke "Public"
   - Gunakan "Anyone with the link can edit" jika diperlukan

3. **Production Deployment**
   - Pertimbangkan menggunakan service account
   - Gunakan environment variables untuk credentials

## Contoh Konfigurasi Lengkap

```javascript
// script.js - bagian CONFIG
const CONFIG = {
    SPREADSHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    SHEET_NAME: 'Absensi',
    API_KEY: 'AIzaSyBvOkBw3cGx7K8L9M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z'
};
```

## Support

Jika masih ada masalah:
1. Cek console browser (F12) untuk error messages
2. Pastikan semua langkah setup sudah benar
3. Coba dengan API Key baru
4. Pastikan spreadsheet format sudah sesuai
