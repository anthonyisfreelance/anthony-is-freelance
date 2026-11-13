/**
 * Anthony is Freelance: documents bridge.
 *
 * A Google Apps Script web app that runs as Anthony, so the website's client documents live in his
 * Google Drive and client emails go out from his own Gmail. The website worker (worker/docs/bridge.js)
 * calls it with a shared key.
 *
 * Set up once:
 *   1. script.google.com > New project, paste this file in as Code.gs.
 *   2. Project Settings > Script properties > add BRIDGE_KEY (the same value as the worker's BRIDGE_KEY).
 *      (Or fill KEY_FALLBACK below in your own copy. Never commit a real key to the public repo.)
 *   3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone. Authorise.
 *   4. Copy the web app URL (ends in /exec) into the worker's BRIDGE_URL.
 *
 * Data: one JSON file per document in DATA_FOLDER, named "<name> [<token>].json", plus settings.json
 * (bank details and Anthony's signature).
 */

var KEY_FALLBACK = '';

var DATA_FOLDER = '1tyN5UT5nsB9Il9Ezt4b3TCgZ_wCNDEFm'; // Anthonyis Management > Website documents data
var FOLDERS = {
  quote: '1sJEQSnsJMW_iWaey8Lf5qbJZSiaUVNOl',     // Anthonyis Management > Quotes
  contract: '1tweE1uZvTyjvMX-H6B5_NxMZ56R8jjP5',  // Anthonyis Management > Contracts (signed ones go in "Signed")
  invoice: '1aizO2WjsPB7JNwireePQs-vTYb57hXt3',   // Anthonyis Management > Invoices (by tax year, "26:27")
};
var SEND_FROM = 'hello@anthonyis.uk';
var SENDER_NAME = 'Anthony Bliss';

function doGet() {
  return out({ ok: true, service: 'Anthony is Freelance documents bridge' });
}

