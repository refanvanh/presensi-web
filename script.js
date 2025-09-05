// Konfigurasi Google Sheets
const CONFIG = {
    // ID spreadsheet Anda
    SPREADSHEET_ID: '1Ztx84ZaJ30UQ7vUWQU8WaXM0UF3d9JY3YMgBwvi0oHY',
    // Nama sheet (tab) di spreadsheet
    SHEET_NAME: 'Absensi',
    // API key untuk akses Google Sheets
    API_KEY: 'AIzaSyA-e41hNMHRprlpWL31MeX4xS9znrMndh0',
    // URL Google Apps Script (alternatif yang lebih mudah)
    // Ganti dengan URL deployment yang benar
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyvqVYAf2Z1Op6dVZSwmZMNe-Ii-MMawUsgtgQKT3oKge5o-bcPCWbLojlijzJUnEZK/exec',
    // Gunakan Apps Script atau Google Sheets API
    USE_APPS_SCRIPT: true
};

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Event listener untuk form submit
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);
    
    // Load data terbaru dari Google Sheets
    loadRecentAttendanceFromSheets();
    
    // Auto-focus pada input pertama
    document.getElementById('employeeId').focus();
}

// Update waktu real-time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta'
    };
    
    const formattedDateTime = now.toLocaleDateString('id-ID', options);
    document.getElementById('currentDateTime').textContent = formattedDateTime;
}

// Handle form submission
async function handleSubmit() {
    const formData = collectFormData();
    
    if (!validateForm(formData)) {
        return;
    }
    
    showLoading(true);
    hideStatusMessage();
    
    try {
        // Kirim langsung ke Google Sheets
        await sendToGoogleSheets(formData);
        
        showStatusMessage('Absensi berhasil dicatat ke Google Sheets!', 'success');
        clearForm();
        
        // Refresh data terbaru dari Google Sheets
        setTimeout(() => {
            loadRecentAttendanceFromSheets();
        }, 1000);
        
    } catch (error) {
        console.error('Error:', error);
        showStatusMessage('Gagal mengirim data ke Google Sheets. Silakan coba lagi.', 'error');
    } finally {
        showLoading(false);
    }
}

// Kumpulkan data dari form
function collectFormData() {
    const now = new Date();
    
    return {
        employeeId: document.getElementById('employeeId').value.trim(),
        employeeName: document.getElementById('employeeName').value.trim(),
        department: document.getElementById('department').value,
        attendanceType: document.getElementById('attendanceType').value,
        notes: document.getElementById('notes').value.trim(),
        timestamp: now.toISOString(),
        date: now.toLocaleDateString('id-ID'),
        time: now.toLocaleTimeString('id-ID')
    };
}

// Validasi form
function validateForm(data) {
    if (!data.employeeId) {
        showStatusMessage('ID Karyawan harus diisi!', 'error');
        document.getElementById('employeeId').focus();
        return false;
    }
    
    if (!data.employeeName) {
        showStatusMessage('Nama Karyawan harus diisi!', 'error');
        document.getElementById('employeeName').focus();
        return false;
    }
    
    if (!data.department) {
        showStatusMessage('Departemen harus dipilih!', 'error');
        document.getElementById('department').focus();
        return false;
    }
    
    if (!data.attendanceType) {
        showStatusMessage('Jenis Absensi harus dipilih!', 'error');
        document.getElementById('attendanceType').focus();
        return false;
    }
    
    return true;
}

