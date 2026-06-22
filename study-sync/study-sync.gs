/**
 * Study Progress Sync — shared backend for the citizenship + real-estate study quizzes.
 *
 * Snapshot model: ONE row per profile in a Google Sheet in YOUR Drive, overwritten on
 * each save (it never accumulates). Separate columns per app, so a single sheet serves
 * both quizzes — no cluster of spreadsheets. Reads use JSONP (Apps Script can't send CORS
 * headers); writes use POST. Each profile is gated by a passphrase (stored only as a hash).
 *
 * DEPLOY (one time):
 *   1. script.google.com → New project → paste this file (replace the default code).
 *   2. Deploy → New deployment → type: Web app.
 *   3. Execute as: Me.   Who has access: Anyone.
 *   4. Deploy → Authorize access → allow.
 *   5. Copy the Web app URL (ends in /exec) and paste it into the quiz's Sync box.
 * On first save it auto-creates a sheet called "Study Progress Sync" in your Drive.
 */

var SHEET_TITLE = 'Study Progress Sync';
var TAB = 'Sync';
var HEADERS = ['profile', 'passHash', 'updated', 'citizenship', 'realestate'];

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { id = null; } }
  if (!ss) { ss = SpreadsheetApp.create(SHEET_TITLE); props.setProperty('SHEET_ID', ss.getId()); }
  var sh = ss.getSheetByName(TAB);
  if (!sh) { sh = ss.insertSheet(TAB); sh.appendRow(HEADERS); }
  return sh;
}

function hash_(s) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s || ''));
  return raw.map(function (b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
}

function findRow_(sh, profile) {
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) { if (String(data[i][0]) === String(profile)) return i + 1; }
  return -1;
}

function appCol_(app) { return app === 'realestate' ? 5 : 4; } // 1-based: 4=citizenship, 5=realestate

function out_(callback, obj) {
  var body = (callback ? callback + '(' : '') + JSON.stringify(obj) + (callback ? ')' : '');
  return ContentService.createTextOutput(body)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  var cb = p.callback || '';
  try {
    if (p.action !== 'load') return out_(cb, { ok: false, error: 'bad action' });
    var profile = p.profile || '', pass = p.pass || '', app = p.app || 'citizenship';
    if (!profile) return out_(cb, { ok: false, error: 'no profile' });
    var sh = getSheet_(), row = findRow_(sh, profile);
    if (row < 0) return out_(cb, { ok: true, blob: '', empty: true }); // new profile
    var vals = sh.getRange(row, 1, 1, HEADERS.length).getValues()[0];
    if (vals[1] && vals[1] !== hash_(pass)) return out_(cb, { ok: false, error: 'bad passphrase' });
    var blob = sh.getRange(row, appCol_(app)).getValue();
    return out_(cb, { ok: true, blob: blob || '', updated: vals[2] });
  } catch (err) { return out_(cb, { ok: false, error: String(err) }); }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.action !== 'save') return out_('', { ok: false, error: 'bad action' });
    var profile = data.profile || '', pass = data.pass || '', app = data.app || 'citizenship', blob = data.blob || '';
    if (!profile) return out_('', { ok: false, error: 'no profile' });
    var sh = getSheet_(), row = findRow_(sh, profile), ph = hash_(pass);
    if (row < 0) { sh.appendRow([profile, ph, '', '', '']); row = sh.getLastRow(); }
    else {
      var existing = sh.getRange(row, 2).getValue();
      if (existing && existing !== ph) return out_('', { ok: false, error: 'bad passphrase' });
      if (!existing) sh.getRange(row, 2).setValue(ph);
    }
    sh.getRange(row, appCol_(app)).setValue(blob);
    sh.getRange(row, 3).setValue(new Date().toISOString());
    return out_('', { ok: true });
  } catch (err) { return out_('', { ok: false, error: String(err) }); }
}
