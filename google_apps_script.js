/**
 * =============================================================================
 * PRANAV CRACKERS - GOOGLE SHEETS LIVE DATABASE & ORDER TRACKING SYNC
 * Target Spreadsheet: https://docs.google.com/spreadsheets/d/1hsoJ_KDWGojkIMUJP0Rl5SfzAsYPjFHMC5J3POBV1XE/edit
 * =============================================================================
 * 
 * 🔒 HOW TO KEEP YOUR GOOGLE SHEET PRIVATE & SECURE:
 * 1. Open your Google Sheet in Google Drive.
 * 2. Click "Share" (top right button).
 * 3. Under "General access", make sure it is set to: "Restricted" (Private to you).
 * 4. Only your Google account can see or edit the sheet!
 * 5. Because Google Apps Script deploys as "Execute as: Me", it can read and write
 *    to your private sheet securely without anyone else getting access to the sheet.
 *
 * ⚙️ HOW TO DEPLOY THIS IN APPS SCRIPT (Takes 1 minute):
 * 1. In your Google Sheet, click: Extensions -> Apps Script
 * 2. Delete any existing code, copy & paste this ENTIRE code file.
 * 3. Click the Save icon (💾).
 * 4. Click "Deploy" (top right) -> "New deployment"
 * 5. Select type: "Web app"
 * 6. Set:
 *    - Description: Pranav Crackers Live Sync & Tracking
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone
 * 7. Click "Deploy" and authorize permissions.
 * 8. Copy the generated Web App URL and paste it into 'config/siteConfig.js' (googleAppsScriptUrl).
 *
 * 📋 HOW TO CONTROL ORDER STATUS (PAID, WAITING FOR PAYMENT, ETC.):
 * In your Google Sheet under "Customer Quotations", Column M has a dropdown with:
 *   - Waiting for Payment
 *   - Paid
 *   - Confirmed
 *   - Dispatched
 *   - Delivered
 *   - Under Review
 *   - Cancelled
 * Whenever you change a status in Column M, the customer sees it INSTANTLY
 * when they enter their Quotation ID or Mobile Number on the "Track Order" page!
 * =============================================================================
 */

const SHEET_ID = '1hsoJ_KDWGojkIMUJP0Rl5SfzAsYPjFHMC5J3POBV1XE';
const QUOTATIONS_TAB_NAME = 'Customer Quotations';

const STATUS_CHOICES = [
  'Waiting for Payment',
  'Paid',
  'Confirmed',
  'Dispatched',
  'Delivered',
  'Under Review',
  'Cancelled'
];

/**
 * Handle incoming POST requests: Saves new customer quotation to Google Sheet
 */
