import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { logger } from '../core/logger.js';

/**
 * Stockage des enregistrements d'activite.
 *
 * Fichier JSON local, ecrit par fichier temporaire puis renomme. Meme raison
 * que pour les evenements : une machine de cybercafe s'eteint brutalement.
 *
 * Les enregistrements sont deja valides quand ils arrivent ici : ce module ne
 * fait que ranger.
 */
export class ActivityStore {
  constructor({ dataDir = 'data', fileName = 'activity.json' } = {}) {
    this.dir = resolve(dataDir);
    this.path = join(this.dir, fileName);
    this.records = [];
    this.lastImport = null;
    this.loaded = false;
  }

  load() {
    if (this.loaded) return this;
    if (existsSync(this.path)) {
      try {
        const parsed = JSON.parse(readFileSync(this.path, 'utf8'));
        this.records = Array.isArray(parsed.records) ? parsed.records : [];
        this.lastImport = parsed.lastImport || null;
      } catch (err) {
        logger.error('Donnees d activite illisibles, redemarrage a vide', { reason: err.message });
        this.records = [];
      }
    }
    this.loaded = true;
    return this;
  }

  /** Remplace le contenu. Un import remplace, il n'accumule pas de doublons. */
  replace(records, importSummary) {
    this.load();
    this.records = records;
    this.lastImport = importSummary;
    this.persist();
    return this.records.length;
  }

  list() {
    this.load();
    return this.records;
  }

  summary() {
    this.load();
    return this.lastImport;
  }

  persist() {
    mkdirSync(this.dir, { recursive: true });
    const tmp = `${this.path}.tmp`;
    writeFileSync(tmp, JSON.stringify({ records: this.records, lastImport: this.lastImport }, null, 2), 'utf8');
    renameSync(tmp, this.path);
  }
}
