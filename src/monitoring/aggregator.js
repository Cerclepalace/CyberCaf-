import { SEVERITY_RANK } from './event.js';

/**
 * Agregation d'evenements.
 *
 * Regroupe les evenements identiques pour qu'une imprimante qui signale son
 * indisponibilite quarante fois en une heure produise une ligne, pas quarante.
 *
 * C'est du regroupement, pas de la correlation, et encore moins de la
 * detection : aucune conclusion nouvelle n'est produite ici. La sortie ne
 * contient que ce que les evenements d'entree contenaient deja.
 */

/** Cle de regroupement : meme source, meme equipement, meme nature d'evenement. */
export function groupKey(event) {
  return `${event.source}|${event.device}|${event.eventType}`;
}

/**
 * @param {import('./event.js').MonitoringEvent[]} events
 * @param {{windowMinutes?: number, now?: string}} [options]
 */
export function aggregate(events, { windowMinutes = 60, now = new Date().toISOString() } = {}) {
  const cutoff = Date.parse(now) - windowMinutes * 60000;
  const groups = new Map();

  for (const event of events) {
    if (Date.parse(event.timestamp) < cutoff) continue;

    const key = groupKey(event);
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, {
        key,
        source: event.source,
        device: event.device,
        eventType: event.eventType,
        kind: event.kind,
        severity: event.severity,
        confidence: event.confidence,
        occurrences: 1,
        firstSeen: event.timestamp,
        lastSeen: event.timestamp,
        message: event.message,
        advice: event.advice,
        statuses: { [event.status]: 1 },
      });
      continue;
    }

    existing.occurrences += 1;
    if (event.timestamp < existing.firstSeen) existing.firstSeen = event.timestamp;
    if (event.timestamp > existing.lastSeen) {
      existing.lastSeen = event.timestamp;
      // Le message affiche est celui de l'evenement le plus recent : c'est
      // l'etat courant qui interesse le proprietaire, pas le premier symptome.
      existing.message = event.message;
      existing.advice = event.advice;
    }
    if (SEVERITY_RANK[event.severity] > SEVERITY_RANK[existing.severity]) {
      existing.severity = event.severity;
    }
    existing.statuses[event.status] = (existing.statuses[event.status] || 0) + 1;
  }

  return [...groups.values()].sort((a, b) => {
    const bySeverity = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    if (bySeverity !== 0) return bySeverity;
    return b.lastSeen.localeCompare(a.lastSeen);
  });
}
