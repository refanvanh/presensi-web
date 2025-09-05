// Google Apps Script Code untuk Google Sheets
// Copy kode ini ke Google Apps Script (script.google.com)

function doPost(e) {
  try {
    console.log('Received data:', e);
    
    // Parse data yang dikirim dari web
    let data;
    if (e && e.parameter) {
      console.log('Using parameter directly');
      data = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      console.log('Using postData.contents');
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        console.log('JSON parse failed, using postData.contents as string');
        data = e.postData.contents;
      }
    } else if (e && e.parameter && e.parameter.data) {
      console.log('Using parameter.data');
      try {
        data = JSON.parse(e.parameter.data);
      } catch (parseError) {
        console.log('JSON parse failed, using parameter.data as string');
        data = e.parameter.data;
      }
    } else {
      console.log('No data found, using test data');
      data = {
        date: new Date().toLocaleDateString('id-ID'),
        time: new Date().toLocaleTimeString('id-ID'),
        employeeId: 'TEST001',
        employeeName: 'Test User',
        department: 'IT',
        attendanceType: 'Masuk',
        notes: 'Test dari Apps Script'
      };
    }
    
    console.log('Parsed data:', data);
    
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
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({message: 'Google Apps Script is running', timestamp: new Date()}))
    .setMimeType(ContentService.MimeType.JSON);
}
