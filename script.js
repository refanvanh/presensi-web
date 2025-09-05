// Konfigurasi Google Sheets
const CONFIG = {
    // ID spreadsheet Anda
    SPREADSHEET_ID: '1Ztx84ZaJ30UQ7vUWQU8WaXM0UF3d9JY3YMgBwvi0oHY',
    // Nama sheet (tab) di spreadsheet
    SHEET_NAME: 'Absensi',
    // API key untuk akses Google Sheets
    API_KEY: 'AIzaSyA-e41hNMHRprlpWL31MeX4xS9znrMndh0',
    // URL Google Apps Script (alternatif yang lebih mudah)
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby3QInBvHfLMOmDIi0haDhzhd6jTYS_lZ5L0WgMjFVXe7HKJFdn-7FiTODjnkX1tKf6-Q/exec',
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
    
    // Load recent attendance dari localStorage
    loadRecentAttendance();
    
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
        // Simpan ke localStorage untuk riwayat lokal
        saveToLocalStorage(formData);
        
        // Kirim ke Google Sheets
        await sendToGoogleSheets(formData);
        
        showStatusMessage('Absensi berhasil dicatat!', 'success');
        clearForm();
        loadRecentAttendance();
        
    } catch (error) {
        console.error('Error:', error);
        showStatusMessage('Gagal mengirim data. Silakan coba lagi.', 'error');
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

// Simpan ke localStorage untuk riwayat lokal
function saveToLocalStorage(data) {
    const recentAttendance = JSON.parse(localStorage.getItem('recentAttendance') || '[]');
    
    // Tambahkan data baru di awal array
    recentAttendance.unshift(data);
    
    // Batasi hanya 10 data terbaru
    if (recentAttendance.length > 10) {
        recentAttendance.splice(10);
    }
    
    localStorage.setItem('recentAttendance', JSON.stringify(recentAttendance));
}

// Load riwayat absensi dari localStorage
function loadRecentAttendance() {
    const recentAttendance = JSON.parse(localStorage.getItem('recentAttendance') || '[]');
    const recentList = document.getElementById('recentList');
    
    if (recentAttendance.length === 0) {
        recentList.innerHTML = '<p class="no-data">Belum ada data absensi</p>';
        return;
    }
    
    recentList.innerHTML = recentAttendance.map(item => `
        <div class="attendance-item">
            <div class="employee-info">
                ${item.employeeName} (${item.employeeId}) - ${item.department}
            </div>
            <div class="attendance-details">
                <strong>${item.attendanceType}</strong> • ${item.date} ${item.time}
                ${item.notes ? `<br><em>Catatan: ${item.notes}</em>` : ''}
            </div>
        </div>
    `).join('');
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
        // Kirim data sebagai URL parameters untuk menghindari CORS
        const params = new URLSearchParams();
        params.append('date', data.date);
        params.append('time', data.time);
        params.append('employeeId', data.employeeId);
        params.append('employeeName', data.employeeName);
        params.append('department', data.department);
        params.append('attendanceType', data.attendanceType);
        params.append('notes', data.notes || '');
        
        const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Data berhasil dikirim via Apps Script:', result);
        return result;
        
    } catch (error) {
        console.error('Error sending to Apps Script:', error);
        
        // Fallback ke localStorage jika Apps Script gagal
        console.log('Fallback ke localStorage karena Apps Script gagal');
        return {success: true, message: 'Data disimpan lokal (Apps Script tidak tersedia)'};
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

// Auto-save draft (opsional)
let draftTimer;
function autoSaveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
        const formData = collectFormData();
        if (formData.employeeId || formData.employeeName) {
            localStorage.setItem('draftAttendance', JSON.stringify(formData));
        }
    }, 1000);
}

// Load draft saat halaman dimuat
function loadDraft() {
    const draft = localStorage.getItem('draftAttendance');
    if (draft) {
        const data = JSON.parse(draft);
        document.getElementById('employeeId').value = data.employeeId || '';
        document.getElementById('employeeName').value = data.employeeName || '';
        document.getElementById('department').value = data.department || '';
        document.getElementById('attendanceType').value = data.attendanceType || '';
        document.getElementById('notes').value = data.notes || '';
    }
}

// Event listeners untuk auto-save draft
document.getElementById('employeeId').addEventListener('input', autoSaveDraft);
document.getElementById('employeeName').addEventListener('input', autoSaveDraft);
document.getElementById('department').addEventListener('change', autoSaveDraft);
document.getElementById('attendanceType').addEventListener('change', autoSaveDraft);
document.getElementById('notes').addEventListener('input', autoSaveDraft);

// Load draft saat inisialisasi
loadDraft();

// Clear draft setelah submit berhasil
function clearDraft() {
    localStorage.removeItem('draftAttendance');
}

// Update clearForm untuk juga clear draft
const originalClearForm = clearForm;
clearForm = function() {
    originalClearForm();
    clearDraft();
};
