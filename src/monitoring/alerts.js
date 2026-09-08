import { severityAtLeast, SEVERITIES, CONFIDENCES } from './event.js';

/**
 * Moteur d'alertes.
 *
 * Les regles sont declaratives et viennent de la configuration. Le code
 * n'invente aucun seuil : il applique ceux qu'on lui donne. Une regle ne peut
 * que selectionner des evenements deja recus ; elle ne peut rien deduire.
 *
 * Toute alerte porte sa gravite ET sa confiance. Une alerte sans niveau de
 * confiance est ignoree apres deux faux positifs, et c'est le taux de faux
 * positifs, pas la couverture, qui decide si un systeme de supervision est
 * utilise ou coupe.
 */

/**
 * @typedef {object} AlertRule
 * @property {string} id
 * @property {string} label
 * @property {{eventType?: string, source?: string, device?: string,
 *             minSeverity?: string, minConfidence?: string,
 *             minOccurrences?: number}} when
 * @property {string} [advice]
 */

const CONFIDENCE_RANK = { low: 0, medium: 1, high: 2 };

/** Valide une regle. Une regle mal ecrite est ignoree, jamais devinee. */
export function validateRule(rule) {
  if (!rule || typeof rule !== 'object') return { valid: false, reason: 'regle non objet' };
  if (typeof rule.id !== 'string' || rule.id === '') return { valid: false, reason: 'id manquant' };
  if (!rule.when || typeof rule.when !== 'object') return { valid: false, reason: 'clause when manquante' };
  if (rule.when.minSeverity && !SEVERITIES.includes(rule.when.minSeverity)) {
    return { valid: false, reason: `minSeverity inconnue : ${rule.when.minSeverity}` };
  }
  if (rule.when.minConfidence && !CONFIDENCES.includes(rule.when.minConfidence)) {
    return { valid: false, reason: `minConfidence inconnue : ${rule.when.minConfidence}` };
  }
  return { valid: true };
}

function matches(group, when) {
  if (when.eventType && group.eventType !== when.eventType) return false;
  if (when.source && group.source !== when.source) return false;
  if (when.device && group.device !== when.device) return false;
  if (when.minSeverity && !severityAtLeast(group.severity, when.minSeverity)) return false;
  if (when.minConfidence && CONFIDENCE_RANK[group.confidence] < CONFIDENCE_RANK[when.minConfidence]) return false;
  if (when.minOccurrences && group.occurrences < when.minOccurrences) return false;
  return true;
}

/**
 * @param {ReturnType<import('./aggregator.js').aggregate>} groups
 * @param {AlertRule[]} rules
 */
export function evaluate(groups, rules = []) {
  const alerts = [];
  const invalidRules = [];

  for (const rule of rules) {
    const check = validateRule(rule);
    if (!check.valid) {
      invalidRules.push({ rule: rule && rule.id ? rule.id : '(sans id)', reason: check.reason });
      continue;
    }
    for (const group of groups) {
      if (!matches(group, rule.when)) continue;
      alerts.push({
        ruleId: rule.id,
        label: rule.label || rule.id,
        device: group.device,
        source: group.source,
        eventType: group.eventType,
        kind: group.kind,
        severity: group.severity,
        confidence: group.confidence,
        occurrences: group.occurrences,
        firstSeen: group.firstSeen,
        lastSeen: group.lastSeen,
        message: group.message,
        advice: rule.advice || group.advice || null,
      });
    }
  }

  return { alerts, invalidRules };
}
