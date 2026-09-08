import { randomInt } from 'node:crypto';

/**
 * Reference de demande.
 *
 * Elle est lue a voix haute par un client agé au telephone et recopiee a la
 * main par le personnel. L'alphabet exclut donc les caracteres qui se
 * confondent : 0/O, 1/I/L, 5/S, 8/B. Le format reste court et groupe.
 *
 * Format : CC22-AAAAMMJJ-XXXXX
 */
const ALPHABET = '234679ACDEFGHJKMNPQRTUVWXYZ';

export function generateReference({ now = new Date(), suffixLength = 5 } = {}) {
  const day = now.toISOString().slice(0, 10).replace(/-/g, '');
  let suffix = '';
  for (let i = 0; i < suffixLength; i += 1) {
    suffix += ALPHABET[randomInt(0, ALPHABET.length)];
  }
  return `CC22-${day}-${suffix}`;
}

/**
 * Genere une reference absente du magasin.
 * La collision est improbable mais pas impossible ; la traiter coute trois
 * lignes, la subir coute une demande ecrasee.
 */
export function generateUniqueReference(exists, options = {}) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const reference = generateReference(options);
    if (!exists(reference)) return reference;
  }
  throw new Error('impossible de generer une reference unique');
}

export function isValidReference(value) {
  return typeof value === 'string' && /^CC22-\d{8}-[234679ACDEFGHJKMNPQRTUVWXYZ]{5}$/.test(value);
}
