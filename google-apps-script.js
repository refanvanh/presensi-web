// Google Apps Script Code untuk Google Sheets
// Copy kode ini ke Google Apps Script (script.google.com)

function doPost(e) {
  console.log('=== doPost START ===');
  console.log('doPost received:', e);
  console.log('e type:', typeof e);
  
  // Panggil handleWebData function dengan parameter yang benar
  if (e && e.parameter) {
    console.log('doPost calling handleWebData with parameters');
    return handleWebData(e);
  } else {
    console.log('doPost: No parameters, returning error');
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'No parameters received'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function untuk handle data dari web app
function handleWebData(e) {
  try {
    console.log('=== handleWebData START ===');
    console.log('Web data received:', e);
    console.log('e type:', typeof e);
    console.log('Parameter type:', typeof e.parameter);
    console.log('Parameter keys:', e.parameter ? Object.keys(e.parameter) : 'No parameter');
    
    // Validasi parameter
    if (!e || !e.parameter) {
      throw new Error('Invalid parameter: e or e.parameter is undefined');
    }
    
    // Ambil data dari parameter
    const data = e.parameter;
    console.log('Data from web:', data);
    console.log('Data keys:', Object.keys(data));
    
    // Buka spreadsheet
    console.log('Opening spreadsheet...');
    const spreadsheet = SpreadsheetApp.openById('1Ztx84ZaJ30UQ7vUWQU8WaXM0UF3d9JY3YMgBwvi0oHY');
    console.log('Spreadsheet opened:', spreadsheet.getName());
    
    const sheet = spreadsheet.getSheetByName('Absensi');
    console.log('Sheet found:', sheet ? sheet.getName() : 'Sheet not found');
    
    if (!sheet) {
      throw new Error('Sheet "Absensi" not found');
    }
    
    // Pastikan header ada
    console.log('Checking header, last row:', sheet.getLastRow());
    if (sheet.getLastRow() === 0) {
      console.log('Adding header...');
      sheet.getRange(1, 1, 1, 7).setValues([
        ['Tanggal', 'Waktu', 'ID Karyawan', 'Nama', 'Departemen', 'Jenis Absensi', 'Catatan']
      ]);
      console.log('Header added');
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
    console.log('Row added successfully');
    
    console.log('=== handleWebData SUCCESS ===');
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Data berhasil disimpan', data: newRow}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('=== handleWebData ERROR ===');
    console.error('Error in handleWebData:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString(), stack: error.stack}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  console.log('=== doGet START ===');
  console.log('doGet received:', e);
  console.log('e type:', typeof e);
  console.log('e parameter:', e ? e.parameter : 'e is undefined');
  
  // Handle data dari web app
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    console.log('Calling handleWebData with parameters');
    return handleWebData(e);
  }
  
  // Default response
  console.log('Returning default response');
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

// Test function untuk simulate web request
function testWebRequest() {
  const mockEvent = {
    parameter: {
      date: '05/09/2025',
      time: '12:54:00',
      employeeId: 'WEB001',
      employeeName: 'Web Test User',
      department: 'IT',
      attendanceType: 'Masuk',
      notes: 'Test dari web request'
    }
  };
  
  console.log('Testing web request with mock data:', mockEvent);
  return handleWebData(mockEvent);
}

// Test function untuk simulate doPost
function testDoPost() {
  const mockEvent = {
    parameter: {
      date: '05/09/2025',
      time: '12:56:00',
      employeeId: 'POST001',
      employeeName: 'Post Test User',
      department: 'IT',
      attendanceType: 'Masuk',
      notes: 'Test dari doPost'
    }
  };
  
  console.log('Testing doPost with mock data:', mockEvent);
  return doPost(mockEvent);
}
