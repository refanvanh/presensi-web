// Google Apps Script Code untuk Google Sheets
// Copy kode ini ke Google Apps Script (script.google.com)

function doPost(e) {
  // Panggil handleWebData function
  return handleWebData(e);
}

// Function untuk handle data dari web app
function handleWebData(e) {
  try {
    console.log('Web data received:', e);
    
    // Ambil data dari parameter
    const data = e.parameter || {};
    console.log('Data from web:', data);
    
    // Buka spreadsheet
    const spreadsheet = SpreadsheetApp.openById('1Ztx84ZaJ30UQ7vUWQU8WaXM0UF3d9JY3YMgBwvi0oHY');
    const sheet = spreadsheet.getSheetByName('Absensi');
    
    // Pastikan header ada
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 7).setValues([
        ['Tanggal', 'Waktu', 'ID Karyawan', 'Nama', 'Departemen', 'Jenis Absensi', 'Catatan']
      ]);
    }
    
    // Tambahkan data baru
    const newRow = [
      data.date || new Date().toLocaleDateString('id-ID'),
      data.time || new Date().toLocaleTimeString('id-ID'),
      data.employeeId || 'UNKNOWN',
      data.employeeName || 'UNKNOWN',
      data.department || 'UNKNOWN',
      data.attendanceType || 'UNKNOWN',
      data.notes || ''
    ];
    
    console.log('Adding row to sheet:', newRow);
    sheet.appendRow(newRow);
    
    console.log('Data successfully added to spreadsheet');
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Data berhasil disimpan', data: newRow}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in handleWebData:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle data dari web app
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    return handleWebData(e);
  }
  
  // Default response
  return ContentService
    .createTextOutput(JSON.stringify({message: 'Google Apps Script is running', timestamp: new Date()}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function untuk debugging
function testFunction() {
  const testData = {
    date: '05/09/2025',
    time: '12:45:00',
    employeeId: 'TEST001',
    employeeName: 'Test User',
    department: 'IT',
    attendanceType: 'Masuk',
    notes: 'Test dari Apps Script'
  };
  
  const spreadsheet = SpreadsheetApp.openById('1Ztx84ZaJ30UQ7vUWQU8WaXM0UF3d9JY3YMgBwvi0oHY');
  const sheet = spreadsheet.getSheetByName('Absensi');
  
  // Pastikan header ada
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 7).setValues([
      ['Tanggal', 'Waktu', 'ID Karyawan', 'Nama', 'Departemen', 'Jenis Absensi', 'Catatan']
    ]);
  }
  
  const newRow = [
    testData.date,
    testData.time,
    testData.employeeId,
    testData.employeeName,
    testData.department,
    testData.attendanceType,
    testData.notes
  ];
  
  sheet.appendRow(newRow);
  console.log('Test data added:', newRow);
  return 'Test data added successfully';
}
