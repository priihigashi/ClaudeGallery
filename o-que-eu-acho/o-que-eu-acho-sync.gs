/**
 * O que eu acho — fact-check pessoal — backend (Google Apps Script)
 * Self-contained: cria e gerencia a PRÓPRIA planilha (não precisa criar sheet na mão).
 * Modeled on study-sync / boletim-sync (JSONP read + POST write, senha pri123).
 *
 *   doGet ?action=list&pass=pri123&callback=cb  -> JSONP { ok, items:[...] }
 *   doPost {action:'add', pass:'pri123', ...campos}  -> grava 1 linha
 *
 * DEPLOY (1 vez): Apps Script novo -> cola este código -> Deploy -> New deployment
 *   -> Web app -> Execute as: Me -> Who has access: Anyone -> Deploy -> copia a URL.
 *   Cola a URL em SYNC_URL no o-que-eu-acho.html.
 */
var PASS = 'pri123';
var PROP = 'oqea_sheet_id';
var TAB = 'Fact-checks';
var HEADERS = ['id','ts','verdict','pct','afirma','pensa','s1','d1','s2','d2','s3','d3','concl'];

function ssId_() {
  var p = PropertiesService.getScriptProperties();
  var id = p.getProperty(PROP);
  if (!id) {
    var ss = SpreadsheetApp.create('O que eu acho — Fact-checks (DB)');
    id = ss.getId();
    p.setProperty(PROP, id);
  }
  return id;
}

function getSheet_() {
  var ss = SpreadsheetApp.openById(ssId_());
  var sh = ss.getSheetByName(TAB);
  if (!sh) { sh = ss.insertSheet(TAB); }
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); }
  return sh;
}

function out_(cb, obj) {
  var j = JSON.stringify(obj);
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + j + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(j).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (b.action !== 'add') { return out_(null, { ok: false, error: 'bad action' }); }
    if (b.pass !== PASS) { return out_(null, { ok: false, error: 'bad pass' }); }
    var sh = getSheet_();
    sh.appendRow([
      b.id || ('e' + new Date().getTime()),
      b.ts || new Date().toISOString(),
      b.verdict || '', b.pct || '', b.afirma || '', b.pensa || '',
      b.s1 || '', b.d1 || '', b.s2 || '', b.d2 || '', b.s3 || '', b.d3 || '',
      b.concl || ''
    ]);
    return out_(null, { ok: true });
  } catch (err) {
    return out_(null, { ok: false, error: String(err) });
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  var cb = p.callback || '';
  if (p.action !== 'list') { return out_(cb, { ok: false, error: 'bad action' }); }
  if (p.pass !== PASS) { return out_(cb, { ok: false, error: 'bad pass' }); }
  var sh = getSheet_();
  var rows = sh.getDataRange().getValues();
  var items = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i], o = {};
    for (var c = 0; c < HEADERS.length; c++) {
      o[HEADERS[c]] = (r[c] instanceof Date) ? r[c].toISOString() : r[c];
    }
    items.push(o);
  }
  return out_(cb, { ok: true, items: items });
}