function doPost(e) {
  try {
    const contents = e.postData ? e.postData.contents : null;
    if (!contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'No payload' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(QUOTATIONS_TAB_NAME);

    // If tab doesn't exist, create it with headers & dropdowns
    if (!sheet) {
      sheet = ss.insertSheet(QUOTATIONS_TAB_NAME);
      setupHeaders(sheet);
    }

    // Default status when newly placed: "Waiting for Payment" or "New Requirement"
    const initialStatus = data.status || 'Waiting for Payment';

    // Append new customer quotation row
    sheet.appendRow([
      data.timestamp || Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy, hh:mm:ss a'),
      data.quotationId || 'PCQ-UNKNOWN',
      data.customerName || '',
      data.phone || '',
      data.address || '',
      data.city || '',
      data.state || '',
      data.pincode || '',
      data.totalItems || 0,
      data.estimatedTotal || 0,
      data.crackersList || '',
      data.deliveryNotes || '',
      initialStatus
    ]);

    // Format new row & attach dropdown to Status column
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 13).setVerticalAlignment('middle');
    sheet.getRange(lastRow, 10).setNumberFormat('₹#,##0'); // Currency formatting

    // Attach Status Dropdown to Column M (13)
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUS_CHOICES, true)
      .setAllowInvalid(true)
      .build();
    sheet.getRange(lastRow, 13).setDataValidation(rule);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      quotationId: data.quotationId,
      row: lastRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle incoming GET requests:
 * 1. Health check: returns connected status
 * 2. Live Order Tracking: '?action=track&query=PCQ-...' returns order details + live status
 */
function doGet(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};
    const query = (p.query || p.id || p.phone || '').trim().toLowerCase();

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(QUOTATIONS_TAB_NAME);

    // Live Order Tracking Search
    if (query) {
      if (!sheet || sheet.getLastRow() <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          found: false,
          message: 'No orders recorded yet in spreadsheet.'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const rows = sheet.getDataRange().getValues();
      const cleanQuery = query.replace(/[^0-9a-z\-]/g, '');

      // Search rows from bottom to top (most recent first)
      for (let i = rows.length - 1; i >= 1; i--) {
        const row = rows[i];
        const rowQId = String(row[1] || '').trim().toLowerCase();
        const rowPhone = String(row[3] || '').replace(/[^0-9]/g, '');

        if (rowQId === cleanQuery || (cleanQuery.length >= 10 && rowPhone.includes(cleanQuery))) {
          return ContentService.createTextOutput(JSON.stringify({
            found: true,
            order: {
              timestamp: row[0],
              quotationId: row[1],
              id: row[1],
              customerName: row[2],
              phone: row[3],
              address: row[4],
              city: row[5],
              state: row[6],
              pincode: row[7],
              totalItems: row[8],
              itemsCount: row[8],
              estimatedTotal: row[9],
              crackersList: row[10],
              deliveryNotes: row[11],
              status: row[12] || 'Waiting for Payment'
            }
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        found: false,
        query: query,
        message: 'No quotation matching reference or mobile number.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Default: Health check
    const count = sheet ? Math.max(0, sheet.getLastRow() - 1) : 0;
    return ContentService.createTextOutput(JSON.stringify({
      status: 'connected',
      sheetName: ss.getName(),
      quotationsCount: count,
      tab: QUOTATIONS_TAB_NAME,
      statusChoices: STATUS_CHOICES
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Setup headers and formatting for the Customer Quotations tab
 */
function setupHeaders(sheet) {
  const headers = [
    'Date & Time',
    'Quotation ID',
    'Customer Name',
    'Mobile / WhatsApp',
    'Delivery Address',
    'City',
    'State',
    'PIN Code',
    'Total Items',
    'Wholesale Total (₹)',
    'Selected Crackers Summary',
    'Delivery Notes',
    'Status'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format Header Row (Royal Navy & Gold aesthetic)
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#0B2545');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);

  // Set column widths for readability
  sheet.setColumnWidth(1, 170); // Date & Time
  sheet.setColumnWidth(2, 160); // Quotation ID
  sheet.setColumnWidth(3, 160); // Customer Name
  sheet.setColumnWidth(4, 140); // Phone
  sheet.setColumnWidth(5, 240); // Address
  sheet.setColumnWidth(6, 120); // City
  sheet.setColumnWidth(7, 120); // State
  sheet.setColumnWidth(8, 90);  // PIN Code
  sheet.setColumnWidth(9, 90);  // Items
  sheet.setColumnWidth(10, 140); // Total
  sheet.setColumnWidth(11, 350); // Crackers List
  sheet.setColumnWidth(12, 200); // Notes
  sheet.setColumnWidth(13, 160); // Status with Dropdown

  // Set data validation rule for Column M (13) from row 2 to 500
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS_CHOICES, true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange('M2:M500').setDataValidation(rule);
}

/**
 * One-click helper function to initialize the tab right now from Apps Script editor
 */
function initializeSheetNow() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(QUOTATIONS_TAB_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(QUOTATIONS_TAB_NAME);
  }
  setupHeaders(sheet);
  Logger.log('Customer Quotations tab created with Status dropdowns successfully!');
}
