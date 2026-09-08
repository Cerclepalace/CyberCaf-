/**
 * Primitives de validation.
 *
 * Toute donnee entrant dans le systeme est traitee comme non fiable :
 * fichiers importes, evenements recus, URL configurees, corps de requete.
 * Ces fonctions renvoient une valeur propre ou levent une ValidationError ;
 * elles ne « reparent » jamais silencieusement une entree douteuse.
 */

export class ValidationError extends Error {
  /** @param {string} message @param {string} field */
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

const MAX_STRING = 2000;

/**
 * Les caracteres de controle n'ont aucune raison d'etre presents : ils cassent
 * l'affichage et permettent d'injecter de fausses lignes dans les journaux.
 * Teste par code de caractere plutot que par expression reguliere, pour que le
 * fichier source ne contienne lui-meme aucun caractere de controle.
 */
export function hasControlChars(text) {
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (code < 32 || code === 127) return true;
  }
  return false;
}

export function asString(value, field, { max = MAX_STRING, min = 1, trim = true } = {}) {
  if (typeof value !== 'string') throw new ValidationError(`${field} doit etre une chaine`, field);
  const out = trim ? value.trim() : value;
  if (out.length < min) throw new ValidationError(`${field} est vide`, field);
  if (out.length > max) throw new ValidationError(`${field} depasse ${max} caracteres`, field);
  if (hasControlChars(out)) {
    throw new ValidationError(`${field} contient des caracteres de controle`, field);
  }
  return out;
}

export function asEnum(value, field, allowed) {
  const s = asString(value, field, { max: 64 });
  if (!allowed.includes(s)) {
    throw new ValidationError(`${field} doit valoir : ${allowed.join(', ')}`, field);
  }
  return s;
}

export function asNumber(value, field, { min = -Infinity, max = Infinity, integer = false } = {}) {
  const n = typeof value === 'string' ? Number(value.replace(',', '.').trim()) : value;
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new ValidationError(`${field} doit etre un nombre fini`, field);
  }
  if (integer && !Number.isInteger(n)) throw new ValidationError(`${field} doit etre entier`, field);
  if (n < min || n > max) throw new ValidationError(`${field} doit etre entre ${min} et ${max}`, field);
  return n;
}

/** Identifiant technique : sert de cle, jamais affiche comme du texte libre. */
export function asId(value, field, { max = 64 } = {}) {
  const s = asString(value, field, { max });
  if (!/^[a-zA-Z0-9._:-]+$/.test(s)) {
    throw new ValidationError(`${field} ne peut contenir que lettres, chiffres, . _ : -`, field);
  }
  return s;
}

/** Jour calendaire ISO (AAAA-MM-JJ), sans heure ni fuseau. */
export function asIsoDay(value, field) {
  const s = asString(value, field, { max: 10, min: 10 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    throw new ValidationError(`${field} doit etre au format AAAA-MM-JJ`, field);
  }
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) {
    throw new ValidationError(`${field} n'est pas une date valide`, field);
  }
  return s;
}

/** Horodatage ISO complet, normalise en UTC. */
export function asIsoTimestamp(value, field) {
  const s = asString(value, field, { max: 40 });
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new ValidationError(`${field} n'est pas un horodatage valide`, field);
  return d.toISOString();
}

/**
 * URL de raccourci.
 *
 * Refuse tout ce qui n'est pas http/https. Les schemes javascript:, data:,
 * file: et vbscript: sont des vecteurs connus sur un poste public. Refuse aussi
 * les identifiants integres a l'URL.
 */
export function asHttpUrl(value, field, { max = 2048 } = {}) {
  const s = asString(value, field, { max });
  let url;
  try {
    url = new URL(s);
  } catch {
    throw new ValidationError(`${field} n'est pas une URL valide`, field);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new ValidationError(`${field} doit commencer par http:// ou https://`, field);
  }
  if (url.username || url.password) {
    throw new ValidationError(`${field} ne doit pas contenir d'identifiants`, field);
  }
  return url.toString();
}

export function asPlainObject(value, field) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError(`${field} doit etre un objet`, field);
  }
  return value;
}

export function asArray(value, field, { max = 10000 } = {}) {
  if (!Array.isArray(value)) throw new ValidationError(`${field} doit etre une liste`, field);
  if (value.length > max) throw new ValidationError(`${field} depasse ${max} elements`, field);
  return value;
}
