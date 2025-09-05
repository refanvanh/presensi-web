// Google Apps Script Code untuk Google Sheets
// Copy kode ini ke Google Apps Script (script.google.com)

function doPost(e) {
  try {
    // Parse data yang dikirim dari web
    let data;
    if (e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else {
      throw new Error('No data received');
    }
    
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
      data.date,
      data.time,
      data.employeeId,
      data.employeeName,
      data.department,
      data.attendanceType,
      data.notes || ''
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Data berhasil disimpan'}))
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
