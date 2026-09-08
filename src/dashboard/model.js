import { asEnum, asId, asIsoDay, asNumber, asString, ValidationError } from '../core/validate.js';

/**
 * Modele de donnees canonique du tableau de bord.
 *
 * Volontairement abstrait : il ne decrit pas le systeme de caisse du
 * cybercafe, qui est inconnu. Il decrit ce qu'un tableau de bord a besoin de
 * savoir pour afficher une activite, quelle qu'en soit la source.
 *
 * TODO TERRAIN : la liste des categories reelles depend des prestations
 * vendues sur place. `other` sert de reservoir tant qu'elles ne sont pas
 * observees. Le rattachement des libelles reels a ces categories se fait par
 * configuration (`categoryMap` du normaliseur), jamais dans le code.
 */

/** @typedef {'print'|'copy'|'scan'|'session'|'other'} ActivityCategory */
export const CATEGORIES = ['print', 'copy', 'scan', 'session', 'other'];

/** @typedef {'page'|'minute'|'item'} ActivityUnit */
export const UNITS = ['page', 'minute', 'item'];

export const CATEGORY_LABELS = {
  print: 'Impressions',
  copy: 'Photocopies',
  scan: 'Scans',
  session: 'Sessions',
  other: 'Autres',
};

export const UNIT_LABELS = { page: 'pages', minute: 'minutes', item: 'unites' };

/**
 * @typedef {object} ActivityRecord
 * @property {string} day          Jour calendaire AAAA-MM-JJ
 * @property {ActivityCategory} category
 * @property {number} quantity     Volume, toujours positif ou nul
 * @property {ActivityUnit} unit
 * @property {number|null} amount  Montant en euros. `null` au niveau E0
 * @property {string} source       Adaptateur d'origine, pour la tracabilite
 */

/**
 * Valide un enregistrement candidat.
 *
 * @param {unknown} raw
 * @param {{recordingLevel: 'E0'|'E1', source: string}} context
 * @returns {ActivityRecord}
 */
export function toActivityRecord(raw, { recordingLevel, source }) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ValidationError('enregistrement invalide', 'record');
  }

  const record = {
    day: asIsoDay(raw.day, 'day'),
    category: asEnum(raw.category, 'category', CATEGORIES),
    quantity: asNumber(raw.quantity, 'quantity', { min: 0, max: 1000000 }),
    unit: asEnum(raw.unit, 'unit', UNITS),
    amount: null,
    source: asId(source, 'source'),
  };

  const hasAmount = raw.amount !== undefined && raw.amount !== null && raw.amount !== '';
  if (hasAmount) {
    // Garde-fou reglementaire applique par le code, pas seulement par la
    // documentation : au niveau E0 le systeme refuse tout montant. Il ne le
    // supprime pas en silence, il rejette la ligne, pour que le rejet soit
    // visible dans le rapport d'import.
    if (recordingLevel !== 'E1') {
      throw new ValidationError(
        "un montant est present alors que le niveau d'enregistrement est E0 (volumes seuls)",
        'amount',
      );
    }
    record.amount = asNumber(raw.amount, 'amount', { min: 0, max: 1000000 });
  }

  return record;
}

/** Etiquette lisible d'une categorie, sans jamais renvoyer un libelle brut non valide. */
export function categoryLabel(category) {
  return CATEGORY_LABELS[category] || CATEGORY_LABELS.other;
}

/** Verifie qu'une chaine est un identifiant de categorie connu. */
export function isKnownCategory(value) {
  return typeof value === 'string' && CATEGORIES.includes(value);
}

export { asString };
