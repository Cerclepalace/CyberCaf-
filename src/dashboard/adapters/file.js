import { parseCsv } from '../csv.js';
import { asArray, asPlainObject, ValidationError } from '../../core/validate.js';

const MAX_JSON_BYTES = 5 * 1024 * 1024;

/**
 * Import CSV.
 *
 * Le contenu vient de l'exterieur : fichier depose par le proprietaire, export
 * d'un logiciel tiers. Il est traite comme non fiable de bout en bout.
 */
export const csvAdapter = {
  name: 'csv',
  label: 'Fichier CSV',
  status: 'available',
  description: 'Import manuel. Le separateur est detecte automatiquement.',

  async read({ content, delimiter } = {}) {
    if (typeof content !== 'string') throw new ValidationError('contenu CSV manquant', 'content');
    const { rows } = parseCsv(content, { delimiter });
    return rows;
  },
};

/** Import JSON : une liste plate d'objets, rien d'autre. */
export const jsonAdapter = {
  name: 'json',
  label: 'Fichier JSON',
  status: 'available',
  description: 'Import manuel. Attend une liste d objets plats.',

  async read({ content } = {}) {
    if (typeof content !== 'string') throw new ValidationError('contenu JSON manquant', 'content');
    if (Buffer.byteLength(content, 'utf8') > MAX_JSON_BYTES) {
      throw new ValidationError(`fichier trop volumineux (max ${MAX_JSON_BYTES} octets)`, 'content');
    }
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      throw new ValidationError(`JSON illisible : ${err.message}`, 'content');
    }
    const list = asArray(Array.isArray(parsed) ? parsed : parsed.rows, 'rows', { max: 50000 });
    return list.map((row, index) => asPlainObject(row, `rows[${index}]`));
  },
};
