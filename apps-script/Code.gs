/**
 * DESORA — brief quiz receiver.
 *
 * Runs inside the DESORA Google account and owns everything the website must
 * not: the spreadsheet, the Drive folder for uploads, and the notifications.
 * Nothing secret is ever shipped to the browser, because the site only knows
 * this deployment URL, which is a public write-only endpoint like any form
 * action.
 *
 * Setup lives in README.md next to this file. Roughly: paste into
 * script.google.com, fill in CONFIG below, deploy as a Web App with access set
 * to "Anyone", then paste the /exec URL into siteConfig.quizEndpoint.
 */

var CONFIG = {
  // The spreadsheet that collects submissions. Taken from its URL:
  // docs.google.com/spreadsheets/d/<THIS PART>/edit
  SHEET_ID: '1o7iWUti7i5Yftkqz8svVxi2i8DpVAAQbHSUoupRUbsY',
  SHEET_NAME: 'Briefs',

  // Where uploaded logos and photos are stored. Leave blank and the script
  // creates a folder called "DESORA briefs" in your Drive on first run, then
  // reuses it.
  DRIVE_FOLDER_ID: '',

  // WhatsApp notification, in international format, no plus sign or spaces.
  WHATSAPP_NUMBER: '212702243374',

  // CallMeBot API key. See README step 4. Until this is filled in, WhatsApp is
  // skipped and the email below is used instead, which is why the email is not
  // optional.
  CALLMEBOT_APIKEY: '',

  // Always receives a copy when WhatsApp is not configured or fails.
  FALLBACK_EMAIL: 'desoragency@gmail.com',

  // Set true to receive the email on every submission, not only when WhatsApp
  // fails. Recommended: the email carries the full brief, WhatsApp only a ping.
  ALWAYS_EMAIL: true,
};

/**
 * Column order. Add a question to src/lib/quiz.ts, add its id and header here,
 * and it becomes a new column without disturbing the existing ones.
 */
var COLUMNS = [
  ['submitted_at',      'Date'],
  ['quiz_language',     'Langue'],
  ['business_name',     'Nom de l\'entreprise'],
  ['what_you_sell',     'Ce qu\'ils vendent'],
  ['business_type',     'Secteur'],
  ['has_logo',          'A un logo'],
  ['logo_file',         'Logo (fichier)'],
  ['has_colors',        'A des couleurs'],
  ['color_codes',       'Codes couleurs'],
  ['feel',              'Style souhaite'],
  ['mood',              'Ambiance couleurs'],
  ['photo_or_type',     'Photos ou titres'],
  ['best_seller',       'Produit le plus rentable'],
  ['find_you',          'Canaux d\'acquisition'],
  ['contact_methods',   'Moyens de contact'],
  ['form_fields',       'Champs du formulaire'],
  ['pages',             'Pages demandees'],
  ['photos',            'Photos (fichiers)'],
  ['languages',         'Langues'],
  ['default_language',  'Langue par defaut'],
  ['had_site',          'Avait deja un site'],
  ['old_site_url',      'Ancien site'],
  ['old_site_dislike',  'Ce qui n\'allait pas'],
  ['domain',            'Nom de domaine'],
  ['budget',            'Budget'],
  ['timeline',          'Delai'],
  ['anything_else',     'Autre chose'],
  ['phone',             'Telephone WhatsApp'],
  ['files',             'Fichiers'],
];

/* -------------------------------------------------------------------------- */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var answers = payload.answers || {};

    var folder = getFolder_();
    var links = saveFiles_(payload.files || [], folder, answers.business_name || 'sans-nom');

    answers.submitted_at = Utilities.formatDate(new Date(), 'Africa/Casablanca', 'yyyy-MM-dd HH:mm');
    answers.quiz_language = payload.quiz_language || '';
    answers.files = links.join('\n');

    // File questions show the Drive link in their own column too, so the sheet
    // reads naturally left to right.
    links.forEach(function (link) {
      if (link.indexOf('logo') !== -1 && !answers.logo_file) answers.logo_file = link;
    });

    appendRow_(answers);
    notify_(answers, links);

    return json_({ ok: true });
  } catch (err) {
    // Never fail silently: if the sheet write breaks, the brief still reaches
    // an inbox rather than vanishing.
    try {
      MailApp.sendEmail(
        CONFIG.FALLBACK_EMAIL,
        'DESORA brief — erreur de traitement',
        'Une soumission est arrivee mais n\'a pas pu etre enregistree.\n\n' +
          'Erreur: ' + err + '\n\nDonnees brutes:\n' + (e && e.postData ? e.postData.contents : '(vide)')
      );
    } catch (_) {}
    return json_({ ok: false, error: String(err) });
  }
}

