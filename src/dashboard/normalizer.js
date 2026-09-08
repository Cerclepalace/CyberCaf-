import { toActivityRecord, CATEGORIES } from './model.js';
import { ValidationError } from '../core/validate.js';

/**
 * Normaliseur.
 *
 * Transforme des lignes brutes, de forme inconnue, en enregistrements
 * canoniques. Le rattachement entre les colonnes reelles et le modele passe
 * par une configuration de correspondance : rien n'est devine.
 *
 * Une ligne invalide n'interrompt pas l'import et n'est pas corrigee : elle est
 * rejetee avec un motif. Un import qui rejette la moitie de ses lignes doit se
 * voir, pas se rattraper en silence.
 *
 * TODO TERRAIN : la correspondance reelle sera ecrite une fois l'export du
 * logiciel de caisse observe.
 */

/**
 * @typedef {object} FieldMapping
 * @property {string} day       Nom de la colonne contenant la date
 * @property {string} category  Nom de la colonne contenant le type de prestation
 * @property {string} quantity  Nom de la colonne contenant le volume
 * @property {string} [unit]    Nom de la colonne d'unite, sinon `defaultUnit`
 * @property {string} [amount]  Nom de la colonne de montant. Ignoree au niveau E0
 */

/**
 * @typedef {object} MappingConfig
 * @property {FieldMapping} columns
 * @property {Record<string,string>} [categoryMap] libelle reel -> categorie canonique
 * @property {'page'|'minute'|'item'} [defaultUnit]
 * @property {'iso'|'fr'|'auto'} [dateFormat]
 */

export const DEFAULT_MAPPING = {
  columns: { day: 'date', category: 'categorie', quantity: 'quantite', unit: 'unite', amount: 'montant' },
  categoryMap: {},
  defaultUnit: 'item',
  dateFormat: 'auto',
};

/** Convertit une date en jour ISO. Aucune tolerance sur les formats ambigus. */
export function normalizeDay(value, format = 'auto') {
  if (typeof value !== 'string') throw new ValidationError('date manquante', 'day');
  const raw = value.trim();

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso && (format === 'iso' || format === 'auto')) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const fr = raw.match(/^(\d{2})[/.](\d{2})[/.](\d{4})/);
  if (fr && (format === 'fr' || format === 'auto')) return `${fr[3]}-${fr[2]}-${fr[1]}`;

  throw new ValidationError(`date non reconnue : ${raw.slice(0, 32)}`, 'day');
}

/** Rattache un libelle reel a une categorie canonique via la configuration. */
export function normalizeCategory(value, categoryMap = {}) {
  const raw = String(value ?? '').trim();
  if (raw === '') throw new ValidationError('categorie manquante', 'category');

  const mapped = categoryMap[raw] ?? categoryMap[raw.toLowerCase()];
  if (mapped) {
    if (!CATEGORIES.includes(mapped)) {
      throw new ValidationError(`categoryMap renvoie une categorie inconnue : ${mapped}`, 'category');
    }
    return mapped;
  }
  if (CATEGORIES.includes(raw.toLowerCase())) return raw.toLowerCase();

  // Pas de correspondance : la ligne part dans `other` plutot que d'etre
  // perdue, et le rapport d'import signale le libelle non rattache.
  return 'other';
}

/**
 * @param {Record<string, unknown>[]} rawRows
 * @param {{mapping?: MappingConfig, recordingLevel: 'E0'|'E1', source: string}} options
 * @returns {{records: import('./model.js').ActivityRecord[], rejected: {line: number, reason: string}[], unmappedCategories: string[]}}
 */
export function normalize(rawRows, { mapping = DEFAULT_MAPPING, recordingLevel, source }) {
  const config = { ...DEFAULT_MAPPING, ...mapping, columns: { ...DEFAULT_MAPPING.columns, ...mapping.columns } };
  const records = [];
  const rejected = [];
  const unmapped = new Set();

  rawRows.forEach((row, index) => {
    const line = index + 2; // +1 pour l'en-tete, +1 pour compter a partir de 1
    try {
      const rawCategory = String(row[config.columns.category] ?? '').trim();
      const category = normalizeCategory(rawCategory, config.categoryMap);
      if (category === 'other' && rawCategory !== '' && rawCategory.toLowerCase() !== 'other') {
        unmapped.add(rawCategory);
      }

      const candidate = {
        day: normalizeDay(String(row[config.columns.day] ?? ''), config.dateFormat),
        category,
        quantity: row[config.columns.quantity],
        unit: config.columns.unit && row[config.columns.unit]
          ? String(row[config.columns.unit]).trim().toLowerCase()
          : config.defaultUnit,
        amount: config.columns.amount ? row[config.columns.amount] : null,
      };

      records.push(toActivityRecord(candidate, { recordingLevel, source }));
    } catch (err) {
      rejected.push({ line, reason: err instanceof ValidationError ? err.message : 'ligne illisible' });
    }
  });

  return { records, rejected, unmappedCategories: [...unmapped].slice(0, 50) };
}
