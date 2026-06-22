/**
 * Real Estate Quiz — cross-device progress sync backend.
 * Bound to the private "Progress Sync" sheet. Deploy as a Web App (Execute as: Me,
 * Who has access: Anyone). The quiz POSTs answers/sessions and reads state via JSONP.
 *
 * SAFETY: this only ever INCREMENTS per-question counts and APPENDS sessions.
 * It never deletes. The quiz merges with MAX(local, server) so progress can't shrink.
 */
var SHEET_ID = '1GyA77oaLZgG1t82vjrMgCcoP7pglctaNkwns0YR_84Y';

function doGet(e) {
  var data = _readState();
  var cb = e && e.parameter && e.parameter.callback;
  if (cb) return ContentService.createTextOutput(cb + '(' + JSON.stringify(data) + ')')
                               .setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(JSON.stringify(data))
                       .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    if (Array.isArray(body)) _applyAnswers(ss, body);
    else if (body && body.session) _appendSession(ss, body.session);
    else if (body && body.answers) _applyAnswers(ss, body.answers);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function _readState() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var st = ss.getSheetByName('state').getDataRange().getValues();
  var hist = {};
  for (var i = 1; i < st.length; i++) {
    var r = st[i]; if (!r[0]) continue;
    hist[r[0]] = { s:+r[1]||0, w:+r[2]||0, weak:+r[3]||0, rec:+r[4]||0, last:+r[5]||0, t:+r[6]||0 };
  }
  var se = ss.getSheetByName('sessions').getDataRange().getValues();
  var sessions = [];
  for (var j = 1; j < se.length; j++) {
    var s = se[j]; if (!s[0]) continue;
    sessions.push({ t:+s[0]||0, n:+s[1]||0, r:+s[2]||0, exam: s[3]===true||s[3]==='TRUE', retry: s[4]===true||s[4]==='TRUE' });
  }
  return { hist: hist, sessions: sessions };
}

function _applyAnswers(ss, recs) {
  var sh = ss.getSheetByName('state');
  var vals = sh.getDataRange().getValues();
  var idx = {};
  for (var i = 1; i < vals.length; i++) if (vals[i][0]) idx[vals[i][0]] = i;
  recs.forEach(function (a) {
    var qid = a.questionId || a.qid; if (!qid) return;
    var correct = (a.isCorrect !== undefined) ? a.isCorrect : a.correct;
    var isRetry = (a.attemptNumber === 2) || a.isRetry === true;
    var recovered = a.recoveredOnFinalAttempt || a.recovered;
    var row;
    if (idx[qid] != null) row = vals[idx[qid]];
    else { row = [qid, 0, 0, 0, 0, 0, 0]; vals.push(row); idx[qid] = vals.length - 1; }
    row[1] = (+row[1] || 0) + 1;
    if (!correct) { row[2] = (+row[2] || 0) + 1; if (isRetry) row[3] = (+row[3] || 0) + 1; }
    if (recovered) row[4] = (+row[4] || 0) + 1;
    row[5] = correct ? 1 : 0;
    row[6] = a.ts || (new Date()).getTime();
  });
  var out = vals.slice(1).filter(function (r) { return r[0]; });
  if (out.length) sh.getRange(2, 1, out.length, 7).setValues(out);
}

function _appendSession(ss, s) {
  ss.getSheetByName('sessions').appendRow([
    s.t || s.ts || (new Date()).getTime(), s.n || 0, s.r || 0, !!s.exam, !!s.retry, s.device || ''
  ]);
}
