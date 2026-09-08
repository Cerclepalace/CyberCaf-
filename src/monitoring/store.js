import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { toMonitoringEvent } from './event.js';
import { logger } from '../core/logger.js';

/**
 * Historique des evenements.
 *
 * Un fichier JSON local, borne en nombre d'entrees. Pas de base de donnees :
 * rien ne justifie d'en installer une pour quelques milliers de lignes sur une
 * machine unique, et une base est une piece de plus a sauvegarder, mettre a
 * jour et reparer.
 *
 * Ecriture par fichier temporaire puis renommage, pour qu'une coupure de
 * courant ne laisse pas un fichier tronque. Un cybercafe n'a pas d'onduleur.
 */
export class EventStore {
  constructor({ dataDir = 'data', fileName = 'events.json', maxEvents = 5000 } = {}) {
    this.dir = resolve(dataDir);
    this.path = join(this.dir, fileName);
    this.maxEvents = maxEvents;
    this.events = [];
    this.loaded = false;
  }

  load() {
    if (this.loaded) return this;
    if (existsSync(this.path)) {
      try {
        const parsed = JSON.parse(readFileSync(this.path, 'utf8'));
        const list = Array.isArray(parsed) ? parsed : [];
        this.events = [];
        for (const raw of list) {
          try {
            this.events.push(toMonitoringEvent(raw));
          } catch (err) {
            // Un fichier abime ne doit pas empecher le demarrage : on ecarte la
            // ligne et on le signale.
            logger.warn('Evenement stocke illisible, ignore', { reason: err.message });
          }
        }
      } catch (err) {
        logger.error('Historique illisible, redemarrage sur un historique vide', { reason: err.message });
        this.events = [];
      }
    }
    this.loaded = true;
    return this;
  }

  /** @param {unknown} raw */
  append(raw) {
    this.load();
    const event = toMonitoringEvent(raw);
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    this.persist();
    return event;
  }

  list({ limit = 200 } = {}) {
    this.load();
    return [...this.events].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
  }

  setStatus(id, status) {
    this.load();
    const event = this.events.find((candidate) => candidate.id === id);
    if (!event) return null;
    const updated = toMonitoringEvent({ ...event, status });
    Object.assign(event, updated);
    this.persist();
    return event;
  }

  persist() {
    mkdirSync(this.dir, { recursive: true });
    const tmp = `${this.path}.tmp`;
    writeFileSync(tmp, JSON.stringify(this.events, null, 2), 'utf8');
    renameSync(tmp, this.path);
  }
}