function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    var key = PropertiesService.getScriptProperties().getProperty('BRIDGE_KEY') || KEY_FALLBACK;
    if (!key || req.key !== key) return out({ ok: false, error: 'Not allowed' });
    var fn = ACTIONS[req.action];
    if (!fn) return out({ ok: false, error: 'Unknown action: ' + req.action });
    var result = fn(req) || {};
    result.ok = true;
    return out(result);
  } catch (err) {
    return out({ ok: false, error: String((err && err.message) || err) });
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

var ACTIONS = {
  get: function (req) {
    var f = findDocFile(req.token);
    return { doc: f ? JSON.parse(f.getBlob().getDataAsString()) : null };
  },

  put: function (req) {
    var f = findDocFile(req.token);
    if (!f) throw new Error('Document not found');
    f.setContent(JSON.stringify(req.doc, null, 2));
    return {};
  },

  create: function (req) {
    var name = (req.name || req.doc.number || 'Document') + ' [' + req.doc.token + '].json';
    var f = DriveApp.getFolderById(DATA_FOLDER).createFile(name, JSON.stringify(req.doc, null, 2), 'application/json');
    PropertiesService.getScriptProperties().setProperty('doc:' + req.doc.token, f.getId());
    return { id: f.getId() };
  },

  // Every document, without the heavy parts (signature images, signed snapshots).
  list: function () {
    var docs = [];
    var it = DriveApp.getFolderById(DATA_FOLDER).getFiles();
    while (it.hasNext()) {
      var f = it.next();
      var name = f.getName();
      if (name === 'settings.json' || !/\.json$/.test(name)) continue;
      try {
        var d = JSON.parse(f.getBlob().getDataAsString());
        if (d.state) {
          delete d.state.contractHtml;
          if (d.state.signature) delete d.state.signature.image;
        }
        d.updated = f.getLastUpdated().toISOString();
        docs.push(d);
      } catch (err) {
        // Skip a file that isn't valid JSON.
      }
    }
    return { docs: docs };
  },

  settings: function () {
    var it = DriveApp.getFolderById(DATA_FOLDER).getFilesByName('settings.json');
    return { settings: it.hasNext() ? JSON.parse(it.next().getBlob().getDataAsString()) : {} };
  },

  // kind: quote | contract | invoice. Replaces a file of the same name in the same folder.
  savePdf: function (req) {
    var folder = DriveApp.getFolderById(FOLDERS[req.kind]);
    if (req.kind === 'invoice') folder = subfolder(folder, taxYear(req.date || today()));
    if (req.kind === 'contract') folder = subfolder(folder, 'Signed');
    var old = folder.getFilesByName(req.name);
    while (old.hasNext()) old.next().setTrashed(true);
    var blob = Utilities.newBlob(Utilities.base64Decode(req.base64), 'application/pdf', req.name);
    var f = folder.createFile(blob);
    return { id: f.getId(), url: f.getUrl() };
  },

  // Sends from Anthony's Gmail (from hello@anthonyis.uk when it's set up as a Send-as address).
  email: function (req) {
    var opts = { name: SENDER_NAME };
    if (req.html) opts.htmlBody = req.html;
    if (GmailApp.getAliases().indexOf(SEND_FROM) !== -1) opts.from = SEND_FROM;
    if (req.cc && req.cc.length) opts.cc = req.cc.join(',');
    if (req.attachments && req.attachments.length) {
      opts.attachments = req.attachments.map(function (a) { return DriveApp.getFileById(a.fileId).getBlob(); });
    }
    GmailApp.sendEmail(req.to.join(','), req.subject, req.text, opts);
    return {};
  },

  // The next invoice number for a client, from invoices already in Drive and drafts in the data folder.
  nextInvoice: function (req) {
    var norm = function (s) { return String(s).replace(/[^a-z0-9]/gi, '').toLowerCase(); };
    var want = norm(req.client);
    var max = 0;
    var check = function (name) {
      var m = /^Anthonyis_(.+?)_Invoice_(\d+)/i.exec(name);
      if (m && norm(m[1]) === want) max = Math.max(max, Number(m[2]));
    };
    var walk = function (folder) {
      var files = folder.getFiles();
      while (files.hasNext()) check(files.next().getName());
      var subs = folder.getFolders();
      while (subs.hasNext()) walk(subs.next());
    };
    walk(DriveApp.getFolderById(FOLDERS.invoice));
    var data = DriveApp.getFolderById(DATA_FOLDER).getFiles();
    while (data.hasNext()) check(data.next().getName());
    return { next: max + 1 };
  },
};

function findDocFile(token) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token || '')) return null;
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('doc:' + token);
  if (id) {
    try {
      var cached = DriveApp.getFileById(id);
      if (!cached.isTrashed()) return cached;
    } catch (err) {
      // Fall through to a fresh search.
    }
  }
  var it = DriveApp.getFolderById(DATA_FOLDER).getFiles();
  var tag = '[' + token + ']';
  while (it.hasNext()) {
    var f = it.next();
    if (f.getName().indexOf(tag) !== -1) {
      props.setProperty('doc:' + token, f.getId());
      return f;
    }
  }
  return null;
}

function subfolder(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

// Company tax year ends 31 January: 10 Nov 2026 is in "26:27".
function taxYear(iso) {
  var y = Number(iso.slice(0, 4));
  var m = Number(iso.slice(5, 7));
  var start = m >= 2 ? y : y - 1;
  var two = function (n) { return ('0' + (n % 100)).slice(-2); };
  return two(start) + ':' + two(start + 1);
}

function today() {
  return Utilities.formatDate(new Date(), 'Europe/London', 'yyyy-MM-dd');
}

// Run once from the editor to check the setup: lists the documents it can see.
function testSetup() {
  Logger.log(JSON.stringify(ACTIONS.list().docs.map(function (d) { return d.number; })));
  Logger.log('Next HappyThreads invoice: ' + ACTIONS.nextInvoice({ client: 'HappyThreads' }).next);
  Logger.log('Sending from: ' + (GmailApp.getAliases().indexOf(SEND_FROM) !== -1 ? SEND_FROM : Session.getActiveUser().getEmail()));
}