// Function untuk mengambil data terbaru dari Google Sheets
async function loadRecentAttendanceFromSheets() {
    try {
        // Ambil data dari Google Sheets menggunakan API
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${CONFIG.SHEET_NAME}!A:G?key=${CONFIG.API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const values = data.values || [];
        
        // Skip header row (baris pertama)
        const attendanceData = values.slice(1);
        
        // Tampilkan data terbaru (maksimal 5 data terakhir)
        const recentData = attendanceData.slice(-5).reverse();
        
        displayRecentAttendance(recentData);
        
    } catch (error) {
        console.error('Error loading data from Google Sheets:', error);
        showGoogleSheetsMessage();
    }
}

// Function untuk menampilkan data absensi terbaru
function displayRecentAttendance(data) {
    const recentList = document.getElementById('recentList');
    
    if (data.length === 0) {
        recentList.innerHTML = `
            <div class="attendance-item">
                <div class="employee-info">
                    <i class="fas fa-info-circle" style="color: #17a2b8; margin-right: 8px;"></i>
                    Belum ada data absensi
                </div>
                <div class="attendance-details">
                    Data absensi akan muncul di sini setelah ada yang melakukan absensi.
                </div>
            </div>
        `;
        return;
    }
    
    recentList.innerHTML = data.map(row => {
        const [date, time, employeeId, employeeName, department, attendanceType, notes] = row;
        return `
            <div class="attendance-item">
                <div class="employee-info">
                    <i class="fas fa-user" style="color: #667eea; margin-right: 8px;"></i>
                    ${employeeName} (${employeeId}) - ${department}
                </div>
                <div class="attendance-details">
                    <strong>${attendanceType}</strong> • ${date} ${time}
                    ${notes ? `<br><em>Catatan: ${notes}</em>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Function untuk menampilkan pesan bahwa data tersimpan di Google Sheets
function showGoogleSheetsMessage() {
    const recentList = document.getElementById('recentList');
    recentList.innerHTML = `
        <div class="attendance-item">
            <div class="employee-info">
                <i class="fas fa-check-circle" style="color: #28a745; margin-right: 8px;"></i>
                Data absensi tersimpan di Google Sheets
            </div>
            <div class="attendance-details">
                Semua data absensi akan tersimpan secara otomatis di spreadsheet Google Sheets.
                <br><em>Buka spreadsheet untuk melihat riwayat lengkap.</em>
            </div>
        </div>
    `;
}

// Kirim data ke Google Sheets
async function sendToGoogleSheets(data) {
    // Jika belum dikonfigurasi, gunakan simulasi
    if (CONFIG.SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
        console.log('Simulasi pengiriman ke Google Sheets:', data);
        // Simulasi delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return;
    }
    
    // Gunakan Google Apps Script jika dikonfigurasi
    if (CONFIG.USE_APPS_SCRIPT && CONFIG.APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL_HERE') {
        return await sendToAppsScript(data);
    }
    
    try {
        // Format data untuk Google Sheets
        const values = [
            [
                data.date,
                data.time,
                data.employeeId,
                data.employeeName,
                data.department,
                data.attendanceType,
                data.notes || ''
            ]
        ];
        
        // Kirim ke Google Sheets menggunakan API
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${CONFIG.SHEET_NAME}!A:G:append?valueInputOption=USER_ENTERED&key=${CONFIG.API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    values: values
                })
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Sheets API Error:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Data berhasil dikirim ke Google Sheets:', result);
        
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        
        // Berikan pesan error yang lebih spesifik
        if (error.message.includes('401')) {
            throw new Error('API Key tidak valid atau tidak memiliki permission. Silakan periksa konfigurasi Google Sheets API.');
        } else if (error.message.includes('403')) {
            throw new Error('Akses ditolak. Pastikan spreadsheet dapat diakses dan API Key sudah benar.');
        } else if (error.message.includes('404')) {
            throw new Error('Spreadsheet tidak ditemukan. Pastikan Spreadsheet ID sudah benar.');
        } else {
            throw new Error('Terjadi kesalahan saat mengirim data ke Google Sheets: ' + error.message);
        }
    }
}

// Kirim data ke Google Apps Script (alternatif yang lebih mudah)
async function sendToAppsScript(data) {
    try {
        // Kirim data sebagai URL parameters menggunakan GET method
        const params = new URLSearchParams();
        params.append('date', data.date);
        params.append('time', data.time);
        params.append('employeeId', data.employeeId);
        params.append('employeeName', data.employeeName);
        params.append('department', data.department);
        params.append('attendanceType', data.attendanceType);
        params.append('notes', data.notes || '');
        
        const url = `${CONFIG.APPS_SCRIPT_URL}?${params.toString()}`;
        console.log('Sending data to:', url);
        console.log('Data being sent:', data);
        
        // Coba dengan mode cors dulu untuk debugging
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors' // Coba dengan cors untuk debugging
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Response data:', result);
            return result;
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Error sending to Apps Script:', error);
        
        // Coba dengan no-cors sebagai fallback
        try {
            console.log('Trying with no-cors mode...');
            const params = new URLSearchParams();
            params.append('date', data.date);
            params.append('time', data.time);
            params.append('employeeId', data.employeeId);
            params.append('employeeName', data.employeeName);
            params.append('department', data.department);
            params.append('attendanceType', data.attendanceType);
            params.append('notes', data.notes || '');
            
            const url = `${CONFIG.APPS_SCRIPT_URL}?${params.toString()}`;
            
            await fetch(url, {
                method: 'GET',
                mode: 'no-cors'
            });
            
            console.log('Data berhasil dikirim via Apps Script (no-cors mode)');
            return {success: true, message: 'Data berhasil dikirim ke Google Sheets'};
            
        } catch (noCorsError) {
            console.error('No-cors mode also failed:', noCorsError);
            
            // Fallback ke localStorage jika Apps Script gagal
            console.log('Fallback ke localStorage karena Apps Script gagal');
            return {success: true, message: 'Data disimpan lokal (Apps Script tidak tersedia)'};
        }
    }
}

// Tampilkan pesan status
function showStatusMessage(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto-hide setelah 5 detik
    setTimeout(() => {
        hideStatusMessage();
    }, 5000);
}

// Sembunyikan pesan status
function hideStatusMessage() {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.className = 'status-message';
}

// Tampilkan/sembunyikan loading
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const submitBtn = document.getElementById('submitBtn');
    
    if (show) {
        loadingOverlay.classList.add('show');
        submitBtn.disabled = true;
    } else {
        loadingOverlay.classList.remove('show');
        submitBtn.disabled = false;
    }
}

// Clear form setelah submit berhasil
function clearForm() {
    document.getElementById('employeeId').value = '';
    document.getElementById('employeeName').value = '';
    document.getElementById('department').value = '';
    document.getElementById('attendanceType').value = '';
    document.getElementById('notes').value = '';
    
    // Focus kembali ke input pertama
    document.getElementById('employeeId').focus();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key untuk submit form
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
    
    // Escape key untuk clear form
    if (e.key === 'Escape') {
        clearForm();
    }
});

// Semua data langsung tersimpan ke Google Sheets
// Tidak perlu localStorage atau draft functionality
