# Sistem Absensi Karyawan

Aplikasi web untuk mencatat absensi karyawan dengan integrasi Google Spreadsheet.

## Fitur

- ✅ Form absensi yang user-friendly
- ✅ Validasi input yang lengkap
- ✅ Integrasi dengan Google Sheets API
- ✅ Riwayat absensi lokal (localStorage)
- ✅ Auto-save draft
- ✅ Responsive design
- ✅ Loading indicator
- ✅ Real-time clock
- ✅ Keyboard shortcuts

## Cara Setup

### 1. Persiapan Google Spreadsheet

1. Buat spreadsheet baru di [Google Sheets](https://sheets.google.com)
2. Buat sheet dengan nama "Absensi" (atau sesuaikan di config.js)
3. Tambahkan header di baris pertama:
   ```
   Tanggal | Waktu | ID Karyawan | Nama | Departemen | Jenis Absensi | Catatan
   ```
4. Copy ID spreadsheet dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 2. Setup Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Enable Google Sheets API:
   - Pergi ke "APIs & Services" > "Library"
   - Cari "Google Sheets API"
   - Klik "Enable"
4. Buat API Key:
   - Pergi ke "APIs & Services" > "Credentials"
   - Klik "Create Credentials" > "API Key"
   - Copy API Key yang dihasilkan
5. (Opsional) Restrict API Key:
   - Klik pada API Key yang baru dibuat
   - Di "Application restrictions", pilih "HTTP referrers"
   - Tambahkan domain website Anda
   - Di "API restrictions", pilih "Restrict key" dan pilih "Google Sheets API"

### 3. Konfigurasi Aplikasi

1. Edit file `config.js`:
   ```javascript
   const GOOGLE_SHEETS_CONFIG = {
       SPREADSHEET_ID: 'your_spreadsheet_id_here',
       SHEET_NAME: 'Absensi',
       API_KEY: 'your_api_key_here'
   };
   ```

2. Atau edit langsung di `script.js` bagian CONFIG:
   ```javascript
   const CONFIG = {
       SPREADSHEET_ID: 'your_spreadsheet_id_here',
       SHEET_NAME: 'Absensi',
       API_KEY: 'your_api_key_here'
   };
   ```

### 4. Setup Spreadsheet Permissions

1. Buka spreadsheet Anda
2. Klik "Share" di kanan atas
3. Ubah permissions menjadi "Anyone with the link can edit"
4. Atau tambahkan email service account jika menggunakan authentication

## Cara Menggunakan

1. Buka `index.html` di browser
2. Isi form absensi:
   - ID Karyawan
   - Nama Karyawan
   - Departemen
   - Jenis Absensi
   - Catatan (opsional)
3. Klik "Submit Absensi"
4. Data akan tersimpan di Google Spreadsheet dan localStorage

## Keyboard Shortcuts

- `Enter`: Submit form
- `Escape`: Clear form
- `Tab`: Navigate antar field

## Struktur Data

Data yang dikirim ke Google Sheets:
- Tanggal (format Indonesia)
- Waktu (format Indonesia)
- ID Karyawan
- Nama Karyawan
- Departemen
- Jenis Absensi
- Catatan

## File Structure

```
presensi-web/
├── index.html          # File HTML utama
├── styles.css          # Styling CSS
├── script.js           # Logika JavaScript
├── config.js           # Konfigurasi aplikasi
├── setup-guide.md      # Panduan setup lengkap
├── .gitignore          # Git ignore file
└── README.md           # Dokumentasi
```

## Demo Online

Aplikasi ini bisa diakses secara online melalui GitHub Pages:
- **Live Demo:** [https://USERNAME.github.io/presensi-web/](https://USERNAME.github.io/presensi-web/)
- **Repository:** [https://github.com/USERNAME/presensi-web](https://github.com/USERNAME/presensi-web)

## Troubleshooting

### Error: "Gagal mengirim data"
- Pastikan API Key valid
- Pastikan Spreadsheet ID benar
- Pastikan Google Sheets API sudah di-enable
- Pastikan spreadsheet permissions sudah benar

### Data tidak muncul di spreadsheet
- Cek nama sheet (tab) apakah sesuai
- Pastikan header sudah ada di baris pertama
- Cek console browser untuk error message

### CORS Error
- Jika menggunakan file:// protocol, gunakan web server lokal
- Atau deploy ke web server yang mendukung HTTPS

## Development

Untuk development lokal, gunakan web server:

```bash
# Python 3
python -m http.server 8000

# Node.js (jika ada)
npx http-server

# PHP
php -S localhost:8000
```

Kemudian buka `http://localhost:8000`

## Security Notes

- API Key akan terlihat di client-side
- Gunakan domain restrictions untuk API Key
- Pertimbangkan menggunakan service account untuk production
- Jangan hardcode credentials di production

## License

MIT License - bebas digunakan untuk keperluan komersial dan non-komersial.

## Support

Jika ada masalah atau pertanyaan, silakan buat issue di repository ini.
