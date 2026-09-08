import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toMonitoringEvent, EVENT_KINDS, SEVERITIES } from '../src/monitoring/event.js';
import { aggregate } from '../src/monitoring/aggregator.js';
import { evaluate, validateRule } from '../src/monitoring/alerts.js';
import { ValidationError } from '../src/core/validate.js';

const base = {
  source: 'ping-local',
  device: 'poste-04',
  eventType: 'device.unreachable',
  kind: 'failure',
  severity: 'medium',
  confidence: 'high',
  message: 'Le poste 4 ne repond plus',
};

test('le modele ne propose aucune nature « attaque confirmee »', () => {
  assert.ok(!EVENT_KINDS.includes('attack'));
  assert.ok(!EVENT_KINDS.includes('attack_confirmed'));
  assert.ok(!SEVERITIES.includes('critical_attack'));
  assert.throws(() => toMonitoringEvent({ ...base, kind: 'attack_confirmed' }), ValidationError);
});

test('un evenement valide est normalise', () => {
  const event = toMonitoringEvent({ ...base, timestamp: '2026-09-08T10:00:00+02:00' });
  assert.equal(event.timestamp, '2026-09-08T08:00:00.000Z');
  assert.equal(event.status, 'open');
  assert.ok(event.id.startsWith('evt-'));
});

test('un evenement sans message est refuse', () => {
  assert.throws(() => toMonitoringEvent({ ...base, message: '' }), ValidationError);
});

test('un identifiant d equipement fantaisiste est refuse', () => {
  assert.throws(() => toMonitoringEvent({ ...base, device: '../../etc/passwd' }), ValidationError);
});

test('l agregation regroupe et garde la gravite la plus elevee', () => {
  const now = '2026-09-08T12:00:00.000Z';
  const events = [
    toMonitoringEvent({ ...base, timestamp: '2026-09-08T11:00:00Z', severity: 'low' }),
    toMonitoringEvent({ ...base, timestamp: '2026-09-08T11:30:00Z', severity: 'high', message: 'Toujours injoignable' }),
    toMonitoringEvent({ ...base, device: 'poste-05', timestamp: '2026-09-08T11:40:00Z' }),
  ];
  const groups = aggregate(events, { windowMinutes: 120, now });
  assert.equal(groups.length, 2);
  const poste4 = groups.find((group) => group.device === 'poste-04');
  assert.equal(poste4.occurrences, 2);
  assert.equal(poste4.severity, 'high');
  assert.equal(poste4.message, 'Toujours injoignable', 'le message affiche est le plus recent');
});

test('l agregation ignore ce qui est hors fenetre', () => {
  const now = '2026-09-08T12:00:00.000Z';
  const events = [toMonitoringEvent({ ...base, timestamp: '2026-09-08T09:00:00Z' })];
  assert.equal(aggregate(events, { windowMinutes: 60, now }).length, 0);
  assert.equal(aggregate(events, { windowMinutes: 240, now }).length, 1);
});

test('une regle invalide est ignoree et signalee, jamais devinee', () => {
  assert.equal(validateRule({ id: 'x', when: { minSeverity: 'enorme' } }).valid, false);
  const { alerts, invalidRules } = evaluate([], [{ id: 'x', when: { minSeverity: 'enorme' } }]);
  assert.equal(alerts.length, 0);
  assert.equal(invalidRules.length, 1);
});

test('une alerte porte sa gravite et sa confiance', () => {
  const now = '2026-09-08T12:00:00.000Z';
  const events = [toMonitoringEvent({ ...base, timestamp: '2026-09-08T11:50:00Z' })];
  const groups = aggregate(events, { windowMinutes: 60, now });
  const { alerts } = evaluate(groups, [{
    id: 'device-unreachable',
    label: 'Poste injoignable',
    when: { eventType: 'device.unreachable', minSeverity: 'medium' },
    advice: 'Verifier le cable reseau.',
  }]);
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].severity, 'medium');
  assert.equal(alerts[0].confidence, 'high');
  assert.equal(alerts[0].advice, 'Verifier le cable reseau.');
});

test('une regle plus exigeante que les faits ne declenche pas', () => {
  const now = '2026-09-08T12:00:00.000Z';
  const events = [toMonitoringEvent({ ...base, severity: 'low', timestamp: '2026-09-08T11:50:00Z' })];
  const groups = aggregate(events, { windowMinutes: 60, now });
  const { alerts } = evaluate(groups, [{ id: 'r', when: { minSeverity: 'high' } }]);
  assert.equal(alerts.length, 0);
});
