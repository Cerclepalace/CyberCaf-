import { ValidationError } from '../core/validate.js';

/**
 * Lecteur CSV sans dependance.
 *
 * Gere les guillemets, les guillemets echappes, les separateurs dans les
 * champs, CRLF et le BOM. Le fichier importe est traite comme non fiable :
 * taille, nombre de lignes, nombre de colonnes et longueur de champ sont
 * bornes, faute de quoi un fichier de quelques megaoctets peut immobiliser le
 * processus.
 *
 * TODO TERRAIN : le separateur reel depend de l'export du logiciel de caisse.
 * Il est detecte sur la premiere ligne, et peut etre force par l'appelant.
 */

export const CSV_LIMITS = {
  maxBytes: 5 * 1024 * 1024,
  maxRows: 50000,
  maxColumns: 64,
  maxFieldLength: 1000,
};

const CANDIDATE_DELIMITERS = [';', ',', '\t', '|'];

/** Detecte le separateur le plus probable sur la premiere ligne non vide. */
export function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim().length > 0) || '';
  let best = ';';
  let bestCount = -1;
  for (const candidate of CANDIDATE_DELIMITERS) {
    const count = firstLine.split(candidate).length - 1;
    if (count > bestCount) {
      best = candidate;
      bestCount = count;
    }
  }
  return bestCount > 0 ? best : ';';
}

/**
 * @param {string} text
 * @param {{delimiter?: string, limits?: typeof CSV_LIMITS}} [options]
 * @returns {{headers: string[], rows: Record<string,string>[]}}
 */
export function parseCsv(text, { delimiter, limits = CSV_LIMITS } = {}) {
  if (typeof text !== 'string') throw new ValidationError('le contenu CSV doit etre une chaine', 'content');
  if (Buffer.byteLength(text, 'utf8') > limits.maxBytes) {
    throw new ValidationError(`fichier trop volumineux (max ${limits.maxBytes} octets)`, 'content');
  }

  const clean = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const sep = delimiter || detectDelimiter(clean);

  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;

  const pushField = () => {
    if (field.length > limits.maxFieldLength) {
      throw new ValidationError(`champ trop long (max ${limits.maxFieldLength} caracteres)`, 'content');
    }
    row.push(field);
    field = '';
    if (row.length > limits.maxColumns) {
      throw new ValidationError(`trop de colonnes (max ${limits.maxColumns})`, 'content');
    }
  };

  const pushRow = () => {
    // Une ligne vide n'est pas une donnee : on l'ignore plutot que de produire
    // un enregistrement fantome.
    if (row.length === 1 && row[0].trim() === '') {
      row = [];
      return;
    }
    rows.push(row);
    row = [];
    if (rows.length > limits.maxRows) {
      throw new ValidationError(`trop de lignes (max ${limits.maxRows})`, 'content');
    }
  };

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];

    if (inQuotes) {
      if (char === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"' && field.length === 0) {
      inQuotes = true;
    } else if (char === sep) {
      pushField();
    } else if (char === '\n') {
      pushField();
      pushRow();
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (inQuotes) throw new ValidationError('guillemet non ferme dans le fichier CSV', 'content');
  if (field.length > 0 || row.length > 0) {
    pushField();
    pushRow();
  }

  if (rows.length === 0) return { headers: [], rows: [] };

  const headers = rows[0].map((header) => header.trim());
  const seen = new Set();
  for (const header of headers) {
    if (header !== '' && seen.has(header)) {
      throw new ValidationError(`colonne dupliquee : ${header}`, 'content');
    }
    seen.add(header);
  }

  const dataRows = rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      if (header !== '') record[header] = (values[index] ?? '').trim();
    });
    return record;
  });

  return { headers, rows: dataRows };
}
