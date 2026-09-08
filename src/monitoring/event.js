import { asEnum, asId, asIsoTimestamp, asString, ValidationError } from '../core/validate.js';

/**
 * Modele d'evenement de supervision.
 *
 * Ce module ne detecte rien. Il ne fait que recevoir, valider et decrire des
 * evenements produits par d'autres outils. Aucune regle de ce fichier ne
 * conclut a une attaque, et aucune ne le pourra : les sources de donnees
 * necessaires n'existent pas dans un petit etablissement, et un systeme qui
 * pretend le contraire ment a son proprietaire.
 */

/** Gravite : ce que ca coute si c'est vrai. */
export const SEVERITIES = ['info', 'low', 'medium', 'high'];
export const SEVERITY_RANK = { info: 0, low: 1, medium: 2, high: 3 };
export const SEVERITY_LABELS = {
  info: 'Information',
  low: 'Mineur',
  medium: 'A regarder',
  high: 'Urgent',
};

/**
 * Confiance : a quel point la source permet d'affirmer l'evenement.
 * Deliberement separee de la gravite. Une panne certaine et un soupcon vague
 * ne se traitent pas de la meme facon, et les confondre est la premiere cause
 * de faux positifs ignores.
 */
export const CONFIDENCES = ['low', 'medium', 'high'];
export const CONFIDENCE_LABELS = {
  low: 'Incertain',
  medium: 'Probable',
  high: 'Certain',
};

export const STATUSES = ['open', 'acknowledged', 'resolved'];
export const STATUS_LABELS = {
  open: 'A traiter',
  acknowledged: 'Vu',
  resolved: 'Regle',
};

/**
 * Natures d'evenement.
 *
 * `security_incident` designe un fait rapporte par un outil de securite
 * existant, par exemple une mise en quarantaine. Il ne signifie pas qu'une
 * attaque a eu lieu.
 *
 * Il n'existe volontairement aucune nature « attaque confirmee » : le socle
 * n'a aucun moyen de l'etablir, donc il n'offre pas de case pour l'afficher.
 */
export const EVENT_KINDS = ['failure', 'misconfiguration', 'unusual_behaviour', 'security_incident', 'information'];
export const EVENT_KIND_LABELS = {
  failure: 'Panne',
  misconfiguration: 'Probleme de configuration',
  unusual_behaviour: 'Comportement inhabituel',
  security_incident: 'Signalement d un outil de securite',
  information: 'Information',
};

/**
 * @typedef {object} MonitoringEvent
 * @property {string} id
 * @property {string} source      Outil qui a produit l'evenement
 * @property {string} device      Equipement concerne
 * @property {string} eventType   Identifiant technique, ex. `printer.offline`
 * @property {string} kind
 * @property {string} severity
 * @property {string} confidence
 * @property {string} timestamp
 * @property {string} message     Texte lisible par le proprietaire
 * @property {string} status
 * @property {string|null} advice Action recommandee, si connue
 */

let counter = 0;

function nextId(timestamp) {
  counter += 1;
  return `evt-${timestamp.replace(/[:.]/g, '')}-${counter.toString(36)}`;
}

/**
 * Valide un evenement recu. L'entree est non fiable : elle peut venir du
 * reseau local, d'un script tiers ou d'un equipement mal configure.
 *
 * @param {unknown} raw
 * @returns {MonitoringEvent}
 */
export function toMonitoringEvent(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ValidationError('evenement invalide', 'event');
  }

  const timestamp = raw.timestamp ? asIsoTimestamp(raw.timestamp, 'timestamp') : new Date().toISOString();

  return {
    id: raw.id ? asId(raw.id, 'id', { max: 80 }) : nextId(timestamp),
    source: asId(raw.source, 'source', { max: 64 }),
    device: asId(raw.device, 'device', { max: 64 }),
    eventType: asId(raw.eventType, 'eventType', { max: 64 }),
    kind: asEnum(raw.kind ?? 'information', 'kind', EVENT_KINDS),
    severity: asEnum(raw.severity ?? 'info', 'severity', SEVERITIES),
    confidence: asEnum(raw.confidence ?? 'medium', 'confidence', CONFIDENCES),
    timestamp,
    message: asString(raw.message, 'message', { max: 500 }),
    status: asEnum(raw.status ?? 'open', 'status', STATUSES),
    advice: raw.advice ? asString(raw.advice, 'advice', { max: 300 }) : null,
  };
}

export function severityAtLeast(severity, minimum) {
  return SEVERITY_RANK[severity] >= SEVERITY_RANK[minimum];
}
