/**
 * 同事送別電子賀卡｜Google Apps Script 後端
 * 1. 在 Google Apps Script 新專案貼上 Code.gs 與 Index.html。
 * 2. 執行 setup() 授權並建立專用留言試算表。
 * 3. 部署為網頁應用程式：執行身分「我」、存取權「所有人」。
 */
const CARD_CONFIG = Object.freeze({
  SPREADSHEET_TITLE: '同事送別電子賀卡－祝福留言',
  SHEET_TITLE: '祝福留言',
  MAX_WISHES: 300
});
function setup() {
  const sheet = getOrCreateSheet_();
  const url = sheet.getParent().getUrl();
  Logger.log('留言管理試算表：' + url);
  return '建立完成，留言管理試算表：' + url;
}
function doGet(e) {
  const tpl = HtmlService.createTemplateFromFile('Index');
  tpl.pageMode = e && e.parameter && e.parameter.view === 'card' ? 'card' : 'write';
  return tpl.evaluate().setTitle('我們的送別祝福卡｜Thank You & Good Luck')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
function getCardData() {
  const sheet = getOrCreateSheet_();
  const lastRow = sheet.getLastRow();
  let messages = [];
  if (lastRow > 1) {
    const rows = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    messages = rows
      .filter(r => String(r[1] || '').trim() && String(r[2] || '').trim())
      .map(r => ({
        id: String(r[3] || ''),
        name: restoreText_(r[1]),
        message: restoreText_(r[2])
      }));
  }
  const baseUrl = ScriptApp.getService().getUrl() || '';
  return {messages, writeUrl: baseUrl, cardUrl: baseUrl ? baseUrl + '?view=card' : ''};
}
function saveWish(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('資料格式不正確。');
  const name = String(payload.name || '').trim().replace(/[\u0000-\u001f\u007f]/g, '');
  const message = String(payload.message || '').trim().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
  if (!name || !message) throw new Error('請填寫姓名和祝福內容。');
  if (name.length > 24) throw new Error('姓名最多 24 個字。');
  if (message.length > 350) throw new Error('祝福最多 350 個字。');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getOrCreateSheet_();
    if (sheet.getLastRow() - 1 >= CARD_CONFIG.MAX_WISHES) {
      throw new Error('這張卡片的祝福已經額滿，請聯絡卡片製作者。');
    }
    const row = sheet.getLastRow() + 1;
    sheet.getRange(row, 2, 1, 2).setNumberFormat('@');
    sheet.getRange(row, 1, 1, 4).setValues([[
      new Date(), protectText_(name), protectText_(message), Utilities.getUuid()
    ]]);
    return {ok: true, count: row - 1};
  } finally {
    lock.releaseLock();
  }
}
function protectText_(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function restoreText_(text) {
  const s = String(text || '');
  return /^'[=+\-@]/.test(s) ? s.slice(1) : s;
}
function getOrCreateSheet_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('CARD_SPREADSHEET_ID');
  let spreadsheet;
  if (id) {
    spreadsheet = SpreadsheetApp.openById(id);
  } else {
    spreadsheet = SpreadsheetApp.create(CARD_CONFIG.SPREADSHEET_TITLE);
    props.setProperty('CARD_SPREADSHEET_ID', spreadsheet.getId());
  }
  let sheet = spreadsheet.getSheetByName(CARD_CONFIG.SHEET_TITLE);
  if (!sheet) sheet = spreadsheet.insertSheet(CARD_CONFIG.SHEET_TITLE);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['提交時間', '名字', '祝福內容', '留言 ID']);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:D1').setFontWeight('bold').setBackground('#EADFF2');
    sheet.setColumnWidth(1, 170);
    sheet.setColumnWidth(2, 135);
    sheet.setColumnWidth(3, 530);
    sheet.setColumnWidth(4, 280);
    sheet.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm');
  }
  return sheet;
}
