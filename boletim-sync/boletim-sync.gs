/**
 * Boletim Diário — feedback sync backend (Google Apps Script)
 * Modeled on study-sync/study-sync.gs (JSONP read / POST write to a Google Sheet).
 *
 * doPost  : the boletim page sends 👍/👎/★ → appended to the "Feedback" tab.
 * doGet   : returns the aggregate 👎 list as JSONP, so the daily routine (or page)
 *           can read what Priscila disliked and avoid repeating it.
 *
 * DEPLOY (one time): Extensions ▸ Apps Script ▸ paste this ▸ Deploy ▸ New deployment
 *   ▸ type "Web app" ▸ Execute as: Me ▸ Who has access: Anyone ▸ Deploy ▸ copy the URL.
 *   Paste that URL into SYNC_URL in boletim-diario.html.
 */

// Priscila's "Boletim Diário — Tracking & Master Plan" copy (Productivity & Routine folder).
// Change this if you make a dedicated data sheet.
var SHEET_ID = '1TAcpBw8j1R1nqLTzbmVt4g0EuvAP4ToWtfpMgZmQn-8';
var TAB = 'Feedback';
var HEADERS = ['ts', 'date', 'topic', 'cardId', 'title', 'vote', 'fav'];

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(TAB);
  if (!sh) { sh = ss.insertSheet(TAB); }
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); }
  return sh;
}

function out_(callback, obj) {
  var json = JSON.stringify(obj);
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/** POST: log one feedback event. Body is JSON (sent as text/plain to avoid preflight). */
function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action !== 'feedback') { return out_(null, { ok: false, error: 'bad action' }); }
    var sh = getSheet_();
    sh.appendRow([
      body.ts || new Date().toISOString(),
      body.date || '',
      body.topic || '',
      body.cardId || '',
      body.title || '',
      body.vote || '',
      body.fav ? 'yes' : ''
    ]);
    return out_(null, { ok: true });
  } catch (err) {
    return out_(null, { ok: false, error: String(err) });
  }
}

/** GET: ?action=downvotes&callback=cb → JSONP { ok, down:[{topic,cardId,title}] } */
function doGet(e) {
  var p = (e && e.parameter) || {};
  var cb = p.callback || '';
  if (p.action !== 'downvotes') { return out_(cb, { ok: false, error: 'bad action' }); }
  var sh = getSheet_();
  var rows = sh.getDataRange().getValues();
  var down = [];
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][5]).toLowerCase() === 'down') {
      down.push({ topic: rows[i][2], cardId: rows[i][3], title: rows[i][4] });
    }
  }
  return out_(cb, { ok: true, down: down });
}