/** Apps Script cannot answer a CORS preflight, which is why the site posts as
 *  text/plain. This exists so a GET to the URL confirms the deployment is live. */
function doGet() {
  return json_({ ok: true, service: 'DESORA brief receiver' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* --------------------------------------------------------------- spreadsheet */

function appendRow_(answers) {
  var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);

  // Write the header row once, then freeze and style it so the sheet is
  // readable the moment the first brief lands.
  if (sheet.getLastRow() === 0) {
    var headers = COLUMNS.map(function (c) { return c[1]; });
    sheet.appendRow(headers);
    var head = sheet.getRange(1, 1, 1, headers.length);
    head.setFontWeight('bold');
    head.setBackground('#710014');
    head.setFontColor('#F2F1ED');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, headers.length, 170);
  }

  var row = COLUMNS.map(function (c) {
    var v = answers[c[0]];
    return v === undefined || v === null ? '' : String(v);
  });
  sheet.appendRow(row);
}

/* --------------------------------------------------------------------- files */

function getFolder_() {
  if (CONFIG.DRIVE_FOLDER_ID) return DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  var existing = DriveApp.getFoldersByName('DESORA briefs');
  return existing.hasNext() ? existing.next() : DriveApp.createFolder('DESORA briefs');
}

function saveFiles_(files, parent, clientName) {
  if (!files.length) return [];

  // One subfolder per client keeps a year of briefs navigable.
  var stamp = Utilities.formatDate(new Date(), 'Africa/Casablanca', 'yyyy-MM-dd HHmm');
  var sub = parent.createFolder(stamp + ' — ' + clientName);

  return files.map(function (f) {
    var blob = Utilities.newBlob(
      Utilities.base64Decode(f.data),
      f.type || 'application/octet-stream',
      f.question + '-' + f.name
    );
    var saved = sub.createFile(blob);
    // Anyone with the link can view, so the URL in the sheet is clickable
    // without a permission request every time.
    saved.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return saved.getUrl();
  });
}

/* -------------------------------------------------------------- notification */

function notify_(answers, links) {
  var summary =
    'Nouveau brief DESORA\n\n' +
    'Entreprise : ' + (answers.business_name || '?') + '\n' +
    'Activite : ' + (answers.what_you_sell || '?') + '\n' +
    'Style : ' + (answers.feel || '?') + ' / ' + (answers.mood || '?') + '\n' +
    'Budget : ' + (answers.budget || '?') + '\n' +
    'Delai : ' + (answers.timeline || '?') + '\n' +
    'Telephone : ' + (answers.phone || '?') + '\n' +
    (links.length ? '\nFichiers : ' + links.length : '');

  var whatsappOk = sendWhatsApp_(summary);

  if (!whatsappOk || CONFIG.ALWAYS_EMAIL) {
    var body = summary + '\n\n— Detail complet —\n\n';
    COLUMNS.forEach(function (c) {
      if (answers[c[0]]) body += c[1] + ' : ' + answers[c[0]] + '\n';
    });
    if (links.length) body += '\nFichiers :\n' + links.join('\n');
    if (!whatsappOk) body += '\n\n(Notification WhatsApp indisponible, cet e-mail la remplace.)';

    MailApp.sendEmail(
      CONFIG.FALLBACK_EMAIL,
      'Nouveau brief — ' + (answers.business_name || 'sans nom'),
      body
    );
  }
}

/**
 * WhatsApp via CallMeBot. Returns false rather than throwing, so a notification
 * problem can never lose a submission that is already safely in the sheet.
 */
function sendWhatsApp_(text) {
  if (!CONFIG.CALLMEBOT_APIKEY || !CONFIG.WHATSAPP_NUMBER) return false;
  try {
    var url =
      'https://api.callmebot.com/whatsapp.php' +
      '?phone=' + encodeURIComponent('+' + CONFIG.WHATSAPP_NUMBER) +
      '&text=' + encodeURIComponent(text) +
      '&apikey=' + encodeURIComponent(CONFIG.CALLMEBOT_APIKEY);
    var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    return res.getResponseCode() === 200;
  } catch (err) {
    return false;
  }
}

/* ---------------------------------------------------------------------- test */

/** Run this once from the editor to confirm the sheet, the folder, the email
 *  and WhatsApp all work, without going through the website. */
function testSubmission() {
  var fake = {
    quiz_language: 'fr',
    answers: {
      business_name: 'Test DESORA',
      what_you_sell: 'Verification de la configuration',
      feel: 'premium',
      mood: 'dark',
      budget: '6000',
      timeline: 'month',
      phone: '0600000000',
    },
    files: [],
  };
  var out = doPost({ postData: { contents: JSON.stringify(fake) } });
  Logger.log(out.getContent());
}
