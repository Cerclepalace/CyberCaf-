import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { logger } from '../core/logger.js';

/**
 * Magasin de demandes.
 *
 * Fichier JSON local, ecriture par fichier temporaire puis renommage.
 *
 * Ce fichier contient des donnees personnelles : nom et moyen de contact des
 * clients. Il ne quitte pas la machine. Aucune synchronisation, aucun envoi,
 * aucune sauvegarde automatique vers l'exterieur.
 *
 * INCONNU : la duree de conservation n'est pas definie. Aucune purge
 * automatique n'est implementee, car choisir une duree reviendrait a inventer
 * une regle qui n'a pas ete decidee. A trancher avant toute utilisation reelle.
 */
export class RequestStore {
  constructor({ dataDir = 'data', fileName = 'requests.json', maxRequests = 5000 } = {}) {
    this.dir = resolve(dataDir);
    this.path = join(this.dir, fileName);
    this.maxRequests = maxRequests;
    this.requests = [];
    this.loaded = false;
  }

  load() {
    if (this.loaded) return this;
    if (existsSync(this.path)) {
      try {
        const parsed = JSON.parse(readFileSync(this.path, 'utf8'));
        this.requests = Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        logger.error('Demandes illisibles, redemarrage a vide', { reason: err.message });
        this.requests = [];
      }
    }
    this.loaded = true;
    return this;
  }

  has(reference) {
    this.load();
    return this.requests.some((request) => request.reference === reference);
  }

  append(request) {
    this.load();
    this.requests.push(request);
    if (this.requests.length > this.maxRequests) {
      this.requests = this.requests.slice(-this.maxRequests);
    }
    this.persist();
    return request;
  }

  find(reference) {
    this.load();
    return this.requests.find((request) => request.reference === reference) || null;
  }

  count() {
    this.load();
    return this.requests.length;
  }

  persist() {
    mkdirSync(this.dir, { recursive: true });
    const tmp = `${this.path}.tmp`;
    writeFileSync(tmp, JSON.stringify(this.requests, null, 2), 'utf8');
    renameSync(tmp, this.path);
  }
}
