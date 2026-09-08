import { sampleAdapter } from './sample.js';
import { csvAdapter, jsonAdapter } from './file.js';
import { apiAdapter, posAdapter } from './pending.js';

/**
 * Registre des adaptateurs de source de donnees.
 *
 * Un adaptateur transforme une source quelconque en lignes brutes. Il ne
 * connait ni le modele canonique, ni les indicateurs : c'est le normaliseur
 * qui fait la conversion, et le moteur d'indicateurs qui calcule.
 *
 *   SOURCE -> ADAPTATEUR -> NORMALISEUR -> MODELE -> INDICATEURS -> INTERFACE
 *
 * Chaque etage est remplacable sans toucher aux autres. C'est la seule raison
 * pour laquelle ce socle peut etre ecrit avant de connaitre la caisse reelle.
 */
export const adapters = {
  sample: sampleAdapter,
  csv: csvAdapter,
  json: jsonAdapter,
  api: apiAdapter,
  pos: posAdapter,
};

export function getAdapter(name) {
  const adapter = adapters[name];
  if (!adapter) {
    throw new Error(`adaptateur inconnu : ${name}. Disponibles : ${Object.keys(adapters).join(', ')}`);
  }
  return adapter;
}

export function listAdapters() {
  return Object.values(adapters).map(({ name, label, status, description }) => ({
    name, label, status, description,
  }));
}
